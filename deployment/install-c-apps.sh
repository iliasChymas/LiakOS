#!/usr/bin/env sh
set -eu

DEPLOYMENT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$DEPLOYMENT_DIR/.." && pwd)
BIN_DIR="${HOME:?HOME must be set}/.local/bin"
DATA_HOME=${XDG_DATA_HOME:-"$HOME/.local/share"}
APPLICATIONS_DIR="$DATA_HOME/applications"

build_and_install() {
  app_name=$1
  build_script=$2
  binary=$3

  printf 'Building %s...\n' "$app_name"
  "$ROOT_DIR/$build_script"
  install -m 755 "$ROOT_DIR/$binary" "$BIN_DIR/$app_name"
  printf 'Installed %s to %s\n' "$app_name" "$BIN_DIR"
}

mkdir -p "$BIN_DIR" "$APPLICATIONS_DIR"

build_and_install llauncher app-launcher/build.sh app-launcher/build/llauncher
build_and_install lkeybinds keybindings-app/build.sh keybindings-app/build/lkeybinds
build_and_install ldisplays monitor-app/build.sh monitor-app/build/ldisplays
build_and_install lpaper wallpaper-app/build.sh wallpaper-app/build/lpaper

install -m 644 "$ROOT_DIR/keybindings-app/org.liakos.Keybindings.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Keybindings.desktop"
install -m 644 "$ROOT_DIR/monitor-app/org.liakos.Displays.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Displays.desktop"

printf 'Installed LiakOs desktop entries to %s\n' "$APPLICATIONS_DIR"
