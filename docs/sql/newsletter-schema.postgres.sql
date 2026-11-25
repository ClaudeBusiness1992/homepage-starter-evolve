-- Newsletter-Schema (PostgreSQL, je Kundendatenbank bzw. je Kundenschema)
-- Stand 25.11.2026. Entwurf, NICHT ausführen ohne Freigabe.
-- Eine Ablage je Kunde; keine kundenübergreifenden Tabellen.
-- Rollen: customer_migrator (Schema + Jobs), customer_app (Laufzeit, Mindestrechte).
-- PRÜFEN markiert Annahmen vor der Umsetzung.

-- Erweiterungen (fällt eine weg, uuid-Erzeugung in der Anwendung leisten).
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 1. Einwilligungstexte (Versionen, nur Anfügungen)
-- =====================================================================
CREATE TABLE IF NOT EXISTS consent_texts (
  version    TEXT PRIMARY KEY,          -- z. B. 'v1'
  text       TEXT NOT NULL,             -- vollständiger Wortlaut
  valid_from TIMESTAMPTZ NOT NULL      -- ab wann diese Fassung gilt
);

-- =====================================================================
-- 2. Abonnenten
-- =====================================================================
CREATE TABLE IF NOT EXISTS subscribers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT NOT NULL,                       -- Klartext, Versand
  email_hash       TEXT NOT NULL UNIQUE,                -- SHA-256(lower(trim(email)))
  first_name       TEXT NOT NULL DEFAULT '',
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','unsubscribed','blocked')),
  consent_version  TEXT NOT NULL REFERENCES consent_texts(version),
  source           TEXT NOT NULL,                       -- Seite + Abschnitt
  origin_trunc     TEXT,                                -- gekürzt, z. B. 203.0.113.xxx
  subscribed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at     TIMESTAMPTZ,
  unsubscribed_at  TIMESTAMPTZ,
  blocked_reason   TEXT CHECK (blocked_reason IN ('hard_bounce','complaint','manual')),
  blocked_at       TIMESTAMPTZ,
  CONSTRAINT chk_confirmed_at CHECK (
    (status = 'confirmed' AND confirmed_at IS NOT NULL)
    OR (status <> 'confirmed')
  ),
  CONSTRAINT chk_unsubscribed_at CHECK (
    (status IN ('unsubscribed','blocked') AND unsubscribed_at IS NOT NULL)
    OR (status IN ('pending','confirmed'))
  ),
  CONSTRAINT chk_blocked_cols CHECK (
    (status = 'blocked' AND blocked_reason IS NOT NULL AND blocked_at IS NOT NULL)
    OR (status <> 'blocked' AND blocked_reason IS NULL AND blocked_at IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_subscribers_email_norm
  ON subscribers (email_hash);
CREATE INDEX IF NOT EXISTS ix_subscribers_status
  ON subscribers (status);
CREATE INDEX IF NOT EXISTS ix_subscribers_subscribed_at
  ON subscribers (subscribed_at);

-- =====================================================================
-- 3. Bestätigungs- und Abmelde-Tokens (nur Hashes, Einmalwerte)
-- =====================================================================
CREATE TABLE IF NOT EXISTS subscriber_tokens (
  token_hash    TEXT PRIMARY KEY,                    -- SHA-256 des Einmalwerts
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  purpose       TEXT NOT NULL CHECK (purpose IN ('confirm','unsubscribe')),
  expires_at    TIMESTAMPTZ NOT NULL,                -- confirm: +24h; unsubscribe: PRÜFEN
  used_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_tokens_subscriber
  ON subscriber_tokens (subscriber_id, purpose);
CREATE INDEX IF NOT EXISTS ix_tokens_expires
  ON subscriber_tokens (expires_at);

-- =====================================================================
-- 4. Sperrliste (Prüfwerte, kein Klartext nötig)
-- =====================================================================
CREATE TABLE IF NOT EXISTS suppression_list (
  email_hash TEXT PRIMARY KEY,                       -- wie subscribers.email_hash
  reason     TEXT NOT NULL
             CHECK (reason IN ('unsubscribed','hard_bounce','complaint','manual')),
  source     TEXT NOT NULL,                           -- z. B. 'unsubscribe-link'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 5. Kampagnen (feste Kennung = Doppelversand-Schutz)
-- =====================================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id                    TEXT PRIMARY KEY,            -- z. B. 'K-2026-11-001'
  resend_idempotency_key TEXT UNIQUE,                -- PRÜFEN: Broadcast-API
  subject               TEXT NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 90),
  preview_text          TEXT CHECK (preview_text IS NULL OR char_length(preview_text) <= 120),
  heading               TEXT NOT NULL CHECK (char_length(heading) BETWEEN 1 AND 80),
  body_text             TEXT NOT NULL CHECK (char_length(body_text) >= 1),
  image_ref             TEXT,                        -- Verweis Medienablage des Kunden
  image_alt             TEXT CHECK (image_alt IS NULL OR char_length(image_alt) <= 120),
  button_label          TEXT CHECK (button_label IS NULL OR char_length(button_label) <= 30),
  button_url            TEXT CHECK (button_url IS NULL OR button_url LIKE 'https://%'),
  sender_name           TEXT NOT NULL,
  sender_email          TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','sending','finished','cancelled')),
  recipient_count       INTEGER NOT NULL DEFAULT 0 CHECK (recipient_count >= 0),
  recipient_checksum    TEXT,                        -- SHA-256 über sortierte email_hash-Werte
  scheduled_at          TIMESTAMPTZ,
  send_requested_at     TIMESTAMPTZ,
  sent_at               TIMESTAMPTZ,
  monthly_quota_snapshot INTEGER,                    -- Tarifgrenze zum Versandzeitpunkt
  monthly_used_snapshot  INTEGER,                    -- Nutzung zum Versandzeitpunkt
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_button_pair CHECK (
    (button_label IS NULL AND button_url IS NULL)
    OR (button_label IS NOT NULL AND button_url IS NOT NULL)
  ),
  CONSTRAINT chk_image_alt CHECK (
    image_ref IS NULL OR (image_alt IS NOT NULL AND char_length(image_alt) >= 1)
  ),
  CONSTRAINT chk_recipient_proof CHECK (
    status IN ('draft','scheduled','cancelled')
    OR (recipient_checksum IS NOT NULL AND recipient_count > 0)
  )
);

CREATE INDEX IF NOT EXISTS ix_campaigns_status
  ON campaigns (status);

-- =====================================================================
-- 6. Zustellereignisse
-- =====================================================================
CREATE TABLE IF NOT EXISTS delivery_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       TEXT NOT NULL REFERENCES campaigns(id),
  email_hash        TEXT NOT NULL,                   -- ohne Klartext
  event             TEXT NOT NULL
                    CHECK (event IN ('sent','delivered','bounced_hard','bounced_soft',
                                    'complained','opened')),
  provider_event_id TEXT,
  occurred_at       TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ux_delivery_provider UNIQUE (campaign_id, provider_event_id)
);

CREATE INDEX IF NOT EXISTS ix_delivery_campaign
  ON delivery_events (campaign_id);
CREATE INDEX IF NOT EXISTS ix_delivery_hash
  ON delivery_events (email_hash);

-- =====================================================================
-- 7. Webhook-Eingang (Idempotenz über Anbieterkennung)
-- =====================================================================
CREATE TABLE IF NOT EXISTS webhook_events (
  provider_event_id TEXT PRIMARY KEY,                -- Anbieterkennung
  event_type        TEXT NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at      TIMESTAMPTZ,
  payload_hash      TEXT NOT NULL,                   -- SHA-256 der Rohdaten
  signature_ok      BOOLEAN NOT NULL
);

-- =====================================================================
-- 8. Versandgrenzen je Kunde und Stopp-Schalter (genau eine Zeile)
-- =====================================================================
CREATE TABLE IF NOT EXISTS sending_policy (
  singleton       BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton IS TRUE),
  monthly_quota   INTEGER NOT NULL CHECK (monthly_quota > 0),
  used_this_month INTEGER NOT NULL DEFAULT 0 CHECK (used_this_month >= 0),
  period_start    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sending_paused  BOOLEAN NOT NULL DEFAULT FALSE,    -- Stopp-Schalter, wirkt sofort
  pause_reason    TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      TEXT NOT NULL DEFAULT 'system'
);

