---
status: erledigt
bereich: Bugs & Fixes
---

`Base.astro` Zeile 42: `<title>{meta.siteName}</title>` — sollte `{meta.siteName} — {meta.tagline}` sein.

Erledigt: `Base.astro` rendert jetzt `{meta.siteName}{meta.tagline ? ` — ${meta.tagline}` : ''}`. Tagline ist optional — bei leerem Feld erscheint nur der Site-Name.
