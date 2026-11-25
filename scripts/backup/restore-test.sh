#!/usr/bin/env bash
# Rücksicherungs-Test (Entwurf, nicht ausgeführt): holt den letzten Stand in ein Wegwerf-Verzeichnis
# und prüft, ob die Datenbank-Dumps lesbar sind. Verändert weder Hauptserver noch Datenbanken.
# Aufruf: restore-test.sh
set -euo pipefail
umask 077
ENV_FILE="${HPSE_BACKUP_ENV:-/etc/hpse/backup.env}"
[ -r "$ENV_FILE" ] || { echo "Konfiguration fehlt: $ENV_FILE" >&2; exit 2; }
# shellcheck disable=SC1090
. "$ENV_FILE"
export RESTIC_REPOSITORY RESTIC_PASSWORD_FILE
ZIEL="$(mktemp -d /var/tmp/hpse-restore-XXXXXX)"
trap 'rm -r -- "$ZIEL"' EXIT
restic snapshots --latest 1
restic restore latest --target "$ZIEL" --include "$HPSE_DUMP_DIR"
n=0
for f in "$ZIEL$HPSE_DUMP_DIR"/*.dump; do
  [ -e "$f" ] || { echo "Kein Dump gefunden" >&2; exit 1; }
  pg_restore --list "$f" >/dev/null || { echo "Dump nicht lesbar: $(basename "$f")" >&2; exit 1; }
  n=$((n+1))
done
echo "OK: ${n} Dump(s) lesbar. Medien-Stichprobe und Löschversuch siehe docs/SICHERUNG-EINRICHTUNG.md."