INSERT INTO sending_policy (monthly_quota, used_this_month)
  VALUES (500, 0)
  ON CONFLICT DO NOTHING;
-- Hinweis: 500 ist ein Platzhalter aus dem Prototyp; je Kunde vereinbaren.

-- =====================================================================
-- 9. Protokoll (nur Anfügungen aus Anwendungssicht)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor       TEXT NOT NULL
              CHECK (actor IN ('visitor','subscriber','customer','webhook','system')),
  action      TEXT NOT NULL,                         -- z. B. 'subscribe','confirm',
                                                     -- 'unsubscribe','block','export',
                                                     -- 'campaign.send','sending.pause'
  email_hash  TEXT,                                  -- Bezug ohne Klartext
  campaign_id TEXT REFERENCES campaigns(id),
  detail      JSONB NOT NULL DEFAULT '{}'::jsonb     -- keine Adressen, keine Geheimnisse
);

CREATE INDEX IF NOT EXISTS ix_audit_occurred
  ON audit_log (occurred_at);
CREATE INDEX IF NOT EXISTS ix_audit_action
  ON audit_log (action);

-- =====================================================================
-- 10. Aufbewahrung / Löschjobs (Tages-Cron als customer_migrator;
--     Fristen erst nach fachkundiger Klärung scharf schalten)
-- =====================================================================

