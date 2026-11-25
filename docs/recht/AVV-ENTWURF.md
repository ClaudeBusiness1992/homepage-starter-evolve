# Auftragsverarbeitungsvertrag (AVV) — ENTWURF zur anwaltlichen Prüfung

> **Status: Entwurf zur anwaltlichen Prüfung, keine Rechtsberatung.**
> Dieser Text ist eine Arbeitsgrundlage für die Prüfung durch Nicks Anwalt. Er ersetzt keine Rechtsberatung. Rechtsverweise wurden nur aufgenommen, soweit sie im Auftrag als sicher bekannt vorgegeben waren (DSGVO Art. 6, 7, 13, 15 bis 22, 28, 30, 32, 33, 34, 35, 44 ff.; UWG § 7; DDG § 5; TDDDG § 25). Alles andere ist mit **PRÜFEN** und einer nummerierten Markierung **[ANWALT-n]** gekennzeichnet. Der Anwalt prüft, korrigiert und gibt frei.
>
> Abkürzungen: AV = Auftraggeber/Kunde (Verantwortlicher), AN = Auftragnehmer/pixel&code (Auftragsverarbeiter).

**Vertragsparteien (Platzhalter — je Kunde ausfüllen):**

- Auftraggeber (Verantwortlicher): [Kundenname, Rechtsform], [Straße + Hausnummer], [PLZ + Stadt], vertreten durch [Vor- und Nachname, Funktion], Kontakt für Weisungen und Datenschutz: [Name, E-Mail, Telefon]
- Auftragnehmer (Auftragsverarbeiter): [pixel&code — Firmenname, Rechtsform], [Straße + Hausnummer], [PLZ + Stadt], vertreten durch [Vor- und Nachname, Funktion], Kontakt: [E-Mail, Telefon]
- Datum / Fassung: [Datum], Fassung [Versionsnummer, z. B. v0.1]
- Zugehöriger Hauptvertrag: [Bezeichnung Hauptvertrag/Leistungsbeschreibung, Datum, Angebotsnummer]

**Grundlagen (gelesen, unverändert gelassen):** docs/WORKFLOW-PLAN.md (V3, 25.11.2026), docs/DATENKLASSEN.md, docs/KUNDEN-ANLEGEN-CHECKLISTE.md, HPSE-Newsletter-Konzept (25.11.2026), HPSE-Dienstleister-Übersicht (25.11.2026), docs/NEWSLETTER-DATENSCHUTZ.md, docs/NEWSLETTER-API.md, config/legal.json, src/pages/impressum.astro, src/pages/datenschutz.astro. Technische Tatsachen (Anbieter, Orte, Maßnahmen) stammen aus diesen Unterlagen; rechtliche Wertungen trifft der Anwalt.

---

## § 1 Gegenstand und Dauer der Verarbeitung

1. AN betreibt für AV eine Kunden-Homepage im Baukasten-Modell (Astro, Auslieferung über Vercel, Datenhaltung in PostgreSQL auf eigenem Server von AN, Mailversand über Resend, Sicherungsspeicher bei EU-Anbieter) und erbringt je nach Buchung Pflege-, Hosting- und Betriebsleistungen sowie optional das Newsletter-Modul. Einzelheiten regelt der Hauptvertrag.
2. AN verarbeitet personenbezogene Daten dabei ausschließlich im Auftrag und nach Weisung von AV im Sinne von Art. 28 DSGVO.
3. Dauer: Die Verarbeitung beginnt mit [Datum/Vertragsbeginn] und endet mit Beendigung des Hauptvertrags, sofern dieser AVV nichts Abweichendes regelt. Nach Vertragsende gelten § 10 (Löschung und Rückgabe) und vereinbarte Aufbewahrungs- und Nachweisfristen fort, bis sie erfüllt sind **[ANWALT-1]**.
4. Kündigungs- und Verlängerungsregeln: **[ANWALT-2]** (Anwalt prüft, ob Verweis auf Hauptvertrag genügt oder eigene Kündigungsfrist nötig ist; unbefristet mit Koppelung an Hauptvertrag als Vorschlag).

## § 2 Art und Zweck der Verarbeitung

