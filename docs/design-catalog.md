# Design-Katalog

Übersicht aller geplanten Grundformate. Pro Kunde werden 2–3 passende Designs vorgestellt, dann auf eines verengt und individualisiert.

## Status-Legende

- ✅ Gebaut & einsatzbereit
- 🚧 In Arbeit
- 📋 Geplant

## Die 10 Grundformate

| # | Name | Status | Archetyp | Geeignet für |
|---|---|---|---|---|
| 01 | warm-local | ✅ | Caregiver / Everyman | Lokale Handwerker, Cafés, Praxen |
| 02 | minimal-clean | 📋 | Sage / Innocent | Berater, Coaches, Steuerberater |
| 03 | bold-editorial | 📋 | Hero / Creator | Kreative, Fotografen, Designer |
| 04 | corporate-trust | 📋 | Ruler / Sage | Anwälte, B2B, Versicherungen |
| 05 | tech-modern | 📋 | Magician / Creator | IT, Software, Agenturen |
| 06 | luxury-elegant | 📋 | Ruler / Lover | Premium-Dienstleister, Mode |
| 07 | restaurant-menu | 📋 | (Layout) | Gastronomie mit Speisekarte |
| 08 | booking-service | 📋 | (Layout) | Friseur, Massage, Praxen |
| 09 | portfolio-visual | 📋 | (Layout) | Innenarchitekten, Fotografen |
| 10 | onepage-compact | 📋 | (Layout) | Single-Page Lead-Funnel |

## Anpassungs-Achsen

Jedes Design wird pro Kunde über folgende Hebel individualisiert:

| Achse | Wo definiert | Beispiel |
|---|---|---|
| Farben | `client.config.json` → `theme` | Tiefblau/Weiß vs. Anthrazit/Orange |
| Fonts | `Base.astro` (Google Fonts URL) | Outfit+DM Serif vs. Inter+Merriweather |
| Logo | `client.config.json` → `meta.siteName` + Asset | Wortmarke / Bildmarke |
| Fotos | `/public/` Assets + `gallery.items[].src` | Eigene Fotos einsetzen |
| Texte | `client.config.json` → `sections.*` | Komplett kundenindividuell |
| Section-Reihenfolge | `index.astro` | Hero→Services vs. Hero→About |
| Section ein/aus | `client.config.json` → `sections.*.enabled` | Stats off, Gallery on |

## Regel: Keine Doppelvergabe an Konkurrenten

Verkaufe niemals dasselbe Design + dieselbe Farbpalette an direkte Konkurrenten in derselben Region.
Variiere mindestens Farb- und Hero-Variante zwischen ähnlichen Kunden.

## 01 — warm-local (aktuelles Design)

**Stil:** Cremefarbener Hintergrund, dunkle Akzente, Orange als Highlight. Serif-Headlines mit DM Serif Display, sans-serif für Body. Browser-Mockup im Hero.

**Sections:** Hero, About (Team), Services (6 Karten), Gallery (Projekte), Stats, Pricing (3 Pakete), Reviews, Contact, Footer

**Geeignet für:** Lokale Dienstleister mit Persönlichkeit — kleine Agenturen, Handwerker mit Team, Café-Betreiber, Familienpraxen.

**Vorgeschlagene Farbvarianten** (Phase 2):
- Default: Cream + Orange (warm, kreativ)
- Sage: Cream + Salbeigrün (ruhig, professionell)
- Navy: Cream + Marineblau (vertrauenswürdig)
- Burgundy: Cream + Bordeaux (edel, etabliert)

**Vorgeschlagene Hero-Varianten** (Phase 2):
- Default: Browser-Mockup (modern, tech-affin)
- Photo: Echtes Team-Foto (persönlich)
- Pattern: Geometrische Illustration (kreativ)
