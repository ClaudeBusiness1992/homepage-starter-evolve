# VVT-, Lösch-, Betroffenenrechte- und Pannenkonzept (Entwurf)

**ENTWURF ZUR ANWALTLICHEN PRÜFUNG – KEINE RECHTSBERATUNG.** Dieses Dokument ist eine Arbeitsvorlage für pixel&code und deren Kunden. Es ersetzt keine Rechtsberatung. Nicks Anwalt prüft, korrigiert und gibt frei. Alle mit [ANWALT-n] markierten Stellen entscheidet der Anwalt; die nummerierte Sammelliste steht am Ende. Platzhalter in eckigen Klammern sind je Kunde und für pixel&code auszufüllen.

Stand: 25.11.2026. Status: Entwurf, nichts umgesetzt, nichts freigegeben.

Grundlagen (nur gelesen, nichts geändert): docs/WORKFLOW-PLAN.md (Version 3), docs/DATENKLASSEN.md, docs/KUNDEN-ANLEGEN-CHECKLISTE.md, docs/NEWSLETTER-DATENSCHUTZ.md, docs/NEWSLETTER-API.md, /home/nick/.herdr-tasks/HPSE-NEWSLETTER-KONZEPT-20261125.md, /home/nick/.herdr-tasks/HPSE-DIENSTLEISTER-20261125.md, config/legal.json, src/pages/impressum.astro, src/pages/datenschutz.astro (nur gelesen). Rechtsverweise stehen nur dort, wo sie sicher bekannt sind (DSGVO Art. 6, 7, 13, 15 bis 22, 28, 30, 32, 33, 34, 35, 44 ff.; UWG § 7; DDG § 5; TDDDG § 25). Alles andere ist mit PRÜFEN markiert und vom Anwalt zu entscheiden. Es wurden keine Paragrafen, Urteile oder Zahlen erfunden.

Leseschlüssel: „pixel&code" = [Firmenname pixel&code, Rechtsform, Anschrift, Vertretung]. „Kunde" = [Kundenname, Anschrift, Vertretung, Kontaktadresse für Datenschutzanfragen]. „Befehlshülle" = die geplante feste Befehlshülle auf dem eigenen Server (feste Befehle, Generalschlüssel nur dort, KI sieht keine Schlüsselwerte). „Vorschau" = gesperrte Prüf-/Vorschauumgebung ohne Mail-Schlüssel.

## Teil 1 – Verzeichnis der Verarbeitungstätigkeiten (Art. 30, Muster)

Grundsatz aus den Grundlagen: Der Kunde ist Verantwortlicher für seine Website-Daten und seine Abonnenten; pixel&code ist Auftragsverarbeiter und verarbeitet nur nach Weisung des Kunden; Unterauftragsverarbeiter sind Resend (Versand), Vercel (Auslieferung) und der Sicherungsspeicher. Je Kunde ist ein Auftragsverarbeitungsvertrag (AVV) erforderlich. [ANWALT-1: AVV-Formulierungen, Weisungsbindung und Weisungskette Kunde → pixel&code → Unterauftragsverarbeiter prüfen und freigeben (Art. 28).]

### 1.1 Muster: pixel&code als Auftragsverarbeiter (Art. 30 Abs. 2)

Verantwortliche Stelle dieses Verzeichnisses: pixel&code, [Anschrift, Kontakt, ggf. Datenschutzbeauftragter – PRÜFEN, ob Benennpflicht besteht, siehe ANWALT-8]. Je Kunde (je Verantwortlicher) gilt die folgende Zeilenstruktur; das Verzeichnis wird je Kunde geführt oder um eine Kundenspalte ergänzt.

