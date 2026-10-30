#!/usr/bin/env sh
set -eu
APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BUILD_DIR="$APP_DIR/build"
mkdir -p "$BUILD_DIR"
LUI_DIR="$APP_DIR/../lui"
"$LUI_DIR/build.sh"
cc -std=c11 -O2 -Wall -Wextra "$APP_DIR/liakos-displays.c" "$APP_DIR/display-config.c" "$APP_DIR/kanshi-runtime.c" -o "$BUILD_DIR/ldisplays" "$LUI_DIR/build/liblui.a" -lm $(pkg-config --cflags --libs gtk4 json-glib-1.0) -lm
printf 'Built %s\n' "$BUILD_DIR/ldisplays"
