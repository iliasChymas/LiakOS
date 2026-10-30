#!/usr/bin/env sh
set -eu

APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$APP_DIR/.." && pwd)
BUILD_DIR="$APP_DIR/build"
BIN_PATH="$BUILD_DIR/lpaper"

mkdir -p "$BUILD_DIR"
LUI_DIR="$APP_DIR/../lui"
"$LUI_DIR/build.sh"
cd "$ROOT_DIR"
cc -O2 -Wall -Wextra \
  "$APP_DIR/tools/wallpaper-viewer-c.c" \
  -o "$BIN_PATH" \
  "$LUI_DIR/build/liblui.a" -lm $(pkg-config --cflags --libs gtk4 vips json-glib-1.0)

printf 'Built %s\n' "$BIN_PATH"