| Nr. | Tätigkeit (Kategorien der Verarbeitung) | Betroffener Verantwortlicher (Kunde) | Kategorien personenbezogener Daten | Zweck | Unterauftragsverarbeiter / Empfänger | Drittlandübermittlung | TOMs (allgemeine Beschreibung) | Löschverweis |
|---|---|---|---|---|---|---|---|---|
| P-01 | Betrieb Server, PostgreSQL (je Kunde getrennt), Schaltzentrale, Befehlshülle | [Kundenname] | Alle Kundendatenarten laut Teil 2 (Inhalte, Personendaten, Sitzungsdaten) | Bereitstellung, Speicherung, Administration nach Weisung | Keine (eigener Server, Standort [Serverstandort, EU – PRÜFEN]) | Keine – PRÜFEN [ANWALT-2] | Je Kunde getrennte Datenbank/Rolle, eigener Schlüssel je Kunde, Ratenbegrenzung, Protokollierung, Tailscale-Zugang, Sicherung siehe P-06 | Teil 2 je Datenart |
| P-02 | Auslieferung der Kundenseite, Zwischenspeicher, Vorschau-Sperre | [Kundenname] | Technische Zugriffsdaten (z. B. IP-Adresse, Zugriffszeitpunkt – genaue Protokolldaten PRÜFEN) | Sichere, schnelle Auslieferung; gesperrte Vorschau bis Go | Vercel ([Anbieterangaben, DPA-Stand – PRÜFEN]) | PRÜFEN [ANWALT-2] (Art. 44 ff.) | Projekt je Kunde, projektbegrenzter Schlüssel, serverseitige Sperre, noindex auf Vorschau | Protokolldaten nach Teil 2 |
| P-03 | Kontaktformular und Transaktionsmails (Kontakt, Passwort-Zurücksetzen, Double-Opt-in-Bestätigung) | [Kundenname] | Name, E-Mail-Adresse, Nachrichteninhalt, Zeitpunkte, Missbrauchsschutzdaten | Zustellung der Formular- und Systemmails nach Weisung | Resend ([Anbieterangaben, DPA-Stand – PRÜFEN]) | PRÜFEN [ANWALT-2] (Art. 44 ff.) | Eigener Schlüssel je Kunde, Validierung, Ratenbegrenzung, keine Adressen in Logs/KI-Verläufen | Teil 2 (Formulareingänge) |
| P-04 | Newsletter-Zusatzmodul (optional, nur bei Buchung): Anmeldung mit Double-Opt-in, Verwaltung, Versand, Abmeldung, Sperrliste | [Kundenname] | E-Mail-Adresse, ggf. Vorname, Status, Zeitpunkte (An-/Bestätigung/Abmeldung), Einwilligungstext-Version, Quelle, gekürzte Herkunftskennung, Zustellereignisse | Newsletterversand nur an bestätigte Adressen | Resend (Versandweg und Spiegel; führende Nachweiskopie in Kunden-PostgreSQL) | PRÜFEN [ANWALT-2] (Art. 44 ff.) | Zufalls-Einmalwerte statt Klartext in Links (nur Prüfwerte gespeichert), Signaturprüfung Webhooks, Sperrliste, Doppelversand-Schutz, Export nur für Kunden und protokolliert, Vorschau ohne Schlüssel | Teil 2 (Newsletter-Zeilen) |
| P-05 | Kundenkonten /admin (Anmeldung, Sitzungen, Rechte, Passwort-Zurücksetzen) | [Kundenname] | Benutzerkennungen, Sitzungsdaten, Loginversuche (IP), Rechte | Sichere Kontoverwaltung | Keine | Keine – PRÜFEN | Sitzungsablauf, Widerruf bei Wechsel, keine Token-Migration, Rechteprüfung je Anfrage | Teil 2 (Sitzungen) |
| P-06 | Sicherung und Wiederherstellung (Datenbank, Medien, Konfiguration) | [Kundenname] | Kopien aller gespeicherten Datenarten | Wiederherstellbarkeit nach Ausfall/Fehler | Sicherungsspeicher ([Anbieter, Ort, Vertrag – PRÜFEN, Anbieterwahl offen]) | PRÜFEN [ANWALT-2] (Art. 44 ff.) | Verschlüsselung, getrennte Ausfallzone, Löschschutz/Objektsperre, Restore-Probe je Kunde | Backup-Verfall siehe Teil 2 |
| P-07 | Externe Überwachung und Alarmierung (Erreichbarkeit, Zertifikate) | [Kundenname] | Technische Erreichbarkeits- und Protokolldaten (Umfang je Anbieter PRÜFEN) | Früherkennung von Ausfällen | Externer Prüfdienst + Alarmkanal ([Anbieter offen – PRÜFEN]) | PRÜFEN [ANWALT-2] | Nur Erreichbarkeitsdaten, genau ein Alarmkanal | Teil 2 |
| P-08 | Medienablage (Originale, Varianten, Referenzen) | [Kundenname] | Bild-/Mediendateien inkl. ggf. abgebildeter Personen | Speicherung und Auslieferung von Kundenmedien | Ablageort [eigener Server oder EU-Objektspeicher – Entscheidung offen, PRÜFEN] | PRÜFEN [ANWALT-2] | Referenzprüfung vor Löschung, keine Ausführung von Uploads, Zugriffsrechte je Kunde | Teil 2 (Medien) |

