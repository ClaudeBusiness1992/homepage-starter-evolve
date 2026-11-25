# Schaltzentrale: Befehlshülle, Vorbereitungsstand

Das Grundgerüst läuft mit Node.js und dessen Standardbibliothek. Aufruf aus dem Projektverzeichnis: `node scripts/control/control.mjs BEFEHL --kunde KENNUNG --domain DOMAIN`. Die Kundenkennung besteht aus kleinen ASCII-Buchstaben, Ziffern und internen Bindestrichen; die Domain ist ein kleingeschriebener DNS-Name ohne Protokoll oder Pfad. Für internationale Namen ist die ASCII-Darstellung erforderlich.

| Befehl | Geplanter Zweck |
| --- | --- |
| `kunde-anlegen` | Projekt, Domains, kundenspezifische Zugänge, Datenbankrolle, Resend, Vorschau-Sperre und Grundeinstellungen vorbereiten. |
| `update-vorschau` | Freigegebenen Stand als geschützte zeitweilige Vorschau bereitstellen. |
| `go` | Geprüften Stand nach Sicherung vor einer Datenbankmigration aktivieren. |
| `zurueck` | Nur einen kompatiblen früheren Stand aktivieren, ohne Inhalte zurückzusetzen. |
| `status` | Projekt-, Versions-, Sperr-, Audit- und Ampelstatus ermitteln. |

Alle Befehle sind standardmäßig Trockenläufe. Sie geben ausschließlich den geplanten Ablauf aus und lösen keine Anbieteraktionen aus. `--ausfuehren` endet stets mit Exit-Code 3: **Sämtliche echten Aktionen sind noch Platzhalter.** Insbesondere gibt es weder Anbieter-APIs noch Migration, Sicherung, Statusabfrage oder Freischaltung. Wiederholte Trockenläufe ändern keinen Kundenstand; sie erzeugen jeweils einen lokalen Protokolleintrag. Echte Idempotenz muss bei Implementierung der Anbieteraktionen über dauerhafte Vorgangskennungen und Abgleich des Ist-Zustands hergestellt und geprüft werden.

## Sicherheit und Grenzen

Das Zielmodell hält die Generalschlüssel nur in einer getrennten, geschützten Hülle; die KI darf feste Befehle aufrufen, aber keine Schlüssel lesen. Dieses Grundgerüst erzwingt diese Trennung **noch nicht**: Ein Prozess mit denselben Dateirechten oder derselben Umgebung kann entsprechende Werte lesen. Vor produktiver Nutzung sind ein separater Dienst beziehungsweise getrennte Betriebssystemidentitäten, eng begrenzte Aufrufrechte und eine unabhängige Sicherheitsprüfung erforderlich. Schlüssel dürfen künftig ausschließlich aus der Umgebung dieses privilegierten Dienstes oder aus einer nicht versionierten Datei außerhalb des Repositories stammen, deren Pfad über eine Umgebungsvariable übergeben wird. Weder Werte noch Pfad werden ausgegeben oder protokolliert. Das Grundgerüst liest noch keine Schlüssel und nimmt keine Schlüsseldatei entgegen.

Für `go --ausfuehren` verlangt die Hülle `GO` über das steuernde Terminal; Argumente und umgeleitete Standardeingabe können die Bestätigung nicht ersetzen. Ohne steuerndes Terminal wird sie verweigert. Die Terminaleingabe weist Nicks Identität noch nicht unabhängig nach. Auch nach Bestätigung bleibt jede Ausführung gesperrt.

Eine atomare Verzeichnissperre unter `scripts/control/.runtime` verhindert gleichzeitige Vorgänge mit derselben Kundenkennung auf demselben gemeinsamen Dateisystem. Alle Aufrufer müssen denselben Sperrort nutzen. Nach Absturz bleibt die Sperre bestehen; sie wird nicht automatisch gebrochen. Vor einer manuellen Bereinigung Eigentümerschaft und laufende Vorgänge prüfen. Der lokale Anhang `aktionen.jsonl` enthält nur Zeit, festen Befehlsnamen und Ergebnis, keine Eingaben oder Geheimnisse. Er ist kein fälschungssicheres Auditprotokoll. Laufzeitdateien dürfen nicht eingecheckt werden und müssen für einen späteren Betrieb außerhalb des Quellbaums eingerichtet und geschützt werden.

Exit-Codes: 0 Trockenlauf, 2 ungültige Eingabe, 3 Ausführung gesperrt, 4 Kunde gesperrt, 5 lokaler Sperr- oder Protokollfehler. Der Statusbefehl gibt nur seinen Plan aus und behauptet keinen echten Betriebsstatus.

## Nächste Schritte

Getrennte Betreiberidentität und Schlüsselhaltung entwerfen und prüfen; feste API-Verträge, Kundenidentität und dauerhafte Idempotenz festlegen; Anbieteradapter und prüfbare Sicherung implementieren; Go-Bestätigung an eine getrennte Betreiberidentität binden; Wiederanlauf und Sperrenbehandlung testen. Vor einem produktiven Einsatz sind passende unabhängige Sicherheits- und Freigabeprüfungen nötig.
