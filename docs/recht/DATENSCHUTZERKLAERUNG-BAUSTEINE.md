# Datenschutzerklärung – Textbausteine (Entwurf zur anwaltlichen Prüfung)

> **ENTWURF – keine Rechtsberatung.** Diese Bausteine sind eine Arbeitsgrundlage für Nicks Anwalt. Der Anwalt prüft, korrigiert und gibt den Wortlaut frei. Erst der freigegebene Wortlaut darf auf Kunden-Homepages erscheinen. Erfundene Paragrafen, Urteile und Zahlen sind nicht enthalten; Rechtsverweise nur aus dem freigegebenen Kreis (DSGVO Art. 6, 7, 13, 15 bis 22, 28, 30, 32, 33, 34, 35, 44 ff.; UWG 7; DDG 5; TDDDG 25), alles andere ist mit PRÜFEN markiert.
>
> Stand: 25.11.2026. Kontext: pixel&code (Einzelentwickler-Agentur, Deutschland). Kunden-Homepages auf Astro, Auslieferung über Vercel, Daten in PostgreSQL auf eigenem Server, Mailversand über Resend, Sicherungsspeicher bei EU-Anbieter, optionales Newsletter-Modul. Hinweis zum Schreibstil: Der Skill `german-app-writing` wurde gelesen; er gilt laut Skill-Beschreibung ausdrücklich nicht für Rechtstexte und wurde daher auf den Wortlaut nicht angewendet.

## Grundlagen (gelesen)

`docs/WORKFLOW-PLAN.md` (V3), `docs/DATENKLASSEN.md`, `docs/KUNDEN-ANLEGEN-CHECKLISTE.md`, `docs/legal-checklist.md`, HPSE-Newsletter-Konzept (25.11.2026), HPSE-Dienstleister-Übersicht (25.11.2026), `docs/NEWSLETTER-DATENSCHUTZ.md`, `docs/NEWSLETTER-API.md`, `config/legal.json`, `src/pages/impressum.astro`, `src/pages/datenschutz.astro`, `src/components/CookieBanner.astro` (Vorhandensein geprüft), `docs/BOOKING-LIVESYNC.md` (Buchungsvarianten).

## Verwendung

Jeder Baustein nennt eine **Bedingung**: Nur wenn die Bedingung zutrifft, wird der Baustein in die Datenschutzerklärung des Kunden übernommen. Die Reihenfolge der Bausteine entspricht der Reihenfolge in der Erklärung. Platzhalter in eckigen Klammern füllt Nick je Kunde; der Wortlaut selbst wird nicht verändert (siehe Abschnitt 5).

---

## B1 – Verantwortliche Stelle (immer einblenden)

**Bedingung:** Immer. Jede Kunden-Homepage nennt die verantwortliche Stelle (DSGVO Art. 13).

**Text:**

> Verantwortlich für die Datenverarbeitung auf dieser Website ist:
>
> [Firmenname] [Rechtsform], vertreten durch [Vor- und Nachname Vertretungsberechtigte/r]
> [Straße + Hausnummer], [PLZ] [Stadt], Deutschland
> Telefon: [Telefon mit Vorwahl], E-Mail: [E-Mail-Adresse]
>
> Verantwortlich ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.

**Platzhalter:** [Firmenname], [Rechtsform], [Vor- und Nachname Vertretungsberechtigte/r], [Straße + Hausnummer], [PLZ], [Stadt], [Telefon mit Vorwahl], [E-Mail-Adresse]

**Anwaltsfrage:** [ANWALT-1] Reicht diese Benennung der verantwortlichen Stelle je Kundentyp (Unternehmer, Freiberufler, Verein) aus, und ist der nachgestellte Erläuterungssatz erwünscht oder zu streichen?

## B2 – Hosting und Auslieferung über Vercel (immer einblenden)

**Bedingung:** Immer. Jede Kundenseite wird über Vercel ausgeliefert (eigenes Vercel-Projekt je Kunde, Auslieferung aus dem Zwischenspeicher).

**Text:**

> Wir hosten die Inhalte unserer Website beim folgenden Anbieter:
>
> Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA. Datenschutzerklärung des Anbieters: https://vercel.com/legal/privacy-policy
>
> Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Anbieters gespeichert. Hierbei kann es sich insbesondere um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen sowie Webseitenzugriffe handeln.
>
> Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag. Die Auslieferung erfolgt aus einem Zwischenspeicher; Inhalte der Datenbank auf unserem Server werden nur bei Aufruf der entsprechenden Funktionen übertragen.

**Platzhalter:** Keine kundenspezifischen Platzhalter; Anbieterangaben aus `config/legal.json` (Feld `legal.hosting`).

**Anwaltsfrage:** [ANWALT-2] Bitte Auftragsverarbeitungsvertrag mit Vercel, Verarbeitungsort, Protokolldaten-Umfang und Drittlandfragen prüfen (DSGVO Art. 28, Art. 44 ff. – PRÜFEN, welche Garantie für den US-Transfer trägt).

