#!/usr/bin/env sh
set -eu
LUI_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p "$LUI_DIR/build"
LUI_BUILD=$(mktemp -d "$LUI_DIR/build/compile.XXXXXX")
trap 'rm -rf "$LUI_BUILD"' EXIT HUP INT TERM
glib-compile-resources "$LUI_DIR/lui.gresource.xml" --sourcedir="$LUI_DIR" \
  --generate-source --c-name=lui_assets --target="$LUI_BUILD/resources.c"
cc -std=c11 -O2 -Wall -Wextra -Werror -c "$LUI_DIR/lui.c" \
  -o "$LUI_BUILD/lui.o" $(pkg-config --cflags gtk4 json-glib-1.0)
cc -std=c11 -O2 -Wall -Wextra -Werror -c "$LUI_BUILD/resources.c" \
  -o "$LUI_BUILD/resources.o" $(pkg-config --cflags gio-2.0)
ar rcs "$LUI_BUILD/liblui.a" "$LUI_BUILD/lui.o" "$LUI_BUILD/resources.o"
mv "$LUI_BUILD/liblui.a" "$LUI_DIR/build/liblui.a"
