# Newsletter-Modul – Schnittstellenvertrag (API)

Stand: 25.11.2026. Status: Vertrag, keine Umsetzung. Grundlage: [HPSE-Newsletter-Konzept](/.herdr-tasks/HPSE-NEWSLETTER-KONZEPT-20261125.md nicht im Repo – Ablage in der Ergebnisablage), `docs/WORKFLOW-PLAN.md` (V3), `docs/DATENKLASSEN.md`, `docs/MIGRATION-POSTGRES.md`, Prototyp `prototypes/newsletter/index.html`, Bestand `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/crypto.ts`, `src/lib/permissions.ts` sowie die vorhandenen Routen unter `src/pages/api/**/newsletter/**`.

Führende Kopie aller Einwilligungsnachweise und der Sperrliste ist die Kunden-PostgreSQL (je Kunde eigene Datenbank oder eigenes Schema mit eigener Rolle). Resend dient als Versandweg und Spiegel, nie als Nachweis. Adressen stehen nie im Klartext in Links, nie in Logs und nie in KI-Verläufen; in der Datenbank liegen nur Prüfwerte (SHA-256) der Einmalwerte.

## 1. Grundsätze für alle Endpunkte

- Öffentliche Endpunkte sind ohne Anmeldung erreichbar, aber gehärtet: eigene Validierung, Missbrauchsbegrenzung je Adresse und je Herkunft, keine beliebigen Datei- oder Datenbankzugriffe.
- Admin-Endpunkte verlangen Sitzungscookie und Berechtigung `canManageNewsletter`. Rollen-, Kunden-, Umgebungs- und Objektprüfung erfolgen serverseitig bei jeder schreibenden Anfrage.
- Antworten auf An- und Abmeldung verraten nie, ob eine Adresse existiert oder welchen Status sie hat. Gleiche Antwort und gleiche Antwortzeit für bekannte und unbekannte Adressen.
- Bestätigungs- und Abmeldelinks enthalten zufällige Einmalwerte, keine Adressen im Klartext. Gespeichert wird nur der Prüfwert; der Klartextwert verlässt das System nur einmal in der jeweiligen Mail.
- Jede Kampagne hat eine feste Kennung. Senden ist idempotent: Wiederholung nach Zeitüberschreitung prüft zuerst den Stand (eigene Datenbank und Resend), bevor erneut gesendet wird (PRÜFEN: Idempotenz-Schlüssel der Resend-Broadcast-API).
- Auf der Vorschau ist der Versand technisch gesperrt: kein Schlüssel, kein Versandweg, keine Webhook-Verarbeitung mit echten Adressen. Test- und Vorschauversand laufen nur aus Live-Umgebung mit Kundenschlüssel.
- Fällt der eigene Server aus, bleibt die zuletzt zwischengespeicherte Kundenseite erreichbar. Formulare und Admin zeigen einen Fehler und bieten einen sicheren Wiederholungsweg; es gibt keine vorgetäuschte Zustellung.

## 2. Öffentliche Endpunkte (gehärtet)

### 2.1 Anmeldung – POST /api/public/newsletter/subscribe

Eingabe: E-Mail-Adresse (Pflicht), Vorname (freiwillig), Einwilligungs-Häkchen (Pflicht, nie vorab angekreuzt), Honigtopf-Feld `website` (muss leer bleiben, für Menschen unsichtbar und nicht per Tastatur erreichbar). Dazu Quelle (Seite) und gekürzte Herkunftskennung aus Serverdaten, Einwilligungstext mit Version.

Verarbeitung: Missbrauchsbegrenzung je Adresse und je Herkunft greift vor dem Versand. Neue Adresse oder erneut angemeldete Adresse wird als „unbestätigt" mit Zeitpunkt, Einwilligungstext-Version, Quelle und Herkunftskennung gespeichert. Bereits bestätigte Adresse erzeugt keine zweite Mail und keinen zweiten Datensatz. Adresse auf der Sperrliste bleibt gesperrt; eine erneute Anmeldung ohne neue bestätigte Einwilligung umgeht die Sperre nicht und verrät die Sperre nicht. Eine Bestätigungsmail geht über den Transaktionsweg mit einmaligem, befristetem Bestätigungslink (Gültigkeit 24 Stunden, Einmalgebrauch).

