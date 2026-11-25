# Übergabe für morgen (26.11.2026)

Stand: 26.11.2026. Zweck: Nick bringt morgen drei Recherche-Ergebnisse mit (EU-Mailanbieter, EU-Hosting als Ersatz, Anmeldelösung als Ersatz) und arbeitet sie eines nach dem anderen ab. Dieses Dokument fasst zusammen, was gilt, was offen ist und wer was tut. Kein Quellcode, keine Geheimnisse, keine Hostnamen, keine Adressen.

## 1. Stand

Die Plattformvorbereitung liegt als Planung vor, nichts davon ist umgesetzt oder für Kundendaten freigegeben. Der erste Kunde betreibt eine vereinfachte Bestellplattform: Besteller registrieren sich selbst, wählen Produkte mit ungefährem Preis, schicken ohne Zahlung ab; Eingang im Admin des Kunden und per Mail. Nick prüft EU-Anbieter statt bisheriger Startpfade und arbeitet ein Thema nach dem anderen ab, nicht alles auf einmal.

Wichtig zur Reihenfolge: Die Einrichtung der bisherigen Startpfade war für morgen früh vorgesehen (siehe Einrichtungsanleitung unten). Diese Einrichtung ist erst nach der EU-Auswertung sinnvoll oder wird als bewusster Startpfad entschieden (siehe Abschnitt 5).

## 2. Dokumentenverzeichnis (nur tatsächlich vorhandene Dateien)

### docs/

