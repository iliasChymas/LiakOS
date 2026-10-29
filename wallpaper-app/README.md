# LiakOs Wallpapers (C / GTK4)

The viewer starts in `$XDG_CONFIG_HOME/los/walls` (normally
`~/.config/los/walls`), provides Previous/Next navigation, and shows a
vertically scrollable five-column thumbnail grid. Use **Wallpaper folders…**
in the top-right menu to add or remove folders scanned by the picker. The
current location stays first and cannot be removed; extra locations are saved
in `$XDG_CONFIG_HOME/los/wallpaper-folders.ini`. It generates
256×144 thumbnails in the background with libvips and keeps them in memory;
it does not create a thumbnail cache on disk.

Build the executable to `wallpaper-app/build/lpaper` with:

```sh
wallpaper-app/build.sh
```

Run from any directory with:

```sh
wallpaper-app/tools/run-c-viewer.sh
```

Deployment adds **LiakOs Wallpaper** to the application menu with a custom
wallpaper icon. Launch it by searching for “LiakOs Wallpaper” or running
`lpaper`.

For Zed/clangd, `compile_flags.txt` supplies the GTK4 and libvips include flags
from `pkg-config`. Regenerate it after changing development packages with:

```sh
wallpaper-app/tools/update-clangd-flags.sh
```

The run script compiles `lpaper` if it is missing or stale, then runs it.
Timing output is printed to the terminal with a `[timing-c]` prefix. **Apply wallpaper** runs
`wal -i <selected-image>` and then `scripts/test-pywal-gtk-colors.sh` to update
GTK3/GTK4 colors, write Thunar-specific GTK3 CSS, and configure Qt5/Qt6
palettes through qt5ct/qt6ct. It also writes a persistent Ghostty theme under
`$XDG_CONFIG_HOME/ghostty/themes/` and sets Ghostty's `theme` option in its
configuration. Deployment installs the color script under
`$XDG_DATA_HOME/liakos/scripts/` for the installed `lpaper` binary. Applying a
wallpaper also reloads a running Ghostty instance so newly opened windows use
the updated theme and sends live color sequences to its open terminal sessions.
Pywal saves the selected image and palette in `$XDG_CACHE_HOME/wal/`.
Full deployment installs the fixed `liakos_wallpaper = wal -R` command in
Wayfire's `[autostart]` section to restore that cache at the next login.
Applying a wallpaper never reads or writes `wayfire.ini`, enumerates monitors,
or runs display configuration commands. This avoids a Wayfire config reload,
which can replace a live layout set by `wlr-randr` or `kanshi` even when output
sections themselves are unchanged.

For an existing installation with an image-specific `wal -i` startup
entry, change that entry to `liakos_wallpaper = wal -R` while the Wayfire
session is stopped, or let the next full deployment update it. Updating only
the apps fixes live wallpaper application but leaves the old startup entry in
place. Clearing the Pywal cache also clears the wallpaper restored by `wal -R`.

It runs `systemctl reload --user app-com.mitchellh.ghostty.service` after
writing the theme. On Wayland, Pywal16 needs a wallpaper setter; install
`swaybg` on Arch with
`sudo pacman -S swaybg`. The app reports a missing Wayland wallpaper setter
before changing colors.

To benchmark one image resize without opening GTK:

```sh
cc -O2 -Wall -Wextra wallpaper-app/tools/resize-test.c \
  -o /tmp/liakos-resize-test $(pkg-config --cflags --libs vips)
/tmp/liakos-resize-test INPUT_IMAGE OUTPUT_IMAGE
```

Run the isolated wallpaper regression checks without opening a desktop window:

```sh
wallpaper-app/tests/run.sh
```

The checks use temporary XDG directories and stub external commands; they never
connect to the running compositor or apply a real wallpaper.
