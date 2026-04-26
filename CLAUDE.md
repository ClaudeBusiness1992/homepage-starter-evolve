# CLAUDE.md — homepage-starter

Kontextdatei für Claude Code. Enthält Projektbeschreibung, Architektur-Entscheidungen und Setup-Anleitung.

---

## Projekt

`homepage-starter` ist ein wiederverwendbares Template für einseitige Kunden-Websites (One-Pager).
Die Agentur **pixel&code** nutzt es als Grundlage für alle Kundenprojekte.

**Prinzip:** Pro Kunde wird das Template kopiert. Drei Config-Dateien konfigurieren Marke, Inhalte und Legal.
Der Code selbst wird nie angefasst. Deployment auf Netlify Free Tier.

---

## Tech-Stack

| Tool | Version | Zweck |
|---|---|---|
| Node.js | v22 LTS | Laufzeitumgebung |
| pnpm | 10.x | Paketmanager (immer pnpm, nie npm) |
| Astro | 6.x | Static Site Generator |
| Vanilla CSS | — | Custom Properties, kein Framework |
| WOFF2 (self-hosted) | — | DM Serif Display + Outfit, DSGVO-konform |
| Netlify | — | Deployment + Formulare + Security-Headers |

**Betriebssystem (Referenz):** Windows 11 Home (Build 26200)
**Shell:** PowerShell 5.1 + PortableGit (Bash)

---

## Config-Struktur

Alle Kunden-Werte leben in `config/`. Der Code selbst wird nie angefasst.

| Datei | Inhalt |
|---|---|
| `config/meta.json` | Marke: siteName, siteNameAccent, design, theme (Farben), nav, Kontakt |
| `config/content.json` | Seiteninhalte: alle Sektionen mit enabled-Flag, Texte, Bilder, Pakete, Bewertungen |
| `config/legal.json` | Impressum + Datenschutz: Adresse, Registernummer, Hoster etc. |

> **Wichtig:** `client.config.json` existiert nicht mehr — alles in den drei obigen Dateien.

---

## Design-System

Der aktive Stil wird in `config/meta.json → design` gesetzt:

```json
{ "design": "01-warm-local" }
```

`Base.astro` liest den Wert und setzt `data-design="{design}"` auf dem `<html>`-Tag.
Jedes Design überschreibt nur abweichende Styles via `[data-design="..."]`-Selector in:

```
src/styles/designs/01-warm-local.css
src/styles/designs/02-bold-editorial.css
src/styles/designs/03-minimal-clean.css
```

| Design | Status |
|---|---|
| `01-warm-local` | ✅ fertig |
| `02-bold-editorial` | 🔨 in Arbeit |
| `03-minimal-clean` | 🔨 in Arbeit |
| `04-corporate-trust` | Geplant |

**Regel:** Keine Design-spezifischen Styles in `global.css`. Nur in den Design-Dateien.

---

## CSS-Architektur

### Custom Properties (Tokens)

Alle in `config/meta.json → theme` konfigurierbar, in `Base.astro` per `<style>` auf `:root` gesetzt:

```css
--ink          /* Haupttextfarbe */
--cream        /* Hintergrundfarbe */
--accent       /* Akzentfarbe (konfiguriert) */
--accent-text  /* Automatisch: color-mix(in srgb, var(--accent) 75%, #000) — WCAG AA auf hellem Hintergrund */
--sage         /* Sekundärfarbe */
--r            /* Border-radius normal */
--r-lg         /* Border-radius groß */
--r-pill       /* Border-radius Pill: 100px */
```

`--accent-text` wird nicht in `meta.json` konfiguriert — es wird in `global.css` automatisch aus `--accent` berechnet.
Dadurch ist jede konfigurierte Akzentfarbe automatisch WCAG-konform auf hellem Hintergrund.

### Utility-Klassen

- **`.section--dark`** — Sections mit dunklem Hintergrund (Services, Gallery, Contact) tragen diese Klasse.
  Setzt `color: var(--cream)` auf `.h2`, `.sub`, `.lbl` automatisch.
- **`.section-hd`** — Abstand unter Section-Headern (3.5rem)
- **`.section-hd--center`** — Zentrierter Section-Header

---

## Komponenten

| Komponente | Props | Zweck |
|---|---|---|
| `SectionHeader.astro` | `label`, `headline`, `subline`, `center?` | Wiederverwendbarer Label + H2 + Subline Block |
| `Nav.astro` | `siteName`, `siteNameAccent?`, `links` | Navigation, Burger-Menü, Logo |
| `CookieBanner.astro` | — | TTDSG-konformer Cookie-Banner (global in Base.astro) |

### siteNameAccent

Logo-Highlight ohne `split('&')`. In `meta.json`:
```json
{ "siteName": "pixel&code", "siteNameAccent": "&code" }
```
Dann in Nav/Footer: der Accent-Teil wird in `<em>` gerendert (accent-colored).
Kunden ohne Sonderzeichen: `siteNameAccent` weglassen.

---

## Sektionen

Alle in `config/content.json` mit `enabled: true/false` steuerbar. Nav filtert deaktivierte automatisch.

| Sektion | Datei | Klasse |
|---|---|---|
| Hero | `src/sections/Hero.astro` | — |
| Über uns | `src/sections/About.astro` | — |
| Leistungen | `src/sections/Services.astro` | `section--dark` |
| Galerie | `src/sections/Gallery.astro` | `section--dark` |
| Kennzahlen | `src/sections/Stats.astro` | — |
| Preise | `src/sections/Pricing.astro` | — |
| Bewertungen | `src/sections/Reviews.astro` | — |
| Kontakt | `src/sections/Contact.astro` | `section--dark` |
| Footer | `src/sections/Footer.astro` | — |

