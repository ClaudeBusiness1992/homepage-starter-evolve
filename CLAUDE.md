# CLAUDE.md — homepage-starter

Kontextdatei für Claude Code. Enthält Projektbeschreibung, Entwicklungsumgebung und Setup-Anleitung für neue Rechner.

---

## Projekt

`homepage-starter` ist ein wiederverwendbares Template für einseitige Kunden-Websites (One-Pager).
Die Agentur **pixel&code** nutzt es als Grundlage für alle Kundenprojekte.

**Prinzip:** Pro Kunde wird das Template kopiert. Eine zentrale Config-Datei aktiviert oder deaktiviert Sektionen.
Der Kunde hostet die fertige Website selbst (Netlify Free Tier empfohlen).

### Sektionen (modular, ein-/ausschaltbar per Config)
- Hero — Hauptslogan + CTA
- Über uns — Teamvorstellung mit Fotos
- Leistungen — 6 Service-Karten
- Kennzahlen — animierte Statistiken
- Preise — 3 Pakete (Starter / Business / Premium)
- Galerie — Bildbereich (geplant)
- Bewertungen — Kundenstimmen (geplant)
- Kontaktformular — Formular mit E-Mail-Versand (geplant)
- Footer — Impressum / Datenschutz

### Admin-Konzept
- **Master Admin** (Agentur): Sektionen pro Kunde aktivieren, Inhalte befüllen
- **Client Admin** (Kunde): eingeschränkter Zugang für Text- und Bildänderungen
- Deployment: Netlify (Drag & Drop oder GitHub-Auto-Deploy)

---

## Tech-Stack

| Tool | Empfohlene Version | Zweck |
|---|---|---|
| Node.js | v22 LTS (via nvm-windows) | Laufzeitumgebung |
| npm | kommt mit Node | Paketmanager (Fallback) |
| pnpm | 10.x | Primärer Paketmanager |
| Git | 2.x | Versionskontrolle |
| Astro | v6.x | Build-Framework (SSG) |
| Netlify CLI | aktuell | Deployment aus dem Terminal |
| Claude Code | aktuell | KI-gestützte Entwicklung (primärer Editor) |
| VS Code / Cursor | aktuell | Editor für Dateiansicht, Vorschau, Git-Diff |

> **Hinweis zu Node:** Node v22 LTS verwenden, nicht v24 (Current). v24 ist experimentell
> und kann Kompatibilitätsprobleme mit Astro und anderen Paketen verursachen.
> nvm-windows ermöglicht das parallele Verwalten mehrerer Node-Versionen.

**Betriebssystem (Referenz):** Windows 11 Home (Build 26200)
**Shell:** PowerShell 5.1 + PortableGit (Bash)

---

## Neuen Rechner einrichten

Alle Schritte in dieser Reihenfolge ausführen.

### 1. Git installieren
→ https://git-scm.com/download/win
- Installer ausführen, Standardoptionen beibehalten
- Prüfen: `git --version`

### 2. Editor installieren — VS Code oder Cursor (eines davon)
- **VS Code:** https://code.visualstudio.com
- **Cursor** (empfohlen, VS Code + KI): https://www.cursor.com
- Nach Installation: Editor zum PATH hinzufügen (Installer-Option aktivieren)
- Prüfen: `code --version` bzw. `cursor --version`

### 3. nvm-windows installieren (Node-Versionsverwaltung)
→ https://github.com/coreybutler/nvm-windows/releases
- `nvm-setup.exe` ausführen
- Danach Node LTS installieren:
```powershell
nvm install 22
nvm use 22
```
- Prüfen: `node --version` (sollte v22.x zeigen) und `npm --version`

### 4. pnpm installieren
```powershell
npm install -g pnpm
```
- Prüfen: `pnpm --version`

### 5. Netlify CLI installieren
```powershell
pnpm add -g netlify-cli
netlify login
```
- Prüfen: `netlify --version`

### 6. Claude Code installieren
```powershell
npm install -g @anthropic-ai/claude-code
```
- Prüfen: `claude --version`
- Anmelden: `claude` → im Browser authentifizieren

### 7. MCP-Server installieren (optional, für Dateizugriff)
```powershell
npm install -g @modelcontextprotocol/server-filesystem
```

### 8. Projekt klonen
```powershell
git clone <repo-url> homepage-starter
cd homepage-starter
pnpm install
```

### 9. Entwicklungsserver starten
```powershell
pnpm dev
```
→ öffnet http://localhost:4321

---

## Projektkonventionen

- **Sprache:** Deutsch für Kommentare und Commit-Messages
- **Paketmanager:** immer `pnpm`, nie `npm install` direkt
- **Commits:** `chore:`, `feat:`, `fix:`, `style:` als Prefix
- **Dateien:** Sektionen liegen in `src/sections/<Name>/`, Komponenten in `src/components/`
- **Config:** Kunden-spezifische Werte nur in `config/client.config` (nie direkt im Code)
- **Kein Framework-Lock-in:** CSS ohne externe UI-Libraries (kein Tailwind, kein Bootstrap)
- **Fonts:** DM Serif Display (Überschriften) + Outfit (Fließtext) via Google Fonts

---

## Häufige Befehle

```powershell
pnpm dev              # Entwicklungsserver starten
pnpm build            # Produktions-Build erstellen
pnpm preview          # Build lokal vorschauen
netlify deploy        # Preview-Deploy auf Netlify
netlify deploy --prod # Produktions-Deploy auf Netlify
```

---

## Nächste offene Aufgaben

**Erledigt:**
- [x] Astro initialisiert und mit bestehendem index.html verknüpft
- [x] Modul-Config-System (client.config.json → Sektionen ein/aus)
- [x] Galerie-Sektion (`Gallery.astro`)
- [x] Bewertungs-Sektion (`Reviews.astro` mit Schema.org JSON-LD)
- [x] Cookie-Banner (TTDSG-konform, im `Base.astro` Layout)
- [x] Impressum-Page (`/impressum` aus `config.legal`)
- [x] Datenschutz-Page (`/datenschutz` aus `config.legal`)
- [x] Legal-Daten im Config-Schema

**Offen:**
- [ ] Kontaktformular mit E-Mail-Versand (Resend oder Nodemailer)
- [ ] `@astrojs/sitemap` Integration für `sitemap.xml`
- [ ] `robots.txt` in `public/`
- [ ] Phase 2: 4 weitere Designs (`02-minimal-clean`, `03-bold-editorial`, `04-corporate-trust`, `17-onepage-classic`)
- [ ] Variant-System für `01-warm-local` (Farb- + Hero-Varianten)
- [ ] Master Admin Interface
- [ ] Client Admin Interface (eingeschränkt)
- [ ] Netlify-Deploy-Vorlage erstellen
