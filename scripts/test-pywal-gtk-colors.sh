#!/usr/bin/env bash
set -euo pipefail

config_home="${XDG_CONFIG_HOME:-$HOME/.config}"
cache_home="${XDG_CACHE_HOME:-$HOME/.cache}"
palette_file="$cache_home/wal/colors.json"
gtk3_file="$config_home/gtk-3.0/colors.css"
gtk4_file="$config_home/gtk-4.0/colors.css"
gtk3_user_css="$config_home/gtk-3.0/gtk.css"
thunar_css_file="$config_home/gtk-3.0/thunar.css"
qt5_config_dir="$config_home/qt5ct"
qt6_config_dir="$config_home/qt6ct"
ghostty_config_dir="$config_home/ghostty"
ghostty_theme_file="$ghostty_config_dir/themes/liakos-pywal"
if [[ -f "$ghostty_config_dir/config.ghostty" ]]; then
  ghostty_config_file="$ghostty_config_dir/config.ghostty"
elif [[ -f "$ghostty_config_dir/config" ]]; then
  ghostty_config_file="$ghostty_config_dir/config"
else
  ghostty_config_file="$ghostty_config_dir/config.ghostty"
fi

if ! command -v jq >/dev/null 2>&1; then
  printf 'Error: jq is required to read %s\n' "$palette_file" >&2
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

qt_color() {
  local hex="${1#\#}"
  printf '#ff%s' "${hex,,}"
}

qt_colors() {
  local text="$1" button="$2" muted_text="$3" highlight="$4"
  local link="$5" alternate="$6" placeholder="$7"
  printf '%s\n' "[ColorScheme]"
  printf 'active_colors=%s\n' \
    "$(qt_color "$text"), $(qt_color "$button"), $(qt_color "$button"), $(qt_color "$button"), $(qt_color "$muted_text"), $(qt_color "$muted_text"), $(qt_color "$text"), #ffffffff, $(qt_color "$text"), $(qt_color "$background"), $(qt_color "$background"), #ff000000, $(qt_color "$highlight"), $(qt_color "$text"), $(qt_color "$link"), $(qt_color "$alternate"), $(qt_color "$button"), $(qt_color "$text"), $(qt_color "$button"), $(qt_color "$text"), #80${placeholder#\#}, $(qt_color "$highlight")"
  printf 'disabled_colors=%s\n' \
    "$(qt_color "$muted_text"), $(qt_color "$button"), $(qt_color "$button"), $(qt_color "$button"), $(qt_color "$muted_text"), $(qt_color "$muted_text"), $(qt_color "$muted_text"), #ffffffff, $(qt_color "$muted_text"), $(qt_color "$background"), $(qt_color "$background"), #ff000000, #66${highlight#\#}, $(qt_color "$text"), $(qt_color "$muted_text"), $(qt_color "$muted_text"), $(qt_color "$button"), $(qt_color "$muted_text"), $(qt_color "$button"), $(qt_color "$muted_text"), #80${placeholder#\#}, #66${highlight#\#}"
  printf 'inactive_colors=%s\n' \
    "$(qt_color "$text"), $(qt_color "$button"), $(qt_color "$button"), $(qt_color "$button"), $(qt_color "$muted_text"), $(qt_color "$muted_text"), $(qt_color "$text"), #ffffffff, $(qt_color "$text"), $(qt_color "$background"), $(qt_color "$background"), #ff000000, $(qt_color "$highlight"), $(qt_color "$text"), $(qt_color "$link"), $(qt_color "$alternate"), $(qt_color "$button"), $(qt_color "$text"), $(qt_color "$button"), $(qt_color "$text"), #80${placeholder#\#}, $(qt_color "$highlight")"
}

