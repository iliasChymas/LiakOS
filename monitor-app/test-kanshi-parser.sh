#!/usr/bin/env sh
set -eu
APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
KANSHI_SOURCE=${1:?Pass the path to the upstream Kanshi v1.9.0 source checkout}
FIXTURE_DIR=$(mktemp -d "${TMPDIR:-/tmp}/ishell-kanshi-parser.XXXXXX")
trap 'rm -rf "$FIXTURE_DIR"' EXIT HUP INT TERM
cc -std=c11 -D_POSIX_C_SOURCE=200809L -Wall -Wextra \
  -I"$KANSHI_SOURCE/include" "$APP_DIR/test-kanshi-parser.c" \
  "$APP_DIR/display-config.c" "$KANSHI_SOURCE/config.c" \
  -o "$FIXTURE_DIR/check-parser" \
  $(pkg-config --cflags --libs gio-2.0 scfg wayland-client) -lm
"$FIXTURE_DIR/check-parser" "$FIXTURE_DIR/kanshi.conf"
