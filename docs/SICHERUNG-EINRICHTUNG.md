# Einrichtung der Sicherung (Entwurf, 25.11.2026)

Status: Entwurf. Skripte unter `scripts/backup/` sind nicht ausgeführt und nur als Trockenlauf geprüft (Syntax, Aufrufplan). Ziel: Hetzner Storage Box BX11 (siehe `SICHERUNG-ZIEL.md`). Keine Schlüssel, Passwörter oder Zugangsdaten gehören ins Repo.

## Rollen
- **Hauptserver (netcup):** führt die nächtliche Sicherung aus. Darf nur anfügen, nie löschen.
- **Sicherungsbox (Hetzner):** nimmt verschlüsselte Sicherungen an.
- **Wartungsrechner (dein Arbeitsserver oder ein anderes eigenes Gerät, nicht der Hauptserver):** räumt alte Stände auf, mit eigenem Schlüssel ohne Anfüge-Sperre.

## Schritte (Nick, einmalig; ich bereite je Schritt die Befehle vor)
1. BX11 bestellen, EU-Standort wählen, Zugriff per SSH/SFTP in der Console aktivieren.
2. Auf dem Hauptserver ein Schlüsselpaar nur für die Sicherung erzeugen (Datei `/etc/hpse/id_backup_append`, Rechte 600). Den öffentlichen Teil auf der Box in `.ssh/authorized_keys` eintragen, versehen mit dem erzwungenen Befehl für den Anfüge-Modus. Genauer Wortlaut: gegen die offizielle Hetzner-Dokumentation bestätigen (PRÜFEN), Community-Quellen nennen `rclone serve restic --stdio --append-only` mit Repository-Verzeichnis.
3. Auf dem Wartungsrechner ein zweites Schlüsselpaar erzeugen und ohne Anfüge-Sperre hinterlegen.
4. restic-Passwort erzeugen (lang, zufällig). Eine Kopie in `/etc/hpse/restic-passwort` auf dem Hauptserver (Rechte 600) und eine getrennt offline (Passwortmanager und Ausdruck). Ohne dieses Passwort sind alle Sicherungen unbrauchbar.
5. Repository anlegen (`restic init`) und `/etc/hpse/backup.env` nach Vorlage `scripts/backup/backup.env.example` füllen.
6. Trockenlauf von `backup.sh`, dann erste Sicherung mit `--ausfuehren`.
7. Zeitplan aktivieren (`scripts/backup/systemd/`): nachts 03:30 mit zufälliger Verzögerung, geringe Priorität.
8. Wiederanlauf-Probe: `restore-test.sh` und der Löschversuch.

## Pflichttests vor Verlass (Teil der Wiederanlauf-Probe)
- Löschversuch mit dem Server-Schlüssel (`restic forget --prune` und direktes Löschen per SFTP) muss scheitern.
- Rücksicherung eines Dumps in eine Wegwerf-Datenbank und Stichprobe der Medien.
- Alarm bei ausbleibender Sicherung: kommt eine Meldung über ntfy? Dafür muss die externe Überwachung später prüfen, ob das Datum der letzten Sicherung frisch ist.

## Aufbewahrung (Vorschlag)
14 tägliche, 8 wöchentliche, 12 monatliche Stände. Löschfristen für personenbezogene Daten in Sicherungen mit dem Anwalt abstimmen (Anwaltspaket, Löschkonzept); gelöschte Daten verschwinden aus älteren Ständen erst mit deren Ablauf.

## Offen
- Wortlaut des erzwungenen Befehls und restic-Verbindungsvariante (SFTP oder rclone) gegen die offizielle Hetzner-Dokumentation bestätigen.
- Wo genau der Wartungsrechner steht und wer den zweiten Schlüssel verwahrt.
- Medien-Verzeichnis und Datenbanknamen sind Platzhalter.