-- Job A (Vorschlag 7 Tage): unbestätigte Anmeldungen löschen (Tokens kaskadieren).
-- DELETE FROM subscribers
--  WHERE status = 'pending' AND subscribed_at < now() - INTERVAL '7 days';

-- Job B (Vorschlag 30 Tage nach Verbrauch/Ablauf): alte Tokenzeilen löschen.
-- DELETE FROM subscriber_tokens
--  WHERE COALESCE(used_at, expires_at) < now() - INTERVAL '30 days';

-- Job C (Vorschlag 90 Tage): Webhook-Hashes altern lassen, Typzähler bleiben in audit_log.
-- DELETE FROM webhook_events
--  WHERE received_at < now() - INTERVAL '90 days';

-- Job D (PRÜFEN, Vorschlag 12 Monate): alte Zustellereignisse aggregieren, Rohzeilen löschen.
-- DELETE FROM delivery_events
--  WHERE occurred_at < now() - INTERVAL '12 months';

-- Sperrliste, Abmeldenachweise und audit_log: KEIN automatischer Löschjob
-- (gesetzliche Nachweispflicht und Sperrerfordernis, PRÜFEN).

-- =====================================================================
-- 11. Übernahme der heutigen SQLite-Tabelle newsletter_subscribers
--     (Werkzeugleistung außerhalb der DB; kein Versand durch Import)
-- =====================================================================
-- id                -> subscribers.id (oder neue UUID mit Zuordnungstabelle)
-- email             -> subscribers.email; email_hash = SHA-256(lower(trim(email)))
-- first_name        -> subscribers.first_name
-- status            -> subscribers.status ('pending'|'confirmed'|'unsubscribed')
-- doi_token_hash    -> subscriber_tokens(purpose='confirm', expires_at = Import + 24h)
--                     PRÜFEN: sicherer ist Rotation (alle offenen Tokens neu ausstellen)
-- unsubscribe_token_hash -> subscriber_tokens(purpose='unsubscribe', expires_at = Import + 12 Monate)
-- consent_version   -> subscribers.consent_version (Fassung 'v1' vorher in consent_texts anlegen)
-- created_at        -> subscribers.subscribed_at (Format und Zeitzone je Installation prüfen)
-- confirmed_at      -> subscribers.confirmed_at
-- unsubscribed_at   -> subscribers.unsubscribed_at
-- (kein Bestand)    -> subscribers.source = 'migration: unbekannt', origin_trunc = NULL
-- abgemeldete Zeilen zusätzlich -> suppression_list(reason='unsubscribed', source='migration')
-- admin_sessions, login_attempts: NICHT übernehmen (Neuanmeldung vorsehen).

-- =====================================================================
-- 12. Rechte: Mindestrechte der Laufzeitrolle je Kunde
-- =====================================================================
-- Ausführung als Eigentümer (customer_migrator) nach der Migration.

-- REVOKE ALL ON ALL TABLES IN SCHEMA public FROM customer_app;
-- GRANT CONNECT ON DATABASE :"customer_db" TO customer_app;
-- GRANT USAGE ON SCHEMA public TO customer_app;
--
-- GRANT SELECT ON consent_texts TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON subscribers TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON subscriber_tokens TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON suppression_list TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON campaigns TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON delivery_events TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON webhook_events TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON sending_policy TO customer_app;
-- GRANT INSERT, SELECT ON audit_log TO customer_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO customer_app;
--
-- Kein DELETE und keine DDL-Rechte für customer_app; Löschjobs laufen als
-- customer_migrator über den Tages-Cron. Vorschau erhält keinen Schlüssel.
