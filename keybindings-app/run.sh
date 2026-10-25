#!/usr/bin/env sh
set -eu
APP_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if [ ! -x "$APP_DIR/build/lkeybinds" ]; then "$APP_DIR/build.sh"; fi
exec "$APP_DIR/build/lkeybinds" "$@"
