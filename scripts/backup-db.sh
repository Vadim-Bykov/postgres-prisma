#!/usr/bin/env bash
# Dump the Postgres DB into ./backups using pg_dump.
# Usage:
#   scripts/backup-db.sh          # custom format (.dump) — recommended for restore
#   scripts/backup-db.sh --sql    # plain SQL (.sql) — human-readable
#   scripts/backup-db.sh --both   # both formats

set -euo pipefail

FORMAT="${1:-custom}"
KEEP="${BACKUP_KEEP:-5}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Error: .env not found in $ROOT_DIR" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a

if [[ -z "${POSTGRES_URL_NON_POOLING:-}" ]]; then
  echo "Error: POSTGRES_URL_NON_POOLING is not set in .env" >&2
  exit 1
fi

if command -v pg_dump >/dev/null 2>&1; then
  PG_DUMP="$(command -v pg_dump)"
elif [[ -x /opt/homebrew/opt/libpq/bin/pg_dump ]]; then
  PG_DUMP="/opt/homebrew/opt/libpq/bin/pg_dump"
elif [[ -x /usr/local/opt/libpq/bin/pg_dump ]]; then
  PG_DUMP="/usr/local/opt/libpq/bin/pg_dump"
else
  echo "Error: pg_dump not found. Install with: brew install libpq" >&2
  exit 1
fi

mkdir -p backups
TS="$(date +%Y%m%d-%H%M%S)"
BASE="backups/db-$TS"

dump_custom() {
  echo "→ Dumping custom format to $BASE.dump"
  "$PG_DUMP" "$POSTGRES_URL_NON_POOLING" \
    --format=custom \
    --no-owner \
    --no-privileges \
    --file="$BASE.dump"
}

dump_sql() {
  echo "→ Dumping plain SQL to $BASE.sql"
  "$PG_DUMP" "$POSTGRES_URL_NON_POOLING" \
    --no-owner \
    --no-privileges \
    --file="$BASE.sql"
}

# Keep only the $KEEP most recent files with the given extension.
prune() {
  local ext="$1"
  local removed
  removed=$(ls -1t backups/db-*."$ext" 2>/dev/null | tail -n +"$((KEEP + 1))")
  if [[ -n "$removed" ]]; then
    echo "→ Pruning old .$ext backups (keeping $KEEP):"
    echo "$removed" | sed 's/^/  - /'
    echo "$removed" | xargs rm --
  fi
}

case "$FORMAT" in
  custom) dump_custom && prune dump ;;
  --sql|sql) dump_sql && prune sql ;;
  --both|both) dump_custom && dump_sql && prune dump && prune sql ;;
  *)
    echo "Unknown format: $FORMAT" >&2
    echo "Usage: $0 [custom|--sql|--both]" >&2
    exit 1
    ;;
esac

echo "Done."
ls -lh "$BASE".* 2>/dev/null || true
