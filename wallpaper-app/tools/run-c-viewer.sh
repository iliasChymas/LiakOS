#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
ROOT_DIR=$(CDPATH= cd -- "$APP_DIR/.." && pwd)
BUILD_DIR="$APP_DIR/build"
BIN_PATH="$BUILD_DIR/lpaper"

cd "$ROOT_DIR"
mkdir -p "$BUILD_DIR"
if "$ROOT_DIR/lui/needs-build.sh" "$BIN_PATH" "$SCRIPT_DIR/wallpaper-viewer-c.c" "$APP_DIR/build.sh"; then
  "$APP_DIR/build.sh"
fi
exec "$BIN_PATH" "$@"