[ANWALT-2: Verarbeitungsort, Drittlandtransfer und geeignete Garantien (Art. 44 ff.) je Unterauftragsverarbeiter (Vercel, Resend, Sicherungsspeicher, Überwachung) im Einzelfall prüfen; Anbieterangaben, DPA-Verfügbarkeit und Protokolldatenumfang belegen.]

### 1.2 Vorlage: Kunde als Verantwortlicher (Art. 30 Abs. 1, je Kunde auszufüllen)

Verantwortlicher: [Kundenname, Anschrift, Kontakt, ggf. Datenschutzbeauftragter]. Diese Vorlage übernimmt der Kunde und lässt sie vom Anwalt freigeben. Rechtsgrundlagen je Zeile entscheidet der Anwalt. [ANWALT-3: Rechtsgrundlagen (Art. 6) und Einwilligungstexte (Art. 7) je Kundentätigkeit prüfen und freigeben; UWG-§-7-Fragen siehe ANWALT-11.]

| Nr. | Tätigkeit / Zweck | Rechtsgrundlage (Entwurf, Anwalt entscheidet) | Kategorien betroffener Personen | Kategorien personenbezogener Daten | Empfänger (inkl. Auftragsverarbeiter) | Drittlandübermittlung | Löschfrist (Verweis) |
|---|---|---|---|---|---|---|---|
| V-01 | Website-Betrieb und -auslieferung (Besucherzugriffe) | [ANWALT-3] | Website-Besucher | Technische Zugriffsdaten (IP, Zeitpunkt – Umfang PRÜFEN) | pixel&code (AV), Vercel (UAV) | PRÜFEN [ANWALT-2] | Teil 2 (Protokolle) |
| V-02 | Kontaktformular (Anfragen entgegennehmen und beantworten) | [ANWALT-3] | Anfragende | Name, E-Mail, Inhalt, Zeitpunkt | pixel&code (AV), Resend (UAV-Transaktionsweg), ggf. Kundenpostfach | PRÜFEN [ANWALT-2] | Teil 2 (Formulareingänge) |
| V-03 | Newsletter (nur bei gebuchtem Zusatzmodul, Double-Opt-in) | Einwilligung (Art. 6 Abs. 1 lit. a, Art. 7; UWG § 7) – [ANWALT-3, ANWALT-11] | Abonnenten | Adresse, ggf. Vorname, Status, Zeitpunkte, Einwilligungsversion, Quelle, Zustellereignisse | pixel&code (AV), Resend (UAV) | PRÜFEN [ANWALT-2] | Teil 2 (Newsletter-Zeilen), Sperrliste bleibt solange erforderlich |
| V-04 | Kundeninhalte im /admin (Team, Galerie, Bewertungen, Kontaktangaben, Öffnungszeiten, Banner) | [ANWALT-3] | Kunden, Mitarbeiter, ggf. bewertende Dritte | Namen, Biografien, Fotos, Bewertungen, Kontaktdaten | pixel&code (AV), Vercel (Auslieferung) | PRÜFEN [ANWALT-2] | Teil 2 je Datenart |
| V-05 | Reichweiten-/Öffnungsmessung (nur falls je Kunde angeboten) | [ANWALT-3; TDDDG § 25 beachten] | Empfänger/Besucher | Öffnungs-/Klickereignisse | pixel&code (AV), Resend (UAV) | PRÜFEN [ANWALT-2] | Teil 2 – [ANWALT-10] |

Informationspflichten (Art. 13) erfüllt der Kunde in seiner Datenschutzerklärung (Textbausteine siehe docs/NEWSLETTER-DATENSCHUTZ.md Abschnitt 3). Impressumspflicht (DDG § 5) und MStV-Angaben stammen aus config/legal.json je Kunde. [ANWALT-3 gilt auch für die Freigabe dieser Texte.]

## Teil 2 – Löschkonzept (Vorschlag, Fristen ab Ereignis)

