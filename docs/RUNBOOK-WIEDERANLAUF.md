# Wiederanlauf: Runbook und Probeplan

Stand: 25.11.2026 · Grundlage: WORKFLOW-PLAN.md, Version 3, insbesondere Abschnitte 2, 8 und 10. **Planung, noch nicht umgesetzt oder erprobt.** Dieses Dokument ist keine Zusage für eine Rund-um-die-Uhr-Erreichbarkeit oder verlustfreie Wiederherstellung.

## Ziel und Verantwortung

Vor dem ersten zahlenden Kunden wird eine einzelne Seite ohne funktionierenden Editor aus einer unabhängigen Sicherung in einer leeren, isolierten Umgebung wiederhergestellt. Zusätzlich wird eine fehlerhafte Technikfreigabe auf die nachweislich kompatible vorherige Version zurückgenommen; die zuletzt erfasste Öffnungszeit bleibt erhalten. Danach wird der Einzelkunden-Restore regelmäßig wiederholt; Intervall und Zuständigkeit sind vor Kundenstart festzulegen.

Nick entscheidet über Eindämmung, Wiederanlauf, Freigabe, Kommunikation und gegebenenfalls Hinzuziehung von Dienstleistern. Eine Vertretung ist zunächst nicht vorgesehen. Bei Abwesenheit kann die Reaktion entsprechend später erfolgen. Ein Sicherheitsvorfall wird dokumentiert und nach den dafür geltenden vertraglichen und rechtlichen Vorgaben bearbeitet; dieses Runbook trifft keine Rechtsentscheidung.

Vor Kundenstart verbindlich ausfüllen und bei der Probe messen:

| Größe | Vereinbartes Ziel | Tatsächlicher Wert / Abweichung |
| --- | --- | --- |
| Zielzeit bis zur wieder lesbaren Seite, ab Erkennung | ______ | ______ |
| Zielzeit bis zur Wiederherstellung der Schreibfunktionen | ______ | ______ |
| Maximal tolerierbarer Datenverlust (Zeitspanne) | ______ | ______ |
| Letzte erfolgreiche Sicherung und ihr Alter | ______ | ______ |
| Intervall der Einzelkunden-Restoreprobe | ______ | ______ |
| Verantwortliche Person / Kontaktweg während der verfügbaren Zeiten | ______ | ______ |

Die Zielzeiten sind erst nach Messung und Vereinbarung belastbar. Zwischengespeicherte Seiten können bei Serverausfall erreichbar bleiben; Formulare und Speichern benötigen den Server. Cache-Verfügbarkeit ist keine Sicherung.

## Vorbedingungen und Vorbereitung

1. Kundenidentität, betroffene Domain, Umgebung, Zeitpunkt und Symptom feststellen. Vor Eingriffen den Zustand und den letzten bekannten guten Paketstand dokumentieren. Bei unklarem Umfang Änderungen und weitere Rollouts anhalten.
2. Verschlüsselte, außerhalb derselben Ausfallzone liegende Sicherung samt Zeitpunkt und Integrität feststellen. Datenbank, Medien, benötigte Konfiguration und Schlüssel müssen zusammen wiederherstellbar sein; der Betreiberzugang darf die unabhängigen Sicherungen nicht löschen können. Zugriff und Entschlüsselung durch berechtigte Person prüfen, ohne Schlüsselwerte offenzulegen.
3. Leere, isolierte Zielumgebung und erlaubte Zieladressen binden. Keine produktiven Empfänger, Webhooks oder Tracking aus der Probe erreichen; Versand technisch sperren. Kopien echter Daten nur mit geklärtem Zweck und Rechtsgrundlage, begrenztem Zugriff und Löschfrist; keine Kopie in Backups, Logs oder KI-Verlauf. Ist das nicht sicher möglich, Testdaten verwenden und die Einschränkung protokollieren.
4. Wiederherstellungswerkzeuge, Zugriff auf Sicherung und dokumentierte Freigabe- und Rücknahmewege vorbereiten. Die Befehlshülle und konkrete Kommandos sind erst zu implementieren und zu verifizieren; hier werden keine vorhandenen Befehle behauptet. Ein Wiederanlauf darf keine fremden Kundendaten überschreiben.
5. Für die Probe einen bekannten Öffnungszeit-Wert und Zeitpunkt als Soll festhalten. Nach der letzten Sicherung eine neue Öffnungszeit erfassen und getrennt sichern bzw. nachweisbar aus dem aktuellen intakten Datenstand übernehmen. Wenn dieser Stand nicht verfügbar ist, den Verlust offen messen; die Erhaltung darf nicht behauptet werden. Produktive Daten niemals für eine Probe zurücksetzen.

## Wiederanlauf-Probe

