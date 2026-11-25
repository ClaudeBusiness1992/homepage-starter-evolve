# HPSE-Workflow – Plan Version 3 (25.11.2026)

Status: überarbeiteter Plan, nicht umgesetzt. Grundlage: der ursprüngliche Plan, die Bewertungen von Fable 5.1 (62/100) und Fable 5.2 (66/100), das externe Feedback, Nicks acht Entscheidungen vom 25.11.2026 und die Gegenlesung von Fable 5.2 (low) zu Version 2. Änderungen gegenüber Version 1 sind mit "NEU" oder "GEÄNDERT" markiert, Änderungen aus der Gegenlesung zusätzlich mit "V3". Hinweis: Preise und Grenzen von Vercel und Resend wurden am 25.11.2026 gegen die offiziellen Seiten geprüft (siehe Abschnitt 2a). Nicht bestätigt ist die Reichweite von Vercel-Zugriffsschlüsseln (Team oder Projekt).

## 0. Leitplanken (NEU)

Diese Regeln gelten für jeden Abschnitt und jede spätere Entscheidung:

1. Ein einzelner Entwickler arbeitet fast ausschließlich mit KI. Jede Vorgehensweise muss für eine Person mit KI im Terminal praktikabel sein.
2. Kosten und Nutzen werden bei jeder Entscheidung abgewogen. Zusätzliche Dienste und Anbieter brauchen einen klaren Gegenwert.
3. Der Kern des Geschäftsmodells: Eine neue Kundenseite muss schnell und mit möglichst wenig Handarbeit einsatzbereit sein. Das Anlegen eines Kunden läuft automatisiert.
4. Schnittstellen laufen über API oder Kommandozeile. Die Browser-Erweiterung ist nur der Notnagel, wenn ein Anbieter keine API hat. Einmalige Handarbeit bei Anbietern wird vermieden.
5. Anbieter werden nur genutzt, wenn Updates "nahtlos und gut" aus dem Terminal per KI möglich sind. Systeme mit viel Backend-Konfiguration (Beispiel WordPress auf Raidboxen) passen nicht.
6. Nichts wird versprochen, was personell oder technisch nicht erfüllbar ist (keine Rund-um-die-Uhr-Zusage, keine pauschale "verlustfrei jederzeit"-Garantie).

## 1. Gesamtarchitektur: Dreiteilung (GEÄNDERT)

Jede Webseite, auch die eigene Homepage, besteht aus drei getrennten Schichten.

- **Kern (Core):** Bausteine, Layout-Logik, /editor, Audit. Er wird als unveränderliches, versioniertes Paket freigegeben. Genau das auf der Prüfseite getestete Paket geht live. Der Kern wird nur im Haupt-Template geändert, nach Freigabe.
- **Kunden-Daten und Einstellungen:** Design-Einstellungen (Farben, Schriften, Reihenfolge, Module) und alle Inhalte. Das Ausblenden eines Moduls erhält seine Inhalte. Bleibt bei Updates unangetastet.
- **Erweiterungen (statt freiem Sonder-Ordner):** Im MVP gestrichen. Bei einem echten Sonderwunsch entsteht ein dokumentierter Erweiterungspunkt mit Versionsangabe (unterstützte Kernversion) und eigenem Test. Beliebiger Kundencode wird nicht zugelassen.

Sonderregel eigene Homepage: Sie ist der erste Kunde und das Vorzeigeprojekt. Ihre Daten gelangen nie in das Kern-Paket. Ein neuer Kunde erhält Kern plus leere Standard-Einstellungen. Auch die Homepage nutzt PostgreSQL, damit der Pilot die Zielarchitektur wirklich testet.

## 2. Hosting und Datenhaltung (NEU)

