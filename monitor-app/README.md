# Display persistence with Kanshi

`ldisplays` uses `wlr-randr` to detect outputs and apply a temporary 15-second
preview. Revert and timeout restore the previous live layout. Only **Keep
settings** saves the confirmed layout to the standard `~/.config/kanshi/config`
(`XDG_CONFIG_HOME` is honored). Requires **Kanshi >=1.9 with kanshictl IPC support**.

```scfg
# The app supplies a stable name based on the sorted connected connector names.
profile liakos-example {
    output DP-1 enable mode 1920x1080@71.910Hz position -1536,0 scale 1.25 transform flipped-90
    output HDMI-A-1 disable mode 3840x2160@59.940Hz position 0,0 scale 1.5 transform normal
}
```

Kanshi and wlr-randr share refresh/rotation syntax. Disabled outputs retain their
selected resolution, position, scale and transform in the saved profile, although
Kanshi only applies those values when an output is enabled. Scale uses locale-free
formatting and is sent at full precision during the preview as well.

The app creates one marked profile block per exact **connected connector set**,
including connected but disabled outputs. Saving the same monitor set replaces
its block; saving a new docked/undocked combination retains previous combinations.
New app blocks precede user profiles; all content outside the matching block is
preserved. Blocks marked `BEGIN/END liakos-displays` belong to the app; put custom
rules outside those blocks. A matching app profile takes precedence over user
profiles for the same connector set.

Kanshi 1.9 requires every connected head to match a profile output. It leaves
unrecognized combinations alone until you save that combination or supply a user
fallback profile. The app does not invent wildcard layouts that could unexpectedly
disable monitors. Connector names can change across docks/drivers; physical-monitor
identity matching is not implemented. Existing named profiles in the app's JSON
store remain manually selectable; applying and keeping one saves it for the
current topology in Kanshi.

## Startup, reloads and previews

Wayfire's `[autostart]` starts the manager with `ldisplays --start-kanshi`. This
checks the per-Wayland-session Kanshi IPC socket before starting a daemon. On
**Keep settings**, an existing daemon gets `kanshictl reload`; if absent, the app
starts it and waits briefly for its IPC socket. Reload failure is shown separately
from successful file persistence, and never starts a second daemon when an
existing daemon answered `status`.

Kanshi's current profile is retained while the connected head set still matches,
so ordinary wlr-randr previews are not immediately overwritten. Reconnects or
explicit external reloads during a preview may apply a different profile; avoid
changing the monitor topology during the confirmation countdown.

Wayfire must use:

```ini
[workarounds]
use_external_output_configuration = true
```

Deployment sets that option so later Wayfire config reloads do not replace the
externally applied layout. The display app reads/writes only the Kanshi config;
it does not read or edit `wayfire.ini`. The shipped Wayfire config contains no
per-monitor layouts. Wayfire may select a temporary default layout before Kanshi
applies a profile at login.

## Deployment and files

Deployment checks dependencies, installs the app, creates an empty Kanshi config
from `config/kanshi/config` if missing, and sets the Wayfire session launcher and
external-output ownership option. It does not start/reload Kanshi or reconfigure
the live desktop. Kanshi starts next session or when keeping a layout in Displays.
Monitor layouts are configured exclusively through Kanshi; there is no conversion
from previous display configuration formats.

The integration uses the standard Kanshi config and IPC socket. Run one Kanshi
instance reading that config, and no competing output manager. Explicitly
reloading Kanshi during preview or another program changing its config remains
outside the confirmation transaction.

The Kanshi config receives a one-time `.liakos-backup` copy before replacement.
Existing files are replaced atomically with read-etag checks, retaining permissions
and symlinks. New config files use exclusive creation and private permissions.
Inputs are validated before writing; save errors leave the previewed layout in
place for this session and are reported in the app.

## Evidence and validation

Verified against the installed Kanshi 1.9.0 and Wayfire/wf-config 0.11.0 packages:

- [Kanshi v1.9 main.c](https://gitlab.freedesktop.org/emersion/kanshi/-/blob/v1.9.0/main.c):
  exact topology matching, current-profile retention, apply and reload behavior.
- [Kanshi config manual](https://gitlab.freedesktop.org/emersion/kanshi/-/blob/v1.9.0/doc/kanshi.5.scd)
  and [IPC client](https://gitlab.freedesktop.org/emersion/kanshi/-/blob/v1.9.0/ctl.c):
  supported fields and the status/reload interface.
- [Wayfire output layout](https://github.com/WayfireWM/wayfire/blob/v0.11.0/src/core/output-layout.cpp)
  and [workarounds metadata](https://github.com/WayfireWM/wayfire/blob/v0.11.0/metadata/workarounds.xml):
  native reload/reconnect behavior and external output ownership.

Run `monitor-app/test.sh` and `monitor-app/build.sh`. The fixtures cover output
fields/all rotations, disabled outputs, topology retention, repeat saves, user
configuration, backups, permissions, symlinks and failure paths.
Daemon tests replace Kanshi/kanshictl with isolated stubs; they never connect to a
real compositor. `test-kanshi-parser.sh /path/to/kanshi-v1.9.0-source` optionally
checks saved settings with upstream's actual parser (needs libscfg/Wayland
client development libraries). Hardware startup/reconnect/preview behavior still
requires a deliberate desktop test; it has not been exercised on the live session.

The wallpaper thread is independent: it removes unnecessary config writes, while
this integration protects externally applied layouts on any later Wayfire reload.
