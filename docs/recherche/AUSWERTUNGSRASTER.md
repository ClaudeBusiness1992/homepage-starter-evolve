# Auswertungsraster für die drei Deep-Research-Recherchen (Mail, Hosting, Anmeldung)

Stand: 26.11.2026. Zweck: Einheitliche, nachvollziehbare Auswertung der drei Recherchen zu EU-Mailanbieter, EU-Hosting für statische Kundenseiten und Anmeldelösung für Endnutzer. Grundlage: `docs/WORKFLOW-PLAN.md` (Leitplanken Abschnitt 0: Einzelentwickler mit KI, Kosten-Nutzen, wenig Handarbeit, API/MCP statt Klickarbeit, EU-Datenhaltung), `docs/DATENKLASSEN.md`, `docs/NEWSLETTER-RESEND-PRUEFUNG.md`, `docs/recherche/PROMPT-MAIL-EU.md`, `docs/recherche/PROMPT-HOSTING-EU.md`, `docs/recherche/PROMPT-AUTH-EU.md`, `docs/recht/ANWALT-UEBERGABE.md`. Dies ist eine Auswertungsvorlage, keine Entscheidung, keine Rechtsberatung. Was nicht belegt ist, ist mit PRÜFEN markiert. Keine Preise oder Zahlen eingetragen.

## 1. Beleg-Stufen und Mindeststufen-Regel

### 1.1 Stufen

- **Stufe A:** Offizielle Quelle mit Datum. Produktseite, API-Dokumentation, Preisliste, Vertrags- oder Datenschutzunterlage, Subprozessor-Liste, Status- oder Changelog-Seite des Anbieters. Erforderlich: URL und Abrufdatum. Nur Stufe A gilt als Beleg.
- **Stufe B:** Aussage des Anbieters ohne Dokument. Zum Beispiel Auskunft im Support-Chat, Vertriebsmail, Webinar-Aussage ohne Folienbeleg. Erforderlich: Wer, wann, Wortlaut oder Zusammenfassung, Ticketnummer wenn vorhanden. Gilt als Hinweis, nicht als Beleg.
- **Stufe C:** Drittquelle. Blogvergleiche, Messungen Dritter, Erfahrungsberichte, Zusammenfassungen in KI-Dokumenten. Gilt nur als Hinweis für weitere Prüfung, nie als Beleg für Vertrag, Datenort oder Preis.
- **Stufe D:** Nicht belegt. Behauptung in der Recherche ohne Quelle, ohne Datum oder mit abgelaufener Quelle. Markierung: NICHT BELEGT oder PRÜFEN.

### 1.2 Mindeststufe je Entscheidungsart

- **Vertrag zur Auftragsverarbeitung (Abschlussform, Ort des Dokuments, Wirksamkeit):** nur Stufe A. Stufe B und C reichen nicht. Bis Stufe A vorliegt: Einsatz gesperrt.
- **Datenort und Speicherort (Rechenzentrum, Konto- und Protokolldaten, Drittlandbezug):** nur Stufe A. Bei Widerspruch zwischen Versandregion und Speicherort gilt die engere Aussage (Speicherort). Bis Stufe A vorliegt: PRÜFEN, Einsatz gesperrt.
- **Preise und Kontingente (netto und brutto, Laufzeiten, Zusatzkosten):** nur Stufe A mit Datum. Drittquellen-Preise (Stufe C) werden nicht übernommen. Vor Entscheidung auf der offiziellen Preisseite gegenprüfen.
- **Funktionsaussagen mit Sicherheitsbezug (Schlüsselrechte, Abmeldemechanik, Sperrlisten, Sitzungen, Verschlüsselung):** Stufe A für die Entscheidung; Stufe B nur als vorläufige Arbeitshypothese mit Pflicht-Test.
- **Automatisierbarkeit (API-Abdeckung, CLI, MCP, Terraform):** Stufe A (Referenz oder Changelog) plus Pflicht-Test mit echtem Konto oder Prototyp. Eine dokumentierte API ohne Test gilt als PRÜFEN.
- **Zustellbarkeit, Reifegrad, Betriebsdauer, Ausfallgeschichte:** Stufe C als Hinweis zulässig, ersetzt aber nicht den eigenen Pflicht-Test. Unabhängige Messungen werden als Stufe C zitiert, nicht als Beleg für den eigenen Fall.
- **Regel bei fehlender Stufe:** Fällt eine Aussage unter die Mindeststufe, wird sie in der Bewertung mit 0 Punkten (Kriterium nicht erfüllt) oder als PRÜFEN eingetragen, nicht aufgewertet.

