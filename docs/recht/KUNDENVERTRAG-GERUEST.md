# Kundenvertrag-Gerüst – Webseite, Betrieb und Pflege, optionales Newsletter-Modul

> **ENTWURF zur anwaltlichen Prüfung – keine Rechtsberatung.** Dieses Gerüst ist eine Arbeitsgrundlage für die anwaltliche Prüfung durch Nicks Anwalt. Es enthält keine Rechtsberatung und keine Aussage über Wirksamkeit oder Vollständigkeit. Alle mit [ANWALT-n] markierten Stellen muss der Anwalt entscheiden, ergänzen oder streichen. Rechtsverweise nur aus der freigegebenen Liste (DSGVO Art. 6, 7, 13, 15 bis 22, 28, 30, 32, 33, 34, 35, 44 ff.; UWG § 7; DDG § 5; TDDDG § 25); alles andere ist mit PRÜFEN markiert. Erfundene Paragrafen, Urteile oder Zahlen wurden nicht verwendet.

Stand: 25.11.2026. Auftraggeberin (Auftragnehmerin): pixel&code, [Firmenname pixel&code], [Rechtsform], [Straße + Hausnummer], [PLZ + Stadt], vertreten durch [Vor- und Nachname]. Kundin/Kunde (Auftraggeber): [Firmenname / Name des Kunden], [Rechtsform], [Straße + Hausnummer], [PLZ + Stadt], vertreten durch [Vor- und Nachname]. Vertragsgegenstand: Erstellung, Betrieb und Pflege einer Kunden-Homepage auf Basis des pixel&code-Baukastens (Astro, Auslieferung über Vercel, Daten in PostgreSQL auf eigenem Server, Mailversand über Resend, Sicherungsspeicher bei EU-Anbieter), mit optionalem Newsletter-Modul.

Grundlagen (gelesen, nichts geändert): docs/WORKFLOW-PLAN.md (Version 3, insb. §§ 2, 4, 8, 10, 12), docs/DATENKLASSEN.md, docs/KUNDEN-ANLEGEN-CHECKLISTE.md, HPSE-NEWSLETTER-KONZEPT-20261125.md, HPSE-DIENSTLEISTER-20261125.md, docs/NEWSLETTER-DATENSCHUTZ.md, docs/NEWSLETTER-API.md, config/legal.json, src/pages/impressum.astro, src/pages/datenschutz.astro, docs/RUNBOOK-WIEDERANLAUF.md, docs/legal-checklist.md.

## § 1 Vertragsparteien und Anlagen

1. Parteien wie oben. Ansprechpartner auf Kundenseite: [Name, E-Mail, Telefon]. Ansprechpartner pixel&code: [Name, E-Mail].
2. Anlagen (je Kunde ausfüllen und beifügen): Anlage 1 Leistungsbeschreibung (aus § 2 konkretisiert: Module, Domain, Designstand); Anlage 2 Preisblatt und Drittanbieterkosten; Anlage 3 Auftragsverarbeitungsvertrag (AVV) mit Unterauftragsverarbeitern (gesondertes Dokument, vgl. docs/NEWSLETTER-DATENSCHUTZ.md § 5); Anlage 4 Datenschutzerklärungs-Bausteine und Einwilligungstexte (Newsletter nur bei Buchung); Anlage 5 Domain- und DNS-Stand (wer verwaltet die Zone); Anlage 6 Übergabeprotokoll-Vorlage. [ANWALT-1]: Reicht diese Anlagenstruktur für eine wirksame Einbeziehung (insb. gegenüber Verbrauchern, PRÜFEN: BGB §§ 305 ff.) oder ist ein anderer Aufbau nötig?

## § 2 Leistungsbeschreibung

