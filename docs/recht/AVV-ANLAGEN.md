# AVV-Anlagen — ENTWURF zur anwaltlichen Prüfung

> **Status: Entwurf zur anwaltlichen Prüfung, keine Rechtsberatung.**
> Anlagen zum AVV-Entwurf zwischen [Kundenname] (Verantwortlicher) und [pixel&code — Firmenname, Rechtsform] (Auftragsverarbeiter). Diese Anlagen sind Bestandteil des AVV. Rechtsverweise nur aus dem sicheren Katalog (DSGVO Art. 6, 7, 13, 15 bis 22, 28, 30, 32, 33, 34, 35, 44 ff.; UWG § 7; DDG § 5; TDDDG § 25); alles andere ist **PRÜFEN** mit Markierung **[ANWALT-n]** (eigene Nummerierung dieser Datei). Der Anwalt prüft, korrigiert und gibt frei.
>
> Platzhalter in eckigen Klammern je Kunde und je Anbieterentscheidung ausfüllen. Technische Angaben stammen aus WORKFLOW-PLAN.md V3, DATENKLASSEN.md, KUNDEN-ANLEGEN-CHECKLISTE.md, Newsletter-Konzept, Dienstleister-Übersicht, NEWSLETTER-DATENSCHUTZ.md und NEWSLETTER-API.md (alle Stand 25.11.2026).

---

## Anlage 1 — Liste der Unterauftragsverarbeiter

Grundsatz: Funktionen und Datenbank in der EU als Ziel. Jeder Anbieter mit Kundendaten-Bezug braucht vor Einsatz einen Vertrag im Sinne von Art. 28 DSGVO; bis zur Klärung von Verarbeitungsort, Drittlandbezug und Garantie (Art. 44 ff. DSGVO) kein Einsatz für Kundendaten **[ANWALT-1]**. Änderungen nach dem Genehmigungsverfahren des AVV (§ 6).

| Nr. | Unterauftragsverarbeiter (Platzhalter ergänzen) | Zweck der Verarbeitung | Datenarten (Auszug) | Standort / Verarbeitungsort | Drittlandbezug |
|---|---|---|---|---|---|
| 1 | Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA [ggf. EU-Niederlassung/PRÜFEN] | Hosting und Auslieferung der Kundenseite (Hosting/CDN, Zwischenspeicher, zeitweilige Update-Vorschauen, Domains/Deployments) | Zugriffs- und Auslieferungsdaten (z. B. IP-Adresse, angefragte URLs, Server-Logs), Inhalte der ausgelieferten Seite, projektbezogene Konfiguration; keine Newsletter-Schlüssel in Vorschauen | PRÜFEN: tatsächlicher Verarbeitungsort (Funktionen und Datenbank in der EU als Ziel; Sitz USA nach config/legal.json) — Regionen, Protokolldaten, Supportzugriff klären | PRÜFEN: ob und welche Daten in die USA gelangen; geeignete Garantie nach Art. 44 ff. DSGVO festlegen **[ANWALT-2]** |
| 2 | Resend [genaue Anbieterbezeichnung, Anschrift — PRÜFEN] | Mailversand: Transaktionsmails (Kontaktformular-Benachrichtigung, Double-Opt-in-Bestätigung, Passwort-Zurücksetzen) und bei Buchung Newsletter-Versand (Broadcasts), Webhook-Rückmeldungen (z. B. Rückläufer, Beschwerden) | Absender-/Empfängeradressen, ggf. Vorname, Mailinhalte, Versand- und Zustellereignisse, Spiegel der Versanddaten; führende Nachweiskopie bleibt Kunden-PostgreSQL | PRÜFEN: Verarbeitungsort und DPA-Verfügbarkeit belegen | PRÜFEN: Drittlandtransfer und Garantie festlegen **[ANWALT-3]** |
| 3 | Sicherungsspeicher [Anbieter noch zu wählen — PRÜFEN] | Sicherung von Datenbank, Medien, Konfiguration und nötigen Schlüsseln; Wiederherstellung einzelner Kunden | Sicherungskopien aller Kundendaten inkl. personenbezogener Daten | Ziel: EU-Speicher außerhalb derselben Ausfallzone, mit Löschschutz/Objektsperre (Empfehlung Dienstleister-Übersicht) — PRÜFEN und festlegen | PRÜFEN: Garantie; Schlüssel nur Schreiben, kein Löschen (restic/rclone-Konzept) **[ANWALT-4]** |
| 4 | DNS-Anbieter [z. B. Cloudflare, falls Zone dort liegt; sonst Kunde setzt selbst — PRÜFEN] | DNS-Einträge für Kundendomains, Resend-Verifizierung (SPF/DKIM/DMARC), Vercel-Domainzuordnung | Domain- und Verifizierungsdaten; ggf. Abfragedaten (PRÜFEN: welche personenbezogenen Daten beim DNS-Anbieter anfallen und ob AV-Bezug besteht) | PRÜFEN: Rolle (Auftragsverarbeitung ja/nein), Ort und Vertragserfordernis | PRÜFEN und einordnen **[ANWALT-5]** |
| 5 | Betreiber/Hoster des eigenen Servers [benennen — PRÜFEN] | Betrieb der Infrastruktur: PostgreSQL je Kunde, Daten-Schnittstelle, Editor/Schaltzentrale (Tailscale), Medienablage (falls Server-Variante), Befehlshülle | Alle serverseitigen Kundendaten (Inhalte, Newsletter-Nachweise, Sitzungen, Protokolle, Schlüssel in geschützter Ablage) | PRÜFEN: Rechenzentrumsstandort (EU-Ziel), Fernzugriffe, Supportzugriff | PRÜFEN und Garantie festlegen **[ANWALT-6]** |
| 6 | Externe Überwachung / Alarmkanal [Anbieter noch zu wählen — PRÜFEN] | Prüfung von außen (Erreichbarkeit, Zertifikatsablauf), Meldung über genau einen aktiven Kanal | PRÜFEN: fallen personenbezogene Daten an (z. B. IP-Adressen in Prüf-Logs)? Nur bei AV-Bezug als Unterauftragsverarbeiter führen | PRÜFEN | PRÜFEN **[ANWALT-7]** |