## B3 – Server-Logfiles (einblenden, wenn Server-Protokolle anfallen – Regelfall)

**Bedingung:** Einblenden, sobald beim Hosting technische Protokolldaten (Logfiles) anfallen. Regelfall: ja.

**Text:**

> Der Anbieter der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse.
>
> Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technisch fehlerfreien Darstellung und Optimierung der Website).

**Platzhalter:** Keine. Falls der Kunde eine andere Speicherdauer wünscht: [Speicherdauer der Logfiles – PRÜFEN].

**Anwaltsfrage:** [ANWALT-3] Bitte Rechtsgrundlage und Speicherdauer der Server-Logfiles bestätigen; falls eine konkrete Löschfrist genannt werden soll, bitte vorgeben (Vorschlag der Fachseite: kurze Frist – PRÜFEN).

## B4 – Selbst gehostete Schriften (einblenden, wenn Schriften lokal ausgeliefert werden)

**Bedingung:** Einblenden, wenn die Website Schriften ausschließlich vom eigenen Server lädt und keine Verbindung zu Schrift-Servern Dritter aufbaut.

**Text:**

> Diese Website verwendet Schriftarten, die ausschließlich auf unserem eigenen Server gespeichert und von dort ausgeliefert werden. Beim Aufruf einer Seite werden die Schriftdateien direkt von unserer Domain geladen; es wird keine Verbindung zu externen Servern aufgebaut. Eine Übermittlung Ihrer IP-Adresse an Dritte findet in diesem Zusammenhang nicht statt.
>
> Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einheitlichen und ansprechenden Darstellung des Online-Angebots).

**Platzhalter:** Keine. Falls je Kunde andere Schriftnamen genannt werden sollen: [Schriftname – optional, PRÜFEN, ob Nennung nötig ist].

**Anwaltsfrage:** [ANWALT-4] Bitte bestätigen, dass bei ausschließlich lokaler Schriftauslieferung kein Drittlandtransfer-Baustein nötig ist und ob die Nennung der Schriftnamen erforderlich ist.

## B5 – Kontaktformular (einblenden, wenn Kontaktmodul aktiv)

**Bedingung:** Einblenden, wenn die Seite ein Kontaktformular (oder eine Erinnerungs-/Rückruffunktion mit Formular) enthält.

**Text:**

> Wenn Sie uns per Kontaktformular anfragen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail-Adresse, Inhalt Ihrer Nachricht) zum Zwecke der Bearbeitung Ihrer Anfrage bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter (DSGVO Art. 6, Art. 7 – PRÜFEN, welche Rechtsgrundlage je Anfrageart trägt).
>
> Zum Schutz vor unerwünschten automatisierten Nachrichten prüfen wir Eingaben mit einem Spam-Schutz. Pflichtfelder sind als solche gekennzeichnet. Unter dem Formular finden Sie einen Link auf diese Datenschutzerklärung. Nach dem Absenden erhalten Sie eine Bestätigung auf der Website.
>
> Die Eingänge werden per E-Mail an [Empfänger-E-Mail-Adresse des Kunden] zugestellt und dort sowie in der Übertragung über den Versanddienstleister (siehe Baustein Mailversand) verarbeitet. Falls Formulareingänge zusätzlich in der Kundendatenbank gespeichert werden: [Speicherung: ja/nein; falls ja, Speicherdauer – PRÜFEN].

**Platzhalter:** [Empfänger-E-Mail-Adresse des Kunden], [Speicherung: ja/nein; Speicherdauer]

**Anwaltsfrage:** [ANWALT-5] Bitte Rechtsgrundlage je Anfrageart, Spam-Schutz-Verfahren, Zustellweg (E-Mail-Postfach des Kunden) und Aufbewahrungsdauer der Formulareingänge festlegen; klären, ob eine Datenbankablage der Eingänge erfolgen soll und welche Frist dann gilt.

## B6 – Mailversand über Resend (einblenden, wenn die Seite Mails versendet)

**Bedingung:** Einblenden, sobald die Website E-Mails auslöst: Kontaktformular-Zustellung, Passwort-Zurücksetzen für /admin oder (bei Buchung) Newsletter. Der reine Anzeige-Betrieb ohne Mailversand blendet diesen Baustein aus.

**Text:**

> Der Versand von E-Mails dieser Website (zum Beispiel Kontaktformular-Benachrichtigungen und Nachrichten zur Kontoverwaltung) erfolgt über den Dienst Resend. Dabei werden die für den Versand erforderlichen Daten (Empfängeradresse, Absenderadresse, Betreff, Inhalt der Nachricht sowie technische Zustelldaten) an Resend übertragen und dort zur Zustellung verarbeitet.
>
> Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag. Der Versand erfolgt über eine verifizierte Absenderdomain des Kunden ([Absenderdomain]); Absenderdomain, Einträge zur Absenderprüfung (SPF, DKIM, DMARC) und Verifizierungsstand werden je Kunde dokumentiert.

