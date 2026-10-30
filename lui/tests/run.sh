#!/usr/bin/env sh
set -eu
LUI_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
"$LUI_DIR/build.sh"
TEST_ROOT=$(mktemp -d /tmp/lui-tests.XXXXXX)
trap 'rm -rf "$TEST_ROOT"' EXIT HUP INT TERM
mkdir -p "$TEST_ROOT/cache" "$TEST_ROOT/config"
cc -std=c11 -O2 -Wall -Wextra -Werror "$LUI_DIR/tests/theme.c" \
  "$LUI_DIR/build/liblui.a" -o "$TEST_ROOT/test-theme" \
  $(pkg-config --cflags --libs gtk4 json-glib-1.0) -lm
XDG_CACHE_HOME="$TEST_ROOT/cache" XDG_CONFIG_HOME="$TEST_ROOT/config" \
  GIO_USE_VFS=local GTK_A11Y=none G_DEBUG=fatal-warnings GSK_RENDERER=cairo GDK_BACKEND=x11 \
  dbus-run-session -- xvfb-run -a "$TEST_ROOT/test-theme"
