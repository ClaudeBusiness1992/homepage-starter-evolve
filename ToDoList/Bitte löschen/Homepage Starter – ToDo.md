# Homepage Starter — ToDo

Aufgabenliste für die Weiterentwicklung des Templates. Wird gemeinsam mit Claude Code gepflegt.

---

## 🔴 Bugs (echte Fehler)

- [ ] **Stats-Sektion wird nie gerendert** — `Stats.astro` existiert, `s.stats` ist in `content.json` aktiv, aber in `index.astro` wird sie weder importiert noch gerendert. Der `enabled`-Toggle hat aktuell keinen Effekt. Entweder als eigene Sektion einbauen oder das Feature sauber entfernen.
- [ ] **Keine 404-Seite** — `src/pages/404.astro` fehlt. Nutzer landen auf einer nackten Fehlerseite ohne Branding und ohne Zurück-Link.

---

## 🟠 Wichtige Ergänzungen

- [ ] **Social-Media-Links in `meta.json`** — Kein `instagram`, `facebook` o.ä. Feld vorhanden. Für die meisten kleinen Kunden (Handwerker, Gastronomie, Dienstleister) ist Instagram mindestens so wichtig wie die E-Mail. Im Footer und Kontaktblock integrieren.
- [ ] **`public/og-image.jpg` erstellen** — Pflicht vor jeder Live-Schaltung. Empfehlung: 1200×630 px in Figma/Canva aus Logo + Tagline + `theme.cream` als Hintergrund. Pfad ist in `Base.astro` bereits verdrahtet.

---

## 🟡 Sinnvolle Ergänzungen (Template-Qualität)

- [ ] **FAQ-Sektion als Add-on** — Häufig von Kunden gewünscht, einfach umzusetzen. Bringt direkt SEO-Nutzen via `FAQPage` Schema.org-Markup. Sauber als Toggle in `extras.json` einbauen wie Gallery/Reviews/Booking.
- [ ] **Floating CTA (Click-to-Call / WhatsApp)** — Fixierter Button unten rechts mit Telefon- oder WhatsApp-Link. Für mobile Nutzer der direkteste Conversion-Pfad — besonders bei Handwerkern, Ärzten, Restaurants. Konfigurierbar über `meta.json` (z.B. `floatingCta: { type: "phone" | "whatsapp", enabled: true }`).
- [ ] **Danke/Success-Seite nach Kontaktformular** — Eigene `/danke`-Seite statt Inline-Feedback. Ermöglicht sauberes Conversion-Tracking in Google Analytics oder Meta Pixel.

---

## 🔵 Offene Punkte (aus CLAUDE.md)

- [ ] **`theme.fonts` in `meta.json`** — Schriftpaar konfigurierbar machen (Serif + Sans). Erfordert neues `fonts`-Objekt + CMS-Schema + `@font-face`-Generierung in `Base.astro`. Nur wenn Kunden mehrere Schriftpaare brauchen.
- [ ] **`headline.split('. ')` ersetzen** — `hero.headlineLine1/2/3` statt Freitext mit Punkt-Trennung. Erfordert `content.json`-Schemaänderung + CMS-Update + alle Hero-Komponenten anpassen. Erst angehen wenn CMS-UX-Problem auftritt.
- [ ] **`astro:assets` `<Image>` für Kundenbilder** — Für AVIF/WebP-Auto-Generation. Aktuell `loading="lazy"` + explizite Dimensionen — für die meisten Projekte ausreichend. Nur angehen wenn Page-Speed kritisch.
- [ ] **Component-Map dynamisch via `import.meta.glob`** — Explizite Map in `index.astro` durch Glob ersetzen. Erst ab > 12 Designs sinnvoll.
- [ ] **Form-Group Selector entkoppeln** — `.form-group input` → `.form-input`. Reine CSS-Architektur, kein funktionaler Unterschied. Niedrige Priorität.

---

## ✅ Erledigt

- [x] Cookie-Banner TTDSG-konform mit Fokus-Management
- [x] `.gitignore` um `.env`-Varianten ergänzt
- [x] `netlify.toml` entfernt
- [x] Font-Cache-Header in `_headers` + `vercel.json`
- [x] Booking Add-on + Live-Sync + Dokumentation
- [x] Kontaktformular auf Vercel Function migriert
- [x] Pricing-Cards tastatur-bedienbar
- [x] Schema.org LocalBusiness mit `address` + `telephone`
- [x] Conditional CSS-Loading via `import.meta.glob + ?inline`
- [x] Service-Icon Hardcoded Colors → `color-mix()`
- [x] `stat-l` Text-Kontrast gefixt
- [x] Datenschutz-Seite: Google-Fonts-Abschnitt durch self-hosted Beschreibung ersetzt
- [x] Lightbox für Galerie + About-Bilder
- [x] Galerie-Textbalken (Cream-Balken unter Bild)
- [x] Token-Audit + einheitliche Banner-Farbe
- [x] Scroll-System überarbeitet (kein CSS snap, JS übernimmt komplett)
- [x] README auf aktuellen Stand gebracht (Master-Struktur, extras.json, alle Sektionen)