**Platzhalter:** [Absenderdomain]

**Anwaltsfrage:** [ANWALT-6] Bitte Auftragsverarbeitungsvertrag mit Resend, Anbieterangaben, Verarbeitungsort und Drittlandfragen prüfen (DSGVO Art. 28, Art. 44 ff. – PRÜFEN, welche Garantie trägt); klären, ob technische Zustelldaten (Rückläufer, Beschwerden) in diesem Baustein oder nur im Newsletter-Baustein genannt werden.

## B7 – Newsletter mit Double-Opt-in (nur bei gebuchtem Newsletter-Modul)

**Bedingung:** Nur einblenden, wenn der Kunde das Newsletter-Zusatzmodul gebucht hat. Ohne Buchung entfällt der gesamte Baustein; dann wird auch kein Newsletter-Formular angezeigt.

**Text:**

> Wir versenden unseren Newsletter auf Grundlage Ihrer Einwilligung (DSGVO Art. 6, Art. 7 – PRÜFEN). Die Anmeldung erfolgt über ein Double-Opt-in: Nach Ihrer Anmeldung erhalten Sie eine Bestätigungsmail; erst nach Klick auf den Bestätigungslink ist Ihre Adresse freigeschaltet.
>
> Gespeichert werden Ihre E-Mail-Adresse [und, falls angegeben, Ihr Vorname], der Zeitpunkt von Anmeldung und Bestätigung, die Fassung des Einwilligungstextes, die Quelle der Anmeldung sowie eine gekürzte technische Herkunftskennung zum Missbrauchsschutz.
>
> Der Versand erfolgt über Resend (siehe Baustein Mailversand). Unser Versanddienstleister meldet uns Zustellprobleme (zum Beispiel unzustellbare Adressen oder Beschwerden) über technische Rückmeldungen. Solche Adressen sperren wir für künftige Newsletter.
>
> Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, zum Beispiel über den Abmeldelink in jeder E-Mail. Die Abmeldung wirkt sofort, auch für bereits geplante Newsletter. Nach einer Abmeldung, einem harten Rückläufer oder einer Beschwerde speichern wir Ihre Adresse in einer Sperrliste, damit Sie keinen Newsletter mehr erhalten. Die Sperrliste enthält nur die Adresse (oder einen Prüfwert) und den Grund und bleibt bestehen, solange die Sperre erforderlich ist.
>
> Unbestätigte Anmeldungen löschen wir nach [Frist, Vorschlag 7 Tage – PRÜFEN]. Einwilligungsnachweise und Sperrlisteneinträge bewahren wir auf, solange dies für den Nachweis der Einwilligung und die Einhaltung der Sperre erforderlich ist [konkrete Frist – PRÜFEN].
>
> Öffnungs- und Klickmessung erfolgt nur, wenn Sie dem gesondert zugestimmt haben [PRÜFEN: ob und wie Messung je Kunde angeboten wird]. Exporte der Abonnentenliste erfolgen nur durch den Kunden und werden protokolliert. Grundlage dieses Bausteins sind das Newsletter-Konzept und `docs/NEWSLETTER-DATENSCHUTZ.md` (jeweils Stand 25.11.2026).

**Platzhalter:** [Frist für unbestätigte Anmeldungen], [konkrete Frist für Nachweise und Sperrliste], [Frequenz und Inhalte des Newsletters aus dem Einwilligungstext], [Kontaktadresse des Kunden für Widerruf]

**Anwaltsfrage:** [ANWALT-7] Bitte Einwilligungstexte (kurz und ausführlich aus `docs/NEWSLETTER-DATENSCHUTZ.md`), Rechtsgrundlagen-Verweise, Lösch- und Aufbewahrungsfristen (unbestätigte Anmeldungen, Nachweise, Sperrliste), UWG-7-Fragen (ausdrückliche Einwilligung, Bestandskunden-Ausnahme – PRÜFEN, ob nutzbar) und Messung (Öffnungs-/Klickmessung) freigeben.

## B8 – Buchungsfunktion (einblenden, wenn Buchungsmodul aktiv)

**Bedingung:** Einblenden, wenn die Seite eine Buchungs- oder Terminanfrage-Funktion enthält. Zwei Unterfälle: (a) einfache Anfrage per Formular/E-Mail ohne Kalender-Anbindung; (b) Buchung mit Kalender-Synchronisation. Nur der zutreffende Unterfall wird eingeblendet.

**Text (Unterfall a – Anfrage ohne Kalender-Anbindung):**

> Wenn Sie eine Buchungs- oder Terminanfrage senden, verarbeiten wir die von Ihnen angegebenen Daten (Name, Kontaktdaten, gewünschte Leistung und Zeit, Inhalt Ihrer Nachricht) zur Bearbeitung Ihrer Anfrage und zur Terminabstimmung. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter (DSGVO Art. 6 – PRÜFEN).

