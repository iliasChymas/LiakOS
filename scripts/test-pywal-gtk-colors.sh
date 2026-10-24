#!/usr/bin/env bash
set -euo pipefail

config_home="${XDG_CONFIG_HOME:-$HOME/.config}"
cache_home="${XDG_CACHE_HOME:-$HOME/.cache}"
palette_file="$cache_home/wal/colors.json"
gtk3_file="$config_home/gtk-3.0/colors.css"
gtk4_file="$config_home/gtk-4.0/colors.css"
kdeglobals_file="$config_home/kdeglobals"
color_schemes_dir="${XDG_DATA_HOME:-$HOME/.local/share}/color-schemes"
qt_scheme_file="$color_schemes_dir/LiakOsPywalTest.colors"

if ! command -v jq >/dev/null 2>&1; then
  printf 'Error: jq is required to read %s\n' "$palette_file" >&2
  exit 1
fi

if ! command -v kwriteconfig6 >/dev/null 2>&1; then
  printf 'Error: kwriteconfig6 is required to apply the Qt color scheme\n' >&2
  exit 1
fi

if [[ ! -r "$palette_file" ]]; then
  printf 'Error: Pywal palette not found: %s\n' "$palette_file" >&2
  exit 1
fi

for file in "$gtk3_file" "$gtk4_file"; do
  if [[ ! -f "$file" ]]; then
    printf 'Error: expected GTK colors file not found: %s\n' "$file" >&2
    exit 1
  fi
done

read_color() {
  local query="$1"
  jq -er "$query | select(type == \"string\" and test(\"^#[[:xdigit:]]{6}$\"))" "$palette_file"
}

background="$(read_color '.special.background')"
foreground="$(read_color '.special.foreground')"
accent="$(read_color '.colors.color4')"
accent_alt="$(read_color '.colors.color5')"
surface="$(read_color '.colors.color0')"
muted="$(read_color '.colors.color8')"
error="$(read_color '.colors.color1')"
warning="$(read_color '.colors.color2')"
success="$(read_color '.colors.color5')"

backup_once() {
  local file="$1"
  local candidate

  for candidate in "${file}.bak" "${file}.bak."*; do
    if [[ -e "$candidate" ]]; then
      printf 'Keeping existing backup: %s\n' "$candidate"
      return
    fi
  done

  cp -a -- "$file" "${file}.bak"
  printf 'Backed up %s to %s\n' "$file" "${file}.bak"
}

to_rgb() {
  local hex="${1#\#}"
  printf '%d,%d,%d' \
    "$((16#${hex:0:2}))" \
    "$((16#${hex:2:2}))" \
    "$((16#${hex:4:2}))"
}

background_rgb="$(to_rgb "$background")"
foreground_rgb="$(to_rgb "$foreground")"
accent_rgb="$(to_rgb "$accent")"
accent_alt_rgb="$(to_rgb "$accent_alt")"
surface_rgb="$(to_rgb "$surface")"
muted_rgb="$(to_rgb "$muted")"
error_rgb="$(to_rgb "$error")"
warning_rgb="$(to_rgb "$warning")"
success_rgb="$(to_rgb "$success")"