1. pixel&code erstellt eine Webseite aus dem Baukasten (Kern plus Kundendaten und Einstellungen, vgl. WORKFLOW-PLAN § 1). Module zum Start: [Team / Galerie / Öffnungszeiten und Kontakt / Hinweis-Banner / Bewertungen / Social-Links / Service-Erinnerungen – Zutreffendes ankreuzen, vgl. WORKFLOW-PLAN §§ 4, 13a]. /admin mit den gebuchten Modulen, /editor nur für pixel&code im Tailnet.
2. Leistungen im Einzelnen: Einrichtung (Vercel-Projekt, Domain-Zuordnung, Datenbank/Schema/Rolle je Kunde, Datenschnittstelle mit kundengebundenem Schlüssel, Resend-Domain und -Schlüssel je Kunde, Vorschau-Sperre, Standard-Einstellungen – vgl. KUNDEN-ANLEGEN-CHECKLISTE); Design im /editor auf Basis freigegebener Standard-Einstellungen; Erstbefüllung nach § 4; Startprüfung und Go (genau der geprüfte Stand wird aktiviert); Betrieb nach § 6; Wartung/Updates nach § 7; Sicherungen nach § 9.
3. Erste Live-Schaltung erst nach Kundenfreigabe auf gesperrter Vorschau und nach Freigabe der Rechtstexte (§ 4 Abs. 3). Sitemap und Aufhebung von noindex gehören zum Go.

## § 3 Abgrenzung (nicht enthalten)

1. Nicht enthalten, sofern nicht ausdrücklich in Anlage 1 vereinbart: Logo- oder Markenerstellung, Textredaktion über Erstbefüllung hinaus, Suchmaschinenoptimierung mit Erfolgszusage, bezahlte Werbung, Social-Media-Pflege, Rechtsberatung, Steuerberatung.
2. Kein freier Kundencode und keine beliebigen Design-Sonderbauten im Standard; echter Sonderwunsch wird als dokumentierter Erweiterungspunkt mit Version und eigenem Test angeboten (vgl. WORKFLOW-PLAN § 1). Automationen und verhaltensbasierte Segmentierung im Newsletter sind nicht enthalten (vgl. Newsletter-Konzept § 1).
3. Der Mailweg für Kontaktformular und Passwort-Zurücksetzen ist Pflicht-Basis in Phase 1; Newsletter-Versand nur bei gebuchtem Modul (§ 8).

## § 4 Mitwirkungspflichten des Kunden

1. **Inhalte:** Der Kunde liefert Texte und Bilder in vereinbartem Format ([Format, z. B. Textdokument + Originalbilder]) bis [Datum]. Er bestätigt die gesperrte Vorschau (Inhalte, /admin, Rechte, Formulare) schriftlich (E-Mail genügt, [ANWALT-2]: Formfrage – genügt Textform oder ist eine andere Form nötig, PRÜFEN). Ohne Freigabe kein Go.
2. **Rechtstexte:** Impressum (DDG § 5) und Datenschutzerklärung bleiben Kundeninhalte. pixel&code befüllt sie aus den Kundendaten (Vorbild config/legal.json mit Platzhaltern sowie impressum.astro/datenschutz.astro) und nennt die eingesetzten Dienste (Vercel, Resend, eigener Server, Sicherungsspeicher – vgl. Datenschutz-Bausteine in NEWSLETTER-DATENSCHUTZ.md § 3). Die fachkundige Prüfung (Anwalt oder aktueller Generator, vgl. legal-checklist.md) organisiert [der Kunde / pixel&code gegen Vergütung – wählen und in Anlage 1 festhalten]. [ANWALT-3]: Wer trägt das Restrisiko eines fehlerhaften Rechtstextes, und welche Klausel bildet das wirksam ab?
3. **Bild- und Materialrechte:** Der Kunde versichert, dass er alle gelieferten Texte, Bilder, Logos und sonstigen Materialien selbst nutzen und dafür die erforderlichen Rechte (einschließlich abgebildeter Personen und Rechte Dritter) einräumen darf. Nachweise (Lizenzen, Einwilligungen) hält er vor und legt sie auf Anforderung vor. Er stellt pixel&code von Ansprüchen Dritter wegen solcher Materialien frei. [ANWALT-4]: Freistellungsklausel, Umfang und Deckelung bitte prüfen und formulieren (PRÜFEN: insb. gegenüber Verbrauchern).
4. **Zugänge und Entscheidungen:** Der Kunde benennt Ansprechpartner, richtet angefragte Zugänge (z. B. DNS nach Anleitung, falls er sein DNS behält – vgl. CHECKLISTE) fristgerecht ein und meldet Störungen mit Zeitpunkt, Symptom und betroffener Adresse. Verzögerte Mitwirkung verschiebt Termine entsprechend; Mehraufwand wird nach Anlage 2 vergütet. [ANWALT-5]: Ist eine konkrete Mitwirkungsfrist- und Abnahmefiktionsklausel gewünscht (PRÜFEN)?

## § 5 Nutzungsrechte

