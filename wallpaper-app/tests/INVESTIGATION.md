Wallpaper / monitor layout regression investigation (2026-10-29)

Scope: isolated branch `investigate/wallpaper-monitor-layout`, initially clean at
`a25f51d` (also local main). No applicable AGENTS.md was found in this worktree
or its ancestor directories. The original checkout and its uncommitted files
were not accessed. No deployment, wallpaper setter, compositor connection, or
live display command was run.

Evidence and cause

- Before this fix, `apply_clicked()` ran `wal -i "$1"` followed by the color
  script. Its successful async completion called `save_wallpaper_startup()`.
  That function read the Wayfire INI, replaced the `liakos_wallpaper` autostart
  entry, wrote a backup and temporary file, and renamed the temporary file over
  the compositor config. It did so on every successful apply, including the
  same image. Preserving output-section bytes did not prevent the reload.
- Wayfire 0.11.0 (the installed package version) connects `reload_config_signal`
  directly to `reconfigure_from_config()` in `src/core/output-layout.cpp`
  (lines 1329 and 1649). That loads configured output state and applies it when
  it differs from current state. External output-management state is preserved
  only with the relevant `use_external_output_configuration` workaround enabled
  (subject to its mirroring exception). This establishes the reset mechanism
  when a live wlr-randr/kanshi layout differs from the INI/defaults:
  wallpaper success -> INI replacement -> config reload -> output reset.
  Source: https://github.com/WayfireWM/wayfire/blob/v0.11.0/src/core/output-layout.cpp
- `monitor-app/liakos-displays.c` enumerates outputs with plain `wlr-randr` and
  parses modes, positions, scales, transforms and enabled state. Applying a
  layout invokes wlr-randr with those values. Keeping a layout saves an
  autostart command and schedules one reapply after 500 ms. That compensates
  for the display app's own config save, not a subsequent wallpaper save.
- Wayfire autostart commands run once at plugin startup, so an unchanged
  `liakos_display_layout` line does not restore the layout after each reload.
  Source: https://github.com/WayfireWM/wayfire/blob/v0.11.0/plugins/single_plugins/autostart.cpp
- The color script writes GTK, Qt and Ghostty themes, reloads only the Ghostty
  user service, and sends terminal color sequences. It has no output-layout or
  Wayfire config writes. Installed Pywal16 3.8.15 uses wallpaper setters on
  Wayfire, not wlr-randr/kanshi. Its reload module has no Wayfire reload path.
- Full deployment separately edits the compositor config; app updates do not.
  The committed template also contains a machine-specific saved display command
  and starts kanshi. Neither is invoked by the wallpaper app. No user-specific
  live configuration was needed or read to establish this defect.

History

- `3b5c261`: added the Wayland wallpaper-setter preflight, not layout protection.
- `013b2ee`: introduced the per-apply Wayfire INI rewrite for wallpaper startup.
- `54421b1` / `b493a3e`: locale-independent scale/mode parsing fixes; unrelated
  to wallpaper's config-write trigger.
- `dd74cc3`: saved display layout to autostart and added the one-shot reapply.
- `662afcd`: stopped app updates from editing/reloading Wayfire config. The
  wallpaper path still independently rewrote it, explaining the recurrence.

Fix and validation

- Removed wallpaper-time Wayfire configuration access entirely. Full deployment
  installs the stable `liakos_wallpaper = wal -R` entry; Pywal already caches the
  selected image and palette. Existing image-specific startup entries need the
  documented migration while Wayfire is stopped, or the next full deployment.
  App-only updates intentionally do not migrate compositor configuration.
- `wallpaper-app/tests/run.sh` passes. It exercises the actual apply callback
  and async completion without initializing GTK, and the actual color script
  with fake wal/systemctl/pgrep/setter/display commands and temporary XDG dirs.
  Repeated images, distinct images, shell metacharacters, root/nested/override
  config paths, wal failure and color-script failure are covered. Compositor
  and kanshi file bytes, inode, mtime and permissions stay unchanged; there are
  no monitor enumeration/configuration calls. Layout values are fixtures, not
  observed hardware state. Deployment's INI helper migrates only the wallpaper
  entry in a temporary INI.
- Compiling the same harness against the pre-fix HEAD source fails immediately:
  `AssertionError: Wallpaper apply modified .../config/wayfire.ini`.
- `wallpaper-app/build.sh`, shell syntax checks and `git diff --check` pass.
  Separately, installed Pywal16's real `-R` argument path was tested against a
  temporary colors.json with setter/export/reload/terminal effects mocked; it
  selected the cached wallpaper correctly.

Limits: no physical-monitor or nested-compositor reproduction was performed.
The checks establish removal of the proven config-reload trigger, not behavior
of every wallpaper backend, driver, hotplug event, user hook or external daemon.
Clearing Pywal's cache removes the state used by startup restoration. This fix
does not change other apps' compositor config writes or display persistence.