1. Arten der Verarbeitung (nicht abschließend, technisch beschrieben): Hosten und Ausliefern der Website (inkl. Zwischenspeicher/Cache), Speichern und Abrufen von Inhalten und Einstellungen in der Kundendatenbank, Entgegennahme und Zustellung von Kontaktformular-Eingängen, Anmelde-, Bestätigungs-, Versand- und Abmeldeprozesse des Newsletters (Double-Opt-in mit Nachweis), Verwaltung von Admin-Benutzern und Sitzungen, Protokollierung (Server-Logs, Ratenbegrenzung, Missbrauchsschutz), Sicherung (Backup) und Wiederherstellung, Support und Störungsbehebung. Kein Tracking ohne gesonderte Einwilligung (PRÜFEN im Einzelfall; TDDDG § 25 beachten) **[ANWALT-3]**.
2. Zwecke: Bereitstellung, Betrieb und Absicherung der Kunden-Homepage; Abwicklung der vom Besucher gewünschten Kommunikation (Kontaktformular, Passwort-Zurücksetzen für /admin); bei gebuchtem Newsletter-Modul: Versand des Kunden-Newsletters auf Grundlage der Einwilligungen, die AV verantwortet (UWG § 7 beachten). AV entscheidet über Zwecke und Mittel im Sinne der Verantwortlichkeit; AN trifft keine eigenen Zweckentscheidungen und wertet die Daten nicht für eigene Zwecke aus.
3. Rechtsgrundlagen der Verarbeitung durch AV (Hinweis, keine Festlegung durch AN): z. B. Einwilligung (Art. 6 Abs. 1 lit. a DSGVO; Newsletter zusätzlich Art. 7 DSGVO und UWG § 7), Vertrag (Art. 6 Abs. 1 lit. b DSGVO), berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO, z. B. sichere Bereitstellung). Informationspflichten gegenüber Betroffenen nach Art. 13 DSGVO erfüllt AV in seiner Datenschutzerklärung; AN unterstützt nach § 8. Konkrete Zuordnung je Verarbeitungstätigkeit prüft der Anwalt **[ANWALT-4]**.
4. Orte der Verarbeitung: Funktionen und Datenbank in der EU als Ziel (WORKFLOW-PLAN § 2). Tatsächliche Verarbeitungsorte je Unterauftragsverarbeiter siehe Anlage 1; Drittlandfragen siehe § 12 (jeweils PRÜFEN).

## § 3 Kategorien betroffener Personen und Datenarten

1. **Websitebesucher:** technische Zugriffsdaten (z. B. IP-Adresse, Browser, Betriebssystem, Uhrzeit, Referrer, Hostname — vgl. Server-Log-Liste in datenschutz.astro), Cookie-/Einwilligungsstatus (TDDDG § 25), ggf. Formulareingaben. Aufbewahrung und Protokolldauer: Vorschlag aus DATENKLASSEN.md, rechtlich zu bestätigen **[ANWALT-5]**.
2. **Newsletter-Abonnenten (nur bei gebuchtem Modul):** E-Mail-Adresse, ggf. Vorname, Status (unbestätigt/bestätigt/abgemeldet/gesperrt), Zeitpunkte (Anmeldung, Bestätigung, Abmeldung), Einwilligungstext mit Version, Quelle (Seite/Formular), gekürzte Herkunftskennung (Missbrauchsschutz), Kampagnenzuordnung und Empfängerprüfsumme, Zustellereignisse (z. B. Rückläufer, Beschwerden), Sperrlistenmerkmale (Adresse oder Prüfwert, Grund, Zeitpunkt). Details und Löschfristen-Vorschläge (z. B. unbestätigte Anmeldungen 7 Tage) siehe NEWSLETTER-DATENSCHUTZ.md Abschnitt 5–6; alle Fristen als Vorschlag, Festlegung durch Anwalt und je Kunde **[ANWALT-6]**.
3. **Kontaktformular (Absender/Nachrichten):** Name, E-Mail-Adresse, Nachrichteninhalt, Zeitpunkte, ggf. Zustellnachweise. Speicherort (Datenbank-Ablage vs. nur Mail-Postfach) und Löschfrist (Vorschlag DATENKLASSEN.md: 30 Tage nach Bearbeitung) sind noch festzulegen **[ANWALT-7]**.
4. **Nutzer des Admin-Bereichs (/admin, Kundenseite):** Benutzerkennung, Rolle/Rechte, Sitzungsdaten, Anmelde- und Sperrprotokolle (z. B. Login-Versuche mit IP), Passwort-Zurücksetzen-Nachweise. Sitzungsdauer- und Protokollfristen (Vorschlag DATENKLASSEN.md) rechtlich und technisch bestätigen **[ANWALT-8]**.
5. Besondere Kategorien personenbezogener Daten sind nicht vorgesehen. Sollte AN feststellen, dass solche Daten (PRÜFEN: genaue Abgrenzung) verarbeitet werden sollen, informiert AN AV unverzüglich und verarbeitet erst nach dokumentierter Weisung und Freigabe **[ANWALT-9]**.
6. Datenformat und -volumen je Kunde: [Beschreibung oder Verweis auf DATENKLASSEN.md einfügen]. Aktualisierung bei neuen Modulen (z. B. Bewertungen, Service-Erinnerungen) nur per AVV-Nachtrag **[ANWALT-10]**.