Hinweise:

- Resend-Schlüssel je Kunde mit begrenzten Rechten, Vorschau ohne Schlüssel (Konzept § 4, NEWSLETTER-API.md); Mail-DNS bleibt bei Kunden-Postfach unberührt (WORKFLOW-PLAN § 13a). Rechtebegrenzung je Schlüssel und Webhook-/Broadcast-Details (Idempotenz, Ein-Klick-Abmeldung) sind technisch noch zu belegen — rechtliche Einordnung PRÜFEN **[ANWALT-8]**.
- Vercel-Zugriffsschlüssel projektbezogen begrenzt (Parameter projectId), Generalschlüssel nur in der Befehlshülle, nie in KI-Kontext/Logs (WORKFLOW-PLAN § 2a, § 9, KUNDEN-ANLEGEN-CHECKLISTE.md).
- Mailweg für Kontaktformular und Passwort-Zurücksetzen ist Pflicht-Basis der Phase 1; Newsletter ist Zusatzmodul mit eigenem Preis und eigener Einrichtungsliste (WORKFLOW-PLAN § 4).
- AVVs mit Vercel, Resend und Sicherungsspeicher vor dem ersten Kunden abschließen und dokumentieren (KUNDEN-ANLEGEN-CHECKLISTE.md) **[ANWALT-9]**.
- Änderungen (Hinzufügung/Ersetzung): Ankündigungsfrist [z. B. 14 oder 30 Tage — festlegen], Widerspruchsrecht und -folgen nach AVV § 6 **[ANWALT-10]**.

---

## Anlage 2 — Technische und organisatorische Maßnahmen (TOMs, Art. 32 DSGVO)

Ziel: Vertraulichkeit, Integrität, Verfügbarkeit und Nachvollziehbarkeit der Auftragsverarbeitung, Trennung je Kunde, Schutz vor Doppelversand/-verarbeitung und vorgetäuschter Zustellung. Formulierungen sind technisch beschrieben; Angemessenheit und Vollständigkeit prüft der Anwalt **[ANWALT-11]**. Alle Fristen unten sind Vorschläge aus den Planunterlagen, keine Rechtsaussagen.

### 1. Zugang und Zugriff

