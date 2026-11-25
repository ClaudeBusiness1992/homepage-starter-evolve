# Server-Bestellung und Ersteinrichtung (Hauptserver)

Stand: 26.11.2026. Grundlage: `docs/WORKFLOW-PLAN.md` V3, `docs/DATENKLASSEN.md`, `docs/MIGRATION-POSTGRES.md`, `docs/RUNBOOK-WIEDERANLAUF.md`, `docs/SICHERUNG-EINRICHTUNG.md`, `docs/SICHERUNG-ZIEL.md`, `docs/EINRICHTUNG-ALARM.md`, `docs/SCHALTZENTRALE.md`. Planung, keine Umsetzung. Preise nur dort genannt, wo sie in den vorhandenen Dokumenten belegt sind.

## Teil A – Bestellung (Nick)

Empfehlung vorweg: Tarif Lite 1 (2 vCore, 4 GB RAM, 80 GB SSD). Nano (2 GB) ist laut Plan die knappe Alternative. Belegte Werte aus `docs/SICHERUNG-ZIEL.md`: Lite 1 5,86 € im Monat inkl. Steuer, 6 Monate Laufzeit; nano und pico verworfen. Erweiterung bis 4 TB laut Nick, nicht geprüft (PRÜFEN).

| Entscheidung | Empfehlung | Bemerkung |
|---|---|---|
| Tarif | Lite 1 | 4 GB RAM als Untergrenze für PostgreSQL, Schnittstelle, Editor/Admin und Sicherung auf einem Host; nano nur knappe Alternative |
| Laufzeit und Preis | Nur belegte Werte übernehmen | Lite 1: 5,86 €/Monat inkl. Steuer, 6 Monate (Quelle: `SICHERUNG-ZIEL.md`); aktuelle Preise und Laufzeitoptionen am Bestelltag in der Bestellmaske prüfen und festhalten (PRÜFEN) |
| Standort | EU | Pflicht aus Plan (Funktionen und Datenbank in der EU, Auftragsverarbeitung); EU-Standort in der Bestellmaske wählen und notieren |
| Betriebssystem-Image | Aktuelles LTS-Server-Image, minimal | Genaue Versionsbezeichnung erst am Bestelltag aus der Maske übernehmen (PRÜFEN); kein Desktop, keine Zusatzsoftware des Anbieters |
| Zugang | SSH-Schlüssel, kein Passwort-Login | Schlüsselpaar lokal erzeugen, nur öffentlichen Teil hinterlegen; Root-Passwort nach Einrichtung sperren bzw. nicht verwenden |
| Anbieterseitige Snapshots/Backups | Optional, kein Ersatz für eigene Sicherung | Eigene Sicherung (restic auf Hetzner Storage Box, Anfüge-Modus, siehe `SICHERUNG-EINRICHTUNG.md`) bleibt führend; Anbieter-Snapshot nur als kurzfristiger Rückweg vor riskanten Schritten; Löschbarkeit und Aufbewahrung prüfen (PRÜFEN) |
| Kontoabsicherung | Zweite Stufe aktivieren | Nach Bestellung im Kundenkonto aktivieren; Wiederherstellungscodes getrennt ablegen |
| Rechnungsdaten | Firmen-/Rechnungsdaten prüfen | Vor Abschluss prüfen; Beleg ablegen |

Reihenfolge:

1. Konto anlegen, zweite Stufe aktivieren, Rechnungsdaten eintragen.
2. Tarif Lite 1, EU-Standort, LTS-Image wählen.
3. Öffentlichen SSH-Schlüssel hinterlegen, Bestellung abschließen.
4. Zugangsdaten (Vertragsnummer, IP, Benutzer) notieren; Tailscale-Anmeldung für später bereitlegen.
5. KI melden: Server bereit, IP und Benutzer bekannt. Erst danach beginnt Teil B.

Was Nick selbst tun muss: Konto, Zahlung, Schlüsselhinterlegung, zweite Stufe, Rechnungsdaten, Tailscale-Anmeldung am Server (Einwilligung/Bestätigung). Was die KI erst danach tun darf: alles in Teil B (Erstzugang prüfen, Benutzer, SSH, Firewall, Updates, Tailscale-Beitritt, Zeit, Anmeldeschutz, PostgreSQL, Reverse-Proxy, Node, Dienste, Verzeichnisse, Limits, ntfy, Sicherung, Wiederanlauf-Probe).