1. Mit vollständiger Zahlung der vereinbarten Vergütung erhält der Kunde an den für ihn erstellten Seiteninhalten und Einstellungen (Texte, Bilder des Kunden, Konfiguration seiner Seite) das [einfache / ausschließliche – wählen] Nutzungsrecht für die Vertragslaufzeit und darüber hinaus zum Betrieb seiner Website. [ANWALT-6]: Bitte Nutzungsart, Übertragbarkeit und Dauer entscheiden; genügt das einfache Recht oder ist die Übertragung zur Domain-Übergabe beim Ausstieg nötig?
2. Der Baukasten-Kern, Vorlagen, /editor und Audit bleiben Eigentum bzw. Know-how von pixel&code; der Kunde erhält daran nur das zum Betrieb seiner Seite erforderliche, nicht übertragbare Nutzungsrecht. Kein Anspruch auf Herausgabe von Quellcode des Kerns, der Befehlshülle oder interner Werkzeuge. Originalbilder des Kunden erhält er nach § 12 zurück.
3. Rechte Dritter (z. B. Schriften, Karten, Plugins, Stockmaterial) richten sich nach deren Lizenz; Kosten und Grenzen stehen in Anlage 2. [ANWALT-7]: Muss die Rechtekette für Drittmaterialien genauer geregelt werden (PRÜFEN)?

## § 6 Betrieb und Verfügbarkeitsaussage (ehrlich, ohne 24/7-Zusage)

1. **Keine Rund-um-die-Uhr-Zusage.** pixel&code ist ein Einzelentwickler ohne Vertretung (vgl. WORKFLOW-PLAN § 10). Es wird keine durchgehende Erreichbarkeit, keine feste Reaktionszeit rund um die Uhr und keine verlustfreie Wiederherstellung zu jedem Zeitpunkt zugesagt. Reaktions- und Arbeitszeiten: [z. B. Mo–Fr [Uhrzeit], ausgenommen Feiertage in [Bundesland]; Weg zur Meldung: [E-Mail/Telefon]].
2. **Betriebsweise:** Die Kundenseite wird aus dem Vercel-Zwischenspeicher ausgeliefert; fällt der eigene Server aus, kann die Seite für Besucher lesbar bleiben, Formulare und /admin-Speichern fallen dann aus (vgl. WORKFLOW-PLAN §§ 2, 8). Es wird keine erfolgreiche Übermittlung vorgetäuscht.
3. **Wiederherstellung:** Bestmögliche Wiederherstellung nach Stand der Sicherungen; ein bestimmter Datenstand wird nicht garantiert. Datenverlust gegenüber dem letzten belegten Stand wird gemessen und offengelegt (vgl. RUNBOOK-WIEDERANLAUF.md). Wiederanlauf-Ziele (vor dem ersten Kunden messen, je Kunde in Anlage 1 eintragen): Zielzeit bis zur wieder lesbaren Seite ab Erkennung: [____]; Zielzeit bis zur Wiederherstellung der Schreibfunktionen: [____]; maximal tolerierbarer Datenverlust (Zeitspanne): [____]; Intervall der Einzelkunden-Restoreprobe: [____]; Verantwortliche Person / Kontaktweg während der verfügbaren Zeiten: [____]. Solange keine Werte eingetragen sind, gelten sie als nicht vereinbart. [ANWALT-8]: Bitte prüfen, ob diese Zielwerte als unverbindliche Ziele oder als verbindliche Service-Level formuliert werden sollen (empfohlen: unverbindlich, ohne Vertragsstrafe).

## § 7 Wartung und Updates

1. pixel&code pflegt Kern, Sicherheit und Kompatibilität und rollt Updates gestaffelt aus (vgl. WORKFLOW-PLAN § 9). Go befördert genau den geprüften Stand; Inhalte werden dabei nicht überschrieben, ein Rollback des Seitenstands holt keine alten Inhalte zurück.
2. Datenbankänderungen laufen in kleinen, kompatiblen Schritten; ein Rückweg auf genau eine Vorversion ist nur bei nachgewiesener Kompatibilität möglich, sonst nur Korrektur nach vorn (vgl. WORKFLOW-PLAN § 8, RUNBOOK). Der Kunde wird über sicherheitsrelevante Updates und erforderliche Mitwirkung informiert.
3. Inhaltsänderungen des Kunden im /admin gehen sofort live (mit Verlauf und Rücknahme einzelner Änderungen); sie brauchen keine technische Freigabe. [ANWALT-9]: Ändert „sofort live" etwas an Prüf- oder Abnahmepflichten (PRÜFEN)?

