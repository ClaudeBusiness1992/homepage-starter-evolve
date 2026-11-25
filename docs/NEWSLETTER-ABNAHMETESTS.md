# Newsletter-Modul – Abnahmetests (Testplan)

Stand: 25.11.2026. Status: Testplan, keine Umsetzung, keine Laufzeitprüfung. Grundlage: [Newsletter-Konzept](/home/nick/.herdr-tasks/HPSE-NEWSLETTER-KONZEPT-20261125.md) (Abschnitt 7), [Workflow-Plan V3](/home/nick/ClaudeBusiness/homepage-starter-evolve/worktrees/wt-plattform-20261125/docs/WORKFLOW-PLAN.md), [Datenklassen](/home/nick/ClaudeBusiness/homepage-starter-evolve/worktrees/wt-plattform-20261125/docs/DATENKLASSEN.md), [Migrationsplan](/home/nick/ClaudeBusiness/homepage-starter-evolve/worktrees/wt-plattform-20261125/docs/MIGRATION-POSTGRES.md), Prototyp `prototypes/newsletter/index.html` sowie Bestand `src/lib/db.ts` und `src/pages/api/**/newsletter/**` (nur gelesen, nichts geändert).

Alle Dokumente auf Deutsch. Mit PRÜFEN markierte Stellen hängen von noch nicht belegten Details der Resend-Dokumentation ab und sind vor der Abnahme zu klären. Adressen stehen nie in Logs und nie in KI-Verläufen; Nachweise siehe Nachweis-Spalte je Testfall.

## 1. Teststufen

- **Stufe A – Einheit:** einzelne Regeln ohne Versand (Sperrlistenprüfung, Pflichtprüfung der Maske, Einmalwert-Verbrauch, Ereignis-Entdopplung). Läuft ohne Resend-Konto und ohne Testdomain.
- **Stufe B – Integration:** Zusammenspiel eigene Datenbank zu Resend-Spiegel (Domain-Anlage, Webhook mit Signatur, Broadcast-Standprüfung). Braucht Resend-Testzugang, aber noch keine echte Kampagne.
- **Stufe C – Ende-zu-Ende mit Testdomain:** vollständige Abläufe auf einer Testdomain des Kunden (Anmeldung bis Posteingang, Abmeldung, Kampagnenversand an Testpostfächer). Erst nach bestandener Stufe A und B.

Abnahmereihenfolge: A, dann B, dann C. Ein Testfall der Stufe C gilt nur als bestanden, wenn alle zugehörigen Fälle der Stufen A und B bestanden sind.

## 2. Testdaten (keine echten Adressen)

- Ausschließlich synthetische Adressen auf der Testdomain des Kunden, zum Beispiel nach dem Muster vorname.nachname plus laufende Nummer auf der Testdomain. Niemals echte Kunden- oder Abonnentenadressen verwenden.
- Für Webhook- und Bounce-Tests nur die von Resend dafür vorgesehenen Testadressen und Testereignisse verwenden (PRÜFEN: genaue Testadressen und Ereignisnamen in der Resend-Dokumentation).
- Testpostfächer für die Empfängersicht bei gängigen Mailanbietern werden erst in Stufe C angelegt und nach der Abnahme wieder gelöscht.
- Exporte aus Abnahmetests enthalten nur Testdaten und werden nach der Abnahme belegt gelöscht.

## 3. Bekannte Bestandsabweichungen (Ziel des Tests, nicht des Bestands)

Beim Lesen des Bestands fielen drei Abweichungen vom Zielvertrag auf, die die Abnahmetests ausdrücklich prüfen müssen:

- Die Anmelderoute verrät bereits bestätigten Adressen heute eine andere Antwort als neuen Adressen; der Vertrag verlangt eine neutrale, identische Antwort für alle Fälle.
- Die Bestätigungsroute prüft heute weder Befristung (24 Stunden) noch Einmalgebrauch; der Vertrag verlangt beides.
- Der Export enthält heute nur bestätigte Adressen; der Vertrag verlangt drei wählbare Umfänge einschließlich Einwilligungsnachweis.

## 4. Abnahmetests aus Konzept Abschnitt 7

Jeder Testfall nennt Vorbedingung, Schritte, erwartetes Ergebnis, Nachweis und ob er automatisierbar ist. „Nachweis" meint immer einen Beleg ohne personenbezogene Inhalte in Logs (Zeitpunkt, Zähler, Status, Protokolleintrag).