update_qtct_config() {
  local config_file="$1" palette="$2" temporary
  if [[ -e "$config_file" ]]; then
    backup_once "$config_file"
  fi
  temporary="$(mktemp "${config_file}.tmp.XXXXXX")"
  if [[ -f "$config_file" ]]; then
    awk -v palette="$palette" '
      BEGIN { in_appearance = 0; seen_appearance = 0; path_written = 0; custom_written = 0 }
      /^\[/ {
        if (in_appearance) {
          if (!path_written) print "color_scheme_path=" palette
          if (!custom_written) print "custom_palette=true"
        }
        in_appearance = ($0 == "[Appearance]")
        if (in_appearance) seen_appearance = 1
        print
        next
      }
      in_appearance && /^[[:space:]]*color_scheme_path=/ { print "color_scheme_path=" palette; path_written = 1; next }
      in_appearance && /^[[:space:]]*custom_palette=/ { print "custom_palette=true"; custom_written = 1; next }
      { print }
      END {
        if (in_appearance) {
          if (!path_written) print "color_scheme_path=" palette
          if (!custom_written) print "custom_palette=true"
        } else if (!seen_appearance) {
          print "[Appearance]"
          print "color_scheme_path=" palette
          print "custom_palette=true"
        }
      }
    ' "$config_file" > "$temporary"
  else
    printf '[Appearance]\ncolor_scheme_path=%s\ncustom_palette=true\n' "$palette" > "$temporary"
  fi
  chmod 600 "$temporary"
  mv -- "$temporary" "$config_file"
}

write_qt_palette() {
  local config_dir="$1" config_file="$2"
  local colors_file="$config_dir/colors/liakos-pywal.conf" temporary
  mkdir -p -- "$config_dir/colors"
  if [[ -e "$colors_file" ]]; then
    backup_once "$colors_file"
  fi
  temporary="$(mktemp "${colors_file}.tmp.XXXXXX")"
  qt_colors "$foreground" "$surface" "$muted" "$accent" "$accent_alt" "$surface" "$muted" > "$temporary"
  chmod 644 "$temporary"
  mv -- "$temporary" "$colors_file"
  update_qtct_config "$config_file" "$colors_file"
  printf 'Updated Qt palette: %s\n' "$colors_file"
}

write_qt_palettes() {
  write_qt_palette "$qt5_config_dir" "$qt5_config_dir/qt5ct.conf"
  write_qt_palette "$qt6_config_dir" "$qt6_config_dir/qt6ct.conf"
}

write_ghostty_theme() {
  local temporary index color
  mkdir -p -- "$(dirname -- "$ghostty_theme_file")"
  temporary="$(mktemp "${ghostty_theme_file}.tmp.XXXXXX")"
  {
    printf '# LiakOs Pywal theme; generated by the wallpaper app.\n'
    printf 'background = %s\n' "$background"
    printf 'foreground = %s\n' "$foreground"
    printf 'cursor-color = %s\n' "$foreground"
    printf 'selection-background = %s\n' "$foreground"
    printf 'selection-foreground = %s\n' "$background"
    for index in {0..15}; do
      color="$(read_color ".colors.color$index")"
      printf 'palette = %s=%s\n' "$index" "$color"
    done
  } > "$temporary"
  chmod 644 "$temporary"
  mv -- "$temporary" "$ghostty_theme_file"

  mkdir -p -- "$ghostty_config_dir"
  temporary="$(mktemp "${ghostty_config_file}.tmp.XXXXXX")"
  if [[ -f "$ghostty_config_file" ]]; then
    backup_once "$ghostty_config_file"
    if ! awk -v theme="$ghostty_theme_file" '
      /^[[:space:]]*#/ { print; next }
      /^[[:space:]]*theme[[:space:]]*=/ {
        if (!written) print "theme = " theme
        written = 1
        next
      }
      { print }
      END { if (!written) print "theme = " theme }
    ' "$ghostty_config_file" > "$temporary"; then
      rm -f -- "$temporary"
      printf 'Error: could not update %s\n' "$ghostty_config_file" >&2
      exit 1
    fi
    chmod --reference="$ghostty_config_file" "$temporary"
  else
    printf 'theme = %s\n' "$ghostty_theme_file" > "$temporary"
    chmod 644 "$temporary"
  fi
  mv -- "$temporary" "$ghostty_config_file"
  printf 'Updated Ghostty theme: %s\n' "$ghostty_theme_file"
}

reload_ghostty_service() {
  if systemctl reload --user app-com.mitchellh.ghostty.service; then
    printf 'Reloaded all Ghostty terminals.\n'
  else
    printf 'Warning: could not reload Ghostty through its user service.\n' >&2
  fi
}

emit_live_terminal_colors() {
  local sequences="$cache_home/wal/sequences"
  local ghostty_pid child_pid terminal
  local -a pending=()
  local -A visited_processes=() visited_terminals=()
  [[ -r "$sequences" ]] || return
  command -v pgrep >/dev/null 2>&1 || return

  while read -r ghostty_pid; do
    [[ -n "$ghostty_pid" ]] && pending+=("$ghostty_pid")
  done < <(pgrep -x ghostty || true)

  while ((${#pending[@]})); do
    ghostty_pid="${pending[0]}"
    pending=("${pending[@]:1}")
    [[ ${visited_processes[$ghostty_pid]+yes} ]] && continue
    visited_processes[$ghostty_pid]=1

    terminal="$(ps -o tty= -p "$ghostty_pid" 2>/dev/null | tr -d '[:space:]')"
    if [[ "$terminal" == pts/* && ! ${visited_terminals[$terminal]+yes} ]]; then
      visited_terminals[$terminal]=1
      cat -- "$sequences" > "/dev/$terminal" 2>/dev/null || true
    fi
    while read -r child_pid; do
      [[ -n "$child_pid" ]] && pending+=("$child_pid")
    done < <(pgrep -P "$ghostty_pid" || true)
  done

  if [[ -t 1 ]]; then
    terminal="$(tty 2>/dev/null || true)"
    terminal="${terminal#/dev/}"
    if [[ "$terminal" == pts/* && ! ${visited_terminals[$terminal]+yes} ]]; then
      cat -- "$sequences"
      printf '\n'
    fi
  fi
}

write_thunar_css() {
  local temporary
  if [[ -e "$thunar_css_file" ]]; then
    backup_once "$thunar_css_file"
  fi
  temporary="$(mktemp "${thunar_css_file}.tmp.XXXXXX")"
  cat > "$temporary" <<EOF
/* LiakOs Pywal colors for Thunar's GTK3 widgets. */
window.thunar,
.thunar {
  background-color: $background;
  color: $foreground;
}

window.thunar .standard-view,
.thunar .standard-view,
window.thunar .standard-view .view,
.thunar .standard-view .view {
  background-color: $background;
  color: $foreground;
}

window.thunar .standard-view .view:selected,
window.thunar .standard-view .view:selected:focus,
.thunar .standard-view .view:selected,
.thunar .standard-view .view:selected:focus {
  background-color: $accent;
  color: $foreground;
}

window.thunar .sidebar,
window.thunar .shortcuts-pane,
.thunar .sidebar,
.thunar .shortcuts-pane {
  background-color: $surface;
  color: $foreground;
}

window.thunar .sidebar row:selected,
window.thunar .shortcuts-pane row:selected,
.thunar .sidebar row:selected,
.thunar .shortcuts-pane row:selected {
  background-color: $accent;
  color: $foreground;
}

window.thunar #location-toolbar,
window.thunar toolbar,
.thunar #location-toolbar,
.thunar toolbar {
  background-color: $surface;
  color: $foreground;
}

window.thunar toolbar button:hover,
.thunar toolbar button:hover {
  background-color: $accent_alt;
  color: $foreground;
}

window.thunar statusbar,
.thunar statusbar {
  background-color: $background;
  color: $muted;
}
EOF
  chmod 644 "$temporary"
  mv -- "$temporary" "$thunar_css_file"
  printf 'Updated Thunar GTK3 stylesheet: %s\n' "$thunar_css_file"

  if ! grep -Fqx "@import 'thunar.css';" "$gtk3_user_css" 2>/dev/null; then
    if [[ -e "$gtk3_user_css" ]]; then
      backup_once "$gtk3_user_css"
      temporary="$(mktemp "${gtk3_user_css}.tmp.XXXXXX")"
      {
        printf "@import 'thunar.css';\n"
        cat "$gtk3_user_css"
      } > "$temporary"
      chmod --reference="$gtk3_user_css" "$temporary"
      mv -- "$temporary" "$gtk3_user_css"
    else
      printf "@import 'thunar.css';\n" > "$gtk3_user_css"
      chmod 644 "$gtk3_user_css"
    fi
  fi
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
write_qt_palettes
write_ghostty_theme
reload_ghostty_service
write_thunar_css
printf 'GTK3, GTK4, Ghostty, Thunar, Qt5, and Qt6 palettes updated.\n'
printf 'Live colors are sent to open Ghostty terminals; new windows use the saved theme.\n'
emit_live_terminal_colors
