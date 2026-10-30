#!/usr/bin/env sh
set -eu
TEST_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TEST_BIN=$(mktemp /tmp/lsession-test.XXXXXX)
trap 'rm -f "$TEST_BIN"' EXIT HUP INT TERM
LUI_DIR="$TEST_DIR/../../lui"
"$LUI_DIR/build.sh"
cc -std=c11 -O2 -Wall -Wextra "$TEST_DIR/confirmation.c" -o "$TEST_BIN" \
  "$LUI_DIR/build/liblui.a" -lm $(pkg-config --cflags --libs gtk4 gtk4-layer-shell-0 json-glib-1.0)
# The test uses its own application ID and captures commands without running them.
GTK_A11Y=none "$TEST_BIN"