- Eigener Server (Editor, Schaltzentrale, Audit, Datenbank) nur über Tailscale; Kundenseiten auf Vercel je eigenes Projekt mit projektbegrenztem Schlüssel; Generalschlüssel nur in der Befehlshülle, KI ruft Befehle auf, liest Schlüssel nie (WORKFLOW-PLAN § 2, § 7, § 9).
- Rollen: Besucher (/), Kunde (/admin), Entwickler (/editor, nur Tailnet-Server, keine Editor-Route auf Vercel-Kundenseiten); jede schreibende Anfrage serverseitig auf Rolle, Kunde, Umgebung und Objekt geprüft (WORKFLOW-PLAN § 3).
- Sitzungen je Host begrenzt; Passwort-Zurücksetzen und Rechteentzug vorgesehen; abgelaufene Sitzungen werden gelöscht (Vorschlag DATENKLASSEN.md: regelmäßiges Löschen spätestens 24 h nach Ablauf; Loginversuche nach 15 min plus kurzer Betriebsfrist — PRÜFEN und festlegen) **[ANWALT-12]**.
- Personal: nur befugtes, auf Vertraulichkeit verpflichtetes Personal mit Kundenbedarf; Zutritts-/Zugangsregeln für Server und Befehlshülle dokumentieren [Ergänzen: wer, Verfahren] **[ANWALT-13]**.

### 2. Trennung je Kunde

- Eigene Datenbank oder eigenes Schema mit eigener Rolle je Kunde; eigener Schnittstellenschlüssel je Kunde; eigener Resend-Schlüssel und eigene Absenderdomain je Kunde; Logs, Suchindex und Werkzeuge halten dieselbe Grenze (WORKFLOW-PLAN § 2, § 7, § 9; Newsletter-Konzept § 4–5).
- Go aktiviert nur das geprüfte Softwarepaket, überträgt keine laufenden Inhalte und überschreibt Kundendaten nicht; Rollback betrifft Softwareversion, nicht Inhalte; Datenbankänderungen nur kompatibel und nach Sicherung (WORKFLOW-PLAN § 8; DATENKLASSEN.md).
- Kein Zugriff eines Kunden auf fremde Kundendaten; Prüfungen nur im eigenen AV-Ausschnitt (AVV § 10).

### 3. Verschlüsselung und Schlüsselverwaltung

- Übertragung: TLS (HTTPS) für Website, Schnittstelle und Admin-Zugänge [Zertifikatsverfahren ergänzen; Ablaufkontrolle inkl. 14-Tage-Warnung aus WORKFLOW-PLAN § 6].
- Speicherung: [Verschlüsselung der Datenbank, Medien und Sicherungen beschreiben — PRÜFEN und ergänzen: Verfahren, Schlüssellänge, Ruhende-Verschlüsselung beim Hoster/Backup] **[ANWALT-14]**.
- Geheimnisse (PIN-Hash, Schlüssel, Token) in geschützter Umgebung/geschütztem Speicher, nie im Repo; Go transportiert keine Geheimnisse; ersetzte Geheimnisse unverzüglich widerrufen und entfernen; keine Geheimnisse in Vorschau, Logs, Berichten oder KI-Verläufen (DATENKLASSEN.md; KUNDEN-ANLEGEN-CHECKLISTE.md).
- Bestätigungs-/Abmeldelinks als zufällige Einmalwerte (nur Prüfwerte gespeichert, z. B. SHA-256), keine Adressen im Klartext in Links; Einmalgebrauch und Befristung (Vorschlag 24 h — PRÜFEN) (NEWSLETTER-API.md, NEWSLETTER-DATENSCHUTZ.md) **[ANWALT-15]**.
- Schlüsselrotation (z. B. Schnittstellen-/Resend-Schlüssel, Sitzungsgeheimnisse): Verfahren und Frist [festlegen — PRÜFEN] **[ANWALT-16]**.

### 4. Eingabekontrolle, Missbrauchs- und Fehlerschutz

- Newsletter-Anmeldung: Double-Opt-in mit Nachweis (Version, Zeitpunkte, Quelle, gekürzte Herkunftskennung); Pflichthäkchen nie vorausgefüllt; Honigtopf-Feld; Ratenbegrenzung je Adresse und Herkunft vor Versand; neutrale Antworten ohne Bestandsverrat; Sperrliste wird durch erneute Anmeldung nicht umgangen (Newsletter-Konzept § 3; NEWSLETTER-API.md § 2).
- Kontakt- und Admin-Formulare: serverseitige Validierung, Upload-Prüfung (wenige Bildformate, Inhaltsprüfung, Größenbegrenzung, Neuerzeugung, keine Ausführungsrechte), Spam-Schutz; Stopp bei fehlenden Pflichtangaben (WORKFLOW-PLAN § 4; legal-checklist.md).
- Kampagnen: feste Kennung, Pflichtprüfung (Betreff, verifizierter Absender, Impressumsangaben, Abmeldelink, gültige Links), Vorschau und Testversand an eigene Kundenadresse, Sendebestätigung als eigener Schritt (nicht rückholbar), Empfängerliste mit Prüfsumme, Doppelversand-Schutz bei Wiederholung (Standprüfung vor erneutem Senden), Versandgrenzen je Kunde und Stopp-Schalter (Newsletter-Konzept § 3–4; NEWSLETTER-API.md § 3) **[ANWALT-17]**.
- Webhooks (Resend): Signaturprüfung, Verwerfung ohne gültige Signatur, Idempotenz über Ereigniskennungen, harte Rückläufer/Beschwerden führen zur Sperre (NEWSLETTER-API.md § 4).

