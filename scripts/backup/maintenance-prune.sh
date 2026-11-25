#!/usr/bin/env bash
# Aufräumen alter Stände (Entwurf, nicht ausgeführt). Läuft NICHT auf dem Hauptserver,
# sondern auf einem getrennten Wartungsrechner mit eigenem Schlüssel OHNE --append-only.
# Aufruf: maintenance-prune.sh [--ausfuehren]
set -euo pipefail
umask 077
ENV_FILE="${HPSE_MAINT_ENV:-$HOME/.config/hpse/maintenance.env}"
[ -r "$ENV_FILE" ] || { echo "Konfiguration fehlt: $ENV_FILE" >&2; exit 2; }
# shellcheck disable=SC1090
. "$ENV_FILE"
for v in RESTIC_REPOSITORY RESTIC_PASSWORD_FILE; do [ -n "${!v:-}" ] || { echo "Variable fehlt: $v" >&2; exit 2; }; done
export RESTIC_REPOSITORY RESTIC_PASSWORD_FILE

# Aufbewahrung (Vorschlag, mit Anwalt/Kunden abstimmen): 14 täglich, 8 wöchentlich, 12 monatlich
POLICY=(--keep-daily 14 --keep-weekly 8 --keep-monthly 12)
if [ "${1:-}" = "--ausfuehren" ]; then
  restic forget "${POLICY[@]}" --prune
else
  echo "Trockenlauf:"; restic forget "${POLICY[@]}" --dry-run
fi