**Text (Unterfall b – mit Kalender-Synchronisation, zusätzlich):**

> Wenn die Kalender-Synchronisation aktiviert ist, wird Ihre Buchung zusätzlich in einen Kalender des Kunden übertragen. Dabei werden die für den Termineintrag erforderlichen Daten (Name, Terminzeit, gebuchte Leistung, Kontaktdaten für die Einladung) an den Kalenderanbieter übertragen [Anbieter und Verarbeitung – PRÜFEN]. Einzelheiten zur Kalender-Anbindung stehen in der Buchungsbestätigung.

**Platzhalter:** [gewünschte Leistung – je Kunde], [Kalenderanbieter und Angaben – nur Unterfall b, PRÜFEN], [Speicherdauer der Buchungsdaten – PRÜFEN]

**Anwaltsfrage:** [ANWALT-8] Bitte Rechtsgrundlage und Speicherdauer der Buchungsdaten sowie – bei Unterfall b – Kalenderanbieter, Auftragsverarbeitungsvertrag, Verarbeitungsort und Drittlandfragen prüfen (DSGVO Art. 28, Art. 44 ff. – PRÜFEN).

## B9 – Cookie- und Einwilligungsbanner (einblenden, wenn Banner aktiv oder einwilligungsbedürftige Technik eingesetzt wird)

**Bedingung:** Der Hinweis auf das Banner wird eingeblendet, sobald die Seite ein Einwilligungsbanner zeigt. Der zweite Absatz (Einwilligung für Messung/Analyse) nur, wenn tatsächlich einwilligungsbedürftige Technik (zum Beispiel Analyse) eingesetzt wird.

**Text:**

> Unsere Internetseiten verwenden sogenannte Cookies. Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Notwendige Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs oder zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine andere Rechtsgrundlage angegeben wird.
>
> Soweit eine Einwilligung zur Speicherung von Cookies und vergleichbaren Wiedererkennungstechnologien abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit widerrufbar. Sie können Ihre Einwilligung jederzeit über den Link „Cookie-Einstellungen" im Footer dieser Website widerrufen oder anpassen.

**Platzhalter:** Keine kundenspezifischen Platzhalter. Falls Analyse eingesetzt wird, zusätzlich: [Name des Analyse-Tools, Zweck, Speicherdauer, Datenweitergabe – PRÜFEN].

**Anwaltsfrage:** [ANWALT-9] Bitte TDDDG-Verweis (§ 25 Abs. 1 TDDDG), Abgrenzung notwendiger Cookies und den Banner-Ablauf (gleichwertige Auswahl, Widerruf über Footer-Link) bestätigen; falls Analyse je Kunde hinzukommt, bitte Wortlaut, Rechtsgrundlage und Speicherdauer vorgeben.

## B10 – Bewertungen (einblenden, wenn Bewertungsmodul aktiv)

**Bedingung:** Einblenden, wenn die Seite Kundenbewertungen zeigt oder zur Bewertung auffordert (Bewertungsformular, Einladungslinks mit Einmalwerten, Anzeige geprüfter Bewertungen).

**Text:**

> Wenn Sie eine Bewertung abgeben, verarbeiten wir Ihre Angaben (Name oder Kürzel, Bewertungstext, vergebene Punkte, Zeitpunkt, [Foto, falls Sie eines hochladen]) zur Prüfung und – nach Prüfung – zur Anzeige auf dieser Website. Bewertungen werden als geprüft gekennzeichnet, wenn ihre Echtheit tatsächlich geprüft wurde [Prüfverfahren je Kunde – PRÜFEN, zum Beispiel Einladung nach belegter Leistung über einen einmaligen Link].
>
> Bewertungen mit Personenbezug bleiben bis [Frist, Vorschlag 30 Tage nach Löschentscheidung – PRÜFEN] gespeichert; Nachweise über Einwilligung oder Leistungsbezug werden gesondert nach [Frist – PRÜFEN] aufbewahrt. Fotos werden nur mit Ihrer Zustimmung angezeigt. Eine Löschung Ihrer Bewertung können Sie unter [Kontaktadresse des Kunden] verlangen.

**Platzhalter:** [Foto ja/nein], [Prüfverfahren], [Frist], [Kontaktadresse des Kunden]

**Anwaltsfrage:** [ANWALT-10] Bitte Prüfverfahren für die Echtheitskennzeichnung, UWG-Fragen (Irreführung über Echtheit – PRÜFEN, welche Anforderungen gelten), Anzeige von Namen/Fotos und Aufbewahrungsfristen für Bewertungen und Nachweise prüfen.

## B11 – Social-Links (einblenden, wenn Social-Modul aktiv)

