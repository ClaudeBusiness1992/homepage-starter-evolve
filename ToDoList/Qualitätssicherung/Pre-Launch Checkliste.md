# Pre-Launch Checkliste

Vor jeder Kunden-Auslieferung durchgehen. Kopieren und pro Projekt abhaken.

---

## Pflicht-Dateien
- [ ] `public/og-image.jpg` (1200×630 px)
- [ ] `public/favicon.svg` oder `favicon.ico`
- [ ] `astro.config.mjs → site` auf Kunden-Domain
- [ ] `robots.txt` Sitemap-URL auf Kunden-Domain

## Config
- [ ] Alle `[…]`-Platzhalter in `config/legal.json` ersetzt
- [ ] `config/meta.json` vollständig (Name, Farben, Kontakt, Copyright)
- [ ] Keine Platzhalter-Texte oder Demo-Bilder aktiv

## CMS & Deployment
- [ ] `config.yml → repo`, `base_url`, `client_id` auf neues Projekt gesetzt
- [ ] Vercel Env-Vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `RESEND_API_KEY`
- [ ] Kontaktformular getestet
- [ ] CMS-Login getestet (`/admin/`)

## SEO & Legal
- [ ] `<title>` und `<meta description>` korrekt
- [ ] OG-Tags vollständig
- [ ] Impressum korrekt (Steuernummer, kein USt-ID-Platzhalter)
- [ ] Sitemap unter `/sitemap-index.xml` erreichbar

## Qualität
- [ ] `pnpm build` ohne Fehler
- [ ] Alle Bilder mit `alt`-Text und `loading="lazy"`
- [ ] Tastatur-Navigation funktioniert