### T1 – Anmeldung ohne Bestätigung führt nie zu einem Newsletter

Vorbedingung: Testadresse ist weder Abonnent noch auf der Sperrliste. Eine Kampagne ist versandbereit.

Schritte: Anmeldeformular mit der Testadresse, gültiger Adresse und gesetztem Einwilligungs-Häkchen absenden. Bestätigungslink nicht anklicken. Danach die vorbereitete Kampagne versenden lassen.

Erwartetes Ergebnis: Der Eintrag bleibt „unbestätigt", die Testadresse erhält keine Bestätigungsmail außer der einen Transaktionsmail und erhält den Newsletter nicht. Nach der im Vertrag festgelegten Frist wird der unbestätigte Eintrag gelöscht.

Nachweis: Statusabfrage des Eintrags („unbestätigt"), Versandprotokoll ohne die Testadresse, Löschprotokoll nach Fristablauf.

Automatisierbar: ja (Stufe A und C).

### T2 – Abmeldung, dann Import eines alten Exports, dann Testkampagne: Adresse bleibt ausgeschlossen

Vorbedingung: Testadresse ist bestätigter Abonnent. Ein Export mit dieser Adresse liegt vor (alter Stand, als sie noch bestätigt war). Der optionale Import mit Nachweis ist freigegeben; sonst entfällt der Import-Schritt und die Sperre wird direkt gegen eine erneute Anmeldung geprüft.

Schritte: Testadresse über den Abmeldelink abmelden. Danach den alten Export über den Importweg einspielen (oder, falls Import noch nicht angeboten wird: erneute Anmeldung derselben Adresse ohne neue Bestätigung versuchen). Danach eine Testkampagne an alle versenden.

Erwartetes Ergebnis: Die Adresse bleibt ausgeschlossen und erhält die Kampagne nicht. Der Import umgeht die Sperre nicht; ohne neue bestätigte Einwilligung entsteht kein neuer bestätigter Eintrag. Die Abmeldung verrät Dritten nicht, ob die Adresse existiert (neutrale Antwort).

Nachweis: Sperrlisten-Eintrag mit Grund und Zeitpunkt, Empfängerliste der Kampagne ohne die Testadresse, Importprotokoll mit Abweisung.

Automatisierbar: ja (Stufe A und C).

### T3 – Doppelter Aufruf des Sendens oder Zeitüberschreitung erzeugt keinen zweiten Versand

Vorbedingung: Kampagne im Status „versandbereit" mit festgeschriebener Empfängerliste und Prüfsumme. Testempfänger sind bestätigte Testadressen.

Schritte: Senden zweimal unmittelbar hintereinander auslösen (zwei Klicks, zwei Anfragen). Zusätzlich: Sendeaufruf mit simulierter Zeitüberschreitung wiederholen, sodass der zweite Aufruf erst nach dem ersten beim Server ankommt.

Erwartetes Ergebnis: Genau ein Versand je Empfängeradresse. Der zweite Aufruf meldet „bereits gestartet" und löst keinen zweiten Versand aus (feste Kampagnenkennung, Standprüfung vor erneutem Senden, PRÜFEN: Idempotenz-Schlüssel der Resend-Broadcast-API).

Nachweis: Kampagnenstatus und Versandkennung (eine Kennung), Zähler der zugestellten Mails je Testadresse (genau eine), Serverprotokoll beider Aufrufe.

Automatisierbar: ja (Stufe B und C).

### T4 – Beschwerde oder harter Rückläufer sperrt die Adresse für alle künftigen Kampagnen

Vorbedingung: Testadresse ist bestätigter Abonnent und hat eine Kampagne erhalten.

Schritte: Für die Testadresse ein Beschwerde- oder Hart-Rückläufer-Ereignis über den Resend-Testweg auslösen. Danach eine neue Kampagne versenden.

Erwartetes Ergebnis: Die Adresse landet mit Grund und Zeitpunkt auf der Sperrliste und erhält keine künftige Kampagne mehr. Der Statuswechsel ist in der Abonnentenliste sichtbar („gesperrt").

Nachweis: Sperrlisten-Eintrag mit Ereignisbezug, Empfängerliste der Folgekampagne ohne die Testadresse, Zustellstatistik der ersten Kampagne mit dem Ereignis.

Automatisierbar: teilweise (Webhook-Verarbeitung ja, Stufe B; das Auslösen echter Beschwerden nur über den Resend-Testweg, Stufe C).

PRÜFEN: genaue Ereignisnamen der Resend-Dokumentation.

### T5 – Vorschau-Umgebung kann nicht versenden

Vorbedingung: Vorschau-Umgebung des Kundenprojekts ist verfügbar.

Schritte: In der Vorschau versuchen, eine Testmail auszulösen, eine Kampagne zu starten und einen Webhook mit echten Adressen zu verarbeiten. Zusätzlich prüfen, ob ein Resend-Schlüssel oder Versandweg in der Vorschau-Konfiguration vorhanden ist.

Erwartetes Ergebnis: Kein Versand ist möglich; alle Versandwege sind technisch gesperrt (kein Schlüssel, kein Versandweg), nicht nur ausgeblendet. Webhooks und Tracking sind deaktiviert.

Nachweis: Konfigurationsbeleg (kein Schlüssel in der Vorschau), Fehlerantworten der Versandwege, leeres Versandprotokoll des Resend-Kontos für den Vorschauzeitraum.

Automatisierbar: ja (Stufe B, Konfigurationsprüfung auch in Stufe A).

### T6 – Versandgrenze je Kunde greift, und der Stopp-Schalter wirkt sofort

Vorbedingung: Für den Testkunden ist eine niedrige Versandgrenze vereinbart. Eine Kampagne mit mehr Empfängern als die Grenze ist vorbereitet; eine zweite Kampagne läuft oder ist geplant.

Schritte: Erstens die Kampagne über der Grenze zum Versand freigeben. Zweitens während eines laufenden oder geplanten Versands den Stopp-Schalter für den Kunden betätigen.

Erwartetes Ergebnis: Der Versand über der Grenze wird verweigert (klare Meldung, kein Teilversand ohne Kennzeichnung). Nach Betätigen des Stopp-Schalters startet kein weiterer Versand dieses Kunden mehr; bereits geplante Versände werden angehalten. Der Stopp ist protokolliert.

Nachweis: Ablehnungsantwort mit Grund, Versandzähler des Kunden, Stopp-Protokoll mit Zeitpunkt, Empfängerlisten ohne Nachsendungen nach dem Stopp.

Automatisierbar: ja (Stufe B und C).

### T7 – Verifizierte Absenderdomain: SPF, DKIM und DMARC sind gültig, Testmail wird zugestellt und nicht als Spam eingestuft

Vorbedingung: Absenderdomain des Testkunden ist per API angelegt; DNS-Einträge sind gesetzt.

Schritte: Prüfung per API anstoßen und Einträge für SPF, DKIM und DMARC auslesen. Danach eine Testmail an Testpostfächer bei gängigen Mailanbietern senden und dort Posteingang und Spam-Einstufung prüfen.

Erwartetes Ergebnis: Alle drei Prüfungen sind gültig. Die Testmail landet im Posteingang und wird nicht als Spam eingestuft.

Nachweis: API-Prüfergebnis mit Zeitpunkt, Screenshots oder Protokolle der Testpostfächer (Posteingang, keine Spam-Markierung).

Automatisierbar: teilweise (DNS-Prüfung ja; Posteingangs- und Spam-Prüfung manuell, Stufe C).

### T8 – Export der Einwilligungsnachweise eines Abonnenten ist vollständig

Vorbedingung: Testabonnent mit vollständiger Historie (Anmeldezeitpunkt, Einwilligungstext mit Version, Quelle, Bestätigungszeitpunkt, optional Abmeldung mit Grund).

Schritte: Export im Umfang „mit Einwilligungsnachweis" für diesen Abonnenten anfordern. Exportdatei öffnen und alle Felder gegen die Datenbankeinträge prüfen. Zusätzlich Export im Umfang „nur bestätigte" und „alle mit Status" anfordern und vergleichen.

Erwartetes Ergebnis: Der Nachweis-Export enthält Adresse, Vornamen, Status, alle Zeitpunkte (Anmeldung, Bestätigung, Abmeldung), Einwilligungstext mit Version und Quelle. Kein Feld fehlt, keine Adresse aus dem gewählten Umfang fehlt. Jeder Export ist protokolliert.

Nachweis: Exportdatei (Testdaten) plus Exportprotokoll mit Zeitpunkt, Benutzer und Umfang.

Automatisierbar: ja (Stufe A).

## 5. Missbrauchs- und Fehlerfälle

### F1 – Token-Wiederverwendung (Bestätigung zweimal angeklickt)

Vorbedingung: Testadresse ist angemeldet, aber noch unbestätigt; Bestätigungslink liegt vor.

Schritte: Bestätigungslink zweimal aufrufen (zweiter Aufruf nach erfolgreicher Bestätigung, auch parallel).

Erwartetes Ergebnis: Genau eine Bestätigung; der zweite Aufruf ändert nichts und zeigt die neutrale Seite „Link nicht mehr gültig" mit Angebot zur erneuten Anmeldung. Es entsteht kein zweiter Datensatz.

Nachweis: Status und Zeitpunkte des Eintrags (eine Bestätigung), Antwortseite des zweiten Aufrufs.

Automatisierbar: ja (Stufe A).

### F2 – Abgelaufener Link

Vorbedingung: Bestätigungslink einer Testanmeldung, dessen Gültigkeit (24 Stunden) abgelaufen ist (entweder abgewartet oder mit abgelaufenem Testwert erzeugt).

Schritte: Abgelaufenen Link aufrufen.

Erwartetes Ergebnis: Neutrale Seite „Link nicht mehr gültig" mit Angebot zur erneuten Anmeldung; der Eintrag bleibt unbestätigt und wird nach Frist gelöscht.

Nachweis: Antwortseite, Status des Eintrags.

Automatisierbar: ja (Stufe A).

### F3 – Doppelklick auf Anmelden und auf Abmelden

Vorbedingung: Neue Testadresse für die Anmeldung; bestätigte Testadresse für die Abmeldung.

Schritte: Anmeldeknopf zweimal schnell hintereinander betätigen (zwei Anfragen). Abmeldeknopf zweimal schnell hintereinander betätigen.

Erwartetes Ergebnis: Genau ein unbestätigter Eintrag und genau eine Bestätigungsmail; genau eine Abmeldung mit einem Sperrlisten-Eintrag. Kein doppelter Datensatz, keine doppelte Wirkung.

Nachweis: Anzahl der Einträge und Mails, Sperrlisten-Eintrag (einer).

Automatisierbar: ja (Stufe A und B).

### F4 – Webhook doppelt zugestellt und Webhook gefälscht

Vorbedingung: Kampagne ist versendet; Webhook-Empfang mit Signaturprüfung ist aktiv.

Schritte: Erstens dasselbe Zustellereignis mit derselben Ereigniskennung zweimal zustellen lassen (Wiederholung durch den Anbieter). Zweitens eine Webhook-Anfrage ohne gültige Signatur und eine mit verfälschter Nutzlast senden.

Erwartetes Ergebnis: Das doppelte Ereignis hat keine doppelte Wirkung (Entdopplung über gespeicherte Ereigniskennungen, Antwort Erfolg ohne Wirkung). Anfragen ohne gültige Signatur werden verworfen, ohne Status zu ändern.

Nachweis: Zähler der verarbeiteten Ereignisse (eines), Ablehnungsantworten der gefälschten Anfragen, unveränderte Abonnentenstatus.

Automatisierbar: ja (Stufe B).

PRÜFEN: genaue Ereignisnamen und Signaturverfahren der Resend-Dokumentation.

### F5 – Serverausfall während des Versands

Vorbedingung: Kampagne ist zum Versand freigegeben; Empfängerliste mit Prüfsumme ist festgeschrieben.

Schritte: Während des laufenden Versands den eigenen Server (Daten-Schnittstelle) unterbrechen. Danach den Server wiederherstellen und den Kampagnenstand prüfen. Erneuten Sendeaufruf nach Wiederherstellung senden.

Erwartetes Ergebnis: Kein Empfänger erhält die Mail doppelt; kein Empfänger geht still verloren. Der erneute Aufruf prüft zuerst den Stand (eigene Datenbank und Resend) und setzt nur fehlende Zustellungen fort. Besucher sehen während des Ausfalls den zwischengespeicherten Stand; Formulare zeigen einen Fehler mit sicherem Wiederholungsweg statt vorgetäuschter Zustellung.

Nachweis: Versandprotokoll je Empfänger (genau einmal), Kampagnenstatus nach Wiederherstellung, Fehlerseiten während des Ausfalls.

Automatisierbar: teilweise (Standprüfung ja, Stufe B; echter Ausfall manuell, Stufe C).

### F6 – Abmeldung während einer laufenden Kampagne

Vorbedingung: Testadresse ist bestätigter Abonnent; eine Kampagne an viele Empfänger läuft gerade (oder ist geplant, aber noch nicht zugestellt).

Schritte: Testadresse während des laufenden Versands über den Abmeldelink abmelden. Danach prüfen, ob sie die Kampagne noch erhält.

Erwartetes Ergebnis: Die Abmeldung wirkt sofort, auch für die bereits geplante Kampagne: Die Adresse wird aus der noch ausstehenden Zustellung ausgeschlossen und landet auf der Sperrliste. Eine bereits unterwegs befindliche Einzelmail kann noch ankommen; das wird in der Abmeldebestätigung so gesagt.

Nachweis: Abmeldezeitpunkt gegenüber Zustellzeitpunkt, Sperrlisten-Eintrag, Zustellprotokoll der Kampagne.

Automatisierbar: teilweise (Abmeldewirkung ja; zeitgenaue Kollision manuell, Stufe C).

### F7 – Import-Umgehung der Sperre

Vorbedingung: Testadresse steht auf der Sperrliste (abgemeldet oder wegen Rückläufer gesperrt). Ein Export mit dieser Adresse als „bestätigt" liegt vor.

Schritte: Den alten Export über den Importweg einspielen. Falls der Import in Phase 1 noch nicht angeboten wird: ersatzweise eine erneute Anmeldung derselben Adresse ohne neue Bestätigung versuchen.

Erwartetes Ergebnis: Die Sperre bleibt bestehen; ohne neue bestätigte Einwilligung entsteht kein bestätigter Eintrag. Der Abweisungsgrund ist im Importprotokoll vermerkt. Solange der Import noch nicht angeboten wird, gilt diese Prüfung als PRÜFEN und wird bei Einführung des Imports nachgeholt.

Nachweis: Sperrlisten-Eintrag (unverändert), Importprotokoll mit Abweisung, Statusabfrage der Adresse.

Automatisierbar: ja, sobald der Import angeboten wird (Stufe A).

### F8 – Vorschau versendet nicht (Negativprobe aus Anwendersicht)

Vorbedingung: Vorschau-Umgebung mit Kampagnenmaske ist geöffnet.

Schritte: In der Vorschau alle Versandwege betätigen, die die Oberfläche anbietet oder die per direktem Aufruf erreichbar sind (Testmail, Kampagnenstart, geplanter Versand).

Erwartetes Ergebnis: Nichts wird versendet; jede Aktion scheitert mit einer klaren Fehlermeldung oder ist technisch gesperrt. Im Resend-Konto ist für den Vorschauzeitraum kein Versand verzeichnet.

Nachweis: Fehlermeldungen, leeres Versandprotokoll des Resend-Kontos, Konfigurationsbeleg ohne Schlüssel in der Vorschau.

Automatisierbar: ja (Stufe B).

## 6. Abnahmeprotokoll-Vorlage

Je Abnahme (Datum, Prüfer, Umgebung, Testdomain, Kampagnenkennung) eine Zeile je Testfall: Nummer (T1 bis T8, F1 bis F8), Ergebnis (bestanden, nicht bestanden, nicht geprüft mit Grund), Nachweis (Ort des Belegs), Bemerkung. Am Ende: Gesamtvermerk mit Anzahl bestandener Fälle, Liste offener PRÜFEN-Punkte, Unterschrift des Prüfers und Freigabevermerk erst nach erfüllten Auflagen.

Die Abnahme gilt erst als bestanden, wenn alle Fälle T1 bis T8 und F1 bis F8 bestanden oder begründet zurückgestellt sind, alle PRÜFEN-Punkte geklärt sind und kein Fall mit echten Adressen durchgeführt wurde.

## 7. Offene PRÜFEN-Punkte vor der ersten Abnahme

- Idempotenz-Schlüssel der Resend-Broadcast-API für den Doppelversand-Schutz.
- Ein-Klick-Abmeldung (Abmelde-Header) bei Resend-Broadcasts.
- Rechtebegrenzung je API-Schlüssel (ein Schlüssel je Kunde).
- Genaue Webhook-Ereignisnamen, Signaturverfahren und Testweg für Rückläufer und Beschwerden.
- Konkrete Löschfristen (unbestätigte Einträge, Sperrliste, Nachweise) mit Kunde und Datenschutzerklärung abstimmen.
- Fachliche Prüfung des Einwilligungstextes durch eine fachkundige Stelle vor dem ersten Kunden.
