#!/usr/bin/env sh
set -eu
LUI_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
"$LUI_DIR/build.sh"
cc -std=c11 -O2 -Wall -Wextra -Werror "$LUI_DIR/gallery.c" \
  "$LUI_DIR/build/liblui.a" -o "$LUI_DIR/build/lui-gallery" \
  $(pkg-config --cflags --libs gtk4 json-glib-1.0) -lm