## § 4 Weisungen

1. AN verarbeitet Daten nur auf dokumentierte Weisung von AV (Art. 28 DSGVO). Der Hauptvertrag, dieser AVV, die Anlagen sowie dokumentierte Einzelweisungen (z. B. Support-Tickets, E-Mails an [Weisungsadresse]) gelten als Weisungen. Mündliche Weisungen bestätigt AV unverzüglich in Textform; AN darf bis dahin nur das zur Sicherheit Erforderliche tun (PRÜFEN: genaue Formulierung) **[ANWALT-11]**.
2. Weisungskette: AV → AN → Unterauftragsverarbeiter. AN gibt Weisungen an Unterauftragsverarbeiter nur im Rahmen von AVs Weisungen weiter.
3. Hält AN eine Weisung für rechtswidrig (insbesondere Verstoß gegen Datenschutzrecht), informiert AN AV unverzüglich und wartet die Entscheidung von AV ab, soweit kein sofortiges Handeln zur Schadensabwehr nötig ist. Das Recht, die Durchführung bis zur Klärung auszusetzen (PRÜFEN: Umfang und Vergütung), prüft der Anwalt **[ANWALT-12]**.
4. Weisungsberechtigt auf Seiten AV: [Name/Funktion, Stellvertreter]. Weisungsempfänger bei AN: [Name/Funktion, E-Mail]. Änderungen teilen die Parteien einander unverzüglich in Textform mit.
5. AN dokumentiert Weisungen und ihre Ausführung (wer, wann, was) ohne unnötige Inhaltskopien und ohne Geheimniswerte; Aufbewahrungsfrist: [Frist oder PRÜFEN] **[ANWALT-13]**.

## § 5 Pflichten des Auftragsverarbeiters

1. AN verarbeitet Daten nur im Rahmen dieses AVV und der Weisungen; Zweckänderungen oder eigene Auswertungen sind untersagt.
2. AN sichert zu, dass nur befugtes, auf Vertraulichkeit verpflichtetes Personal Zugriff hat (Art. 28 DSGVO). Einzelheiten (Rollen, Verpflichtungserklärungen, Schulung, Tailscale-Zugang nur für Editor/Schaltzentrale/Datenbank) siehe Anlage 2; der Anwalt prüft, ob namentliche Benennung oder Rollenbeschreibung genügt **[ANWALT-14]**.
3. AN führt ein Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO) für die Auftragsverarbeitungen und stellt AV die ihn betreffenden Auszüge auf Anforderung bereit. Abgrenzung der Verzeichnisse (AV als Verantwortlicher / AN als Auftragsverarbeiter) prüft der Anwalt **[ANWALT-15]**.
4. AN unterstützt AV bei Datenschutz-Folgenabschätzungen (Art. 35 DSGVO) und bei vorherigen Konsultationen (PRÜFEN: genaue Verfahren und Kostentragung), soweit die verarbeiteten Daten und die bei AN bekannten Informationen betroffen sind **[ANWALT-16]**.
5. AN stellt sicher, dass die in Anlage 2 beschriebenen technischen und organisatorischen Maßnahmen (Art. 32 DSGVO) umgesetzt sind und bleiben, und passt sie dem Stand der Technik und dem Risiko an. Wesentliche Änderungen mit Auswirkung auf Sicherheit oder Nachvollziehbarkeit teilt AN AV vorab mit (PRÜFEN: Frist und Zustimmungsvorbehalt) **[ANWALT-17]**.
6. AN informiert AV unverzüglich, wenn AN der Auffassung ist, dass eine Weisung gegen Datenschutzrecht verstößt (siehe § 4 Abs. 3), oder wenn Dritte (z. B. Behörden, Betroffene) sich wegen der Daten an AN wenden; AN antwortet Dritten nicht selbst, sondern verweist an AV, soweit rechtlich zulässig **[ANWALT-18]**.
7. AN benennt AV einen Ansprechpartner für Datenschutzfragen: [Name, E-Mail, Telefon]. Ob ein Datenschutzbeauftragter zu benennen ist (PRÜFEN: Bestellpflicht im Einzelfall), prüft der Anwalt **[ANWALT-19]**.