Alle Fristen sind unverbindliche Arbeitsvorschläge ab dem genannten Ereignis und gelten erst nach anwaltlicher Freigabe. Gesetzliche Aufbewahrungspflichten und begründete Löschsperren gehen vor. [ANWALT-4: Alle Fristen, Rechtsgrundlage der Sperrlisten- und Nachweisaufbewahrung sowie das Verhältnis zu gesetzlichen Pflichten prüfen und je Kunde freigeben.] Verantwortlicher der Löschung: pixel&code handelt nur nach Weisung des Kunden (AV); der Kunde ordnet Löschung/Export an. Spalten: Auslöser = Ereignis, ab dem die Frist läuft; Nachweis = wie die Löschung belegt wird (ohne Geheimniswerte, ohne Inhaltskopien); Sicherungskopien = Behandlung in Backups.

| Datenart (aus docs/DATENKLASSEN.md) | Löschfrist-Vorschlag | Auslöser | Nachweis | Sicherungskopien |
|---|---|---|---|---|
| Design-Einstellungen | 30 Tage nach bestätigter Übergabe/Vertragsende | Vertragsende, Export an Kunden | Löschprotokoll (was, wann, durch wen) | Laufen mit Backup-Verfall aus; kein Archiv gelöschter Stände |
| Haupttexte | Altversionen 90 Tage Historie; Endstand wie Design | Ersetzung / Vertragsende | Verlauf/Rücknahmeprotokoll | Wie oben |
| Kundeninhalte / Kontaktangaben | Wie Design; Verlauf 90 Tage | Ersetzung / Vertragsende | Verlauf, Exportnachweis | Wie oben |
| Team | 30 Tage nach Entfernung bzw. Zweckende | Entfernung / Zweckerreichung | Löschprotokoll, Referenzprüfung Medien | Wie oben |
| Galerie | 30 Tage nach Entfernung und Referenzprüfung | Entfernung | Lösch- und Referenzprüfprotokoll | Wie oben; Dateien getrennt geregelt |
| Öffnungszeiten | Bei Änderung; Historie 90 Tage | Änderung / Vertragsende | Verlauf | Wie oben |
| Hinweis-Banner | 30 Tage nach Ablauf/Entfernung | Ablauf / Entfernung | Löschprotokoll | Wie oben |
| Newsletter: unbestätigte Anmeldungen | 7 Tage (Prototyp-Hinweis; Link-Gültigkeit kürzer, z. B. 24 h, getrennt festlegen) | Anmeldung ohne Bestätigung | Autom. Löschlauf mit Zählprotokoll | Keine Aufnahme in Langzeit-Backups vor Bestätigung anstreben – PRÜFEN |
| Newsletter: bestätigte Abonnenten (aktive Kontaktdaten) | Bis Widerruf/Abmeldung, dann Umwandlung in Sperrliste + Nachweis | Widerruf, Abmeldung, Beschwerde, harter Rückläufer | Statuswechsel- und Sperrprotokoll | Laufen mit Backup-Verfall aus |
| Newsletter: Sperrliste (Adresse/Prüfwert, Grund, Zeitpunkt) | Solange Sperre erforderlich; kein pauschales Löschen | Abmeldung/Beschwerde/Rückläufer | Sperrprotokoll (Grund, Zeitpunkt) | Sperre muss auch für Restore gelten (Sperrliste beim Restore erhalten/erneut anwenden) – Verfahren PRÜFEN |
| Newsletter: Einwilligungsnachweise | Dauer des Nachweisbedarfs (gesetzliche Aufbewahrung/Verjährung – Anwalt legt fest) | Vertragsende / Widerruf | Nachweisarchiv mit Version, Quelle, Zeitpunkten | Wie oben; Export beim Vertragsende an Kunden |
| Newsletter: Kampagnen/Empfängerprüfsummen | 90 Tage nach Übergabe (Vorschlag) | Versand / Vertragsende | Kampagnenprotokoll | Wie oben |
| Newsletter: Zustellereignisse | Gekoppelt an Sperr-/Nachweiszweck | Ereignis | Ereignisprotokoll (ohne Klartext in Logs) | Wie oben |
| Export-Dateien / Export-Protokolle | Exportdatei nach Übergabe löschen; Protokoll (wer, wann, Umfang) aufbewahren | Übergabe | Übergabe- und Löschprotokoll | Exportdateien nie in Backups |
| Bewertungen | 30 Tage nach Löschentscheidung; Rechnungs-/Einwilligungsnachweise gesondert | Löschentscheidung | Löschprotokoll | Wie oben |
| Social-Links | 30 Tage nach Entfernung | Entfernung | Löschprotokoll | Wie oben |
| Service-Erinnerungen | 30 Tage nach Stornierung/Abschluss | Abschluss/Stornierung | Löschprotokoll | Wie oben |
| Sitzungen / Login-Daten | Abgelaufene Sitzungen spätestens 24 h nach Ablauf löschen; Loginversuche nach 15 min plus kurzer Betriebsfrist; PIN-Hash nach Rotation entfernen | Ablauf / Rotation | Autom. Löschlauf mit Protokoll | Sitzungsdaten nie in Vorschau/Backups für Abnahmen |
| Formulareingänge (falls Datenbankablage beschlossen) | 30 Tage nach erfolgreicher Bearbeitung (Vorschlag) | Bearbeitung | Bearbeitungs- und Löschprotokoll | Mailpostfach/Eingangsablage beim Anbieter gesondert regeln – PRÜFEN |
| Medien (Originale, Varianten) | 30 Tage nach Entfernen der letzten Referenz | Entfernen letzter Referenz | Referenzprüfprotokoll vor Löschung | Varianten und Sicherungen getrennt verfallen lassen |
| Geheimnisse / Schlüssel | Ersetzte Secrets unverzüglich widerrufen und entfernen | Rotation / Vertragsende | Widerrufsprotokoll (nur Schlüssel-ID, nie Werte) | Alte Schlüssel nie reaktivieren (kein Rollback von Secrets) |
| Protokolle allgemein (Zugriff, Audit) | Getrennt festlegen (Betriebsfrist kurz halten) | Zeitablauf | Rotationsprotokoll | Keine Adressen/Inhalte in Logs |
| Backups insgesamt | Getrennter Backup-Verfall; gelöschte Daten laufen aus | Verfall | Verfalls- und Restore-Protokoll | Restore-Verfahren je Kunde üben; kein Restore als Archiv für Gelöschtes [ANWALT-5] |
| Vorschau-/Testdaten mit echten Adressen | Nur befristet für konkrete Abnahme, danach belegte Löschung; keine Kopie in Backups/Logs/KI-Verlauf | Abnahmeende / Fristablauf | Löschbeleg (was, wann, durch wen) | Ausdrücklich von Backup ausgenommen |

