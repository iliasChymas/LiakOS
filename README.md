# LiakOs

LiakOs is a personal Linux OS project built around Wayfire. It brings together
the desktop shell, system apps, keybindings, theming, and the glue that makes
them act like one system. This repository contains the GTK bar, application
launcher, wallpaper picker, Wayfire configuration, and a TypeScript wrapper
around Wayfire IPC.

LiakOs is an opinionated user-space OS project: the chosen Linux distribution
still supplies the kernel, boot process, package manager, and login session.
There is no installer or bootable image yet. For now, “install LiakOs” means
“start with Linux, clone this repo, run a deployment script, and see what
happens.” We have successfully automated the part after the hard part.

The components are developed independently and deployed together with
`deployment/deploy.sh`. The ambition is an OS; the current delivery format is a
Git checkout and a shell script. Progress is progress.

## Components

| Component | Location | Purpose |
| --- | --- | --- |
| AGS bar | `bar.tsx` | GTK4 bar, system tray, audio and Bluetooth popovers, date, and Pywal colors |
| App launcher | `app-launcher/` | C/GTK4 fuzzy launcher for installed desktop applications |
| Keybindings editor | `keybindings-app/` | C/GTK4 search and editor for Wayfire keyboard shortcuts |
| Startup applications | `autostart-app/` | C/GTK4 search and toggle manager for Wayfire startup applications |
| Display setup | `monitor-app/` | C/GTK4 monitor layout, resolution, scale, and saved profiles |
| Wallpaper picker | `wallpaper-app/` | C/GTK4 wallpaper preview and selection app using libvips thumbnails |
| Wallpapers | `wallpapers/` | Wallpapers copied to the deployed LiakOs wallpaper directory |
| Wayfire config | `config/wayfire.ini` | Example Wayfire settings and keybindings |
| Keybinding reference | `config/wayfire-keybinds.html` | Visual guide to the checked-in Wayfire keybindings |
| Wayfire IPC wrapper | `wayfire-ipc.ts` | TypeScript wrapper for `wf-ipcli` |
| Deployment | `deployment/` | Builds and installs C apps, the AGS bar, wallpapers, and Wayfire shortcuts |

## Requirements

`requirements.txt` is a cross-language system inventory, **not** a pip file.
Do not run `pip install -r requirements.txt`. Package names vary by Linux
distribution; use the list there to find the corresponding packages.
For Arch Linux, [arch.txt](arch.txt) lists packages for the display setup app
and AGS bar, with separate commands for official repository and AUR packages.

The main requirements are:

- Wayfire 0.10 or newer, with the `ipc` and `ipc-rules` plugins enabled for
  launcher focus support and the TypeScript IPC wrapper.
- AGS v3, GTK4, libastal with AstalTray, AstalWp, and AstalBluetooth, PipeWire,
  and WirePlumber for the bar.
- BlueZ and `rfkill` for Bluetooth control. The current bar does not include a
  Wi-Fi control.
- A C compiler, `pkg-config`, GTK4 development files, GTK4 Layer Shell, JSON-GLib,
  and GIO for the launcher.
- GTK 4.10 or newer and libvips development files for `lpaper`.
- Pywal16 (`wal`), `swaybg` for setting the Wayland wallpaper, jq, GTK3,
  qt5ct, and qt6ct for dynamic wallpaper colors.
- Thunar as the file manager; the wallpaper workflow generates its GTK3 CSS.
- `xdg-utils` (`xdg-mime`), `gtk-launch`, and Python 3 for default-app Wayfire
  shortcuts managed by deployment.
- Node.js 24 or newer, `wf-ipcli` 0.1.8 or newer, Python 3, and PyWayfire for
  `wayfire-ipc.ts`.
The `requirements.txt` file has additional notes for individual features and
optional Wayfire plugins.

## Build and deploy

From the repository root, build an individual C application with:

```sh
app-launcher/build.sh
keybindings-app/build.sh
monitor-app/build.sh
wallpaper-app/build.sh
```

The binaries are created at `app-launcher/build/llauncher`,
`keybindings-app/build/lkeybinds`, `monitor-app/build/ldisplays`, and
`wallpaper-app/build/lpaper`. The run helpers compile them when needed:

```sh
app-launcher/run.sh
keybindings-app/run.sh
monitor-app/run.sh
wallpaper-app/tools/run-c-viewer.sh
```

Deploy the current setup with:

```sh
deployment/deploy.sh
```