## § 6 Unterauftragsverarbeitung und Genehmigungsverfahren

1. AN setzt die in Anlage 1 genannten Unterauftragsverarbeiter ein. Weitere oder wechselnde Unterauftragsverarbeiter nur nach dem hier vereinbarten Verfahren.
2. Genehmigungsverfahren (Vorschlag zur Prüfung): **allgemeine schriftliche Genehmigung** für die in Anlage 1 aufgeführten Unterauftragsverarbeiter mit Informations- und Widerspruchsrecht von AV bei geplanten Änderungen (Ankündigungsfrist [z. B. 14 oder 30 Tage — PRÜFEN und festlegen]). Alternativ **Einzelfreigabe je Unterauftragsverarbeiter** (strengere Variante). Der Anwalt wählt die Variante und die Frist **[ANWALT-20]**.
3. Bei geplanter Hinzuziehung oder Ersetzung informiert AN AV vorab in Textform über Identität, Verarbeitungsort, Gegenstand (Zweck, Datenarten) des neuen Unterauftragsverarbeiters und den Zeitpunkt der Änderung. AV kann innerhalb der vereinbarten Frist widersprechen; Folgen eines Widerspruchs (z. B. Sonderkündigung, Mehrkosten, Leistungsanpassung — PRÜFEN) regelt der Anwalt **[ANWALT-21]**.
4. AN schließt mit jedem Unterauftragsverarbeiter einen Vertrag im Sinne von Art. 28 DSGVO mit mindestens gleichwertigen Pflichten (Weisungsbindung, Vertraulichkeit, TOMs, Unterstützung, Löschung, Prüfrecht, Drittlandregelung) und stellt AV die für den Nachweis erforderlichen Vertragsangaben bereit. Die Übermittlung vollständiger Vertragstexte oder nur der Kernauszüge (PRÜFEN: Umfang aus Geheimhaltungs- und Nachweisgründen) legt der Anwalt fest **[ANWALT-22]**.
5. AN bleibt AV gegenüber für die Einhaltung der Pflichten durch Unterauftragsverarbeiter verantwortlich (PRÜFEN: genaue Haftungsformulierung) **[ANWALT-23]**.
6. Derzeit vorgesehen (Einzelheiten, Orte und PRÜFEN-Punkte siehe Anlage 1): Vercel (Hosting/Auslieferung), Resend (Mailversand), Sicherungsspeicher (Backup, Anbieter noch zu wählen), DNS-Anbieter (z. B. Cloudflare, falls Zone dort liegt), Betreiber des eigenen Servers (Rechenzentrum/Hoster des AN-Servers — PRÜFEN und benennen). AVVs mit Vercel, Resend und Sicherungsspeicher sind vor dem ersten Kunden abzuschließen (vgl. KUNDEN-ANLEGEN-CHECKLISTE.md) **[ANWALT-24]**.

## § 7 Unterstützung bei Betroffenenrechten