Ausgabe bei Erfolg: neutrale Erfolgsmeldung („Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung"), identisch für neue, bereits unbestätigte, bereits bestätigte und gesperrte Adressen. Ausgabe bei Bots (Honigtopf befüllt): stille Erfolgsmeldung ohne weitere Verarbeitung.

Fehler: 400 bei fehlender oder ungültiger Adresse oder fehlendem Einwilligungs-Häkchen; 429 bei überschrittener Ratenbegrenzung; 500 bei Serverfehler ohne Detailangabe. Fehlerantworten nennen keine Adressbestände.

Bestand: vorhanden als `src/pages/api/public/newsletter/subscribe.ts` (SQLite, Demo-Bestätigungslink in der Antwort). Anzupassen: Antwort ohne Demo-Link in Produktion, neutrale Antwort auch für bereits bestätigte Adressen (Bestand unterscheidet), Sperrlistenprüfung, Ratenbegrenzung je Adresse und Herkunft, Einwilligungsversion und Quelle speichern, Transaktionsmail über Resend, asynchrone PostgreSQL-Schicht je Kunde.

### 2.2 Bestätigung – GET /api/public/newsletter/confirm

Eingabe: Abfrageparameter `token` (Einmalwert aus der Bestätigungsmail).

Verarbeitung: Prüfwert vergleichen, Eintrag auf „bestätigt" setzen mit Bestätigungszeitpunkt, Einmalwert danach ungültig machen (Einmalgebrauch). Bereits verbrauchte oder abgelaufene Werte liefern die gleiche „ungültig oder abgelaufen"-Seite. Erneutes Aufrufen eines verbrauchten Links ändert nichts (idempotent).

Ausgabe: freundliche Bestätigungsseite mit Hinweis auf den Abmeldelink in jeder Mail. Bei ungültigem oder abgelaufenem Wert: Seite „Link nicht mehr gültig" mit Angebot zur erneuten Anmeldung. Statuscodes: 200 für die Bestätigungsseite, 400 bei fehlendem Wert, 404-gleiches Verhalten (eigene Seite, kein Bestandsverrat) bei unbekanntem oder abgelaufenem Wert.

Bestand: vorhanden als `src/pages/api/public/newsletter/confirm.ts`. Anzupassen: Befristung (24 Stunden) und Einmalgebrauch durch Löschen des Prüfwerts sind zu ergänzen (Bestand prüft weder Ablauf noch Verbrauch), PostgreSQL-Schicht, kein Adressverrat in der Antwort.

### 2.3 Abmeldeseite per Link – GET /api/public/newsletter/unsubscribe

Neu. Eingabe: Abfrageparameter `token` (Abmelde-Einmalwert aus jeder Mail, ohne Login). Ausgabe: Abmeldeseite, die die Adresse in verkürzter Form nennt und einen Abmeldeknopf anbietet. Unbekannte oder verbrauchte Werte erhalten eine neutrale Seite ohne Bestandsverrat („Dieser Link ist nicht mehr gültig"). 400 bei fehlendem Wert.

### 2.4 Ein-Klick-Abmeldung – POST /api/public/newsletter/unsubscribe

Neu. Eingabe: derselbe Abmelde-Einmalwert (Formularfeld), zusätzlich Unterstützung für die Header-gesteuerte Ein-Klick-Abmeldung der Mailanbieter (List-Unsubscribe-Post mit Ein-Klick-Bestätigung, PRÜFEN: Umsetzung bei Resend-Broadcasts). Verarbeitung: Abmeldung wirkt sofort, auch für bereits geplante Kampagnen. Adresse landet mit Grund und Zeitpunkt auf der Sperrliste, die nie ohne Erforderlichkeit gelöscht wird. Ausgabe: Abmeldebestätigung („Sie sind abgemeldet; eine bereits unterwegs befindliche Mail kann noch ankommen"). Idempotent: wiederholter Aufruf ändert nichts und meldet denselben Erfolg.

### 2.5 Abmeldebestätigung – Anzeige nach Abmeldung

Teil von 2.3/2.4, keine eigene Route nötig: Nach vollzogener Abmeldung zeigt dieselbe Seite die Bestätigung mit Hinweis auf jederzeit mögliche Neuanmeldung (die dann erneut per Double-Opt-in bestätigt werden muss).

## 3. Admin-Endpunkte (/admin, angemeldet)

Alle Endpunkte verlangen gültige Admin-Sitzung und `canManageNewsletter`, sonst 401 (nicht angemeldet) oder 403 (keine Berechtigung). Jede schreibende Anfrage prüft Rolle, Kunde, Umgebung und Objekt serverseitig. Jede Kampagnenänderung trägt die feste Kampagnenkennung; gleichzeitige Änderungen werden über Versionsprüfung geschützt.

### 3.1 Abonnentenliste – GET /api/admin/newsletter/subscribers

Neu (Prototyp zeigt Tabelle mit Filter und Suche). Eingabe: Abfrageparameter Statusfilter (bestätigt, unbestätigt, abgemeldet, gesperrt, alle), Suche (Adresse oder Name), Seite und Seitengröße. Ausgabe: paginierte Liste mit Adresse, Vorname, Status, Zeitpunkten (Anmeldung, Bestätigung, Abmeldung) sowie Summen je Status. Unbestätigte Einträge sind als solche gekennzeichnet und erhalten keinen Versand.

### 3.2 Export – GET /api/admin/newsletter/export.csv

Bestand: vorhanden als `src/pages/api/admin/newsletter/export.csv.ts` (nur bestätigte Adressen, Semikolon-CSV mit UTF-8-BOM). Vertrag: Abfrageparameter Umfang mit drei Stufen: nur bestätigte Adressen (Adresse, Vorname, Bestätigungszeitpunkt); alle Einträge mit Status; alle Einträge mit Einwilligungsnachweis (Text, Version, Quelle, Zeitpunkte). Ausgabe: CSV-Datei mit Dateiname aus Datum. Jeder Export wird mit Zeitpunkt, Benutzer und Umfang protokolliert. Hinweis in der Oberfläche: Datei sicher speichern, nicht weitergeben.

### 3.3 Kampagne anlegen und bearbeiten – POST /api/admin/newsletter/campaigns, PUT /api/admin/newsletter/campaigns/:id

Neu. Eingabe: Betreff (Pflicht), Vorschautext, Inhaltsfelder der festen Maske (Überschrift, Text, ein Bild aus der Medienablage des Kunden, ein Knopf), Absender (verifizierte Kundendomain, Pflicht). Pflichtprüfung beim Speichern: Betreff vorhanden, Absender verifiziert, Impressumsangaben in der Fußzeile, Abmeldelink vorhanden, Links gültig. Ausgabe: Kampagnenkennung und Status „Entwurf". Statusübergänge: Entwurf, geplant, in Versand, beendet, abgebrochen.

### 3.4 Vorschau und Testversand – POST /api/admin/newsletter/campaigns/:id/test

Neu. Eingabe: Zieladresse (eigene Adresse des Kunden). Verarbeitung: versendet die Kampagne einmalig an diese Adresse über den Transaktionsweg, zählt nicht als Kampagnenversand, umgeht die Sperrliste nur für diese Adresse nicht (Test an gesperrte Adresse wird verweigert und gemeldet). Ausgabe: Versandbestätigung für die Testmail.

### 3.5 Sendebestätigung und Versand – POST /api/admin/newsletter/campaigns/:id/send

Neu, eigener Schritt nach 3.4. Eingabe: keine Nutzdaten außer Kampagnenkennung und Versionsprüfung; die Seite zeigt zuvor Empfängerzahl (nur bestätigte, nicht gesperrte Adressen), Absender, Betreff und Versandzeit. Erst „Jetzt senden" oder „Planen" löst den Versand aus. Hinweis vor Auslösung: Versand ist nicht rückholbar. Verarbeitung: Empfängerliste wird mit Prüfsumme festgeschrieben; Doppelversand-Schutz über feste Kennung und Standprüfung vor erneutem Senden; Versandgrenzen je Kunde werden geprüft; bei überschrittener Grenze oder aktivem Stopp-Schalter wird der Versand verweigert. Ausgabe: Versandkennung und Status. Fehler: 409 bei bereits gestarteter Kampagne (kein zweiter Versand), 423 bei aktivem Stopp-Schalter, 429 bei überschrittener Kundengrenze.

### 3.6 Versand stoppen – POST /api/admin/newsletter/stop

Neu. Eingabe: Kundenkennung (aus Sitzung). Wirkung: sofortiger Stopp aller laufenden und geplanten Versände dieses Kunden. Ausgabe: Bestätigung mit Zeitpunkt. Nur mit Berechtigung, protokolliert.

### 3.7 Zustellstatistik – GET /api/admin/newsletter/campaigns/:id/stats

Neu. Ausgabe: Zähler für zugestellt, geöffnet (nur bei aktivem Tracking mit Einwilligung), Rückläufer und Beschwerden, Stand der Sperrungen aus dieser Kampagne.

## 4. Webhook-Empfang Resend – POST /api/webhooks/resend

Neu. Eingabe: Ereignis mit Kampagnen- und Adressbezug (Ereignisse: zugestellt, zurückgewiesen/hart, weich, Beschwerde, geöffnet, geklickt – PRÜFEN: genaue Ereignisnamen der Resend-Dokumentation). Verarbeitung: Anfrage anhand der Resend-Signatur prüfen, ohne gültige Signatur verwerfen (401). Harte Rückläufer und Beschwerden führen zur Sperrung der Adresse für alle künftigen Kampagnen. Wiederholte Zustellung desselben Ereignisses (Ereigniskennung) hat keine doppelte Wirkung (Idempotenz über gespeicherte Ereigniskennungen). Ausgabe: 200 bei Annahme, 401 bei ungültiger Signatur, 400 bei unbekanntem Format. Keine Adressen in Logs.

## 5. Querschnitte

Authentifizierung: öffentlich keine; Admin per Sitzungscookie plus `canManageNewsletter`; Webhook per Resend-Signatur; Server-zu-Server-Schlüssel der Vercel-Kundenseite je Kunde (nie im Browser, Build oder Log) für alle Aufrufe aus der Kundenseite an die Server-Schnittstelle.

Ratenbegrenzung: Anmeldung je Adresse und je Herkunft begrenzt (Missbrauchsbegrenzung vor dem Versand); Bestätigung und Abmeldung je Herkunft begrenzt, aber so bemessen, dass echte Klicks nie scheitern; Admin-Export und Testversand je Benutzer begrenzt; Webhook mit Wiederholungsfenster des Anbieters. Konkrete Werte werden im Pilot gemessen und festgelegt.

Spam-Schutz: Honigtopf-Feld in der Anmeldung (stille Erfolgsmeldung ohne Verarbeitung), Ratenbegrenzung, Einwilligungs-Häkchen als Pflicht, keine Adressbestätigung an Dritte.

Idempotenz und Doppelversand-Schutz: Bestätigungs- und Abmeldelinks sind Einmalwerte und wiederholbar aufrufbar ohne zweite Wirkung; Kampagnenversand trägt eine feste Kennung und prüft vor jedem Senden den Stand; Webhook-Ereignisse werden über ihre Kennung entdoppelt; Empfängerliste mit Prüfsumme schließt stille Änderung nach Sendefreigabe aus.

Zusammenspiel Vercel-Kundenseite zu Server-Schnittstelle: Die Kundenseite auf Vercel ruft ausschließlich diese öffentlichen, gehärteten Wege auf und wird aus dem Vercel-Zwischenspeicher ausgeliefert. Formularaufrufe laufen serverseitig über den kundenspezifischen Server-zu-Server-Schlüssel; der Schlüssel steht nie im Browser. Nach erfolgreichem Admin-Speichern wird die betroffene Seite neu zwischengespeichert; schlägt das fehl, bleibt die Änderung bestehen, die Neuvalidierung wird wiederholt und der Status angezeigt.

Verhalten bei Serverausfall: Besucher sehen weiter den zwischengespeicherten Stand; An-, Abmeldung und Admin zeigen einen Fehler mit sicherem Wiederholungsweg; kein Versand, keine vorgetäuschte Zustellung, keine verlorenen oder doppelt versandten Eingänge (Wiederholung nur über idempotente Schlüssel).

Vorschau-Sperre: Die Vorschau erhält keinen Resend-Schlüssel; Versandwege sind dort technisch gesperrt; Webhooks und Tracking sind deaktiviert; echte Adresslisten werden nur befristet für konkrete Abnahmen kopiert und danach belegt gelöscht.

## 6. Sequenzabläufe (Textlisten)

Anmeldung mit Double-Opt-in: Besucher sendet Formular an POST subscribe. Server prüft Honigtopf, Adresse, Häkchen und Ratenbegrenzung. Server speichert „unbestätigt" mit Einwilligungsversion, Quelle und Herkunftskennung. Server versendet Bestätigungsmail über Transaktionsweg. Server antwortet neutral. Besucher klickt Link an GET confirm. Server prüft Einmalwert und Befristung. Server setzt „bestätigt" mit Zeitpunkt und entwertet den Link. Server zeigt Bestätigungsseite. Ohne Klick bleibt der Eintrag unbestätigt, erhält nie Newsletter und wird nach kurzer Frist gelöscht (Vorschlag 7 Tage, Frist mit Kunde und Datenschutzerklärung abstimmen).

Abmeldung: Empfänger klickt Abmeldelink in der Mail an GET unsubscribe. Server zeigt Abmeldeseite ohne Login. Empfänger bestätigt per Knopf oder Mailprogramm sendet Ein-Klick-POST. Server setzt „abgemeldet" mit Zeitpunkt und trägt Adresse mit Grund auf die Sperrliste ein. Server bestätigt die Abmeldung. Wirkung sofort, auch für geplante Kampagnen.

Verfassen und Versand: Kunde legt Kampagne an (Entwurf) und besteht die Pflichtprüfung. Kunde prüft Vorschau und sendet Testmail an die eigene Adresse. Kunde öffnet Sendebestätigung mit Empfängerzahl, Absender, Betreff und Versandzeit und bestätigt „Jetzt senden" oder „Planen". Server schreibt Empfängerliste mit Prüfsumme fest und prüft Grenze und Stopp-Schalter. Server sendet über Broadcast-API mit fester Kennung. Webhook-Ereignisse aktualisieren Statistik und Sperrliste.

Webhook: Resend sendet Ereignis an POST /api/webhooks/resend. Server prüft Signatur und Ereigniskennung. Bei Duplikat antwortet Server 200 ohne Wirkung. Bei hartem Rückläufer oder Beschwerde sperrt Server die Adresse. Server schreibt Zustellereignis zur Kampagne.

## 7. Abgleich mit den vorhandenen Routen

Vorhanden und anzupassen: `src/pages/api/public/newsletter/subscribe.ts` (Anmeldung), `src/pages/api/public/newsletter/confirm.ts` (Bestätigung), `src/pages/api/admin/newsletter/export.csv.ts` (Export, derzeit nur bestätigte Adressen). Neu zu bauen: Abmeldeseite und Ein-Klick-Abmeldung, Abonnentenliste, Kampagnenverwaltung mit Pflichtprüfung, Testversand, Sendebestätigung mit Versand, Stopp-Schalter, Zustellstatistik, Resend-Webhook. Noch zu prüfen: genaue Ereignisnamen, Broadcast-Idempotenz, Ein-Klick-Abmelde-Header bei Broadcasts und Rechtebegrenzung je API-Schlüssel in der Resend-Dokumentation.