- **Eigener Server:** Editor, Schaltzentrale, Audit und die Datenbank laufen auf Nicks Server, erreichbar nur über Tailscale.
- **Kundenseiten:** Jede Kundenseite läuft als eigenes Projekt auf Vercel Pro (Kosten laut Drittquellen etwa 20 US-Dollar im Monat für das Team, 1 TB Datenverkehr inklusive; Zahlen vor der Entscheidung auf vercel.com/pricing bestätigen). Die Hobby-Stufe ist für Kundenseiten nicht zulässig (kommerzielle Nutzung).
- **Datenbank:** PostgreSQL auf dem eigenen Server, pro Kunde getrennt (eigene Datenbank oder eigenes Schema mit eigener Rolle). Die Kundenseite greift über eine gesicherte Schnittstelle zu. SQLite entfällt für Kundenseiten, weil Vercel kein dauerhaftes Dateisystem hat.
- **Datenschutz:** Auftragsverarbeitungsverträge mit allen Dienstleistern, die Kundendaten sehen: Vercel, Resend, der externe Prüfdienst und der Sicherungsspeicher. Funktionen und Datenbank in der EU. Alle im Verzeichnis der Auftragsverarbeitung.
- **Datenweg (V3, Pflicht):** Vercel-Funktionen sind nicht im Tailnet. Die Daten-Schnittstelle auf dem eigenen Server ist deshalb öffentlich erreichbar und wird entsprechend gehärtet: wenige feste Lese- und Schreibwege, eigener Schlüssel je Kunde, Ratenbegrenzung, Protokoll. Sie ist ein eigenes Arbeitspaket in Phase 1.
- **Zwischenspeicher (V3, Pflicht):** Die Kundenseite wird aus dem Zwischenspeicher von Vercel ausgeliefert. Beim Speichern im /admin wird die betroffene Seite neu zwischengespeichert. Fällt der eigene Server aus, bleibt die Seite für Besucher erreichbar. Nur Formulare und Speichern brauchen den Server. Der Server ist sonst ein unbewachter Ausfallpunkt für alle Kunden. Fällt der Pilot damit zu aufwendig aus, ist eine verwaltete Datenbank in der EU der Rückfallweg.
- **Inhalte live (V3):** Speichern im /admin löst eine Neuvalidierung der betroffenen Seite aus (Sekunden, kein vollständiger Neubau). Daraus folgt: Inhalte sind nicht in den Build eingebacken, und ein Rollback des Seitenstands holt keine alten Inhalte zurück.
- **Medienablage (V3):** Bilder liegen nicht im Vercel-Dateisystem, sondern hinter der Schnittstelle auf dem eigenen Server oder in einem EU-Objektspeicher. Die Wahl wird im Piloten getroffen und gemessen.
- **Standort von /editor (V3):** /editor läuft ausschließlich auf dem eigenen Server im Tailnet. Auf den Kundenseiten auf Vercel gibt es keine Editor-Route. Die Rollenprüfung in Abschnitt 3 gilt für /admin.
- **Offen (bei der Umsetzung klären):** Wo die eigene Homepage selbst läuft. Empfehlung aus der Gegenlesung: auf Vercel, damit der Pilot Vercel, Schnittstelle und Zwischenspeicher wirklich testet.
- **Bestandskunden mit WordPress:** Ein künftiger Kunde auf Raidboxen mit WordPress wäre ein Umzugsfall: Seite im Baukasten neu aufbauen, Domain und Inhalte übernehmen, auf Vercel setzen. Der Umzug ist ein eigener Punkt in Phase 3.

## 2a. Bestätigte Preise und Grenzen (V3, Stand 25.11.2026, offizielle Seiten)