### 5. Protokollierung

- Umfang (Vorschlag): Schnittstellen-Zugriffe (Schlüssel-ID, Kunde, Zeit, Ergebnis ohne Schlüsselwert), Ratenbegrenzungs-Ereignisse, Admin-Speicherungen mit Änderungsverlauf und Rücknahme, Weisungsausführung, Exporte (wer, wann, Umfang), Webhook-Ereignisse mit Kampagnenbezug, Sicherungs-/Restore-Läufe, Pannenmeldungen. Keine Adressen oder Inhalte in Logs und KI-Verläufen (NEWSLETTER-DATENSCHUTZ.md § 6).
- Aufbewahrung: [Fristen je Protokollart festlegen — PRÜFEN; Vorschläge aus DATENKLASSEN.md übernehmen] **[ANWALT-18]**.
- Auswertung: Alarm bei echten Ausfällen über genau einen aktiven Kanal (Live-Ausfall, Zertifikat < 14 Tage, Formularfehler, Backup-Fehler); Ampelzustände inkl. „Unbekannt" mit Zeit der letzten Prüfung; externer Prüfer von anderem Rechner (WORKFLOW-PLAN § 6).

### 6. Sicherung und Wiederanlauf

- Sicherung: Datenbank, Medien, Konfiguration und nötige Schlüssel zusammen wiederherstellbar, verschlüsselt, außerhalb derselben Ausfallzone; Restore einzelner Kunden regelmäßig in leerer Umgebung geübt mit Messung von Zeit und Datenverlust; Backup-Verfall getrennt festgelegt (WORKFLOW-PLAN § 10). Konkrete Ziele (Zeit, tolerierbarer Verlust) und Verfall [festlegen — PRÜFEN] **[ANWALT-19]**.
- Zwischenspeicher: Vercel-Cache hält Besucherseite bei Serverausfall erreichbar; Speichern löst Neuvalidierung aus; kein vorgetäuschter Versand bei Ausfall, sondern Fehler mit sicherem Wiederholungsweg (WORKFLOW-PLAN § 2; NEWSLETTER-API.md § 5).
- Wiederanlauf-Probe vor erstem zahlendem Kunden (eine Seite ohne Editor aus unabhängiger Sicherung wiederherstellen, fehlerhafte Freigabe zurücknehmen, Öffnungszeit erhalten) plus kurzes Runbook (RUNBOOK-WIEDERANLAUF.md, WORKFLOW-PLAN § 10).
- Vorschau mit echten Daten nur befristet für konkrete Abnahme (Zweck/Rechtsgrundlage geklärt, nur Nick, feste Löschfrist, Mail/Webhooks/Tracking gesperrt, keine Kopie in Backups/Logs/KI-Verlauf, belegte Löschung) (WORKFLOW-PLAN § 8; DATENKLASSEN.md).

### 7. Prüf- und Änderungsverfahren