1. Beginn und Ausgangsstand im Messprotokoll erfassen. Editor für die Probe als nicht verfügbar behandeln; ihn nicht reparieren oder als Restore-Voraussetzung nutzen.
2. Eine unabhängige Sicherung eines einzelnen Kunden auswählen, Zeitpunkt und Integrität belegen. Datenbank, Medien und nötige Konfiguration in die leere isolierte Umgebung wiederherstellen; Schlüssel nur über den vorgesehenen geschützten Weg bereitstellen.
3. Freigegebenes kompatibles Kernpaket und die wiederhergestellten Kundendaten verbinden. Seite und Medien ohne Editor aufrufen; identifizieren, welche Daten seit der Sicherung fehlen. Die zuletzt erfasste Öffnungszeit aus dem nachweislich aktuelleren intakten Stand kontrolliert übernehmen und Wert und Zeit vergleichen. Fehlt diese Quelle, Probe für dieses Kriterium nicht bestanden markieren.
4. Fehlerhafte Technikfreigabe in der isolierten Probe zurücknehmen: kompatible unmittelbar vorherige Version anhand ihrer Paketkennung aktivieren, nicht neu bauen. Vorher Kompatibilität einschließlich Datenmodell und Schreib-/Leserundlauf belegen. Ist ein Rückweg fachlich unmöglich oder nicht belegt, Rücknahme sperren und Korrektur nach vorn dokumentieren.
5. Seite, Medien und zuletzt erfasste Öffnungszeit nach Rücknahme erneut prüfen. Die Rücknahme des Seitenstands darf Inhalte nicht zurücksetzen. Schreibfähigkeit nur mit Testdaten und gesperrtem Versand prüfen.
6. Zeiten, Datenalter, Abweichungen und Befunde protokollieren. Nick entscheidet über Bestehen und Maßnahmen. Probedaten nach dokumentierter Frist und geprüftem Übernahmebedarf sicher entfernen; keine ungebundene Umgebung oder fremde Daten bereinigen.

## Störfallszenarien

### Server ausgefallen

**Erkennung:** Externer Prüfer meldet Ausfall oder schweigt; Status ist unbekannt, wenn eine aktuelle Prüfung fehlt. Inhalte können im Vercel-Zwischenspeicher noch sichtbar sein; Formulare und Speichern können ausfallen.

1. Nick prüft von außen betroffene Seiten und Erreichbarkeit der Schnittstelle und hält Erkennungszeit und Umfang fest. Keine laufenden Dienste blind neu starten.
2. Nick entscheidet über Kommunikation und Wiederanlauf. Schreibzugriffe und Formulare bei Bedarf kontrolliert sperren; keine erfolgreiche Übermittlung vortäuschen.
3. Ist der Server nicht zeitgerecht wiederherstellbar, nach Vorbedingungen aus unabhängiger Sicherung in leerer Umgebung wiederherstellen, inklusive Medien und Konfiguration. Datenverlust gegenüber letztem belegtem Stand messen.
4. Nach Prüfung der Schnittstelle, Seite und Medien entscheidet Nick über Umschaltung; danach Lesefluss und kontrollierten Formular-/Speichertest prüfen und Ausfall dokumentieren.

### Datenbank beschädigt

**Erkennung:** Datenbankfehler, inkonsistente Inhalte oder fehlgeschlagene Integritätsprüfung.

1. Betroffenen Kunden und Zeitraum eingrenzen; schreibende Zugriffe anhalten, um weitere Schäden zu vermeiden. Fehlerzustand und Zeitpunkt sichern, ohne Inhalte in Logs zu kopieren.
2. Nick wählt eine intakte unabhängige Sicherung und lässt sie isoliert für diesen Kunden wiederherstellen. Zeitpunkt und Differenz zum letzten nachweisbaren Datenstand ermitteln.
3. Aktuellere intakte Änderungen, insbesondere Öffnungszeiten, nur gezielt und nachvollziehbar übernehmen. Unklare oder fehlende Änderungen als Verlust ausweisen.
4. Nach Prüfung von Inhalten, Medien und Rechten entscheidet Nick über kontrollierte Rückführung und anschließende Prüfung. Andere Kunden bleiben unberührt.

### Fehlerhaftes Release

**Erkennung:** Fehler nach Go, fehlgeschlagener Kernfluss oder auffälliges Audit. Rollout weiterer Kunden stoppen.