## Teil B – Ersteinrichtung (feste Reihenfolge)

Jeder Schritt endet erst bei erfülltem Abnahmekriterium. Alle Befehle mit Platzhaltern in spitzen Klammern, z. B. `<BENUTZER>`, `<SERVER-IP>`, `<DOMAIN>`.

### B1 Erstzugang

Vorgehen: Erstanmeldung mit hinterlegtem Schlüssel prüfen.

Beispiel:

```bash
ssh -i <PRIVATER-SCHLUESSEL> <ERSTBENUTZER>@<SERVER-IP>
```

Abnahme: Anmeldung mit Schlüssel gelingt; Passwort-Anmeldung ist nicht nötig.

### B2 Benutzer ohne Root

Vorgehen: Eigenen Arbeitsbenutzer anlegen, in Verwaltungsgruppe aufnehmen, eigenen öffentlichen Schlüssel hinterlegen, Root-Direktlogin sperren.

Abnahme: Anmeldung als `<BENUTZER>` mit Schlüssel gelingt; direkte Root-Anmeldung per SSH wird abgewiesen.

### B3 SSH-Härtung

Vorgehen: Passwort- und Challenge-Response-Authentifizierung abstellen, Root-Login verbieten, nur den Arbeitsbenutzer zulassen, Konfiguration prüfen und Dienst neu laden.

Abnahme: `sshd -T` zeigt die gehärteten Werte; Anmeldung gelingt nur mit Schlüssel als `<BENUTZER>`.

### B4 Systemupdates und automatische Sicherheitsupdates

Vorgehen: Paketlisten aktualisieren, alle Updates einspielen, automatische Sicherheitsupdates aktivieren, Neustart bei Kernelbedarf einplanen.

Abnahme: Kein ausstehendes Sicherheitsupdate; Timer/Dienst für automatische Updates ist aktiv.

### B5 Firewall

Vorgehen: Standardrichtlinie eingehend verwerfend; öffentlich nur das Nötige öffnen (SSH während Einrichtung, danach nur 80/443 für die Schnittstelle); Verwaltung (SSH, alle internen Dienste) nur über Tailscale zulassen.

Abnahme: Regelliste zeigt Default-Deny eingehend; von außen sind nur die freigegebenen Ports erreichbar; SSH ist nach Tailscale-Beitritt von außen ohne Tailnet nicht mehr erreichbar (PRÜFEN am konkreten Host, siehe Teil C).

### B6 Tailscale-Beitritt

Vorgehen: Tailscale installieren, Server mit Nicks Konto anmelden, Host im Admin-Bereich bestätigen und benennen, Zugriffsregeln eng fassen.

Abnahme: Server erscheint im Tailnet; Verwaltung (SSH) über den Tailnet-Namen gelingt; Fremdgeräte haben keinen Zugriff.

### B7 Zeit und Protokolle

Vorgehen: Zeitzone auf Europe/Berlin setzen, Zeitabgleich prüfen, dauerhafte Protokollierung aktivieren und Aufbewahrung festlegen.

Abnahme: `timedatectl` zeigt korrekte Zeit und synchronisierten Status; Protokolle über Neustart hinweg vorhanden.

### B8 Schutz gegen Dauer-Anmeldeversuche

Vorgehen: Rate-Limit gegen Wiederholungsversuche einrichten (z. B. Sperre nach wenigen Fehlversuchen), Sperr- und Freigabezeiten festlegen.

Abnahme: Wiederholte Fehlanmeldungen führen zu zeitweiliger Sperre; erfolgreiche Anmeldung des berechtigten Benutzers bleibt möglich (PRÜFEN: konkretes Werkzeug am gewählten Image).

### B9 PostgreSQL

Vorgehen: PostgreSQL aus Systemquellen installieren; Dienst nur auf `localhost` binden; pro Kunde eigene Datenbank und eigene Rolle anlegen (Zielmodell aus `MIGRATION-POSTGRES.md`); Mindestrechte (nur eigene Datenbank, kein Superuser, keineROLLE für andere Kunden); getrennte Sicherungsrolle mit nur Leserecht für Dumps; Zugangsdaten außerhalb des Repos in geschützter Datei (Rechte 600), Passwort per `.pgpass` des Sicherungsbenutzers (siehe `backup.env.example`).

Beispiel (Platzhalter):

```sql
CREATE ROLE <KUNDENROLLE> WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
CREATE DATABASE <KUNDENDATENBANK> OWNER <KUNDENROLLE>;
```