- Vor jedem KI-Eingriff belegter Sicherungspunkt; neue Kunden nur aus freigegebenen Paketkennungen; Kern schreibgeschützt mit zeitlich begrenztem Entsperren über unabhängigen Mechanismus („Template entsperren"); keine Selbstautorisierung der Freigabe-Pipeline (WORKFLOW-PLAN § 7).
- Audit zu drei Zeitpunkten (Design/Kontrast/Überlauf, kaputte Inhalte, Technik/Zertifikate/Testformular) mit ehrlichen Aussagen; rechtlich nur beobachtbare Feststellungen mit Fundstelle und Zeitpunkt, keine Rechtsampel (WORKFLOW-PLAN § 5).
- Gestaffelte Updates (erst eigene Homepage und ein Pilotkunde, dann Gruppen; Stopp bei Fehlern); Kompatibilitätstests inkl. Rollback-Test bei Modelländerungen (WORKFLOW-PLAN § 8–9).

### 8. Löschkonzept (Vorschläge — Festlegung durch Anwalt)

- Unbestätigte Newsletter-Anmeldungen: Vorschlag 7 Tage; bestätigte Kontakte bis Widerruf, danach Sperrliste/Nachweise (NEWSLETTER-DATENSCHUTZ.md § 6).
- Sperrliste und Einwilligungsnachweise: solange erforderlich (Schutz-/Nachweiszweck), kein pauschales Löschen; Rechtsgrund und Höchstfrist PRÜFEN **[ANWALT-20]**.
- Kampagnen/Prüfsummen: Vorschlag 90 Tage nach Übergabe; Zustellereignisse an Sperr-/Nachweiszweck gekoppelt; Export-Dateien nach Übergabe löschen, Protokolle aufbewahren (Frist PRÜFEN); Backups mit eigenem Verfall (NEWSLETTER-DATENSCHUTZ.md § 6; DATENKLASSEN.md) **[ANWALT-21]**.
- Medienvarianten, Exporte, Caches, Logs und Backups in das Löschkonzept aufnehmen (DATENKLASSEN.md).

---

## Sammlung der Anwaltsfragen zu diesen Anlagen

| Nr. | Stelle | Frage an den Anwalt |
|---|---|---|
| ANWALT-1 | Anlage 1, Grundsatz | Einsatzsperre bis zur Klärung von Ort, Drittland und Vertrag je Anbieter bestätigen. |
| ANWALT-2 | Anlage 1, Nr. 1 (Vercel) | Verarbeitungsort, Protokoll-/Supportzugriffe und Drittland-Garantie (Art. 44 ff. DSGVO) klären und DPA beilegen. |
| ANWALT-3 | Anlage 1, Nr. 2 (Resend) | Anbieterangaben, Verarbeitungsort, DPA-Verfügbarkeit und Drittland-Garantie belegen. |
| ANWALT-4 | Anlage 1, Nr. 3 (Backup) | Anbieterwahl, EU-Ort, Verschlüsselung, Backup-Verfall und Restore-Nachweis festlegen. |
| ANWALT-5 | Anlage 1, Nr. 4 (DNS) | Rolle des DNS-Anbieters (AV ja/nein), Datenarten, Ort und Vertragserfordernis einordnen. |
| ANWALT-6 | Anlage 1, Nr. 5 (Server-Hoster) | Hoster benennen; Standort, Zugriffe und Garantie einordnen. |
| ANWALT-7 | Anlage 1, Nr. 6 (Überwachung/Alarm) | Personenbezug prüfen; ggf. als Unterauftragsverarbeiter aufnehmen oder streichen. |
| ANWALT-8 | Anlage 1, Hinweise | Resend-Details (Schlüsselrechte, Broadcast-Idempotenz, Ein-Klick-Abmeldung) rechtlich einordnen. |
| ANWALT-9 | Anlage 1, Hinweise | Unterauftragsverarbeiter-Verträge vor Erst-Einsatz beilegen; Liste je Kunde bestätigen. |
| ANWALT-10 | Anlage 1, Hinweise | Änderungsverfahren (Frist, Widerspruchsfolgen) festlegen. |
| ANWALT-11 | Anlage 2, Einleitung | Angemessenheit und Vollständigkeit der TOMs (Art. 32 DSGVO) bestätigen. |
| ANWALT-12 | Anlage 2, § 1 | Sitzungs-/Protokollfristen (24-h-/15-min-Vorschläge) bestätigen. |
| ANWALT-13 | Anlage 2, § 1 | Personal-/Zutrittsregeln (Rollen vs. Namen, Verfahren) festlegen. |
| ANWALT-14 | Anlage 2, § 3 | Ruhende-Verschlüsselung (Verfahren, Stärke) ergänzen und bestätigen. |
| ANWALT-15 | Anlage 2, § 3 | Einmalwerte (Verfahren, Frist, z. B. 24 h) bestätigen. |
| ANWALT-16 | Anlage 2, § 3 | Schlüsselrotation (Verfahren, Frist) festlegen. |
| ANWALT-17 | Anlage 2, § 4 | Kampagnen-Schutz (Pflichtprüfung, Grenzen, Stopp-Schalter) als TOM bestätigen. |
| ANWALT-18 | Anlage 2, § 5 | Protokollarten und Aufbewahrungsfristen festlegen. |
| ANWALT-19 | Anlage 2, § 6 | Sicherungsziele (Zeit, Verlust) und Backup-Verfall festlegen. |
| ANWALT-20 | Anlage 2, § 8 | Sperrlisten-/Nachweisfristen mit Rechtsgrund festlegen. |
| ANWALT-21 | Anlage 2, § 8 | Kampagnen-, Ereignis-, Export- und Backup-Fristen festlegen. |
