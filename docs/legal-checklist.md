# Legal-Checklist (Deutschland)

Pflicht-Check vor jedem Kunden-Launch. Quellen: §5 DDG, DSGVO, TTDSG, MStV, BGB §305 ff.

## Pflicht für jede Unternehmenswebsite

### Impressum (§5 DDG)

In `client.config.json` → `legal` befüllen:

- [ ] Firmenname inkl. Rechtsform (GmbH, UG, GbR, Einzelunternehmen)
- [ ] Vor- und Nachname Vertretungsberechtigte
- [ ] Vollständige Geschäftsanschrift (kein Postfach)
- [ ] Telefonnummer (mit Vorwahl)
- [ ] E-Mail-Adresse
- [ ] Handelsregister-Eintrag (HRB/HRA, Nummer, Amtsgericht) — falls vorhanden
- [ ] USt-IdNr. (DE…) — falls vorhanden
- [ ] Verantwortlicher §18 Abs.2 MStV (meist Geschäftsführer)
- [ ] Berufsrechtliche Angaben (bei Freiberuflern: Kammer, Berufsbezeichnung, zuständige Aufsichtsbehörde)

Impressum muss von **jeder Seite** erreichbar sein (Footer-Link reicht).

### Datenschutzerklärung (DSGVO Art. 13)

In `client.config.json` → `legal` befüllen:

- [ ] Hosting-Anbieter Name + Adresse + URL zur Datenschutzerklärung
- [ ] Datenschutzbeauftragter (falls bestellt — Pflicht ab 20 Mitarbeitern bei automatisierter Verarbeitung)
- [ ] Analyse-Tools (falls genutzt)

**Vor Live-Gang:** Datenschutzerklärung von Fachanwalt prüfen lassen oder mit aktuellem DSGVO-Generator (eRecht24, Datenschutz-Generator.de) abgleichen.

### Cookie-Consent (TTDSG §25)

- [x] Cookie-Banner integriert (`src/components/CookieBanner.astro`)
- [x] Opt-In statt Opt-Out (ohne Einwilligung keine nicht-notwendigen Cookies)
- [x] Gleichwertige Buttons (Akzeptieren ≈ Ablehnen — kein Dark Pattern)
- [x] Widerruf möglich via Footer-Link "Cookie-Einstellungen"
- [ ] Bei Analytics/Marketing-Tools: Tools dürfen erst nach Consent geladen werden (TODO bei Aktivierung)

### Kontaktformular (DSGVO)

- [ ] Pflichtfelder: Name, E-Mail, Nachricht
- [ ] Hinweis-Text + Link zur Datenschutzerklärung am Formular
- [ ] Spam-Schutz (Honeypot oder reCAPTCHA)
- [ ] Bestätigungsseite/-Nachricht nach Absenden
- [ ] Server-seitige Validierung der Eingaben

## Optional, aber oft sinnvoll

### AGB (BGB §305 ff.)

Pflicht, wenn online Waren/Dienstleistungen verkauft werden. Bei reinen Info-Seiten nicht nötig.

- [ ] Vertragsparteien
- [ ] Leistungsumfang
- [ ] Preise inkl. MwSt.
- [ ] Zahlungs- und Lieferbedingungen
- [ ] Widerrufsbelehrung (zwingend bei B2C)
- [ ] Gewährleistung / Haftungsbeschränkung

### Bewertungen / Reviews (UWG nach EU-Omnibus-Richtlinie 2022/161/EU)

- [x] Bewertungen als "verifiziert" kennzeichnen — nur wenn Echtheit tatsächlich geprüft
- [x] Hinweis am Ende der Reviews-Section, wie Echtheit geprüft wird
- [ ] Schema.org Review/AggregateRating Markup (für Google Rich Snippets) — bereits in Reviews.astro

## Technisches

### SSL/TLS

- [ ] HTTPS auf Production-Domain (Let's Encrypt via Hosting kostenlos)
- [ ] Alle Mixed-Content-Warnungen behoben

### SEO-Basis

- [ ] Title-Tag pro Seite (60–70 Zeichen)
- [ ] Meta-Description pro Seite (~150 Zeichen)
- [ ] `sitemap.xml` (Astro: `@astrojs/sitemap` Integration)
- [ ] `robots.txt` mit Sitemap-Verweis
- [ ] Canonical-URL gesetzt (bei Astro automatisch)

### Barrierefreiheit (BITV/WCAG)

- [ ] Semantische HTML-Struktur (eine `<h1>` pro Seite, dann `<h2>`/`<h3>`)
- [ ] Alt-Texte bei allen Bildern
- [ ] Farbkontrast ≥ 4,5:1 (Tools: WebAIM Contrast Checker)
- [ ] Fokus-Indikator nicht entfernen
- [ ] Formular-Labels mit `<label for="">`
- [ ] Mobil bedienbar (Tap-Targets ≥ 44×44 px)

## Vor jedem Launch

- [ ] `client.config.json` vollständig befüllt — alle `[…]`-Platzhalter ersetzt
- [ ] Impressum + Datenschutz auf Vollständigkeit geprüft
- [ ] Kontaktformular getestet (Empfangs-Mail kommt an)
- [ ] Cookie-Banner funktioniert (Accept + Reject + Re-open via Footer)
- [ ] Mobile getestet (320px / 768px / 1200px)
- [ ] Lighthouse-Score ≥ 90 in Performance/SEO/Accessibility/Best Practices
- [ ] HTTPS aktiv

## Quellen

- IHK Chemnitz: [Pflichtangaben im Impressum](https://www.ihk.de/chemnitz/recht-und-steuern/rechtsinformationen/internetrecht/pflichtangaben-im-internet-die-impressumspflicht-4401580)
- IHK Schleswig-Holstein: [Pflichtangaben Datenschutzerklärung](https://www.ihk.de/schleswig-holstein/recht/recht-im-internet/pflichtangaben-internet-datenschutzerklaerung-1359834)
- eRecht24: DSGVO-Generator und Vorlagen
- BMJ: TTDSG-Volltext