1. AN unterstützt AV bei der Erfüllung der Betroffenenrechte (Art. 13, 15 bis 22 DSGVO: Information, Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit, Widerspruch; Einwilligungswiderruf nach Art. 7 DSGVO) durch geeignete technische und organisatorische Maßnahmen, soweit die Verarbeitung bei AN erfolgt.
2. Ablauf (Vorschlag aus NEWSLETTER-DATENSCHUTZ.md Abschnitt 8, rechtlich zu bestätigen): Anfrage geht an AV ([Kontaktadresse des Kunden]); AN handelt nur nach Weisung von AV; Identität wird anhand des Datensatzes geprüft; Auskunft/Export enthält die vollständigen Nachweise (Adresse, ggf. Vorname, Status, Zeitpunkte, Einwilligungstext mit Version, Quelle); Löschung/Widerruf wirkt sofort für künftige Newsletter (auch geplante Kampagnen), die Adresse wechselt auf die Sperrliste (nur Adresse/Prüfwert und Grund) und aktive Kontaktdaten werden gelöscht; Nachweise und Sperre bleiben nach Abschnitt 6/§ 10 bestehen; Exporte erfolgen nur für AV und werden protokolliert (wer, wann, Umfang) **[ANWALT-25]**.
3. Wendet sich eine betroffene Person direkt an AN, leitet AN das Ersuchen unverzüglich an AV ([Weisungsadresse]) weiter und informiert die Person über die Weiterleitung, sofern rechtlich zulässig. Antwortfristen: PRÜFEN und festlegen (Vorschlag: Weiterleitung innerhalb von [z. B. 3 Werktagen — PRÜFEN], Unterstützung so rechtzeitig, dass AV seine Pflichten erfüllen kann) **[ANWALT-26]**.
4. Kosten der Unterstützung (PRÜFEN: Vergütung bei überdurchschnittlichem Aufwand, z. B. nach Hauptvertrag) **[ANWALT-27]**.

## § 8 Meldung von Datenpannen

1. AN informiert AV unverzüglich nach Bekanntwerden einer Verletzung des Schutzes personenbezogener Daten (Art. 33, 34 DSGVO), spätestens innerhalb von [Frist, z. B. 24 oder 48 Stunden — PRÜFEN und festlegen]; die Meldung an die Aufsichtsbehörde und ggf. die Benachrichtigung Betroffener obliegt AV, AN unterstützt **[ANWALT-28]**.
2. Die Meldung von AN an AV enthält, soweit verfügbar: Art der Verletzung, betroffene Datenarten und Personengruppen (ggf. Schätzung), wahrscheinliche Folgen, ergriffene und geplante Abhilfemaßnahmen, Ansprechpartner bei AN. Fehlende Angaben liefert AN unverzüglich nach (PRÜFEN: Stufenmeldung zulassen) **[ANWALT-29]**.
3. AN dokumentiert Verletzungen (Tatsachen, Auswirkungen, Abhilfe) und stellt AV die Dokumentation für dessen Pflichten nach Art. 33 DSGVO bereit.
4. Kontaktweg für Pannenmeldungen: AV: [E-Mail/Telefon für Pannenmeldungen]; AN: [E-Mail/Telefon]. Erreichbarkeit außerhalb üblicher Zeiten: [Regelung oder PRÜFEN — Hinweis: keine Rund-um-die-Uhr-Zusage nach WORKFLOW-PLAN § 10] **[ANWALT-30]**.

## § 9 Löschung und Rückgabe nach Vertragsende

1. Nach Beendigung des Hauptvertrags wählt AV auf Aufforderung von AN innerhalb von [Frist — PRÜFEN] zwischen Rückgabe (Export in nutzbarem Format: Inhalte, Originalbilder, Newsletter-Nachweise — vgl. WORKFLOW-PLAN § 10) und Löschung aller personenbezogenen Daten aus der Auftragsverarbeitung. Ohne fristgerechte Wahl gilt der Vorschlag: Rückgabe, dann Löschung **[ANWALT-31]**.
2. AN löscht danach alle betroffenen Bestände (Produktivdatenbank des Kunden, Medienablage, Konfiguration mit Personenbezug, Sitzungs-/Protokolldaten im vereinbarten Umfang) und lässt Unterauftragsverarbeiter ebenfalls löschen, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht. Gesetzlich aufzubewahrende Nachweise (z. B. Einwilligungsnachweise, Sperrliste, Export-Protokolle, Weisungsdokumentation) werden gesperrt und nur für den Aufbewahrungszweck vorgehalten; konkrete Fristen je Datenart legt der Anwalt mit AV fest (Vorschläge siehe NEWSLETTER-DATENSCHUTZ.md Abschnitt 6, DATENKLASSEN.md) **[ANWALT-32]**.
3. Backups: gelöschte Daten laufen mit dem getrennten Backup-Verfall aus den Sicherungen (WORKFLOW-PLAN § 10, DATENKLASSEN.md); eine gezielte Einzellöschung aus unveränderlichen Backups ist technisch nur über Verfall möglich — der Anwalt bestätigt, ob das genügt, und legt den Verfall fest [Frist — PRÜFEN] **[ANWALT-33]**.
4. AN bestätigt AV die Löschung in Textform (Zeitpunkt, Umfang, ausgeschlossene Aufbewahrungsbestände mit Rechtsgrund). Vorschau-Kopien mit echten Daten werden nach der Abnahme belegt gelöscht (WORKFLOW-PLAN § 8); keine Kopien in Backups, Logs oder KI-Verläufen **[ANWALT-34]**.
5. Domain-Übergabe, Exportverfahren und Verantwortlichkeiten beschreibt AN vor dem ersten Kunden (vgl. WORKFLOW-PLAN § 10, KUNDEN-ANLEGEN-CHECKLISTE.md); Einzelheiten als Nachtrag [Anlage/Runbook-Verweis einfügen] **[ANWALT-35]**.

