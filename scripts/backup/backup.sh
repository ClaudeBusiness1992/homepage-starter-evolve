#!/usr/bin/env bash
# HPSE nächtliche Sicherung (Entwurf, nicht ausgeführt). Standard ist der Trockenlauf.
# Aufruf: backup.sh [--ausfuehren]
set -euo pipefail
umask 077

ENV_FILE="${HPSE_BACKUP_ENV:-/etc/hpse/backup.env}"
AUSFUEHREN=0
[ "${1:-}" = "--ausfuehren" ] && AUSFUEHREN=1

[ -r "$ENV_FILE" ] || { echo "Konfiguration fehlt: $ENV_FILE" >&2; exit 2; }
# shellcheck disable=SC1090
. "$ENV_FILE"

for v in RESTIC_REPOSITORY RESTIC_PASSWORD_FILE HPSE_SSH_KEY HPSE_DUMP_DIR HPSE_MEDIA_DIR HPSE_DATABASES; do
  [ -n "${!v:-}" ] || { echo "Variable fehlt: $v" >&2; exit 2; }
done
export RESTIC_REPOSITORY RESTIC_PASSWORD_FILE

alarm() {
  # Nur kurze Betriebsmeldung, keine Daten. Fehler beim Alarm dürfen die Sicherung nicht abbrechen.
  [ -n "${NTFY_TOPIC:-}" ] || return 0
  curl -fsS --max-time 15 -H "Title: HPSE Sicherung" -d "$1" "https://ntfy.sh/${NTFY_TOPIC}" >/dev/null 2>&1 || true
}
fehler() { alarm "FEHLER: $1"; echo "FEHLER: $1" >&2; exit 1; }

SSH_CMD="ssh -p 23 -i ${HPSE_SSH_KEY} -o BatchMode=yes -o StrictHostKeyChecking=yes"
RESTIC_OPTS=(-o "sftp.command=${SSH_CMD} -s sftp")
# Hinweis: Mit erzwungenem Befehl auf der Box (rclone serve restic --stdio --append-only)
# wird stattdessen der rclone-Weg genutzt: -o rclone.program="${SSH_CMD}" -o rclone.args="serve restic --stdio" mit Repository rclone:...
# Die genaue Variante wird beim Einrichten gegen die offizielle Hetzner-Dokumentation bestätigt (PRÜFEN).

echo "Plan:"
echo "  1. Datenbanken sichern (pg_dump, Format custom): ${HPSE_DATABASES}"
echo "  2. restic backup: Dumps, Medien, Konfiguration (ohne Schlüssel)"
echo "  3. restic check (Stichprobe) und Meldung"
if [ "$AUSFUEHREN" -ne 1 ]; then echo "Trockenlauf: nichts ausgeführt. Mit --ausfuehren starten."; exit 0; fi

mkdir -p "$HPSE_DUMP_DIR"
for db in $HPSE_DATABASES; do
  case "$db" in *[!A-Za-z0-9_]*|"") fehler "ungültiger Datenbankname";; esac
  pg_dump --format=custom --file="${HPSE_DUMP_DIR}/${db}.dump.tmp" "$db" || fehler "pg_dump fehlgeschlagen: ${db}"
  mv "${HPSE_DUMP_DIR}/${db}.dump.tmp" "${HPSE_DUMP_DIR}/${db}.dump"
done

PFADE=("$HPSE_DUMP_DIR" "$HPSE_MEDIA_DIR")
[ -n "${HPSE_CONFIG_DIR:-}" ] && PFADE+=("$HPSE_CONFIG_DIR")

restic "${RESTIC_OPTS[@]}" backup --tag hpse-nachts --one-file-system "${PFADE[@]}" || fehler "restic backup fehlgeschlagen"
restic "${RESTIC_OPTS[@]}" check --read-data-subset=1/20 || fehler "restic check fehlgeschlagen"
alarm "OK: Sicherung abgeschlossen"