Technische Umsetzung (ohne Quellcode): Die Befehlshülle erhält feste, protokollierte Befehle je Löschfall (Einzelauskunft/Export/Löschung je Kunde, Löschlauf für Fristen, Sperrlistenpflege, Backup-Verfall). Jeder Befehl verlangt die Kundenkennung, prüft Rolle/Umgebung/Objekt und schreibt ein Protokoll (Zeitpunkt, Umfang, Ausführender). [ANWALT-5: Backup-Verfall, Restore-Verfahren für einzelne Kunden und Umgang mit Sperrlisten beim Restore prüfen und freigeben.]

## Teil 3 – Ablauf für Betroffenenanfragen (Auskunft, Berichtigung, Löschung, Export, Widerspruch)

Grundsatz: Anfragen Betroffener richten sich an den Kunden als Verantwortlichen (Kontaktadresse in dessen Datenschutzerklärung). pixel&code handelt nur nach Weisung des Kunden und unterstützt ihn (Art. 28 Abs. 3 lit. e). Anfragen an pixel&code werden unverzüglich an den Kunden weitergeleitet. [ANWALT-6: Antwortfristen, Form der Identitätsprüfung und Reichweite der Auskunft (z. B. Zustellereignisse, Webhook-Daten, Export-Protokolle) je Kunde festlegen; als Arbeitsannahme gilt: unverzüglich, Beispiel-Antwortfrist einen Monat – erst nach Freigabe verbindlich.]

### 3.1 Gemeinsamer Ablauf (alle Rechte)

