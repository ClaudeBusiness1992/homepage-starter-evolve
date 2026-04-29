# CLAUDE.md — homepage-starter

Kontextdatei für Claude Code. Enthält Projektbeschreibung, Architektur-Entscheidungen und Setup-Anleitung.

---

## Projekt

`homepage-starter` ist ein wiederverwendbares Template für einseitige Kunden-Websites (One-Pager).
Die Agentur **pixel&code** nutzt es als Grundlage für alle Kundenprojekte.

**Prinzip:** Pro Kunde wird das Template geklont. Vier Config-Dateien konfigurieren Design, Marke, Inhalte und Legal.
Der Code selbst wird nie angefasst. Deployment auf Vercel Free Tier.

---

## Tech-Stack

| Tool | Version | Zweck |
|---|---|---|
| Node.js | v22 LTS | Laufzeitumgebung |
| pnpm | 10.x | Paketmanager (immer pnpm, nie npm) |
| Astro | 6.x | Static Site Generator |
| Decap CMS | 3.x | Content-Management (GitHub OAuth Backend) |
| Vanilla CSS | — | Custom Properties, kein Framework |
| WOFF2 (self-hosted) | — | DM Serif Display + Outfit, DSGVO-konform |
| Vercel | — | Deployment + Serverless Functions (OAuth) |

**Betriebssystem (Referenz):** Windows 11 Home (Build 26200)
**Shell:** PowerShell 5.1 + PortableGit (Bash)

---

## Config-Struktur

Alle Kunden-Werte leben in `config/`. Der Code selbst wird nie angefasst.

| Datei | Inhalt |
|---|---|
| `config/design.json` | Aktives Design (ein Wert: `"design": "01-warm-local"`) |
| `config/meta.json` | Marke: siteName, siteNameAccent, tagline, description, nav, Kontakt + theme (Farben) |
| `config/content.json` | Seiteninhalte: alle Sektionen mit enabled-Flag, Texte, Bilder, Pakete, Bewertungen |
| `config/legal.json` | Impressum + Datenschutz: Adresse, Registernummer, Hoster etc. |

---

## Design-System

Der aktive Stil wird in `config/design.json` gesetzt:

```json
{ "design": "01-warm-local" }
```

`Base.astro` liest den Wert und setzt `data-design="{design}"` auf dem `<html>`-Tag.
`index.astro` wählt über eine Component-Map die richtigen Astro-Komponenten pro Design.
Design-spezifische CSS-Überschreibungen leben in `src/styles/designs/`.

### Verfügbare Designs

| Key | Charakter | Eigene Komponenten |
|---|---|---|
| `01-warm-local` | Warm, lokal, klassisch | — (nutzt alle Fallback-Sektionen) |
| `02-bold-editorial` | Dunkel, mutig, Magazin | Hero, About, Services |
| `03-minimal-clean` | Hell, reduziert, typografisch | Hero |
| `04-corporate-split` | Zweigeteilt, seriös, strukturiert | Hero, About |
| `05-vibrant-gradient` | Gradient, dynamisch, modern | Hero, Services |
| `06-editorial-press` | Magazin-Layout, Italic, Issue-Nummern | Hero |
| `07-terminal-console` | Dev-Aesthetik, Mono, Terminal-Window | Hero |
| `08-soft-bloom` | Organisch, Pastell, runde Karten | Hero |
| `09-luxe-atelier` | Premium Boutique, Serif, Ornament | Hero |
| `10-pop-studio` | Bunt, verspielt, Sticker-Look | Hero |

Design wechseln: `config/design.json` oder im CMS unter "Design auswählen".

### Dateistruktur

```
src/
  designs/
    02-bold-editorial/   Hero.astro, About.astro, Services.astro
    03-minimal-clean/    Hero.astro
    04-corporate-split/  Hero.astro, About.astro
    05-vibrant-gradient/ Hero.astro, Services.astro
    06-editorial-press/  Hero.astro
    07-terminal-console/ Hero.astro
    08-soft-bloom/       Hero.astro
    09-luxe-atelier/     Hero.astro
    10-pop-studio/       Hero.astro
  sections/              Shared Fallback-Komponenten (01-warm-local + Fallback)
  styles/
    global.css
    designs/             02–10 *.css (Section-Overrides pro Design)
```

