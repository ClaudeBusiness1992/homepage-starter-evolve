# Newsletter-Datenmodell (PostgreSQL, je Kunde)

Stand: 25.11.2026. Entwurf, nicht ausgeführt, keine Rechtsberatung.
Grundlagen: [Konzept](/home/nick/.herdr-tasks/HPSE-NEWSLETTER-KONZEPT-20261125.md),
[Workflow-Plan](../../docs/WORKFLOW-PLAN.md) (V3), [Datenklassen](../../docs/DATENKLASSEN.md),
[Migration](../../docs/MIGRATION-POSTGRES.md), [Prototyp](../../prototypes/newsletter/index.html),
Bestand `src/lib/db.ts` (Tabelle `newsletter_subscribers`),
`src/pages/api/public/newsletter/subscribe.ts`,
`src/pages/api/public/newsletter/confirm.ts`,
`src/pages/api/admin/newsletter/export.csv.ts` (alle nur gelesen).

Geltung: eine Kundendatenbank (oder ein Kundenschema) je Kunde, eigene
Datenbankrolle je Kunde. Alle Tabellen unten leben in genau dieser
Kundenablage; es gibt keine kundenübergreifende Newsletter-Tabelle.
Führende Kopie aller Einwilligungsnachweise und der Sperrliste ist diese
PostgreSQL-Ablage; Resend ist Versandweg und Spiegel. Mit PRÜFEN markierte
Stellen sind Annahmen, die vor der Umsetzung gegen die Resend-Dokumentation
oder fachkundig rechtlich zu belegen sind.

## 1. Tabellenübersicht

| Tabelle | Zweck |
|---|---|
| `consent_texts` | Einwilligungstexte mit Version, gültig ab |
| `subscribers` | Abonnent: Adresse, Status, Zeitpunkte, Einwilligungsversion, Quelle, gekürzte Herkunft |
| `subscriber_tokens` | Bestätigungs- und Abmelde-Einmalwerte (nur Hash), Zweck, Ablauf, Verbrauch |
| `suppression_list` | Sperrliste: Prüfwert der Adresse, Grund, Zeitpunkt |
| `campaigns` | Kampagne: Kennung, Inhalt, Absender, Status, Empfängerzahl, Empfänger-Prüfsumme, Zeitpunkte |
| `delivery_events` | Zustellereignisse je Kampagne und Adresse |
| `webhook_events` | Webhook-Eingang mit Idempotenz über Anbieter-Ereigniskennung |
| `sending_policy` | Versandgrenzen des Kunden und Stopp-Schalter (genau eine Zeile) |
| `audit_log` | Protokoll: Statuswechsel, Exporte, Versandaktionen, Nachweise |

## 2. Statusmodell und Übergänge

Statuswerte (englisch in der Datenbank, deutsche Anzeige im /admin):

| DB-Wert | Anzeige | Erhält Newsletter |
|---|---|---|
| `pending` | Unbestätigt | nein |
| `confirmed` | Bestätigt | ja |
| `unsubscribed` | Abgemeldet | nein |
| `blocked` | Gesperrt | nein, dauerhaft ausgeschlossen |

Erlaubte Übergänge:

| Von | Nach | Auslöser |
|---|---|---|
| – | `pending` | Anmeldung über Formular |
| `pending` | `confirmed` | Klick auf Bestätigungslink vor Ablauf |
| `pending` | – (gelöscht) | Ablauf der Frist ohne Bestätigung |
| `confirmed` | `unsubscribed` | Ein-Klick-Abmeldung, ohne Login und ohne Rückfrage |
| `pending` | `unsubscribed` | Abmeldung einer noch unbestätigten Adresse |
| `confirmed` | `blocked` | Harter Rückläufer oder Beschwerde über Webhook |
| `pending` | `blocked` | Harter Rückläufer oder Beschwerde |
| `unsubscribed` | `blocked` | Beschwerde nach Abmeldung (Verschärfung, bleibt ausgeschlossen) |

Verboten: `unsubscribed` → `pending`/`confirmed` und `blocked` → jeder andere
Status durch Anmeldung, Import oder erneutes Formular. Eine erneute Anmeldung
einer abgemeldeten oder gesperrten Adresse erzeugt keinen versandfähigen
Status; der Versuch wird protokolliert und dem Besucher wird dieselbe
neutrale Erfolgsmeldung gezeigt wie bei einer Neuanmeldung (kein Hinweis, ob
die Adresse bekannt ist). Eine erneute bestätigte Einwilligung nach Abmeldung
ist nur über einen neuen vollständigen Double-Opt-in mit neuer
`consent_version` möglich; nach `blocked` nur nach manueller Prüfung durch den
Kunden (PRÜFEN: genauer Prozess mit Rechtsberatung festlegen).

