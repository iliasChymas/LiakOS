#!/usr/bin/env bash
set -euo pipefail

APP_DIR=$(cd -- "$(dirname -- "$0")/.." && pwd)
FLAGS=$(pkg-config --cflags gtk4 vips)

{
  printf '%s\n' -std=c11 -Wall -Wextra
  read -r -a pkg_flags <<< "$FLAGS"
  printf '%s\n' "${pkg_flags[@]}"
} > "$APP_DIR/compile_flags.txt"

printf 'Wrote clangd flags to %s/compile_flags.txt\n' "$APP_DIR"