**Regel:** Keine Design-spezifischen Styles in `global.css`. Nur in den Design-Dateien.
Alle Design-CSS-Dateien werden immer geladen — Scoping passiert über `[data-design="..."]`-Selektoren.

---

## CSS-Architektur

### Custom Properties (Tokens)

Vollständige Liste aus `global.css` `:root`:

```css
/* Theme-Tokens — werden von Base.astro als inline-style auf <html> gesetzt */
--ink           /* Haupttextfarbe (aus meta.json → theme.ink) */
--cream         /* Hintergrundfarbe (aus meta.json → theme.cream) */
--accent        /* Akzentfarbe (aus meta.json → theme.accent) */
--accent-light  /* Hover-Akzent (aus meta.json → theme.accentLight) */
--sage          /* Sekundärfarbe (aus meta.json → theme.sage) */

/* Automatisch berechnet in global.css — nicht konfigurierbar */
--ink-muted     /* rgba-Variante von --ink */
--accent-text   /* color-mix(in srgb, var(--accent) 75%, #000) — WCAG AA */
--white         /* #ffffff */
--border        /* rgba(26,26,46,.12) */
--error         /* #e85555 */

/* Layout */
--nav-h:  72px
--max-w:  1200px
--r:      12px
--r-lg:   20px
--r-pill: 100px
--shadow
--shadow-lg

/* Typografie */
--serif: 'DM Serif Display', Georgia, serif
--sans:  'Outfit', system-ui, sans-serif
```

`--accent-text` wird automatisch aus `--accent` berechnet — jede konfigurierte Akzentfarbe ist damit automatisch WCAG-konform auf hellem Hintergrund.

### Utility-Klassen

- **`.section--dark`** — Sections mit dunklem Hintergrund tragen diese Klasse.
  Setzt `color: var(--cream)` auf `.h2`, `.sub`, `.lbl` automatisch.
- **`.section-hd`** — Abstand unter Section-Headern (3.5rem)
- **`.section-hd--center`** — Zentrierter Section-Header

---

## Fullpage-Scroll-Snap-Layout

Der One-Pager nutzt CSS `scroll-snap-type: y mandatory` auf `html`. Jede Sektion belegt genau eine Viewport-Höhe.

### Geometrie-Regel

| Snap-Target | Height | Warum |
|---|---|---|
| `.hero-snap` (offsetTop = 0) | `100dvh` + `padding-top: var(--nav-h)` | JS scrollt auf `max(0, 0 − 72) = 0`. Viewport zeigt y=0..800. Ohne padding wäre der Countdown hinter der Nav. `calc(100dvh − nav-h)` würde About 72 px früher einblenden. |
| `main > section` (offsetTop > 0) | `calc(100dvh − var(--nav-h))` | JS scrollt auf `offsetTop − navH`. Sektion füllt y=72..800 exakt. |
| `.contact-footer-snap` | `calc(100dvh − var(--nav-h))` | Wie alle anderen Sektionen. |

**Wichtig:** Die `main > section`-Regel greift nur auf **direkte Kinder von `<main>`**. Sections innerhalb von `.hero-snap` (Countdown, Hero) und `.contact-footer-snap` (Contact, Footer) sind **keine** direkten Kinder — sie erben die Höhe nicht und müssen separat geregelt werden.

### Fill-Height-Sections (About / Services / Gallery / Reviews)

Damit Inhalte den gesamten verfügbaren Raum nutzen (statt zu zentrieren und unten abzuschneiden):

```css
/* Wrap wird Flex-Container, füllt die gesamte Section-Höhe */
#about > .wrap,
#services > .wrap,
#gallery > .wrap,
#reviews > .wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
/* Content-Grid nimmt den Restplatz nach section-hd ein */
#about .about-grid    { flex: 1; min-height: 0; }
#services .srv-grid   { flex: 1; min-height: 0; }
#gallery .gallery-carousel { flex: 1; min-height: 0; }
#reviews .reviews-carousel { flex: 1; min-height: 0; }
```

Gallery-Bilder nutzen `position: absolute; inset: 0` statt `aspect-ratio`, weil aspect-ratio mit flex-allocated row-height kollidiert.

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
Der Accent-Teil wird in `<em>` gerendert (accent-colored).
Kunden ohne Sonderzeichen: `siteNameAccent` weglassen.

