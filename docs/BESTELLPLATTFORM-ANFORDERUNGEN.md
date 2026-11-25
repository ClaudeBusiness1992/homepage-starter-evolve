# Bestellplattform – Anforderungen

Stand: 26.11.2026. Entwurf, keine Umsetzung, keine Rechtsberatung.
Grundlagen: `docs/WORKFLOW-PLAN.md` (V3), `docs/DATENKLASSEN.md`,
`docs/MIGRATION-POSTGRES.md`, `docs/NEWSLETTER-SCHEMA.md`
(Stilvorlage für Schema und Status), `docs/recht/ANWALT-UEBERGABE.md`,
`docs/recherche/PROMPT-AUTH-EU.md`.
Geltung: je Kunde eine eigene PostgreSQL-Ablage auf dem Hauptserver
(eigene Datenbank oder eigenes Schema mit eigener Rolle), wie im Plan
für alle Kundendaten vorgesehen. PRÜFEN markiert Annahmen vor der Umsetzung.

## 1. Anwendungsfall und Abgrenzung

Der erste Kunde betreibt eine vereinfachte Bestellplattform.
Besteller registrieren sich selbst, melden sich an, wählen Produkte,
sehen einen ungefähren Preis und schicken die Bestellung ohne Zahlung ab.
Die Bestellung erscheint im Admin-Bereich des Kunden und geht per E-Mail
an ihn.

Die Plattform tut ausdrücklich nicht:

- keine Zahlung (kein Zahlungsanbieter, keine Zahlungsabwicklung,
  keine Rechnungsstellung im System);
- keinen Versand (keine Versandetiketten, keine Tracking-Nummern,
  keine Versandkostenberechnung im System);
- keine Lagerverwaltung (Bestände höchstens als Anzeige, PRÜFEN ob nötig);
- keine automatische Auftragsannahme mit Rechtswirkung über das Absenden
  hinaus (Annahme erfolgt durch den Kunden außerhalb oder per Statuswechsel,
  siehe Abschnitt 5).

Erwartete Größenordnung: einige hundert bis wenige tausend Besteller je
Kunde (Vorgabe aus `docs/recherche/PROMPT-AUTH-EU.md`).

## 2. Rollen mit Rechten

- **Besteller (Endnutzer):** eigenes Konto je Kundendomäne. Darf sich
  registrieren, E-Mail bestätigen, anmelden, Passwort zurücksetzen,
  Produkte ansehen, Bestellung zusammenstellen und absenden, eigene
  Bestellungen einsehen, eigenes Konto mit Daten exportieren und löschen.
  Sieht nur eigene Daten. Keine Admin-Rechte, kein Zugriff auf fremde
  Kunden.
- **Kunden-Admin (Kunde):** sieht alle Bestellungen des eigenen Kunden
  im Admin-Bereich, sieht Bestellerdaten des eigenen Kunden, wechselt
  Bestellstatus (Abschnitt 5), pflegt Produkte und Preise (sofern so
  entschieden, Abschnitt 10). Keine Schema-, Rollen- oder
  Datenbankrechte. Kein Zugriff auf andere Kunden.
- **Entwickler (Nick):** richtet je Kunde Datenbank, Rolle,
  Schnittstelle und Mailweg ein (Befehlshülle, Plan §9), pflegt Kern
  und Schnittstelle, liest Schlüssel in der Befehlshülle, nie im
  Browser. Einziger mit server- und datenbankseitigem Zugriff.

Mandantentrennung: Nutzer, Bestellungen und Produkte je Kunde getrennt
in der jeweiligen Kundenablage; keine kundenübergreifende Tabelle.
Laufzeitrolle je Kunde mit Mindestrechten (siehe SQL-Entwurf).

## 3. Nutzerfluss Schritt für Schritt

1. **Registrierung:** Besteller gibt E-Mail und Passwort ein,
   bestätigt Einwilligungs- und Hinweistext (Version gespeichert).
   System legt Konto als unbestätigt an, versendet Bestätigungsmail
   mit Einmal-Link (24 Stunden, PRÜFEN: Frist).
2. **E-Mail-Bestätigung:** Klick auf den Link vor Ablauf bestätigt
   das Konto. Abgelaufener oder verbrauchter Link zeigt neutrale
   Fehlermeldung mit Angebot, neue Mail anzufordern.