To rebuild and update the native apps and their application-menu entries
without rerunning the full desktop deployment, use:

```sh
scripts/update-apps.sh
```

`scripts/deploy.sh` remains as a compatibility wrapper for the deployment
entrypoint. The native app build/install stage lives in
`deployment/install-c-apps.sh`; it builds the native C apps and installs their
binaries and desktop entries. The main deploy script then installs desktop
configuration and assets:

- `llauncher`, `lkeybinds`, `ldisplays`, `lsettings`, `lautostart`, and `lpaper`
  into `~/.local/bin`.
- The keybindings app desktop entry and Super+Shift+K shortcut.
- The startup applications manager desktop entry (`org.liakos.Autostart.desktop`).
- The display setup app desktop entry and Super+Shift+D shortcut.
- The wallpaper color script into `$XDG_DATA_HOME/liakos/scripts/` (normally
  `~/.local/share/liakos/scripts/`) so installed `lpaper` can apply palettes
  from any working directory.
- The AGS bar as `$XDG_CONFIG_HOME/ags/app.tsx` (normally
  `~/.config/ags/app.tsx`). A pre-existing different bar is backed up once as
  `app.tsx.bak`. Deployment also adds `ags run <installed app.tsx>` to
  Wayfire's `[autostart]` section so the bar starts at login.
- Bluetooth state icons into `$XDG_CONFIG_HOME/ags/icons/`.
- The repository wallpapers into `$XDG_CONFIG_HOME/los/walls/` (normally
  `~/.config/los/walls/`). Files are copied additively; existing files in the
  target are not removed.
- Thunar as the XDG default for `inode/directory` and for the Super+E shortcut.
- Wayfire browser and file-manager shortcuts in the existing Wayfire config.
  Existing configs are backed up once as `wayfire.ini.bak`. If there is no
  Wayfire config yet, deployment installs `config/wayfire.ini` first.
- Wayfire-side decorations are set to server mode with title-bar and border
  sizes set to zero. Clients that draw decorations themselves and do not honor
  the Wayland decoration preference can still show their own title bars.

Deployment reads the XDG browser default and uses Thunar for the file-manager
shortcut. If you change the browser default, rerun deployment to update its
shortcut. Reload or restart Wayfire to apply changed keybindings or autostart
entries, and restart AGS to load a newly deployed bar.

## Wayfire and default applications

`config/wayfire.ini` is the project template. Wayfire command bindings live in
its `[command]` section; each `command_*` setting contains a command directly.
Wayfire's documented INI format does not provide reusable application
variables.

The current project shortcuts are:

| Shortcut | Action |
| --- | --- |
| Super+Enter | Open Ghostty |
| Super+B | Open the default browser (deployment resolves the XDG browser) |
| Super+Shift+Enter | Open `llauncher` |
| Super+Shift+K | Open the keybindings editor |
| Super+Shift+D | Open display setup |
| Super+E | Open Thunar in the home directory |
| Super+F | Toggle fullscreen for the focused window |
| Super+O | Focus the next output |
| Super+Shift+O | Move/focus a window on the next output |
| Ctrl+Super+Arrow | Switch Wayfire workspace |
| Ctrl+Super+Shift+Arrow | Move the focused window between workspaces |
| Print | Screenshot; Shift+Print opens region selection |
| Volume and brightness keys | Adjust system volume and display brightness |

See [`config/wayfire-keybinds.html`](config/wayfire-keybinds.html) for a visual
keybinding reference. It is a static snapshot and may lag behind the INI; treat
`config/wayfire.ini` as authoritative when entries differ. The checked-in
config is a template; the active file is normally `~/.config/wayfire.ini` or
`~/.config/wayfire/wayfire.ini`.

The keybindings editor searches shortcuts by action, key, or category. Choose
**Edit shortcut**, press the new key combination, review the preview, and save.
It updates the active Wayfire config and keeps a one-time
`.liakos-backup` copy beside that file. Reload or restart Wayfire to apply the
change. Keyboard shortcuts defined by Wayfire plugins are editable too; mouse
gestures are not shown. It uses the same Pywal palette as the bar and reloads
its colors when `~/.cache/wal/colors.json` changes. To edit a different config,
set `LIAKOS_WAYFIRE_CONFIG` before launching it.