---

## Sektionen

Alle in `config/content.json` mit `enabled: true/false` steuerbar. Nav filtert deaktivierte automatisch.

| Sektion | Fallback-Datei | Klasse |
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

- **Dateien:** `public/fonts/*.woff2` — 12 Dateien
  - DM Serif Display: normal 400 + italic 400 × (latin + latin-ext)
  - Outfit: normal 400/500/600/700 × (latin + latin-ext)
- **@font-face:** in `src/styles/global.css` ganz oben
- **Preload:** zwei kritische Dateien in `Base.astro` (`dm-serif-display-normal-400-latin.woff2`, `outfit-normal-400-latin.woff2`)
- **Cache:** in `public/_headers` für `/fonts/*` auf 1 Jahr setzen (noch offen)

---

## Sicherheit

Security-Header für Vercel in `public/_headers` (nicht `netlify.toml`):

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; ...

/admin/*
  Content-Security-Policy: ... unsafe-eval ... (Decap CMS benötigt dies)
```

**vercel.json** ist die autoritative Header-Quelle (Vercel liest sie zuerst). `public/_headers` existiert als Fallback.

---

## CMS (Decap CMS)

Kunden können Inhalte ohne Code-Zugriff bearbeiten.

### Einloggen

1. `https://[domain]/admin/` aufrufen
2. "Login with GitHub" klicken
3. GitHub-Account autorisieren

### Bereiche im CMS

| Bereich | Datei | Inhalt |
|---|---|---|
| Design auswählen | `config/design.json` | Aktives Layout |
| Stammdaten & Design | `config/meta.json` | Name, Farben, Kontakt, Navigation |
| Inhalte | `config/content.json` | Texte, Bilder, Pakete |
| Erweiterungen / Add-ons | `config/extras.json` | Countdown, Bewertungen, Buchung (alle deaktivierbar) |
| Firmendaten & Impressum | `config/legal.json` | Adresse, Register, Hoster |

### Add-ons (Erweiterungen)

| Add-on | Default | Setup |
|---|---|---|
| Countdown / Event | aus | nur Daten in CMS, keine zusätzliche Konfig |
| Bewertungen | aus | nur Daten in CMS |
| Buchung (mailto + .ics) | aus | nur E-Mail in CMS |
| Buchung (Live-Sync) | aus | siehe `docs/BOOKING-LIVESYNC.md` (Google Service-Account, ~15 Min Setup) |
| Kontaktformular E-Mail-Versand | optional | siehe `docs/CONTACT-SETUP.md` (Resend, kostenlos bis 3000 Mails/Monat) |

### OAuth-Einrichtung (einmalig pro Projekt)

1. GitHub OAuth App erstellen → Settings → Developer Settings → OAuth Apps
2. Callback URL: `https://[domain]/api/auth`
3. `client_id` in `public/admin/config.yml` eintragen
4. `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` als Vercel Environment Variables setzen
5. `public/admin/config.yml → base_url` auf neue Domain setzen

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
vercel                # Preview-Deploy
vercel --prod         # Produktions-Deploy
```

---

## Sub-Agents (8 nummerierte Audit-Agenten)

Alle Audits sind als **Sub-Agents** unter `.claude/agents/` abgelegt — KEINE Slash-Commands mehr. Aufruf via `Agent`-Tool mit `subagent_type: "<n>-<name>"` oder vom Hauptagent automatisch.

| # | Sub-Agent | Prüft | Wann |
|---|---|---|---|
| 1 | `1-architecture` | Modul-Grenzen, Dependency-Richtung, Layer-Trennung | Nach Refactoring |
| 2 | `2-customizing` | Hardcoded Werte, Customizing-Readiness, Branding-Boundaries | Pro Kunden-Branch |
| 3 | `3-quality` | Naming, Duplikate, Dead Code, Komplexität | Wöchentlich / vor Merge |
| 4 | `4-ui` | Komponenten-Konsistenz, Tokens, Button-States (statisch) | Nach Style-Änderungen |
| 5 | `5-a11y` | WCAG 2.1 AA, ARIA, semantisches HTML, Kontraste | Vor Release |
| 6 | `6-performance` | Bundle, Bilder, Hydration, Render-Kosten | Vor Release |
| 7 | `7-security-seo` | Secrets, XSS, CSP, Meta-Tags, Sitemap, JSON-LD | Vor Live-Schaltung |
| 8 | `8-visual-tester` | **Live-Browser-Test:** Layout, Snap, Bündigkeit, Empty-Space, Kontrast (Mobile/Laptop/Desktop via Playwright) | Vor jeder „fertig"-Meldung bei UI-/Layout-Änderungen |

### Trigger: „starte die sub agents"

Wenn der User **„starte die sub agents"** (oder eine eindeutige Variante davon) sagt, **alle 8 Sub-Agents parallel anstoßen** über mehrere `Agent`-Tool-Calls in einer einzigen Message. Danach die 8 Reports zu einem Gesamt-Audit aggregieren mit:

- **Health-Score-Übersicht** pro Bereich
- **Kritische Befunde** (Critical über alle Agents)
- **Top-10 Fix-Priorität** (cross-cutting nach Impact)
- **Empfohlener Fix-Workflow** (Reihenfolge: Architektur → Customizing → Quality → UI → A11y → Perf → Sec/SEO → Visual)

### Voraussetzungen für `8-visual-tester`

- Playwright installiert: `pnpm add -D playwright && npx playwright install chromium`
- Dev-Server läuft: `pnpm dev` (default `http://localhost:4321`)
- Script: `tools/visual-test.mjs`
- Output: `.screenshots/<timestamp>/<viewport>/` (gitignored)

### Einzelaufruf

Wenn nur ein Aspekt geprüft werden soll, einzelnen Sub-Agent direkt via `Agent`-Tool aufrufen, z.B. `subagent_type: "8-visual-tester"` mit konkretem Prompt für das Layout-Problem.

---

## Konventionen

- **Paketmanager:** immer `pnpm`, nie `npm install`
- **Commits:** `feat:`, `fix:`, `chore:`, `style:`
- **Config:** Kunden-Werte nur in `config/` — nie direkt im Code
- **CSS:** Custom Properties, keine externen UI-Libraries (kein Tailwind, kein Bootstrap)
- **Designs:** Überschreibungen nur in `src/styles/designs/*.css` via `[data-design]`
- **Keine Inline-Styles** für Design-Entscheidungen — alles in CSS-Dateien
- **WCAG AA:** alle Text-Kontraste müssen 4.5:1 erfüllen (normal), 3:1 (groß/bold)
- **TS-light:** `.astro`-Frontmatter darf TypeScript-Annotationen nutzen (`interface`, `as`-Casts), Vanilla-JS bleibt für Browser-Scripts. Keine separaten `.ts`-Files.

## Token-Naming-Konvention pro Design

Jedes Design definiert seinen kompletten Theme-Token-Satz oben in `src/styles/designs/<key>.css`. Die globalen Brand-Tokens (`--ink`, `--cream`, `--accent`, `--accent-light`, `--sage` aus `meta.json`) werden **nur dort** referenziert — der Rest des Designs nutzt ausschließlich die eigenen `--<prefix>-*` Tokens. Damit ist der Theme-Block einer Design-Datei der einzige Punkt, an dem Brand und Theme aufeinandertreffen.

| Design | Prefix | Datei |
|---|---|---|
| 01 Warm Local | `--wl-*` | `01-warm-local.css` |
| 02 Bold Editorial | `--bld-*` | `02-bold-editorial.css` |
| 03 Minimal Clean | `--mc-*` | `03-minimal-clean.css` |
| 04 Corporate Split | `--cs-*` | `04-corporate-split.css` |
| 05 Vibrant Gradient | `--vg-*` | `05-vibrant-gradient.css` |
| 06 Editorial Press | `--ep-*` | `06-editorial-press.css` |
| 07 Terminal Console | `--tc-*` | `07-terminal-console.css` |
| 08 Soft Bloom | `--sb-*` | `08-soft-bloom.css` |
| 09 Luxe Atelier | `--lx-*` | `09-luxe-atelier.css` |
| 10 Pop Studio | `--po-*` | `10-pop-studio.css` |

### Semantisches Vokabular pro Token-Block

Jeder Block deckt mindestens diese Bedeutungen ab — Namen variieren je Design:

```
Surfaces:   --<x>-bg, --<x>-bg-2, --<x>-surface
Text:       --<x>-text, --<x>-text-soft, --<x>-text-mute
Lines:      --<x>-line, --<x>-line-soft, --<x>-line-strong
Accents:    --<x>-accent, --<x>-accent-2, --<x>-on-accent
Inversion:  --<x>-ink, --<x>-on-ink (für invertierte Karten/Sektionen)
```

Design-spezifische Extras (z.B. `--po-yellow`, `--vg-bg-1..4`, `--sb-wave-1/-2`, `--mono`) gehören ebenfalls in den Token-Block.

**Regel:** Innerhalb von `[data-design="..."]` keine direkte Verwendung von `var(--ink/--cream/--accent/...)` mehr. Stattdessen über das Design-Token-Alias gehen. Per-Design-Astros (`src/designs/<key>/*.astro`) folgen derselben Regel.

## Section-Background-Konvention

- `.section--dark` ist der **Default** für Services/Gallery/Contact (dunkel via `var(--ink)`)
- Helle Designs (03, 04, 06, 08, 09) **müssen explizit überschreiben** mit `[data-design] #services { background: ... }` etc.
- Bei neuen Designs: prüfen ob `.section--dark`-Sektionen Override brauchen, sonst Cream-on-Cream-Fail.

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

### 4. Vercel CLI
```powershell
pnpm add -g vercel
vercel login
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

## Multi-Device-Workflow

Das Projekt wird auf mehreren Rechnern bearbeitet. **GitHub ist die Single Source of Truth**, nicht die lokale Kopie.

### Grundregeln

- **Niemals in Cloud-Sync-Ordnern arbeiten** (iCloud Drive, OneDrive, Dropbox) — der `.git`-Ordner und Lock-Files führen zu Repo-Korruption. Pro Rechner ein lokaler Ordner *außerhalb* der Cloud (z.B. `C:\ClaudeBusiness\`).
- **Sync ausschließlich via Git** — `git pull` zum Holen, `git push` zum Hochladen. Niemals Ordner zwischen Rechnern kopieren.
- **Repo-Standort:** `https://github.com/ClaudeBusiness1992/homepage-starter-evolve.git`, Branch `main`.
- **Vercel:** Push auf `main` triggert automatisch ein Live-Deployment. Nicht auf `main` pushen, was nicht live gehen soll.

### Tagesablauf (jedes Mal)

```powershell
# 1. ARBEITSBEGINN — neuesten Stand holen
cd "C:\ClaudeBusiness\Claude Homepage\homepage-starter"
git pull

# 2. ARBEITEN
pnpm dev   # Server starten, Änderungen testen

# 3. ARBEITSENDE — Änderungen sichern
git add .
git commit -m "feat: ... / fix: ... / chore: ..."
git push   # → triggert Vercel-Deploy
```

### Häufige Fallstricke

| Problem | Ursache | Lösung |
|---|---|---|
| "Your branch is behind 'origin/main'" | Anderer Rechner / Browser-Edit hat gepusht | `git pull` ausführen |
| "Your branch is ahead of 'origin/main' by N commits" | Lokal committed, vergessen zu pushen | `git push` ausführen |
| "Updates were rejected because the remote contains work..." | Auf beiden Seiten Commits parallel | `git pull` (Auto-Merge), bei Konflikten manuell auflösen, dann `git push` |
| Vercel zeigt alten Stand | Vergessen zu pushen | `git push` ausführen |

### Browser-Edits auf github.com vermeiden

Direkte Edits auf github.com (z.B. README im Web-UI ändern) erzeugen Commits, die lokale Kopien nicht haben. **Wenn unvermeidbar:** auf jedem aktiven Rechner danach `git pull` ausführen, bevor weitergearbeitet wird. Lieber lokal ändern → committen → pushen.

### Claude Code starten

Claude Code immer aus dem Projekt-Ordner starten, damit `CLAUDE.md` und `.claude/settings.json` korrekt geladen werden:

```powershell
cd "C:\ClaudeBusiness\Claude Homepage\homepage-starter"
claude
```

---

## Pro Kunde: Checkliste

1. Repo klonen: `git clone <repo-url> kunde-name && cd kunde-name`
2. Design wählen: `config/design.json → design`
3. Marke eintragen: `config/meta.json` — siteName, siteNameAccent, tagline, theme (Farben), nav, Kontakt
4. Inhalte eintragen: `config/content.json` — alle Sektionen befüllen, nicht benötigte auf `enabled: false`
5. Legal eintragen: `config/legal.json` — alle `[…]`-Platzhalter ersetzen
6. Domain eintragen: `astro.config.mjs → site`
7. OG-Bild erstellen: `public/og-image.jpg` (1200×630px)
8. Neues Vercel-Projekt anlegen + GitHub-Repo verbinden
9. Environment Variables setzen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
10. GitHub OAuth App Callback URL auf neue Domain aktualisieren
11. `public/admin/config.yml → base_url` + `client_id` auf neue Domain/App setzen
12. `pnpm build` prüfen, dann Vercel-Deploy anstoßen

---

## Offene Punkte

- [x] Cookie-Banner: Fokus auf ersten Button wenn eingeblendet ✓ Wave 1
- [x] `.gitignore`: `.env.local`, `.env.*.local`, `.env.production` ergänzen ✓ Wave 1
- [x] `netlify.toml` entfernen ✓ Wave 1
- [x] Font-Cache-Header in `public/_headers` (+ vercel.json) ✓ Wave 1
- [x] Booking-Add-on, Live-Sync, Setup-Doku ✓
- [x] Contact-Form auf Vercel-Function migriert ✓ Wave 2
- [x] Design 02 self-referencing CSS-Vars gefixt ✓ Wave 1
- [x] Pricing-Cards Tastatur-bedienbar ✓ Wave 1

## Offene Punkte (für später)

- [x] `stat-l` Text-Kontrast — `var(--ink)` statt `var(--white)` auf Accent-Hintergrund ✓
- [x] Datenschutz-Seite: Google-Fonts-Abschnitt durch self-hosted-Beschreibung ersetzt ✓
- [x] Schema.org LocalBusiness — `address` + `telephone` aus `legal.json`/`meta.json` ✓
- [x] Conditional CSS-Loading — `import.meta.glob + ?inline`, nur aktives Design im HTML ✓
- [x] Service-Icon Hardcoded Colors → `color-mix(in srgb, var(--accent-light)/var(--sage) ...)` ✓

- [ ] `public/og-image.jpg` erstellen (1200×630px, PNG/JPEG) — **Pflicht vor Live-Schaltung**.
  Empfehlung: in Figma/Canva aus Logo + Tagline + Hintergrundfarbe (`theme.cream`) erstellen,
  als `public/og-image.jpg` ablegen. Pfad ist in `Base.astro` bereits verdrahtet.

- [ ] `astro:assets` `<Image>` für Kundenbilder — CMS-Bilder liegen in `public/uploads/` als URL-Strings.
  Für AVIF/WebP-Auto-Generation braucht es entweder Vercel Image Service (`@astrojs/vercel`) oder
  manuelle Konvertierung. Aktuell werden Bilder mit `loading="lazy"` + expliziten Dimensionen
  ausgeliefert — für die meisten Projekte ausreichend. Nur angehen wenn Page-Speed kritisch.

- [ ] `theme.fonts` in `meta.json` — Schriftpaar konfigurierbar machen (Serif + Sans).
  Erfordert: neues `fonts`-Objekt in `meta.json` + CMS-Schema-Eintrag in `config.yml` +
  `@font-face`-Generierung in `Base.astro`. Komplex, nur wenn Kunden mehrere Schriftpaare brauchen.

- [ ] `headline.split('. ')` durch strukturierte CMS-Felder ersetzen — `hero.headlineLine1/2/3` statt
  Freitext mit Punkt-Trennung. Erfordert: `content.json`-Schemaänderung + CMS-config.yml Update +
  alle Hero-Komponenten (10×) anpassen. Erst angehen wenn CMS-UX-Problem auftritt.

- [ ] Form-Group Selector entkoppeln — `.form-group input` → explizite Klassen wie `.form-input`.
  Nur CSS-Architektur, kein funktionaler Unterschied. Niedrige Priorität.

- [ ] Component-Map dynamisch via `import.meta.glob` — die explizite 10-Einträge-Map in `index.astro`
  durch Glob ersetzen. Aktuell ist die explizite Map verständlicher; erst bei > 12 Designs lohnt
  die Abstraktion.
