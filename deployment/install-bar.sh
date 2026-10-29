#!/usr/bin/env sh
set -eu

DEPLOYMENT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$DEPLOYMENT_DIR/.." && pwd)
# shellcheck source=deployment/lib.sh
. "$DEPLOYMENT_DIR/lib.sh"

CONFIG_HOME=${XDG_CONFIG_HOME:-"${HOME:?HOME must be set}/.config"}
DATA_HOME=${XDG_DATA_HOME:-"$HOME/.local/share"}
AGS_CONFIG_DIR="$CONFIG_HOME/ags"
AGS_ENTRY="$AGS_CONFIG_DIR/app.tsx"
LIAKOS_DATA_DIR="$DATA_HOME/liakos"

mkdir -p "$AGS_CONFIG_DIR/icons" "$LIAKOS_DATA_DIR/scripts"

# Install dependencies before the entry point so a refreshed bar has its assets.
install -m 755 "$ROOT_DIR/scripts/oasa-schedule.py" \
  "$LIAKOS_DATA_DIR/scripts/oasa-schedule.py"
for icon in bluetooth-open bluetooth-closed oasa-bus; do
  install -m 644 "$ROOT_DIR/assets/icons/$icon.svg" "$AGS_CONFIG_DIR/icons/$icon.svg"
done

if [ -f "$AGS_ENTRY" ] && ! cmp -s "$ROOT_DIR/bar.tsx" "$AGS_ENTRY"; then
  backup_once "$AGS_ENTRY" "$AGS_ENTRY.bak"
fi
install -m 644 "$ROOT_DIR/bar.tsx" "$AGS_ENTRY"

printf 'Installed AGS bar, icons, and OASA schedule helper. Restart AGS to load the updated bar.\n'
