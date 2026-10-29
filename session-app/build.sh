#!/usr/bin/env sh
set -eu

APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BUILD_DIR="$APP_DIR/build"
mkdir -p "$BUILD_DIR"
cc -std=c11 -O2 -Wall -Wextra \
  "$APP_DIR/session-app.c" \
  -o "$BUILD_DIR/lsession" \
  $(pkg-config --cflags --libs gtk4 gtk4-layer-shell-0 json-glib-1.0)
printf 'Built %s\n' "$BUILD_DIR/lsession"