Abnahme: Verbindung nur über `localhost` möglich; Kundenrolle sieht nur eigene Datenbank; Sicherungsrolle kann Dumps erzeugen, aber keine Daten ändern; keine Zugangsdaten im Repo.

### B10 Reverse-Proxy mit Zertifikat für die Schnittstellen-Domain

Vorgehen: Reserve-Proxy nur für die Schnittstellen-Domain (`<DOMAIN>`) einrichten; TLS-Zertifikat automatisch ausstellen und erneuern; nur die engen Lese-/Schreibwege aus dem Migrationsplan weiterleiten; alle übrigen Pfade sperren; Sicherheitsköpfe und Ratenbegrenzung setzen.

Abnahme: `https://<DOMAIN>/` antwortet mit gültigem Zertifikat und automatischer Erneuerung; unzulässige Pfade werden abgewiesen.

### B11 Node-Laufzeit

Vorgehen: Node-Laufzeit in der für den Kern benötigten LTS-Version installieren (Version vor Installation aus dem Projekt festlegen, PRÜFEN); Paketquellen des Systems bevorzugen.

Abnahme: `node --version` entspricht der festgelegten Version; keine zweite parallele Node-Installation.

### B12 Dienste als eingeschränkte systemd-Einheiten

Vorgehen: Je Dienst eine eigene Einheit mit eigenem Systembenutzer, ohne Root-Rechte, mit engem Dateizugriff, Speicher- und Prozessgrenzen; automatischer Neustart bei Absturz; nur über Tailscale bzw. lokalen Socket erreichbar, außer der öffentliche Schnittstellenweg.

Abnahme: Alle Einheiten laufen unter eigenem Benutzer ohne Root; `systemctl status` zeigt aktiv; nach Prozessende startet der Dienst neu.

### B13 Verzeichnisstruktur

Vorgehen: Feste Orte anlegen: Medien unter `/srv/hpse/media`, Dumps unter `/var/backups/hpse/dumps`, Konfiguration ohne Schlüssel unter `/etc/hpse/config-ohne-schluessel`, Schlüssel unter `/etc/hpse/` mit Rechten 600 (Vorlage: `scripts/backup/backup.env.example`).

Abnahme: Verzeichnisse vorhanden mit korrektem Besitzer und Rechten; keine Schlüssel in Repo oder Protokollen.

### B14 Ressourcenlimits für 4 GB RAM

Vorgehen: Speicher- und Verbindungsgrenzen an 4 GB ausrichten: PostgreSQL-Puffer und Verbindungen konservativ, Pool je Serverprozess begrenzt, systemd-Speichergrenzen je Dienst; Auslagerungsverhalten beobachten.

Abnahme: Unter typischer Last kein Speichermangel; konkrete Pool- und Pufferwerte aus Pilot messen und hier nachtragen (PRÜFEN).

### B15 Anbindung des ntfy-Alarms

Vorgehen: Themenname als `NTFY_TOPIC` in geschützter Datei auf dem Server hinterlegen; nur Betriebsmeldungen ohne Kundendaten und ohne Schlüssel senden (siehe `docs/EINRICHTUNG-ALARM.md`); Testmeldung auslösen und Empfang auf Nicks Handy bestätigen lassen.

Abnahme: Testmeldung kommt auf Nicks Gerät an; Thema steht nirgends im Repo.

### B16 Einbau der Sicherungsskripte aus scripts/backup

Vorgehen: Skripte aus `scripts/backup/` auf den Server übernehmen (kein Repo als Sicherungsquelle nötig); `/etc/hpse/backup.env` nach `backup.env.example` füllen; Schlüssel `/etc/hpse/id_backup_append` (600) und restic-Passwortdatei anlegen; Trockenlauf, dann erste Sicherung mit `--ausfuehren`; Timer aus `scripts/backup/systemd/` aktivieren (nachts 03:30 mit Zufallsverzögerung).

Abnahme: Trockenlauf fehlerfrei; erste Sicherung erfolgreich; Timer aktiv und nächster Laufzeitpunkt gesetzt.

### B17 Wiederanlauf-Probe nach dem Runbook

Vorgehen: Probe aus `docs/RUNBOOK-WIEDERANLAUF.md` in leerer isolierter Umgebung: unabhängige Sicherung wählen, Datenbank/Medien/Konfiguration wiederherstellen, Seite ohne Editor aufrufen, Öffnungszeit-Erhalt prüfen, fehlerhafte Freigabe auf kompatible Vorversion zurücknehmen, Messprotokoll ausfüllen.

