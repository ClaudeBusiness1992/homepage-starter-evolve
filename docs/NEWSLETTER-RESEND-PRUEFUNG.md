# Newsletter-Modul – Resend-Prüfergebnis (25.11.2026)

Stand: 25.11.2026. Geprüft wurde ausschließlich die öffentliche Resend-Dokumentation unter resend.com/docs (Abruf am 25.11.2026). Grundlage auf Konzeptseite: HPSE-NEWSLETTER-KONZEPT-20261125, dort mit PRÜFEN markierte Stellen. Rechtliche Hinweise im Konzept bleiben Arbeitsgrundlage, keine Rechtsberatung. Was unten nicht mit Quelle belegt ist, bleibt ausdrücklich PRÜFEN.

## 1. Idempotenz-Schlüssel beim Senden

Ergebnis: Belegt für die normale Sende-API und den Batch-Versand, nicht belegt für Broadcasts. Die Idempotenz-Seite der Dokumentation nennt als unterstützte Endpunkte ausschließlich den Einzelversand, den Batch-Versand sowie Einladungs- und Antwort-Endpunkte des Postfach-Bereichs. Der Schlüssel wird als Anfrage-Kopfzeile mit bis zu 256 Zeichen übergeben, die Dokumentation empfiehlt eine eindeutige Kennung je E-Mail. Dubletten mit gleichem Schlüssel werden 24 Stunden lang erkannt, die Antwort entspricht der des Erstversands.

Quellen:

- Idempotenz-Seite der Dokumentation (resend.com/docs/dashboard/emails/idempotency-keys.md)
- Sende-Referenz für Einzelversand (resend.com/docs/api-reference/emails/send-email.md)
- Versende-Referenz für Broadcasts (resend.com/docs/api-reference/broadcasts/send-broadcast.md), dort ist kein Idempotenz-Parameter beschrieben

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 3.5 des Konzepts (Doppelversand-Schutz über Idempotenz-Schlüssel) gilt damit nur für Transaktionsmails und Batch-Versand als belegt. Für Kampagnen über die Broadcast-API bleibt der Idempotenz-Ansatz PRÜFEN. Das Konzept braucht für Broadcasts weiterhin den eigenen Schutz aus fester Kampagnen-Kennung und Abgleich des Versandstands vor erneutem Senden. Abnahmetest 3 (kein Zweitversand nach Wiederholung) lässt sich für Transaktionsmails auf die Resend-Funktion stützen, für Kampagnen nur auf eigene Logik.

## 2. Ein-Klick-Abmeldung (List-Unsubscribe und List-Unsubscribe-Post)

Ergebnis: Teils belegt, teils PRÜFEN. Für normale Sende-API beschreibt die Dokumentation, dass der Versender selbst einen Abmelde-Kopfzeilenwert mit der eigenen Abmeldeadresse setzen kann. Für Massenversand verlangt die Dokumentation zusätzlich den Ein-Klick-Standard nach RFC 8058 (Abmelde-Kopfzeile per-Adresse plus Ein-Klick-Kopfzeile, Annahme von Abmeldungen per Verweis und per Formularaufruf, Wirkung innerhalb von 48 Stunden). Für Broadcasts stellt Resend einen eigenen Abmelde-Platzhalter für den Nachrichteninhalt bereit, der je Empfänger und je Kampagne eine eigene Abmeldeseite erzeugt, wahlweise je Thema oder für alle E-Mails. Ob Resend bei Broadcasts zusätzlich automatisch die technischen Abmelde-Kopfzeilen für den Ein-Klick-Weg setzt, ist in den geprüften Seiten nicht beschrieben.

Quellen:

- Abmeldeseite für Transaktionsmails (resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails.md)
- Broadcast-Editor mit Abmelde-Verweis (resend.com/docs/dashboard/broadcasts/editor.md)
- Broadcast-Versand über die API (resend.com/docs/dashboard/broadcasts/send-broadcast-with-api.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 3.2 (Abmeldelink und technischer Abmelde-Header mit Ein-Klick) ist für Transaktionsmails als Eigenbau belegt, für Broadcasts nur der sichtbare Abmeldelink über den Resend-Platzhalter. Ob zusätzlich eigene Kopfzeilen bei Broadcasts nötig oder möglich sind, bleibt PRÜFEN. Für die Abnahme ist festzuhalten, dass die Anforderung der großen Mailanbieter an Massenversender dokumentiert belegt ist und das Konzept sie deshalb zu Recht als Pflicht führt.

## 3. Rechtebegrenzung von API-Schlüsseln

Ergebnis: Belegt. Die Dokumentation unterscheidet genau zwei Berechtigungen: Vollzugriff (Anlegen, Löschen, Abfragen und Ändern aller Ressourcen) und Sendezugriff (nur E-Mail-Versand). Ein Schlüssel mit Sendezugriff lässt sich zusätzlich auf genau eine Absenderdomain begrenzen.

Quellen:

- Anleitung zum Anlegen eines Schlüssels (resend.com/docs/create-an-api-key.md)
- Schlüssel-Referenz der API (resend.com/docs/api-reference/api-keys/create-api-key.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 4 (eigener Schlüssel je Kunde mit begrenzten Rechten) ist belegt. Die Befehlshülle kann je Kunde einen reinen Sende-Schlüssel mit Domainbindung erzeugen und behält den Generalschlüssel allein. Die Vorschau erhält weiterhin keinen Schlüssel.

## 4. Webhook-Ereignisse und Signaturprüfung

Ergebnis: Belegt. Die Ereignisliste nennt unter anderem zugestellt, geöffnet, geklickt, abgewiesen (dauerhaft), Beschwerde (Spam-Meldung), fehlgeschlagen, unterdrückt, zugestellt-verzögert sowie Ereignisse für Domains, Kontakte, Themen und die Sperrliste. Die Signaturprüfung erfolgt über einen geheimen Zeichensatz je Webhook-Ziel: Entweder prüft die offizielle Programmbibliothek die Anfrage, oder die Anwendung prüft selbst mit der offenen Prüfbibliothek des Webhook-Anbieters anhand von Kennung, Zeitstempel und Signatur aus den Anfrage-Kopfzeilen. Wichtig für die Prüfung: Es muss der unveränderte Anfragetext geprüft werden, nicht nachträglich neu aufgebauter Text. Fehlgeschlagene Zustellungen wiederholt Resend automatisch mit längeren Abständen (sofort, Sekunden, Minuten, Stunden), nach dauerhaftem Fehlschlagen wird das Ziel abgeschaltet und das Team per Mail benachrichtigt. Einzelne Ereignisse lassen sich manuell erneut zustellen.

Quellen:

- Webhook-Einführung (resend.com/docs/webhooks/introduction.md)
- Ereignistypen (resend.com/docs/webhooks/event-types.md)
- Signaturprüfung (resend.com/docs/webhooks/verify-webhooks-requests.md)
- Wiederholungen und erneute Zustellung (resend.com/docs/webhooks/retries-and-replays.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 3.4 (Rückläufer und Beschwerden per Webhook, Signaturprüfung, keine Doppelwirkung bei wiederholter Zustellung) ist belegt. Die eigene Verarbeitung muss Ereignisse anhand ihrer Kennung als bereits verarbeitet erkennen, weil Wiederholungen ausdrücklich vorgesehen sind. Die Ereignisnamen für dauerhafte Abweisung, Beschwerde und Unterdrückung decken die Sperrlogik des Konzepts ab.

## 5. Ratenbegrenzungen

Ergebnis: Belegt. Die Dokumentation nennt eine Standardgrenze von 10 Anfragen je Sekunde je Team über alle Schlüssel des Teams hinweg, mit standardisierten Antwort-Kopfzeilen zu Grenze, Restguthaben und Wartezeit. Bei Überschreitung antwortet die API mit dem Status für zu viele Anfragen. Zusätzlich gelten E-Mail-Kontingente (Free: Tages- und Monatsgrenze, bezahlte Pläne: nur Monatsgrenze, jeder Empfänger zählt einzeln) und Kontakt-Kontingente für Marketing (Begrenzung der speicherbaren Kontakte je Plan; bei Überschreitung verweigert die Broadcast-API mit Hinweis auf das Kontingent). Sowohl gesendete als auch empfangene E-Mails zählen zum Kontingent.

Quellen:

- Nutzungsgrenzen der API (resend.com/docs/api-reference/rate-limit.md)
- Konten-Kontingente und Grenzen (resend.com/docs/knowledge-base/account-quotas-and-limits.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 4 (Kontingent und Ratenbegrenzung gelten für das ganze Team, ein Kunde kann andere ausbremsen) ist belegt und bleibt als Risiko bestehen. Die im Konzept vorgesehenen Versandgrenzen je Kunde und der Stopp-Schalter sind deshalb kein Zusatz, sondern Pflicht. Für die Befehlshülle folgt daraus, dass sie die Antwort-Kopfzeilen zu Kontingenten auswerten und bei Überschreitung sauber abbrechen sollte, statt erneut zu versuchen.

## 6. Domain-Anlage und DNS-Einträge per API

Ergebnis: Belegt. Domains lassen sich per API anlegen (Name, Versandregion, Rückpfad-Adresse, Nachverfolgungs-Adresse, Verschlüsselungsvorgabe, Sende-/Empfangsfähigkeit). Das Abfragen einer Domain liefert die einzutragenden DNS-Werte (Absenderprüfung und Schlüssel je nach Anbieter als Text-, Post- oder Verweiseinträge). Das Anstoßen der Prüfung per API startet einen asynchronen Prüflauf, der bei Statuswechseln Webhook-Ereignisse für Domains auslöst. Über den Pfad zum Abrufen der Domain sind nach einem Eigentümerwechsel neue Schlüsselwerte zu holen, bevor erneut geprüft wird.

Quellen:

- Domain anlegen (resend.com/docs/add-a-domain.md und resend.com/docs/api-reference/domains/create-domain.md)
- Domain abrufen (resend.com/docs/api-reference/domains/get-domain.md)
- Domain prüfen (resend.com/docs/api-reference/domains/verify-domain.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 4 (Domain per API anlegen, DNS-Einträge aus dem API-Ergebnis ableiten, Prüfung per API anstoßen) ist belegt und kann automatisiert in der Befehlshülle umgesetzt werden. Das Setzen der DNS-Einträge selbst bleibt wie im Konzept beschrieben beim DNS-Verwalter (Standard Agentur-Konto per API, Ausnahme Kunde per Anleitung). Für Absender mit bestehendem Ruf empfiehlt die Dokumentation eine passende Subdomain, was bei der Kundenanlage als Vorgabe übernommen werden sollte.

## 7. Kontakte, Segmente, Themen und Verhalten abgemeldeter Kontakte

Ergebnis: Belegt. Kontakte lassen sich manuell, per API oder per Datei-Upload pflegen. Broadcasts gehen an ein Zielgruppen-Segment. Themen erlauben feinere Vorlieben: je Thema lässt sich der Standard auf automatische Teilnahme oder nur nach ausdrücklicher Anmeldung festlegen, dazu öffentlich oder privat für die Abmeldeseite. Der globale Kontaktstatus entscheidet über den Broadcast-Empfang: als abgemeldet markierte Kontakte erhalten keine Broadcasts und keine automatisierten Serien, auch nicht bei Themenmitgliedschaft. Normale Transaktionsmails werden weiterhin zugestellt, außer die Anfrage nennt ein Thema, das der Kontakt abgewählt hat. Daneben führt Resend eine teamweite Sperrliste (Gründe: dauerhafte Abweisung, Beschwerde, manueller Eintrag), die den Versand an diese Adressen für Transaktions- und Broadcast-Mails überspringt. Einträge lassen sich einzeln oder stapelweise bis 100 Stück per API verwalten. Themenwechsel und Sperrlisten-Einträge melden sich per Webhook.

Quellen:

- Broadcast-Einführung (resend.com/docs/dashboard/broadcasts/introduction.md)
- Abgemeldete Kontakte (resend.com/docs/dashboard/contacts/managing-unsubscribe-list.md)
- Themen (resend.com/docs/dashboard/contacts/manage-topics.md)
- Sperrliste (resend.com/docs/dashboard/emails/email-suppressions.md)
- Ereignistypen für Kontakt-, Themen- und Sperrlisten-Wechsel (resend.com/docs/webhooks/event-types.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Abschnitt 4 (Kontakte, Segmente, Themen bei Resend; führende Kopie und Sperrliste in eigener Datenbank; Resend als Spiegel) ist tragfähig. Wichtig für die Umsetzung: Kontakt-Abmeldung und teamweite Sperrliste sind zwei verschiedene Mechanismen mit verschiedener Reichweite (nur Marketing gegenüber allem Versand). Die eigene Datenbank bleibt führend für Einwilligungsnachweise und Sperren, weil Resend-Listen der Versandsteuerung dienen und beim Anbieterwechsel nicht mitwandern. Abnahmetests 2 und 4 lassen sich auf diese Mechanik stützen.

## 8. Batch-Versand

Ergebnis: Belegt. Bis zu 100 E-Mails lassen sich in einem API-Aufruf versenden, jede mit eigenen Empfängern, Betreff und Inhalt. Die Dokumentation empfiehlt den Stapelversand für Transaktionsfälle (mehrere Empfänger mit eigenem Inhalt, weniger Aufrufe) und verweist für Marketing ausdrücklich auf Broadcasts.

Quelle:

- Stapelversand (resend.com/docs/dashboard/emails/batch-sending.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Für Double-Opt-in-Mails und andere Transaktionsmails ist der Stapelversand eine belegte Option, für Kampagnen bleibt die Broadcast-API der vorgesehene Weg. Idempotenz-Schlüssel gelten auch für den Stapelversand (siehe Abschnitt 1).

## 9. Auftragsverarbeitung und Datenstandort EU

Ergebnis: Teils belegt, teils PRÜFEN. Belegt ist: Der Auftragsverarbeitungsvertrag liegt vorab unterzeichnet im Einstellungsbereich unter Dokumente und gilt mit Kontoregistrierung als wirksam, eine Gegenzeichnung ist nicht nötig. Die Versandregion lässt sich je Domain wählen, darunter eine EU-Region (Irland). Belegt ist aber auch die Einschränkung: Die Regionswahl steuert nur, von wo E-Mails versendet werden. Alle Kontodaten einschließlich E-Mail-Metadaten, Protokolle und API-Datensätze werden in den USA gespeichert. Wer strenge Anforderungen an den Datenspeicherort hat, wird auf die Unterauftragnehmer-Liste und die Datenschutzerklärung verwiesen.

Quellen:

- Dokumente (resend.com/docs/knowledge-base/downloading-documents.md)
- Versandregionen (resend.com/docs/dashboard/domains/regions.md)
- Sicherheitsüberblick mit Verweis auf Auftragsverarbeitung (resend.com/docs/security.md)

Datum: 25.11.2026.

Auswirkung auf das Konzept: Die Abschnitte 2 und 9 (Auftragsverarbeitungsvertrag je Kunde, Nennung der Unterauftragnehmer, EU-Bezug) müssen diese Einschränkung abbilden: EU-Versand ist wählbar, EU-Speicherung ist nicht belegt. Das gehört in die Kundenunterlagen und die Datenschutzerklärung, bevor der erste echte Versand läuft. Ob der US-Speicherort für den konkreten Kunden akzeptabel ist, bleibt eine fachliche Klärung und damit PRÜFEN.

## 10. Zusammenfassung

Belegt und direkt umsetzbar: Sende-Schlüssel je Kunde mit Domainbindung, Domain-Anlage und DNS-Werte per API mit Prüfung per API, Webhook-Ereignisse mit Signaturprüfung und Wiederholungsplan, Team-Raten und Kontingente, Kontakte mit Segmenten und Themen, Abmeldeverhalten je Status, Sperrliste mit stapelweiser API-Verwaltung, Stapelversand bis 100, Ein-Klick-Anforderung für Massenversand, vorab unterzeichneter Auftragsverarbeitungsvertrag.

Bleibt PRÜFEN (in der geprüften Dokumentation nicht belegt): Idempotenz bei Broadcast-Erstellung und Broadcast-Versand, automatische Ein-Klick-Kopfzeilen bei Broadcasts über die API, konkrete EU-Speicherzusage über den Versandort hinaus.

Offene Konzeptpunkte ohne Resend-Bezug bleiben unverändert: konkrete Löschfristen je Datenart, Preis des Zusatzmoduls, fachliche Prüfung des Einwilligungstextes.
