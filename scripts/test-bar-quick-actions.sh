#!/usr/bin/env sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
TEST_DIR=$(mktemp -d)
trap 'rm -rf "$TEST_DIR"' EXIT HUP INT TERM

# Exercise the actual bar helper without starting AGS or touching the desktop.
python3 - "$ROOT_DIR/bar.tsx" "$TEST_DIR/test.ts" "$SCRIPT_DIR/tests/quick-actions.ts" <<'PY'
from pathlib import Path
import sys
source = Path(sys.argv[1]).read_text()
start = source.index('type CommandResult =')
end = source.index('\nfunction sendBarNotification', start)
Path(sys.argv[2]).write_text(
    'import Gio from "gi://Gio"\nimport GLib from "gi://GLib"\n'
    'function debugLog(message: string) {}\n'
    + source[start:end] + '\n' + Path(sys.argv[3]).read_text()
)
PY
ags bundle --gtk 4 "$TEST_DIR/test.ts" "$TEST_DIR/test"

# Spaces in HOME also ensure app paths are passed as argv, never shell strings.
TEST_HOME="$TEST_DIR/user home"
mkdir -p "$TEST_HOME/.local/bin" "$TEST_DIR/path-bin" "$TEST_DIR/runtime"
for app in lsettings ldisplays lkeybinds lautostart lpaper; do
  cat > "$TEST_HOME/.local/bin/$app" <<'APP'
#!/bin/sh
if [ "$1" = '--child-probe' ]; then
  exec lpaper --child
fi
printf '%s|%s\n' "${0##*/}" "$1"
APP
  chmod +x "$TEST_HOME/.local/bin/$app"
done
cat > "$TEST_DIR/path-bin/path-only" <<'APP'
#!/bin/sh
printf 'fallback\n'
APP
chmod +x "$TEST_DIR/path-bin/path-only"
# A non-executable local file must not prevent the PATH fallback.
printf 'not executable\n' > "$TEST_HOME/.local/bin/path-only"
cat > "$TEST_HOME/.local/bin/failing-app" <<'APP'
#!/bin/sh
printf 'fixture failure\n' >&2
exit 7
APP
chmod +x "$TEST_HOME/.local/bin/failing-app"
output=$(HOME="$TEST_HOME" PATH="$TEST_DIR/path-bin:/usr/local/bin:/usr/bin:/bin" \
  XDG_RUNTIME_DIR="$TEST_DIR/runtime" "$TEST_DIR/test")
printf '%s\n' "$output"
case "$output" in
  *'PASS: reproduced original failure;'*) ;;
  *) exit 1 ;;
esac