---

## Fonts

Self-hosted (DSGVO-konform — kein Google CDN-Request):

- **Dateien:** `public/fonts/*.woff2` — 12 Dateien (DM Serif Display + Outfit, je 4 Gewichte × latin + latin-ext)
- **@font-face:** in `src/styles/global.css` ganz oben
- **Preload:** zwei kritische Dateien in `Base.astro` (`dm-serif-display-normal-400-latin.woff2`, `outfit-normal-400-latin.woff2`)
- **Cache:** in `netlify.toml` für `public/fonts/` auf 1 Jahr gesetzt
- **CSP:** `font-src 'self'` (kein externer Font-Host nötig)

> `public/fonts/fonts.css` existiert nicht mehr — war eine Dead File, wurde gelöscht.

---

## Sicherheit

`netlify.toml` setzt für alle Routen:
- `Content-Security-Policy` — nur eigene Ressourcen + unsafe-inline für Theme-Injection
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — kein Kamera/Mikro/Geo

---

## Pflicht-Pages (DE-Recht)

| Page | Route | Quelle |
|---|---|---|
| Impressum (§5 DDG) | `/impressum` | `config/legal.json` |
| Datenschutzerklärung (DSGVO) | `/datenschutz` | `config/legal.json` |
| Cookie-Banner (TTDSG) | global | `Base.astro` |

---

## Häufige Befehle

```bash
pnpm dev              # Entwicklungsserver → http://localhost:4321
pnpm build            # Produktions-Build → dist/
pnpm preview          # Build lokal vorschauen
netlify deploy        # Preview-Deploy
netlify deploy --prod # Produktions-Deploy
```

---

## Audit-Slash-Commands

7 Qualitäts-Audits, im Projekt-Root via Claude Code:

| Command | Prüft | Wann |
|---|---|---|
| `/audit-architecture` | Modul-Grenzen, Dependency-Richtung | Nach Refactoring |
| `/audit-customizing` | Hardcoded Werte, Customizing-Readiness | Pro Kunden-Branch |
| `/audit-quality` | Naming, Duplikate, Dead Code | Wöchentlich |
| `/audit-ui` | Komponenten-Konsistenz, Button-States | Nach Style-Änderungen |
| `/audit-a11y` | WCAG 2.1 AA, ARIA, Kontraste | Vor Release |
| `/audit-performance` | Bundle, Bilder, Hydration | Vor Release |
| `/audit-security-seo` | CSP, Meta-Tags, Sitemap | Vor Live-Schaltung |

---

## Konventionen

- **Paketmanager:** immer `pnpm`, nie `npm install`
- **Commits:** `feat:`, `fix:`, `chore:`, `style:`
- **Config:** Kunden-Werte nur in `config/` — nie direkt im Code
- **CSS:** Custom Properties, keine externen UI-Libraries (kein Tailwind, kein Bootstrap)
- **Designs:** Überschreibungen nur in `src/styles/designs/*.css` via `[data-design]`
- **Keine Inline-Styles** für Design-Entscheidungen — alles in CSS-Dateien
- **WCAG AA:** alle Text-Kontraste müssen 4.5:1 erfüllen (normal), 3:1 (groß/bold)

---

## Neuen Rechner einrichten

### 1. Git
→ https://git-scm.com/download/win — Standardoptionen, danach: `git --version`

### 2. nvm-windows + Node v22 LTS
→ https://github.com/coreybutler/nvm-windows/releases
```powershell
nvm install 22
nvm use 22
node --version  # → v22.x
```

### 3. pnpm
```powershell
npm install -g pnpm
pnpm --version
```

### 4. Netlify CLI
```powershell
pnpm add -g netlify-cli
netlify login
```

### 5. Claude Code
```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

### 6. Projekt klonen
```powershell
git clone <repo-url> homepage-starter
cd homepage-starter
pnpm install
pnpm dev
```

---

## Pro Kunde: Checkliste

1. Repo klonen: `git clone <repo-url> kunde-name && cd kunde-name`
2. Design wählen: `config/meta.json → design`
3. Marke eintragen: `config/meta.json` — siteName, siteNameAccent, theme (Farben), nav, Kontakt
4. Inhalte eintragen: `config/content.json` — alle Sektionen befüllen, nicht benötigte auf `enabled: false`
5. Legal eintragen: `config/legal.json` — alle `[…]`-Platzhalter ersetzen
6. Domain eintragen: `astro.config.mjs → site`
7. OG-Bild erstellen: `public/og-image.jpg` (1200×630px)
8. `pnpm build` → `dist/` auf Netlify hochladen

---

## Offene Punkte

- [ ] `stat-l` Text-Kontrast prüfen (Accent-Hintergrund, kleiner Text)
- [ ] Cookie-Banner: Fokus auf ersten Button wenn eingeblendet
- [ ] `.gitignore`: `.env.local`, `.env.*.local`, `.env.production` ergänzen
- [ ] `public/og-image.jpg` Platzhalter erstellen (1200×630px)
- [ ] Datenschutz-Seite: Google-Fonts-Abschnitt entfernen (jetzt self-hosted)
- [ ] Design 02 und 03 fertigstellen
- [ ] Design 04: `04-corporate-trust` (Beratung, Kanzleien)
