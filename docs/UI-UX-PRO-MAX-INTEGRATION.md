# UI UX Pro Max — Integration ins homepage-starter-Projekt

Entscheidungsdokument. Ursprünglich als generische Vorlage übernommen und hier auf den
tatsächlichen Stack (Astro, Vanilla CSS, Decap CMS, 10-Basisformate-Katalog) angepasst.
Jeder Punkt der Vorlage wurde geprüft — was nicht zum Projekt passt, wurde gestrichen
oder umgeschrieben, nicht blind übernommen. Änderungen gegenüber der Vorlage sind
mit **[Angepasst]** oder **[Gestrichen]** markiert.

## Entscheidung

UI UX Pro Max wird integriert, ausschließlich als Entwicklungs- und Designwerkzeug.

Es ist:

* keine UI-Komponentenbibliothek,
* keine Laufzeitabhängigkeit,
* kein Ersatz für die bestehenden Sub-Agent-Audits (`.claude/agents/1-8`),
* kein Ersatz für Performanceoptimierung,
* keine automatische Entscheidungsinstanz für Packages.

Diese Grundaussage gilt unabhängig vom Stack und wurde unverändert übernommen.

## Zweck innerhalb dieses Projekts **[Angepasst]**

Das Original ging von "einer Website mit mehreren Unterseiten" aus. Tatsächlich ist
`homepage-starter` ein **Template-Katalog mit 10 Basisformaten** (siehe
`docs/design-catalog.md`), von denen bislang nur `01-warm-local` gebaut ist. Jedes
Kundenprojekt ist zudem ein **One-Pager mit Sections**, keine Multi-Page-Site.

UI UX Pro Max wird entsprechend eingesetzt für:

* Entwicklung visueller Stilrichtungen **pro neuem Basisformat** (02–10), nicht einmalig
  für "die Website" insgesamt.
* Erzeugung eines Designsystem-Dokuments **pro Basisformat**.
* Definition von Farben, Typografie, Abständen und Oberflächen — innerhalb der
  bestehenden Token-Struktur aus `src/styles/global.css` (`--ink`, `--cream`, `--accent`,
  `--accent-light`, `--sage` etc.), nicht als Ersatz dafür.
* Prüfung von Section-Struktur und visueller Hierarchie (Hero, About, Services, Gallery,
  Stats, Pricing, Reviews, Booking, Countdown, Contact, Footer).
* Erkennung typischer UI-/UX-Probleme, ergänzend zu Sub-Agent `4-ui`.
* Unterstützung bei Accessibility- und Responsive-Prüfungen, ergänzend zu Sub-Agent `5-a11y`.
* Konsistenz zwischen den Basisformaten, wo sinnvoll (z. B. Buttons, Cards), ohne die
  bewusste Vielfalt des Katalogs (10 unterschiedliche Archetypen) einzuebnen.

## Technische Einordnung

Unverändert gültig, da stackunabhängig:

* kein Import des Skills in `.astro`-Komponenten oder Scripts,
* keine Ausführung im Browser,
* keine Abhängigkeit im Produktionsbetrieb,
* keine Auswirkung auf Ladezeit oder Bundlegröße,
* keine Voraussetzung für Deployment oder Wartung.

## Geplante Integration

```powershell
git switch -c chore/evaluate-ui-ux-pro-max
npx ui-ux-pro-max-cli init --ai claude
git status
git diff
```

(`--ai codex` aus der Vorlage → `--ai claude`, da hier mit Claude Code gearbeitet wird.)

Vor einer Übernahme werden alle erzeugten Dateien geprüft. `--force` wird nicht verwendet,
bevor eindeutig geklärt ist, welche bestehenden Dateien dadurch verändert oder überschrieben
würden — insbesondere `src/styles/global.css`, `CLAUDE.md` und `.claude/agents/*`.

## Designprozess **[Angepasst]**

Die drei Varianten aus der Vorlage werden nicht als einmalige Entscheidung für "die
Website" verstanden, sondern als **Blaupause für die noch offenen Basisformate** aus
`docs/design-catalog.md`. Die Zuordnung ist naheliegend, weil die Archetypen sich
bereits decken:

| Vorlagen-Variante | Passt zu Basisformat(en) | Begründung |
|---|---|---|
| A: Premium Minimal | `02-minimal-clean` | Sage/Innocent-Archetyp, reduzierte Palette passt exakt |
| B: Motion & Immersion | `05-tech-modern`, `06-luxury-elegant`, `09-portfolio-visual` | Einzige Formate, bei denen aufwendigere Motion/Bild-Fokus zum Zielpublikum passt |
| C: Editorial / Swiss Modern | `03-bold-editorial` | Archetyp Hero/Creator, Raster + typografischer Kontrast passen 1:1 |

