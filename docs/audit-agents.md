# Test-Agent-Suite für modulare Astro-Basis

Sieben spezialisierte Audit-Agents als Slash-Commands für Claude Code.

## Installation

1. Kopiere den Ordner `.claude/commands/` ins Root deines Astro-Projekts.
2. Starte Claude Code im Projekt-Root.
3. Tippe `/` — die sieben Befehle erscheinen.

```
.claude/commands/
├── audit-architecture.md     → /audit-architecture
├── audit-customizing.md      → /audit-customizing
├── audit-quality.md          → /audit-quality
├── audit-ui.md               → /audit-ui
├── audit-a11y.md             → /audit-a11y
├── audit-performance.md      → /audit-performance
└── audit-security-seo.md     → /audit-security-seo
```

Alle Befehle akzeptieren optional einen Pfad/Glob als Argument:
```
/audit-ui src/components/header
/audit-a11y src/pages/index.astro
```

## Wann welchen Agent anwerfen

| Phase | Agent(s) | Häufigkeit |
|---|---|---|
| **Basis-Build (jetzt)** | `audit-architecture`, `audit-customizing`, `audit-quality` | Einmalig + nach Refactorings |
| **Vor jedem Release** | `audit-a11y`, `audit-performance`, `audit-security-seo` | Pflicht |
| **Pro Kunden-Customizing** | `audit-customizing`, dann `audit-ui` + `audit-a11y` | Pro Kunden-Branch |
| **Continuous während Entwicklung** | `audit-quality` | Wöchentlich oder vor jedem Merge |

## Empfohlene Reihenfolge beim Erst-Audit

1. **`audit-architecture`** zuerst — wenn die Architektur kaputt ist, sind alle anderen Audits Symptom-Behandlung.
2. **`audit-customizing`** — der Lackmustest für deinen Use-Case.
3. **`audit-quality`** — Hygiene.
4. **`audit-a11y`** — vor Style-Politur.
5. **`audit-ui`** — Konsistenz der Komponenten.
6. **`audit-performance`** — am besten nach erstem Build.
7. **`audit-security-seo`** — vor Live-Schaltung.

## Token-/Performance-Note

| Agent | Geschätzter Prompt-Output (Tokens) | Empfohlenes Modell | Erwartete Laufzeit |
|---|---|---|---|
| audit-architecture | ~3k–8k | Sonnet | 1–3 min |
| audit-customizing | ~3k–6k | Sonnet | 1–2 min |
| audit-quality | ~2k–6k | Sonnet | 1–3 min |
| audit-ui | ~3k–7k | Sonnet | 2–4 min |
| audit-a11y | ~4k–9k | Sonnet | 2–4 min |
| audit-performance | ~3k–7k | Sonnet | 2–5 min (mit Build-Run länger) |
| audit-security-seo | ~3k–8k | Sonnet | 2–4 min |

**Modell-Wahl:** Sonnet ist für alle Audits ausreichend. Opus nur wenn die Befunde inkonsistent oder zu oberflächlich werden. Haiku ist zu knapp für die strukturellen Bewertungen.

**Optimierungs-Hebel falls Budget knapp:**
1. Scope einengen via Argument: `/audit-ui src/components/header` statt ganzes Repo.
2. `audit-quality` auf Wochen-Rhythmus statt jeden Commit.
3. Bei sehr großen Repos: einzelne `src/`-Unterordner einzeln auditieren statt alles auf einmal.

## Test-Strategie für die Agents (Validierung)

Bevor du den Agents im Ernstfall vertraust: **Verifiziere, dass sie funktionieren**, indem du absichtlich Probleme in deine Codebase einbaust und prüfst, ob sie gefunden werden.

### Smoke-Tests pro Agent

**`audit-architecture`** — bau ein:
- Eine Komponente, die direkt aus einer Geschwister-Komponente importiert (statt über Slot/Props).
- Erwartung: Critical oder High mit konkretem Datei:Zeile-Hinweis.

**`audit-customizing`** — bau ein:
- Eine Komponente mit `style="color: #FF6600;"` inline.
- Eine hardcoded Headline `<h1>Willkommen bei Müller GmbH</h1>` in einer Page.
- Erwartung: Beide als Critical/High in der Customizing-Checkliste rot markiert.

**`audit-quality`** — bau ein:
- Eine ungenutzte Komponente in `src/components/Unused.astro`.
- Eine `console.log("debug")` in einem Layout.
- Erwartung: Beides erkannt.

**`audit-ui`** — bau ein:
- Einen `<button>` ohne `:focus-visible` und ohne `:hover` im CSS.
- Drei Stellen mit ähnlicher Card-Markup-Struktur.
- Erwartung: Button-States als High, Card-Duplikate als High mit allen 3 Fundstellen.

**`audit-a11y`** — bau ein:
- Ein `<img src="...">` ohne `alt`.
- Einen `<div onclick="...">` statt Button.
- Eine Page mit `<h1>` gefolgt von `<h3>` (Heading-Sprung).
- Erwartung: Drei separate Critical/High-Befunde mit WCAG-Nummern.

**`audit-performance`** — bau ein:
- Eine Komponente mit `client:load` für reines Markup ohne Interaktion.
- Ein Bild in `public/` mit > 500kb, ohne Optimierung.
- Erwartung: Beide als High oder Critical.

**`audit-security-seo`** — bau ein:
- Eine `.env.example` mit `API_KEY=fake_key_for_testing` in `public/` (nicht nur Repo-Root!).
- Eine Page ohne `<title>`.
- Ein `<a href="..." target="_blank">` ohne `rel`.
- Erwartung: Alle drei in entsprechender Kategorie, Secret-Wert redacted.

### Adversarial-Test (für alle Agents gemeinsam)

Eine Datei `src/components/Trap.astro` einbauen mit folgendem Inhalt:

```astro
---
// Diese Komponente ist absichtlich problematisch
const apiKey = "sk_live_BEISPIEL_KEY_HIER_EINTRAGEN";
const userInput = Astro.props.html;
---
<div onclick="alert('xss')">
  <h1>Test</h1>
  <h3>Skip</h3>
  <img src="/big.jpg">
  <button>No states</button>
  <a href="https://evil.com" target="_blank">Click here</a>
  <Fragment set:html={userInput} />
</div>
```

Diese Datei sollte von **mindestens 5 der 7 Agents** als problematisch markiert werden (architecture, quality, ui, a11y, security-seo). Wenn nicht, sind die Prompts zu schwach — gib Feedback, dann nachschärfen.

## Iteration

Wenn ein Agent zu oberflächliche Reports liefert: typische Ursachen sind
- zu großer Scope (lass ihn auf Unterordner los),
- fehlender Code-Stil im Repo (Agent kann Konventionen nicht ableiten — dann explizit in den Prompt schreiben),
- zu viele Befunde verlangt (Agents priorisieren bei Token-Druck — frag den Agent gezielt nach den Top 3 statt allem).

Bei Bedarf: jeden Prompt einzeln nachschärfen, statt alle gleichzeitig.
