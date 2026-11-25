# Newsletter-Modul – Datenschutz- und Rechtsgrundlage (Entwurf)

Stand: 25.11.2026. Status: Entwurf, keine Umsetzung, keine Rechtsberatung.

**Wichtiger Hinweis: Dies ist kein Rechtsrat.** Dieses Dokument ist eine Arbeitsgrundlage für das Newsletter-Modul. Vor dem ersten Kunden und vor dem ersten Versand muss eine fachkundige Stelle (zum Beispiel Fachanwaltschaft für IT-/Datenschutzrecht) alle Texte, Fristen und Verträge prüfen und freigeben. Das Konzept selbst weist darauf hin (HPSE-Newsletter-Konzept, Abschnitt 10 und 9: rechtliche Prüfung vor dem ersten Kunden).

Grundlagen dieses Entwurfs (nur gelesen, nichts geändert): HPSE-Newsletter-Konzept vom 25.11.2026, docs/WORKFLOW-PLAN.md (Version 3), docs/DATENKLASSEN.md, docs/MIGRATION-POSTGRES.md, Prototyp prototypes/newsletter/index.html, bestehende Umsetzung src/lib/db.ts und src/pages/api/**/newsletter/**. Stellen, die in den belegten Unterlagen nicht abschließend geklärt sind, sind mit **PRÜFEN** markiert. Nichts wurde erfunden; was nicht belegbar war, ist als offen benannt.

Geltungsbereich: Newsletter als optionales Zusatzmodul je Kunde (WORKFLOW-PLAN §4, Konzept §1). Kontaktformular- und Passwort-Zurücksetzen-Mailweg sind Pflicht-Basis der Phase 1 und nicht Teil dieses Dokuments.

## 1. Einwilligungstext (Entwurf, versioniert)

Grundsatz: Einwilligung per nicht vorab angekreuztem Häkchen plus Double-Opt-in (Konzept §3.1). Die Einwilligung muss laut Konzept Absender, Zweck und Hinweis auf Widerruf enthalten; der Datenschutz-Link ist Pflicht. Die Version des Textes wird je Abonnent gespeichert (bestehend: Feld consent_version in newsletter_subscribers, derzeit Default v1; künftig echte Versionierung je Einwilligungstext-Tabelle nach Konzept §5).

### 1.1 Checkbox-Text (kurz, neben dem Häkchen)

> Ja, ich möchte den Newsletter von [Kundenname] per E-Mail erhalten (etwa [Frequenz, zum Beispiel ein- bis zweimal im Monat]). Ich kann meine Einwilligung jederzeit widerrufen, zum Beispiel über den Abmeldelink in jeder E-Mail. Wie meine Daten verarbeitet werden, steht in der Datenschutzerklärung.

Anpassung je Kunde: [Kundenname], [Frequenz] und Absenderadresse ersetzen. Kein vorab gesetztes Häkchen. Der Link zur Datenschutzerklärung des Kunden steht direkt beim Formular (Konzept §3.1).

### 1.2 Ausführliche Fassung (zum Beispiel unter dem Formular oder verlinkt)

> Mit Ihrer Anmeldung willigen Sie ein, dass [Kundenname, Anschrift] Ihnen per E-Mail einen Newsletter mit [Inhaltsbeschreibung, zum Beispiel Aktionen, neue Karte, besondere Öffnungszeiten] zusendet. Dazu speichern wir Ihre E-Mail-Adresse [und, falls angegeben, Ihren Vornamen], den Zeitpunkt Ihrer Anmeldung und Ihrer Bestätigung, die Fassung dieses Einwilligungstextes sowie technische Nachweise der Bestätigung. Rechtsgrundlage ist Ihre Einwilligung. Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen, zum Beispiel über den Abmeldelink in jeder E-Mail oder per Nachricht an [Kontaktadresse des Kunden]. Nach dem Widerruf erhalten Sie keinen Newsletter mehr. Einzelheiten stehen in der Datenschutzerklärung des Kunden.

### 1.3 Versionierung

- Jede Fassung erhält eine Versionsnummer (v1, v2, …) mit Gültig-ab-Datum. Gespeichert werden laut Konzept §5: Version, Text, gültig ab.
- Beim Abonnenten werden laut Konzept §5 und §3.1 gespeichert: Einwilligungstext (Version), Zeitpunkte Anmeldung und Bestätigung, Quelle (Seite/Formular), gekürzte Herkunftskennung.
- Bestehende Umsetzung (src/lib/db.ts): Tabelle newsletter_subscribers mit Feldern email, first_name, status (pending/confirmed/unsubscribed), doi_token_hash, unsubscribe_token_hash, consent_version (Default v1), created_at, confirmed_at, unsubscribed_at. **PRÜFEN:** Ob die bestehende Tabelle für den Produktivbetrieb ausreicht (fehlend gegenüber Konzept §5: Quelle, gekürzte Herkunftskennung, Einwilligungstext-Versionstabelle, Kampagnen-/Ereignis-/Sperrlisten-Tabellen, Double-Opt-in-Nachweis mit Zeitpunkten und Missbrauchsschutz-Protokoll). Die PostgreSQL-Umsetzung je Kunde ist noch offen (MIGRATION-POSTGRES.md, DATENKLASSEN.md).
- Bei Textänderung: neue Version anlegen, alte Fassung aufbewahren (Nachweis für bestehende Einwilligungen). Bestehende Abonnenten müssen bei wesentlicher Änderung neu einwilligen — **PRÜFEN** durch Fachkundige, wann eine erneute Einwilligung nötig ist.

## 2. Hinweistexte am Anmeldeformular (Entwurf)

Abgestimmt auf Prototyp (Ansicht 1) und Konzept §3.1. Ton sachlich und knapp gehalten.

- Unter der Überschrift (Zweck und Frequenz): „Ein- bis zweimal im Monat: [Inhalte des Kunden]. Direkt in Ihr Postfach."
- Pflichtfeld E-Mail: Label „E-Mail-Adresse". Fehlertext: „Bitte geben Sie eine gültige E-Mail-Adresse ein."
- Vorname (freiwillig): Label „Vorname (freiwillig)".
- Unter dem Absende-Knopf: „Danach schicken wir Ihnen eine E-Mail mit einem Bestätigungslink. Erst wenn Sie darauf klicken, sind Sie angemeldet."
- Nach Absenden (Hinweisseite, verrät nichts über Bestandsadressen — Konzept §3.1 Punkt 5): „Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung. Wir haben eine E-Mail an [Adresse] geschickt. Bitte klicken Sie darin auf den Bestätigungslink. Erst danach erhalten Sie den Newsletter." Ergänzung: „Nichts angekommen? Schauen Sie bitte auch im Spam-Ordner nach. Der Link ist [Frist] gültig." Konkrete Frist (Prototyp: 24 Stunden) je Kunde festlegen und hier einsetzen.
- Bestätigungsseite: „Vielen Dank, Ihre Anmeldung ist bestätigt. Ab sofort erhalten Sie den Newsletter von [Kundenname]. Jede E-Mail enthält einen Abmeldelink."
- Link abgelaufen/ungültig (ohne Preisgabe von Gründen): „Dieser Link ist nicht mehr gültig. Sie können sich einfach noch einmal anmelden." — **PRÜFEN:** ob bei abgelaufenen Links eine erneute Anmeldung ohne Sperrlisten-Verstoß möglich ist (Sperrliste darf nicht umgangen werden, Konzept §3.2).
- Datenschutz-Hinweis beim Formular (Pflicht): „Wie wir Ihre Daten verarbeiten, steht in der Datenschutzerklärung." (Link auf die Datenschutzerklärung des Kunden.)
- Abmeldeseite (ohne Login, Konzept §3.2): „Möchten Sie den Newsletter abbestellen? Sie erhalten dann keine weiteren E-Mails von [Kundenname]. Ein Login ist nicht nötig." Nach Klick: „Sie sind abgemeldet. Die Adresse [Adresse] erhält keinen Newsletter mehr."
- Bestehende Umsetzung weicht teils ab (zum Beispiel verrät subscribe.ts bei bereits bestätigten Adressen den Bestand: „Sie sind bereits erfolgreich angemeldet"). Das widerspricht Konzept §3.1 Punkt 5 (keine Preisgabe). **PRÜFEN** und vor Produktivbetrieb angleichen: Doppelte Anmeldungen erzeugen keine zweite Mail und verraten nicht, ob eine Adresse existiert.

## 3. Textbausteine für die Datenschutzerklärung des Kunden (Entwurf)

Diese Bausteine ersetzt der Kunde in seiner Datenschutzerklärung (je Kunde eigene Erklärung). Platzhalter in eckigen Klammern je Kunde ausfüllen. Vor Live-Gang fachkundig prüfen lassen (vgl. docs/legal-checklist.md: Abgleich mit aktuellem Generator oder Fachanwaltschaft).

1. **Zweck und Rechtsgrundlage:** „Wir versenden unseren Newsletter auf Grundlage Ihrer Einwilligung. Die Anmeldung erfolgt über ein Double-Opt-in: Nach Ihrer Anmeldung erhalten Sie eine Bestätigungsmail; erst nach Klick auf den Bestätigungslink ist Ihre Adresse freigeschaltet."
2. **Daten bei Anmeldung:** „Gespeichert werden Ihre E-Mail-Adresse [und, falls angegeben, Ihr Vorname], der Zeitpunkt von Anmeldung und Bestätigung, die Fassung des Einwilligungstextes, die Quelle der Anmeldung sowie eine gekürzte technische Herkunftskennung zum Missbrauchsschutz."
3. **Versanddienstleister:** „Der Versand erfolgt über Resend [Anbieterangaben ergänzen — PRÜFEN: genaue Anbieterbezeichnung, Anschrift, Land der Verarbeitung, DPA-Verweis]. Die Auslieferung der Website erfolgt über Vercel [Angaben ergänzen — PRÜFEN]. Sicherungskopien liegen [Sicherungsspeicher je Kunde benennen — PRÜFEN]. Mit allen Dienstleistern, die personenbezogene Daten sehen, besteht ein Auftragsverarbeitungsvertrag."
4. **Webhooks und Zustelldaten:** „Unser Versanddienstleister meldet uns Zustellprobleme (zum Beispiel unzustellbare Adressen oder Beschwerden) über technische Rückmeldungen. Solche Adressen sperren wir für künftige Newsletter."
5. **Widerruf und Abmeldung:** „Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, zum Beispiel über den Abmeldelink in jeder E-Mail. Die Abmeldung wirkt sofort, auch für bereits geplante Newsletter."
6. **Sperrliste:** „Nach einer Abmeldung, einem harten Rückläufer oder einer Beschwerde speichern wir Ihre Adresse in einer Sperrliste, damit Sie keinen Newsletter mehr erhalten. Die Sperrliste enthält nur die Adresse (oder einen Prüfwert) und den Grund und bleibt bestehen, solange die Sperre erforderlich ist."
7. **Speicherdauer:** „Unbestätigte Anmeldungen löschen wir nach [Frist, Vorschlag 7 Tage — siehe Abschnitt 6]. Einwilligungsnachweise und Sperrlisteneinträge bewahren wir auf, solange dies für den Nachweis der Einwilligung und die Einhaltung der Sperre erforderlich ist [konkrete Frist je Kunde mit Fachkundigen festlegen — siehe Abschnitt 6]."
8. **Ihre Rechte:** „Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung sowie auf Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an [Kontaktadresse des Kunden]. Sie haben außerdem das Recht, sich bei einer Aufsichtsbehörde zu beschweren."
9. **Kein Tracking ohne Einwilligung:** „Öffnungs- und Klickmessung erfolgt nur, wenn Sie dem gesondert zugestimmt haben [PRÜFEN: ob und wie Tracking je Kunde angeboten wird; Konzept §3.3 nennt Zähler für zugestellt/geöffnet nur bei aktivem Tracking mit Einwilligung]."
10. **Export und Protokollierung:** „Exporte der Abonnentenliste erfolgen nur durch den Kunden und werden protokolliert."

## 4. Rollen (Verantwortlicher / Auftragsverarbeiter)

Aus dem Konzept (§2, §9) übernommen, keine eigene Festlegung:

- **Verantwortlicher für die Abonnenten ist der Kunde.** Er entscheidet über Zweck (eigener Newsletter), Inhalte, Frequenz und Empfängerkreis.
- **pixel&code ist Auftragsverarbeiter** und verarbeitet Abonnentendaten nur nach Weisung des Kunden (Plattformbetrieb, Versandabwicklung). pixel&code wertet Abonnentendaten nicht für eigene Zwecke aus (Konzept §2).
- **Unterauftragsverarbeiter** (siehe Abschnitt 5): Resend (Versand), Vercel (Auslieferung der Seite), Sicherungsspeicher. Sie stehen im Verzeichnis der Auftragsverarbeitung und in der Datenschutzerklärung des Kunden (Konzept §2).
- Je Kunde ist ein Auftragsverarbeitungsvertrag erforderlich, bevor das Modul gebucht wird (Konzept §9). **PRÜFEN:** genaue Abgrenzung der Weisungsbefugnisse, agree-te Weisungskette Kunde → pixel&code → Unterauftragsverarbeiter, durch Fachkundige.

## 5. Auftragsverarbeitungsvertrag (Entwurf-Gliederung) und Unterauftragsverarbeiter

Entwurf-Gliederung für einen AVV je Kunde. Kein Vertragstext — die Formulierungen erstellt und prüft eine fachkundige Stelle.

1. Gegenstand und Dauer der Verarbeitung (Newsletter-Anmeldung mit Double-Opt-in, Verwaltung, Versand, Abmeldung, Nachweise).
2. Art und Zweck der Verarbeitung, Arten personenbezogener Daten (E-Mail-Adresse, ggf. Vorname, Zeitpunkte, Einwilligungsversion, Quelle, gekürzte Herkunftskennung, Zustellereignisse, Sperrlistenmerkmale), Kategorien betroffener Personen (Newsletter-Abonnenten des Kunden).
3. Weisungsbindung und Weisungskette; Mitteilungspflicht bei weisungswidrigen Anweisungen.
4. Vertraulichkeit und Zugriffsbeschränkung (nur befugtes Personal, je Kunde getrennte Datenbank/Rolle nach WORKFLOW-PLAN §2 und MIGRATION-POSTGRES.md §2).
5. Unterauftragsverarbeiter: Beauftragung nur mit Zustimmung, Liste unten, Änderungsverfahren.
6. Technische und organisatorische Maßnahmen (Zufalls-Einmalwerte statt Klartext-Adressen in Links, keine Adressen in Logs und KI-Verläufen, Ratenbegrenzung und Missbrauchsschutz, Signaturprüfung bei Webhooks, Protokollierung von Exporten, Vorschau ohne Schlüssel/Versandweg nach Konzept §5/§6).
7. Unterstützung bei Betroffenenrechten, Löschung und Auskunft (Abläufe siehe Abschnitt 8).
8. Löschung und Rückgabe nach Vertragsende (Export des Kunden: Inhalte, Originalbilder, Newsletter-Nachweise in nutzbarem Format — WORKFLOW-PLAN §10; Verfahren vor dem ersten Kunden beschreiben).
9. Nachweispflichten, Prüfrecht des Kunden, Informationspflichten bei Störungen.
10. Ort der Verarbeitung (Funktionen und Datenbank in der EU nach WORKFLOW-PLAN §2 — **PRÜFEN:** tatsächlicher Verarbeitungsort je Unterauftragsverarbeiter, Drittlandtransfer, geeignete Garantien).

### Liste der Unterauftragsverarbeiter (Stand Entwurf, je Kunde zu bestätigen)

| Dienst | Zweck | Anmerkung |
|---|---|---|
| Resend | Versand von Bestätigungs-, Abmelde- und Newsletter-Mails; Spiegel der Versanddaten; Webhook-Rückmeldungen (bounced, complained) | Agentur-Konto mit Team-Kontingent; je Kunde eigene Domain und eigener Schlüssel (Konzept §4). **PRÜFEN:** exakte Anbieterangaben, DPA-Verfügbarkeit, Idempotenz-Schlüssel, Ein-Klick-Abmeldung bei Broadcasts, Rechtebegrenzung je Schlüssel (Konzept §10 offen). |
| Vercel | Auslieferung der Kundenseite (Hosting/CDN, Zwischenspeicher) | Pro Kunde eigenes Projekt, schlüssel projektbezogen begrenzt (WORKFLOW-PLAN §2a). **PRÜFEN:** DPA, Verarbeitungsort, Protokolldaten. |
| Sicherungsspeicher | Sicherung von Datenbank, Medien, Konfiguration und Schlüsseln | Noch offen, ob eigener Server oder EU-Objektspeicher (WORKFLOW-PLAN §2, §14; MIGRATION-POSTGRES.md §2). **PRÜFEN:** Anbieter, Ort, Verschlüsselung, Backup-Verfall, Restore-Verfahren für einzelne Kunden. |

## 6. Löschfristen-Vorschlag je Datenart (mit Begründung)

Alle Fristen sind Vorschläge ab dem jeweiligen Ereignis und müssen vor dem ersten Kunden mit Fachkundigen und je Kunde in der Datenschutzerklärung festgelegt werden (Konzept §5: konkrete Fristen mit dem Kunden und der Datenschutzerklärung abstimmen). Gesetzliche Aufbewahrungspflichten und begründete Löschsperren gehen vor. Medienvarianten, Exporte, Caches, Logs und Backups in das Löschkonzept aufnehmen; Backup-Verfall getrennt festlegen (DATENKLASSEN.md).

| Datenart | Vorschlag | Begründung |
|---|---|---|
| Unbestätigte Anmeldungen (kein Klick auf Bestätigungslink) | 7 Tage, danach Löschung | Kurze Frist begrenzt die Speicherung ohne Einwilligung auf das Nötigste; 7 Tage entsprechen dem Prototyp-Hinweis („wird nach 7 Tagen gelöscht") und DATENKLASSEN.md. Bestätigungslink-Gültigkeit (zum Beispiel 24 Stunden im Prototyp) getrennt und kürzer festlegen. |
| Bestätigte Abonnenten (Adresse, ggf. Vorname, Zeitpunkte, Einwilligungsversion, Quelle) | Bis Widerruf/Abmeldung, danach Umwandlung (siehe Sperrliste/Nachweis) | Speicherung ist für den laufenden Versand erforderlich; nach Wegfall des Zwecks kein Behalten als „aktiver Kontakt". |
| Abmeldung (Status, Zeitpunkt) und Sperrliste (Adresse oder Prüfwert, Grund, Zeitpunkt) | Solange die Sperre erforderlich ist; kein pauschales Löschen ohne Prüfung | Schutzzweck: kein erneuter Versand nach Widerruf, Beschwerde oder hartem Rückläufer, auch nicht über Importe (Konzept §3.2, §3.4). DATENKLASSEN.md: Zeitraum rechtlich und zweckbezogen festlegen. **PRÜFEN:** konkrete Höchstfrist und Rechtsgrundlage der Sperrlisten-Speicherung durch Fachkundige. |
| Einwilligungsnachweise (Text-Version, Zeitpunkte Anmeldung/Bestätigung, Quelle, Protokoll) | Für die Dauer der gesetzlichen Aufbewahrung / Verjährung des Nachweisbedarfs | Nachweis der Einwilligung (Rechenschaftspflicht) und Abwehr unberechtigter Ansprüche. Konkrete Dauer (Konzept §5: „Dauer der gesetzlichen Aufbewahrung") mit Fachkundigen festlegen. **PRÜFEN.** |
| Kampagnen und Empfängerprüfsummen | Bis Vertragsende plus vereinbarte Frist (Vorschlag 90 Tage nach Übergabe, angelehnt an DATENKLASSEN.md Historienfrist) | Nachweis, welche Empfängerliste versandt wurde (Doppelversand-Schutz, Konzept §3.3); danach kein operativer Bedarf. |
| Zustellereignisse (Bounces, Beschwerden je Kampagne) | Bis Wegfall des Sperr-/Nachweiszwecks, Vorschlag an Sperrlistenfrist koppeln | Dienen der Sperrentscheidung und dem Reputationsschutz des Team-Kontingents (Konzept §4: Risiko Team-Reputation). **PRÜFEN.** |
| Export-Dateien und Export-Protokolle | Exporte: nach Übergabe an den Kunden löschen; Protokoll (wer, wann, welcher Umfang) aufbewahren | Datenminimierung beim Kunden-Export; Protokoll dient dem Nachweis (Konzept §3.3/§6: Export protokolliert, nur für den Kunden). Konkrete Protokollfrist mit Fachkundigen klären. **PRÜFEN.** |
| Backups mit Abonnentendaten | Getrennter Backup-Verfall; gelöschte Adressen laufen mit dem Verfall aus den Backups | Backups sind kein Archiv für gelöschte Daten; Restore-Verfahren üben und Verfall dokumentieren (WORKFLOW-PLAN §10). Konkrete Frist offen. **PRÜFEN.** |
| Vorschau- und Testdaten mit echten Adressen | Nur befristet für konkrete Abnahme, danach belegte Löschung; keine Kopie in Backups, Logs oder KI-Verlauf | WORKFLOW-PLAN §8 (Prüfseite mit echten Daten nur auf Zeit) und DATENKLASSEN.md. Testversand nur an die eigene Adresse des Kunden (Konzept §3.3). |

## 7. Nachweis der Einwilligung (Double-Opt-in)

- Anmeldung speichert: Adresse, ggf. Vorname, Zeitpunkt der Anmeldung, Fassung des Einwilligungstextes (Version), Quelle (Seite/Formular), gekürzte Herkunftskennung (Konzept §3.1/§5).
- Bestätigungsmail geht über den Transaktionsweg (Konzept §3.1/§4); Link mit einmaligem, befristetem Einmalwert (Konzept §3.1, §6: zufällige Einmalwerte, keine Adressen im Klartext).
- Beim Klick wird die Adresse „bestätigt" mit Zeitpunkt; erst dann entsteht der Kontakt für den Versand. Ohne Bestätigung kein Newsletter (Konzept §3.1, Abnahmetest 1).
- Erst nach Bestätigung darf die Adresse in Kampagnen aufgenommen werden (Prüfsumme der Empfängerliste je Kampagne, Konzept §3.3/§5).
- Export der Einwilligungsnachweise eines Abonnenten muss vollständig sein (Abnahmetest 8; bestehender Export export.csv.ts liefert derzeit nur bestätigte Adressen mit Basisdaten — **PRÜFEN:** Export vor Produktivbetrieb auf vollständige Nachweise erweitern: Version, Quelle, Zeitpunkte, Statuswechsel).
- Adressen nie in Logs und KI-Verläufe (Konzept §6); das gilt auch für Nachweisführung und Fehlersuche.

## 8. Auskunft, Löschung und Export (Ablauf-Entwurf)

1. **Anfrage entgegennehmen:** Betroffene wenden sich an den Kunden (Kontaktadresse in der Datenschutzerklärung). pixel&code handelt nur nach Weisung des Kunden.
2. **Identität klären:** Absenderadresse mit Abonnentendatensatz abgleichen; bei Zweifeln zusätzliche Bestätigung einholen. Keine Auskunft an Unbefugte. Vorgehen dokumentieren.
3. **Auskunft:** Vollständige Einwilligungsnachweise je Adresse bereitstellen (Adresse, Vorname falls vorhanden, Status, Zeitpunkte Anmeldung/Bestätigung/Abmeldung, Einwilligungstext mit Version, Quelle). Export nur für den Kunden, protokolliert (Konzept §6).
4. **Löschung/Widerruf:** Abmeldung sofort wirksam, auch für geplante Kampagnen (Konzept §3.2); Adresse auf die Sperrliste (nur Adresse/Prüfwert und Grund). Aktive Kontaktdaten löschen, Nachweise und Sperre nach Abschnitt 6 behalten. Über Importe darf die Sperre nicht umgangen werden (Abnahmetest 2).
5. **Export beim Vertragsende:** Inhalte, Originalbilder und Newsletter-Nachweise in nutzbarem Format an den Kunden übergeben; Verfahren vor dem ersten Kunden beschreiben (WORKFLOW-PLAN §10).
6. **Fristen:** Anfragen unverzüglich bearbeiten; konkrete Antwortfrist (zum Beispiel einen Monat) mit Fachkundigen festlegen — **PRÜFEN.**
7. **Dokumentation:** Jede Auskunft, Löschung und jeder Export mit Zeitpunkt, Umfang und Ausführendem protokollieren (ohne Geheimniswerte und ohne unnötige Inhaltskopien).

## 9. Hinweise zu UWG §7 und Impressumspflicht in Mails

- **Einwilligung als Voraussetzung:** Newsletter an Verbraucher ohne vorherige ausdrückliche Einwilligung sind regelmäßig unzulässig. Deshalb: kein Versand ohne bestätigtes Double-Opt-in; keine Importe ohne nachgewiesene Einwilligung (Konzept §1: Import fremder Listen nicht angeboten; nur mit nachgewiesener Einwilligung zulässig). Bestandskunden-Ausnahmen nicht ohne fachkundige Prüfung nutzen — **PRÜFEN.**
- **Werbecharakter erkennbar:** Absender und Betreff dürfen nicht irreführend sein; der Newsletter muss als Werbung des Kunden erkennbar sein. Feste Maske mit geprüftem Absender und Betreff (Konzept §3.3) hilft; Rechtsprüfung je Vorlage einplanen.
- **Abmeldung in jeder Mail:** Jede Mail enthält einen Abmeldelink und einen technischen Abmelde-Header mit Ein-Klick-Abmeldung (Konzept §3.2). Abmeldung ohne Login und ohne Rückfrage; Wirkung sofort. **PRÜFEN:** Umsetzung des Ein-Klick-Abmelde-Headers bei Resend Broadcasts (Konzept §10 offen; Anforderung der großen Mailanbieter an Massenversender).
- **Impressum in der Mail:** Pflichtprüfung beim Speichern umfasst Impressumsangaben in der Fußzeile (Konzept §3.3). Fußzeile je Kunde mit: Firmenname inkl. Rechtsform, vertretungsberechtigte Person, ladungsfähige Anschrift (kein Postfach), Kontakt (Telefon, E-Mail), ggf. Register- und Umsatzsteuerangaben. Quelle der Pflichtangaben: docs/legal-checklist.md (Impressum nach §5 DDG). Die Fußzeile kommt aus der vom Entwickler gestalteten Vorlage des Kunden (Konzept §3.3) und wird vor dem Versand geprüft (Vorschau und Testversand an die eigene Adresse des Kunden).
- **Getrennte Absenderdomain je Kunde** mit SPF, DKIM und DMARC verifizieren (Konzept §3.3/§4); Testmail an gängige Postfächer vor dem ersten Versand (Abnahmetest 7).
- **Aggressivität und Frequenz:** Nur die versprochene Frequenz senden (siehe Einwilligungstext); Versandgrenzen je Kunde und Stopp-Schalter gegen Kontingent- und Reputationsrisiken des Team-Kontos (Konzept §4).

## 10. Offene Rechtsfragen (vor dem ersten Kunden durch Fachkundige zu klären)

1. Einwilligungstext-Fassungen (kurz und ausführlich) und Versionierungsregeln freigeben; klären, wann eine Textänderung eine erneute Einwilligung erfordert.
2. Konkrete Lösch- und Aufbewahrungsfristen je Datenart (Abschnitt 6) einschließlich Rechtsgrundlage der Sperrliste und der Nachweisaufbewahrung.
3. Vollständigkeit des Einwilligungsnachweises und des Exports (derzeitiger Export nur Basisdaten — Erweiterung nötig?).
4. Reichweite der Auskunft (Zustellereignisse, Webhook-Daten, Export-Protokolle) und Antwortfristen.
5. Zulässigkeit und Nachweis eines künftigen Imports mit Einwilligungsnachweis sowie eines künftigen Themen-/Tracking-Angebots (Konzept §8: danach) — derzeit nicht angeboten.
6. UWG-Bestandskunden-Ausnahme: ob und unter welchen Voraussetzungen nutzbar, oder strikte Einwilligungspflicht für alle Empfänger.
7. Impressums- und Kennzeichnungspflichten in Bestätigungs-, Test- und Newsletter-Mails je Kundentyp (Unternehmer, Freiberufler, Vereine).
8. AVV-Formulierungen, Weisungskette und Unterauftragsverarbeiter-Verträge (Resend, Vercel, Sicherungsspeicher) einschließlich Verarbeitungsort, Drittlandtransfer und DPA-Verfügbarkeit.
9. Cookie-/Tracking-Einwilligung für Öffnungs- und Klickmessung, falls je Kunde angeboten.
10. Pflichten je Kunde beim Buchen des Moduls (Konzept §9: AVV, geprüfte Texte, verifizierte Domain, Impressum, Preis und Grenzen) als Abnahme-Checkliste verbindlich machen.
11. Resend-Detailfragen aus dem Konzept (§10): Idempotenz, Ein-Klick-Abmeldung, Rechtebegrenzung je Schlüssel — rechtlich und technisch belegen.

## Quellen (gelesen)

HPSE-Newsletter-Konzept (25.11.2026); docs/WORKFLOW-PLAN.md V3; docs/DATENKLASSEN.md; docs/MIGRATION-POSTGRES.md; Prototyp prototypes/newsletter/index.html; src/lib/db.ts (newsletter_subscribers, Token-Hashes, consent_version); src/pages/api/public/newsletter/subscribe.ts und confirm.ts; src/pages/api/admin/newsletter/export.csv.ts; docs/legal-checklist.md. Resend- und Vercel-Detailseiten wurden in diesem Auftrag nicht erneut aufgerufen; dort ungeprüfte Angaben sind als PRÜFEN gekennzeichnet.
