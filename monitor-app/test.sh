#!/usr/bin/env sh
set -eu
APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p "$APP_DIR/build"
cc -std=c11 -g -Wall -Wextra -Werror "$APP_DIR/test-config.c" \
  "$APP_DIR/display-config.c" "$APP_DIR/kanshi-runtime.c" -o "$APP_DIR/build/test-config" \
  $(pkg-config --cflags --libs gio-2.0) -lm
"$APP_DIR/build/test-config"