Formate ohne klare Zuordnung (`04-corporate-trust`, `07-restaurant-menu`,
`08-booking-service`, `10-onepage-compact`) bekommen ihre Stilrichtung situativ aus dem
Skill, ohne erzwungene Zuordnung zu A/B/C.

`01-warm-local` ist bereits gebaut und im Einsatz — der Skill wird hier nur für punktuelle
Reviews eingesetzt, nicht für eine erneute Grundrichtungs-Wahl.

Pro neuem Basisformat: mit dem Skill 2–3 Stilrichtungen entwickeln (deckt sich mit der
Vorgabe in `design-catalog.md`: "Pro Kunde werden 2–3 passende Designs vorgestellt"),
eine auswählen, dokumentieren. Einzelne Elemente aus verworfenen Varianten dürfen nur
übernommen werden, wenn sie zum gewählten Designsystem des jeweiligen Formats passen.

## Verbindliches Designsystem **[Angepasst: Pfadstruktur und Inhalt]**

Pfadstruktur an das Mehrformat-Modell und die Section- statt Page-Architektur angepasst:

```text
design-system/
└── <nn>-<format-name>/        z.B. 02-minimal-clean/
    ├── MASTER.md
    └── sections/              statt pages/ — Projekt ist ein One-Pager
        ├── hero.md
        ├── about.md
        ├── services.md
        ├── pricing.md
        └── ...                nur Sections, die im Format tatsächlich vorkommen
```

`MASTER.md` je Format enthält mindestens:

* Markenwirkung, Zielgruppe (siehe "Geeignet für" in `design-catalog.md`),
* Farbpalette (als konkrete `theme.*`-Werte für `config/meta.json`),
* Typografie (Font-Paar, siehe Hinweis zu `theme.fonts` in `CLAUDE.md` → Offene Punkte),
* Abstände, Rundungen, Schatten, Oberflächen (im bestehenden Token-Vokabular),
* Button-Stile, Card-Stile,
* Bildsprache, Icon-Stil,
* Animationsregeln (Verweis auf `WEBSITE_TECHNICAL_GUARDRAILS.md`),
* Responsive-Regeln,
* Dark-Mode-Regeln — **nur falls für das Format relevant**; aktuell kein Dark-Mode-Konzept
  im Template vorgesehen, daher kein Pflichtfeld, sondern optional,
* Accessibility-Grundsätze (WCAG AA, siehe `CLAUDE.md` → Konventionen).

Sections-Dateien dürfen nur Abweichungen zum `MASTER.md` des jeweiligen Formats
dokumentieren, kein eigenes unabhängiges Designsystem bilden.

## Autonomie beim Anlegen neuer Basisformate **[Neu, auf Nutzerwunsch]**

Ziel: Website-/Format-Erstellung läuft maximal autonom. Beim Bau eines neuen
Basisformats (02–10) führt Claude Code den vollständigen Workflow eigenständig aus,
ohne bei jedem Zwischenschritt nachzufragen:

1. Branch anlegen, Skill-Varianten generieren, Diff prüfen.
2. 2–3 Stilrichtungen bauen, gegen Tabelle oben abgleichen.
3. Eine Richtung wählen, `design-system/<nn>-<name>/MASTER.md` + Section-Docs schreiben.
4. Umsetzung im Code (Tokens, Sections, Component-Map in `index.astro`).
5. Sub-Agents 1–8 laufen lassen (siehe `CLAUDE.md` → Sub-Agents), Befunde beheben.
6. `docs/design-catalog.md` Status von 📋 auf ✅ aktualisieren.

Rückfragepflichtig bleiben nur (destructive / schwer umkehrbar):

* `--force` bei `ui-ux-pro-max-cli init`,
* Löschen nicht gewählter Design-Varianten/Branches,
* Merge des Ergebnis-Branches nach `main` (triggert Vercel-Prod-Deploy).

## Packages und Bibliotheken **[Stark angepasst]**

**Grundprinzip: Endprodukt-Qualität schlägt Stack-Konservatismus.** Der aktuelle Stack
(Astro, Vanilla CSS, kein React) ist der *Standardweg*, nicht ein Dogma. Wenn ein neues
Basisformat nachweislich hochwertiger, schneller zu bauen oder überzeugender wird durch
eine zusätzliche Library oder ein Framework (React-Island, Tailwind für ein bestimmtes
Format, GSAP, Three.js, was auch immer), wird das eingeführt — nicht aus Prinzip
vermieden. Die Bremse ist nicht "haben wir hier noch nie gemacht", sondern ausschließlich
die Guardrail-Checkliste weiter unten (Bundle, Fallback, Mobile, Wartbarkeit, Lizenz).
Das gilt pro Basisformat einzeln, nicht global für das ganze Template — ein Format kann
React nutzen, ein anderes bleibt Zero-JS, wenn das dort ausreicht.

