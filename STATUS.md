# Projekt-Status — homepage-starter

> **Stand:** April 2026 — letzter Push: siehe `git log -1`
> Live-URL: https://homepage-starter-evolve.vercel.app
> Repo: `ClaudeBusiness1992/hompage-starter` (Tippfehler im Repo-Namen, Domain ist sauber)

## Quick-Start auf neuem Rechner

```bash
git clone https://github.com/ClaudeBusiness1992/hompage-starter.git homepage-starter
cd homepage-starter
pnpm install
pnpm dev   # → http://localhost:4321
```

**Voraussetzungen:** Node.js v22 LTS, pnpm 10.x

---

## Was bereits gemacht wurde

### Architektur (10 Designs, Add-ons, CMS)
- ✅ 10 Designs implementiert (`01-warm-local` bis `10-pop-studio`)
- ✅ Decap CMS mit GitHub OAuth komplett eingerichtet
- ✅ Vercel Live (`homepage-starter-evolve.vercel.app`)
- ✅ Add-ons-Bereich im CMS mit Master-Toggles (immer sichtbar)
- ✅ Countdown-Add-on (Live-Update via JS, kompakt vor Hero)
- ✅ Bewertungen-Add-on (umgezogen aus Inhalte → Add-ons)
- ✅ Buchungs-Add-on (Mailto+ICS Fallback ODER Google Calendar Live-Sync)
- ✅ Sprechzeiten-Box im Buchungsformular (auto-generiert aus Availability)
- ✅ Aktive Add-ons erscheinen automatisch in der Top-Nav

### Audit-Fixes (61 Befunde, 7 Subagents)
**Wave 1 — Quick Wins:**
- Design 02 self-referencing CSS-Vars gefixt
- Netlify-Legacy entfernt (`netlify/`, `functions/`, `netlify.toml`, Root-`index.html`)
- Browser-Mockup tokenisiert
- Hero `headline.split` mit Fallback (1–3 Sätze)
- Hero `burl` aus `Astro.site.host`
- Pricing-Card Tastatur-bedienbar (`role="button"`, `tabindex`, keydown)
- Booking Sprechzeiten-Heading `<h3>`
- `console.log` PII entfernt
- `.gitignore` erweitert (`.env.local`, `.vercel/`, ...)
- Cache-Header für Fonts (1 Jahr)
- Cookie-Banner initialer Fokus
- Burger `aria-controls`

**Wave 2 — Critical:**
- Contact-Form auf Vercel-Function migriert (`api/contact.js`)
- Resend-Integration (kostenlos bis 3000 Mails/Monat)
- Honeypot + Time-Check + Rate-Limit (10/h IP)
- `docs/CONTACT-SETUP.md` mit Setup-Anleitung

**Wave 3 — vercel.json & Refactor:**
- `vercel.json` mit Production-CSP
- `astro.config.mjs trailingSlash: 'never'`
- `index.astro` Component-Maps eingedampft (Identity-Mappings raus)
- Footer Cookie-Einstellungen als `<button>`
- Design 08 Wave-Datauris zu CSS-Tokens (`--sb-wave-1/-2`)

**Wave 4 — XSS, Tokens, Doku:**
- Reviews JSON-LD `<`-escape
- Design 03 hardcoded Greys → `color-mix(var(--cream/--ink))`
- CLAUDE.md komplett überarbeitet (Token-Konvention, .section--dark Doc)
- Hardcoded Orange-RGBAs (35×) durch `color-mix(var(--accent))` ersetzt

**Aktueller Stand (zum letzten Commit):**
- Countdown vor Hero positioniert (kompakt, geteilt mit Landing-Slot)
- Designspezifische Countdown-Themes für 02, 03, 04, 05, 06, 07, 08, 09, 10
- Buchungs-Datepicker: Default = nächster offener Tag, Max 90 Tage Vorlauf, Hinweis bei geschlossenen Tagen
- Aktive Add-ons (Reviews, Buchung) erscheinen automatisch in Nav

---

## Was noch offen ist

### Kritisch (vor Live-Schaltung an echte Kunden)
- [ ] **`astro.config.mjs site`** + **`public/robots.txt`** auf Produktionsdomain pro Kunde setzen (Platzhalter `https://ihre-domain.de`)
- [ ] **`public/og-image.jpg`** erstellen (1200×630 px) — sonst 404 in Social-Previews
- [ ] **Datenschutzerklärung** Google-Fonts-Abschnitt entfernen (Fonts sind self-hosted)
- [ ] Bei Live-Sync für Buchung: Setup-Doku (`docs/BOOKING-LIVESYNC.md`) durchführen pro Kunde

