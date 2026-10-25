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

set_wayfire_command_option() {
  config_file=$1
  option=$2
  value=$3
  temporary_config="$config_file.tmp"

  awk -v option="$option" -v value="$value" '
    /^\[command\][[:space:]]*$/ {
      in_command = 1
      have_command = 1
      print
      next
    }
    /^\[/ {
      if (in_command && !updated) {
        print option " = " value
        updated = 1
      }
      in_command = 0
      print
      next
    }
    in_command && $0 ~ "^[[:space:]]*" option "[[:space:]]*=" {
      if (!updated) print option " = " value
      updated = 1
      next
    }
    { print }
    END {
      if (in_command && !updated) print option " = " value
      if (!have_command) {
        print ""
        print "[command]"
        print option " = " value
      }
    }
  ' "$config_file" > "$temporary_config"

  chmod --reference="$config_file" "$temporary_config" 2>/dev/null || true
  mv "$temporary_config" "$config_file"
}