## § 8 Newsletter-Modul (nur bei Buchung, gegen Aufpreis)

1. **Umfang:** Anmeldeformular mit Double-Opt-in, Abonnentenverwaltung, Sperrliste, feste Verfassen-Maske (Betreff, Vorschautext, Überschrift, Text, ein Bild, ein Knopf), Testversand an die eigene Kundenadresse, Sendebestätigung als eigener Schritt, Versand über Resend-Broadcast, Zustellstatistik. Nicht enthalten: Automationen, verhaltensbasierte Segmentierung, Verkauf von Listen, Import fremder Listen ohne nachgewiesene Einwilligung (vgl. Newsletter-Konzept §§ 1, 3).
2. **Rollen und Datenschutz:** Der Kunde ist Verantwortlicher für seine Abonnenten; pixel&code ist Auftragsverarbeiter und braucht je Kunde einen AVV (Anlage 3) vor Modulstart. Unterauftragsverarbeiter: Resend (Versand), Vercel (Auslieferung), Sicherungsspeicher (vgl. NEWSLETTER-DATENSCHUTZ.md §§ 4–5, DIENSTLEISTER-Übersicht). Rechtsgrundlage für den Versand ist die Einwilligung der Abonnenten (vgl. DSGVO Art. 6 und Art. 7; [ANWALT-10]: Einwilligungstexte und Widerrufsbelehrung bitte prüfen). Direktwerbung per E-Mail nur mit wirksamer Einwilligung (vgl. UWG § 7; [ANWALT-10] mitprüfen). Betroffenenrechte (DSGVO Art. 15 bis 22), Informationspflichten (Art. 13), Verzeichnis (Art. 30) sowie Sicherheit und Meldepflichten (Art. 32, 33, 34) werden in Anlage 3/4 konkretisiert; internationale Übermittlungen nur mit geeigneten Garantien (Art. 44 ff.; [ANWALT-11]: Drittlandlage von Vercel/Resend und nötige Klauseln bitte prüfen, PRÜFEN).
3. **Pflichten des Kunden:** Rechtmäßige Inhalte, geprüfte Einwilligungstexte und Datenschutzerklärung, verifizierte Absenderdomain, Impressum in der Fußzeile jeder Kampagne (vgl. Newsletter-Konzept § 9 und NEWSLETTER-DATENSCHUTZ.md § 3). Der Kunde trägt die Verantwortung für Inhalte, Frequenz und Empfängerkreis.
4. **Versandgrenzen:** Kontingent und Ratenbegrenzung gelten pro Team (Agentur-Konto); ein Kunde kann andere ausbremsen. Je Kunde gilt: [max. Kampagnen pro Monat: ____; max. Empfänger je Kampagne: ____; max. Mails pro Tag: ____]. Bei Überschreitung wird der Versand verweigert (vgl. NEWSLETTER-API § 3.5: Fehler 429/423). [ANWALT-12]: Bitte prüfen, ob einseitige Anpassung der Grenzen bei Kapazitätsengpässen zulässig sein soll und mit welcher Frist.
5. **Sperrrecht bei Missbrauch:** Bei harten Rückläufern, Beschwerden, Missbrauchsverdacht oder Gefahr für die Team-Reputation darf pixel&code den Versand dieses Kunden sofort stoppen (Stopp-Schalter, vgl. Newsletter-Konzept § 4 und NEWSLETTER-API §§ 3.6, 3.8) und geplante Kampagnen anhalten, bis der Kunde die Ursache beseitigt. Der Kunde wird unverzüglich informiert. [ANWALT-13]: Voraussetzungen, Informationspflicht und Haftungsfolgen des Stopps bitte prüfen (PRÜFEN: Androhung/Abmahnung erforderlich?).
6. **Nachweise und Löschung:** Einwilligungsnachweise (Version, Zeitpunkte, Quelle) und Sperrliste bleiben führend in der Kunden-PostgreSQL; Resend ist nur Versandweg und Spiegel (vgl. NEWSLETTER-API, DATENKLASSEN.md). Unbestätigte Anmeldungen werden nach [Frist, Vorschlag 7 Tage] gelöscht; Sperrliste und Nachweise nur, solange Sperre bzw. Nachweisbedarf bestehen (konkrete Fristen legt der Anwalt je Kunde fest – vgl. NEWSLETTER-DATENSCHUTZ.md § 6). [ANWALT-14]: Fristen und Rechtsgrundlage der Sperrlisten-Speicherung bitte festlegen (PRÜFEN).

