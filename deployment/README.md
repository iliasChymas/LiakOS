# Deployment scripts

Run `deployment/deploy.sh` from any working directory, or use the compatibility
wrapper at `scripts/deploy.sh`.

Run `scripts/update-apps.sh` to rebuild and refresh the native applications in
`~/.local/bin` and update their desktop entries in
`~/.local/share/applications`. Missing entries, including the application
launcher entry, are installed too. The script honors `XDG_DATA_HOME` for
application entries.

- `deploy.sh` installs the AGS bar and assets, sets the default file manager,
  and updates the Wayfire application shortcuts.
- `install-c-apps.sh` builds and installs the six native C apps and their
  desktop entries into the current user's local directories.
- `lib.sh` contains the shared backup and Wayfire INI helpers.

The scripts use paths relative to the repository, honor `XDG_CONFIG_HOME` and
`XDG_DATA_HOME`, and install executables into `~/.local/bin`.