3. **Anmeldung:** E-Mail und Passwort. Bei Fehlversuchen Sperre und
   Ratenbegrenzung (Abschnitt 8). Sitzung hostübergreifend
   (Abschnitt 4, getrennte Hosts beachten).
4. **Passwort vergessen:** E-Mail eingeben, neutrale Erfolgsmeldung
   unabhängig von Existenz des Kontos. Einmal-Link mit kurzer Frist
   (PRÜFEN: z. B. 1 Stunde), Einmalgebrauch, danach neues Passwort.
5. **Produktauswahl:** angemeldeter Besteller wählt Produkte und
   Mengen. Gastbestellung nur falls Kunde sie wünscht (offen,
   Abschnitt 10); Standard: nur angemeldet.
6. **Ungefährer Preis:** Anzeige als Schätzung („ungefähr", ohne
   Verbindlichkeit, ohne Steuer-/Versandzusage). Endpreis klärt der
   Kunde außerhalb des Systems (PRÜFEN: Wortlaut mit Anwalt).
7. **Absenden:** Besteller schickt ohne Zahlung ab. System prüft
   Produkte, Mengen und Sperren serverseitig, erzeugt genau eine
   Bestellung mit fester Kennung (Schutz vor Doppelabsenden), Status
   `eingegangen`.
8. **Bestätigung an Besteller:** Transaktionsmail mit Kennung,
   Positionen und Hinweis auf Unverbindlichkeit (Abschnitt 7).
9. **Mail und Admin-Eingang beim Kunden:** E-Mail an die hinterlegte
   Kundenadresse plus neuer Eingang im Admin-Bereich. Kein erneuter
   Versand bei Wiederholung oder Rollback.
10. **Statuswechsel durch den Kunden:** Kunde setzt Status
    (`eingegangen` → `angenommen`/`abgelehnt`/`storniert`,
    Details Abschnitt 5). Besteller sieht nur den eigenen Status.
    Annahme-/Ablehnungsmail an Besteller optional (Abschnitt 10).
11. **Konto löschen:** Besteller löscht eigenes Konto im angemeldeten
    Bereich. Folgt Lösch- und Aufbewahrungsregeln (Abschnitt 6):
    Bestellnachweise bleiben soweit erforderlich, Sperr- und
    Protokolleinträge bleiben, Klardaten werden entfernt oder
    anonymisiert. Export vorher möglich.

## 4. Anforderungsprofil an die Anmeldelösung

Die Wahl ist offen; die laufende Recherche nach
`docs/recherche/PROMPT-AUTH-EU.md` liefert die Ergebnisse. Das Profil
ist so formuliert, dass jede Zeile morgen mit „erfüllt / teilweise /
nicht erfüllt / NICHT BELEGT" gegen die Rechercheergebnisse gehalten
werden kann. Clerk ist ausgeschieden: nach eigener Sicherheitsseite
keine EU-Datenhaltung (laut Websuche, noch gegen das Original zu
prüfen, PRÜFEN).

Betriebsbedingung getrennte Hosts: Seiten beim Hosting-Anbieter auf
der Kundendomain, Datenschnittstelle auf dem Hauptserver. Prüffrage:
Wie funktionieren Sitzungen, Cookies (SameSite, Secure, Domain),
CSRF-Schutz und Token in dieser Aufteilung, ohne dass der Browser
Cookies verwirft? Jede Lösung muss diese Frage beantworten; Antwort
vor der Entscheidung belegen.

### Muss (Ausschluss bei Nichterfüllung)

- **M1 EU-Datenhaltung:** alle Konto-, Sitzungs- und Protokolldaten
  in der EU. Begründung: Kundenvorgabe aus Plan und Leitplanken.
- **M2 Getrennte Mandanten:** Nutzer und Einstellungen je Kunde
  getrennt (Organisation/Mandant/Realm oder eigene Ablage).
  Begründung: Trennungsfehler träfe fremde Besteller.
- **M3 E-Mail und Passwort, Bestätigung, Zurücksetzen:**
  Registrierung, E-Mail-Bestätigung, Passwort-Zurücksetzen aus
  der Lösung oder mit eigenem Mailweg. Begründung: Kernfluss
  Abschnitt 3 ohne Eigenbau.
- **M4 Sperre und Ratenbegrenzung:** Fehlversuchszählung, Sperre,
  Ratenbegrenzung eingebaut oder über Drosselung abbildbar.
  Begründung: sonst offenes Einfallstor für Übernahmen.
