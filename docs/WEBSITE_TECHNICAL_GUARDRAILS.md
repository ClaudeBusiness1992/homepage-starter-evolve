# Website Technical Guardrails

Diese Datei ist Design-Empfehlungen (auch von UI UX Pro Max, siehe
`docs/UI-UX-PRO-MAX-INTEGRATION.md`) technisch übergeordnet. Im Konflikt gewinnt
diese Datei bzw. die Sub-Agent-Audits `.claude/agents/1-8`.

Angepasst an den tatsächlichen Stack (Astro SSG, Zero-JS-by-default, Vanilla CSS,
kein React) — nicht die generische Next.js/React-Vorlage.

**Grundprinzip:** Diese Datei verbietet keine Technologien. Sie definiert die Kriterien
(Bundle, Fallback, Mobile, Wartbarkeit), gegen die jede zusätzliche Library oder jedes
Framework geprüft wird — pro Basisformat, nicht global. Wenn eine neue Technologie diese
Kriterien erfüllt und das Endergebnis nachweislich besser macht, wird sie eingesetzt.
Der bestehende Stack ist der Standardweg, kein Selbstzweck.

## Bestehendes zuerst schützen, bevor Neues eingeführt wird

* Das handgebaute JS-Scroll-Snap-System in `src/pages/index.astro` (siehe `CLAUDE.md` →
  "Fullpage-Scroll-Snap-Layout") ist bewusst gegen CSS `scroll-snap-type` entwickelt und
  mit konkreten Timing-Werten austariert (750ms easeInOutSine, 5px Wheel-Threshold,
  1000ms Cooling, 1700ms Hard Guard). Kein zusätzliches Smooth-Scroll-Framework
  (Lenis, GSAP ScrollSmoother) parallel dazu einführen — das würde exakt die
  Inertia-/Doppelanimations-Probleme reproduzieren, die dieses System bereits löst.
  Erweiterungen (z. B. scrollgekoppelte Parallax innerhalb einer Section) im
  bestehenden System nachrüsten, nicht das System ersetzen.
* Nav-Links bleiben echte `href="#section"`-Anker (verifiziert in `Nav.astro`) — sie
  funktionieren ohne JS per nativem Browser-Sprung. JS darf das Verhalten nur verbessern
  (Smooth-Snap), nie Grundvoraussetzung für funktionierende Navigation sein. Bei jeder
  Nav-Änderung prüfen, dass das erhalten bleibt.

## Bundle und Laufzeit

* Keine schwere Animation im initialen Bundle. Astros Default ist Zero-JS — jede
  `client:*`-Direktive ist eine bewusste Entscheidung, die begründet werden muss
  (siehe Sub-Agent `6-performance`, Abschnitt Hydration-Hygiene).
* Dynamic Imports (`import()` zur Laufzeit statt Top-Level-Import, bzw. `client:visible`/
  `client:idle` für Astro-Islands) für GSAP, Rive, Spline, Three.js — falls eines davon
  nach Freigabe (siehe Integrations-Dokument) tatsächlich eingesetzt wird.
* Maximal eine große aktive Canvas-/WebGL-Szene pro Seite.
* Nicht sichtbare Animationen pausieren (IntersectionObserver — analog zum bestehenden
  Scroll-System, das bereits Sichtbarkeits-/Threshold-Logik nutzt).
* Keine Kernfunktion (Navigation, Formulare, CTAs) innerhalb einer WebGL-/Canvas-Komponente
  — die muss auch funktionieren, wenn die Komponente fehlschlägt oder nicht lädt.

## Fallbacks und Modi

* Statischer Fallback (Bild/Poster) für jeden Premium-Effekt, relevant nur für die
  Formate `05-tech-modern`, `06-luxury-elegant`, `09-portfolio-visual` (siehe
  Integrations-Dokument → Premium/Lite-Mapping).
* `prefers-reduced-motion` wird unterstützt — bestehende Animationen (Scroll-Transitions,
  Hover-Effekte) und alle neuen Premium-Effekte respektieren diese Media Query.
* Manueller Lite-Modus als Umschalter für Premium-Formate, keine automatische Zuschaltung
  allein anhand der Internetverbindung (`navigator.connection` ist unzuverlässig und
  variiert stark zwischen Browsern).
* Keine automatisch startenden großen Videos auf Mobilgeräten.
* Da Astro keine React-Error-Boundaries kennt: dekorative/schwere Komponenten als
  eigenständige Islands mit `client:visible` isolieren, damit ein JS-Fehler darin die
  restliche (serverseitig gerenderte) Seite nicht mitreißt.

## Performancebudgets

Keine eigene Budget-Definition hier — Sub-Agent `6-performance` definiert bereits
Schweregrade (Critical: >500kb unnötiges JS, Hero-Image >1MB, blockierende Scripts;
High: fehlende Bildoptimierung, unbegründetes `client:load`, große CSS-Files). Neue
Effekte werden gegen diese Schwellen geprüft, bevor sie in `main` gemergt werden.

## Durchsetzung

Kein separates Test-Setup für Premium/Lite nötig — bestehende Sub-Agents decken das ab:

* `6-performance` — Bundle, Hydration, Assets vor Release.
* `8-visual-tester` — Live-Browser-Test (Mobile/Laptop/Desktop) vor jeder
  "fertig"-Meldung bei UI-/Layout-Änderungen, inkl. Premium- vs. Lite-Darstellung.
* `5-a11y` — WCAG 2.1 AA, `prefers-reduced-motion`, Kontraste.

Reale Core Web Vitals werden erst nach Deployment pro Kundenprojekt beobachtet
(Sub-Agent `6` kann das nur statisch annähern, siehe dessen "Manuell verifizieren"-Abschnitt).
