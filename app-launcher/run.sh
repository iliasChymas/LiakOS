#!/usr/bin/env sh
set -eu
APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BIN_PATH="$APP_DIR/build/llauncher"
if "$APP_DIR/../lui/needs-build.sh" "$BIN_PATH" "$APP_DIR/"*.c "$APP_DIR/"*.h "$APP_DIR/build.sh"; then
  "$APP_DIR/build.sh"
fi
exec "$BIN_PATH" "$@"
