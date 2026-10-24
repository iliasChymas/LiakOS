#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
BIN_PATH="${TMPDIR:-/tmp}/liakos-wallpaper-c"

cd "$ROOT_DIR"
cc -O2 -Wall -Wextra \
  wallpaper-app/tools/wallpaper-viewer-c.c \
  -o "$BIN_PATH" \
  $(pkg-config --cflags --libs gtk4 vips)
exec "$BIN_PATH" "$@"
