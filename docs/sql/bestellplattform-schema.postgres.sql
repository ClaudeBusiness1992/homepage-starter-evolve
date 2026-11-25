-- Bestellplattform-Schema (PostgreSQL, je Kundendatenbank bzw. je Kundenschema)
-- Stand 26.11.2026. Entwurf, NICHT ausführen ohne Freigabe.
-- Eine Ablage je Kunde; keine kundenübergreifenden Tabellen.
-- Rollen: customer_migrator (Schema + Jobs), customer_app (Laufzeit, Mindestrechte).
-- PRÜFEN markiert Annahmen vor der Umsetzung (u. a. Anmeldelösung noch offen).
-- Grundlage: docs/BESTELLPLATTFORM-ANFORDERUNGEN.md, docs/NEWSLETTER-SCHEMA.md (Stil).

-- Erweiterungen (fällt eine weg, uuid-Erzeugung in der Anwendung leisten).
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 1. Besteller (Konten je Kundendomäne)
-- =====================================================================
CREATE TABLE IF NOT EXISTS buyers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT NOT NULL,                       -- Klartext, Versand + Login
  email_hash       TEXT NOT NULL UNIQUE,                -- SHA-256(lower(trim(email)))
  display_name     TEXT NOT NULL DEFAULT '',           -- freiwillig, kein Pflichtprofil
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','blocked')),
  consent_version  TEXT NOT NULL,                       -- Einwilligungstext-Fassung bei Registrierung
  source           TEXT NOT NULL DEFAULT 'website: /registrieren',
  origin_trunc     TEXT,                                -- gekürzt, z. B. 203.0.113.xxx, niemals volle IP
  subscribed_at    TIMESTAMPTZ NOT NULL DEFAULT now(), -- Registrierung
  confirmed_at     TIMESTAMPTZ,                         -- E-Mail-Bestätigung
  blocked_reason   TEXT CHECK (blocked_reason IN ('abuse','manual')),
  blocked_at       TIMESTAMPTZ,
  approved_at      TIMESTAMPTZ,                         -- PRÜFEN: nur falls Kunde Freischaltung verlangt
  approved_by      TEXT,                                -- PRÜFEN: Kunden-Admin-Kennung
  CONSTRAINT chk_buyer_confirmed_at CHECK (
    (status = 'confirmed' AND confirmed_at IS NOT NULL)
    OR (status <> 'confirmed')
  ),
  CONSTRAINT chk_buyer_blocked_cols CHECK (
    (status = 'blocked' AND blocked_reason IS NOT NULL AND blocked_at IS NOT NULL)
    OR (status <> 'blocked' AND blocked_reason IS NULL AND blocked_at IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_buyers_email_hash
  ON buyers (email_hash);
CREATE INDEX IF NOT EXISTS ix_buyers_status
  ON buyers (status);

-- =====================================================================
-- 2. Bestätigungs- und Rücksetz-Tokens (nur Hashes, Einmalwerte)
-- =====================================================================
CREATE TABLE IF NOT EXISTS buyer_tokens (
  token_hash  TEXT PRIMARY KEY,                          -- SHA-256 des Einmalwerts
  buyer_id    UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  purpose     TEXT NOT NULL CHECK (purpose IN ('confirm','reset')),
  expires_at  TIMESTAMPTZ NOT NULL,                      -- confirm: +24h (PRÜFEN); reset: +1h (PRÜFEN)
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_buyer_tokens_buyer
  ON buyer_tokens (buyer_id, purpose);
CREATE INDEX IF NOT EXISTS ix_buyer_tokens_expires
  ON buyer_tokens (expires_at);

-- =====================================================================
-- 3. Sitzungen (PRÜFEN: nur falls die gewählte Anmeldelösung eigene
--    Sitzungen in dieser Ablage verlangt; sonst führt die Lösung sie)
-- =====================================================================
CREATE TABLE IF NOT EXISTS buyer_sessions (
  session_id  TEXT PRIMARY KEY,                          -- Zufallswert, nur Hash lagern (PRÜFEN)
  buyer_id    UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,                      -- Vorschlag 30 Tage, PRÜFEN
  revoked_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ix_buyer_sessions_buyer
  ON buyer_sessions (buyer_id);
CREATE INDEX IF NOT EXISTS ix_buyer_sessions_expires
  ON buyer_sessions (expires_at);

-- =====================================================================
-- 4. Produkte (Pflege durch Kunden-Admin oder Nick, siehe Abschnitt 10)
-- =====================================================================
CREATE TABLE IF NOT EXISTS products (
  id               TEXT PRIMARY KEY,                    -- feste Kennung, z. B. 'P-001'
  name             TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  description      TEXT NOT NULL DEFAULT '',
  price_hint       NUMERIC(10,2),                         -- ungefähre Angabe, PRÜFEN: NULL erlaubt falls Preis erst später
  currency         TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  unit             TEXT NOT NULL DEFAULT 'Stück',
  is_available     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_products_available
  ON products (is_available, sort_order);

-- =====================================================================
-- 5. Bestellungen (genau eine Zeile je Absenden, feste Kennung)
-- =====================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                    TEXT PRIMARY KEY,                -- feste Kennung, z. B. 'B-2026-11-0001'
  buyer_id              UUID REFERENCES buyers(id) ON DELETE SET NULL,
  buyer_email_hash      TEXT NOT NULL,                   -- Bezug auch nach Kontolöschung (Nachweis)
  idempotency_key       TEXT UNIQUE,                     -- Schutz vor Doppelabsenden
  status                TEXT NOT NULL DEFAULT 'received'
                        CHECK (status IN ('received','accepted','rejected','cancelled','completed')),
  price_hint_total      NUMERIC(10,2),                   -- Summe der Schätzungen, unverbindlich
  currency              TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  price_note            TEXT NOT NULL DEFAULT 'Unverbindliche Schätzung, kein Endpreis.',
  buyer_note            TEXT NOT NULL DEFAULT '',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_orders_buyer
  ON orders (buyer_id);
CREATE INDEX IF NOT EXISTS ix_orders_status
  ON orders (status);
CREATE INDEX IF NOT EXISTS ix_orders_created
  ON orders (created_at);

-- =====================================================================
-- 6. Bestellpositionen (mit Schnappschuss von Name und Preisstand)
-- =====================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name      TEXT NOT NULL,                       -- Schnappschuss zum Bestellzeitpunkt
  price_hint_each   NUMERIC(10,2),                       -- Schnappschuss, unverbindlich
  quantity          INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 999), -- PRÜFEN: Obergrenze
  price_hint_line   NUMERIC(10,2),                       -- quantity * price_hint_each (falls Preise gepflegt)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_order_items_order
  ON order_items (order_id);

-- =====================================================================
-- 7. Statusverlauf (jede Änderung protokolliert)
-- =====================================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT CHECK (from_status IS NULL OR from_status IN ('received','accepted','rejected','cancelled','completed')),
  to_status   TEXT NOT NULL CHECK (to_status IN ('received','accepted','rejected','cancelled','completed')),
  actor       TEXT NOT NULL CHECK (actor IN ('buyer','customer','system')),
  note        TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_status_history_order
  ON order_status_history (order_id, created_at);

-- =====================================================================
-- 8. Protokoll (nur Anfügungen aus Anwendungssicht)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor       TEXT NOT NULL
              CHECK (actor IN ('visitor','buyer','customer','system')),
  action      TEXT NOT NULL,                             -- z. B. 'register','confirm','login',
                                                         -- 'password.reset','order.submit','order.status',
                                                         -- 'export','account.delete'
  email_hash  TEXT,                                      -- Bezug ohne Klartext
  order_id    TEXT REFERENCES orders(id) ON DELETE SET NULL,
  detail      JSONB NOT NULL DEFAULT '{}'::jsonb         -- keine Adressen, keine Geheimnisse
);

CREATE INDEX IF NOT EXISTS ix_audit_occurred
  ON audit_log (occurred_at);
CREATE INDEX IF NOT EXISTS ix_audit_action
  ON audit_log (action);

-- =====================================================================
-- 9. Aufbewahrung / Löschjobs (Tages-Cron als customer_migrator;
--     Fristen erst nach fachkundiger Klärung scharf schalten)
-- =====================================================================

-- Job A (Vorschlag 7 Tage, PRÜFEN): unbestätigte Konten löschen (Tokens kaskadieren).
-- DELETE FROM buyers
--  WHERE status = 'pending' AND subscribed_at < now() - INTERVAL '7 days';

-- Job B (Vorschlag 30 Tage nach Verbrauch/Ablauf, PRÜFEN): alte Tokenzeilen löschen.
-- DELETE FROM buyer_tokens
--  WHERE COALESCE(used_at, expires_at) < now() - INTERVAL '30 days';

-- Job C (Vorschlag 24h nach Ablauf, PRÜFEN): abgelaufene/widerrufene Sitzungen löschen.
-- DELETE FROM buyer_sessions
--  WHERE COALESCE(revoked_at, expires_at) < now() - INTERVAL '24 hours';

-- Bestellungen, Statusverlauf und audit_log: KEIN automatischer Löschjob
-- (Abwicklung plus gesetzliche Nachweispflicht, PRÜFEN; Vorschlag kein pauschales
-- Löschen vor 3 Jahren ab Abschluss).

-- =====================================================================
-- 10. Rechte: Mindestrechte der Laufzeitrolle je Kunde
-- =====================================================================
-- Ausführung als Eigentümer (customer_migrator) nach der Migration.

-- REVOKE ALL ON ALL TABLES IN SCHEMA public FROM customer_app;
-- GRANT CONNECT ON DATABASE :"customer_db" TO customer_app;
-- GRANT USAGE ON SCHEMA public TO customer_app;
--
-- GRANT SELECT, INSERT, UPDATE ON buyers TO customer_app;
-- GRANT SELECT, INSERT, UPDATE ON buyer_tokens TO customer_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON buyer_sessions TO customer_app;
--   -- DELETE nur für Sitzungsablauf durch die Laufzeit; falls die Anmeldelösung
--   -- Sitzungen selbst führt, diese Zeile streichen (PRÜFEN).
-- GRANT SELECT ON products TO customer_app;
--   -- Produkte schreibt nur der Kunden-Admin-Weg bzw. die Migration; falls der
--   -- Admin-Schreibweg dieselbe Rolle nutzt: GRANT SELECT, INSERT, UPDATE ON products
--   -- nur über jenen Schreibweg, nie aus dem öffentlichen Leseweg (PRÜFEN).
-- GRANT SELECT, INSERT, UPDATE ON orders TO customer_app;
-- GRANT SELECT, INSERT ON order_items TO customer_app;
-- GRANT SELECT, INSERT ON order_status_history TO customer_app;
-- GRANT INSERT, SELECT ON audit_log TO customer_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO customer_app;
--
-- Kein DELETE (außer buyer_sessions siehe oben) und keine DDL-Rechte für
-- customer_app; Löschjobs laufen als customer_migrator über den Tages-Cron.
-- Vorschau erhält keinen Schlüssel. Keine Schlüssel, Tokens oder Adressen in Logs.