## § 9 Sicherungen

1. Gesichert werden Datenbank, Medien, Konfiguration und nötige Schlüssel so, dass sie zusammen wiederherstellbar sind; die Sicherung liegt verschlüsselt außerhalb derselben Ausfallzone und ist vor Löschung über den Betreiberzugang geschützt (vgl. WORKFLOW-PLAN §§ 2, 10). Der Einzelkunden-Restore wird regelmäßig in leerer Umgebung geübt und gemessen (§ 6 Abs. 3).
2. Sicherungen sind kein Archiv gelöschter Daten; gelöschte Inhalte laufen mit dem Backup-Verfall aus. Konkreter Verfall: [____]. [ANWALT-15]: Bitte Backup-Verfall und Verhältnis zu Löschpflichten (DSGVO Art. 15 bis 22) prüfen (PRÜFEN).

## § 10 Vergütung und Zusatzkosten

1. Einmalig: [Erstellung/Ersteinrichtung: ____ EUR netto/zzgl. USt.]. Laufend: [Betrieb und Pflege: ____ EUR pro Monat/Quartal/Jahr netto/zzgl. USt.]. Newsletter-Modul (optional): [____ EUR einmalig + ____ EUR pro Monat, inkl. Versandvolumen bis [____] Mails/Monat; Mehrversand: [____]]. Alle Preise verstehen sich zuzüglich USt., sofern USt. anfällt. [ANWALT-16]: Preis- und Preisanpassungsklausel (vorläufiger Preis vor Vertragsschluss mit Anpassungsklausel, vgl. WORKFLOW-PLAN § 13a) bitte wirksam formulieren (PRÜFEN).
2. **Drittanbieterkosten werden weitergegeben:** Vercel-, Resend-, Domain-, DNS-, Sicherungs- und Überwachungskosten sowie Lizenzen Dritter trägt der Kunde nach tatsächlichem Aufwand bzw. anteilig (Team-Kontingente anteilig nach [Schlüssel: ____]) zuzüglich [____ % Handling / pauschal ____ EUR]. Preiserhöhungen der Anbieter werden weitergegeben; pixel&code kündigt sie [mit ____ Wochen Vorlauf] an. [ANWALT-16] gilt mit.
3. Mehraufwand durch verzögerte Mitwirkung, nachträgliche Änderungswünsche oder Störungsbeseitigung aus Kundensphäre wird nach [Stundensatz ____ EUR] vergütet. Zahlungsziel: [____ Tage]; Verzugszinsen und Zurückbehaltungsrechte nach [ANWALT-17]: bitte prüfen und ergänzen (PRÜFEN).

## § 11 Laufzeit und Kündigung

1. Mindestlaufzeit: [____ Monate ab Go]. Verlängerung: [um jeweils ____ Monate, wenn nicht mit Frist von ____ Wochen zum Laufzeitende gekündigt wird]. Kündigung in Textform an [Adresse/E-Mail]. [ANWALT-18]: Kündigungsfristen, Form und automatische Verlängerung bitte prüfen (PRÜFEN, insb. gegenüber Verbrauchern).
2. Außerordentliche Kündigung aus wichtigem Grund bleibt vorbehalten ([ANWALT-18] mitprüfen, PRÜFEN). Bis zur Abschaltung (Zugangssperre bzw. Domain-Übergabe nach § 12) bleibt die Vergütung anteilig geschuldet. Noch offene Drittkosten werden abgerechnet.
3. Nach Kündigung gelten Nachwirkungspflichten aus §§ 12 (Rückgabe) und 14 (Geheimhaltung) fort.

## § 12 Datenrückgabe und Vertragsende (mit Ausstiegsplan)