- **M5 Passwortregeln und geleakte Passwörter:** Mindestregeln plus
  Prüfung gegen bekannte geleakte Passwörter. Begründung:
  Standardschutz ohne Eigenliste.
- **M6 Sitzungen je Host-Trennung:** funktioniert mit Frontend auf
  Kundendomain und API auf Hauptserver (Cookies/Token/CSRF
  dokumentiert). Begründung: sonst Anmeldung technisch unbrauchbar.
- **M7 Deutsche Texte:** alle nutzersichtbaren Texte und Fehler
  deutsch und anpassbar. Begründung: Besteller sind deutschsprachig.
- **M8 Mail über beliebigen Anbieter:** Anbindung an den gewählten
  EU-Mailanbieter, kein Anbieterzwang mit US-Übertragung.
  Begründung: sonst Konflikt mit M1.
- **M9 Löschen und Export:** Konto löschen und Daten exportieren
  abbildbar (DSGVO). Begründung: Pflicht aus Abschnitt 6.
- **M10 Steuerung per Schnittstelle:** Einrichtung und Betrieb je
  Kunde per API/Kommandozeile/Konfiguration als Code, ohne
  Klickarbeit je Kunde. Begründung: Leitplanke „API statt Klickarbeit",
  sonst Skalierung auf viele Kunden unmöglich.

### Soll (Gewichtung bei Vergleich)

- **S1 Zweite Stufe (TOTP, Passkeys):** für Kunden-Admins, optional
  für Besteller. Begründung: schützt den Admin-Eingang mit allen
  Bestelldaten.
- **S2 Abmelden auf allen Geräten:** Begründung: begrenzt Schaden
  nach Kompromittierung.
- **S3 Astro-Anbindung belegt:** Server-Rendering, Middleware,
  API-Routen, Migrationen dokumentiert. Begründung: weniger
  Integrationsrisiko.
- **S4 Projekt- oder mandantenbegrenzte Schlüssel:**
  Begründung: begrenzt Schaden je Kunde, passt zur Befehlshülle.
- **S5 Ressourcenarm für 4-GB-Server:** begründet durch bekannte
  RAM-/CPU-Werte. Begründung: vermeidet erzwungenen
  Infrastrukturwechsel.
- **S6 Reifegrad und Sicherheitsreaktion:** bekannte Lücken,
  Reaktionszeit, Changelog. Begründung: Alleinbetrieb ohne
  Überraschungen.

### Kann (nachrangig, kein Ausschluss)

- **K1 Anmeldung mit Google/Apple (optional).** Begründung: Komfort,
  aber neue Abhängigkeit und Datenweitergabe.
- **K2 Organisationen mit Selbstverwaltung.** Begründung: nur falls
  Kunde Unterstrukturen braucht.
- **K3 MCP-Server oder Terraform.** Begründung: Komfort für
  KI-Betrieb, kein Pflichtweg.

## 5. Datenmodell als Tabellenübersicht

Führende Kopie: Kunden-PostgreSQL auf dem Hauptserver. Tabellen je
Kundenablage, keine kundenübergreifenden Tabellen. Stil nach
`docs/NEWSLETTER-SCHEMA.md`. Spalten im SQL-Entwurf.

| Tabelle | Zweck |
|---|---|
| `customers` (PRÜFEN: nur falls mehrere Kunden in einer DB) | Kundensatz je Ablage; sonst genau eine Zeile als Anker für Schlüssel |
| `buyers` | Besteller: Adresse, Prüfwert, Name (falls nötig), Status, Einwilligungsversion, Zeitpunkte |
| `buyer_tokens` | Bestätigungs- und Rücksetz-Einmalwerte (nur Hash), Zweck, Ablauf, Verbrauch |
| `buyer_sessions` (falls Lösung eigene Sitzungen verlangt; PRÜFEN) | Sitzungskennung, Bestellerbezug, Ablauf, Widerruf |
| `products` | Produkt: Kennung, Name, Beschreibung, ungefähre Preisangabe, Einheit, Verfügbarkeit, Sortierung |
| `orders` | Bestellung: feste Kennung, Bestellerbezug, Status, Preisschätzung mit Hinweis, Zeitpunkte |
| `order_items` | Bestellposition: Bestellbezug, Produktbezug mit Namen-/Preis-Schnappschuss, Menge, Einzel- und Zeilenschätzung |
| `order_status_history` | Statusverlauf: Bestellbezug, von/nach, Akteur, Zeitpunkt, Bemerkung |
| `audit_log` | Protokoll: Anmeldungen, Exporte, Versand, Statuswechsel (nur Anfügungen, keine Adressen im Klartext außer nötig) |

