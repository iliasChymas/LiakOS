#!/usr/bin/env sh
# Exit 0 when a binary needs rebuilding, 1 when it is current.
set -eu
LUI_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LUI_BINARY=$1
shift
[ -x "$LUI_BINARY" ] || exit 0
for source in "$LUI_DIR/lui.c" "$LUI_DIR/lui.h" "$LUI_DIR/build.sh" \
    "$LUI_DIR/lui.gresource.xml" "$LUI_DIR/styles/"*.css "$@"; do
    [ ! "$source" -nt "$LUI_BINARY" ] || exit 0
done
exit 1
