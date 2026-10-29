#!/usr/bin/env sh
set -eu

DEPLOYMENT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$DEPLOYMENT_DIR/.." && pwd)
# shellcheck source=deployment/lib.sh
. "$DEPLOYMENT_DIR/lib.sh"

HOME_DIR=${HOME:?HOME must be set}
CONFIG_HOME=${XDG_CONFIG_HOME:-"$HOME_DIR/.config"}
DATA_HOME=${XDG_DATA_HOME:-"$HOME_DIR/.local/share"}
BIN_DIR="$HOME_DIR/.local/bin"
AGS_CONFIG_DIR="$CONFIG_HOME/ags"
AGS_ENTRY="$AGS_CONFIG_DIR/app.tsx"
WALLPAPER_DIR="$CONFIG_HOME/los/walls"
LIAKOS_DATA_DIR="$DATA_HOME/liakos"

if [ -f "$CONFIG_HOME/wayfire.ini" ]; then
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire.ini"
elif [ -f "$CONFIG_HOME/wayfire/wayfire.ini" ]; then
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire/wayfire.ini"
else
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire.ini"
fi

printf 'Installing native LiakOs apps...\n'
"$DEPLOYMENT_DIR/install-c-apps.sh"

mkdir -p "$AGS_CONFIG_DIR/icons" "$WALLPAPER_DIR" "$LIAKOS_DATA_DIR/scripts"

PORTAL_CONFIG_DIR="$CONFIG_HOME/xdg-desktop-portal"
mkdir -p "$PORTAL_CONFIG_DIR"
if [ ! -f "$PORTAL_CONFIG_DIR/wayfire-portals.conf" ]; then
  install -m 644 "$ROOT_DIR/config/xdg-desktop-portal/wayfire-portals.conf" \
    "$PORTAL_CONFIG_DIR/wayfire-portals.conf"
fi

"$DEPLOYMENT_DIR/install-bar.sh"
install -m 755 "$ROOT_DIR/scripts/test-pywal-gtk-colors.sh" \
  "$LIAKOS_DATA_DIR/scripts/test-pywal-gtk-colors.sh"
cp -a "$ROOT_DIR/wallpapers/." "$WALLPAPER_DIR/"

DEFAULT_BROWSER=$(xdg-mime query default x-scheme-handler/https 2>/dev/null || true)
DEFAULT_FILE_MANAGER=thunar.desktop
if command -v thunar >/dev/null 2>&1; then
  xdg-mime default "$DEFAULT_FILE_MANAGER" inode/directory
else
  printf 'Thunar is required for the Super+E shortcut; install it before using that shortcut.\n' >&2
  DEFAULT_FILE_MANAGER=
fi

if [ ! -f "$WAYFIRE_CONFIG" ]; then
  mkdir -p "$(dirname "$WAYFIRE_CONFIG")"
  install -m 644 "$ROOT_DIR/config/wayfire.ini" "$WAYFIRE_CONFIG"
else
  backup_once "$WAYFIRE_CONFIG" "$WAYFIRE_CONFIG.bak"
fi

set_wayfire_command_option "$WAYFIRE_CONFIG" binding_keybindings '<super> <shift> KEY_K'
set_wayfire_command_option "$WAYFIRE_CONFIG" command_keybindings 'lkeybinds'
set_wayfire_command_option "$WAYFIRE_CONFIG" binding_displays '<super> <shift> KEY_D'
set_wayfire_command_option "$WAYFIRE_CONFIG" command_displays 'ldisplays'
set_wayfire_command_option "$WAYFIRE_CONFIG" binding_logout '<super> <shift> KEY_Q'
set_wayfire_command_option "$WAYFIRE_CONFIG" command_logout 'lsession'
set_wayfire_option "$WAYFIRE_CONFIG" core preferred_decoration_mode server
set_wayfire_option "$WAYFIRE_CONFIG" decoration title_height 0
set_wayfire_option "$WAYFIRE_CONFIG" decoration border_size 0
set_wayfire_option "$WAYFIRE_CONFIG" autostart xdg_portals \
  'sleep 1 && systemctl --user restart xdg-desktop-portal xdg-desktop-portal-wlr'
AGS_ENTRY_URI=$(python3 -c 'from pathlib import Path; import sys; print(Path(sys.argv[1]).as_posix())' "$AGS_ENTRY")
set_wayfire_option "$WAYFIRE_CONFIG" autostart bar "ags run '$AGS_ENTRY_URI'"

if [ -n "$DEFAULT_BROWSER" ]; then
  case "$DEFAULT_BROWSER" in
    *[!A-Za-z0-9._:-]*)
      printf 'Skipping browser shortcut: unexpected desktop ID %s\n' "$DEFAULT_BROWSER" >&2
      ;;
    *)
      set_wayfire_command_option "$WAYFIRE_CONFIG" binding_browser '<super> KEY_B'
      set_wayfire_command_option "$WAYFIRE_CONFIG" command_browser "gtk-launch '$DEFAULT_BROWSER'"
      printf 'Wayfire Super+B opens %s\n' "$DEFAULT_BROWSER"
      ;;
  esac
else
  printf 'No default browser found; leaving the Super+B shortcut unchanged.\n' >&2
fi

if [ -n "$DEFAULT_FILE_MANAGER" ]; then
  HOME_URI=$(python3 -c 'from pathlib import Path; import sys; print(Path(sys.argv[1]).as_uri())' "$HOME_DIR")
  set_wayfire_command_option "$WAYFIRE_CONFIG" binding_file_manager '<super> KEY_E'
  set_wayfire_command_option "$WAYFIRE_CONFIG" command_file_manager \
    "gtk-launch '$DEFAULT_FILE_MANAGER' '$HOME_URI'"
  set_wayfire_command_option "$WAYFIRE_CONFIG" command_launcher \
    'env QT_QPA_PLATFORMTHEME=qt5ct:qt6ct llauncher'
  printf 'Wayfire Super+E opens Thunar (%s)\n' "$DEFAULT_FILE_MANAGER"
fi

printf '\nLiakOs deployment complete.\n'
printf 'Apps: %s (PATH must include this directory)\n' "$BIN_DIR"
printf 'AGS bar: %s\n' "$AGS_ENTRY"
printf 'Wallpapers: %s\n' "$WALLPAPER_DIR"
printf 'Color script: %s/scripts\n' "$LIAKOS_DATA_DIR"
printf 'Wayfire config: %s\n' "$WAYFIRE_CONFIG"
printf 'Restart AGS and reload/restart Wayfire to use the updated desktop.\n'