write_qt_scheme() {
  mkdir -p -- "$color_schemes_dir"
  if [[ -e "$qt_scheme_file" ]]; then
    backup_once "$qt_scheme_file"
  fi

  local temporary
  temporary="$(mktemp "${qt_scheme_file}.tmp.XXXXXX")"
  cat > "$temporary" <<EOF
[General]
Name=LiakOsPywalTest
ColorScheme=LiakOsPywalTest
shadeSortColumn=true

[Colors:Window]
BackgroundNormal=$background_rgb
BackgroundAlternate=$surface_rgb
ForegroundNormal=$foreground_rgb
ForegroundInactive=$muted_rgb
ForegroundActive=$accent_rgb
ForegroundLink=$accent_alt_rgb
ForegroundVisited=$accent_rgb
ForegroundNegative=$error_rgb
ForegroundNeutral=$warning_rgb
ForegroundPositive=$success_rgb
DecorationFocus=$accent_rgb
DecorationHover=$accent_alt_rgb

[Colors:View]
BackgroundNormal=$background_rgb
BackgroundAlternate=$surface_rgb
ForegroundNormal=$foreground_rgb
ForegroundInactive=$muted_rgb
ForegroundActive=$accent_rgb
ForegroundLink=$accent_alt_rgb
ForegroundVisited=$accent_rgb
ForegroundNegative=$error_rgb
ForegroundNeutral=$warning_rgb
ForegroundPositive=$success_rgb
DecorationFocus=$accent_rgb
DecorationHover=$accent_alt_rgb

[Colors:Button]
BackgroundNormal=$surface_rgb
BackgroundAlternate=$background_rgb
ForegroundNormal=$foreground_rgb
ForegroundInactive=$muted_rgb
ForegroundActive=$accent_rgb
ForegroundLink=$accent_alt_rgb
ForegroundVisited=$accent_rgb
ForegroundNegative=$error_rgb
ForegroundNeutral=$warning_rgb
ForegroundPositive=$success_rgb
DecorationFocus=$accent_rgb
DecorationHover=$accent_alt_rgb

[Colors:Selection]
BackgroundNormal=$accent_rgb
BackgroundAlternate=$accent_alt_rgb
ForegroundNormal=$foreground_rgb
ForegroundInactive=$foreground_rgb
ForegroundActive=$foreground_rgb
ForegroundLink=$foreground_rgb
ForegroundVisited=$foreground_rgb
ForegroundNegative=$error_rgb
ForegroundNeutral=$warning_rgb
ForegroundPositive=$success_rgb
DecorationFocus=$accent_alt_rgb
DecorationHover=$accent_alt_rgb

[Colors:Tooltip]
BackgroundNormal=$surface_rgb
BackgroundAlternate=$background_rgb
ForegroundNormal=$foreground_rgb
ForegroundInactive=$muted_rgb
ForegroundActive=$accent_rgb
ForegroundLink=$accent_alt_rgb
ForegroundVisited=$accent_rgb
ForegroundNegative=$error_rgb
ForegroundNeutral=$warning_rgb
ForegroundPositive=$success_rgb
DecorationFocus=$accent_rgb
DecorationHover=$accent_alt_rgb

[WM]
activeBackground=$surface_rgb
activeBlend=$background_rgb
activeForeground=$foreground_rgb
inactiveBackground=$background_rgb
inactiveBlend=$background_rgb
inactiveForeground=$muted_rgb
EOF
  chmod 644 "$temporary"
  mv -- "$temporary" "$qt_scheme_file"
  printf 'Generated Qt color scheme: %s\n' "$qt_scheme_file"
}

apply_qt_scheme() {
  if [[ -e "$kdeglobals_file" ]]; then
    backup_once "$kdeglobals_file"
  fi

  local group=""
  local line key value
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" =~ ^\[(.*)\]$ ]]; then
      group="${BASH_REMATCH[1]}"
    elif [[ "$line" == *=* ]]; then
      key="${line%%=*}"
      value="${line#*=}"
      case "$group" in
        General|Colors:*|WM)
          kwriteconfig6 --file "$kdeglobals_file" --group "$group" --key "$key" --notify "$value"
          ;;
      esac
    fi
  done < "$qt_scheme_file"
  printf 'Applied Qt palette to %s\n' "$kdeglobals_file"
}

rewrite_colors() {
  local file="$1"
  local temporary

  backup_once "$file"
  temporary="$(mktemp "${file}.tmp.XXXXXX")"

  if ! awk \
    -v background="$background" \
    -v foreground="$foreground" \
    -v accent="$accent" \
    -v accent_alt="$accent_alt" \
    -v surface="$surface" \
    -v muted="$muted" \
    -v error="$error" \
    -v warning="$warning" \
    -v success="$success" '
      /^@define-color[[:space:]]/ {
        name = $2
        sub(/_breeze$/, "", name)

        if (name ~ /error/) {
          $3 = error ";"
        } else if (name ~ /warning/) {
          $3 = warning ";"
        } else if (name ~ /success/) {
          $3 = success ";"
        } else if (name ~ /border/) {
          $3 = muted ";"
        } else if (name ~ /link_visited/) {
          $3 = accent_alt ";"
        } else if (name ~ /(selected_bg|hovering_selected_bg|decoration_focus|decoration_hover|view_active_decoration|view_hover_decoration)/) {
          $3 = accent ";"
        } else if (name ~ /link_color/) {
          $3 = accent_alt ";"
        } else if (name ~ /(button_background|tooltip_background|insensitive.*bg|insensitive_base_color)/) {
          $3 = surface ";"
        } else if (name ~ /(base_color|bg_color|background|content_view_bg)/) {
          $3 = background ";"
        } else if (name ~ /(fg_color|text_color|foreground|tooltip_text)/) {
          if (name ~ /insensitive|unfocused/) $3 = muted ";"
          else $3 = foreground ";"
        } else if (name ~ /selected_fg/) {
          $3 = foreground ";"
        }
      }
      { print }
    ' "$file" > "$temporary"; then
    rm -f -- "$temporary"
    printf 'Error: could not generate %s\n' "$file" >&2
    exit 1
  fi

  chmod --reference="$file" "$temporary"
  mv -- "$temporary" "$file"
  printf 'Updated %s\n' "$file"
}

rewrite_colors "$gtk3_file"
rewrite_colors "$gtk4_file"
write_qt_scheme
apply_qt_scheme
printf 'Restart GTK and Qt apps to see the test colors.\n'
