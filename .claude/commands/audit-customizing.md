---
description: Customizing-Readiness-Audit — wie gut lässt sich die Basis pro Kunde anpassen ohne Core-Bruch?
allowed-tools: Read, Glob, Grep
argument-hint: [optional: pfad oder glob]
---

# ROLLE
Du bist Senior Engineer mit Erfahrung in White-Label-Produkten und Multi-Tenant-Frontends. Du denkst aus der Perspektive eines Kollegen, der die Basis in 2 Stunden auf Kunde X anpassen muss.

# AUFGABE
Prüfe, **wie customizable die Basis ist**. Ziel: Pro neuem Kunde sollen nur kundenspezifische Configs/Tokens angefasst werden, **niemals** Core-Komponenten.

Scope: ${ARGUMENTS:-das gesamte Repo}

# KONTEXT
- Astro 6 (SSG), Plain CSS mit Custom Properties, JS (kein TS), Vite intern
- Use Case: **Eine Basis, mehrfach customized verkauft.** Customizing umfasst typischerweise: Branding (Logo, Farben, Typo), Texte, Bilder, Sektions-Reihenfolge, Footer-Inhalte, ggf. neue/entfernte Sektionen.

# DIE KRITISCHE FRAGE
> Bei jedem Befund frage dich: **"Wenn Kunde X morgen onboarded wird — muss ich für diesen Punkt eine Core-Datei anfassen?"** Falls ja, ist das ein Customizing-Risiko.

# VORGEHEN

## 1. Branding-Boundaries
- **Farben:** Sind ALLE Farben über CSS Custom Properties definiert (`var(--color-...)`)? `Grep` nach Hex-Codes (`#[0-9a-fA-F]{3,8}`), `rgb(`, `hsl(` außerhalb der zentralen Token-Datei.
- **Fonts:** Zentral in einer Datei deklariert? Oder verstreut?
- **Logo/Bilder:** Liegen Marken-Assets in einem klar getrennten Ordner (z.B. `src/branding/` oder `public/brand/`)? Oder mit Komponenten vermischt?
- **Spacing/Radien/Shadows:** Über Custom Properties oder hardcoded?

## 2. Inhalts-Trennung
- Werden Texte (Headlines, Body-Copy, CTAs) über **Content Collections** oder **Config-Files** verwaltet? Oder direkt in `.astro`-Komponenten hardcoded?
- Gibt es eine zentrale `site.config.{js,json}` oder ähnliches mit kundenspezifischen Daten (Firmenname, Kontaktdaten, Social-Links)?
- Welche `.astro`-Files enthalten deutschen/englischen Klartext, der pro Kunde wechseln muss?

## 3. Strukturelle Flexibilität
- **Slots:** Werden Astro-Slots eingesetzt, damit Layouts Inhalte austauschbar einbetten? Oder feste Struktur?
- **Sektionen:** Kann die Reihenfolge von Homepage-Sektionen ohne Page-Edit geändert werden? (Z.B. Liste in Config statt fester Markup-Reihenfolge.)
- **Komponenten-Parametrisierung:** Akzeptieren Komponenten ihre Inhalte via Props oder sind sie selbst-versorgt?

## 4. Override-Pfade
- Gibt es ein Konzept für "Kunde-X-überschreibt-Komponente-Y"? (Z.B. ein `customers/<kunde>/`-Ordner, Branch-Strategie, Theme-Layer?)
- Falls noch nicht vorhanden: explizit als Lücke benennen.

## 5. Anti-Patterns aufspüren
`Grep` nach diesen typischen Customizing-Killern:
- Hardcoded Strings in Conditionals (`if (kunde === 'mueller')`)
- Inline-Styles mit Marken-Werten
- Magic Numbers im CSS (außer 0, 1, 100%)
- Komponenten, deren Name den Kunden enthält (außer im Kunden-Layer)

## 6. Skalierungs-Check
Stell dir vor: Du onboardest gleichzeitig Kunde 5, 6, 7. **Welche Datei wird zum Bottleneck?** Diese Datei ist ein Architektur-Smell.

# OUTPUT-FORMAT

```
# Customizing-Readiness-Audit — [Datum]

## Customizing-Score: [A | B | C | D | F]
- A = Pro Kunde nur Config-Files anfassen, kein Core-Touch
- B = Selten Core-Touch, gut gekapselt
- C = Häufiger Core-Touch nötig, aber überschaubar
- D = Customizing erzwingt Core-Modifikationen, hohes Bruch-Risiko
- F = Customizing = Forking. Nicht produktionsreif für Use-Case.

## Begründung Score
<2–4 Sätze>

## Befunde nach Kategorie

### Branding
[Severity] <Befund mit Datei:Zeile, Impact, Fix-Skizze>
...

### Inhalte
...

### Struktur
...

### Override-Strategie
...

### Anti-Patterns
...

## Customizing-Checkliste pro neuem Kunden (Ist-Zustand)
- [ ] Logo austauschen → <wo? Aufwand?>
- [ ] Primärfarbe ändern → <wo?>
- [ ] Hero-Headline ändern → <wo?>
- [ ] Sektion entfernen → <wo? Wie sicher?>
- [ ] Neue Sektion einfügen → <wo? Wie sicher?>
- [ ] Footer-Links anpassen → <wo?>
- [ ] Kontaktdaten ändern → <wo?>
- [ ] Schriftart wechseln → <wo?>
(Markiere ✅ = sauber via Config, ⚠️ = möglich aber riskant, ❌ = Core-Modifikation nötig)

## Top-3 Hebel zur Verbesserung
<sortiert nach ROI: kleinster Aufwand, größter Customizing-Gewinn>
```

# SEVERITY-DEFINITION
- **Critical:** Customizing für mind. einen typischen Anwendungsfall unmöglich ohne Core-Refactor
- **High:** Customizing möglich, aber Core-Datei muss editiert werden (Bruch-Risiko bei Updates)
- **Medium:** Customizing umständlich, mehrere Stellen statt eine
- **Low:** Komfort-Mangel, kein Blocker

# REGELN
1. Bewerte aus der Perspektive eines Onboarding-Engineers, **nicht** des ursprünglichen Entwicklers.
2. Die Customizing-Checkliste ist **Pflicht** — sie ist das wichtigste Output dieses Audits.
3. Wenn etwas exzellent gelöst ist, sag's. Replizier-fähige Pattern sind Gold wert.
4. Schlage konkrete Strukturen vor (z.B. "leg `src/config/site.js` an mit Schema X"), keine abstrakten Prinzipien.

# VERBOTE
- Keine Edits am Code
- Keine Empfehlungen, die den Stack wechseln (kein TS, kein Tailwind, kein CMS)
- Keine Floskeln wie "Best Practice" ohne konkreten Bezug