- **Vercel Pro:** Kostenbasiert mit monatlichem Guthaben, unbegrenzte kostenlose Betrachter-Plätze, 1 TB Datenübertragung und 1 Mio. CDN-Anfragen im Basis-Tarif. **Passwortschutz für Vorschauen: 20 US-Dollar pro Monat und geschütztem Projekt** (Add-on). Quelle: vercel.com/docs/plans/pro-plan und vercel.com/docs/deployment-protection.
- **Resend:** Free 3 Domains, 3.000 Mails im Monat. **Pro 20 US-Dollar im Monat: 50.000 Mails, 10 Domains.** Scale 90 US-Dollar im Monat: 100.000 Mails, 1.000 Domains. Zusatzpaket Domains: 20 US-Dollar im Monat für 100 weitere Domains (Pro und Scale). Konsequenz: Bis zu 10 Kunden mit eigener Absenderdomain passen in Pro, danach 20 US-Dollar je 100 Domains zusätzlich. Quelle: resend.com/pricing.
- **Folgerung:** Der Vercel-Passwortschutz würde bei zehn Kunden 200 US-Dollar im Monat kosten. Ein eigener Schutz ist hier klar günstiger.
- **Noch nicht bestätigt:** Reichweite von Vercel-Zugriffsschlüsseln (Team oder Projekt).

## 3. Zugänge, Rollen und Vorschau-Schutz (GEÄNDERT)

- /: Besucheransicht. /admin: Kunde. /editor: Entwickler. Jede schreibende Anfrage wird serverseitig auf Rolle, Kunde, Umgebung und Objekt geprüft. Späteres Laden des Editor-Codes ist kein Zugriffsschutz.
- Auf der Live-Seite darf die Editor-Identität nur lesen.
- Sitzungen sind auf den jeweiligen Host begrenzt. Passwort-Zurücksetzen und Rechteentzug sind vorgesehen.
- Vorschau-Sperre: Das gemeinsame Passwort pro Kundenprojekt ist für eine kurze Designabnahme vertretbar. Es muss vor Seiten, APIs, Bildern und Downloads greifen und wird mit noindex ergänzt. Der Startschalter öffnet nur die künftige Live-Adresse. Die dauerhafte Prüfseite behält ihren eigenen Schutz.
- Vor dem Live-Gang wird der Schutz serverseitig erzwungen, nicht nur im Browser.

## 4. Kunden-Bereich /admin (GEÄNDERT)

Fünf feste Module: Team, Galerie, Newsletter, Öffnungszeiten und Kontakt, Hinweis-Banner. Keine freien Design-Regler.

- **Inhalte gehen direkt live**, mit Änderungsverlauf, Rücknahme der einzelnen Änderung und Schutz vor gegenseitigem Überschreiben. Eine korrigierte Telefonnummer braucht keine technische Freigabe.
- Jeder Speichervorgang zeigt eindeutig, was Besucher jetzt sehen. Das Banner hat "Sofort veröffentlichen" und eine sichtbare Ablaufzeit mit Zeitzone.
- Stufe 1 beim Speichern: Sofort-Stopp bei fehlenden Pflichtangaben, defekter Bilddatei oder ungültigem Link. Stufe 2: stille Prüfung im Hintergrund.
- Uploads: nur wenige Bildformate, Dateiinhalt prüfen, Größe begrenzen, Bilder neu erzeugen, ohne Ausführungsrechte ausliefern.
- **Newsletter (V3: optionales Zusatzmodul, wird dennoch früh entwickelt):** Der Newsletter ist kein Pflichtmodul für jeden Kunden, sondern ein buchbares Zusatzmodul mit eigener Einrichtungsliste und eigenem Preis. Weil der erste Interessent ihn wünscht, wird er in Phase 2 entwickelt. Pflicht in Phase 1 ist nur der Mailweg für Kontaktformular und Passwort-Zurücksetzen. Versand über Resend, Agentur-Konto: Ein Team, pro Kunde eigene Domain und eigener API-Schlüssel, Einrichtung automatisiert per API. Pflicht: Double-Opt-in mit Nachweis der Einwilligung, wirksame Abmeldung auch bei geplanten Kampagnen und nach Import alter Listen, Sperrliste, Schutz vor Doppelversand bei Wiederholung, Absenderdomain mit SPF, DKIM, DMARC. Auftragsverarbeitungsvertrag mit den Kunden. Risiko: Kontingent und Rate-Limit gelten pro Team, ein Kunde kann andere ausbremsen.

