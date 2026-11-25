# Deep-Research-Prompt: EU-Anbieter für die Auslieferung statischer Kunden-Homepages (Vercel-Ersatz)

Recherchiere für eine deutsche Webagentur (Einzelunternehmer) einen Anbieter mit Sitz und Datenverarbeitung in der EU, der die Auslieferung vieler kleiner Kunden-Homepages übernimmt. Die Seiten sind One-Pager mit Astro (statisch gebaut, kleine serverseitige Funktionen sind ein Pluspunkt). Inhalte kommen zur Laufzeit oder beim Bauen aus einer Schnittstelle auf einem eigenen Server. Der Anbieter soll fast vollständig von KI-Werkzeugen per API, Kommandozeile oder MCP bedient werden können.

Anforderungen:
- Je Kunde ein eigenes, getrenntes Projekt mit eigener Domain, Zertifikat und eigenen Umgebungsvariablen.
- Abläufe: Vorschau-Stand und Live-Stand getrennt; ein freigegebener Vorschau-Stand lässt sich unverändert live schalten; ein Schritt zurück auf den vorherigen Stand.
- Passwortgeschützte oder anderweitig abgesicherte Vorschauen (eigener Schutz ist möglich, aber nenne, was der Anbieter mitbringt).
- Projektbegrenzte Zugangsschlüssel (Token nur für ein Projekt) und Rechte je Mitglied.
- Domains und DNS per API anlegen und verifizieren.
- Weiterleitungen, eigene Header, Zwischenspeicher-Steuerung, Formular- oder Funktionsanbindung.
- Bildauslieferung (Optimierung, Größenvarianten) und Datenübertragungs-Kontingent.

Kandidaten (prüfe diese und ergänze, falls andere besser passen): statichost.eu, Runsite, DanubeData, Nodion, IONOS Deploy Now, Scaleway (Objektspeicher mit Website-Hosting und Edge Services), Bunny.net (Storage und CDN), Clever Cloud, Scalingo, Gcore, OVHcloud, ein selbst betriebener Weg mit Coolify oder Caddy auf einem eigenen Server in der EU. Zum Vergleich: Vercel, Netlify, Cloudflare Pages (nur kurz, als Maßstab für den Funktionsumfang).

Arbeite ausschließlich mit offiziellen Quellen (Produktseiten, Dokumentation, API-Referenz, Preisseiten, Datenschutz- und Vertragsunterlagen, Statusseiten). Blogvergleiche nur als Hinweis, nie als Beleg. Gib zu jeder Aussage Quelle (URL) und Abrufdatum an. Was du nicht belegen kannst, markiere als NICHT BELEGT, rate nicht.

Beantworte je Anbieter:
1. Firmensitz, Konzernzugehörigkeit, Standorte der Rechenzentren und des Edge-Netzes, Datenort für Konto- und Protokolldaten, Unterauftragsverarbeiter außerhalb der EU, Vertrag zur Auftragsverarbeitung.
2. Reifegrad (Produktstatus, Beta oder stabil, Betriebsdauer, Ausfallhistorie, Größe des Unternehmens, Risiko einer Einstellung).
3. Astro-Unterstützung (statisch, Adapter, serverseitige Funktionen) und Build-Umgebung (Node-Versionen, pnpm, Build-Zeit-Limits) oder Auslieferung fertiger Dateien.
4. Deployment-Abläufe: Git-Anbindung (GitHub, GitLab), Deployment per CLI oder API, Vorschauen je Branch, Livegang eines bestimmten Stands, Zurückrollen, Verlauf.
5. API und Automatisierung: Abdeckung für Projekte anlegen, Domains anlegen und prüfen, Umgebungsvariablen setzen, projektbegrenzte Token, Deployments auslösen, Logs lesen. Offizielle Kommandozeile, MCP-Server, Terraform-Provider.
6. Sicherheit: HTTPS und Zertifikate, Header-Steuerung, Schutz der Vorschauen, Isolation zwischen Projekten.
7. Preise (netto und brutto in Euro) für: 1 Projekt; 10 Projekte mit je 5.000 Besuchern im Monat und 5 GB Bildern; Zusatzkosten (Datenübertragung, Builds, Funktionen, Teamplätze). Kostenlose Stufen und deren Bedingungen, besonders zur kommerziellen Nutzung.
8. Grenzen und Fallstricke: Datei- und Projektlimits, Build-Minuten, Wartezeiten bei Domain-Verifizierung, Support-Erreichbarkeit.

Liefere am Ende: (a) eine Vergleichstabelle (Zeilen: Anbieter, Spalten: Sitz und Datenort, Reifegrad, Astro, Vorschau und Zurückrollen, API/CLI/MCP, projektbegrenzte Token, Preis für die zwei Szenarien, Risiken), (b) eine Rangfolge für den Einsatz „viele kleine Kundenseiten, minimale manuelle Einrichtung, volle Steuerung per KI“, (c) eine Einschätzung, ob ein selbst betriebener Weg auf einem EU-Server ein sinnvoller Ersatz wäre, inklusive Aufwand für Vorschau, Livegang und Zurückrollen, (d) eine Liste der Punkte, die ein Test mit einem echten Konto klären muss, (e) die Quellenliste mit Datum. Antworte auf Deutsch. Keine Rechtsberatung, aber nenne Punkte, die ein Anwalt prüfen sollte.