**Bedingung:** Einblenden, wenn die Seite Links zu Social-Profilen des Kunden enthält. Zwei Unterfälle: (a) einfache Verlinkung (kein Drittanbieter-Kontakt beim bloßen Seitenaufruf); (b) eingebettete Inhalte oder Schaltflächen mit Drittanbieter-Kontakt. Nur der zutreffende Unterfall wird eingeblendet.

**Text (Unterfall a – reine Verlinkung):**

> Diese Website enthält Links zu unseren Profilen in sozialen Netzwerken ([Netzwerke und Profiladressen]). Beim bloßen Aufruf unserer Seite wird dabei keine Verbindung zu diesen Netzwerken aufgebaut. Erst wenn Sie einen Link anklicken, verlassen Sie unsere Seite und es gelten die Datenschutzhinweise des jeweiligen Anbieters.

**Text (Unterfall b – eingebettete Inhalte, zusätzlich):**

> Auf dieser Seite sind Inhalte [des Anbieters – PRÜFEN] eingebettet. Dabei wird beim Aufruf der Seite eine Verbindung zu den Servern des Anbieters aufgebaut und Ihre IP-Adresse übertragen [weitere Daten – PRÜFEN]. Rechtsgrundlage ist [PRÜFEN].

**Platzhalter:** [Netzwerke und Profiladressen], [Anbieter und Angaben – nur Unterfall b, PRÜFEN]

**Anwaltsfrage:** [ANWALT-11] Bitte je Kunde klären, ob reine Verlinkungen oder Einbettungen vorliegen; bei Einbettungen Anbieter, Datenumfang, Rechtsgrundlage und Drittlandfragen prüfen (DSGVO Art. 44 ff. – PRÜFEN).

## B12 – Eigener Server, Kundendatenbank und Sicherung (immer einblenden)

**Bedingung:** Immer. Inhalte und Nachweise je Kunde liegen in einer getrennten Kundendatenbank (PostgreSQL auf eigenem Server, je Kunde eigene Datenbank oder eigenes Schema mit eigener Rolle); Sicherungen liegen bei einem EU-Anbieter.

**Text:**

> Kundeninhalte, Formulareingänge (falls Datenbankablage beschlossen – siehe Baustein Kontaktformular), Newsletter-Abonnenten und Nachweise (Einwilligungsversionen, Sperrliste) werden in einer getrennten Kundendatenbank auf einem eigenen Server in Deutschland [genauer Standort – PRÜFEN] verarbeitet. Die Kundenseite auf Vercel ruft diese Daten über eine gesicherte Schnittstelle mit kundengebundenem Schlüssel ab; der Schlüssel steht nie im Browser.
>
> Sicherungskopien von Datenbank, Medien und Konfiguration liegen bei [Sicherungsspeicher je Kunde benennen – PRÜFEN]. Mit allen Dienstleistern, die personenbezogene Daten sehen, besteht ein Auftragsverarbeitungsvertrag. Es gilt ein Löschkonzept mit Backup-Verfall: Gelöschte Daten laufen mit dem Backup-Verfall aus den Sicherungen [konkrete Frist – PRÜFEN].

**Platzhalter:** [genauer Standort des Servers], [Sicherungsspeicher], [Backup-Verfall-Frist – PRÜFEN]

**Anwaltsfrage:** [ANWALT-12] Bitte Serverstandort, Schnittstellen-Härtung (eigener Schlüssel je Kunde, Ratenbegrenzung, Protokoll), Sicherungsanbieter mit Löschschutz, Backup-Verfall und das Verzeichnis der Verarbeitungstätigkeiten prüfen (DSGVO Art. 28, 30, 32, 33, 34, 35 – PRÜFEN, was je Kunde zu dokumentieren ist).

## B13 – Ihre Rechte (immer einblenden)

**Bedingung:** Immer. Rechteübersicht nach DSGVO Art. 13, Art. 15 bis 22.

**Text:**

> Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und gegebenenfalls ein Recht auf Berichtigung oder Löschung dieser Daten (DSGVO Art. 15 bis 17 – PRÜFEN, ob weitere Artikel zu nennen sind).
>
> Sie haben außerdem das Recht auf Einschränkung der Verarbeitung, auf Datenübertragbarkeit und auf Widerspruch (DSGVO Art. 18 bis 21 – PRÜFEN). Eine erteilte Einwilligung können Sie jederzeit widerrufen; die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt davon unberührt (DSGVO Art. 7 – PRÜFEN).
>
> Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden: [Kontaktadresse des Kunden].
>
> Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung widerrufen, werden Ihre Daten gelöscht, sofern keine anderen rechtlich zulässigen Gründe für die Speicherung bestehen; im letzteren Fall erfolgt die Löschung nach Fortfall dieser Gründe [konkrete gesetzliche Fristen – PRÜFEN].

**Platzhalter:** [Kontaktadresse des Kunden], [ggf. Angaben zum Datenschutzbeauftragten des Kunden, falls bestellt]