- `docs/WORKFLOW-PLAN.md`: Gesamtplan mit Architektur, Phasen und offenen Punkten.
- `docs/BESTELLPLATTFORM-ANFORDERUNGEN.md`: Anforderungen der Bestellplattform des ersten Kunden mit Anforderungsprofil an die Anmeldelösung.
- `docs/recherche/AUSWERTUNGSRASTER.md`: Einheitliches Raster zur Auswertung der drei Recherchen mit Belegstufen, Pflicht-Tests und Zeitleiste.
- `docs/SERVER-BESTELLUNG-UND-ERSTEINRICHTUNG.md`: Bestell- und Einrichtungsplan für den Hauptserver in fester Reihenfolge mit Abnahmetests.
- `docs/UEBERGABE-MORGEN-20261126.md`: Dieses Dokument.
- `docs/EINRICHTUNG-VERCEL-RESEND.md`: Schritt-für-Schritt-Anleitung für die Konten- und Schlüsseleinrichtung der bisherigen Startpfade.
- `docs/EINRICHTUNG-ALARM.md`: Anleitung zur Anbindung des einen aktiven Alarmkanals per App.
- `docs/SICHERUNG-ZIEL.md`: Entscheidungsstand zum Sicherungsziel mit Vorschlag, Preisen und offenen Prüfungen.
- `docs/SICHERUNG-EINRICHTUNG.md`: Entwurf zur Einrichtung der Sicherung mit Rollen und Skriptlage.
- `docs/DATENKLASSEN.md`: Bestandsaufnahme und Zielvorschlag zur Datenhaltung je Datenart.
- `docs/MIGRATION-POSTGRES.md`: Plan zur Umstellung der Datenschicht auf PostgreSQL.
- `docs/RUNBOOK-WIEDERANLAUF.md`: Runbook und Probeplan für die Wiederherstellung vor dem ersten Kunden.
- `docs/KUNDEN-ANLEGEN-CHECKLISTE.md`: Checkliste für das automatisierte Anlegen eines Kunden mit Nachweisen.
- `docs/SCHALTZENTRALE.md`: Vorbereitungsstand der Befehlshülle mit Befehlen und Aufrufform.
- `docs/BOOKING-LIVESYNC.md`: Beschreibung der Buchungsvarianten mit und ohne Kalendersynchronisation.
- `docs/CONTACT-SETUP.md`: Einrichtung des Kontaktformulars (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/NEWSLETTER-API.md`: Schnittstellenvertrag des Newsletter-Moduls, keine Umsetzung.
- `docs/NEWSLETTER-DATENSCHUTZ.md`: Datenschutz- und Rechtsgrundlage des Newsletter-Moduls als Entwurf.
- `docs/NEWSLETTER-SCHEMA.md`: Datenmodell des Newsletter-Moduls (PRÜFEN: Vorhandensein vor Umsetzung gegenlesen).
- `docs/NEWSLETTER-ABNAHMETESTS.md`: Abnahmetests des Newsletter-Moduls mit Nachweisregeln.
- `docs/NEWSLETTER-RESEND-PRUEFUNG.md`: Prüfergebnis zum bisherigen Mailanbieter anhand öffentlicher Dokumentation.
- `docs/audit-agents.md`: Beschreibung der Prüfmechanik (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/customization.md`: Anpassungspunkte der Darstellung (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/design-catalog.md`: Katalog der Gestaltungselemente (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/legal-checklist.md`: Rechtliche Start-Checkliste je Kundenstart, vor jedem Start abarbeiten.
- `docs/setup.md`: Allgemeine Einrichtungshinweise (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/UI-UX-PRO-MAX-INTEGRATION.md`: Integrationshinweise zur Gestaltung (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/WEBSITE_TECHNICAL_GUARDRAILS.md`: Technische Leitplanken der Website (PRÜFEN: Inhalt vor Verwendung gegenlesen).
- `docs/recherche/PROMPT-MAIL-EU.md`: Rechercheauftrag zum EU-Mailanbieter.
- `docs/recherche/PROMPT-HOSTING-EU.md`: Rechercheauftrag zum EU-Hosting als Ersatz.
- `docs/recherche/PROMPT-AUTH-EU.md`: Rechercheauftrag zur Anmeldelösung als Ersatz.
- `docs/recht/ANWALT-UEBERGABE.md`: Übergabepaket an den Anwalt mit Datenflüssen, Anbietern und Fragenliste.
- `docs/recht/AVV-ENTWURF.md`: Entwurf des Auftragsverarbeitungsvertrags je Kunde.
- `docs/recht/AVV-ANLAGEN.md`: Anlagen zum Auftragsverarbeitungsvertrag mit technischen und organisatorischen Maßnahmen.
- `docs/recht/DATENSCHUTZERKLAERUNG-BAUSTEINE.md`: Textbausteine für Kunden-Datenschutzerklärungen.
- `docs/recht/KUNDENVERTRAG-GERUEST.md`: Gerüst des Kundenvertrags mit Leistung, Vergütung und Ausstieg.
- `docs/recht/VVT-LOESCHKONZEPT-PANNEN.md`: Verarbeitungsverzeichnis-Muster, Löschkonzept und Pannenablauf.
- `docs/sql/bestellplattform-schema.postgres.sql`: Datenbankentwurf der Bestellplattform, nicht ausgeführt.
- `docs/sql/newsletter-schema.postgres.sql`: Datenbankentwurf des Newsletter-Moduls, nicht ausgeführt.

### scripts/

- `scripts/backup/backup.sh`: Nächtliche Sicherung, nur als Trockenlauf geprüft.
- `scripts/backup/restore-test.sh`: Prüfung lesbarer Sicherungen, nur als Trockenlauf geprüft.
- `scripts/backup/maintenance-prune.sh`: Bereinigung alter Stände vom Wartungsrechner aus.
- `scripts/backup/backup.env.example`: Vorlage für die Sicherungskonfiguration ohne echte Werte.
- `scripts/backup/systemd/hpse-backup.service`: Diensteinheit für die nächtliche Sicherung.
- `scripts/backup/systemd/hpse-backup.timer`: Zeitplan für die nächtliche Sicherung.
- `scripts/control/control.mjs`: Grundgerüst der Befehlshülle mit Trockenlauf.
- `scripts/control/control.test.mjs`: Tests zum Grundgerüst der Befehlshülle.
- `scripts/control/.gitignore`: Hält schlüsselnahe Dateien der Befehlshülle aus dem Repo fern.
- `scripts/setup-admin-pin.mjs`: Hilfsskript zur Ersteinrichtung (PRÜFEN: Verwendung erst nach Freigabe).

## 3. Bereits entschieden

- Dreiteilung: fester Kern, Kundendaten je Kunde getrennt, Erweiterungen nur als dokumentierte Punkte.
- Eigener Server für Schnittstelle, Verwaltung und Datenbank; Datenbank je Kunde getrennt.
- Newsletter ist ein buchbares Zusatzmodul mit eigenem Preis; Mailweg für Formular und Passwort gehört zur Pflichtausstattung.
- Genau ein aktiver Alarmkanal per App; keine Kundendaten und keine Schlüssel in Meldungen.
- Schlüssel liegen nur in der geschützten Befehlshülle auf dem Server; die KI ruft Befehle auf und liest keine Schlüssel.
- Hauptserver als Vorschlag: Tarif mit 4 GB Arbeitsspeicher als Untergrenze; Sicherungsziel als Vorschlag mit Anfüge-Modus.
- Clerk ist ausgeschieden (nach eigener Sicherheitsseite keine EU-Datenhaltung, laut Websuche, gegen das Original zu prüfen, PRÜFEN).
- Besteller-Login ist Anforderung des ersten Kunden (Selbstregistrierung, Anmeldung, Bestellübersicht).
- Bisherige Startpfade bleiben bis zur EU-Entscheidung der geplante Weg (siehe Abschnitt 5).

## 4. Offene Entscheidungen (je mit Empfehlung, falls belegt)

- EU-Mailanbieter: offen; Empfehlung aus dem Raster: zuerst auswerten, K.o.-Liste und Pflicht-Tests beachten, kein Einsatz ohne Vertrags- und Datenortbeleg.
- EU-Hosting als Ersatz: offen; Empfehlung aus dem Raster: nach Mail auswerten, Prototyp mit getrennten Hosts zusammen mit Anmeldung abnehmen.
- Anmeldelösung: offen; Empfehlung aus dem Raster: zuletzt auswerten, Lizenzfrage bei AGPL-Kandidaten vorab an den Anwalt, keine Entscheidung ohne Prototyp mit getrennten Hosts.
- Bisherige Startpfade oder Ersatz: offen; Empfehlung: Einrichtung erst nach der EU-Auswertung oder bewusst als Startpfad entscheiden.
- Sicherungsanbieter und Server-Hoster-Verträge: offen; Empfehlung aus dem Anwaltspaket: Verträge vor dem ersten Kunden.
- Medienablage, Hosting-Ort der eigenen Homepage, Vorschau mit echten Daten, Zusatzmodule: offen; Empfehlung aus dem Plan: entscheiden, sobald sie den Piloten oder den ersten Kunden betreffen.
- Kundenfragen der Bestellplattform (Produkte, Pflege, Mengen, Lieferdetails, Mailadressen, Freischaltung, Gastbestellung, Statusmails, Bilder, Preisschätzung): offen; Empfehlung: vor der Umsetzung mit dem Kunden klären.

## 5. Vorgeschlagene Reihenfolge für morgen (eine Recherche nach der anderen)

Gestützt auf die Zeitleiste im Auswertungsraster, Abhängigkeit zuerst:

1. Mail sichten: Plausibilitätsprüfung, K.o.-Liste ankreuzen, Bewertungstabelle roh füllen.
2. Mail Kosten und Tests: Kostenvorlage mit offiziellen Quellen füllen, Pflicht-Tests als Aufträge an Nick formulieren.
3. Hosting sichten: wie Schritt 1, zusätzlich getrennte Hosts vormerken.
4. Hosting Kosten und Tests: wie Schritt 2, Prototyp mit Anmeldung bündeln.
5. Anmeldung sichten: K.o.-Liste prüfen, Lizenzfrage sofort an den Anwalt geben.
6. Anmeldung Kosten und Prototyp: Prototyp mit getrennten Hosts ist Pflicht, keine Entscheidung ohne ihn.
7. Querschnitt und Abschluss: Gesamtkosten und Konten füllen, Entscheidungsblätter finalisieren, neue Anwaltsfragen an die Sammelliste übergeben.

Jeder Schritt endet mit einem PRÜFEN-Stand. Keine Entscheidung vorziehen, solange ein K.o. offen oder ein Pflicht-Test aussteht.

## 6. Aufgaben für Nick

- App für den Alarmkanal installieren und Thema abonnieren, Empfang bestätigen.
- Konten der bisherigen Startpfade nur bei bewusster Startpfad-Entscheidung anlegen (Team, Zahlung, Schlüssel, Domainprüfung); sonst nach der EU-Auswertung.
- Hauptserver bestellen (Konto, Zahlung, Rechnungsdaten, zweite Stufe, Schlüsselhinterlegung, Standortwahl).
- Sicherungsbox bestellen (Konto, Schlüsselpaare, getrennter Wartungszugang).
- Sicherungskennwort sicher getrennt verwahren (außerhalb des Servers und außerhalb des Repos).
- Anwalt einbinden: Übergabepaket und neue Fragen aus der Sammelliste übergeben, B2B/B2C-Weiche entscheiden.
- Kundenfragen der Bestellplattform mit dem ersten Kunden klären (Abschnitt 4).

## 7. Aufgaben für die KI nach seinen Schritten

- Erst nach Nicks Serverbestellung: Ersteinrichtung in fester Reihenfolge mit je Abnahmekriterium.
- Erst nach Nicks Alarm-Abo: Testmeldung senden und Empfang festhalten.
- Erst nach Nicks Schlüsselablage: nur lesende Prüfungen im Trockenlauf, keine echten Aktionen ohne Freigabe.
- Nach Vorliegen je Recherche: Plausibilitätsprüfung, Bewertungstabellen und Entscheidungsblatt entwerfen, Pflicht-Tests vorbereiten.
- Wiederanlauf-Probe durchführen und protokollieren; über Bestehen entscheidet Nick.

## 8. Offene Altpunkte (nicht vergessen)

- Hauptentwicklungszweig bei der Codeablage entsperren.
- Lokale Branches sichten und zusammenführen oder schließen.
- Support-Anfrage beim Codehoster zum gesperrten Zweig weiterverfolgen.
- PIN- und QR-Rotation (auf später gelegt, Termin offen).
- Sicherungszweig mit Datumskennung löschen (nach bestätigter Sicherung).
- Prototyp-Server auf dem genannten Port abschalten oder neu zuordnen.
- Antwort des Routers zur Sperre des Assistenten bei Kundendaten abwarten und umsetzen.

## 9. Regelhinweis

Für den Assistenten gilt: nie Schlüssel, Zugangsdaten oder Serverzugänge in Eingaben oder Ausgaben; Kundendaten nur beim einen Kunden, der dies schriftlich akzeptiert hat; ab dem zweiten Kunden entfällt dieser Zugang. Details stehen im Gesamtplan und im Anwaltspaket.
