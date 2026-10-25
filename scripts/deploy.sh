#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
BIN_DIR="${HOME:?HOME must be set}/.local/bin"
CONFIG_HOME=${XDG_CONFIG_HOME:-"$HOME/.config"}
AGS_CONFIG_DIR="$CONFIG_HOME/ags"
AGS_ENTRY="$AGS_CONFIG_DIR/app.tsx"
WALLPAPER_DIR="$CONFIG_HOME/los/walls"
if [ -f "$CONFIG_HOME/wayfire.ini" ]; then
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire.ini"
elif [ -f "$CONFIG_HOME/wayfire/wayfire.ini" ]; then
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire/wayfire.ini"
else
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire.ini"
fi

printf 'Building llauncher...\n'
"$ROOT_DIR/app-launcher/build.sh"
printf 'Building lpaper...\n'
"$ROOT_DIR/wallpaper-app/build.sh"

mkdir -p "$BIN_DIR" "$AGS_CONFIG_DIR" "$WALLPAPER_DIR"
mkdir -p "$AGS_CONFIG_DIR/icons"
install -m 755 "$ROOT_DIR/app-launcher/build/llauncher" "$BIN_DIR/llauncher"
install -m 755 "$ROOT_DIR/wallpaper-app/build/lpaper" "$BIN_DIR/lpaper"
install -m 644 "$ROOT_DIR/assets/icons/bluetooth-open.svg" "$AGS_CONFIG_DIR/icons/bluetooth-open.svg"
install -m 644 "$ROOT_DIR/assets/icons/bluetooth-closed.svg" "$AGS_CONFIG_DIR/icons/bluetooth-closed.svg"
cp -a "$ROOT_DIR/wallpapers/." "$WALLPAPER_DIR/"

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

# Bind Wayfire shortcuts to the desktop applications selected through XDG.
# Resolve desktop IDs at deployment time so the keybinds launch those exact apps.
DEFAULT_BROWSER=$(xdg-mime query default x-scheme-handler/https 2>/dev/null || true)
DEFAULT_FILE_MANAGER=thunar.desktop
if command -v thunar >/dev/null 2>&1; then
  xdg-mime default "$DEFAULT_FILE_MANAGER" inode/directory
else
  printf 'Thunar is required for the Super+E file-manager shortcut. Install Thunar first.\n' >&2
  DEFAULT_FILE_MANAGER=
fi
if [ -n "$DEFAULT_BROWSER" ] && [ -n "$DEFAULT_FILE_MANAGER" ]; then
  case "$DEFAULT_BROWSER:$DEFAULT_FILE_MANAGER" in
    *[!A-Za-z0-9._:-]*)
      printf 'Could not use unexpected XDG desktop IDs: browser=%s file-manager=%s\n' \
        "$DEFAULT_BROWSER" "$DEFAULT_FILE_MANAGER" >&2
      ;;
    *)
      if [ ! -f "$WAYFIRE_CONFIG" ]; then
        mkdir -p "$(dirname "$WAYFIRE_CONFIG")"
        install -m 644 "$ROOT_DIR/config/wayfire.ini" "$WAYFIRE_CONFIG"
      elif [ ! -e "$WAYFIRE_CONFIG.bak" ]; then
        cp -p "$WAYFIRE_CONFIG" "$WAYFIRE_CONFIG.bak"
        printf 'Saved existing Wayfire config to %s.bak\n' "$WAYFIRE_CONFIG"
      fi

      HOME_URI=$(python3 -c 'from pathlib import Path; import sys; print(Path(sys.argv[1]).as_uri())' "$HOME")

      set_wayfire_command_option() {
        option=$1
        value=$2
        temporary_config="$WAYFIRE_CONFIG.tmp"
        awk -v option="$option" -v value="$value" '
          /^\[command\][[:space:]]*$/ {
            in_command = 1
            have_command = 1
            print
            next
          }
          /^\[/ {
            if (in_command && !updated) {
              print option " = " value
              updated = 1
            }
            in_command = 0
            print
            next
          }
          in_command && $0 ~ "^[[:space:]]*" option "[[:space:]]*=" {
            if (!updated) print option " = " value
            updated = 1
            next
          }
          { print }
          END {
            if (in_command && !updated) print option " = " value
            if (!have_command) {
              print ""
              print "[command]"
              print option " = " value
            }
          }
        ' "$WAYFIRE_CONFIG" > "$temporary_config"
        mv "$temporary_config" "$WAYFIRE_CONFIG"
      }

      set_wayfire_command_option binding_browser '<super> KEY_B'
      set_wayfire_command_option command_browser "gtk-launch '$DEFAULT_BROWSER'"
      set_wayfire_command_option command_launcher 'env QT_QPA_PLATFORMTHEME=qt5ct:qt6ct llauncher'
      set_wayfire_command_option binding_file_manager '<super> KEY_E'
      set_wayfire_command_option command_file_manager "gtk-launch '$DEFAULT_FILE_MANAGER' '$HOME_URI'"
      printf 'Wayfire Super+B browser: %s\n' "$DEFAULT_BROWSER"
      printf 'Wayfire Super+E file manager: Thunar (%s)\n' "$DEFAULT_FILE_MANAGER"
      ;;
  esac
else
  printf 'Could not resolve both XDG browser and file-manager defaults; leaving Wayfire keybinds unchanged.\n' >&2
fi

printf 'Installed executables to %s\n' "$BIN_DIR"
printf 'Installed AGS bar to %s\n' "$AGS_ENTRY"
printf 'Copied wallpapers to %s\n' "$WALLPAPER_DIR"
printf 'Wayfire config target: %s\n' "$WAYFIRE_CONFIG"
printf 'Restart AGS to load the deployed bar.\n'
printf 'Reload or restart Wayfire to apply keybinding changes.\n'
