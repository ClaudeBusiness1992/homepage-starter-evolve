# homepage-starter

Wiederverwendbares One-Pager-Template für Kunden-Websites — entwickelt von **pixel&code**.

Pro Kunde wird das Projekt geklont und über drei Config-Dateien konfiguriert: Marke, Inhalte, Legal. Output: statische Website, deploybar auf Netlify Free Tier.

---

## Tech-Stack

| Tool | Version | Zweck |
|---|---|---|
| Astro | 6.x | Static Site Generator |
| pnpm | 10.x | Paketmanager |
| Vanilla CSS | — | Custom Properties, kein Framework |
| WOFF2 (self-hosted) | — | DM Serif Display + Outfit, DSGVO-konform |
| Netlify | — | Deployment + Formulare + Security-Headers |

---

## Schnellstart

```bash
pnpm install
pnpm dev        # → http://localhost:4321
pnpm build      # → dist/
pnpm preview    # Build lokal vorschauen
```

---

## Config-Struktur

Alle Kunden-Werte leben in drei Dateien im `config/`-Ordner. Der Code selbst wird nie angefasst.

| Datei | Inhalt |
|---|---|
| `config/meta.json` | Marke (Name, Farben, Kontakt, Nav), Design-Auswahl |
| `config/content.json` | Seiteninhalte (alle Sektionen: Texte, Bilder, Pakete, Bewertungen) |
| `config/legal.json` | Impressum + Datenschutz (Adresse, Registernummer, Hoster etc.) |

---

## Design-System

Das Template unterstützt mehrere visuelle Stile. Der aktive Stil wird in `config/meta.json` gesetzt:

```json
{ "design": "01-warm-local" }
```

| Design | Status | Zielgruppe |
|---|---|---|
| `01-warm-local` | ✅ fertig | Handwerk, lokale Dienstleister |
| `02-bold-editorial` | 🔨 in Arbeit | Kreativbranchen |
| `03-minimal-clean` | 🔨 in Arbeit | Freelancer, Agenturen |
| `04-corporate-trust` | Geplant | Beratung, Kanzleien |

Jedes Design überschreibt nur was abweicht — via `[data-design="..."]`-Selektor in `src/styles/designs/`. Die Basis (`global.css`) bleibt für alle gleich.

### Farben anpassen

Alle Farben sind CSS Custom Properties, gesetzt in `config/meta.json → theme`:

```json
"theme": {
  "ink":        "#1a1a2e",
  "cream":      "#f5f0e8",
  "accent":     "#e8631b",
  "accentLight":"#ff8c42",
  "sage":       "#4a7c6f"
}
```

`--accent-text` wird automatisch aus `--accent` abgeleitet (75% Accent + 25% Schwarz) — für WCAG-konformen Text auf hellem Hintergrund.

---

## Sektionen

Alle Sektionen sind modular — per `enabled: true/false` in `config/content.json` ein- oder ausschaltbar. Die Nav filtert automatisch deaktivierte Sektionen heraus.

| Sektion | Komponente | Klasse |
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

Sektionen auf dunklem Hintergrund tragen die Klasse `section--dark` — das regelt Textfarben automatisch.

---

## Komponenten

| Komponente | Zweck |
|---|---|
| `src/components/Nav.astro` | Navigation, Burger-Menü, Logo |
| `src/components/SectionHeader.astro` | Wiederverwendbarer Label + H2 + Subline Block |
| `src/components/CookieBanner.astro` | TTDSG-konformer Cookie-Banner |

`SectionHeader` nimmt `label`, `headline`, `subline` und optionales `center` Prop.

---

## Pflicht-Pages (DE-Recht)

| Page | Route | Quelle |
|---|---|---|
| Impressum (§5 DDG) | `/impressum` | `config/legal.json` |
| Datenschutzerklärung (DSGVO) | `/datenschutz` | `config/legal.json` |
| Cookie-Banner (TTDSG) | global | `Base.astro` |

---

## Fonts

Fonts sind selbst gehostet (DSGVO-konform, kein Google-CDN-Request):

- `public/fonts/*.woff2` — 12 Dateien (DM Serif Display + Outfit in 4 Gewichten, je latin + latin-ext)
- `@font-face`-Regeln in `src/styles/global.css` (ganz oben)
- Preload für die zwei kritischsten Dateien in `Base.astro`

---

## Sicherheit

`netlify.toml` setzt für alle Routen:
- `Content-Security-Policy` (nur eigene Ressourcen + inline-Styles für Theme-Injection)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (kein Kamera/Mikro/Geo)

---

## Pro Kunde: Checkliste

1. Repo klonen: `git clone <repo-url> kunde-name && cd kunde-name`
2. Design wählen: `config/meta.json → design`
3. Marke eintragen: `config/meta.json` — Name, Farben, Kontakt, Logo-Akzent (`siteNameAccent`)
4. Inhalte eintragen: `config/content.json` — alle Sektionen befüllen, nicht benötigte auf `enabled: false`
5. Legal eintragen: `config/legal.json` — alle `[…]`-Platzhalter ersetzen
6. Domain eintragen: `astro.config.mjs → site`
7. OG-Bild erstellen: `public/og-image.jpg` (1200×630px)
8. `pnpm build` → `dist/` auf Netlify hochladen

---

## Qualitäts-Audits

7 Slash-Commands für Claude Code — im Projekt-Root ausführen:

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

- **Paketmanager:** immer `pnpm`
- **Commits:** `feat:`, `fix:`, `chore:`, `style:`
- **Config:** Kunden-Werte nur in `config/` — nie direkt im Code
- **CSS:** Custom Properties, keine externen UI-Libraries
- **Designs:** Überschreibungen nur in `src/styles/designs/*.css` via `[data-design]`
