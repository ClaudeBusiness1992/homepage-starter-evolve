# Einrichtung Alarmkanal (ntfy) – Entwurf, 25.11.2026

Entscheidung (Nick, 25.11.2026): Genau ein aktiver Alarmkanal, ntfy. Gemeldet werden nur Zustände wie "Sicherung ausgeblieben" oder "Kundenseite nicht erreichbar", keine Kundendaten und keine Schlüssel.

## Schritte für Nick (etwa 5 Minuten)

1. App "ntfy" auf dem Handy installieren (iOS oder Android).
2. In der App ein Thema abonnieren. Der Themenname liegt als Wert `NTFY_TOPIC` in `~/.config/hpse/schluessel.env` (Datei mit Rechten 600). Den Namen nirgends posten: Wer ihn kennt, kann Meldungen lesen und senden. Befehl zum Anzeigen: `grep NTFY_TOPIC ~/.config/hpse/schluessel.env`
3. Sag mir "ntfy abonniert". Dann sende ich eine Testmeldung und du bestätigst, dass sie ankommt.

## Hinweise

- Der öffentliche Dienst ntfy.sh läuft nicht auf deinem Server und fällt nicht mit ihm aus.
- Das Thema ist ein Geheimnis, kein echter Zugriffsschutz. Ein Wechsel des Themas ist der Rückweg bei Verdacht (neuer Name, neu abonnieren).
- PRÜFEN: Bedingungen, Grenzen und Datenschutzhinweise von ntfy.sh sind nicht abgerufen. Für den Anwalt als Dienst mit Bezug zu Betriebsmeldungen aufnehmen (Übergabepaket ANWALT-7).
- Ersatzweg bei Bedarf: Telegram-Bot.