Produktschnappschuss: `order_items` speichert Name und Preisstand zum
Bestellzeitpunkt, damit spätere Preisänderungen alte Bestellungen
nicht umschreiben.

Statusübergänge der Bestellung (DB-Werte englisch, Anzeige deutsch):

| DB-Wert | Anzeige | Bemerkung |
|---|---|---|
| `received` | Eingegangen | nach Absenden |
| `accepted` | Angenommen | durch Kunden-Admin |
| `rejected` | Abgelehnt | durch Kunden-Admin |
| `cancelled` | Storniert | durch Besteller (vor Annahme) oder Kunden-Admin |
| `completed` | Abgeschlossen | optional, nach Übergabe außerhalb des Systems |

Erlaubte Übergänge:

- – → `received` (Absenden nach serverseitiger Prüfung)
- `received` → `accepted` / `rejected` (nur Kunden-Admin)
- `received` → `cancelled` (Besteller vor Annahme oder Kunden-Admin)
- `accepted` → `completed` / `cancelled` (nur Kunden-Admin)
- `rejected`, `completed`, `cancelled` sind endgültig, kein Rückweg.

Jeder Wechsel wird in `order_status_history` und `audit_log`
protokolliert. Doppelabsenden wird über die feste Bestellkennung plus
Idempotenzschlüssel abgefangen.

## 6. Datenschutz

Kein Ersatz für Rechtsberatung. Verweis: `docs/recht/ANWALT-UEBERGABE.md`
mit Blöcken A–C, `docs/DATENKLASSEN.md`, `docs/NEWSLETTER-DATENSCHUTZ.md`
für Nachweismuster.

- **Personenbezogene Daten:** Besteller (E-Mail, ggf. Name, Adresse
  falls Lieferdetails nötig — PRÜFEN; Zeitpunkte, Einwilligungsversion,
  gekürzte Herkunft); Sitzungen/Protokolle (IP-gekürzt, PRÜFEN);
  Bestellungen (Positionen, Schätzpreise); Transaktionsmails
  (Adressen, Inhalte); Kunden-Admin-Konten.
- **Zweck:** Registrierung und Anmeldung, Bestellabwicklung,
  Missbrauchsschutz, Nachweis (Einwilligung, Statusverlauf).
- **Rechtsgrundlage (Stichworte, Freigabe durch Anwalt):**
  Vertragserfüllung/Anbahnung für Bestelldaten; Einwilligung für
  Konto und Mails (Art. 6/7, PRÜFEN); berechtigtes Interesse nur für
  eng begrenzte Sicherheit und Protokolle (PRÜFEN); kein Tracking,
  keine Werbung in dieser Plattform.
- **Aufbewahrung und Löschung (Vorschläge, PRÜFEN):**
  unbestätigte Konten 7 Tage; verbrauchte/abgelaufene Tokens 30 Tage;
  Bestellungen für die Dauer der Abwicklung plus gesetzlicher
  Nachweispflicht (PRÜFEN, Vorschlag kein pauschales Löschen vor
  3 Jahren ab Abschluss); Sperr- und Einwilligungsnachweise solange
  erforderlich; Protokolle ohne Klardaten, Frist je Art festlegen;
  Backup-Verfall gesondert regeln. Kein Klartext in Logs und
  KI-Verläufen; in `audit_log` nur Prüfwerte.
- **Export:** Besteller erhält eigene Daten in nutzbarem Format
  (Konto, Bestellungen mit Statusverlauf); Kunden-Admin erhält alle
  eigenen Bestelldaten bei Vertragsende (Verfahren vor Start
  beschreiben).
- **Verantwortlicher / Auftragsverarbeiter:** Kunde ist
  Verantwortlicher für Besteller- und Bestelldaten; pixel&code ist
  Auftragsverarbeiter (Vertrag vor erstem Kunden). Mail-, Hosting-
  und Sicherungsanbieter sind Unterauftragsverarbeiter (Verträge
  und Drittland-Garantien vor Einsatz, siehe ANWALT-UEBERGABE A1–A4).
  Anmeldelösung je nach Betriebsart einordnen (Bibliothek ohne
  Datenabfluss vs. gehosteter Dienst mit Vertrag, PRÜFEN).
