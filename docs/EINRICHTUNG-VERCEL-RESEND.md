# Einrichtung Vercel und Resend – Anleitung für den Morgen (26.11.2026)

Vorbereitet ist: die Schlüsseldatei als leere Vorlage unter `~/.config/hpse/schluessel.env` (Rechte 600, Ordner 700, außerhalb des Repos), das Grundgerüst der Befehlshülle mit Trockenlauf (`scripts/control/`), das Newsletter-Konzept, die Dienstleisterübersicht und die Kunden-anlegen-Checkliste. Dein Teil sind nur die Schritte, die ein Mensch machen muss: Konten, Zahlung, Schlüssel erzeugen und die Browser-Freigabe der MCP-Verbindungen.

Wichtig: Schlüssel nie in einen Chat einfügen. Nur in die Datei schreiben.

## A. Vercel (etwa 15 Minuten)

1. Im Vercel-Dashboard ein Team anlegen oder das vorhandene Team auf Pro stellen und Zahlungsdaten hinterlegen. Kosten laut Vercel: 20 US-Dollar je Platz und Monat (siehe Plan Abschnitt 2a).
2. Team-ID notieren: Team, Einstellungen, Allgemein.
3. Generalschlüssel erzeugen: Konto-Einstellungen, Tokens, neuen Token anlegen. Geltungsbereich: nur dieses Team. Ablaufdatum setzen (zum Beispiel 90 Tage) und im Kalender vermerken.
4. In die Datei `~/.config/hpse/schluessel.env` bei `VERCEL_TOKEN=` und `VERCEL_TEAM_ID=` eintragen. Befehl zum Öffnen: `nano ~/.config/hpse/schluessel.env`
5. MCP-Verbindung (optional, für Gespräche mit mir): `claude mcp add --transport http --scope local vercel https://mcp.vercel.com`. Danach in Claude Code `/mcp`, den Eintrag `vercel` wählen und im Browser freigeben.

## B. Resend (etwa 15 Minuten)

1. Konto anlegen und den Tarif Pro buchen (20 US-Dollar im Monat, 50.000 Mails, 10 Domains).
2. API-Schlüssel erzeugen: Dashboard, API-Keys, neuen Schlüssel anlegen, Name zum Beispiel `hpse-huelle`. Für das Anlegen von Domains und weiteren Schlüsseln braucht der Schlüssel volle Rechte (ungeprüft: genaue Bezeichnung der Berechtigung im Dashboard, wird beim Anlegen sichtbar).
3. In `~/.config/hpse/schluessel.env` bei `RESEND_API_KEY=` eintragen.
4. Auftragsverarbeitungsvertrag (DPA) im Resend-Dashboard herunterladen und ablegen (laut Resend-Dokumentation im Bereich der Dokumente).
5. MCP-Verbindung (optional): `claude plugin install resend@claude-plugins-official`, danach in Claude Code `/mcp`, Eintrag `resend` wählen und im Browser freigeben. Alternative ohne Plugin: `claude mcp add --transport http --scope local resend https://mcp.resend.com/mcp`.
6. Erste Absenderdomain (pixel&code): Ich lege sie per API an, sobald der Schlüssel liegt. Die DNS-Einträge, die Resend dafür nennt, müssen im DNS deiner Domain gesetzt werden (bei Cloudflare per API durch mich, sonst von dir).

## C. Danach

Sag mir "Schlüssel liegen". Ich prüfe dann nur, ob die Werte gesetzt sind und das richtige Format haben, ohne sie auszugeben, und mache zwei lesende Tests: Vercel-Projekte und Resend-Domains auflisten. Erst danach schalte ich in der Befehlshülle die ersten echten Aktionen frei, immer erst im Trockenlauf.

## D. Was bewusst nicht dabei ist

- Sicherungsspeicher, Überwachung und Alarmkanal (siehe `HPSE-DIENSTLEISTER-20261125.md`, Abschnitt 6).
- Kundendomains und DNS-Umzüge.
- PIN und QR-Schlüssel der Homepage (von dir auf später gelegt).
