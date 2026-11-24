# AGENTS.md — homepage-starter-evolve

Verbindliche Projektregeln für alle Agents in diesem Projekt (Nick-Vorgabe).

## 1. Routen-Nomenklatur: Kunden-Vorschau vs. Bearbeitungsversion

- **Version mit '2' am Ende (z. B. /ajs2):** Steht immer für Nicks Bearbeitungs- und Arbeitsversion. Enthält den Live-Editor, den Bug-Audit-Bereich und interne Arbeitswerkzeuge. Das Passwort der Bearbeitungsversion ist IMMER `qnc89i`, egal bei welchem Projekt.
- **Version ohne '2' (z. B. /ajs):** Ist immer die reine Kunden-Vorschau. Hier dürfen nur Dinge zu sehen sein, die nachher auch der echte Website-Besucher sieht (KEIN Live-Editor, KEIN Bug-Audit, keine internen Admin-Links).

## 2. Port 4401 als Baukasten-Grundlage & Spiegelungsregel

- **Port 4401 ist die interne Vorschau für den Baukasten:** Diese Vorschau ist immer die funktionale Grundlage für neue Seiten und Features.
- **Bedeutung von '4401 auf [Projekt/Kunde] spiegeln':**
  - Es werden ausschließlich die Funktionen gespiegelt (Komponenten-Mechanik, Interaktionen, Bugfixes, funktionale Bausteine).
  - NIEMALS Design-Elemente, Bilder, Farbkonzepte, Reihenfolge der Seiten/Sektionen oder kundenspezifische Inhalte überschreiben.
  - Das kundenindividuelle Design, Theme und der Content bleiben bei jeder Funktionsspiegelung vollständig unberührt und erhalten.