**Anwaltsfrage:** [ANWALT-13] Bitte Rechteübersicht, Artikel-Verweise, Ansprechweg (inklusive Datenschutzbeauftragter, falls bestellt – PRÜFEN, ab wann Pflicht) und die allgemeine Speicherdauer-Formulierung bestätigen.

## B14 – Beschwerderecht (immer einblenden)

**Bedingung:** Immer.

**Text:**

> Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
>
> Zuständige Aufsichtsbehörde für uns: [Name und Anschrift der zuständigen Aufsichtsbehörde des Kunden].

**Platzhalter:** [Name und Anschrift der zuständigen Aufsichtsbehörde des Kunden]

**Anwaltsfrage:** [ANWALT-14] Bitte klären, ob die konkrete Aufsichtsbehörde je Kunde (nach Sitz) benannt werden muss oder ein allgemeiner Hinweis genügt.

## B15 – Datenübermittlung in Drittländer (einblenden, wenn zutreffend)

**Bedingung:** Einblenden, sobald ein eingeblendeter Baustein eine Übermittlung in ein Drittland auslöst (derzeit: Vercel/USA als Hosting-Anbieter; bei Buchung mit Kalender-Sync oder Social-Einbettungen zusätzlich der jeweilige Anbieter).

**Text:**

> Die Auslieferung dieser Website über Vercel Inc. (USA) kann eine Übertragung technischer Daten (zum Beispiel IP-Adresse) in die USA umfassen. [Garantie für die Übermittlung – PRÜFEN, zum Beispiel Auftragsverarbeitungsvertrag und zusätzliche Maßnahmen.] Weitere Drittlandübermittlungen finden nur statt, soweit in den eingeblendeten Bausteinen genannt (zum Beispiel Kalender-Synchronisation, eingebettete Social-Inhalte).

**Platzhalter:** [Garantie für die Übermittlung – PRÜFEN]

**Anwaltsfrage:** [ANWALT-15] Bitte den Drittlandtransfer je Anbieter (Vercel, ggf. Kalender, ggf. Social-Anbieter) prüfen und die tragende Garantie vorgeben (DSGVO Art. 44 ff. – PRÜFEN).

---

## 2. Pflichtangaben im Impressum (DDG 5)

Quelle im Code: `src/pages/impressum.astro` stellt alle Felder aus `config/legal.json` dar (Bedingungsanzeige für Register, USt-IdNr., Berufsangaben, Aufsichtsbehörde). Je Kunde zu befüllen:

- Firmenname inkl. Rechtsform, Vor- und Nachname der vertretungsberechtigten Person, vollständige Geschäftsanschrift (kein Postfach), Telefonnummer mit Vorwahl, E-Mail-Adresse.
- Falls vorhanden: Handelsregister (Art, Nummer, Amtsgericht), Umsatzsteuer-Identifikationsnummer.
- Verantwortlicher für den Inhalt nach § 18 Abs. 2 MStV (Regelfall: Geschäftsführung) – [ANWALT-16: bitte bestätigen, dass die MStV-Benennung so ausreicht; Rechtsgrundlage jenseits DDG 5 – PRÜFEN].
- Bei reglementierten Berufen: Berufsbezeichnung, Kammer, berufsrechtliche Regelungen, zuständige Aufsichtsbehörde – [ANWALT-17: bitte je betroffenem Kunden prüfen, welche Angaben Pflicht sind].
- Hinweis auf EU-Streitschlichtung und Verbraucherstreitbeilegung: Derzeit gibt die Seite an, nicht an Streitbeilegungsverfahren teilzunehmen – [ANWALT-18: bitte je Kunde bestätigen oder kundenindividuelle Fassung vorgeben; Rechtsgrundlagen – PRÜFEN].

Das Impressum muss von jeder Seite erreichbar sein (Footer-Link genügt – PRÜFEN durch Anwalt).

## 3. Mailfußzeile (Transaktions- und Newsletter-Mails)

Jede geschäftliche E-Mail des Kunden (Bestell-/Anfragebestätigungen, Newsletter, Testmails) trägt in der Fußzeile: Firmenname inkl. Rechtsform, vertretungsberechtigte Person, ladungsfähige Anschrift (kein Postfach), Kontakt (Telefon, E-Mail), ggf. Register- und Umsatzsteuerangaben – also dieselben Pflichtangaben wie im Impressum. Zusätzlich: Abmeldelink in jeder Newsletter-Mail (Ein-Klick-Abmeldung – PRÜFEN, Umsetzung bei Resend Broadcasts) und Kennzeichnung des Newsletters als Werbung des Kunden (Betreff und Absender nicht irreführend, UWG 7 – PRÜFEN).