## 5. Editor und Audit (GEÄNDERT)

- /editor: Entwickler-Sache für Design und Struktur sowie die Haupttexte (Hero, Leistungen, Preise, Rechtstexte). Decap wird ausgebaut. Der Editor schreibt nur in Kunden-Einstellungen, nie in Programmcode.
- Audit zu drei Zeitpunkten wie bisher, aber mit ehrlichen Aussagen:
  - Design: messbarer Kontrast, Überlauf, Vergleich definierter Ansichten. Auffälliges geht zur Sichtprüfung vor.
  - Kaputte Inhalte: sicher feststellbare Fehler blockieren, externe Timeouts nur als Hinweis mit Nachprüfung.
  - Technik: Skriptfehler, Ladezeitbudgets, Zertifikate, Testformular bis zum kontrollierten Empfang.
  - Rechtliches: nur überprüfbare Beobachtungen (zum Beispiel "Impressumslink auf allen geprüften Seiten erreichbar") mit Fundstelle und Zeitpunkt. Keine pauschale Rechtsampel und keine Compliance-Zusage.
  - Update-Konflikte: unterstützte Versionen und Tests je Erweiterung.
- Der Link-Prüfer ruft Kunden-URLs ab. Er läuft mit begrenzter Laufzeit und ohne Zugriff auf interne Dienste.

## 6. Alarm und Schaltzentrale-Ampel (GEÄNDERT)

- Hinweise (kosmetisch) bleiben still im Audit-Bereich.
- Genau **ein aktiver Kanal** für echte Ausfälle: Live-Ausfall, Zertifikat mit weniger als 14 Tagen, Formularfehler, Backup-Fehler. Der Kanal wird noch festgelegt.
- Die Ampel hat vier Zustände: Grün, Gelb, Rot und **Unbekannt** mit Zeit der letzten erfolgreichen Prüfung. Ein einfacher externer Dienst prüft von außen, ob Schaltzentrale und Kundenseiten antworten, und meldet über den aktiven Kanal, wenn der Prüfer selbst schweigt.

## 7. Sicherheits- und Arbeitsregeln für die KI (GEÄNDERT)

Regeln gelten nur, wenn sie technisch durchgesetzt werden. Ein Chat-Hinweis schützt nichts.

- Eigener Arbeitsbereich und projektgebundene Zugangsdaten pro Kunde. Logs, Suchindex und Werkzeuge halten dieselbe Grenze.
- Der Kern ist schreibgeschützt eingebunden. Ein vom KI-Prozess unabhängiger Mechanismus gewährt zeitlich begrenztes Schreiben auf einen Entwicklungszweig ("Template entsperren"). Danach ist er wieder gesperrt.
- Die KI hat weder Produktionsschlüssel noch Zugang zum Freigabedienst. Änderungen an der Freigabe-Pipeline dürfen sich nicht selbst autorisieren.
- Vor jedem KI-Eingriff entsteht ein überprüfbarer Sicherungspunkt. Neue Kunden werden nur aus freigegebenen Paketkennungen angelegt.
- Betrifft eine Aufgabe den gesperrten Kern, stoppt die KI und schlägt zwei Wege vor: Erweiterungspunkt für den Kunden oder Template-Erweiterung im Haupt-Template. Ob eine Idee in den Kern gehört, entscheidet Nick.
- Das Löschen von Mediendateien und andere schreibende Operationen sind auf feste Verzeichnisse begrenzt.

## 8. Prüfseite, Live-Seite, Freigabe und Rollback (GEÄNDERT)