1. Eingang: Anfrage (E-Mail/Brief an [Kontaktadresse des Kunden]) erfassen (Eingangszeitpunkt, Kanal); unzuständige Eingänge bei pixel&code sofort an den Kunden weiterleiten.
2. Zuständigkeit klären: Welcher Kunde, welche Website, welche Adresse; bei Zweifeln Rückfrage, keine Auskunft an Unbefugte.
3. Identität klären: Absenderadresse mit Datensatz abgleichen; bei Zweifeln zusätzliche Bestätigung einholen; Vorgehen dokumentieren. [ANWALT-6]
4. Suche über die Befehlshülle: fester Befehl je Kunde mit Kundenkennung (Adresssuche in Abonnenten, Sperrliste, Nachweisen, Formulareingängen, Inhalten); keine Adressen in Logs oder KI-Verläufen; Ergebnis nur an den Kunden, nie direkt an Dritte.
5. Ausführung je Recht (Abschnitte 3.2 bis 3.6), danach Antwort über den Kunden und Protokollierung (Zeitpunkt, Umfang, Ausführender; ohne Geheimniswerte und ohne unnötige Inhaltskopien).

### 3.2 Auskunft (Art. 15)

Umfang (Vorschlag, Anwalt entscheidet): Adresse, ggf. Vorname, Status, Zeitpunkte (Anmeldung, Bestätigung, Abmeldung), Einwilligungstext mit Version, Quelle; auf Verlangen zusätzlich Kampagnenzuordnung und Sperrlistengrund. [ANWALT-7: Auskunftsumfang je Datenart (Zustellereignisse, Webhook-Daten, Protokolle) und Grenzen gegenüber Rechten Dritter festlegen.] Export nur für den Kunden, protokolliert.

### 3.3 Berichtigung (Art. 16)

Unrichtige Daten (z. B. Vorname) werden auf Verlangen berichtigt; Nachweisversion bleibt erhalten (Änderung als neuer Stand mit Zeitpunkt, kein Überschreiben des Einwilligungsnachweises).

### 3.4 Löschung und Widerruf (Art. 17, Art. 7 Abs. 3)

Abmeldung wirkt sofort, auch für geplante Kampagnen; Adresse kommt mit Grund und Zeitpunkt auf die Sperrliste (nur Adresse/Prüfwert und Grund). Aktive Kontaktdaten werden gelöscht; Nachweise und Sperre bleiben nach Teil 2 bestehen. Über Importe oder Neuanmeldungen ohne neue bestätigte Einwilligung darf die Sperre nicht umgangen werden. Widerruf wirkt für die Zukunft; die Rechtmäßigkeit der bisherigen Verarbeitung bleibt unberührt (Art. 7 Abs. 3).

### 3.5 Export / Datenübertragbarkeit (Art. 20)

Der Kunde erhält die bereitgestellten Daten (Adresse, Vorname, Zeitpunkte, Einwilligungsversion, Quelle) in einem nutzbaren Format (Vorschlag: CSV mit Datums-Dateiname); Umfang wählbar (nur bestätigte / alle mit Status / alle mit Nachweis). Jeder Export wird protokolliert (Zeitpunkt, Benutzer, Umfang). [ANWALT-7 gilt für Format und Umfang.]

### 3.6 Widerspruch und Einschränkung (Art. 21, Art. 18)

Widerspruch gegen den Newsletter wirkt wie ein Widerruf (sofortige Abmeldung + Sperrliste). Einschränkungsverlangen werden bis zur Klärung durch Kennzeichnung des Datensatzes umgesetzt (kein Versand, keine Löschung der Nachweise bis zur Entscheidung).

## Teil 4 – Ablauf bei Datenschutzverletzungen (Erkennen bis Meldung) und DSFA-Schwellenprüfung

Grundsatz: pixel&code meldet jede Verletzung dem Kunden unverzüglich (Art. 28 Abs. 2 i. V. m. Weisungspflicht, Art. 33 Abs. 2). Der Kunde als Verantwortlicher entscheidet und meldet an die Aufsichtsbehörde (Art. 33) und benachrichtigt Betroffene (Art. 34); pixel&code unterstützt ihn dabei. Technische Maßnahmen folgen Art. 32 (Zugriffsbeschränkung, Trennung je Kunde, Verschlüsselung, Sicherung, Protokollierung – PRÜFEN im Einzelfall).

### 4.1 Ablauf in sechs Schritten