Abnahme: Lesbare Seite samt Medien ohne Editor; Vorversion aktiviert; Öffnungszeit belegt erhalten; Zeiten und Datenverlust dokumentiert; Nick entscheidet über Bestehen.

## Teil C – Abnahmetests

| Nr. | Test | Erwartetes Ergebnis |
|---|---|---|
| C1 | Externer Portscan des Servers | Nur 80/443 offen; kein Datenbankport, keine internen Dienste sichtbar |
| C2 | SSH nur mit Schlüssel | Anmeldung mit Schlüssel als `<BENUTZER>` gelingt; Passwort-Anmeldung und Root-Login werden abgewiesen |
| C3 | Datenbank von außen nicht erreichbar | Verbindungsversuch auf den Datenbankport von außen schlägt fehl; Zugriff nur über `localhost` auf dem Server |
| C4 | Zertifikat gültig | `https://<DOMAIN>/` zeigt gültige Kette, ausreichende Restlaufzeit, automatische Erneuerung belegt |
| C5 | Neustart-Test | Nach `reboot` starten alle Dienste automatisch; Seite, Schnittstelle und Sicherungstimer sind aktiv |
| C6 | Sicherung läuft, Löschversuch scheitert | `backup.sh --ausfuehren` meldet OK; `restic forget --prune` und direktes Löschen mit dem Serverschlüssel scheitern (Anfüge-Modus); `restore-test.sh` zeigt lesbare Dumps |
| C7 | Alarm kommt an | Testmeldung über ntfy erreicht Nicks Gerät; keine Kundendaten in der Meldung |

## Teil D – Aufgabenteilung

| Aufgabe | Nick | KI |
|---|---|---|
| Konto, Zahlung, Rechnungsdaten, zweite Stufe | selbst | – |
| Tarif, Standort, Image, Schlüsselhinterlegung, Bestellung | selbst | – |
| Tailscale-Anmeldung und Bestätigung | selbst | vorbereiten, prüfen |
| B1–B17 Einrichtung auf dem Server | Zugang bereitstellen, bestätigen | ausführen und je Abnahmekriterium belegen |
| ntfy-App installieren und abonnieren | selbst | Testmeldung senden |
| Sicherung: Box bestellen, Schlüsselpaare, Passwort | selbst (Box, Passwörter) | Befehle vorbereiten, Einbau prüfen |
| Wiederanlauf-Probe | über Bestehen entscheiden | durchführen und protokollieren |
| Abnahmetests C1–C7 | bei Alarm/Nutzeraktionen mitwirken | durchführen und Ergebnisse festhalten |

## Teil E – Offene PRÜFEN-Punkte und Klärung am Bestelltag

1. Aktuelle Tarifpreise und Laufzeitoptionen in der Bestellmaske gegen die belegten Werte (Lite 1 5,86 €/Monat inkl. Steuer, 6 Monate) prüfen.
2. Speichererweiterung bis 4 TB (Nicks Angabe, nicht geprüft) und Preis klären.
3. Genaue Image-Bezeichnung (LTS-Version) aus der Maske übernehmen.
4. Anbieterseitige Snapshot-/Backup-Option: Kosten, Aufbewahrung, Löschbarkeit im Verhältnis zur eigenen restic-Sicherung.
5. Erzwungener SSH-Befehl für Anfüge-Modus und restic-Variante (SFTP oder rclone) gegen offizielle Hetzner-Dokumentation bestätigen (aus `SICHERUNG-EINRICHTUNG.md`).
6. ntfy.sh-Bedingungen, Grenzen und Datenschutzhinweise abrufen (aus `EINRICHTUNG-ALARM.md`); Anwaltspaket ANWALT-7/ANWALT-10 beachten.
7. Ressourcenwerte für 4 GB RAM (PostgreSQL-Puffer, Poolgrößen, systemd-Limits) im Pilot messen und nachtragen.
8. Konkretes Werkzeug gegen Dauer-Anmeldeversuche am gewählten Image prüfen.
9. Node-LTS-Version aus dem Projektstand festlegen.
10. Schnittstellen-Domain und Zertifikatsverfahren (Ausstellung, Erneuerung) festlegen; Hinweis: Schritt-für-Schritt-Anleitung für Nick entsteht später im Chat, dieses Dokument ist nur die Grundlage.