## § 10 Kontrollrechte und Nachweise

1. AN stellt AV die zum Nachweis der Einhaltung von Art. 28 DSGVO erforderlichen Informationen bereit (TOMs nach Anlage 2, Unterauftragsverarbeiter nach Anlage 1, Verarbeitungsverzeichnis-Auszüge, Löschbestätigungen, Protokolle im vereinbarten Umfang).
2. Prüfungen durch AV (oder einen beauftragten, zur Verschwiegenheit verpflichteten Prüfer) nur nach rechtzeitiger Ankündigung ([Frist — PRÜFEN, Vorschlag 14 Tage]), während üblicher Geschäftszeiten, ohne Störung des Betriebs anderer Kunden und ohne Zugriff auf fremde Kundendaten oder Geheimnisse. Der Prüfer erhält nur den AV betreffenden Ausschnitt. Häufigkeit (PRÜFEN: z. B. einmal jährlich plus anlassbezogen) und Kostentragung legt der Anwalt fest **[ANWALT-36]**.
3. AN wirkt bei Prüfungen mit (Auskunft, Einsicht in relevante Unterlagen und Systeme im AV-Ausschnitt). Fernprüfung (Dokumentenprüfung, Screensharing-Auszüge) hat Vorrang; Vor-Ort-Prüfung nur bei begründetem Anlass (PRÜFEN) **[ANWALT-37]**.
4. Zertifizierungen, Berichte Dritter oder Audit-Auszüge (PRÜFEN: welche vorhanden oder geplant sind) kann AN als Nachweis anbieten; ob sie eine Prüfung ersetzen, entscheidet AV nach Beratung **[ANWALT-38]**.

## § 11 Haftung

Der Anwalt formuliert die Haftung vollständig (Vorschlag zur Prüfung: gesetzliche Haftungsverteilung, keine unzulässigen Freizeichnungen; Verhältnis zur Haftungsregelung des Hauptvertrags; Verantwortung für Unterauftragsverarbeiter nach § 6 Abs. 5; keine Summen- oder Pauschalzusagen in diesem Entwurf ohne Freigabe) **[ANWALT-39]**.

## § 12 Drittlandtransfers und Unterauftragsverarbeiter-Orte

1. Verarbeitung findet grundsätzlich in der EU statt (Ziel nach WORKFLOW-PLAN § 2). Übermittlungen in Drittländer (Art. 44 ff. DSGVO) nur nach dokumentierter Weisung von AV und bei Vorliegen einer geeigneten Garantie (PRÜFEN im Einzelfall: Angemessenheitsbeschluss, Standardvertragsklauseln, zusätzliche Maßnahmen — keine Festlegung in diesem Entwurf) **[ANWALT-40]**.
2. Bekannter Klärungsbedarf je Anbieter (siehe Anlage 1, jeweils PRÜFEN): Vercel Inc. (Sitz USA nach config/legal.json: 340 Pine Street Suite 701, San Francisco, CA 94104, USA — klären, ob und welche Daten in die USA gelangen und mit welcher Garantie); Resend (Anbieterangaben, Verarbeitungsort und DPA-Verfügbarkeit noch zu belegen); Sicherungsspeicher (Anbieterwahl offen, EU-Speicher mit Löschschutz als Empfehlung); DNS-Anbieter (z. B. Cloudflare — Rolle und Datenarten klären); Hoster/Betreiber des eigenen Servers (benennen und einordnen) **[ANWALT-41]**.
3. Bis zur Klärung setzt AN keinen Anbieter für Kundendaten ein, dessen Drittlandstatus ungeklärt ist (vgl. KUNDEN-ANLEGEN-CHECKLISTE.md: erst Verträge und Zuordnung, dann Einsatz) **[ANWALT-42]**.