Kampagnenstatus: `draft` (Entwurf) → `scheduled` (geplant) → `sending`
(in Versand) → `finished` (beendet); Abbruch nur aus `draft`/`scheduled`
nach `cancelled` (abgebrochen). `sending` und `finished` sind endgültig,
kein Rückweg.

## 3. Spalten und Regeln je Tabelle

### 3.1 `consent_texts`

- `version` (Text, Primärschlüssel, z. B. `v1`): vom Kunden geprüfte Fassung.
- `text` (Text, Pflicht): vollständiger Einwilligungswortlaut.
- `valid_from` (Zeitpunkt mit Zeitzone, Pflicht): ab wann diese Fassung verwendet wird.
- Genau eine Fassung ist zu einem Zeitpunkt aktiv (jüngstes `valid_from`).
- Einwilligungstexte werden nie geändert, nur neue Versionen angelegt.

### 3.2 `subscribers`

- `id` (UUID, Primärschlüssel).
- `email` (Text, Pflicht): Klartext, wird für den Versand gebraucht.
- `email_hash` (Text, Pflicht, eindeutig): SHA-256 über kleingeschriebene,
  getrimmte Adresse. Dient Abgleichen (Import, Sperrliste), ohne die Adresse
  in Protokollen zu wiederholen.
- `first_name` (Text, freiwillig, Standard leer): nur Vorname, keine weiteren
  Profildaten.
- `status` (Pflicht, Prüfung auf die vier Werte aus Abschnitt 2, Standard
  `pending`).
- `consent_version` (Pflicht, Verweis auf `consent_texts.version`): welche
  Textfassung bei der Anmeldung galt.
- `source` (Text, Pflicht, z. B. `website: /#newsletter`): Seite und Abschnitt
  der Anmeldung.
- `origin_trunc` (Text, freiwillig): gekürzte Herkunftskennung (z. B.
  IPv4-/24-maskiert `203.0.113.xxx`), niemals volle Adresse oder Agentenkennung.
- `subscribed_at`, `confirmed_at`, `unsubscribed_at` (Zeitpunkte mit Zeitzone):
  Anmeldung, Bestätigung, Abmeldung. `confirmed_at` nur bei `confirmed`,
  `unsubscribed_at` nur bei `unsubscribed`/`blocked` gesetzt (Prüfbedingungen).
- `blocked_reason` (Text): nur bei `blocked` gesetzt
  (`hard_bounce`, `complaint`, `manual`).
- `blocked_at` (Zeitpunkt): nur bei `blocked` gesetzt.
- Eindeutigkeit: `email_hash` ist eindeutig; `email` zusätzlich eindeutig über
  einen eindeutigen Index auf dem normalisierten Wert.
- Adressen stehen in keiner Anwendungsprotokollzeile und in keinem
  KI-Verlauf; in `audit_log` steht nur `email_hash`.

### 3.3 `subscriber_tokens`

- `token_hash` (Text, Primärschlüssel): SHA-256 des Einmalwerts; Klarwerte
  werden nirgends gespeichert.
- `subscriber_id` (Pflicht, Verweis auf `subscribers.id`, Löschung kaskadiert).
- `purpose` (Pflicht, `confirm` oder `unsubscribe`).
- `expires_at` (Pflicht): Bestätigung 24 Stunden ab Erstellung (wie Prototyp);
  Abmeldung langlebig (Vorschlag 12 Monate, danach Rotation).
  PRÜFEN: ob der technische Abmelde-Header einen langlebigen Wert je
  Abonnent verlangt und welches Format Resend erwartet.
- `used_at` (Zeitpunkt, Standard leer): Einmalgebrauch; Verbrauch wird in
  einer Transaktion mit dem Statuswechsel markiert.
- Offene Bestätigungstokens verfallen, statt gelöscht zu werden, damit eine
  erneute Anmeldung denselben Hash nicht wiederverwendet.
- Indizes auf `(subscriber_id, purpose)` und auf `expires_at` für den
  Löschjob.

### 3.4 `suppression_list`

- `email_hash` (Text, Primärschlüssel): Prüfwert wie in 3.2, kein Klartext
  erforderlich.
- `reason` (Pflicht, `unsubscribed`, `hard_bounce`, `complaint`, `manual`).
- `source` (Text, Pflicht): z. B. `unsubscribe-link`, `webhook: complained`,
  `import-reject`, `manual`.
