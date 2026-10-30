# LiakOS application launcher

A small GTK4/Wayland launcher written in C. It lists visible `.desktop`
applications as icon-and-name rows, filters as you type, and reads its colors
through the shared [LUI library](../lui/README.md) from Pywal's
`colors.json`. LUI reloads the GTK stylesheet when that JSON changes. The panel corners are 10px.

## Run

```sh
app-launcher/run.sh
```

The first run compiles the program to `app-launcher/build/llauncher`; later runs
reuse that binary. In Wayfire, point the launcher command in your keybinding at
`/absolute/path/to/LiakOS/app-launcher/run.sh`.

Press **Enter** to focus a matching open Wayfire window, or launch the app if
there is no match. Press **Shift+Enter** to invoke the desktop entry's `Exec`
command directly as a new process. An application that enforces a single
instance can still redirect that process to its existing window.

Focusing an existing Wayfire window uses the `window-rules/list-views` and
`window-rules/focus-view` IPC methods. The running Wayfire configuration must
enable both `ipc` and `ipc-rules` in `[core] plugins`, and export
`WAYFIRE_SOCKET`. If IPC is unavailable, Enter falls back to normal application
launching.

## Development

System dependencies are listed in the repository's `requirements.txt`. To
refresh clangd's GTK, layer-shell, JSON-GLib, and GIO include flags after system
packages change:

```sh
app-launcher/update-clangd-flags.sh
```