- **Prüfseite (V3, geändert):** Pro Kunde gibt es nur ein Vercel-Projekt. Vor dem Start existiert nur die gesperrte Live-Adresse. Für ein Update erzeugt Vercel eine zeitweilige Vorschau desselben Projekts. Design, Kern und Erweiterungen werden dort geprüft. Go befördert genau diesen Stand, er wird nicht neu gebaut. Es gibt keine dauerhafte zweite Umgebung und keine zweite Datenbank je Kunde. Die Vorschau erhält keinen Mail-Schlüssel. Der eingebaute Vercel-Passwortschutz kostet auf Pro 20 US-Dollar im Monat je geschütztem Projekt (offizielle Vercel-Dokumentation, Stand 25.11.2026) und wird deshalb nicht genutzt. Stattdessen sperrt ein eigener serverseitiger Schutz (Middleware mit Passwort, noindex) Seiten, APIs und Bilder.
- **Prüfseite mit echten Daten nur auf Zeit.** Echte Inhalte werden nur für eine konkrete Abnahme kopiert und danach gelöscht. Pflicht: Zweck und Rechtsgrundlage geklärt, Zugriff nur bei Nick, feste Löschfrist, Mailversand, Webhooks und Tracking technisch gesperrt, keine Kopie in Backups, Logs oder KI-Verlauf. Die Zusage "niemals personenbezogene Daten kopieren" entfällt zugunsten dieser Regeln.
- **Go (Weg 2):** Es wird genau das auf der Prüfseite getestete Paket aktiviert. Pro Kunde läuft nur ein Deployment gleichzeitig. Bei relevanten Änderungen zwischen Audit und Go wird neu geprüft. Ein Doppelklick löst keine zweite Migration aus. Was Kunden oder Besucher auf Live verändert haben, wird nie überschrieben.
- **Rollback:** Nur nachweislich kompatible Versionen sind aktivierbar. Datenbankänderungen laufen in kleinen Schritten, alte und neue Darstellung bleiben eine Weile kompatibel. Vor jedem Release läuft der Test "mit neuer Version schreiben, auf alte zurück, lesen, erneut speichern". Ist ein Rückweg fachlich unmöglich, sperrt die Schaltzentrale ihn und es gibt nur Korrektur nach vorn. V3: Zugesagt wird ein Schritt zurück, nicht fünf. Datenbankänderungen erst erweitern, eine Version später aufräumen. Der Rundlauf-Test läuft automatisch, wenn ein Release das Datenmodell ändert. Ein Rollback des Seitenstands berührt keine Inhalte.

## 9. Schaltzentrale (GEÄNDERT)

- Zuerst Skripte und Befehle plus eine Statusseite nur im Tailnet. Eine Oberfläche kommt später. Prüfseiten liegen unter einer pixel&code-Domain.
- Übersicht pro Kunde: Links, Kern-Version mit Hinweis auf neuere Version, Status der Vorschau-Sperre, Ampel, offene Audit-Treffer.
- **Kunden anlegen (zentral, NEU):** Ein Befehl legt alles automatisch an: Vercel-Projekt, Domains, Datenbank und Rolle, Resend-Domain und API-Schlüssel, Vorschau-Sperre, Standard-Einstellungen. Nur Anbieter mit API oder Kommandozeile werden angebunden. Ziel: Handarbeit je Kunde nahe null.
- **Befehlshülle (V3, geändert):** Eine kleine Befehlshülle auf dem eigenen Server mit festen Befehlen: Kunde anlegen, Update einspielen, Go, Zurück. Der Generalschlüssel für Vercel und Resend liegt nur dort. Die KI darf die Befehle aufrufen, aber die Schlüssel nicht lesen. Go verlangt Nicks Bestätigung. Das Anlegen legt ein Vercel-Projekt, Datenbankrolle, Schnittstellenschlüssel und Resend-Zugang an. Vor Schritten, die die Datenbank ändern (Migration, Go, Import), sichert die Hülle automatisch.
- Trennung je Kunde dort, wo sie billig und echt ist: eigene Datenbankrolle, eigener Schlüssel der Daten-Schnittstelle, eigener Resend-Schlüssel. Vercel-Schlüssel gelten laut Prüfer für ein Team, daher ein Team mit der Befehlshülle als einzigem Halter (bestätigen). Der Generalschlüssel ist ein bewusst benanntes Einzelrisiko: zweiter Faktor, Protokoll, Sicherung außerhalb des eigenen Servers, die sich mit dem Betreiberzugang nicht löschen lässt, enge Tailscale-Regeln, Betreibergerät sperrbar.
- Updates werden gestaffelt ausgerollt: zuerst eigene Homepage und ein repräsentativer Kunde, danach gruppenweise. Bei Fehlern stoppt der Rollout.