**Anwaltsfrage:** [ANWALT-19] Bitte Pflichtumfang der Mailfußzeile je Kundentyp und Mailart (Bestätigungs-, Test-, Newsletter-Mails), Kennzeichnungspflichten und die Ein-Klick-Abmeldung bestätigen; Vorlage der Fußzeile aus dem Newsletter-Konzept (§3.3) freigeben.

---

## 4. Konzept: Rechtstext-Felder in `config/legal.json` und Kundendatenbank, automatische Zusammensetzung

### 4.1 Felder in `config/legal.json` je Kunde (bestehende Felder weiterführen, fehlende ergänzen)

Bestehend (Datei gelesen, Stand 25.11.2026): `legal.company` (name, legalForm, representedBy), `legal.address` (street, zip, city, country), `legal.contact` (phone, email), `legal.register` (type, number, court), `legal.vatId`, `legal.responsibleForContent`, `legal.professionalRegulations`, `legal.supervisoryAuthority`, `legal.hosting` (provider, address, privacyUrl), `legal.dataProtectionOfficer`, `legal.analytics` (enabled, tool).

Zu ergänzen (Vorschlag, Wortlaut der Ergänzungen vom Anwalt freigeben lassen):

- `legal.privacyContact`: Kontaktadresse für Betroffenenrechte/Widerruf (falls abweichend von `legal.contact.email`).
- `legal.supervisoryAuthorityAddress`: Name und Anschrift der zuständigen Aufsichtsbehörde (Baustein B14).
- `legal.senderDomain`: verifizierte Absenderdomain je Kunde (Bausteine B6/B7), daneben Verifizierungsstand (nur Status, keine Schlüssel).
- `legal.modules`: Schalter je Modul (`contact`, `newsletter`, `booking`, `bookingCalendarSync`, `reviews`, `socialEmbed`, `analytics`), aus denen sich die Einblendbedingungen der Bausteine B5 bis B11 ableiten.
- `legal.legalVersion`: freigegebene Wortlaut-Version (zum Beispiel „DSE-Bausteine v1.0 – freigegeben am [Datum]") und `legal.legalDate`: Freigabedatum. Beide Felder setzt ausschließlich der Anwalt beziehungsweise Nick nach Freigabe.

**Anwaltsfrage:** [ANWALT-20a] Bitte Feldliste bestätigen: Welche Angaben müssen zwingend in `config/legal.json` stehen, welche gehören in die Datenbank, und genügen Versionsnummer plus Datum als Freigabenachweis?

### 4.2 Felder in der Kundendatenbank (PostgreSQL, je Kunde getrennt)

- Newsletter-Nachweise (Abonnent, Status, Zeitpunkte Anmeldung/Bestätigung/Abmeldung, Einwilligungstext-Version, Quelle, gekürzte Herkunftskennung), Kampagnen-Kennung mit Empfängerprüfsumme, Zustellereignisse, Sperrliste (Adresse oder Prüfwert, Grund, Zeitpunkt) – geführt nach Newsletter-Konzept §5 und `docs/NEWSLETTER-DATENSCHUTZ.md`.
- Formulareingänge nur, falls die Datenbankablage beschlossen wird (Baustein B5, [ANWALT-5]); andernfalls kein Eingangs-Archiv in der Datenbank.
- Bewertungen mit Token-Status (falls Modul aktiv), Buchungs-/Termindaten (falls Modul aktiv), Einwilligungsprotokolle des Cookie-Banners (Einwilligung je Zweck mit Zeitpunkt – PRÜFEN, ob zu speichern).
- Export- und Auskunftsprotokolle (Zeitpunkt, Umfang, Ausführender – ohne Inhaltskopien); Löschvormerkungen mit Backup-Verfall.

### 4.3 Automatische Zusammensetzung durch die KI (ohne Wortlautänderung)

1. Die KI liest je Kunde ausschließlich die Modulliste (`legal.modules`) und die Kunden- und Firmendaten (`legal.company`, `legal.address`, `legal.contact`, Register-, Aufsichts- und Domain-Felder).
2. Eingeblendet wird jeder Baustein, dessen Bedingung zutrifft; Unterfälle (Buchung a/b, Social a/b) wählt die KI nach den Modullschaltern. Nicht zutreffende Bausteine entfallen vollständig.
3. Die KI füllt nur die Platzhalter in eckigen Klammern mit den Kunden- und Firmendaten. Den freigegebenen Wortlaut (Absätze außerhalb der Platzhalter) verändert sie nicht: keine Umformulierung, keine Kürzung, keine Ergänzung.
4. Jede erzeugte Erklärung trägt Kopfzeile mit Wortlaut-Version und Freigabedatum (`legal.legalVersion`, `legal.legalDate`) sowie die Liste der eingeblendeten Bausteine (zum Beispiel „B1, B2, B3, B4, B5, B6, B9, B12, B13, B14, B15").
5. Bei Freigabe eines neuen Wortlauts durch den Anwalt hinterlegt Nick Version und Datum; die KI erzeugt die Erklärung neu. Alte Fassungen bleiben mit Version und Datum aufbewahrt (Nachweis für bestehende Einwilligungen – PRÜFEN, Dauer siehe [ANWALT-7]).

**Anwaltsfrage:** [ANWALT-20b] Bitte das Zusammensetzungs-Verfahren freigeben: Genügt die Platzhalterfüllung durch die KI ohne Wortlautänderung, und sind Version plus Datum als Nachweis ausreichend? Falls zusätzlich eine menschliche Schlusskontrolle je Kunde Pflicht ist, bitte vorgeben.

---

## 5. Anwaltsfragen – Sammelliste

| Nr. | Baustein | Frage |
|---|---|---|
| [ANWALT-1] | B1 | Benennung der verantwortlichen Stelle je Kundentyp; Erläuterungssatz behalten oder streichen? |
| [ANWALT-2] | B2 | Vercel-AVV, Verarbeitungsort, Protokolldaten, Drittlandgarantie (Art. 28, Art. 44 ff. – PRÜFEN). |
| [ANWALT-3] | B3 | Rechtsgrundlage und Speicherdauer der Server-Logfiles; konkrete Löschfrist vorgeben? |
| [ANWALT-4] | B4 | Lokale Schriften: kein Drittlandtransfer-Baustein nötig? Schriftnamen nennen? |
| [ANWALT-5] | B5 | Kontaktformular: Rechtsgrundlage je Anfrageart, Spam-Schutz, Zustellweg, Aufbewahrungsdauer, Datenbankablage ja/nein? |
| [ANWALT-6] | B6 | Resend-AVV, Anbieterangaben, Verarbeitungsort, Drittlandgarantie; Zustelldaten hier oder nur in B7? |
| [ANWALT-7] | B7 | Newsletter-Texte, Rechtsgrundlagen, Fristen (unbestätigt, Nachweise, Sperrliste), UWG 7, Messung freigeben. |
| [ANWALT-8] | B8 | Buchung: Rechtsgrundlage, Speicherdauer; bei Kalender-Sync Anbieter, AVV, Ort, Drittland (Art. 28, Art. 44 ff. – PRÜFEN). |
| [ANWALT-9] | B9 | TDDDG-Verweis, Abgrenzung notwendiger Cookies, Banner-Ablauf; Analyse-Wortlaut je Kunde vorgeben? |
| [ANWALT-10] | B10 | Bewertungen: Prüfverfahren, UWG-Echtheit (PRÜFEN), Namen/Fotos, Aufbewahrungsfristen. |
| [ANWALT-11] | B11 | Social: Verlinkung oder Einbettung je Kunde; bei Einbettung Anbieter, Daten, Grundlage, Drittland (Art. 44 ff. – PRÜFEN). |
| [ANWALT-12] | B12 | Serverstandort, Schnittstellen-Härtung, Sicherungsanbieter mit Löschschutz, Backup-Verfall, Verzeichnis der Verarbeitungstätigkeiten (Art. 28, 30, 32, 33, 34, 35 – PRÜFEN). |
| [ANWALT-13] | B13 | Rechteübersicht, Artikel-Verweise, Ansprechweg, Datenschutzbeauftragter (Pflicht ab wann – PRÜFEN), Speicherdauer-Formulierung. |
| [ANWALT-14] | B14 | Konkrete Aufsichtsbehörde je Kunde benennen oder allgemeiner Hinweis? |
| [ANWALT-15] | B15 | Drittlandtransfer je Anbieter prüfen, tragende Garantie vorgeben (Art. 44 ff. – PRÜFEN). |
| [ANWALT-16] | Impressum | MStV-Benennung ausreichend; Rechtsgrundlage jenseits DDG 5 – PRÜFEN. |
| [ANWALT-17] | Impressum | Berufsrechtliche Pflichtangaben je betroffenem Kunden prüfen. |
| [ANWALT-18] | Impressum | EU-Streitschlichtung/Verbraucherstreitbeilegung je Kunde bestätigen; Rechtsgrundlagen – PRÜFEN. |
| [ANWALT-19] | Mailfußzeile | Pflichtumfang je Kundentyp/Mailart, Kennzeichnung, Ein-Klick-Abmeldung; Fußzeilen-Vorlage freigeben. |
| [ANWALT-20a] | Konzept | Feldliste `config/legal.json` vs. Datenbank; Version plus Datum als Freigabenachweis ausreichend? |
| [ANWALT-20b] | Konzept | Zusammensetzungs-Verfahren freigeben; menschliche Schlusskontrolle je Kunde Pflicht? |

## 6. Version

Entwurf v1.0 vom 25.11.2026 zur anwaltlichen Prüfung. Wortlaut-Version und Freigabedatum werden erst nach Freigabe durch den Anwalt vergeben (`legal.legalVersion`, `legal.legalDate`). Bis dahin darf kein Baustein auf einer Kunden-Homepage erscheinen.