Die Vorlage ging von einem Next.js/React/Tailwind-Stack aus. Die folgende Neubewertung
ist daher keine pauschale Ablehnung dieser Tools, sondern eine Einschätzung, was
*aktuell* (Stand `01-warm-local`) schon abgedeckt ist bzw. gebraucht wird — nicht was
grundsätzlich verboten wäre.

### Direkt vorgesehen (bereits im Einsatz oder widerspruchsfrei)

* Astro, TypeScript (TS-light in `.astro`-Frontmatter — siehe `CLAUDE.md`-Konvention),
* Vanilla CSS mit Custom Properties (bestehendes Token-System — **kein** Tailwind, **kein** shadcn/ui),
* Playwright (bereits im Einsatz, u. a. Sub-Agent `8-visual-tester`),
* Zod — **nur serverseitig** in Vercel Functions (Contact-Form, Booking-Live-Sync) zur
  Payload-Validierung. Kein React Hook Form, da kein React im Projekt.

### Aktuell nicht gebraucht — aber nicht verboten **[korrigiert: vorher "gestrichen"]**

* Next.js, React, Tailwind CSS, shadcn/ui, Motion, React Hook Form — für `01-warm-local`
  und die schlanken Formate (02, 04, 07, 08, 10) nicht nötig, da Zero-JS/Vanilla-CSS dort
  ausreicht und schneller ist. **Für ein Format, das komplexe Interaktivität oder sehr
  schnelle Iteration über viele Varianten braucht (Kandidat: `09-portfolio-visual`,
  `05-tech-modern`), ist ein React-Island oder Tailwind für genau dieses Format zulässig**,
  wenn die Guardrail-Checkliste unten besteht. Kein pauschales Verbot mehr.
* "Bundle Analyzer" als eigenes Tool — vorerst redundant zu Sub-Agent `6-performance`,
  der Bundle/Asset-Größen bereits statisch prüft. Wird ergänzt, sobald ein Format so
  komplex wird, dass die statische Prüfung nicht mehr reicht.
* "Error Monitoring" — noch nicht gebraucht (kein kritischer Transaktions-Flow außer
  Kontaktformular/Booking), aber pro Kundenprojekt einzeln zu evaluieren, sobald ein
  Format zahlungspflichtige oder anderweitig kritische Flows bekommt.
* Vitest — noch keine Unit-Test-Kultur nötig, wird eingeführt, sobald
  Config-Validierungslogik (z. B. Schema-Checks für `config/*.json`) das rechtfertigt.

### Nur nach konkreter Prüfung, nicht nach Bauchgefühl

* GSAP, Lenis, Rive, Spline, Three.js, React Three Fiber, weitere UI-Komponentensammlungen,
  Service-Worker-/PWA-Pakete — alle erlaubt, wenn sie das Endprodukt für das jeweilige
  Format nachweislich besser machen und die Guardrails einhalten.
* **Sonderregel Scroll-Verhalten:** GSAP/Lenis (Smooth-Scroll-Libraries) werden nicht
  eingeführt, ohne vorher zu prüfen, ob das bestehende handgebaute JS-Scroll-Snap-System
  (`src/pages/index.astro`, siehe `CLAUDE.md` → "Fullpage-Scroll-Snap-Layout") die
  Anforderung nicht bereits abdeckt. Dieses System wurde bewusst gegen CSS
  `scroll-snap-type` entwickelt (Konflikt mit `scrollTo()`, siehe Doku) und mit konkreten
  Timing-Werten (750ms easeInOutSine, 1000ms Cooling, 1700ms Hard Guard) austariert — hier
  geht es nicht um Stack-Konservatismus, sondern darum, bereits gelöste, mühsam
  austarierte Bugs (Windows-Trackpad-Inertia) nicht wieder aufzureißen. Wenn ein Format
  aber Effekte braucht, die dieses System nachweislich nicht leisten kann (z. B.
  scroll-gekoppelte Parallax-Sequenzen *innerhalb* einer Section), wird GSAP
  ScrollTrigger dafür eingesetzt — als gezielte Ergänzung, nicht als Rundum-Ersatz des
  Snap-Systems.

Vor jeder zusätzlichen Installation weiterhin prüfen: Deckt ein vorhandenes Werkzeug die
Funktion schon ab? Bundle-Belastung? Statischer Fallback? Mobiltauglich? Funktioniert die
Seite ohne den Effekt vollständig? Pflege-Status? Lizenz? — Wenn die Antwort auf all das
passt, ist "kein Match zum bisherigen Stack" **kein** Ablehnungsgrund mehr.