1. **Export der Inhalte:** Der Kunde erhält Inhalte und Einstellungen seiner Seite in einem nutzbaren Format ([z. B. strukturierter Export (JSON/CSV) der Texte und Einstellungen, Medien als Originaldateien, Newsletter: bestätigte Adressen mit Einwilligungsnachweisen – vgl. NEWSLETTER-API § 3.2 und DATENKLASSEN.md]). Umfang und Format stehen in Anlage 6. Personenbezogene Daten Dritter (Abonnenten, Formulareingänge) erhält nur der Kunde als Verantwortlicher, protokolliert.
2. **Domain-Übergabe:** Domains des Kunden werden auf seinen Registrar bzw. seine Zone übertragen (Auth-Codes, Umzug der DNS-Einträge inkl. Resend-Einträge nach Anleitung); bestehende Postfächer bleiben unberührt (vgl. WORKFLOW-PLAN § 13a, CHECKLISTE). Zielregistrar und -verantwortlicher: [____]. Frist: [____ Tage nach Vertragsende].
3. **Löschung beim Anbieter:** Nach bestätigter Übergabe löscht pixel&code Kundendaten aus Produktivsystemen innerhalb von [30 Tagen – vom Anwalt festzulegen] und aus Sicherungen mit dem Backup-Verfall; Einwilligungsnachweise und Sperrlisten nur nach § 8 Abs. 6 / Anlage 3. Löschung wird bestätigt. [ANWALT-19]: Löschfristen und Nachweis gegenüber Betroffenenrechten (DSGVO Art. 15 bis 22) bitte festlegen (PRÜFEN).
4. Der technische Ablauf steht in Anhang A; er ist Bestandteil dieses Gerüsts.

## § 13 Haftungsbegrenzung

1. [ENTWURF – vom Anwalt vollständig zu prüfen und zu formulieren:] pixel&code haftet unbegrenzt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt, der Höhe nach auf [____ EUR oder ____ Monatsvergütungen – vom Anwalt festzulegen]. Im Übrigen ist die Haftung ausgeschlossen. [ANWALT-20]: Bitte vollständig prüfen, insb. Zulässigkeit und Höhe gegenüber Unternehmern vs. Verbrauchern, Verhältnis zu Drittanbieter-Ausfällen (Vercel/Resend) und zu unentgeltlichen Probeleistungen (PRÜFEN).
2. Für Ausfälle und Fehler von Drittanbietern (Vercel, Resend, DNS-, Sicherungs-, Überwachungsanbieter) haftet pixel&code nur bei eigenem Verschulden (z. B. Fehlkonfiguration); im Übrigen wird auf deren Verfügbarkeit verwiesen. Keine Verfügbarkeitszusage über § 6 hinaus.

## § 14 Geheimhaltung

1. Beide Seiten behandeln vertrauliche Informationen (Zugangsdaten, Schlüssel, Kundendaten, interne Preise und Verfahren) vertraulich und geben sie nur an befugte Personen weiter. Schlüssel und Geheimnisse stehen nie in Berichten, Logs oder KI-Kontexten (vgl. CHECKLISTE, DATENKLASSEN.md). [ANWALT-21]: Dauer der Geheimhaltung nach Vertragsende ([____ Jahre]), Vertragsstrafe und Ausnahmen (z. B. AVV-Prüfrechte, Behörden) bitte prüfen (PRÜFEN).
2. Der Kunde hält seine /admin-Zugänge geheim, meldet Missbrauch sofort und trägt die Folgen verspäteter Meldung nach [ANWALT-21] (PRÜFEN).

## § 15 Unternehmer oder Verbraucher

[ANWALT-22]: Diese Abgrenzung entscheidet der Anwalt. Klärungsbedarf: (a) Schließt pixel&code Verträge nur mit Unternehmern (B2B) oder auch mit Verbrauchern (B2C)? (b) Falls B2C möglich: Widerrufsbelehrung, Widerrufsfolgen, Muster-Widerrufsformular, Informationspflichten und AGB-Einbeziehung (PRÜFEN: BGB §§ 305 ff., 312 ff., 355 ff.) ergänzen; Haftungs-, Kündigungs- und Preisanpassungsklauseln (§§ 10, 11, 13) verbraucherfest fassen. (c) Falls nur B2B: geeignete Kundendefinition und Verfahren bei Gründern/Wechsel der Eigenschaft. Bis zur Entscheidung gilt dieses Gerüst als B2B-Entwurf ohne Widerrufsregelung.

## § 16 Schlussbestimmungen