- `created_at` (Pflicht).
- Vor jedem Versand und vor jeder Reaktivierung wird gegen diese Tabelle
  geprüft; ein Treffer schließt die Adresse aus, auch nach Import alter
  Listen oder erneuter Anmeldung. Die Liste wird nie pauschal gelöscht,
  solange die Sperre erforderlich ist.

### 3.5 `campaigns`

- `id` (Text, Primärschlüssel, z. B. `K-2026-11-001`): feste Kennung je
  Kampagne, zugleich Schutz vor Doppelversand.
- `resend_idempotency_key` (Text, eindeutig, freiwillig bis zum ersten
  Sendeversuch): Schlüssel für den Resend-Aufruf.
  PRÜFEN: ob die Broadcast-API einen solchen Schlüssel annimmt; bis zur
  Klärung gilt: vor erneutem Senden Stand bei Resend abfragen.
- `subject` (Pflicht, max. 90 Zeichen), `preview_text` (freiwillig, max.
  120 Zeichen), `heading` (Pflicht, max. 80 Zeichen), `body_text` (Pflicht).
- `image_ref` (freiwillig): Verweis auf die Medienablage des Kunden, keine
  fremde URL ohne Vertrag; `image_alt` Pflicht, sobald `image_ref` gesetzt
  ist (max. 120 Zeichen).
- `button_label` (freiwillig, max. 30 Zeichen), `button_url` (freiwillig, nur
  vollständig mit `https://`); beide gemeinsam gesetzt oder beide leer.
- `sender_name`, `sender_email` (Pflicht): verifizierte Absenderdomain, vom
  Kunden nicht frei änderbar.
- `status` (Pflicht, Prüfung auf `draft`, `scheduled`, `sending`,
  `finished`, `cancelled`; nur Übergänge aus Abschnitt 2).
- `recipient_count` (Pflicht, nicht negativ): Zahl bestätigter, nicht
  gesperrter Abonnenten zum Bestätigungszeitpunkt.
- `recipient_checksum` (Pflicht ab Freigabe zum Versand): Prüfsumme der
  Empfängerliste (z. B. SHA-256 über sortierte `email_hash`-Werte), Nachweis
  gegen wen versendet wurde.
- `scheduled_at`, `send_requested_at`, `sent_at` (Zeitpunkte; Planung in
  Zeitzone Berlin gespeichert als Zeitpunkt mit Zeitzone).
- `monthly_quota_snapshot` (Pflicht ab Freigabe): Tarifgrenze und bereits
  genutzte Menge zum Versandzeitpunkt (Nachweis der Grenzwahrung).

### 3.6 `delivery_events`

- `id` (UUID, Primärschlüssel), `campaign_id` (Pflicht, Verweis auf
  `campaigns.id`).
- `email_hash` (Pflicht): Zuordnung ohne Klartext in der Statistik.
- `event` (Pflicht, Prüfung auf `sent`, `delivered`, `bounced_hard`,
  `bounced_soft`, `complained`, `opened`): Öffnungen nur bei aktivierter,
  eingewilligter Messung.
- `provider_event_id` (Text, freiwillig): Kennung des Resend-Ereignisses.
- `occurred_at` (Pflicht): Zeitpunkt des Ereignisses beim Anbieter.
- Eindeutigkeit auf (`campaign_id`, `provider_event_id`), soweit der Anbieter
  Kennungen liefert, damit doppelt zugestellte Webhooks keine Doppelwirkung
  haben.

### 3.7 `webhook_events`

- `provider_event_id` (Text, Primärschlüssel): Anbieterkennung des
  Webhook-Ereignisses.
- `event_type` (Pflicht), `received_at` (Pflicht), `processed_at`
  (freiwillig), `payload_hash` (Pflicht): SHA-256 der Rohdaten zum Nachweis,
  Rohdaten selbst werden nicht aufbewahrt.
- `signature_ok` (Wahrheitswert, Pflicht): Ergebnis der Signaturprüfung;
  nur geprüfte Ereignisse werden verarbeitet.
- Wiederholte Zustellung derselben Kennung wird als Duplikat verworfen
  (`ON CONFLICT DO NOTHING`) und protokolliert.

### 3.8 `sending_policy`

Genau eine Zeile je Kunde (Prüfbedingung auf festen Schlüsselwert):

- `monthly_quota` (Pflicht, positiv): vereinbarte E-Mails je Monat.
- `used_this_month` (Pflicht, Standard 0): Zähler, monatlich zurückgesetzt.
- `period_start` (Pflicht): Beginn des laufenden Zählzeitraums.
- `sending_paused` (Wahrheitswert, Pflicht, Standard falsch): Stopp-Schalter;
  bei gesetztem Schalter lehnt jede Versandfunktion ab, auch geplante
  Kampagnen. Wirkt sofort.
