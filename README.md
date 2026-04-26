# homepage-starter

Wiederverwendbares One-Pager-Template für Kunden-Websites der Agentur **pixel&code**.  
Pro Kunde wird das Repo geklont. Konfiguration ausschließlich über JSON-Dateien — der Code wird nie angefasst.

**Live-Demo:** https://hompage-starter.vercel.app  
**CMS-Admin:** https://hompage-starter.vercel.app/admin/

---

## Tech-Stack

| Tool | Version | Zweck |
|---|---|---|
| Astro | 6.x | Static Site Generator |
| pnpm | 10.x | Paketmanager |
| Node.js | v22 LTS | Laufzeitumgebung |
| Decap CMS | 3.x | Content-Management (GitHub Backend) |
| Vercel | — | Hosting + Serverless Functions |
| Vanilla CSS | — | Custom Properties, kein Framework |

---

## Konfiguration

Alle Kunden-Werte leben in `config/`. Der Code wird nie angefasst.

| Datei | Inhalt |
|---|---|
| `config/design.json` | Aktives Design (ein Wert) |
| `config/meta.json` | Marke: siteName, theme (Farben), nav, Kontakt |
| `config/content.json` | Seiteninhalte: alle Sektionen mit `enabled`-Flag |
| `config/legal.json` | Impressum + Datenschutz: Adresse, Register, Hoster |

---

## Design-System

Der aktive Stil wird in `config/design.json` gesetzt:

```json
{ "design": "02-bold-editorial" }
```

`Base.astro` liest den Wert und setzt `data-design="..."` auf dem `<html>`-Tag.  
`index.astro` lädt pro Sektion die passende Komponente aus der Design-Map.

### Verfügbare Designs

| Key | Charakter | Eigene Komponenten |
|---|---|---|
| `01-warm-local` | Warm, lokal, klassisch | Hero |
| `02-bold-editorial` | Dunkel, mutig, editorial | Hero, About, Services |
| `03-minimal-clean` | Hell, reduziert, typografisch | Hero |
| `04-corporate-split` | Zweigeteilt, seriös, strukturiert | Hero, About |
| `05-vibrant-gradient` | Gradient, dynamisch, modern | Hero, Services |

Design wechseln: im CMS unter **"Design auswählen"** oder direkt in `config/design.json`.

### Dateistruktur

```
src/
  designs/
    02-bold-editorial/   Hero.astro, About.astro, Services.astro
    03-minimal-clean/    Hero.astro
    04-corporate-split/  Hero.astro, About.astro
    05-vibrant-gradient/ Hero.astro, Services.astro
  sections/              Shared Fallback-Komponenten
  styles/
    global.css
    designs/             02-bold-editorial.css, 03-minimal-clean.css, ...
```

---

## CMS (Decap CMS)

### Einloggen

1. `/admin/` aufrufen
2. "Login with GitHub" klicken
3. GitHub-Account autorisieren

### Bereiche

| Bereich | Datei | Inhalt |
|---|---|---|
| Design auswählen | `design.json` | Aktives Layout (visueller Picker) |
| Stammdaten & Design | `meta.json` | Name, Farben, Kontakt, Navigation |
| Inhalte | `content.json` | Texte, Bilder, Pakete, Bewertungen |
| Firmendaten & Impressum | `legal.json` | Adresse, Register, Hoster |

### OAuth-Einrichtung (einmalig pro Projekt)

1. GitHub OAuth App erstellen → Settings → Developer Settings → OAuth Apps
2. Callback URL: `https://[domain]/api/auth`
3. `client_id` in `public/admin/config.yml` eintragen
4. `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` als Vercel Environment Variables setzen

---

## Deployment (Vercel)

```
Build Command:     pnpm build
Output Directory:  dist
Framework Preset:  Astro
```

Jeder Push auf `main` triggert automatisch einen neuen Build.  
Decap CMS committet Änderungen direkt auf GitHub — das triggert ebenfalls einen Deploy.

---

## Sektionen

Alle in `config/content.json` mit `enabled: true/false` steuerbar. Nav filtert deaktivierte automatisch.

| Sektion | Astro-Datei | Anmerkung |
|---|---|---|
| Hero | design-spezifisch | Jedes Design eigene Komponente |
| Über uns | About.astro / design-spezifisch | Design 02 + 04 eigene Komponente |
| Leistungen | Services.astro / design-spezifisch | Design 02 + 05 eigene Komponente |
| Galerie | Gallery.astro | Design-CSS überschreibt Layout |
| Kennzahlen | Stats.astro | — |
| Preise | Pricing.astro | — |
| Bewertungen | Reviews.astro | — |
| Kontakt | Contact.astro | Formular mit JS-Validierung |
| Footer | Footer.astro | — |

---

## Rechtliche Seiten (DE)

| Seite | Route | Datenquelle |
|---|---|---|
| Impressum | `/impressum` | `config/legal.json` |
| Datenschutz | `/datenschutz` | `config/legal.json` |
| Cookie-Banner | global | `CookieBanner.astro` |

---

## Lokale Entwicklung

```bash
pnpm install
pnpm dev        # → http://localhost:4321
pnpm build      # Produktions-Build → dist/
pnpm preview    # Build lokal vorschauen
```

---

## Pro Kunde: Checkliste

1. Repo klonen: `git clone <repo-url> kunde-name && cd kunde-name`
2. Design wählen: `config/design.json`
3. Marke eintragen: `config/meta.json` — siteName, theme (Farben), nav, Kontakt
4. Inhalte eintragen: `config/content.json` — Sektionen befüllen, nicht benötigte auf `enabled: false`
5. Legal eintragen: `config/legal.json` — alle `[…]`-Platzhalter ersetzen
6. OG-Bild erstellen: `public/og-image.jpg` (1200×630 px)
7. Domain eintragen: `astro.config.mjs → site`
8. Neues Vercel-Projekt anlegen + GitHub-Repo verbinden
9. Environment Variables setzen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
10. GitHub OAuth App Callback URL auf neue Domain aktualisieren
11. `public/admin/config.yml → base_url` auf neue Domain setzen

---

## Sicherheit

`public/_headers` setzt für alle Routen strikte Security-Header (CSP, X-Frame-Options etc.).  
`/admin/*` hat eine eigene permissivere CSP — Decap CMS benötigt `unsafe-eval`.
