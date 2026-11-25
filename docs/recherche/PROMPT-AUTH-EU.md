# Deep-Research-Prompt: Anmeldung und Registrierung für Endnutzer (Alternative zu Clerk, EU)

Recherchiere für eine deutsche Webagentur (Einzelunternehmer, Kunden-Homepages mit Astro) die beste Lösung für Registrierung und Anmeldung von Endnutzern ("Besteller") mit Datenhaltung in der EU. Clerk scheidet aus, weil es nach Clerks eigener Angabe keine EU-Datenhaltung gibt. Die Lösung wird fast ausschließlich von KI-Werkzeugen eingerichtet und betrieben (API, Kommandozeile, Konfiguration als Code, MCP). Möglichst wenig Handarbeit pro Kunde.

Anwendungsfall des ersten Kunden: eine vereinfachte Bestellplattform. Besucher registrieren sich und loggen sich ein, wählen Produkte, sehen einen ungefähren Preis, schicken eine Bestellung ohne Zahlung ab. Die Bestellung erscheint im Admin-Bereich des Kunden und geht per E-Mail an ihn. Erwartet werden zunächst einige hundert bis wenige tausend Nutzer je Kunde, spätere Kunden ähnlich, jeder Kunde mit eigenen getrennten Nutzern.

Technische Rahmenbedingungen:
- Frontend: Astro-Seiten, ausgeliefert über einen Hosting-Anbieter (aktuell Vercel, später möglicherweise ein EU-Anbieter) auf der Kundendomain.
- Backend und Datenbank: eigener Server in der EU (Linux, 4 GB RAM, PostgreSQL, Node), Zugriff über eine eigene gehärtete Schnittstelle. Der Server ist die führende Datenhaltung.
- Wichtig: Frontend und Server liegen auf unterschiedlichen Hosts. Prüfe, wie Sitzungen, Cookies (SameSite, Secure, Domain), CSRF-Schutz und Token in dieser Aufteilung sauber funktionieren, ohne dass der Browser Cookies verwirft.
- Mailversand läuft über einen separaten EU-Mailanbieter (Bestätigung, Passwort-Zurücksetzen).
- Alle nutzersichtbaren Texte und Fehlermeldungen müssen deutsch sein.

Kandidaten (prüfe diese und ergänze, falls andere besser passen): Better Auth (Bibliothek in der eigenen App), Zitadel (Cloud mit EU-Region und Selbstbetrieb), Authentik, Keycloak, Ory Kratos, Logto, SuperTokens, Supabase Auth (selbst betrieben, GoTrue), Stytch (nur Datenort prüfen), Auth0 mit EU-Mandant (zum Vergleich), WorkOS (zum Vergleich), Lucia-Nachfolger oder vergleichbare schlanke Bibliotheken, ein vollständig selbst gebauter Weg mit bewährten Bausteinen (nur kurz einordnen, mit Risikoeinschätzung). Clerk nur als Maßstab für den Funktionsumfang.

Arbeite ausschließlich mit offiziellen Quellen (Dokumentation, Repository mit Lizenz und Releases, Preisseiten, Datenschutz- und Vertragsunterlagen, Sicherheitsseiten, Statusseiten, Changelog). Blogvergleiche nur als Hinweis, nie als Beleg. Gib zu jeder Aussage Quelle (URL) und Abrufdatum an. Was du nicht belegen kannst, markiere als NICHT BELEGT, rate nicht.

Beantworte je Kandidat:
1. Betriebsart (Bibliothek, selbst betriebener Dienst, gehosteter Dienst), Firmensitz, Datenort, Unterauftragsverarbeiter außerhalb der EU, Vertrag zur Auftragsverarbeitung, Lizenz (z. B. MIT, Apache, AGPL) und deren Folgen für eine Agentur, die Kunden-Software betreibt.
2. Funktionsumfang für Endnutzer: Registrierung per E-Mail und Passwort, E-Mail-Bestätigung, Passwort-Zurücksetzen, Passwortregeln und Prüfung auf bekannte geleakte Passwörter, Sperre und Ratenbegrenzung nach Fehlversuchen, zweite Stufe (TOTP, Passkeys), Anmeldung mit Google oder Apple (optional), Sitzungsverwaltung, Abmelden auf allen Geräten, Konto löschen und Daten exportieren (DSGVO).
3. Mandantentrennung: Nutzer und Einstellungen je Kunde getrennt, Rollen (Endnutzer, Kunden-Admin, Entwickler), Organisationen oder Realms, Verwaltung vieler Kunden mit geringem Aufwand.
4. Anbindung: Astro (Server-Rendering, Middleware, API-Routen), PostgreSQL, Datenbank-Migrationen, Betrieb mit getrennten Hosts für Frontend und Server (Cookies, Token, CSRF), Mailversand über beliebige Anbieter, anpassbare deutsche Texte und Oberfläche.
5. Programmierbarkeit durch KI: Verwaltung per API, Kommandozeile, Konfiguration als Code, Terraform, MCP-Server, projekt- oder mandantenbegrenzte Schlüssel.
6. Betriebsaufwand und Ressourcen: RAM- und CPU-Bedarf auf einem Server mit 4 GB, Sicherung und Rücksicherung, Updates, Reifegrad, Releasetempo, Größe der Gemeinschaft, bekannte Sicherheitslücken und Reaktionszeit, Verantwortlichkeit für Sicherheitsfunktionen (was muss die Agentur selbst absichern).
7. Preise (netto und brutto in Euro) für: 1 Kunde mit 500 Nutzern; 10 Kunden mit je 2.000 Nutzern; Zusatzkosten (SMS, Mandanten, Funktionen, Support). Kostenlose Stufen und Bedingungen, Verhalten bei Inaktivität.
8. Aufwand zur Einrichtung für den ersten Kunden, geschätzt in Arbeitsschritten (nicht Tagen), und der Aufwand für jeden weiteren Kunden.

Liefere am Ende: (a) eine Vergleichstabelle (Zeilen: Kandidat, Spalten: Betriebsart, Datenort, Lizenz, Funktionsumfang für Endnutzer, Mandantentrennung, Astro und getrennte Hosts, Steuerung per KI, Ressourcen, Preis für die zwei Szenarien, Risiken), (b) eine Rangfolge mit Begründung für den Einsatz „viele kleine Kunden, EU-Datenhaltung, minimale manuelle Einrichtung, volle Steuerung per KI“, (c) eine klare Aussage, welche Sicherheitsfunktionen bei einer Bibliothek die Agentur selbst bauen und pflegen muss, (d) eine Liste der Punkte, die ein Test mit einem echten Konto oder Prototyp klären muss, (e) Hinweise für den Anwalt (Datenort, Auftragsverarbeitung, Löschung und Export, Einwilligungen), (f) die Quellenliste mit Datum. Antworte auf Deutsch. Keine Rechtsberatung.
