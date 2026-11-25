# Kunden anlegen: Checkliste

Stand: 25.11.2026 · Grundlage: WORKFLOW-PLAN.md Version 3 und Dienstleisterübersicht vom 25.11.2026. **Planung: Befehlshülle, Automatisierung und Nachweise sind noch umzusetzen und zu prüfen.** Ziel ist ein Kunde mit möglichst wenig Handarbeit, ohne Geheimnisse an die KI weiterzugeben.

## Vor dem ersten Kunden

- [ ] **Manuell:** Konten, Team, Zahlung und erste Generalschlüssel bei Vercel und Resend einrichten; gegebenenfalls DNS-Zone, unabhängigen Sicherungsspeicher und externe Überwachung einrichten. Generalschlüssel nur im geschützten Betreiberweg der Befehlshülle hinterlegen, nie in KI-Kontext, Bericht oder Log. **Nachweis:** Konto- und Zugriffsstatus ohne Schlüsselwerte. **Rückweg:** Zugang gezielt widerrufen; bestehende Kunden nicht beeinträchtigen.
- [ ] **Manuell:** Auftragsverarbeitungsverträge mit den tatsächlich eingesetzten Dienstleistern abschließen und dokumentieren; Funktionen und Datenbank in der EU vorsehen. **Nachweis:** dokumentierte Verträge und Zuordnung. **Rückweg:** Anbieter nicht für Kundendaten einsetzen, bis Voraussetzungen geklärt sind.
- [ ] **Manuell:** Sicherungsspeicher außerhalb derselben Ausfallzone, externe Überwachung und genau einen aktiven Alarmkanal auswählen und prüfen. Vorläufige Richtung: EU-Speicher mit Löschschutz, externer Prüfer und HTTP-Alarm; Anbieter, Bedingungen und Kosten sind noch zu prüfen. **Nachweis:** dokumentierte Auswahl und erfolgreiche Wiederanlauf-Probe. **Rückweg:** nicht zum Kundenstart freigeben, bis Sicherung und Alarmierung nachgewiesen sind.

## Automatisierbare Schritte je Kunde

Die künftige Befehlshülle soll feste, wiederholbar und sicher ausführbare Schritte bereitstellen, Teilfehler anzeigen und bereits angelegte Ressourcen anhand ihrer Kundenkennung wiederfinden. Vor datenändernden Schritten sichert sie automatisch. Keine Kommandos oder Anbieterrechte gelten hier bereits als implementiert. Jeder Schritt braucht eine explizite Kundenzuordnung; Rückwege dürfen keine fremden Ressourcen oder vorhandenen Kundendaten löschen.

| Schritt | Art und vorgesehener Ablauf | Nachweis | Rückweg |
| --- | --- | --- | --- |
| Vercel-Projekt | Automatisiert per API: ein Projekt je Kunde aus freigegebener Kern-Paketkennung anlegen; projektbegrenzten Schlüssel vorsehen. | Kundenkennung, Projekt-ID, Paketkennung, Berechtigungsprüfung ohne Schlüsselwert. | Nur neu angelegte, eindeutig zugeordnete Ressourcen nach Prüfung entfernen; bestehende Deployments erhalten. |
| Domains | Automatisiert: vorgesehene Live- und Vorschauadressen am Projekt zuordnen; DNS über API nur bei freigegebener verwalteter Zone. | Zuordnung und DNS-/Zertifikatsstatus. | Zuordnung oder eigene Einträge auf dokumentierten Vorzustand zurücksetzen; Mail-DNS erhalten. |
| Datenbank und Rolle | Automatisiert: eigene PostgreSQL-Datenbank oder eigenes Schema mit eigener Rolle nach gewähltem Muster anlegen. | Kundenbindung, Schema-/Rollennamen, geprüfte Trennung und Sicherungsstatus, ohne Dateninhalte. | Neu angelegte leere Ressourcen gezielt entfernen; bei vorhandenen Daten erst Sicherung und gesonderte Entscheidung zur Löschung. |
| Daten-Schnittstelle | Automatisiert: kundengebundenen Schlüssel erstellen und geschützte Konfiguration hinterlegen; feste Wege, Ratenbegrenzung und Protokollierung einrichten. | Schlüssel-ID oder Status, Kundenbindung und isolierter Zugriffstest ohne Schlüsselwert. | Schlüssel widerrufen und durch neuen ersetzen; andere Kunden nicht berühren. |
| Resend-Domain und Schlüssel | Automatisiert per API: Domain anmelden, benötigte DNS-Einträge abfragen, Verifizierung anstoßen und eigenen Schlüssel je Kunde bereitstellen. DNS-Setzung nur bei berechtigtem API-Zugriff. Rechtebegrenzung von Resend-Schlüsseln ist noch zu prüfen. | Domain-Verifizierungsstatus, Schlüsselstatus und kontrollierter Testempfang; keine Schlüsselwerte. | Schlüssel widerrufen; nur zugeordnete neue Domain-/DNS-Einträge nach Prüfung entfernen. Bestehenden Mailbetrieb erhalten. |
| Vorschau-Sperre | Automatisiert: serverseitigen Schutz vor Seiten, APIs, Bildern und Downloads sowie noindex aktivieren. Keine Mail-Schlüssel in zeitweiligen Update-Vorschauen. | Unangemeldete Zugriffe auf alle genannten Ressourcen verweigert; noindex geprüft. | Gesperrten Zustand wiederherstellen; Startschalter öffnet nur die künftige Live-Adresse, dauerhafte Prüfseite bleibt geschützt. |
| Standard-Einstellungen | Automatisiert: leere Kundeneinstellungen und bestätigte Standardmodule aus freigegebenem Kern initialisieren; keine fremden Kundendaten übernehmen. | Kundenkennung, Paketversion und Prüfung der leeren Ausgangsdaten. | Vorhandenen Stand aus Sicherung wiederherstellen; Eingaben nicht überschreiben. |

