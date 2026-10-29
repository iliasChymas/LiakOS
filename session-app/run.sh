#!/usr/bin/env sh
set -eu

APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BIN_PATH="$APP_DIR/build/lsession"
if [ ! -x "$BIN_PATH" ] || [ "$APP_DIR/session-app.c" -nt "$BIN_PATH" ]; then
  "$APP_DIR/build.sh"
fi
exec "$BIN_PATH" "$@"