1. Erkennen: Eingänge sind Alarmkanal, externe Überwachung, Webhook-Auffälligkeiten (z. B. Beschwerde-/Rückläuferwellen), Kunden- oder Betroffenenhinweise, Fehlermeldungen der Befehlshülle. Jede Auffälligkeit wird mit Zeitpunkt und Fundstelle festgehalten. Bereitschaft: [Erreichbarkeit pixel&code, z. B. E-Mail/Telefon – einsetzen].
2. Eindämmen: betroffene Wege sofort stoppen (Stopp-Schalter je Kunde für Versand, Schlüssel widerrufen und ersetzen, Vorschau sperren, Zugang entziehen). Kein Restore über den Vorfall hinweg ohne Sicherung der Spuren; keine Geheimniswerte in Protokolle oder Meldungen.
3. Bewertung: Was ist betroffen (welcher Kunde, welche Datenarten, wie viele Personen ungefähr), wie ist es geschehen, wie lange, welche Folgen drohen (z. B. unbefugte Newsletter-Zustellung, offengelegte Adressen). Ergebnis in die Dokumentation (Abschnitt 4.2). Bei Unklarheit eskaliert pixel&code an den Kunden und – über den Kunden – an den Anwalt, statt Folgen kleinzurechnen.
4. Meldung an den Kunden unverzüglich: pixel&code informiert den Kunden ([Kontaktweg – einsetzen]) sofort nach Bekanntwerden mit: Art der Verletzung, Zeitpunkt (bekannt/vermutet), betroffene Datenarten und ungefähre Personenzahl, bereits getroffene Maßnahmen, Name/Kontakt für Rückfragen. Ergänzungen folgen, sobald bekannt.
5. Meldung an die Aufsichtsbehörde und Benachrichtigung Betroffener durch den Verantwortlichen: Der Kunde meldet der zuständigen Aufsichtsbehörde (Art. 33: unverzüglich und möglichst binnen 72 Stunden nach Bekanntwerden; Begründung bei Verspätung; Nachmeldung bei schrittweiser Klärung – Fristen und Ausnahmen bestätigt der Anwalt). Betroffene benachrichtigt der Kunde unverzüglich bei voraussichtlich hohem Risiko (Art. 34), in klarer Sprache mit Art, Folgen, Maßnahmen und Kontakt. [ANWALT-8: Zuständige Aufsichtsbehörde je Kunde, DSB-Bestellpflicht, Meldewege und Formulierungen prüfen und freigeben.]
6. Aufarbeitung: Ursache beheben (Schlüsselrotation, Berechtigungskorrektur, Vorlagenfix), betroffene Nachweise (Sperrliste, Protokolle) prüfen, Befehlshüllen-Protokolle sichern, Lernpunkt in Runbook/Checkliste übernehmen.

### 4.2 Dokumentation (Art. 33 Abs. 5, je Vorfall)

Je Vorfall werden festgehalten: Zeitpunkt Bekanntwerden/Meldung, Art und Ursache, betroffene Kunden/Datenarten/Personenzahl (Schätzung kennzeichnen), Folgenbewertung, Maßnahmen mit Zeitpunkten, Meldungen (an wen, wann, durch wen), Entscheidungsgründe bei Nichtmeldung an Behörde/Betroffene (Anwalt entscheidet mit). Aufbewahrung nach Teil 2 (Nachweiszweck). Vorlage für die Meldung an den Kunden: Betreff „Datenschutzvorfall [Kunde/Datum]", Felder: 1) Was ist passiert, 2) Wann (bekannt/vermutet), 3) Welche Daten/Personen (Art, Zahl, Schätzung), 4) Welche Folgen drohen, 5) Was wurde bereits getan, 6) Was der Kunde jetzt entscheiden muss (Behördenmeldung, Betroffeneninfo, Anwalt), 7) Kontakt bei pixel&code.

### 4.3 Schwellenprüfung zur Datenschutz-Folgenabschätzung (Art. 35)