## 10. Betrieb, Sicherung und Störfall (NEU)

- **Verantwortung:** Nick bleibt verantwortlich. Es gibt keine Rund-um-die-Uhr-Zusage und zunächst keine Vertretung (jederzeit ergänzbar).
- **Wiederanlauf-Probe vor dem ersten zahlenden Kunden:** Eine Seite wird ohne funktionierenden Editor aus einer unabhängigen Sicherung wiederhergestellt, eine fehlerhafte Technikfreigabe wird zurückgenommen, und die zuletzt erfasste Öffnungszeit bleibt erhalten. Dazu gehört ein kurzes Runbook.
- **Sicherung:** Datenbank, Medien, Konfiguration und nötige Schlüssel sind zusammen wiederherstellbar, verschlüsselt, außerhalb derselben Ausfallzone. Der Restore eines einzelnen Kunden wird regelmäßig in leerer Umgebung geübt, mit Messung von Zeit und Datenverlust.
- **Vertragsende und Export:** Kunde erhält Domain-Übergabe, Inhalte, Originalbilder und Newsletter-Nachweise in einem nutzbaren Format. Das Verfahren ist beschrieben, bevor der erste Kunde startet.
- **Kostenerfassung:** Im Pilot werden Aufwand je Release, Supportminuten und Dienstkosten erfasst, damit Preise auf Zahlen beruhen. Das Feedback rechnet beispielhaft mit etwa 50 Euro internen Prüfkosten je Kunde und Monat, angenommen bei 20 Minuten je Release und Kunde.

## 11. Typische Abläufe (GEÄNDERT)

- **Neuer Kunde:** Ein Befehl legt alles an. Seite startet gesperrt mit freigegebenem Kern. Design im /editor, Kunde prüft Ansicht und /admin mit dem Vorschau-Passwort, nach Freigabe wird die Sperre ausgeschaltet.
- **Alltägliche Inhaltsänderung:** Kunde ändert im /admin, Änderung ist sofort live, Verlauf und Rücknahme vorhanden.
- **System verbessern:** Kern entsperren, KI baut auf der eigenen Homepage, Test, Release-Paket mit Kompatibilitätstest, Update auf die Prüfseite, Audit, Go.
- **Sonderwunsch:** KI stoppt, wenn der Kern betroffen ist. Entscheidung zwischen Erweiterungspunkt und Template-Erweiterung.

## 12. Phasen (NEU)

1. **Phase 1 – Eigene Homepage zum Laufen bringen (Pilot):** Dreiteilung, PostgreSQL, öffentliche Daten-Schnittstelle mit Zwischenspeicher, Medienablage, Datenklassen-Tabelle (Abschnitt 14), Befehlshülle, /admin mit den fünf Modulen, /editor und Audit auf diese Aufgaben begrenzt, Vorschau-Sperre serverseitig, Release-Pakete mit Rollback-Test, Sicherung mit durchgeführtem Restore, einfache Statusseite und der eine aktive Alarmkanal. AJS ist zurückgestellt.
2. **Phase 2 – Automatisches Anlegen und erster zahlender Kunde:** Kunden-anlegen-Befehl mit API-Anbindungen (Vercel, Resend, Datenbank), DNS-Standardablauf, Newsletter-Zusatzmodul (der erste Interessent wünscht ihn), Wiederanlauf-Probe, Vertragsunterlagen (Auftragsverarbeitung, Leistungsgrenzen), Export beim Vertragsende.
3. **Phase 3 – Skalierung und Bestandsumzüge:** Gestaffelte Updates, Prüfseiten bei Bedarf, visuelle Regressionstests, Umzug von WordPress-Kunden (zum Beispiel Raidboxen), AJS-Migration, Erweiterungspunkte nach echten Sonderwünschen.