The Startup Applications app lists installed, launchable XDG desktop entries.
Search by name or description, or switch on **Show enabled only** to filter the
list to applications already selected for startup. Toggle the applications to
launch when Wayfire starts, then choose **Save**. It writes each selected desktop entry's
`Exec` command into `[autostart]` using app-specific `liakos_app_*` keys;
unrelated autostart settings are preserved. It keeps a one-time
`.liakos-backup` beside the Wayfire config and uses the same config lookup as
the keybindings and settings apps (`LIAKOS_WAYFIRE_CONFIG`, then
`~/.config/wayfire.ini` or `~/.config/wayfire/wayfire.ini`). Build and run it
directly with `autostart-app/build.sh` and `autostart-app/run.sh`. Reload or
restart Wayfire after saving to apply changes. Saving requires an existing
Wayfire config file; deployment creates one from `config/wayfire.ini` when
needed. The app follows the Pywal palette in `~/.cache/wal/colors.json` and
updates its colors when the palette changes.

The display setup app shows each connected screen, its available resolutions
and refresh rates, scale, rotation, and position. Drag screens in the layout
preview to arrange them, then choose **Apply changes**. The app checks the
configuration and gives 15 seconds to keep it before restoring the previous
layout. Save named layouts and load them later. It requires `wlr-randr` for
Wayland output management; the command runs behind the GTK interface. Install
the package listed in `requirements.txt` if the app reports that the backend is
missing.

LiakOS Settings is the GTK4 hub for desktop preferences. Its welcome page
launches the wallpaper picker and shortcut editor. Updates lists pending
pacman, AUR, and Flatpak updates in a table with individual actions and an
Update all button. Update actions open an interactive terminal; repository
package actions perform a full system upgrade, while AUR and Flatpak items
can be updated individually. Flatpak checks cover user and system installations.
Refresh the list after an update finishes. Displays summarizes
connected outputs and opens the existing display setup app. Mouse & Touchpad
edits active Wayfire input options and keeps a one-time `.liakos-backup` copy
beside the config. Sound controls app streams and output/input devices through
the same Astal WirePlumber integration as the bar. About shows system details
in a compact table. The app uses the Pywal palette and watches for color changes.

Wayfire shortcuts and system defaults are separate. The active browser and file
manager defaults are XDG MIME associations, usually stored in
`~/.config/mimeapps.list`. Check them with:

```sh
xdg-mime query default x-scheme-handler/https
xdg-mime query default inode/directory
```

Deployment sets Thunar as the file-manager default. Change it manually with
`xdg-mime default DESKTOP_ID MIME_TYPE`, for example:

```sh
xdg-mime default brave-browser.desktop x-scheme-handler/https
xdg-mime default thunar.desktop inode/directory
```

The browser shortcut uses the HTTPS default. Super+E launches Thunar and passes
it the home directory.

## AGS bar

The bar is implemented in `bar.tsx` with AGS v3, GTK4, and Astal. It currently
provides:

- A system tray that renders item icons and their D-Bus menus. Tray-menu rows,
  hover states, and selected states use the Pywal palette.
- An audio popover with master volume, per-application volume and mute controls,
  and output/input device selection.
- Bluetooth power control, scanning, pairing, and device connect/disconnect.
  Discovery is manual: enable Bluetooth, then choose **Scan for devices**.
- An OASA bus control that shows upcoming departures for selected lines on
  left click. Right click opens a searchable multi-select dropdown; click a
  selected line chip to remove it. The selected lines are also listed on the
  Transit page in LiakOS Settings. IDs are validated against a local OASA line
  catalog refreshed weekly. Schedule data is cached per line until one minute
  after the next departure, under `~/.cache/liakos/`.
- A centered date button that switches between full and compact formats when
  clicked.
- Dynamic CSS colors loaded from `~/.cache/wal/colors.json`. The bar watches the
  file and updates its styling when Pywal writes a new palette.

The bar uses Pywal `color4` as its main accent, `color5` as a secondary color,
and `color2` for additional status color. If there is no valid palette file, it
uses its fallback palette. To run the source directly during development:

```sh
ags run bar.tsx
```

## Application launcher

`app-launcher/` contains `llauncher`, a C/GTK4 launcher that lists installed
`.desktop` applications with their icons, filters the list as you type, and
reads its colors from Pywal.

- **Enter** focuses a matching open Wayfire window when IPC can find one; if no
  matching window exists, it launches the application.
- **Shift+Enter** launches a new process using the desktop entry's `Exec`
  command. Applications that enforce a single instance may still reuse their
  existing window.

