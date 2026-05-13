# Setup-Checkliste pro Projekt

Pro neuem Kundenprojekt einmalig durchgehen.

---

## GitHub
- [ ] Neues Repo aus Template klonen
- [ ] Neue GitHub OAuth App erstellen (Callback: `https://[domain]/api/auth`)
- [ ] `client_id` in `public/admin/config.yml` eintragen

## Vercel
- [ ] Neues Projekt anlegen + Repo verbinden
- [ ] Env-Vars setzen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- [ ] Custom Domain hinzufügen

## Resend (Kontaktformular)
- [ ] Account unter resend.com anlegen
- [ ] Domain verifizieren (DNS-Eintrag)
- [ ] `RESEND_API_KEY` in Vercel hinterlegen

---

## Dienste-Übersicht

| Dienst | Zweck | Kosten |
|---|---|---|
| Vercel | Hosting + Functions | kostenlos (Free Tier) |
| GitHub | Repo + CMS-Backend | kostenlos |
| Decap CMS | Kunden-CMS | kostenlos |
| Resend | Formular-Mails | kostenlos bis 3.000/Monat |
| Google Calendar | Booking Live-Sync | kostenlos (Service Account) |
