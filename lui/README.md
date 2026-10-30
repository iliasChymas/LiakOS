# LUI — LiakOS UI

LUI is the shared C/GTK 4 presentation library used by Settings, Autostart,
Keybindings, Displays, Launcher, Session, and Wallpapers. It preserves their
original appearance through library-owned profiles. AGS is independent.

## Build and use

Development dependencies: a C compiler, `ar`, `pkg-config`, GTK >= 4.12,
JSON-GLib, and `glib-compile-resources` (GLib development tools).

```sh
./lui/build.sh                  # lui/build/liblui.a
./autostart-app/build.sh        # builds and links LUI automatically
./lui/build-gallery.sh
./lui/build/lui-gallery         # interactive component gallery
./lui/tests/run.sh              # isolated GTK tests using Xvfb and D-Bus
./settings-app/tests/run.sh     # sidebar action and accessibility regression
```

All seven app build scripts link the static library and its embedded styles.
There are no extra runtime stylesheet files or shared libraries to install.
The existing deployment installer rebuilds the consumers and copies their
binaries as before. Repository `run.sh` launchers also detect changed LUI sources,
headers, resources, and styles and rebuild their app when necessary. Installed
binaries must be rebuilt/reinstalled to receive library changes.

Builds use a temporary directory and replace the archive atomically, allowing
separate apps to build concurrently.

## Application boundary

Call `lui_init(profile)` on the GTK main thread after opening a display (normally
at the beginning of the application's activate callback). Initialization is
idempotent; choose one profile per process. Call `lui_shutdown()` after
`g_application_run()` returns. The library owns and releases its CSS provider,
file monitors, and pending debounce timer. It does not execute application
commands or change desktop configuration.

```c
#include "lui/lui.h"

/* In the activate callback: */
lui_init(LUI_STYLE_AUTOSTART);
GtkWidget *page = lui_page_new();
gtk_box_append(GTK_BOX(page),
    lui_page_header_new("Startup applications", "Choose what starts at login."));
GtkWidget *save = lui_button_new("Save", LUI_BUTTON_PRIMARY);
gtk_box_append(GTK_BOX(page),
    lui_card_new(lui_setting_row_new("Example", "Description", save)));
g_signal_connect(save, "clicked", G_CALLBACK(on_save), app_state);
```

Constructors return GTK widgets with normal GTK floating-reference ownership;
parent containers take ownership. GTK setters, signals, and accessibility APIs
remain available. Text is plain text, not markup.

Shared components include text roles, buttons and accessible icon buttons,
page containers/headers, text groups, setting rows, cards, list rows, action
tiles/bars, search entries, grids, and boxes. `lui_box_new(orientation, -1)` uses
the standard spacing; an explicit spacing is available for specialized layouts.
`lui_grid_new()` preserves GTK's original spacing in native apps; apps attach
children and set specialized spacing with GTK APIs.
Custom drawing can use `lui_color()` and `lui_color_on()` rather than choosing
colors independently. The display arrangement preview does this.

Use `lui_text_group_new_ellipsized()` for single-line application names and
descriptions that must shrink within a row. Use `lui_icon_button_set_label()`
when an icon button's action changes; it updates both the tooltip and the
screen-reader label.

Application code retains its models, signals, asynchronous work, configuration
storage, and specialized widgets such as the monitor canvas and image preview.

## Change appearance centrally

- `styles/common.css` and `styles/components.css`: defaults for the component gallery.
- `lui.h`: shared spacing constants and component API.
- `lui.c`: component construction, palette defaults, contrast handling, and updates.
- Other `styles/*.css`: the native apps' original typography, controls, cards,
  navigation, overlays, and specialized layouts, using library color names.
- The `LuiLayout` table in `lui.c`: original page margins and component spacing.

Styles are embedded with GResource. Native apps load their appearance profile
without gallery overrides. Wallpapers keeps its original system GTK styling.
Component construction and all profile rules remain in LUI. The provider uses
GTK's application priority; explicit user GTK CSS retains GTK's normal higher
priority. No CSS or palette service is owned by an app.

## Wallpaper palette

LUI reads `$XDG_CACHE_HOME/wal/colors.json`, falling back to GLib's standard user
cache directory. It never creates or writes palette files. Colors map from
`special.background`, `special.foreground`, and `colors.color0/2/4/5/8` to shared
background, foreground, surface, accent, secondary, tertiary, muted, and border
roles. Only six-digit hexadecimal strings are accepted.

Missing palettes use defaults. Valid partial palettes use defaults for missing
or malformed members. Invalid JSON or a malformed root keeps the last working
palette, or defaults during initial startup. Native profiles preserve the apps'
original fallback colors and palette mapping. The gallery uses additional
contrast handling for text and action buttons.

Directory monitors handle initial creation, atomic file replacement, directory
replacement, and deletion. Events are debounced, then the shared stylesheet is
reloaded and windows are queued for redraw. Apps do not parse the palette,
create theme monitors, or generate CSS. Lpaper still invokes the desktop's
wallpaper/export tooling when applying a wallpaper; LUI owns the native apps'
presentation, while those exports continue to color other desktop software.

## Validation

The LUI tests exercise constructors and GTK parenting, callbacks, computed text
colors, all style profiles with fatal GTK warnings, palette validation, live
updates, missing directories, atomic replacement, deletion, and shutdown. They
isolate cache/config files and use an Xvfb display. App regression tests remain
in their existing directories; session tests require a Wayland session with
layer-shell support.