Vor jedem neuen Kunden und vor jeder wesentlichen Änderung (neues Modul wie Newsletter, neues Tracking, neuer Unterauftragsverarbeiter, Medien-/Speicherwechsel) beantwortet pixel&code gemeinsam mit dem Kunden schriftlich: 1) Liegt eine systematische umfangreiche Bewertung, eine großflächige Verarbeitung besonderer Datenkategorien oder eine systematische öffentliche Überwachung vor (Art. 35 Abs. 3)? 2) Besteht aus anderen Gründen voraussichtlich ein hohes Risiko (große Empfängerzahl, sensible Inhalte wie Gesundheits-/Bewertungsdaten, Team-Fotos Minderjähriger – PRÜFEN je Kunde)? 3) Ergebnis: a) kein hohes Risiko → keine DSFA, Begründung ablegen; b) hohes Risiko möglich → DSFA durchführen (lassen); c) unklar → Anwalt entscheiden lassen. Newsletter mit Double-Opt-in im üblichen Umfang ist eine Arbeitsannahme für Fall a), keine Festlegung. [ANWALT-9: DSFA-Pflicht je Kunde und Modul bewerten; behördliche Black-/Whitelists und DSB-Einbindung im Einzelfall prüfen.] Tracking/Öffnungsmessung nur mit gesonderter Einwilligung (Art. 6 Abs. 1 lit. a, Art. 7; TDDDG § 25 für Endgerätezugriff) und erst nach Freigabe. [ANWALT-10: Tracking- und Cookie-Einwilligung je Kunde prüfen und freigeben.] Bestandskunden-Ausnahmen im Werberecht (UWG § 7) werden nicht ohne Prüfung genutzt. [ANWALT-11: Klären, ob und unter welchen Voraussetzungen eine Bestandsausnahme nutzbar ist oder strikte bestätigte Einwilligung für alle gilt.] Impressumsangaben in jeder Newsletter-Fußzeile (DDG § 5) stammen aus der geprüften Kundenvorlage. [ANWALT-12: Impressums- und Kennzeichnungspflichten in Bestätigungs-, Test- und Newsletter-Mails je Kundentyp (Unternehmer, Freiberufler, Vereine) prüfen.]

## Sammelliste der Anwaltspunkte

- [ANWALT-1] AVV-Formulierungen, Weisungsbindung und Weisungskette (Art. 28) prüfen und freigeben.
- [ANWALT-2] Verarbeitungsort, Drittlandtransfer, Garantien (Art. 44 ff.), Anbieterangaben und DPA je Unterauftragsverarbeiter prüfen.
- [ANWALT-3] Rechtsgrundlagen (Art. 6), Einwilligungstexte (Art. 7), Art.-13-Texte, Impressumstexte prüfen und freigeben.
- [ANWALT-4] Löschfristen je Datenart, Sperrlisten-/Nachweisaufbewahrung und Vorrang gesetzlicher Pflichten prüfen und freigeben.
- [ANWALT-5] Backup-Verfall, Einzelkunden-Restore und Sperrlistenverhalten beim Restore prüfen und freigeben.
- [ANWALT-6] Antwortfristen, Identitätsprüfung und Verfahren für Betroffenenanfragen festlegen.
- [ANWALT-7] Auskunftsumfang (Ereignis-/Protokolldaten, Rechte Dritter) sowie Exportformat und -umfang festlegen.
- [ANWALT-8] Zuständige Aufsichtsbehörde, DSB-Pflicht, Meldewege und Meldeformulierungen prüfen und freigeben.
- [ANWALT-9] DSFA-Pflicht je Kunde/Modul bewerten; Black-/Whitelists und DSB-Einbindung prüfen.
- [ANWALT-10] Tracking-/Cookie-Einwilligung (Art. 6/7, TDDDG § 25) je Kunde prüfen und freigeben.
- [ANWALT-11] UWG-§-7-Bestandsausnahme: Nutzbarkeit oder strikte Einwilligungspflicht für alle Empfänger entscheiden.
- [ANWALT-12] Impressums-/Kennzeichnungspflichten in Mails je Kundentyp prüfen.

## Quellen (gelesen, nichts geändert)

docs/WORKFLOW-PLAN.md V3; docs/DATENKLASSEN.md; docs/KUNDEN-ANLEGEN-CHECKLISTE.md; docs/NEWSLETTER-DATENSCHUTZ.md; docs/NEWSLETTER-API.md; HPSE-Newsletter-Konzept 25.11.2026; HPSE-Dienstleisterübersicht 25.11.2026; config/legal.json; src/pages/impressum.astro; src/pages/datenschutz.astro. Resend-/Vercel-Detailseiten wurden in diesem Auftrag nicht erneut aufgerufen; dort Ungeprüftes ist als PRÜFEN/[ANWALT-2] markiert.