## 2. Plausibilitätsprüfung jeder Recherche (feste Reihenfolge)

Jede der drei Recherchen wird in dieser Reihenfolge geprüft. Ergebnis je Schritt: bestanden, Auffälligkeit mit Fundstelle, oder PRÜFEN.

1. **Stichproben gegen die Originalquelle.** Je Recherche mindestens drei Stichproben aus verschiedenen Abschnitten (eine Preis-, eine Vertrags- und eine API-Aussage). Original-URL öffnen, Wortlaut und Datum vergleichen. Notieren: stimmt wörtlich, stimmt sinngemäß, weicht ab, Quelle nicht auffindbar. Abweichungen werden als PRÜFEN in das Entscheidungsblatt übernommen.
2. **Datum und Stand.** Prüfen: Trägt jede Stufe-A-Aussage URL und Abrufdatum. Sind Preis- und Vertragsseiten aktuell (Abruf im November 2026). Veraltete Belege (älter als drei Monate bei Preisen und Verträgen) werden als PRÜFEN markiert und neu abgerufen.
3. **Widersprüche zwischen Anbietern.** Vergleichen: widerspricht die Aussage eines Anbieters (zum Beispiel „Speicherung nur in der EU") der Aussage eines anderen Anbieters mit ähnlicher Architektur oder der eigenen Vorerfahrung (zum Beispiel Resend: EU-Versand wählbar, Speicherung in den USA belegt, siehe `docs/NEWSLETTER-RESEND-PRUEFUNG.md` Abschnitt 9). Jeden Widerspruch als PRÜFEN notieren und die engere (vorsichtigere) Lesart in die Bewertung übernehmen.
4. **Offensichtlich erfundene Details.** Suchen nach: runden Preisen ohne Quelle, behaupteten Zertifizierungen ohne Dokument, MCP-Servern oder CLI-Befehlen ohne Referenzlink, Zusagen zu Datenorten ohne Unterseite. Jede solche Stelle wird auf Stufe D zurückgestuft und aus der Punktebewertung gestrichen.
5. **Fehlende Kandidaten.** Abgleichen: Sind alle Kandidaten aus dem jeweiligen Prompt behandelt (Mail: Brevo, Mailjet, MailerSend, Scaleway, Lettermint, Mailgun EU, SES-Vergleich, Selbstbetrieb; Hosting: statichost.eu, Runsite, DanubeData, Nodion, IONOS Deploy Now, Scaleway, Bunny.net, Clever Cloud, Scalingo, Gcore, OVHcloud, Coolify/Caddy-Selbstbetrieb, Vercel/Netlify/Cloudflare-Vergleich; Anmeldung: Better Auth, Zitadel, Authentik, Keycloak, Ory Kratos, Logto, SuperTokens, Supabase Auth, Stytch, Auth0-/WorkOS-Vergleich, Lucia-Nachfolger, Selbstbau). Fehlt ein Kandidat ohne Begründung, wird er als PRÜFEN in die Bewertungstabelle nachgetragen (Zeile leer, keine Punkte).
6. **Vollständigkeit der Liefergegenstände.** Prüfen je Recherche: Vergleichstabelle vorhanden, Rangfolge mit Begründung vorhanden, Testliste mit echtem Konto vorhanden, Quellenliste mit Datum vorhanden, Anwalts-Hinweise vorhanden. Fehlendes wird als PRÜFEN notiert und vor der Entscheidung nachgefordert.

## 3. Bereich Mail (EU-Mailanbieter für Transaktion und Newsletter)

### 3.1 K.o.-Kriterien (ein Nein schließt aus, bis zur Klärung gesperrt)

- K1: Firmensitz oder Datenverarbeitung mit ungeklärtem Drittlandbezug ohne Stufe-A-Vertrag zur Auftragsverarbeitung. PRÜFEN.
- K2: Kein Double-Opt-in mit Nachweis oder keine wirksame Abmeldung mit Sperrliste per API abbildbar.
- K3: Keine Trennung je Kunde möglich (kein eigener Schlüssel je Domain, kein reiner Sendezugriff mit Domainbindung).
- K4: Nur Klickarbeit, keine API für Domainanlage, DNS-Werte-Abruf, Domainprüfung und Schlüsselerstellung.
- K5: Kommerzielle Nutzung vieler Kundendomains vertraglich ausgeschlossen oder Konto wird nach PRÜFEN-Lage bei Agentur-Nutzung regelmäßig gesperrt.

### 3.2 Gewichtete Kriterien (Punkteskala 0 bis 3, Gewichtung als Vorschlag)

Skala: 0 nicht erfüllt oder nicht belegt, 1 teilweise oder nur Stufe C, 2 erfüllt mit Stufe A, 3 erfüllt mit Stufe A plus Pflicht-Test bestanden.

| Kürzel | Kriterium | Gewicht (Vorschlag) | Begründung der Gewichtung |
|---|---|---|---|
| M1 | EU-Sitz und EU-Speicherort für Konto- und Protokolldaten (Stufe A) | 3 | Leitplanke EU-Datenhaltung; US-Speicherung war bei Resend der Ausschlussgrund für die Vorentscheidung. |
| M2 | Auftragsverarbeitung online und vorab unterzeichnet belegbar | 3 | Blockiert laut Anwaltsübergabe den ersten Kunden; ohne Vertrag kein Einsatz. |
| M3 | API-Abdeckung: Domain anlegen, DNS-Werte abrufen, Prüfung anstoßen, Schlüssel je Kunde mit Domainbindung und Senderecht | 3 | Leitplanke wenig Handarbeit und API statt Klick; Kundenanlage läuft sonst nicht automatisiert. |
| M4 | Newsletter per API: Double-Opt-in, Abmeldelink, Ein-Klick-Abmeldung, Sperrliste, Rückläufer und Beschwerden per Webhook mit Signatur | 2 | Pflicht für das Zusatzmodul; Idempotenz und Header-Details sind nach Resend-Prüfung oft nur teils belegt. |
| M5 | Mandantentrennung: getrennte Domains und Schlüssel je Kunde, Drosselung je Kunde, kein gegenseitiges Ausbremsen | 2 | Team-Limits sind belegtes Risiko (Resend: 10 Anfragen je Sekunde je Team); ein Kunde darf andere nicht blockieren. |
| M6 | CLI, SDK oder MCP für KI-Bedienung mit Rechtebegrenzung | 1 | Erleichtert Einzelentwickler-Betrieb, ist aber ersetzbar durch eigene Befehlshülle per REST. |
| M7 | Zustellbarkeit bei deutschen Postfächern (Stufe C plus eigener Test) | 1 | Wichtig, aber erst im Pflicht-Test belegbar; Drittquellen zählen nur als Hinweis. |
| M8 | Preis-Leistung für die drei Szenarien (Stufe A, netto und brutto) | 2 | Kosten-Nutzen-Leitplanke; Gewichtung niedriger als Vertrag und Automatisierung, weil Preise nachverhandelbar sind. |

### 3.3 Leere Bewertungstabelle Mail

| Anbieter | K1–K5 (bestanden / offen) | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | Summe gewichtet | Belegstufen je Zelle |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |
| | | | | | | | | | | | |
| | | | | | | | | | | | |

Jede Zelle erhält zusätzlich die Belegstufe (A, B, C, D) und das Abrufdatum. Zellen mit Stufe D zählen 0 Punkte.

### 3.4 Kostenvorlage Mail (leer, netto und brutto in Euro, Stufe A mit Datum)

- Szenario 1: 1 Domain, wenige hundert Mails im Monat. Felder: Planname, Grundpreis netto, Grundpreis brutto, Mails inklusive, Domains inklusive, Zusatzkosten (Mehr-Mails, Mehr-Domains), Mindestlaufzeit, Werbezeile ja/nein, Quelle und Datum.
- Szenario 2: 5 bis 10 Kundendomains, je bis zu 2.000 Mails. Felder wie oben, zusätzlich: Kontingent je Team oder je Domain, Ratenlimit, Kosten je Zusatz-Domain, Verhalten bei Überschreitung.
- Szenario 3: Newsletter bis 10.000 Empfänger. Felder wie oben, zusätzlich: Kontaktkontingent, Kosten je Zusatz-Kontakt, Broadcast- oder Kampagnenkosten.

### 3.5 Pflicht-Tests Mail (mit echtem Konto, vor Entscheidung)

- T-M1: Domain per API anlegen, DNS-Werte per API abrufen, Prüfung per API anstoßen, Statuswechsel per Webhook empfangen.
- T-M2: Schlüssel mit reinem Senderecht und Domainbindung je Testdomain erzeugen; Vollzugriff verweigert Schreibzugriff auf fremde Ressourcen (Negativtest).
- T-M3: Double-Opt-in Ende-zu-Ende mit Nachweis, Abmeldung mit Ein-Klick, Beschwerde- und Rückläufer-Webhook mit Signaturprüfung, Sperrliste greift auch bei erneutem Import.
- T-M4: Ratenlimit und Kontingent am Testkonto auslösen und sauberes Abbrechen statt Doppelversand nachweisen.

## 4. Bereich Hosting (EU-Auslieferung statischer Kundenseiten, Vercel-Ersatz)

### 4.1 K.o.-Kriterien

- H1: Kein Vertrag zur Auftragsverarbeitung mit Stufe A oder ungeklärter Drittlandbezug bei Zugriffs- und Protokolldaten. Bis zur Klärung gesperrt.
- H2: Kein eigenes Projekt je Kunde mit eigener Domain, eigenem Zertifikat und eigenen Umgebungsvariablen.
- H3: Kein unveränderter Go eines geprüften Vorschau-Stands und kein Schritt zurück auf den vorherigen Stand.
- H4: Kommerzielle Nutzung vieler Kundenprojekte ausgeschlossen oder nur über fragilen Gratis-Tarif abbildbar.
- H5: Keine API oder CLI für Projektanlage, Domainanlage und -prüfung, Umgebungsvariablen und Deployment-Auslösung.

### 4.2 Gewichtete Kriterien

| Kürzel | Kriterium | Gewicht (Vorschlag) | Begründung |
|---|---|---|---|
| H1 | EU-Sitz und EU-Datenort mit Stufe A | 3 | Wie Mail: Leitplanke und Anwalts-Block A. |
| H2 | Reifegrad: stabil, Betriebsdauer, Ausfallhistorie, Unternehmensgröße | 3 | Ein-Mann-Betrieb braucht langweilige Infrastruktur; Beta-Risiko ist teurer als Preisvorteil. |
| H3 | Astro statisch plus kleine serverseitige Funktionen, Build-Umgebung belegt | 2 | Zielarchitektur aus dem Workflow-Plan; ohne Funktionen braucht es Zusatzwege für Formulare. |
| H4 | Vorschau je Stand, Go unverändert, Zurückrollen mit Verlauf | 2 | Kern des Freigabe- und Rollback-Modells aus dem Workflow-Plan. |
| H5 | API/CLI/MCP-Abdeckung plus projektbegrenzte Token | 3 | Kundenanlage per Befehlshülle hängt davon ab; Generalschlüssel-Risiko sinkt nur mit Projekt-Tokens. |
| H6 | Vorschau-Schutz (Anbieter-Schutz oder sauberer eigener Schutz per Middleware) | 1 | Eigener Schutz ist möglich, Anbieter-Schutz spart Aufwand; kein Ausschlussgrund. |
| H7 | Bildauslieferung, Zwischenspeicher-Steuerung, Header und Weiterleitungen | 1 | Medienablage liegt auf eigenem Server; Zwischenspeicher entlastet ihn bei Ausfall. |
| H8 | Preis-Leistung für beide Szenarien (Stufe A) | 2 | Wie Mail: wichtig, aber nachrangig gegenüber Reifegrad und Automatisierung. |

### 4.3 Leere Bewertungstabelle Hosting

| Anbieter | K.o. H1–H5 | H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | Summe gewichtet | Belegstufen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |
| | | | | | | | | | | | |

### 4.4 Kostenvorlage Hosting (leer, netto und brutto in Euro)

- Szenario 1: 1 Projekt. Felder: Planname, Grundpreis netto/brutto, Besucher oder Übertragung inklusive, Build-Minuten inklusive, Funktionen inklusive, Teamplätze, Quelle und Datum.
- Szenario 2: 10 Projekte mit je 5.000 Besuchern im Monat und 5 GB Bildern. Felder wie oben, zusätzlich: Zusatzkosten Übertragung, Builds, Funktionen, Teamplätze, Bedingungen der Gratis-Stufe für kommerzielle Nutzung.

### 4.5 Pflicht-Tests Hosting

- T-H1: Projekt per API/CLI anlegen, Domain per API zuordnen und verifizieren, Umgebungsvariable setzen, Deployment auslösen, Logs lesen.
- T-H2: Vorschau-Stand bauen, freigegebenen Stand unverändert live schalten, einen Schritt zurückrollen, Verlauf prüfen.
- T-H3: Projektbegrenztes Token erzeugen; Zugriff auf fremdes Projekt wird verweigert (Negativtest).
- T-H4: Getrennte Hosts prüfen: Kundenseite beim Hoster, Schnittstelle auf eigenem Server; Formular- und Speicherweg mit Zwischenspeicher bei simuliertem Serverausfall beobachten. PRÜFEN, ob Lese-Cache ohne Server trägt.

## 5. Bereich Anmeldung (Registrierung und Login von Endnutzern, Clerk-Alternative, EU)

### 5.1 K.o.-Kriterien

- A1: Kein EU-Datenort für Nutzer- und Sitzungsdaten mit Stufe A oder ungeklärter Drittlandbezug ohne Vertrag. Bis zur Klärung gesperrt.
- A2: Lizenz verbietet Agenturbetrieb oder macht Kunden-Software ansteckend (zum Beispiel AGPL ohne geklärte Betriebsform). PRÜFEN durch Anwalt, bis dahin gesperrt.
- A3: Keine Trennung je Kunde (keine Organisationen, Realms oder Mandanten mit getrennten Nutzern und Rollen).
- A4: Kein E-Mail-Bestätigungs- und Passwort-Zurücksetzen-Weg über beliebigen EU-Mailanbieter.
- A5: Getrennte Hosts (Frontend beim Hoster, Server mit PostgreSQL) lassen sich nicht sauber mit Cookies (SameSite, Secure, Domain), CSRF-Schutz und Token betreiben. PRÜFEN im Prototyp.

### 5.2 Gewichtete Kriterien

| Kürzel | Kriterium | Gewicht (Vorschlag) | Begründung |
|---|---|---|---|
| A1 | EU-Datenort mit Stufe A plus Auftragsverarbeitung | 3 | Anwalts-Block A; Nutzerdaten sind sensibler als Auslieferungsdaten. |
| A2 | Lizenzfolgen für Agenturbetrieb geklärt (MIT/Apache unkritisch, AGPL mit PRÜFEN) | 3 | Falsche Lizenz ist teurer als jeder Funktionsvorteil; Anwalt entscheidet. |
| A3 | Funktionsumfang Endnutzer: Registrierung, Bestätigung, Zurücksetzen, Ratenbegrenzung, Sperre, Sitzungsverwaltung, Abmelden überall, Löschen und Export | 2 | Bestellplattform des ersten Kunden braucht genau diesen Umfang auf Deutsch. |
| A4 | Mandantentrennung und Rollen (Endnutzer, Kunden-Admin, Entwickler) mit wenig Aufwand je weiterem Kunden | 3 | Skalierung auf viele kleine Kunden bei wenig Handarbeit. |
| A5 | Astro-Anbindung mit getrennten Hosts (Middleware, API-Routen, Cookie- und CSRF-Verhalten belegt) | 2 | Architektur-Risiko aus dem Prompt; ohne Prototyp keine Entscheidung. |
| A6 | Steuerung per KI: API, CLI, Konfiguration als Code, Terraform, MCP, mandantenbegrenzte Schlüssel | 2 | Leitplanke API statt Klick; Einrichtung je Kunde muss in Arbeitsschritten klein bleiben. |
| A7 | Betriebsaufwand: RAM/CPU auf 4-GB-Server, Sicherung, Updates, Releasetempo, Gemeinschaft, Sicherheitsreaktion | 2 | Einzelentwickler ohne Vertretung; schwerer Betrieb schließt Selbstbetrieb faktisch aus. |
| A8 | Preis-Leistung für beide Szenarien (Stufe A) | 1 | Bibliothek und Selbstbetrieb sind preislich nah beieinander; Betrieb schlägt Preis. |

### 5.3 Leere Bewertungstabelle Anmeldung

| Kandidat | K.o. A1–A5 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | Summe gewichtet | Belegstufen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |
| | | | | | | | | | | | |

### 5.4 Kostenvorlage Anmeldung (leer, netto und brutto in Euro)

- Szenario 1: 1 Kunde mit 500 Nutzern. Felder: Betriebsart (Bibliothek, Selbstbetrieb, Cloud), Plankosten netto/brutto, Nutzer inklusive, Zusatzkosten (SMS, Mandanten, Funktionen, Support), Gratis-Stufe und Inaktivitätsregeln, Infrastrukturkosten (Serveranteil), Quelle und Datum.
- Szenario 2: 10 Kunden mit je 2.000 Nutzern. Felder wie oben, zusätzlich: Staffelung je Mandant oder Nutzer, Kosten je Zusatz-Mandant.

### 5.5 Pflicht-Tests Anmeldung (Prototyp mit getrennten Hosts)

- T-A1: Registrierung, Bestätigung, Login, Abmeldung auf allen Geräten, Passwort-Zurücksetzen über EU-Mailanbieter, deutsche Texte und Fehlermeldungen.
- T-A2: Fehlversuche lösen Ratenbegrenzung und Sperre aus; geleakte Passwörter werden abgewiesen (wenn behauptet, sonst PRÜFEN).
- T-A3: Getrennte Hosts: Frontend auf Hoster-Domain, Server auf eigenem Server; Cookies werden nicht verworfen, CSRF-Schutz greift, Token-Laufzeiten und -Widerruf funktionieren.
- T-A4: Mandantentrennung: zwei Testkunden mit getrennten Nutzern und Rollen; Zugriff über Kreuz wird verweigert (Negativtest). Löschen und Export je Nutzer prüfen.
- T-A5: Bei Bibliothek: Nachweis, welche Sicherheitsfunktionen die Agentur selbst baut und pflegt (Sitzung, Hashing, Ratenbegrenzung, Token-Rotation). Ohne diesen Nachweis keine Entscheidung.

## 6. Querschnitt über die drei Entscheidungen

### 6.1 Zusammenspiel

- **Domainprüfung doppelt:** Mailanbieter (SPF, DKIM, DMARC je Kundendomain) und Anmeldelösung (Bestätigungs- und Zurücksetzen-Mails über denselben oder anderen Versender) brauchen dieselbe Domain-Verifizierung. Klären: eine Absenderdomain je Kunde für beide Zwecke oder getrennte Subdomains für Transaktion und Marketing. PRÜFEN, ob der Mailanbieter Subdomain-Empfehlung bei bestehendem Ruf belegt.
- **Getrennte Hosts mit Cookie-Frage:** Hosting (Kundenseite beim Auslieferer) und Datenschnittstelle (eigener Server) liegen auf verschiedenen Hosts. Die Anmeldelösung muss genau dort funktionieren (Cookies, SameSite, Secure, Domain, CSRF, Token). Prototyp T-A3 und T-H4 gehören zusammen und werden gemeinsam abgenommen.
- **Schlüssel- und Kontenmodell:** Je Kunde fallen an: Hosting-Projekt mit projektbegrenztem Token, Mail-Domain mit Sende-Schlüssel, Schnittstellenschlüssel, Datenbankrolle, Anmelde-Mandant. Die Befehlshülle hält nur Generalschlüssel. PRÜFEN, ob jeder gewählte Anbieter projekt- oder mandantenbegrenzte Schlüssel belegt (Vercel und Resend: belegt; Ersatzkandidaten: PRÜFEN).
- **Vorschau-Regel gemeinsam:** Vorschau erhält keinen Mail-Schlüssel, Versand ist technisch gesperrt; Anmelde-Mails in der Vorschau laufen nur gegen synthetische Adressen; echte Nutzerdaten nur befristet nach Datenklassen-Regel.

### 6.2 Anbieterbindung und Rückweg

Je Entscheidung festhalten: Wechselkosten (Exportformate für Domains, Kontakte mit Einwilligungsnachweisen, Nutzer mit Passwort-Hashes, Deployments und Umgebungsvariablen), Kündigungsfristen, Mitnahme von Domains und Reputation, Sperrfristen bei Import. Rückweg vor Entscheidung benennen: Mail (eigene Datenbank als führende Kopie, Resend nur Spiegel — Prinzip übernehmen), Hosting (fertig gebaute Dateien und Infrastruktur als Code einplanen), Anmeldung (Export von Nutzern ohne Passwörter ist kein Rückweg — PRÜFEN, ob Hash-Export oder Neuanmeldung nötig).

### 6.3 Gesamtkosten-Vorlage pro Monat (leer, netto und brutto in Euro)

| Posten | 1 Kunde | 10 Kunden | Quelle und Datum |
|---|---|---|---|
| Hosting (alle Projekte, inkl. Übertragung, Builds, Funktionen) | | | |
| Mail (alle Domains, Mails, Kontakte) | | | |
| Anmeldung (Cloud oder Serveranteil Selbstbetrieb, SMS, Zusatz-Mandanten) | | | |
| Server, Sicherungsspeicher, DNS, Überwachung (nach Wahl) | | | |
| Summe netto / Summe brutto | | | |

Keine Summen vorab eintragen. Drittland-Zusatzkosten (zum Beispiel Währungsaufschlag) getrennt ausweisen.

### 6.4 Zahl der Konten und Verträge (Vorlage)

| Gegenstand | 1 Kunde | 10 Kunden |
|---|---|---|
| Agenturkonten (Hosting-Team, Mail-Team, Anmelde-Cloud oder Selbstbetrieb) | | |
| Verträge zur Auftragsverarbeitung mit Auslieferer, Mailer, Hoster, Sicherung, ggf. DNS und Überwachung | | |
| Schlüssel je Kunde (Hosting-Projekt, Mail-Sende, Schnittstelle) | | |
| Domains und Mandanten je Kunde | | |

## 7. Entscheidungsblatt je Bereich (Vorlage, dreimal ausfüllen)

- **Empfehlung:** Kandidat, Stufe-A-Belege (URLs und Daten), gewichtete Summe, warum er die Leitplanken (wenig Handarbeit, API-Betrieb, EU-Datenhaltung, Kosten-Nutzen) am besten erfüllt.
- **Alternative:** Zweitplatzierter mit Abstand in Punkten und dem Grund, wann er gewinnt (zum Beispiel Reifegrad gegen Preis).
- **Risiken:** Team-Limits, Reputationsteilung, Beta-Status, Unternehmensgröße, Ausfallgeschichte, fehlende Ein-Klick-Header, fehlende Idempotenz bei Broadcasts, Cookie-Verhalten bei getrennten Hosts. Jedes Risiko mit Belegstufe.
- **Rückweg:** Exportwege, Kündigungsfrist, Aufwand in Arbeitsschritten für den Wechsel, was beim Wechsel verloren geht (zum Beispiel Reputation, Hashes, Verlauf).
- **Offene Prüfpunkte:** Liste aus Plausibilitätsprüfung und Pflicht-Tests mit Verantwortlichem und Datum.
- **Anwaltsfragen:** Verweise auf die Kandidatenliste in Abschnitt 8, keine Vorwegnahme der Rechtsprüfung.
- **Benötigte Handlung von Nick:** Konto anlegen, Ausweisprüfung, DNS-Zone wählen, B2B/B2C-Weiche, Budgetfreigabe, Unterschrift unter Vertrag. Je Punkt: Aufwand und Sperrwirkung bis zur Erledigung.

## 8. Kandidatenliste neuer Anwaltsfragen (Vorschlag für die Sammelliste, Sammelliste selbst nicht geändert)

Nummerierung als Vorschlag (R-1 fortlaufend), keine Änderung an `docs/recht/ANWALT-UEBERGABE.md`.

- **R-1 (Datenort Hosting-Ersatz):** Reicht für den Vercel-Ersatz ein Anbieter mit Sitz und Rechenzentrum in der EU, oder ist Deutschland nötig. Einordnung von Edge-Netz und Protokolldaten, Drittlandbezug bei Unterauftragsverarbeitern, Einsatzsperre bis zur Klärung.
- **R-2 (Datenort Mail-Ersatz):** Einordnung, wenn Konto-, Meta- und Protokolldaten außerhalb der EU gespeichert werden, auch bei wählbarer EU-Versandregion. Übertragungsgrundlage und Einwilligungstexte, Bestandskunden-Ausnahme.
- **R-3 (Datenort Anmeldung):** Einordnung von Nutzer-, Sitzungs- und Protokolldaten bei Bibliothek (eigener Server), Selbstbetrieb und EU-Cloud. Auftragsverarbeitung je Betriebsart, Fernzugriffe und Supportzugriffe.
- **R-4 (Auftragsverarbeitung neu):** Wirksamkeit der DPA-Modelle der drei Ersatzkandidaten (online, vorab unterzeichnet, Ort des Dokuments), Unterauftragsverarbeiter-Verfahren und Widerspruchsfolgen je Anbieter.
- **R-5 (Drittland):** Tragende Garantie je Ersatzanbieter bei US-Mutter, US-Subprozessoren oder US-Speicherung; Folgen für Datenschutzerklärung und Kundenvertrag.
- **R-6 (Lizenz AGPL):** Folgen von AGPL-lizenzierten Anmelde-Komponenten (Keycloak, Authentik, Ory Kratos und vergleichbare) für eine Agentur, die Kunden-Software betreibt und hostet. Abgrenzung Eigenbetrieb gegen Weitergabe, Pflichten bei Änderung, Alternative mit MIT/Apache.
- **R-7 (Löschung und Export Anmeldung):** Fristen für unbestätigte Konten, Abmeldungen, Sitzungs- und Login-Protokolle; Umfang und Format von Export und Auskunft bei Bestell- und Anmeldedaten; Umgang mit Sperrlisten beim Restore aus der Sicherung.
- **R-8 (Löschung und Export Hosting):** Protokoll- und Cache-Fristen beim Auslieferer, Backup-Verfall, Nachweis der Vorschau-Löschung.
- **R-9 (Einwilligungen Anmeldung):** Einwilligungstexte für Registrierung, Bestellzweck und optionale Messung; Versionierung und Erneuerung bei Textänderung; Eignung von Google-/Apple-Login für deutsche Kunden.
- **R-10 (Einwilligungen Newsletter beim neuen Mailer):** Übertragbarkeit der Einwilligungsnachweise und Sperrliste beim Anbieterwechsel; Wirksamkeit von List-Unsubscribe und Ein-Klick-Weg des neuen Anbieters als Ersatz für die Resend-Lage.

## 9. Zeitleiste für die Auswertung morgen (eine Recherche nach der anderen, kleine Schritte)

Annahme: drei Recherche-Ergebnisse liegen vor. Reihenfolge nach Abhängigkeit: Mail zuerst (Versandweg blockiert Anmeldung und Newsletter), Hosting danach (Auslieferer bestimmt Cookie- und Funktionsrahmen), Anmeldung zuletzt (braucht beide Vorentscheidungen).

1. **Schritt 1 — Mail sichten (kurz):** Plausibilitätsprüfung Abschnitt 2 durchführen, K.o.-Liste Abschnitt 3.1 ankreuzen, Bewertungstabelle 3.3 roh ausfüllen. Abbruch bei K.o.-Offenheit: PRÜFEN notieren, weiter zu Schritt 2.
2. **Schritt 2 — Mail Kosten und Tests:** Kostenvorlage 3.4 mit Stufe-A-Quellen füllen, Pflicht-Tests 3.5 als Aufträge an Nick formulieren (Konten, Ausweisprüfung). Entscheidungsblatt Abschnitt 7 für Mail als Entwurf.
3. **Schritt 3 — Hosting sichten:** Wie Schritt 1 mit Abschnitten 4.1 und 4.3. Zusätzlich Querschnitt 6.1 (getrennte Hosts) vormerken.
4. **Schritt 4 — Hosting Kosten und Tests:** Wie Schritt 2 mit Abschnitten 4.4 und 4.5. Prototyp T-H4 mit T-A3 bündeln.
5. **Schritt 5 — Anmeldung sichten:** Abschnitte 5.1 und 5.3, Lizenz-K.o. A2 sofort als PRÜFEN an Anwalt geben (R-6). Keine Punkte für Lizenz ohne Anwaltsantwort.
6. **Schritt 6 — Anmeldung Kosten und Prototyp:** Abschnitte 5.4 und 5.5. Prototyp mit getrennten Hosts ist Pflicht, keine Entscheidung ohne T-A3.
7. **Schritt 7 — Querschnitt und Abschluss:** Gesamtkosten 6.3 und Konten 6.4 füllen, drei Entscheidungsblätter finalisieren, R-1 bis R-10 an Nick zur Weitergabe an die Sammelliste übergeben (Sammelliste selbst nicht ändern).

Jeder Schritt endet mit einem PRÜFEN-Stand. Keine Entscheidung wird vorgezogen, solange ein K.o. offen oder ein Pflicht-Test ausstehend ist.