## 13a. Erster Kunde: was sofort gebraucht wird (V3, NEU)

1. Domain und DNS als Standardablauf: Wenn möglich verwaltet ein Agentur-Konto mit API die DNS-Zone. Behält der Kunde das DNS, ist das ein benannter Handschritt mit fertiger Anleitung. Bestehende E-Mail-Postfächer des Kunden bleiben unberührt.
2. Kontaktformular als eigener Baustein: Zustellung, Spam-Schutz, Verhalten bei Serverausfall, Aufbewahrung der Eingänge.
3. Kundenkonto für /admin: Einrichtung, Anmeldung, Passwort-Zurücksetzen (braucht Mailversand ab Tag eins), ein oder mehrere Benutzer.
4. Erstbefüllung: Wer Texte, Bilder und Rechtstexte einpflegt und in welchem Format der Kunde sie liefert. Das ist der größte Handarbeitsposten je Kunde.
5. Rechtstexte zum Aufbau: Impressum und Datenschutz nennen Vercel, Resend und den eigenen Server und entstehen aus den Kundendaten.
6. Start: Weiterleitungen alter Adressen, Sitemap, Vorschaubild, geprüfte Aufhebung von noindex.
7. Leistungsbeschreibung in zwei Sätzen und ein vorläufiger Preis mit Anpassungsklausel vor Vertragsschluss.
8. Bestandsmodule (Bewertungen, Social-Links, Service-Erinnerungen): Entscheidung offen, bleiben, entfallen oder Zusatzmodul.

## 14. Datenklassen (V3, NEU, zu füllen in Phase 1)

Zuordnungstabelle mit Ort, Richtung und Veröffentlichungsweg je Datenart: Design-Einstellungen, Haupttexte, Kundeninhalte, Personendaten, Geheimnisse, Medien, Formulareingänge, Newsletter-Abonnenten. Festzulegen sind: Wo liegt die führende Kopie, was überträgt Go, was berührt ein Rollback, was darf auf eine Vorschau kopiert werden.
Offen aus der Gegenlesung: Haupttexte (Hero, Leistungen, Preise) sollen ohne Release änderbar sein, weil eine Preisänderung sonst über Vorschau und Go laufen müsste. Zu klären ist, welche Haupttexte als Kundeninhalt zählen.

## 13. Offene Punkte

- Alarmkanal festlegen (genau ein aktiver Kanal).
- Bestätigung der Vercel-Preise auf der offiziellen Seite.
- Wo die eigene Homepage läuft (Empfehlung: Vercel).
- Reichweite der Vercel-Zugriffsschlüssel (Team oder Projekt): vor der Umsetzung bestätigen. Preise und Resend-Domaingrenzen sind bestätigt (Abschnitt 2a).
- Prüfseite mit echten Daten auf Zeit (Nicks Entscheidung) oder feste Positivliste öffentlicher Inhalte (Empfehlung der Gegenlesung, weil weniger Nachweisaufwand).
- Medienablage: eigener Server oder EU-Objektspeicher.
- Vercel-Build nach Merge der Sicherheitsänderung: Bewertungen und Social-Links kommen künftig nicht mehr aus einer versionierten Datenbank (Nick: alte Datenbank enthielt keine realen Daten).
- Rotation von PIN und QR-Schlüssel (von Nick auf später verschoben), Entscheidung zur Historienbereinigung.
- Ein echter Build- und Starttest des Sicherheitspakets in funktionsfähiger Umgebung.
