# Lokale Einrichtung

`data/` enthält lokale Konfiguration und Laufzeitdaten und gehört nicht ins Repository. Fehlende Konfigurationen werden bei Bedarf aus `config-examples/` angelegt. Bestehende Dateien bleiben erhalten.

Vor dem Merge dieses Sicherheitsstands das gesamte lokale `data/`-Verzeichnis sichern, insbesondere Datenbank, Konfiguration und Rechte-Datei. Git entfernt die bisher verfolgten Dateien beim Merge aus bestehenden Checkouts. Nach dem Merge die benötigten Dateien aus der Sicherung wiederherstellen, bevor die Anwendung gestartet wird.

Die bisherige PIN und der bisherige QR-Schlüssel gelten als öffentlich und müssen durch neue Werte ersetzt werden. Ein vorhandenes lokales `qrSecret`-Feld wird nicht mehr verwendet und sollte aus der Konfiguration entfernt werden.

Server, Build und Einrichtungsskript verwenden das Arbeitsverzeichnis des Prozesses als Projektwurzel. Bei abweichendem Arbeitsverzeichnis muss `PROJECT_ROOT` für alle drei auf denselben absoluten Projektpfad gesetzt sein; dort liegen auch `data/` und `config-examples/`.

Für die erste Admin-Anmeldung im Projektverzeichnis `node scripts/setup-admin-pin.mjs` in einem Terminal ausführen. Die Eingabe wird nicht angezeigt. Das Werkzeug speichert ausschließlich einen gesalzenen scrypt-Hash in der lokalen Konfiguration und entfernt dort ein vorhandenes Klartext-PIN-Feld. Ohne gültigen Hash bleibt die Anmeldung gesperrt. Die lokale Konfiguration sicher sichern; nicht ins Repository aufnehmen.

Die PIN muss aus 6 bis 8 Ziffern bestehen. Für QR-Codes muss die Umgebung `QR_SIGNING_SECRET` bereitstellen; nach Abzug führender und abschließender Leerzeichen muss der Wert mindestens 32 Zeichen lang sein. Ein Wechsel des Schlüssels macht bisher ausgegebene QR-Signaturen ungültig.

Für `/api/internal/cron/daily` muss die Umgebung `CRON_SECRET` bereitstellen. Der aufrufende Scheduler übermittelt denselben Wert im Header `X-Cron-Secret`; ohne gültigen Header wird keine Cron-Arbeit ausgeführt. Werte nicht in Dateien des Repositories oder Aufrufprotokollen ablegen.
