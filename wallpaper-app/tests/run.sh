#!/usr/bin/env sh
set -eu
TEST_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TEST_BIN=$(mktemp /tmp/lpaper-test.XXXXXX)
trap 'rm -f "$TEST_BIN"' EXIT HUP INT TERM
cc -std=c11 -O2 -Wall -Wextra "$TEST_DIR/apply.c" -o "$TEST_BIN" \
  $(pkg-config --cflags --libs gtk4 vips)
python3 "$TEST_DIR/preserve-layout.py" "$TEST_BIN"
