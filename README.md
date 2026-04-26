# homepage-starter

Wiederverwendbares Website-Template für kleine Unternehmen — pixel&code.

## Was ist das?

Astro-basiertes Template-System. Pro Kunde wird das Projekt geklont und über eine zentrale `client.config.json` konfiguriert (Texte, Farben, Sektionen ein/aus). Output: schlanke statische Website, deploybar auf Netlify, Vercel, GitHub Pages.

## Tech-Stack

- **Astro 6** (Static Site Generator)
- **pnpm** (Paketmanager)
- **Vanilla CSS** (keine UI-Library)
- **Google Fonts:** DM Serif Display + Outfit

## Schnellstart

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # Production-Build → dist/
pnpm preview      # Build lokal vorschauen
```

## Sektionen (modular, ein-/ausschaltbar)

| Section | Komponente | Status |
|---|---|---|
| Hero | `src/sections/Hero.astro` | ✅ |
| Über uns / Team | `src/sections/About.astro` | ✅ |
| Leistungen | `src/sections/Services.astro` | ✅ |
| Galerie | `src/sections/Gallery.astro` | ✅ |
| Kennzahlen | `src/sections/Stats.astro` | ✅ |
| Preise | `src/sections/Pricing.astro` | ✅ |
| Bewertungen | `src/sections/Reviews.astro` | ✅ |
| Kontakt | `src/sections/Contact.astro` | ✅ |
| Footer | `src/sections/Footer.astro` | ✅ |

## Pflicht-Pages (DE-Recht)

- `/impressum` — generiert aus `config.legal`
- `/datenschutz` — generiert aus `config.legal`
- Cookie-Banner (TTDSG) — global via `Base.astro` Layout

## Pro Kunde anpassen

1. Repo klonen oder kopieren
2. `config/client.config.json` befüllen — alle `[…]`-Platzhalter ersetzen
3. Theme-Farben in `config.theme` anpassen
4. Sektionen via `enabled: true/false` ein-/ausschalten
5. Vor Launch: `docs/legal-checklist.md` durchgehen
6. Deployment: `pnpm build` → `dist/` hochladen

## Docs

- `docs/setup.md` — Erstinstallation
- `docs/customization.md` — Anpassung pro Kunde
- `docs/design-catalog.md` — Übersicht der Grundformate
- `docs/legal-checklist.md` — DE-Rechtspflichten

## Repository

- `main` — stabiler Stand
- Feature-Branches für größere Änderungen