- **Verweis auf `docs/recht`:** Rollen, Verträge, Fristen,
  Betroffenenrechte und Pannenablauf gelten aus dem Übergabepaket;
  dieses Dokument erfindet keine abweichenden Regeln.

Neue Anwaltsfragen zu dieser Plattform (Kurzliste, Details im
Ergebnisbericht):

1. Rechtsgrundlage je Verarbeitung (Konto, Bestellung, Protokoll).
2. Einwilligungstexte für Registrierung und Bestellung freigeben.
3. Aufbewahrungs- und Nachweisfristen für Bestellungen, Konten,
   Sperren, Protokolle; Backup-Verfall.
4. Anmeldelösung als Auftragsverarbeitung einordnen (Bibliothek vs.
   Dienst, Datenort, Drittland).
5. Cookies/Sitzungen/CSRF bei getrennten Hosts in Erklärung abbilden.
6. Transaktionsmail-Inhalte (Pflichtangaben, Impressum, Widerruf bei
   B2C — PRÜFEN).
7. Gastbestellung ohne Konto zulässig und mit welcher Nachweislage.
8. Freischaltung durch den Kunden vor Erstbestellung (Sperre bis
   Freigabe) als Bedingung zulässig.
9. Auskunftsumfang (Statusverlauf, Protokolle) und Exportformat.
10. Ungefährer Preis: zulässiger Wortlaut ohne Irreführung.

## 7. Transaktionsmails

Versand über den gewählten EU-Mailanbieter (PRÜFEN: welcher).
Vorschau erhält keinen Schlüssel und keinen Versandweg.

| Mail | Auslöser | Empfänger | Inhalt (Stichworte) | Zustellrisiko |
|---|---|---|---|---|
| Bestätigung der Registrierung | Neuanmeldung | Besteller | Begrüßung, Bestätigungslink, Frist, kein Login ohne Klick | Spam-Ordner, Tippfehler in Adresse, Linkablauf |
| Passwort-Zurücksetzen | Anforderung | Besteller (neutral) | Einmal-Link, kurze Frist, Hinweis bei Nichtanforderung | Verzögerung, Wiederverwendung, Abfischung |
| Eingang beim Kunden | Bestellabsendung | Kundenadresse(n) | Kennung, Positionen, Bestellerdaten, Link in Admin | Postfach voll, Fehladresse, Verzögerung bei Last |
| Eingangsbestätigung | Bestellabsendung | Besteller | Kennung, Zusammenfassung, Unverbindlichkeitshinweis, Kontaktweg | wie oben; Erwartungsmanagement bei Unverbindlichkeit |
| Statusänderung (optional, PRÜFEN) | `accepted`/`rejected`/`completed` | Besteller | neuer Status, Kennung, nächste Schritte | Flut bei Fehlbedienung; nur bei Bedarf |

Jeder Versand wird mit Empfängerprüfwert und Kennung protokolliert.
Kein Newsletter- oder Werbeversand aus dieser Plattform.
Testmail vor Freischaltung je Kundenadresse.

## 8. Missbrauchsschutz ohne US-Dienste

Kein US-Dienst für Abwehr, Captchas oder Listen (EU-Vorgabe aus den
Leitplanken). Maßnahmen serverseitig durchsetzen, nicht nur im Browser:

- **Ratenbegrenzung:** je IP und je Konto für Anmeldung, Registrierung,
  Zurücksetzen, Absenden; gestaffelt mit Sperrfristen; Grenzen je
  Kunde einstellbar (PRÜFEN: Werte im Pilot messen).
- **Bots:** Honigtopf-Feld, Zeitprüfung (zu schnelles Absenden),
  Sitzungs- und CSRF-Bindung; kein US-Captcha. PRÜFEN: EU-Captcha
  nur bei Bedarf, sonst ohne.
- **Spam:** Eingabenlängen, Formatprüfung, Verbot von Links in
  Freitext (falls Freitext nötig), Ausgabekodierung, Moderationsblick
  im Admin vor Annahme (Annahme ist manuell).
- **Massenregistrierung:** Bestätigungszwang vor Erstbestellung
  (Standard), Sperrliste für Missbrauchsadressen, Drosselung je
  Herkunftsnetz (gekürzt), Löschjob für Unbestätigte nach 7 Tagen
  (PRÜFEN), Beobachtung von Anmelde- und Versandquoten mit
  Stopp-Schalter je Kunde.
