# pixel&code — Übersicht

Arbeits-Vault für Produkt und Gründung. Zuletzt geprüft: 2026-05-13.

---

## Entwicklung

```
pnpm dev        → http://localhost:4321  (lokaler Dev-Server)
pnpm build      → dist/                 (Produktions-Build)
pnpm preview    → Build lokal vorschauen
```

Claude Code starten (immer aus dem Projektordner):
```
cd C:\ClaudeBusiness\homepage-starter-evolve
claude
```

---

## Ordnerstruktur

| Ordner | Inhalt |
|---|---|
| [[Bugs & Fixes/Bugs & Fixes\|Bugs & Fixes]] | Bekannte Fehler im Template (4 offen) |
| [[Roadmap & Features/Roadmap & Features\|Roadmap & Features]] | Geplante Erweiterungen |
| [[Qualitätssicherung/Qualitätssicherung\|Qualitätssicherung]] | Pre-Launch Checklisten, Standards |
| [[Gründung & Legal/Gründung & Legal\|Gründung & Legal]] | Gewerbeanmeldung, Steuer, AGB, Versicherung |
| [[Geschäftsmodell/Geschäftsmodell\|Geschäftsmodell]] | Pakete, Preise, Positionierung |
| [[Externe Dienste/Externe Dienste\|Externe Dienste]] | Vercel, GitHub, Resend, Setup-Checklisten |

---

## Nächste Schritte

### Produkt (Bugs zuerst)
1. `<title>` um Tagline ergänzen — 5-Minuten-Fix in `Base.astro`
2. ~~404-Seite anlegen — `src/pages/404.astro`~~ ✓
3. Stats-Bug klären — Sektion einbauen oder sauber entfernen
4. Favicon-Lösung umsetzen

### Gründung
1. Prüfen: Freiberufler oder Gewerbe? (vor Anmeldung klären)
2. Gewerbeanmeldung beim Gewerbeamt
3. Krankenversicherung als Selbstständiger regeln (Fristen beachten!)
4. Fragebogen zur steuerlichen Erfassung — Kleinunternehmerregelung §19 UStG wählen
