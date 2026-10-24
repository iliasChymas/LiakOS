#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
BIN_DIR="${HOME:?HOME must be set}/.local/bin"
CONFIG_HOME=${XDG_CONFIG_HOME:-"$HOME/.config"}
AGS_CONFIG_DIR="$CONFIG_HOME/ags"
AGS_ENTRY="$AGS_CONFIG_DIR/app.tsx"

printf 'Building llauncher...\n'
"$ROOT_DIR/app-launcher/build.sh"
printf 'Building lpaper...\n'
"$ROOT_DIR/wallpaper-app/build.sh"

mkdir -p "$BIN_DIR" "$AGS_CONFIG_DIR"
mkdir -p "$AGS_CONFIG_DIR/icons"
install -m 755 "$ROOT_DIR/app-launcher/build/llauncher" "$BIN_DIR/llauncher"
install -m 755 "$ROOT_DIR/wallpaper-app/build/lpaper" "$BIN_DIR/lpaper"
install -m 644 "$ROOT_DIR/assets/icons/bluetooth-open.svg" "$AGS_CONFIG_DIR/icons/bluetooth-open.svg"
install -m 644 "$ROOT_DIR/assets/icons/bluetooth-closed.svg" "$AGS_CONFIG_DIR/icons/bluetooth-closed.svg"

if [ -f "$AGS_ENTRY" ] && ! cmp -s "$ROOT_DIR/bar.tsx" "$AGS_ENTRY"; then
  BACKUP="$AGS_ENTRY.bak"
  if [ ! -e "$BACKUP" ]; then
    cp -p "$AGS_ENTRY" "$BACKUP"
    printf 'Saved existing AGS entrypoint to %s\n' "$BACKUP"
  else
    printf 'Keeping existing backup at %s\n' "$BACKUP"
  fi
fi
install -m 644 "$ROOT_DIR/bar.tsx" "$AGS_ENTRY"

printf 'Installed executables to %s\n' "$BIN_DIR"
printf 'Installed AGS bar to %s\n' "$AGS_ENTRY"
printf 'Restart AGS to load the deployed bar.\n'