1. Aktuelles und vorheriges Paket sowie den betroffenen Kunden identifizieren; Nick entscheidet über Rücknahme oder Korrektur nach vorn.
2. Nur bei nachgewiesener Kompatibilität die unmittelbar vorherige, bereits getestete Paketversion aktivieren. Bei Datenmodelländerung muss der Rundlauf „neu schreiben, alt lesen und erneut speichern“ bestanden sein. Andernfalls Rücknahme sperren und nach vorn korrigieren.
3. Inhalte und insbesondere zuletzt erfasste Öffnungszeiten auf aktuellem Stand belassen; keinen Datenbank-Restore als normalen Release-Rollback ausführen.
4. Nach Aktivierung Seite, Kernfluss und Öffnungszeiten prüfen, Zeit und Paketkennung festhalten. Nick entscheidet über Fortsetzung des gestaffelten Rollouts.

### Konto oder Schlüssel kompromittiert

**Erkennung:** Unbekannte Anmeldung, unerwartete API-Aktion oder Hinweis auf Abfluss eines Schlüssels.

1. Nick grenzt betroffene Konten, Kunden und Berechtigungen ein und stoppt den missbräuchlichen Zugang über den jeweiligen Anbieter; Belege ohne Geheimniswerte sichern.
2. Betroffene Schlüssel widerrufen und getrennt neu ausstellen; Sitzungen und Rechte prüfen, zweiten Faktor sowie Zugriff auf unabhängige Sicherungen kontrollieren. Keine Schlüsselwerte in Chat, Protokoll oder KI-Kontext übernehmen.
3. Berechtigte Systeme über den vorgesehenen geschützten Weg neu anbinden, Funktion gezielt prüfen und weitere Aktivitäten beobachten. Nick entscheidet über Information und weitere Schritte nach geltenden Pflichten.

### Domain- oder DNS-Problem

**Erkennung:** Domain löst falsch oder nicht auf, Zertifikat schlägt fehl oder externe Prüfung meldet Nichterreichbarkeit.

1. Nick prüft betroffene Domain, DNS-Antworten, Zuordnung bei Vercel und Zertifikatsstatus; Zeitpunkt und letzte bekannte korrekte Konfiguration dokumentieren.
2. Ursache mit zuständigem DNS-Betreiber beziehungsweise Kunden eingrenzen. Nur die betroffenen Web-Einträge kontrolliert korrigieren; bestehende Mail-Einträge und Postfächer erhalten.
3. Änderungen und möglichen Rückweg dokumentieren; Verteilung und HTTPS von außen prüfen. Nick entscheidet über Kommunikation und Abschluss.

### Newsletter-Fehlversand

**Erkennung:** Falscher Inhalt, Empfängerkreis, Absender oder ungewollter Doppelversand. Newsletter ist ein optionales Zusatzmodul.

1. Nick stoppt ausstehende und geplante Sendungen über den vorgesehenen Anbieterweg und verhindert Wiederholungen; bereits zugestellte Mails lassen sich nicht zurückholen.
2. Umfang und Ursache anhand zulässiger Versandnachweise eingrenzen, ohne Empfängerlisten oder Schlüssel in den Bericht zu kopieren. Abmeldungen und Sperrliste weiter wirksam halten.
3. Nick entscheidet über Information, mögliche Korrektur und erforderliche weitere Schritte. Versand erst nach Ursachenbehebung und gezielter Prüfung wieder freigeben; Team-Limits und Auswirkungen auf andere Kunden berücksichtigen.

## Messprotokoll und Abnahme

| Feld | Eintrag |
| --- | --- |
| Datum, verantwortliche Person, Kunde/Testkennung, Umgebung | ______ |
| Szenario, Beginn/Erkennung, Ende Lesen, Ende Schreiben | ______ |
| Sicherungsquelle, Zeitpunkt, Integritätsnachweis | ______ |
| Paketkennung vorher/nachher, Kompatibilitätsnachweis | ______ |
| Letzte erfasste Öffnungszeit: Wert/Zeit vorher und nachher, Quelle | ______ |
| Gemessene Wiederanlaufzeiten und Datenverlust; Abweichung vom Ziel | ______ |
| Prüfungen für Seite, Medien, Schnittstelle und Schreibfluss | ______ |
| Versand/Webhooks/Tracking gesperrt; Löschfrist und Bereinigung | ______ |
| Befunde, Entscheidung Nick, Maßnahmen und Termin für Nachprobe | ______ |

**Bestanden**, wenn die unabhängige Sicherung in leerer Umgebung ohne Editor eine lesbare Seite samt Medien wiederherstellt, die kompatible Vorversion erfolgreich aktiviert wird, die zuletzt erfasste Öffnungszeit nachweislich erhalten bleibt und alle Messwerte und Abweichungen dokumentiert sind. Ziele für Zeit und Datenverlust müssen erreicht oder vor Kundenstart ausdrücklich neu entschieden werden. Nicht verfügbare Daten, fehlende Kompatibilitätsbelege oder ungeprüfte Funktionen bleiben offen; ein Probelauf ist keine Produktionsfreigabe.