- **Doppelabsenden:** feste Bestellkennung plus Idempotenzschlüssel;
  Wiederholung liefert denselben Stand, erzeugt keine zweite
  Bestellung und keine zweite Kundenmail.
- **Protokoll ohne Klardaten:** nur Prüfwerte und Zähler, keine
  Passwörter, Tokens oder Adressen in Logs.

## 9. Abnahmetests

Jeder Test mit erwartetem Ergebnis; keine echten Daten in Vorschau,
Versand dort technisch gesperrt.

1. Registrierung mit neuer Adresse → Konto `unbestätigt`,
   Bestätigungsmail versendet, kein Login vor Klick.
2. Bestätigungslink vor Ablauf → Konto `bestätigt`, Link danach
   verbraucht (Zweitaufruf zeigt Fehler, kein Zustandswechsel).
3. Abgelaufener Link → Fehlermeldung mit Angebot für neue Mail,
   kein Login.
4. Anmeldung mit richtigen Daten → Sitzung gültig auf Kundendomain
   und API-Host, CSRF-Prüfung besteht.
5. Fünf Fehlversuche → Sperre/Drosselung greift, korrekter Versuch
   danach erst nach Frist.
6. Passwort-Zurücksetzen für unbekannte Adresse → gleiche neutrale
   Meldung wie für bekannte, keine Mail an Unbekannte, keine
   Unterschiedsmessung.
7. Rücksetz-Link → neues Passwort, Link danach verbraucht,
   alte Sitzungen widerrufen (PRÜFEN: Umfang).
8. Produktauswahl mit Mengen → ungefähre Preisschätzung sichtbar,
   als „ungefähr" gekennzeichnet, ohne Steuer-/Versandzusage.
9. Absenden ohne Zahlung → genau eine Bestellung `received` mit
   fester Kennung; Wiederholung mit gleichem Schlüssel erzeugt
   keine zweite Bestellung und keine zweite Kundenmail.
10. Bestellabsendung → Mail an Kundenadresse und Eingang im Admin,
    Inhalt mit Kennung und Positionen; Besteller erhält
    Eingangsbestätigung.
11. Statuswechsel `received` → `accepted` durch Kunden-Admin →
    Besteller sieht neuen Status; Verlauf enthält Eintrag mit
    Akteur und Zeit.
12. Verbotener Übergang (`completed` → `received`) → Abweisung,
    kein Zustandswechsel, Protokolleintrag.
13. Unbefugter Zugriff (fremde Bestellung, fremder Kunde) →
    Abweisung, kein Datenleck über Fehlertexte oder IDs.
14. Konto löschen → Login danach unmöglich, Bestellnachweise
    anonymisiert bzw. fristgerecht aufbewahrt (PRÜFEN), Export
    vorher möglich.
15. Raten- und Bot-Prüfung: Massenregistrierung und schnelles
    Doppelabsenden werden gedrosselt bzw. zusammengeführt,
    ohne US-Dienst.

## 10. Offene Fragen an den Kunden

1. Produktdaten und Preise: welche Produkte, welche ungefähren Preise,
   welche Einheiten?
2. Wer pflegt Produkte und Preise (Kunde im Admin oder Nick bei
   Änderung), und wie oft ändern sie sich?
3. Mengen: Mindest-/Höchstmengen je Produkt oder Bestellung?
4. Lieferdetails: braucht die Bestellung Lieferadresse, Wunschtermin
   oder Abholhinweis — und wenn ja, welche Felder?
5. Mailadressen: wohin geht die Eingangs-Mail (eine oder mehrere),
   wer bearbeitet Statuswechsel?
6. Freischaltung durch den Kunden ja/nein: darf ein bestätigter
   Besteller sofort bestellen, oder erst nach manueller Freigabe
   durch den Kunden?
7. Gastbestellung ja/nein: Bestellung ohne Konto zulassen oder nur
   angemeldet?
8. Statusmails an Besteller bei Annahme/Ablehnung erwünscht?
9. Produktbilder nötig, und wer liefert Rechte und Dateien in
   welchem Format?
10. Reicht „ungefährer Preis" als Schätzung, oder braucht es feste
    Preisliste mit Gültigkeitsdatum?
