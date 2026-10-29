#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DEPLOYMENT_DIR="$ROOT_DIR/deployment"

"$DEPLOYMENT_DIR/install-c-apps.sh" "$@"

HOME_DIR=${HOME:?HOME must be set}
CONFIG_HOME=${XDG_CONFIG_HOME:-"$HOME_DIR/.config"}
if [ -f "$CONFIG_HOME/wayfire.ini" ]; then
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire.ini"
elif [ -f "$CONFIG_HOME/wayfire/wayfire.ini" ]; then
  WAYFIRE_CONFIG="$CONFIG_HOME/wayfire/wayfire.ini"
else
  printf 'Native applications updated. No Wayfire config found; skipping reload.\n'
  exit 0
fi

# Wayfire watches the config and reloads most settings when it changes.
# Enable its file watcher first, then touch the file to trigger a reload.
. "$DEPLOYMENT_DIR/lib.sh"
backup_once "$WAYFIRE_CONFIG" "$WAYFIRE_CONFIG.bak"
set_wayfire_option "$WAYFIRE_CONFIG" core auto_reload_config true
set_wayfire_command_option "$WAYFIRE_CONFIG" binding_logout '<super> <shift> KEY_Q'
set_wayfire_command_option "$WAYFIRE_CONFIG" command_logout 'lsession'
touch "$WAYFIRE_CONFIG"

if pgrep -x wayfire >/dev/null 2>&1; then
  printf 'Native applications updated; Wayfire config reload requested.\n'
else
  printf 'Native applications updated; Wayfire config saved for the next session.\n'
fi