- `pause_reason`, `updated_at`, `updated_by`.

### 3.9 `audit_log`

- `id` (UUID, Primärschlüssel), `occurred_at` (Pflicht, Standard jetzt).
- `actor` (Pflicht): `visitor`, `subscriber`, `customer`, `webhook`, `system`.
- `action` (Pflicht, z. B. `subscribe`, `confirm`, `unsubscribe`, `block`,
  `export`, `campaign.send`, `sending.pause`).
- `email_hash` (freiwillig): Bezug ohne Klartext.
- `campaign_id` (freiwillig, Verweis auf `campaigns.id`).
- `detail` (JSONB, Pflicht, Standard `{}`): Sachdaten ohne Adressen und ohne
  Geheimnisse (z. B. Exportumfang, Empfängerzahl, Ereignistyp).
- Nur Anfügungen aus Anwendungssicht; kein `UPDATE`/`DELETE` durch die
  Laufzeitrolle (siehe Abschnitt 6).

## 4. Abgleich mit Prototyp und Bestand

Jedes Eingabefeld und jeder Status des Prototyps hat genau einen Ort:

| Herkunft | Feld / Status | Ablage |
|---|---|---|
| Website-Formular | E-Mail-Adresse | `subscribers.email` + `email_hash` |
| Website-Formular | Vorname (freiwillig) | `subscribers.first_name` |
| Website-Formular | Einwilligungs-Häkchen (Pflicht, nicht vorausgewählt) | `subscribers.consent_version` + `subscribed_at` |
| Website-Formular | Datenschutz-Link | kein Datum; verweist auf geprüfte `consent_texts`-Fassung |
| Website-Formular | Honigtopf `website` | kein Datum; reine Abwehr, wird verworfen |
| Hinweis und E-Mail | 24-Stunden-Gültigkeit | `subscriber_tokens.expires_at` (`purpose = confirm`) |
| Bestätigungsseite | bestätigter Zustand | `subscribers.status = confirmed` + `confirmed_at` |
| Link abgelaufen | abgelaufener/verbrauchter Link | `expires_at` überschritten oder `used_at` gesetzt |
| Abmeldeseite / abgemeldet | Abmeldung ohne Login, sofort | `status = unsubscribed` + `unsubscribed_at`, Zeile in `suppression_list` |
| Admin-Tabelle | E-Mail, Vorname, Status, Angemeldet-am, Quelle | `email`, `first_name`, `status`, `subscribed_at`, `source` |
| Admin-Tabelle | Statusfilter Alle/Bestätigt/Unbestätigt/Abgemeldet/Gesperrt | `status`-Werte aus Abschnitt 2 |
| Detailansicht | Einwilligung erteilt, Bestätigt, Text, Version, Quelle, gekürzte Herkunft | `subscribed_at`, `confirmed_at`, `consent_version` → `consent_texts`, `source`, `origin_trunc` |
| Export | nur Bestätigte / alle mit Status / alle mit Nachweis | Abfragen auf `subscribers` (+ `consent_texts`); jeder Export in `audit_log` |
| Verfassen | Betreff, Vorschautext, Überschrift, Text | `campaigns.subject`, `preview_text`, `heading`, `body_text` (Längen wie dort) |
| Verfassen | Bild aus Ablage + Bildbeschreibung | `image_ref` + `image_alt` (Pflicht bei Bild) |
| Verfassen | Knopfbeschriftung + Ziel (`https://`) | `button_label` + `button_url` (gemeinsam oder leer) |
| Verfassen | Absender, Impressum, Abmeldelink automatisch | `sender_name`/`sender_email`; Impressum und Abmeldelink sind Vorlagenpflicht, kein Eingabefeld |
| Testmail | Adresse der Testmail | kein Datum; Transaktionsversand, zählt nicht als Kampagne |
| Sendebestätigung | Empfängerzahl, Absender, Betreff, Zeitpunkt | `recipient_count`, Sender-Spalten, `scheduled_at`/`send_requested_at` |
| Sendebestätigung | Tarifgrenze und Nutzung | `sending_policy` + `monthly_quota_snapshot` |
| Sendebestätigung | Unwiderruflichkeits-Häkchen | kein Datum; Freigabebedingung der Oberfläche |
| Versandmeldung | Kennung, Doppelversand-Schutz | `campaigns.id` + `resend_idempotency_key` |
| Statistik | zugestellt, Rückläufer, Beschwerden, Öffnungen | `delivery_events` |

Feldabgleich mit der heutigen SQLite-Tabelle `newsletter_subscribers`:

| SQLite-Spalte | Neues Ziel | Bemerkung |
|---|---|---|
| `id` | `subscribers.id` | als Text übernehmen oder neu als UUID vergeben mit Zuordnungstabelle |
| `email` | `email` + `email_hash` | Hash beim Import aus Kleinschreibung und Trimmung bilden |
| `first_name` | `first_name` | unverändert |
| `status` (`pending`/`confirmed`/`unsubscribed`) | `status` | `blocked` gab es nicht; Wertemenge wächst, schrumpft nie |
| `doi_token_hash` | `subscriber_tokens` (`purpose = confirm`) | PRÜFEN: sicherer ist Rotation (alle offenen Tokens neu ausstellen) statt Übernahme |
| `unsubscribe_token_hash` | `subscriber_tokens` (`purpose = unsubscribe`) | wie oben; Pflichtfeld ohne Ablauf im Bestand erhält `expires_at` |
| `consent_version` (Standard `v1`) | `consent_version` → `consent_texts` | Fassung `v1` mit geprüftem Text neu anlegen; Bestand trägt kein Einwilligungsdatum |
| `created_at` | `subscribed_at` | ISO-Zeitpunkt, Zeitzone prüfen |
| `confirmed_at` | `confirmed_at` | wie oben |
| `unsubscribed_at` | `unsubscribed_at` | wie oben |
| – (fehlt) | `source`, `origin_trunc` | Bestand kennt beides nicht: `source = 'migration: unbekannt'` eintragen |
| – (fehlt) | `suppression_list` | abgemeldete Bestandsadressen beim Import zusätzlich eintragen (`reason = unsubscribed`) |

Kein Import löst neue Bestätigungs- oder Newsletter-Mails aus; `admin_sessions`
und `login_attempts` werden nicht übernommen.

## 5. Aufbewahrung und Löschjobs

Fristen sind Arbeitsvorschläge; verbindliche Fristen klären Kunde und
Datenschutzerklärung vor dem ersten Versand (PRÜFEN, fachkundig):

- Unbestätigte Anmeldungen: Löschung nach 7 Tagen ohne Bestätigung
  (Prototyp und Datenklassen-Vorschlag); zugehörige offene
  Bestätigungstokens kaskadieren mit.
- Verbrauchte und abgelaufene Tokens: Löschung 30 Tage nach Verbrauch oder
  Ablauf (Missbrauchsauswertung), danach nur `audit_log`-Zeilen ohne Hash.
- Abmeldung und Einwilligungsnachweise: aufbewahren für die Dauer der
  gesetzlichen Nachweispflicht (PRÜFEN, Vorschlag: 3 Jahre ab Abmeldung);
  kein pauschales Löschen.
- Sperrliste: aufbewahren, solange die Sperre erforderlich ist; kein
  Löschjob ohne Freigabe.
- Zustellereignisse ohne Personenbezug als Statistik: PRÜFEN (Vorschlag
  12 Monate), danach aggregieren und Rohzeilen löschen.
- Webhook-Eingänge: Roh-Hash 90 Tage, danach nur Typzähler in `audit_log`.
- Der SQL-Entwurf enthält die passenden `DELETE`-Anweisungen als
  gekennzeichnete Jobs für den bestehenden Tages-Cron; Ausführung erst nach
  bestätigten Fristen.

## 6. Rechte der Datenbankrolle je Kunde (Mindestrechte)

- Zwei Rollen: `customer_migrator` (Schema, Migrationen, Löschjobs) und
  `customer_app` (Laufzeit der Kundenseite). Der Entwurf vergibt die Rechte
  genau so.
- `customer_app`: `CONNECT`, `USAGE` auf das Schema; `SELECT`, `INSERT`,
  `UPDATE` auf `subscribers`, `subscriber_tokens`, `suppression_list`,
  `campaigns`, `delivery_events`, `webhook_events`, `sending_policy`;
  `SELECT` auf `consent_texts`; `INSERT`+`SELECT` auf `audit_log` (kein
  `UPDATE`/`DELETE`); `USAGE` auf benötigte Sequenzen; keine
  `TRUNCATE`- und keine DDL-Rechte.
- `DELETE` erhält `customer_app` nirgends; Löschjobs laufen als
  `customer_migrator` über den Tages-Cron.
- Keine Rolle sieht fremde Kundendatenbanken oder -schemas; Zugriff nur über
  den serverseitigen Dienst mit kundengebundenem Schlüssel, nie aus Browser
  oder Build.
- Vorschau erhält keinen Schlüssel und keinen Versandweg (technisch
  gesperrt, nicht nur ausgeblendet).
