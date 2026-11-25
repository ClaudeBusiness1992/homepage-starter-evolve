# Lokale Einrichtung

`data/` enthält lokale Konfiguration und Laufzeitdaten und gehört nicht ins Repository. Fehlende Konfigurationen werden bei Bedarf aus `config-examples/` angelegt. Bestehende Dateien bleiben erhalten.

Für die erste Admin-Anmeldung im Projektverzeichnis `node scripts/setup-admin-pin.mjs` in einem Terminal ausführen. Die Eingabe wird nicht angezeigt. Das Werkzeug speichert ausschließlich einen gesalzenen scrypt-Hash in der lokalen Konfiguration und entfernt dort ein vorhandenes Klartext-PIN-Feld. Ohne gültigen Hash bleibt die Anmeldung gesperrt. Die lokale Konfiguration sicher sichern; nicht ins Repository aufnehmen.

Für QR-Codes muss die Umgebung `QR_SIGNING_SECRET` bereitstellen. Ein Wechsel des Schlüssels macht bisher ausgegebene QR-Signaturen ungültig.

Für `/api/internal/cron/daily` muss die Umgebung `CRON_SECRET` bereitstellen. Der aufrufende Scheduler übermittelt denselben Wert im Header `X-Cron-Secret`; ohne gültigen Header wird keine Cron-Arbeit ausgeführt. Werte nicht in Dateien des Repositories oder Aufrufprotokollen ablegen.
