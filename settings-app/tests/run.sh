#!/usr/bin/env sh
set -eu
TEST_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LUI_DIR="$TEST_DIR/../../lui"
"$LUI_DIR/build.sh"
TEST_ROOT=$(mktemp -d /tmp/lsettings-tests.XXXXXX)
trap 'rm -rf "$TEST_ROOT"' EXIT HUP INT TERM
mkdir -p "$TEST_ROOT/config" "$TEST_ROOT/cache"
for test in sidebar mouse; do
cc -std=c11 -O2 -Wall -Wextra -Werror "$TEST_DIR/$test.c" \
  "$LUI_DIR/build/liblui.a" -o "$TEST_ROOT/$test" \
  $(pkg-config --cflags --libs gtk4 json-glib-1.0 astal-wireplumber-0.1) -lm
XDG_CONFIG_HOME="$TEST_ROOT/config" XDG_CACHE_HOME="$TEST_ROOT/cache" \
  GIO_USE_VFS=local GTK_A11Y=test G_DEBUG=fatal-warnings GDK_BACKEND=x11 \
  dbus-run-session -- xvfb-run -a "$TEST_ROOT/$test"
done
