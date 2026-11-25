# Sicherungsziel – Stand der Entscheidung (25.11.2026)

Status: Vorschlag (BX11 nach Recherche geeignet), noch nicht bestellt. Alle Angaben sind aus Suchergebnissen und Drittquellen, nicht aus der offiziellen Hetzner-Dokumentation belegt (PRÜFEN).

## Rahmen (Nick)
- Hauptserver bei netcup (Tarif Lite 1: 2 vCore, 4 GB RAM, 80 GB SSD, 5,86 € im Monat inkl. Steuer, 6 Monate Laufzeit; nano und pico verworfen). Erweiterung bis 4 TB laut Nick, nicht geprüft.
- Genau eine Sicherungskopie, bei einem anderen Anbieter, eigenes Konto, losgelöst vom Hauptserver. Sicherung läuft zeitversetzt (nachts), um die Last zu senken.
- Standort: EU/EWR genügt (Anwaltsfrage ANWALT-10).

## Kandidat: Hetzner Storage Box
- Preise laut Hetzner-Seiten: BX11 3,20 € im Monat ohne Steuer (3,81 € inkl. 19 %), BX21 10,90 € ohne Steuer. Größen nicht bestätigt.
- Tarifwechsel in der Console ohne Datenverlust (laut Hetzner). Zugriff per SFTP, SCP, rsync. Unterkonten mit eigenem Verzeichnis. Snapshots manuell oder nach Zeitplan.
- Löschschutz (Drittquellen, PRÜFEN): Die Box selbst lässt sich nicht auf reines Anfügen stellen. Zwei Wege: (a) SSH-Schlüssel mit erzwungenem Befehl, der einen restic-Server im Anfüge-Modus startet (rclone serve restic --stdio --append-only) oder rest-server im Anfüge-Modus; (b) Snapshots, die nur in der Console oder per API verwaltet werden und vom SSH-Zugang des Servers nicht löschbar sein sollen. Ein Snapshot-Zurückspielen setzt die ganze Box zurück.
- Quellen: Anleitung zu Anfüge-Sicherungen auf einer Storage Box (fluix.one/blog/hetzner-restic-append-only), restic-Forum (forum.restic.net/t/hetzner-storage-box/10360), Anmerkung zu Borg im Anfüge-Modus (forum.proxmox.com/threads/append-only-mode-to-external-storage.132690).

## Offene Prüfungen vor Bestellung
1. Offizielle Hetzner-Dokumentation: Snapshots vom SSH-Zugang aus nicht löschbar? Erzwungener Befehl im Schlüssel unterstützt?
2. Größen der Tarife, Standorte (Deutschland/Finnland), Vertrag zur Auftragsverarbeitung.
3. Wiederanlauf-Probe (docs/RUNBOOK-WIEDERANLAUF.md) mit dieser Kopie durchführen.

## Recherche-Ergebnis BX11 (25.11.2026, Suchauszüge, offizielle Seiten nicht vollständig gelesen)
- Größe 1 TB laut Nick. Grenzen laut Hetzner-Übersicht: 10 gleichzeitige Verbindungen, bis zu 100 Unterkonten (die Hetzner-API zeigt an einer Stelle 200, vermutlich veraltet). Snapshots: bis zu 10 manuelle und 10 automatische; ist das Limit erreicht, wird der älteste automatisch gelöscht.
- restic über erzwungenen Befehl im SSH-Schlüssel (rclone serve restic --stdio --append-only) wird in Community-Quellen und einem Hetzner-Community-Tutorial beschrieben. Borg läuft per normalem Schlüssel.
- Snapshots werden laut Drittquelle nur in Console oder API angelegt und gelöscht, das Snapshot-Verzeichnis ist schreibgeschützt. Ein Zurückspielen setzt die ganze Box zurück, auch alle Unterkonten.
- Unterkonten können je Verzeichnis nur lesend eingerichtet werden (Hetzner-Übersicht).
- Folge des Anfüge-Modus: Alte Stände aufräumen (restic forget/prune) geht vom Server aus nicht. Dafür braucht es einen getrennten Wartungszugang (eigener Schlüssel, nicht auf dem Hauptserver).
- Test vor Verlass: Löschversuch mit dem Server-Schlüssel muss scheitern (Teil der Wiederanlauf-Probe).
