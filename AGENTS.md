# AGENTS.md — homepage-starter-evolve

Verbindliche Projektregeln für alle Agents in diesem Projekt (Nick-Vorgabe).

## 1. Routen-Nomenklatur: EINE Seite /ajs mit Login-Rollen (seit 24.11.2026, Nick)

- Die frühere ajs/ajs2-Trennung ist ersetzt: Es gibt genau EINE Seite **/ajs** mit Login aus **Name + Passwort** und drei Rollen:
  - **Kunde:** sieht nur die Seite (bisheriges /ajs-Passwort).
  - **Designer:** sieht Seite + Live-Editor + Bug-Audit-Bereich (bisheriges Bearbeitungspasswort, IMMER `qnc89i`, egal bei welchem Projekt).
  - **Admin:** sieht Seite + Live-Editor + Bug-Audit + Admin-Link (Admin-PIN; Unterscheidung zum Kunden über den NAMEN).
- Nur SHA-256-Hashes im Markup (Hashmuster je Rolle), niemals Klartext.
- **/ajs2** leitet dauerhaft auf **/ajs** weiter (eigene Redirect-Seite) und wird nicht mehr als Arbeitsversion genutzt.

## 2. Port 4401 als Baukasten-Grundlage & Spiegelungsregel

- **Port 4401 ist die interne Vorschau für den Baukasten:** Diese Vorschau ist immer die funktionale Grundlage für neue Seiten und Features.
- **Bedeutung von '4401 auf [Projekt/Kunde] spiegeln':**
  - Es werden ausschließlich die Funktionen gespiegelt (Komponenten-Mechanik, Interaktionen, Bugfixes, funktionale Bausteine).
  - NIEMALS Design-Elemente, Bilder, Farbkonzepte, Reihenfolge der Seiten/Sektionen oder kundenspezifische Inhalte überschreiben.
  - Das kundenindividuelle Design, Theme und der Content bleiben bei jeder Funktionsspiegelung vollständig unberührt und erhalten.