## Premium- und Lite-Modus **[Angepasst auf Formate gemappt]**

Nicht jedes Basisformat braucht einen Premium-Modus. Realistische Zuordnung:

* **Premium-fähig:** `05-tech-modern`, `06-luxury-elegant`, `09-portfolio-visual` — hier
  passt aufwendigere Motion/Bildsprache zum Zielpublikum und rechtfertigt den
  Mehraufwand für einen Lite-Fallback.
* **Bleibt bewusst schlank:** `01-warm-local` (bereits gebaut, kein Premium-Bedarf),
  `02-minimal-clean`, `04-corporate-trust`, `07-restaurant-menu`, `08-booking-service`,
  `10-onepage-compact` — Zielgruppen (Handwerker, Steuerberater, Gastro, Anwälte,
  Lead-Funnel) profitieren mehr von Ladegeschwindigkeit als von Effekten.

Lite-Modus enthält für Premium-Formate: dieselben Inhalte, dieselbe Navigation (siehe
`Nav.astro` — Links sind echte `href="#section"`-Anker, funktionieren bereits ohne JS,
verifiziert), dieselben Formulare/CTAs, statische Poster statt WebGL, normale
Scrollfunktion, kleinere Bildvarianten, reduzierte Bewegung, keine Autoplay-Videos,
weniger Blur-/Filtereffekte. Keine zweite Website — eine semantische Struktur, ein Inhalt.

## Qualitätskontrolle der generierten Empfehlungen

Unverändert aus der Vorlage übernommen, da stackunabhängig sinnvoll — ergänzt um
Verweis auf bestehende Prüfinstanzen:

* Passt sie zum gewählten Designsystem des Formats?
* Verbessert sie die Nutzerführung?
* Ist sie auf Mobilgeräten sinnvoll? (→ Sub-Agent `8-visual-tester`, Mobile/Laptop/Desktop)
* Ist sie zugänglich? (→ Sub-Agent `5-a11y`)
* Ist sie technisch wartbar? (→ Sub-Agent `1-architecture`, `3-quality`)
* Hat sie einen messbaren visuellen Mehrwert?
* Verlangsamt sie die Website? (→ Sub-Agent `6-performance`)
* Gibt es eine einfachere native CSS-Lösung statt einer neuen Library?
* Funktioniert sie im Lite-Modus?
* Funktioniert die Seite weiterhin, wenn sie fehlschlägt?

## To-do-Liste **[Angepasst an reale Projektstruktur]**

### Designvorbereitung

* [ ] UI UX Pro Max in `chore/evaluate-ui-ux-pro-max` installieren, Diff prüfen.
* [ ] Für das nächste offene Basisformat (Kandidat: `02-minimal-clean`, da einfachste
      Erweiterung des Katalogs) 2–3 Stilrichtungen erzeugen.
* [ ] Eine Richtung wählen, nicht gewählte archivieren/verwerfen.
* [ ] `design-system/02-minimal-clean/MASTER.md` + Section-Docs erstellen.
* [ ] `docs/design-catalog.md` Status aktualisieren (📋 → 🚧 → ✅).

### Technische Absicherung

* [x] `WEBSITE_TECHNICAL_GUARDRAILS.md` erstellen (siehe separate Datei).
* [ ] Performancevorgaben gegenüber Designempfehlungen priorisieren (Sub-Agent `6` hat Vetorecht).
* [ ] Keine vom Skill empfohlenen Packages automatisch installieren.
* [ ] Jeden Premium-Effekt (nur in 05/06/09) mit statischem Fallback versehen.
* [ ] Premium- und Lite-Darstellung mit Sub-Agent `8-visual-tester` gegentesten.
* [ ] Reale Core Web Vitals nach Veröffentlichung pro Kundenprojekt beobachten.

### Wartung

* [ ] Eine geprüfte Skill-Version festschreiben (Version in diesem Dokument notieren).
* [ ] Skill-Updates nur in separaten Branches testen.
* [ ] Keine automatischen Updates in `main` übernehmen.
* [ ] Lizenzbedingungen vor kommerzieller Übernahme prüfen.
* [ ] Generierte Regeln regelmäßig gegen `CLAUDE.md` und `design-catalog.md` abgleichen.

## Endgültige Bewertung

UI UX Pro Max wird übernommen. Seine Rolle: **Art Direction, Designsystem-Unterstützung
und UX-Review — pro Basisformat, nicht einmalig für "die Website".**

Seine Rolle ist ausdrücklich nicht: Performance-Entscheidung, Package-Manager,
Architekturinstanz oder Qualitätsgarantie. Die technische Kontrolle bleibt bei
`WEBSITE_TECHNICAL_GUARDRAILS.md`, den Sub-Agents `1`–`8` und den Performancebudgets.