1. Änderungen und Ergänzungen bedürfen der Textform (E-Mail genügt, [ANWALT-23]: Formfrage prüfen, PRÜFEN). Mündliche Nebenabreden bestehen nicht.
2. Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts (PRÜFEN). Gerichtsstand (nur bei Unternehmern wirksam): [Ort, z. B. [____]] ([ANWALT-23] mitprüfen). Erfüllungsort: [____].
3. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Rest wirksam; die Lücke schließen die Parteien durch eine wirksame Regelung, die dem Gewollten am nächsten kommt ([ANWALT-23]: Salvatorische Klausel prüfen, PRÜFEN).

---

## Anhang A – Ausstiegs- und Übergabeablauf (technisch, kurz)

Voraussetzung: Kündigung bzw. vereinbartes Vertragsende, Ansprechpartner und Zielsystem des Kunden stehen fest. Während des Ablaufs keine neuen Kampagnen starten; Stopp-Schalter bleibt bis zur Übergabe verfügbar.

1. **Bestand aufnehmen:** Kundenkennung, Domain(s), Vercel-Projekt, Datenbank/Schema/Rolle, Resend-Domain und -Schlüssel, Sicherungsspeicher-Umfang, /admin-Benutzer. Exportumfang nach § 12 mit dem Kunden abstimmen und protokollieren.
2. **Exporte erzeugen (protokolliert, nur an den Kunden):** Inhalte und Einstellungen als strukturierter Export; Medien als Originaldateien mit Referenzliste (vgl. DATENKLASSEN.md: 30-Tage-Vorschlag nach Entfernen der letzten Referenz); Newsletter: bestätigte Adressen mit vollständigem Einwilligungsnachweis (Version, Quelle, Zeitpunkte, Statuswechsel – vgl. NEWSLETTER-API § 3.2; der bestehende CSV-Export ist dafür zu erweitern); Kampagnen- und Zustellnachweise nach Anlage 3. Export-Dateien nach Übergabe beim Anbieter löschen, Protokoll (wer, wann, Umfang) bleibt.
3. **Domain übergeben:** Auth-Codes/Registrar-Wechsel bzw. DNS-Delegation nach Anlage 5; Web- und Resend-Einträge (SPF, DKIM, DMARC) am Ziel prüfen, Zertifikat prüfen, externe Auflösung abwarten. Postfächer bleiben unangetastet.
4. **Zugänge trennen:** /admin-Benutzer des Kunden nach Übergabefrist sperren; kundengebundene Schlüssel (Datenschnittstelle, Resend-Schlüssel) widerrufen und ersetzen bzw. löschen; Vorschau-Sperre bis zur Abschaltung aktiv lassen. Keine fremden Kundendaten berühren; Rückwege aus der CHECKLISTE beachten.
5. **Abschalten und löschen:** Vercel-Projekt und Resend-Domain des Kunden nach bestätigter Übergabe entfernen (nur eindeutig zugeordnete Ressourcen nach Prüfung); Produktivdaten nach § 12 Abs. 3 löschen; Löschung bestätigen. Sicherungen laufen mit dem Backup-Verfall aus.
6. **Protokoll:** Übergabeprotokoll (Anlage 6) mit Datum, Exportumfang, Domain-Ziel, Löschbestätigung und offenen Resten; beide Seiten zeichnen. [ANWALT-24]: Bitte prüfen, ob Übergabefristen, Mitwirkungspflichten und Zurückbehaltungsrechte bis zur Zahlung offener Beträge ergänzt werden sollen (PRÜFEN).

## Anhang B – Anwaltsfragen (gesamt)