The source and development instructions are in
[`app-launcher/README.md`](app-launcher/README.md). Focusing existing windows
requires Wayfire's `ipc` and `ipc-rules` plugins and a valid `WAYFIRE_SOCKET`.

## Wallpaper picker

`wallpaper-app/` contains `lpaper`, a C/GTK4 wallpaper picker. It opens
`$XDG_CONFIG_HOME/los/walls` by default (normally `~/.config/los/walls`). The
repository's sample wallpapers are deployed there by `scripts/deploy.sh`.

The app displays a large preview, Previous/Next controls, and a vertically
scrollable five-column thumbnail grid. Thumbnails are resized with libvips in
background workers and kept in memory; no disk thumbnail cache is created. The
top-right header-bar menu item **Open another folder…** loads images from a
different folder into the same picker. Folder scanning is non-recursive and
supports BMP, GIF, JPEG, PNG, TIFF, and WebP images.

Click **Apply wallpaper** to run `wal -i` for the selected image and then run
`scripts/test-pywal-gtk-colors.sh`. It updates GTK3 and GTK4 palettes, writes
Thunar-only rules to `~/.config/gtk-3.0/thunar.css`, and configures qt5ct/qt6ct
palettes. It also writes a Pywal theme under `~/.config/ghostty/themes/` and
sets Ghostty's `theme` option to that file, so new Ghostty windows keep the
selected colors after restart. The script backs up an existing Ghostty config
before changing its theme. It also sends Pywal's live OSC color sequences to
all open Ghostty terminal sessions, so they update immediately, and reloads the
Ghostty user service with `systemctl reload --user
app-com.mitchellh.ghostty.service` so open terminals and subsequent windows
pick up the new theme. The GTK3 user stylesheet imports the Thunar rules. LiakOs selects
`QT_QPA_PLATFORMTHEME=qt5ct:qt6ct` for apps launched by its Wayfire launcher,
so Qt platform-theme selection stays separate from other desktop sessions.
Restart other applications to see the new colors. This is a palette workflow, not a
general-purpose theme manager yet.

After a wallpaper is applied, `lpaper` also updates `liakos_wallpaper` in
Wayfire's `[autostart]` section to run `wal -i` with the selected image at the
next Wayfire start. Other autostart entries are preserved, and the first
change keeps a `.liakos-backup` beside the active Wayfire config.

See [`wallpaper-app/README.md`](wallpaper-app/README.md) for C build details and
the standalone resize benchmark.

## Pywal color workflow

Generate a palette and set a wallpaper with Pywal16:

```sh
wal -i ~/Pictures/example-wallpaper.jpg
```

Pywal writes colors to `~/.cache/wal/colors.json`. The AGS bar watches that
file. `lpaper` also runs Pywal when **Apply wallpaper** is selected, then runs
the GTK/Qt color script. It generates Thunar's GTK3 CSS, Qt5/Qt6 palettes, and
a persistent Ghostty theme alongside the GTK color files, then sends live color
sequences to the invoking terminal. New Ghostty windows keep the selected
colors after restart.

## Wayfire IPC wrapper

`wayfire-ipc.ts` wraps `wf-ipcli`, returning parsed JSON when available and
plain text otherwise. It currently exposes these CLI commands:

```sh
node wayfire-ipc.ts active-window
node wayfire-ipc.ts config
node wayfire-ipc.ts kb-layout
node wayfire-ipc.ts touch-state enabled
```

`touch-state` accepts `enabled` or `disabled`. The TypeScript exports
`runWfIpcli`, `getFocusedView`, and `getWayfireConfiguration` for other Node
code. Set `WF_IPCLI_BIN` if the executable is not named `wf-ipcli` or is not in
`PATH`. The wrapper currently covers these basic queries/actions; future
workspace and fullscreen behavior will need additional commands and event
subscriptions.

## Development files

- `requirements.txt` — cross-language system dependency inventory.
- `tsconfig.json`, `env.d.ts`, and `@girs/` — AGS/GJS TypeScript editor types.
- `app-launcher/compile_flags.txt` and
  `wallpaper-app/compile_flags.txt` — clangd include/compiler flags.
- `scripts/test-pywal-gtk-colors.sh` — apply Pywal colors to GTK3, GTK4, Qt5,
  and Qt6.
- `wallpaper-app/tools/resize-test.c` — standalone image-resize benchmark.

Refresh clangd flags after installing or changing development packages with:

```sh
app-launcher/update-clangd-flags.sh
wallpaper-app/tools/update-clangd-flags.sh
```
