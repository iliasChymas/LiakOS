#!/usr/bin/env sh
set -eu

APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$APP_DIR/.." && pwd)
BUILD_DIR="$APP_DIR/build"
BIN_PATH="$BUILD_DIR/lpaper"

mkdir -p "$BUILD_DIR"
cd "$ROOT_DIR"
cc -O2 -Wall -Wextra \
  "$APP_DIR/tools/wallpaper-viewer-c.c" \
  -o "$BIN_PATH" \
  $(pkg-config --cflags --libs gtk4 vips)

printf 'Built %s\n' "$BIN_PATH"