- [ANWALT-1] Anlagenstruktur und wirksame Einbeziehung (B2B/B2C, PRÜFEN: BGB §§ 305 ff.) – § 1.
- [ANWALT-2] Form von Freigaben und Erklärungen (Textform ausreichend?) – § 4 Abs. 1 (PRÜFEN).
- [ANWALT-3] Risiko fehlerhafter Rechtstexte (Impressum DDG § 5, Datenschutz DSGVO Art. 13) – § 4 Abs. 2.
- [ANWALT-4] Freistellung für Bild-/Materialrechte, Umfang und Deckelung – § 4 Abs. 3.
- [ANWALT-5] Mitwirkungsfristen und Abnahmefiktion gewünscht? – § 4 Abs. 4 (PRÜFEN).
- [ANWALT-6] Nutzungsart, Übertragbarkeit und Dauer der Kundenrechte – § 5 Abs. 1.
- [ANWALT-7] Rechtekette für Drittmaterialien – § 5 Abs. 3 (PRÜFEN).
- [ANWALT-8] Wiederanlauf-Ziele: unverbindliche Ziele oder verbindliche Service-Level? – § 6 Abs. 3.
- [ANWALT-9] Folgen von „Inhalte gehen sofort live" für Prüfung/Abnahme – § 7 Abs. 3 (PRÜFEN).
- [ANWALT-10] Einwilligungstexte, Widerrufsbelehrung (DSGVO Art. 6, 7) und Direktwerbung (UWG § 7) – § 8 Abs. 2.
- [ANWALT-11] Drittlandlage Vercel/Resend, Garantien (DSGVO Art. 44 ff.), AVV-Klauseln (Art. 28, 30, 32–35) – § 8 Abs. 2.
- [ANWALT-12] Einseitige Anpassung der Versandgrenzen – § 8 Abs. 4.
- [ANWALT-13] Voraussetzungen und Folgen des Versand-Stopps bei Missbrauch – § 8 Abs. 5 (PRÜFEN).
- [ANWALT-14] Fristen und Rechtsgrundlage der Sperrlisten- und Nachweis-Speicherung – § 8 Abs. 6 (PRÜFEN).
- [ANWALT-15] Backup-Verfall im Verhältnis zu Löschpflichten (DSGVO Art. 15 bis 22) – § 9 Abs. 2 (PRÜFEN).
- [ANWALT-16] Preis- und Preisanpassungsklausel inkl. Drittkosten-Weitergabe – § 10 Abs. 1–2 (PRÜFEN).
- [ANWALT-17] Zahlungsziel, Verzug und Zurückbehaltung – § 10 Abs. 3 (PRÜFEN).
- [ANWALT-18] Kündigungsfristen, Form, Verlängerung, außerordentliche Kündigung – § 11 (PRÜFEN).
- [ANWALT-19] Löschfristen und -nachweis nach Vertragsende – § 12 Abs. 3 (PRÜFEN).
- [ANWALT-20] Haftungsklausel vollständig, B2B/B2C-Differenzierung, Drittanbieter – § 13 (PRÜFEN).
- [ANWALT-21] Geheimhaltungsdauer, Vertragsstrafe, Ausnahmen, Folgen verspäteter Missbrauchsmeldung – § 14 (PRÜFEN).
- [ANWALT-22] Unternehmer- oder Verbrauchervertrag, Widerrufsrecht und AGB-Einbeziehung – § 15 (PRÜFEN: BGB §§ 305 ff., 312 ff., 355 ff.).
- [ANWALT-23] Form-, Rechtswahl-, Gerichtsstands- und Salvatorische Klausel – § 16 (PRÜFEN).
- [ANWALT-24] Übergabefristen, Mitwirkung und Zurückbehaltung im Ausstieg – Anhang A (PRÜFEN).

## Anhang C – Platzhalter- und Anlagenliste (je Kunde ausfüllen)

Parteien- und Kontaktdaten, Module (Anlage 1), Preise und USt. (Anlage 2), AVV mit Unterauftragsverarbeitern Resend/Vercel/Sicherungsspeicher (Anlage 3), Einwilligungs- und Datenschutztexte (Anlage 4), Domain-/DNS-Stand (Anlage 5), Wiederanlauf-Ziele (§ 6 Abs. 3), Versandgrenzen (§ 8 Abs. 4), Backup-Verfall (§ 9), Kündigungsfristen und -form (§ 11), Löschfristen (§ 12), Haftungshöchstgrenze (§ 13), Geheimhaltungsdauer (§ 14), Gerichtsstand/Erfüllungsort (§ 16), Übergabeprotokoll (Anlage 6). Alle Werte in eckigen Klammern sind vor Unterschrift zu ersetzen; leere Fristen und Beträge gelten als nicht vereinbart.

*Quellen: WORKFLOW-PLAN.md (V3), DATENKLASSEN.md, KUNDEN-ANLEGEN-CHECKLISTE.md, RUNBOOK-WIEDERANLAUF.md, legal-checklist.md, HPSE-NEWSLETTER-KONZEPT-20261125.md, HPSE-DIENSTLEISTER-20261125.md, NEWSLETTER-DATENSCHUTZ.md, NEWSLETTER-API.md, config/legal.json, impressum.astro, datenschutz.astro. Alle Rechtsverweise nur aus der Auftragsliste; übrige Rechtsfragen sind als PRÜFEN bzw. [ANWALT-n] gekennzeichnet.*