## § 13 Schlussbestimmungen

1. Schriftform: Änderungen und Ergänzungen dieses AVV (einschließlich Anlagen) bedürfen der Textform; das gilt auch für die Aufhebung dieses Erfordernisses (PRÜFEN: Formerfordernis) **[ANWALT-43]**.
2. Vorrang: Bei Widerspruch zwischen Hauptvertrag und diesem AVV geht dieser AVV in Datenschutzfragen vor (PRÜFEN: Vorrangklausel) **[ANWALT-44]**.
3. Salvatorische Klausel, Erfüllungsort, Gerichtsstand, anwendbares Recht: formuliert der Anwalt **[ANWALT-45]**.
4. Anlagen: Anlage 1 (Unterauftragsverarbeiter) und Anlage 2 (technische und organisatorische Maßnahmen) sind Bestandteil dieses AVV.

**Unterschriften (Platzhalter):**

- [Ort, Datum] — Auftraggeber: [Name, Funktion, Unterschrift]
- [Ort, Datum] — Auftragnehmer (pixel&code): [Name, Funktion, Unterschrift]

---

## Sammlung der Anwaltsfragen zu diesem Dokument

| Nr. | Stelle | Frage an den Anwalt |
|---|---|---|
| ANWALT-1 | § 1 Abs. 3 | Fortgeltung von Lösch-, Aufbewahrungs- und Nachweisfristen nach Vertragsende prüfen und formulieren. |
| ANWALT-2 | § 1 Abs. 4 | Kündigungs-/Verlängerungsregeln: Verweis auf Hauptvertrag ausreichend oder eigene Frist nötig? |
| ANWALT-3 | § 2 Abs. 1 | Tracking/Einwilligung (TDDDG § 25) je Kunde einordnen; Formulierungsvorschlag prüfen. |
| ANWALT-4 | § 2 Abs. 3 | Rechtsgrundlagen je Verarbeitungstätigkeit zuordnen und Hinweispflichten (Art. 13 DSGVO) abgrenzen. |
| ANWALT-5 | § 3 Abs. 1 | Besucher- und Protokolldaten: Datenarten, Zwecke und Aufbewahrung bestätigen. |
| ANWALT-6 | § 3 Abs. 2 | Newsletter-Datenarten und alle Löschfristen (insb. 7-Tage-Vorschlag, Sperrliste, Nachweise) festlegen. |
| ANWALT-7 | § 3 Abs. 3 | Kontaktformular: Speicherort (DB-Ablage ja/nein) und Löschfrist festlegen. |
| ANWALT-8 | § 3 Abs. 4 | Admin-/Sitzungsdaten: Fristen und Verfahren bestätigen. |
| ANWALT-9 | § 3 Abs. 5 | Umgang mit besonderen Kategorien: Abgrenzung und Verfahren freigeben. |
| ANWALT-10 | § 3 Abs. 6 | Verfahren für neue Module/Datenarten (AVV-Nachtrag) festlegen. |
| ANWALT-11 | § 4 Abs. 1 | Weisungsformen (Textform, mündlich) und Dokumentationspflicht formulieren. |
| ANWALT-12 | § 4 Abs. 3 | Verfahren bei rechtswidrigen Weisungen inkl. Aussetzung und Vergütung formulieren. |
| ANWALT-13 | § 4 Abs. 5 | Aufbewahrungsfrist der Weisungsdokumentation festlegen. |
| ANWALT-14 | § 5 Abs. 2 | Vertraulichkeit/Rollen: genügt Rollenbeschreibung oder Namen nötig? Schulung festlegen? |
| ANWALT-15 | § 5 Abs. 3 | Verzeichnisse nach Art. 30 DSGVO: Abgrenzung AV/AN und Bereitstellungspflicht formulieren. |
| ANWALT-16 | § 5 Abs. 4 | DSFA-Unterstützung und Kostentragung (Art. 35 DSGVO) regeln. |
| ANWALT-17 | § 5 Abs. 5 | Verfahren bei TOM-Änderungen (Frist, Zustimmung) festlegen. |
| ANWALT-18 | § 5 Abs. 6 | Dritt-/Behördenanfragen: Verweis- und Informationsverfahren freigeben. |
| ANWALT-19 | § 5 Abs. 7 | Ansprechpartner vs. Datenschutzbeauftragter: Bestellpflicht im Einzelfall prüfen. |
| ANWALT-20 | § 6 Abs. 2 | Genehmigungsverfahren wählen (allgemein mit Widerspruch vs. einzeln) und Frist festlegen. |
| ANWALT-21 | § 6 Abs. 3 | Widerspruchsfolgen (Kündigung, Kosten, Anpassung) regeln. |
| ANWALT-22 | § 6 Abs. 4 | Umfang der Vertragsnachweise gegenüber AV (Volltext vs. Auszug) festlegen. |
| ANWALT-23 | § 6 Abs. 5 | Verantwortlichkeit für Unterauftragsverarbeiter haftungsrechtlich formulieren. |
| ANWALT-24 | § 6 Abs. 6 | Unterauftragsverarbeiter-Verträge (Vercel, Resend, Backup) vor Erst-Einsatz abschließen und beilegen. |
| ANWALT-25 | § 7 Abs. 2 | Betroffenenrechte-Ablauf (Auskunft, Löschung, Sperrliste, Protokoll) freigeben. |
| ANWALT-26 | § 7 Abs. 3 | Weiterleitungs- und Unterstützungsfristen festlegen. |
| ANWALT-27 | § 7 Abs. 4 | Vergütung bei Mehraufwand regeln. |
| ANWALT-28 | § 8 Abs. 1 | Pannenmeldefrist AN→AV festlegen; Rollen nach Art. 33, 34 DSGVO abgrenzen. |
| ANWALT-29 | § 8 Abs. 2 | Stufenmeldung bei unvollständiger Informationslage zulassen? |
| ANWALT-30 | § 8 Abs. 4 | Erreichbarkeitsregelung ohne Rund-um-die-Uhr-Zusage formulieren. |
| ANWALT-31 | § 9 Abs. 1 | Wahlrecht Rückgabe/Löschung, Frist und Auffangregel festlegen. |
| ANWALT-32 | § 9 Abs. 2 | Aufbewahrungsausnahmen (Nachweise, Sperrliste) mit Rechtsgrund und Frist festlegen. |
| ANWALT-33 | § 9 Abs. 3 | Backup-Verfall festlegen und als Löschweg bestätigen. |
| ANWALT-34 | § 9 Abs. 4 | Löschbestätigung (Inhalt, Form) und Vorschau-Löschungsnachweis festlegen. |
| ANWALT-35 | § 9 Abs. 5 | Export-/Domain-Verfahren als Nachtrag beifügen. |
| ANWALT-36 | § 10 Abs. 2 | Prüfverfahren (Ankündigung, Häufigkeit, Kosten, Fremddaten-Schutz) festlegen. |
| ANWALT-37 | § 10 Abs. 3 | Vorrang Fernprüfung vs. Vor-Ort regeln. |
| ANWALT-38 | § 10 Abs. 4 | Ersatz durch Zertifikate/Berichte regeln. |
| ANWALT-39 | § 11 | Haftung vollständig formulieren; Verhältnis zum Hauptvertrag klären. |
| ANWALT-40 | § 12 Abs. 1 | Drittland-Garantien je Transfer festlegen (Art. 44 ff. DSGVO). |
| ANWALT-41 | § 12 Abs. 2 | Verarbeitungsorte und Garantien je Anbieter (Vercel, Resend, Backup, DNS, Server-Hoster) klären. |
| ANWALT-42 | § 12 Abs. 3 | Einsatzsperre bis zur Klärung bestätigen. |
| ANWALT-43 | § 13 Abs. 1 | Formerfordernis festlegen. |
| ANWALT-44 | § 13 Abs. 2 | Vorrangklausel bestätigen. |
| ANWALT-45 | § 13 Abs. 3 | Salvatorik, Erfüllungsort, Gerichtsstand, Recht formulieren. |
