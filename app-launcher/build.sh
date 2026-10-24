#!/usr/bin/env sh
set -eu

APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$APP_DIR/.." && pwd)
BUILD_DIR="$APP_DIR/build"
BIN_PATH="$BUILD_DIR/llauncher"

mkdir -p "$BUILD_DIR"
cc -std=c11 -O2 -Wall -Wextra \
  "$APP_DIR/liakos-launcher.c" \
  -o "$BIN_PATH" \
  $(pkg-config --cflags --libs gtk4 gtk4-layer-shell-0 json-glib-1.0 gio-unix-2.0)

printf 'Built %s\n' "$BIN_PATH"
