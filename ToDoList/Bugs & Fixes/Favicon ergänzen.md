---
status: erledigt
bereich: Bugs & Fixes
---

Kein `<link rel="icon">` in `Base.astro`, keine Datei in `public/`. Browser zeigen leeres Tab-Symbol.

Erledigt: Dynamisches SVG-Favicon per `data:image/svg+xml` in `Base.astro` — generiert aus dem ersten Buchstaben von `meta.siteName` + Akzentfarbe (`theme.accent`). Keine statische Datei nötig, funktioniert für alle Kunden automatisch.
