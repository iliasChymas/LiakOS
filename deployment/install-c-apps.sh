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
build_and_install lsettings settings-app/build.sh settings-app/build/lsettings
build_and_install lautostart autostart-app/build.sh autostart-app/build/lautostart
build_and_install lpaper wallpaper-app/build.sh wallpaper-app/build/lpaper
build_and_install lsession session-app/build.sh session-app/build/lsession

install -m 644 "$ROOT_DIR/keybindings-app/org.liakos.Keybindings.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Keybindings.desktop"
install -m 644 "$ROOT_DIR/app-launcher/org.liakos.Launcher.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Launcher.desktop"
install -m 644 "$ROOT_DIR/monitor-app/org.liakos.Displays.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Displays.desktop"
install -m 644 "$ROOT_DIR/settings-app/org.liakos.Settings.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Settings.desktop"
install -m 644 "$ROOT_DIR/autostart-app/org.liakos.Autostart.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Autostart.desktop"
install -m 644 "$ROOT_DIR/wallpaper-app/lpaper.desktop" \
  "$APPLICATIONS_DIR/lpaper.desktop"
install -m 644 "$ROOT_DIR/session-app/org.liakos.Session.desktop" \
  "$APPLICATIONS_DIR/org.liakos.Session.desktop"
install -D -m 644 "$ROOT_DIR/assets/icons/lpaper.svg" \
  "$DATA_HOME/icons/hicolor/scalable/apps/lpaper.svg"
install -D -m 644 "$ROOT_DIR/assets/icons/lpaper.png" \
  "$DATA_HOME/icons/hicolor/128x128/apps/lpaper.png"
if [ ! -f "$DATA_HOME/icons/hicolor/index.theme" ] &&
   [ -r /usr/share/icons/hicolor/index.theme ]; then
  install -D -m 644 /usr/share/icons/hicolor/index.theme \
    "$DATA_HOME/icons/hicolor/index.theme"
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1 &&
   [ -f "$DATA_HOME/icons/hicolor/index.theme" ]; then
  gtk-update-icon-cache -f "$DATA_HOME/icons/hicolor" >/dev/null 2>&1 || true
fi
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APPLICATIONS_DIR" >/dev/null 2>&1 || true
fi

printf 'Installed LiakOS desktop entries to %s\n' "$APPLICATIONS_DIR"
