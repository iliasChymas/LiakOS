# LiakOS quick-action launch failure

Investigated 2026-10-29 in the isolated `investigate-liakos-quick-actions`
worktree. Its starting commit and local `main` were both
`a25f51d35423a7a816f7f6d5d6aceea36f16602a`. No applicable `AGENTS.md` was found
in the worktree or its ancestor directories. The original checkout's uncommitted
Wayfire and keybindings changes were neither used nor modified.

## Root cause and observed evidence

The bar assumes its inherited `PATH` includes the native apps' installation
directory, `$HOME/.local/bin`. The installed AGS process does not have that PATH.

Read-only inspection found:

- `/tmp/liakos-bar-debug.log` records bar startup at 19:27:31 with
  `PATH="/usr/local/bin:/usr/bin"`, `HOME="/home/ilias"`.
- At 19:41:21 and again at 19:57:24 the log records the System settings click,
  `command start argv=["lsettings"]`, then
  `GLib.SpawnError: Failed to execute child process “lsettings” (No such file or directory)`.
- At 19:41:33 the Wallpaper click similarly reaches `runCommand(["lpaper"])`
  and fails during spawn. The log also contains equivalent failures for all
  three other quick actions.
- `/proc/91688/environ` (AGS) and `/proc/91704/environ` (its GJS process)
  both contain `PATH=/usr/local/bin:/usr/bin`.
- All five binaries exist and are executable under `/home/ilias/.local/bin`.
  In particular, `lsettings` and `lpaper` were installed at 19:57, before the
  19:57:24 failure. Reinstalling them did not repair command resolution.
- The installed `~/.config/ags/app.tsx` matched this worktree's starting
  `bar.tsx` byte for byte. The interactive terminal's PATH includes
  `/home/ilias/.local/bin`, unlike AGS's PATH. Wayfire's inspected PATH also
  includes it; this is specifically a difference in the running bar's environment,
  not proof that every production Wayfire launch has a restricted PATH.

This establishes a launch-time command resolution failure before either native
application starts. It does not establish why this particular AGS invocation
inherited a restricted PATH. A notification is attempted on failure; its visible
delivery was not verified.

## Complete execution path

1. `SettingsControl()` builds five buttons mapping System settings, Displays,
   Shortcuts, Startup apps, and Wallpaper to `lsettings`, `ldisplays`,
   `lkeybinds`, `lautostart`, and `lpaper`.
2. Each `clicked` handler logs the event, calls `runCommand`, and dismisses
   the popover. The command is an argv array, not a shell command.
3. Originally `Gio.Subprocess.new()` searched the bar's inherited PATH for the
   bare command. Spawn exceptions reach the callback, which attempts a
   `Could not open ...` notification. Successful spawns are monitored
   asynchronously; nonzero exits also reach the failure callback.
4. `deployment/install-c-apps.sh` builds the C apps and copies executables to
   `$HOME/.local/bin`. Desktop entries also use bare `Exec` names, but the bar
   does not use those desktop entries or D-Bus desktop-file activation.
   `deployment/install-bar.sh` installs `bar.tsx` as `ags/app.tsx`;
   `deployment/deploy.sh` configures Wayfire to run that installed entry.
5. After successful executable resolution, Settings enters
   `g_application_run()`, its `activate` callback creates the GTK window, and
   `gtk_window_present()` displays it. Lpaper initializes libvips, enters
   `g_application_run()`, then its `build_ui` callback creates and presents
   the window. None of those steps can be reached by the logged failed spawns.
6. Development `settings-app/run.sh` executes the build binary by absolute
   path; `wallpaper-app/run.sh` delegates to `tools/run-c-viewer.sh`, which also
   executes an absolute build path. These avoid the initial PATH lookup.
   Running the bar from a terminal whose PATH includes `.local/bin` also hides
   the defect, provided the native apps have been installed. The bar has no
   development fallback to repository build binaries.

## Targeted change

Quick actions opt into user-installed app resolution in `runCommand`:
prefer the executable at `$HOME/.local/bin/<name>`, otherwise retain the existing
PATH lookup. A `Gio.SubprocessLauncher` gives only those child processes an
augmented PATH. Explicit executable resolution is necessary because setting the
launcher's child environment alone does not change Gio's default lookup of a
bare executable in the parent's PATH.

The child PATH also lets Settings' `launch_app_clicked()` find `lpaper` and
`lkeybinds` through its `G_SPAWN_SEARCH_PATH` launch. Other bar commands retain
their existing environment and lookup. No global session PATH is modified.

## Validation and limits

- `scripts/test-bar-quick-actions.sh` bundles and executes the actual helper in
  GJS, with a temporary HOME containing spaces and a PATH excluding its local
  bin directory. Harmless executable fixtures reproduce the original failure,
  verify all five fixed launches and argument handling, test Settings-to-wallpaper
  child lookup, retain PATH fallback, and exercise missing-command and nonzero
  exit reporting. The test also checks that the parent PATH stays unchanged.
- `ags bundle bar.tsx /tmp/liakos-quick-actions-bar.js` succeeds.
- `sh -n scripts/test-bar-quick-actions.sh` and `git diff --check` pass.

No production click was performed during this investigation. Actual GTK windows,
notification delivery, and app-specific dependencies after successful spawn were
not exercised. Existing production logs provide the click-to-spawn reproduction;
the isolated GJS test validates the fix at that failure boundary. Nothing was
deployed, AGS was not restarted, and the running desktop configuration was not
changed.

## Subsequent production test

At the user's request, the updated bar was installed and the existing
`liakos-bar.service` restarted. Startup retained the restricted
`PATH=/usr/local/bin:/usr/bin`, and the user confirmed the fix worked. Native
apps and Wayfire configuration were not changed by that update.
