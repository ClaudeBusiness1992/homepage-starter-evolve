---
status: erledigt
bereich: Bugs & Fixes
---

`Stats.astro` existiert und `s.stats` ist in `content.json` aktiv — aber `index.astro` rendert die Sektion nie. Entweder als Sektion einbauen oder aus Code + Config entfernen.

Entschieden: Sektion wird nicht eingebaut — wirkt als eigenständige Snap-Seite überflüssig. Stats-Daten fließen weiterhin in die Reviews-Sektion ein wenn aktiv.
