#!/usr/bin/env sh

backup_once() {
  source_file=$1
  backup_file=$2

  if [ ! -e "$source_file" ] || [ -e "$backup_file" ]; then
    return
  fi

  cp -p "$source_file" "$backup_file"
  printf 'Saved backup: %s\n' "$backup_file"
}

set_wayfire_option() {
  config_file=$1
  section=$2
  option=$3
  value=$4
  temporary_config="$config_file.tmp"

  awk -v section="$section" -v option="$option" -v value="$value" '
    $0 == "[" section "]" {
      in_section = 1
      have_section = 1
      print
      next
    }
    /^\[/ {
      if (in_section && !updated) {
        print option " = " value
        updated = 1
      }
      in_section = 0
      print
      next
    }
    in_section && $0 ~ "^[[:space:]]*" option "[[:space:]]*=" {
      if (!updated) print option " = " value
      updated = 1
      next
    }
    { print }
    END {
      if (in_section && !updated) print option " = " value
      if (!have_section) {
        print ""
        print "[" section "]"
        print option " = " value
      }
    }
  ' "$config_file" > "$temporary_config"

  chmod --reference="$config_file" "$temporary_config" 2>/dev/null || true
  mv "$temporary_config" "$config_file"
}

set_wayfire_command_option() {
  set_wayfire_option "$1" command "$2" "$3"
}
