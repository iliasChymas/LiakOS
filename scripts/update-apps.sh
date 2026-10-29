#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DEPLOYMENT_DIR="$ROOT_DIR/deployment"

"$DEPLOYMENT_DIR/install-c-apps.sh" "$@"
exec "$DEPLOYMENT_DIR/install-bar.sh"