## Menschliche Schritte je Kunde

| Schritt | Art und Zuständigkeit | Nachweis | Rückweg |
| --- | --- | --- | --- |
| Verträge und Leistungsumfang | Manuell: Nick und Kunde klären Vertrag, Auftragsverarbeitung, Zuständigkeiten und erreichbare Leistungsgrenzen; keine Rund-um-die-Uhr-Zusage. | Unterzeichnete beziehungsweise dokumentierte Vereinbarung. | Vor Start klären oder Vertrag nach vereinbarten Bedingungen beenden. |
| DNS-Wechsel | Manuell, wenn Kunde seine Zone verwaltet: Kunde setzt vorgegebene Web- und nötige Resend-Einträge beziehungsweise delegiert nach Vereinbarung. Nick prüft; Postfächer bleiben unangetastet. | Bestätigte Einträge, externe Auflösung und gültiges Zertifikat. | Vorherige Web-Einträge anhand dokumentierter Werte wiederherstellen; Ausbreitungszeit berücksichtigen. |
| Erstbefüllung | Manuell: Kunde liefert freigegebene Texte und Bilder; Zuständigkeit für Einpflege und Freigabe vorab vereinbaren. | Inhalt und Medien auf gesperrter Vorschau vom Kunden bestätigt. | Einzelne Änderungen über Verlauf zurücknehmen oder gesicherten Stand gezielt wiederherstellen. |
| Rechtstexte | Manuell: Verantwortlichkeit und kundenspezifische Inhalte für Impressum und Datenschutz klären, eingesetzte Dienste berücksichtigen; fachliche Prüfung durch zuständige Stelle. | Freigegebene Texte und erreichbare Links dokumentieren. | Fehlerhafte Fassung korrigieren; Start bei ungeklärtem Inhalt zurückstellen. |
| Startprüfung | Manuell: Nick prüft mit Kunde Design, /admin, Inhalte, Rechte, Sperre, Formulare bis zum kontrollierten Empfang, Passwort-Zurücksetzen und relevante Mobilansichten. | Datum, Ergebnisse, offene Befunde und Kundenfreigabe. | Gesperrt lassen oder Schutz wieder aktivieren; Befunde beheben und gezielt nachprüfen. |
| Weiterleitungen | Manuell festlegen, technisch soweit möglich automatisiert einrichten: alte wichtige Adressen auf passende neue Ziele abbilden. | Liste und Stichproben der alten und neuen Adressen. | Vorherige Zuordnung aus dokumentierter Liste wiederherstellen. |
| noindex aufheben und Go | Manuell entscheidet Nick nach Kundenfreigabe; die Befehlshülle befördert genau den geprüften Stand und öffnet nur die Live-Adresse. Sitemap und Vorschaubild prüfen. | Freigabe, Paket-/Deploymentkennung, Prüfung von Indexierbarkeit und Schutz der Prüfseite. | Live-Schutz wieder aktivieren beziehungsweise kompatible Vorversion zurücknehmen; Inhalte bleiben erhalten. |
| Preis | Manuell: vor Vertragsschluss vorläufigen Preis, Leistungsumfang und Anpassungsklausel vereinbaren; Aufwand, Support und Dienstkosten im Pilot erfassen. Newsletter gesondert anbieten. | Dokumentiertes Angebot und Zustimmung. | Vor Abschluss anpassen oder nicht beauftragen; spätere Änderungen nach Vereinbarung. |

## Abschluss und offene Voraussetzungen

- [ ] Kunde, Domain, Projekt, Datenbankrolle, Schlüsselstatus, Kernversion, Schutzstatus und Sicherung sind eindeutig dokumentiert; Geheimnisse stehen nicht im Protokoll.
- [ ] Unabhängige Sicherung und Einzelkunden-Wiederanlauf sind nach [Runbook](RUNBOOK-WIEDERANLAUF.md) nachgewiesen; vereinbarte Zielzeiten und tolerierbarer Datenverlust sind eingetragen.
- [ ] Kontaktformular und Passwort-Zurücksetzen sind geprüft. Newsletter nur bei Buchung: Double-Opt-in, Einwilligungsnachweis, Abmeldung, Sperrliste und Schutz vor Doppelversand prüfen.
- [ ] Export und Domain-Übergabe bei Vertragsende sind vor dem ersten Kunden beschrieben. Medienablage, Alarmkanal und Überwachungs-/Sicherungsanbieter sowie Rechteumfang der Resend-Schlüssel bleiben bis zur belegten Entscheidung offen.
