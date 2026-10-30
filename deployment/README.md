# Deployment scripts

Run `deployment/deploy.sh` from any working directory, or use the compatibility
wrapper at `scripts/deploy.sh`.

Run `deployment/install-bar.sh` to install or repair just the AGS bar, its icons,
and the OASA schedule helper, then restart AGS. This can be run from any working
directory and does not change Wayfire settings or rebuild the native apps.

Run `scripts/update-apps.sh` to rebuild and refresh the native applications in
`~/.local/bin` and update their desktop entries in
`~/.local/share/applications`. It also runs `install-bar.sh` to install the AGS
bar, icons, and OASA helper; restart AGS to load bar changes.
It does not touch or reload the active Wayfire
configuration. Missing entries, including the application launcher entry, are
installed too.
The script honors `XDG_DATA_HOME` and `XDG_CONFIG_HOME`.

- `deploy.sh` installs the AGS bar and assets, sets the default file manager,
  updates the Wayfire application shortcuts, and installs `wal -R` to restore
  the cached wallpaper at login without per-wallpaper compositor config edits.
- `install-c-apps.sh` builds and installs the native C apps and their
  desktop entries into the current user's local directories.
- `install-bar.sh` installs the bar and all its icons and OASA helper together.
- `lib.sh` contains the shared backup and Wayfire INI helpers.

The scripts use paths relative to the repository, honor `XDG_CONFIG_HOME` and
`XDG_DATA_HOME`, and install executables into `~/.local/bin`.

Display persistence requires Kanshi >=1.9 with `kanshictl`. Deployment creates
`~/.config/kanshi/config` from the empty shipped template if missing, sets
Wayfire's external-output ownership option, and adds the guarded Kanshi session
launcher. The display app saves layouts only to Kanshi. Deployment does not
start/reload Kanshi; it starts next session or after **Keep settings** in Displays.
See [display persistence](../monitor-app/README.md) for details.

The bar's LiakOS quick actions resolve executables in `~/.local/bin` directly,
then fall back to the inherited PATH. Their child processes also receive that
directory in PATH, so Settings can open the wallpaper and shortcut apps even
when AGS was started with a restricted session PATH. See
[the quick-action investigation](quick-actions-investigation.md) for evidence
and validation. Run `scripts/test-bar-quick-actions.sh` for the isolated GJS
regression checks (requires AGS and GJS; does not start the desktop bar).

The native app builds automatically build and statically link [LUI](../lui/README.md),
including its styles and palette service. Rebuild/reinstall all native apps to
apply a shared component or theme change; no separate runtime LUI install is needed.