### Featurewünsche aus Sessions
- [ ] **Mini-Kalender-Popup** im Buchungs-Formular mit nur offenen Tagen (Custom DatePicker, ~150 Zeilen JS)
- [ ] **Outlook-Live-Sync** (Microsoft Graph API, analog zu Google)
- [ ] **Cal.com / Calendly Embed** als alternativer Buchungs-Mode
- [ ] Pricing-Pakete neu definieren nach Marktforschung (Multi-Page-Versprechen war im aktuellen Template nicht eingelöst)

### Audit-TODOs (medium-priority)
- [ ] Component-Map dynamisch via `import.meta.glob` (statt 10 statische Imports in `index.astro`)
- [ ] Conditional CSS-Loading per Design (statt alle 9 Override-CSS global ~14 KB gzip)
- [ ] `astro:assets <Image>` für Kundenbilder (AVIF/WebP-Auto-Generation)
- [ ] `theme.fonts` in `meta.json` einführen (aktuell nur `--serif/--sans` in global.css editierbar)
- [ ] `headline.split('. ')` durch strukturierte CMS-Felder ersetzen (`headline.line1/2/3`)
- [ ] Form-Group Selector entkoppeln (`.contact-form input` Dead-Selector-Geschichte robuster)
- [ ] Schema.org `LocalBusiness` Pflichtfelder (`address`, `telephone`)
- [ ] Reduce `!important` cluster in Design-Overrides
- [ ] CSP `unsafe-inline` raus (Astro 6 `security.csp: true` aktivieren — generiert Hashes)
- [ ] Design 05/10 weitere Hardcoded Colors zu Tokens

### Audit-TODOs (nice-to-have)
- [ ] SRI-Hash für Decap-CMS-CDN-Script in `public/admin/index.html`
- [ ] Booking field-level errors (analog Contact: `field-err`-Spans pro Input)
- [ ] Token-Naming-Konvention dokumentieren (`--<2-char>-*` Schema in CLAUDE.md ✓ schon dokumentiert)
- [ ] Reveal-Delay-Helper extrahieren (`src/utils/delays.js`)

---

## Workflow / wichtige Pfade

### Live-Deploy
1. Lokal Änderung machen
2. `git add . && git commit -m "..." && git push`
3. Vercel deployt automatisch (~1 Min)

### CMS-Bearbeitung
1. https://homepage-starter-evolve.vercel.app/admin/
2. GitHub-Login
3. Inhalte / Design / Erweiterungen bearbeiten → "Publish"
4. Decap commit auf GitHub → Vercel deploy

### Wichtigste Dateien
| Datei | Was drin |
|---|---|
| `config/design.json` | aktives Design |
| `config/meta.json` | Marke (siteName, theme, nav, Kontakt) |
| `config/content.json` | Sektions-Inhalte |
| `config/extras.json` | Add-ons (Countdown, Reviews, Booking) |
| `config/legal.json` | Impressum, Datenschutz |
| `src/pages/index.astro` | Render-Reihenfolge der Sektionen |
| `src/layouts/Base.astro` | HTML-Shell + Theme-Inline-Style |
| `src/styles/global.css` | Base-Styles + Tokens |
| `src/styles/designs/<key>.css` | Design-Overrides via `[data-design]` |
| `src/sections/*.astro` | Default-Sektionen (Fallback für 01-warm-local) |
| `src/designs/<key>/*.astro` | Design-spezifische Sektion-Overrides |
| `api/contact.js` | Contact-Form Backend (Resend) |
| `api/booking.js` | Buchungs-Backend (Google Calendar) |
| `vercel.json` | Vercel Headers (CSP, Cache) |
| `public/admin/config.yml` | Decap CMS Felder |

### Env-Variablen in Vercel (sofern aktiviert)
| Name | Für | Setup-Doku |
|---|---|---|
| `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` | OAuth Login zum CMS | bestehend, läuft |
| `GOOGLE_SA_JSON` + `GOOGLE_CALENDAR_ID` | Buchung Live-Sync | `docs/BOOKING-LIVESYNC.md` |
| `RESEND_API_KEY` + `CONTACT_EMAIL_TO` + `CONTACT_EMAIL_FROM` | Contact-Form Mail-Versand | `docs/CONTACT-SETUP.md` |

### Audit-Slash-Commands (Claude Code)
Im Projekt-Root verfügbar via `.claude/commands/audit-*.md`:
`/audit-architecture`, `/audit-customizing`, `/audit-quality`, `/audit-ui`, `/audit-a11y`, `/audit-performance`, `/audit-security-seo`

---

## Beim Wechseln des Rechners — Checkliste

1. ✅ Repo geklont
2. ✅ `pnpm install` ausgeführt
3. ✅ `pnpm dev` läuft auf `localhost:4321`
4. Optional: Claude Code installiert + `~/.claude/settings.json` mit Permissions importiert (siehe Memory-File)
5. Claude-Memory existiert nur lokal pro Rechner — auf neuem Rechner werden initial keine Memories vorhanden sein, aber dieses STATUS.md ersetzt das.
