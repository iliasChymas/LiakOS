# LiakOs Wallpapers (C / GTK4)

The viewer reads `~/Pictures/wallpapers`, provides Previous/Next navigation,
and shows a vertically scrollable five-column thumbnail grid. It generates
256×144 thumbnails in the background with libvips and keeps them in memory;
it does not create a thumbnail cache on disk.

Run from any directory with:

```sh
wallpaper-app/tools/run-c-viewer.sh
```

For Zed/clangd, `compile_flags.txt` supplies the GTK4 and libvips include flags
from `pkg-config`. Regenerate it after changing development packages with:

```sh
wallpaper-app/tools/update-clangd-flags.sh
```

The script compiles the C application with `-O2` and runs it. Timing output is
printed to the terminal with a `[timing-c]` prefix. **Apply wallpaper** runs
`wal -i <selected-image>` and then `scripts/test-pywal-gtk-colors.sh`.

To benchmark one image resize without opening GTK:

```sh
cc -O2 -Wall -Wextra wallpaper-app/tools/resize-test.c \
  -o /tmp/liakos-resize-test $(pkg-config --cflags --libs vips)
/tmp/liakos-resize-test INPUT_IMAGE OUTPUT_IMAGE
```
