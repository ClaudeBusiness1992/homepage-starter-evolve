# homepage-starter-evolve

Wiederverwendbares One-Pager-Template für Kunden-Websites der Agentur **pixel&code**.  
Pro Kunde wird das Repo geklont. Konfiguration ausschließlich über JSON-Dateien — der Code wird nie angefasst.

**Live-Demo:** https://homepage-starter-evolve.vercel.app  
**CMS-Admin:** https://homepage-starter-evolve.vercel.app/admin/

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
| WOFF2 (self-hosted) | — | DM Serif Display + Outfit, DSGVO-konform |

---

## Konfiguration

Alle Kunden-Werte leben in `config/`. Der Code wird nie angefasst.

| Datei | Inhalt |
|---|---|
| `config/design.json` | Aktives Design (ein Wert) |
| `config/meta.json` | Marke: siteName, theme (Farben), nav, Kontakt |
| `config/content.json` | Seiteninhalte: alle Sektionen mit `enabled`-Flag |
| `config/extras.json` | Add-ons: Countdown, Galerie, Bewertungen, Buchung — je mit Toggle + Inhalten |
| `config/legal.json` | Impressum + Datenschutz: Adresse, Register, Hoster |

---

## Architektur

Das Template basiert auf einer einheitlichen Master-Struktur. Alle Sektionen liegen in `src/sections/`, Styling in `src/styles/global.css`. Pro Kundenprojekt wird ausschließlich über die Config-Dateien angepasst — es gibt keine designspezifischen Komponenten-Varianten.

```
src/
  components/       Nav, CookieBanner, Lightbox, SectionHeader
  layouts/          Base.astro
  sections/         Hero, About, Services, Gallery, Stats, Pricing,
                    Reviews, Booking, Countdown, Sponsors, Contact, Footer
  styles/
    global.css      Alle Custom Properties + Layout-Regeln
config/
  design.json       Aktives Design
  meta.json         Marke + Theme-Farben
  content.json      Seiteninhalte
  extras.json       Add-ons
  legal.json        Rechtliche Angaben
```

`Base.astro` liest `design.json` und setzt `data-design="..."` auf dem `<html>`-Tag.  
CSS-Überschreibungen pro Design erfolgen über `[data-design="..."]`-Selektoren in `global.css`.

---

## CMS (Decap CMS)

### Einloggen

1. `/admin/` aufrufen
2. "Login with GitHub" klicken
3. GitHub-Account autorisieren

### Bereiche

| Bereich | Datei | Inhalt |
|---|---|---|
| Design auswählen | `design.json` | Aktives Layout |
| Stammdaten & Design | `meta.json` | Name, Farben, Kontakt, Navigation |
| Inhalte | `content.json` | Texte, Bilder, Pakete |
| Erweiterungen / Add-ons | `extras.json` | Countdown, Galerie, Bewertungen, Buchung |
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

Alle in `config/content.json` (Kern) bzw. `config/extras.json` (Add-ons) mit `enabled: true/false` steuerbar. Nav filtert deaktivierte automatisch.

| Sektion | Datei | Quelle |
|---|---|---|
| Hero | `Hero.astro` | `content.json` |
| Über uns | `About.astro` | `content.json` — unterstützt Intro-Text + Lightbox-Fotos |
| Leistungen | `Services.astro` | `content.json` |
| Galerie | `Gallery.astro` | `extras.json` (Add-on) |
| Kennzahlen | `Stats.astro` | `content.json` |
| Preise | `Pricing.astro` | `content.json` |
| Bewertungen | `Reviews.astro` | `extras.json` (Add-on) |
| Buchung | `Booking.astro` | `extras.json` (Add-on) |
| Countdown | `Countdown.astro` | `extras.json` (Add-on) — erscheint über dem Hero |
| Sponsoren | `Sponsors.astro` | `content.json` |
| Kontakt | `Contact.astro` | `content.json` |
| Footer | `Footer.astro` | `content.json` |

### Lightbox

Galerie- und About-Bilder öffnen sich in einem Vollbild-Overlay (`Lightbox.astro`, global eingebunden). Trigger: `data-lightbox`, `data-alt`, `data-caption`, `data-category` am jeweiligen Element. Navigation per Pfeiltasten, Swipe und ‹/›-Buttons.

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
2. Marke eintragen: `config/meta.json` — siteName, theme (Farben), nav, Kontakt
3. Inhalte eintragen: `config/content.json` — Sektionen befüllen, nicht benötigte auf `enabled: false`
4. Add-ons konfigurieren: `config/extras.json` — Countdown, Galerie, Bewertungen, Buchung aktivieren
5. Legal eintragen: `config/legal.json` — alle `[…]`-Platzhalter ersetzen
6. OG-Bild erstellen: `public/og-image.jpg` (1200×630 px)
7. Domain eintragen: `astro.config.mjs → site`
8. Neues Vercel-Projekt anlegen + GitHub-Repo verbinden
9. Environment Variables setzen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
10. GitHub OAuth App Callback URL auf neue Domain aktualisieren
11. `public/admin/config.yml → base_url` + `client_id` auf neue Domain/App setzen

---

## Sicherheit

`vercel.json` ist die autoritative Quelle für Security-Header (Vercel liest sie vor `public/_headers`).  
Beide Dateien setzen für alle Routen strikte Header (CSP, X-Frame-Options etc.).  
`/admin/*` hat eine eigene permissivere CSP — Decap CMS benötigt `unsafe-eval`.
