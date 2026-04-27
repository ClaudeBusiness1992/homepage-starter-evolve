# Buchungs-Live-Sync mit Google Calendar — Setup

Optionales Feature des Booking-Add-ons. Wenn aktiviert, werden Buchungen direkt
als Termin in einen Google Calendar geschrieben. Kunde bekommt automatisch eine
Kalender-Einladung per E-Mail.

**Ohne Live-Sync:** Buchungen werden per `mailto:`-Link an die hinterlegte E-Mail
gesendet (kein Backend nötig). Funktioniert sofort.

**Mit Live-Sync:** Vercel-Function schreibt Termin in Google Calendar via
Service-Account-Authentifizierung.

---

## Was kostet das im Betrieb?

- Google Calendar API: gratis (1 Mio. Requests/Tag Free-Tier)
- Vercel Serverless Functions: gratis (Hobby-Tier reicht für ~100.000
  Buchungen/Monat)
- Service-Account: gratis
- → **Laufende Kosten: 0 €** für jeden realistischen Small-Business Use-Case

---

## Setup pro Kunde (~15 Minuten)

### 1. Service-Account in Google Cloud erstellen

1. Login bei https://console.cloud.google.com
2. Projekt erstellen oder bestehendes auswählen
3. **APIs & Services → Library** → "Google Calendar API" suchen → **Enable**
4. **APIs & Services → Credentials** → **Create Credentials → Service account**
5. Name: z.B. `booking-bot`, Beschreibung: `Schreibt Buchungen in Calendar`
6. Rolle: nichts auswählen (Calendar-Zugriff per Calendar-Sharing)
7. **Done**

### 2. Schlüssel erstellen

1. Service-Account in Liste anklicken
2. Tab **Keys** → **Add Key → Create new key → JSON**
3. JSON-Datei wird heruntergeladen — diese sicher aufbewahren

### 3. E-Mail-Adresse des Service-Accounts notieren

In der JSON-Datei steht `client_email`, z.B.
`booking-bot@projekt-id.iam.gserviceaccount.com`

### 4. Google Calendar des Kunden vorbereiten

1. https://calendar.google.com → linke Sidebar → **+ Andere Kalender → Neuen
   Kalender erstellen** → Name z.B. "Buchungen"
2. Sobald erstellt: Kalender in Sidebar antippen → **Settings**
3. Unter **Share with specific people**: Service-Account-E-Mail einfügen
4. Berechtigung: **Make changes and manage sharing** (oder mindestens "Make
   changes to events")
5. Calendar-ID kopieren (steht weiter unten unter "Integrate calendar"). Format:
   `xxx@group.calendar.google.com`

### 5. In Vercel als Environment Variables hinterlegen

1. Vercel-Dashboard → Projekt → **Settings → Environment Variables**
2. Variable 1:
   - Name: `GOOGLE_SA_JSON`
   - Value: kompletter Inhalt der JSON-Datei (alles in eine Zeile, oder mehrzeilig
     ist auch ok). Vercel akzeptiert beides.
   - Environment: **Production** (und ggf. Preview)
3. Variable 2:
   - Name: `GOOGLE_CALENDAR_ID`
   - Value: die Calendar-ID aus Schritt 4
   - Environment: Production
4. Redeploy nach dem Speichern auslösen.

### 6. Im CMS aktivieren

1. https://homepage-starter-evolve.vercel.app/admin/
2. **Erweiterungen / Add-ons → Add-ons aktivieren** → Häkchen bei
   "📋 Online-Buchung"
3. **Buchung — Konfiguration** öffnen → "🔄 Live-Sync mit Google Calendar"
   anhaken
4. Optional: Calendar-ID im Feld eintragen (dann hat config Vorrang vor ENV-VAR)
5. Speichern → Vercel deployt → Live.

---

## Bot-Schutz (eingebaut)

Die Booking-Function hat drei Schutzmechanismen gegen Spam:

1. **Honeypot:** unsichtbares Feld, das Menschen nicht ausfüllen, Bots aber
   schon. Wird ignoriert (200-Antwort, aber keine Aktion).
2. **Time-Check:** Formular muss mindestens 3 Sekunden auf der Seite gewesen
   sein, bevor abgesendet wird.
3. **Rate-Limit:** max. 5 Anfragen pro IP-Adresse pro Stunde.

Diese Maßnahmen halten Standard-Spam-Bots ab. Bei gezielten Angriffen müsste
zusätzlich reCAPTCHA oder Vercel Edge-Middleware ergänzt werden.

---

## Was bei Buchung passiert

1. Kunde füllt Formular aus → Submit
2. Frontend POST `/api/booking` mit JSON
3. Vercel-Function:
   1. Rate-Limit / Honeypot / Time-Check
   2. JWT signieren mit Service-Account Private Key
   3. Access-Token von Google holen
   4. Event im Calendar erstellen, Kunde als Attendee
   5. Google sendet Einladung per E-Mail an Kunden
4. Frontend zeigt Erfolgsmeldung + ICS-Download als Bonus

---

## Andere Kalender-Anbieter

| Anbieter | Status |
|---|---|
| Google Calendar | ✅ vollständig per Service-Account |
| Microsoft Outlook / 365 | 🟡 möglich via Microsoft Graph API (gleiches Konzept, eigene Function nötig) |
| Apple iCloud | 🔴 keine offizielle public API. Workaround: ICS-Feed (one-way push), CalDAV (komplex, fragil) |
| Andere Calendar-Apps | ✅ via ICS-Feed-Subscription (Read-only Sync) |

Outlook-Integration kann analog gebaut werden (`api/booking-outlook.js` + neuer
Toggle). Für Apple Calendar bleibt der `.ics`-Download die robuste Lösung.

---

## Troubleshooting

**„Fehler beim Erstellen des Termins"**
- Vercel-Logs prüfen (Vercel-Dashboard → Functions → booking)
- Häufig: Service-Account hat keine Schreibrechte am Calendar → in Google
  Calendar Settings → Sharing prüfen.
- Oder: `GOOGLE_SA_JSON` ist nicht korrekt eingefügt (Anführungszeichen, Escapes
  beachten).

**„Zu viele Anfragen"**
- Rate-Limit (5/h pro IP) wurde erreicht. Aus Kundensicht: warten oder von
  anderem Netzwerk testen.

**„Zu schnelles Formular"**
- Form wurde innerhalb von 3 Sek. abgeschickt — Anti-Bot-Schutz. Im echten
  Betrieb passiert das nur bei Bots.
