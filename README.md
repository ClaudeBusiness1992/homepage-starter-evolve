# homepage-starter

Wiederverwendbares One-Pager-Template für Kunden-Websites — entwickelt von **pixel&code**.

Pro Kunde wird das Projekt geklont und über eine einzige `config/client.config.json` konfiguriert: Texte, Farben, Sektionen, Legal-Daten. Output: schlanke statische Website, deploybar auf Netlify Free Tier.

---

## Tech-Stack

| Tool | Version | Zweck |
|---|---|---|
| Astro | 6.x | Static Site Generator |
| pnpm | 10.x | Paketmanager |
| Vanilla CSS | — | Custom Properties, kein Framework |
| Google Fonts | — | DM Serif Display + Outfit |
| Netlify | — | Deployment (Drag & Drop oder GitHub) |

---

## Schnellstart

```bash
pnpm install
pnpm dev        # → http://localhost:4321
pnpm build      # → dist/ (Production-Build)
pnpm preview    # Build lokal vorschauen
```

---

## Sektionen

Alle Sektionen sind modular — per `enabled: true/false` in der Config ein- oder ausschaltbar.

| Sektion | Komponente | Status |
|---|---|---|
| Hero | `src/sections/Hero.astro` | ✅ |
| Über uns / Team | `src/sections/About.astro` | ✅ |
| Leistungen | `src/sections/Services.astro` | ✅ |
| Galerie | `src/sections/Gallery.astro` | ✅ |
| Kennzahlen (animiert) | `src/sections/Stats.astro` | ✅ |
| Preise | `src/sections/Pricing.astro` | ✅ |
| Bewertungen | `src/sections/Reviews.astro` | ✅ |
| Kontaktformular | `src/sections/Contact.astro` | ✅ |
| Footer | `src/sections/Footer.astro` | ✅ |

---

## Pflicht-Pages (DE-Recht)

| Page | Route | Quelle |
|---|---|---|
| Impressum (§5 DDG) | `/impressum` | `config.legal` |
| Datenschutzerklärung (DSGVO) | `/datenschutz` | `config.legal` |
| Cookie-Banner (TTDSG) | global | `Base.astro` |

Alle Legal-Inhalte werden automatisch aus `config/client.config.json` generiert — kein manuelles Bearbeiten von HTML.

---

## Pro Kunde anpassen

1. Repo klonen: `git clone <repo-url> kunde-name && cd kunde-name`
2. `config/client.config.json` öffnen — alle `[…]`-Platzhalter ersetzen
3. Farben unter `config.theme` anpassen (`accent`, `ink`, `cream`, `sage`)
4. Sektionen via `enabled: true/false` ein-/ausschalten
5. Bilder in `public/` ablegen und Pfade in Config eintragen
6. `docs/legal-checklist.md` vor Launch durchgehen
7. `pnpm build` → `dist/` auf Netlify hochladen

---

## Design-Formate (Roadmap)

| Format | Status | Zielgruppe |
|---|---|---|
| `01-warm-local` | ✅ gebaut | Handwerk, lokale Dienstleister |
| `02-minimal-clean` | Geplant | Freelancer, Agenturen |
| `03-bold-editorial` | Geplant | Kreativbranchen |
| `04-corporate-trust` | Geplant | Beratung, Kanzleien |
| `05–10` | Geplant | Weitere Branchen |

Details: `docs/design-catalog.md`

---

## Qualitäts-Audits

Im Projekt-Root stehen 7 Slash-Commands für Claude Code zur Verfügung:

| Command | Prüft | Wann |
|---|---|---|
| `/audit-architecture` | Modul-Grenzen, Dependency-Richtung | Nach Refactoring |
| `/audit-customizing` | Hardcoded Werte, Customizing-Readiness | Pro Kunden-Branch |
| `/audit-quality` | Naming, Duplikate, Dead Code | Wöchentlich |
| `/audit-ui` | Komponenten-Konsistenz, Button-States | Nach Style-Änderungen |
| `/audit-a11y` | WCAG 2.1 AA, Heading-Reihenfolge, Alt-Texte | Vor Release |
| `/audit-performance` | Bundle, Bilder, Hydration | Vor Release |
| `/audit-security-seo` | Secrets, Meta-Tags, CSP, Sitemap | Vor Live-Schaltung |

Empfohlene Reihenfolge beim Erst-Audit: architecture → customizing → quality → a11y → ui → performance → security-seo. Details: `docs/audit-agents.md`

---

## Docs

| Datei | Inhalt |
|---|---|
| `docs/design-catalog.md` | Übersicht aller Design-Formate |
| `docs/legal-checklist.md` | DE-Rechtspflichten vor Launch |
| `docs/audit-agents.md` | Audit-Commands Dokumentation |
| `docs/setup.md` | Erstinstallation Entwicklungsumgebung |
| `docs/customization.md` | Anpassung pro Kunde |
| `CLAUDE.md` | Claude Code Kontext & Projektkonventionen |

---

## Repository-Konventionen

- **Paketmanager:** immer `pnpm`, nie `npm install`
- **Commits:** `feat:`, `fix:`, `chore:`, `style:` als Prefix
- **Sprache:** Deutsch für Kommentare und Commit-Messages
- **Config:** Kunden-Werte nur in `config/client.config.json`
- **CSS:** Custom Properties, keine externen UI-Libraries
