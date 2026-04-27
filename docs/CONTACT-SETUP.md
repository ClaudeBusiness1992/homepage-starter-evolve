# Kontakt-Formular — E-Mail-Versand einrichten

Das Kontaktformular sendet POST-Requests an `/api/contact` (Vercel Serverless Function). Die Function nutzt **Resend** als E-Mail-Anbieter.

## Ohne Setup
Wenn keine Env-Variablen gesetzt sind, antwortet die Function mit Erfolgsmeldung, schickt aber **keine E-Mail**. Die Anfrage wird neutral geloggt (kein PII). Nutze diese Variante für Demos / vor dem Go-Live.

## Mit Resend (empfohlen, ~3000 Mails/Monat gratis)

### 1. Resend-Account erstellen
1. https://resend.com → Sign up (gratis)
2. Email-Verification durchklicken

### 2. Domain verifizieren
1. **Domains** → **Add Domain** → eigene Domain (z.B. `pixelundcode.de`) hinzufügen
2. DNS-Einträge bei deinem Domain-Provider setzen (TXT, MX) — Resend zeigt sie an
3. Warten bis "Verified" (~5-30 Min)

### 3. API-Key erstellen
1. **API Keys** → **Create API Key**
2. Name: `homepage-starter`
3. Permission: **Sending access** → **Full access**
4. Schlüssel kopieren (wird nur einmal angezeigt)

### 4. In Vercel als Env-Variablen hinterlegen
Vercel-Dashboard → Projekt → **Settings → Environment Variables**:

| Name | Beispiel | Beschreibung |
|---|---|---|
| `RESEND_API_KEY` | `re_xxx...` | Aus Schritt 3 |
| `CONTACT_EMAIL_TO` | `kontakt@firma.de` | Wohin Anfragen gesendet werden |
| `CONTACT_EMAIL_FROM` | `noreply@firma.de` | Absender (muss auf verifizierter Domain liegen) |

Environment: **Production** (und Preview falls gewünscht).

### 5. Redeploy
Nach dem Speichern in Vercel: **Deployments** → letzter Deploy → drei Punkte → **Redeploy**.

## Bot-Schutz (eingebaut)

- **Honeypot:** unsichtbares Feld
- **Time-Check:** Formular muss >2 Sek. auf Seite sein
- **Rate-Limit:** 10 Anfragen pro IP pro Stunde

## Alternativen zu Resend

Wenn du Resend nicht magst:
- **SendGrid:** anderer kostenloser Tier, eigene API
- **Mailgun:** ähnlich
- **Eigene SMTP:** würde `nodemailer` als Dependency benötigen

Für Wechsel müsste `api/contact.js` angepasst werden — Funktion `sendViaResend()` durch entsprechendes Pendant ersetzen.
