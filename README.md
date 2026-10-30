# LiakOS

LiakOS combines the UI minimalism of a tiling window manager with the flow of a floating window manager. It is built on **Wayfire**, with a set of custom applications that tie the desktop experience together.

The main bar is built with **AGS**, and the custom applications are written in **C with GTK 4**. Wallpaper-based colors bring the bar, apps, and desktop together.

![LiakOS desktop overview](screenshots/full-screen.png)

## Application bar

The bar keeps everyday controls within reach:

- **Left:** click the LiakOS name to open a quick menu for common settings and tools.
- **Center:** switch between full date, compact date, media controls, and live audio bars. Click the dates or audio bars to change modes; media mode has its own change button.
- **Right:** a system tray for applications such as Discord, Steam, and Spotify, alongside custom bus schedule, sound, and Bluetooth controls.

### Media controls

See what's playing and control it directly from the bar with **previous, play/pause, stop, and next**. Media mode follows a playing MPRIS player automatically; click the track to switch between available players. Use the change button beside the controls to move to the audio visualizer.

![Bar media mode showing a YouTube track with previous, pause, stop, next, and mode controls](screenshots/bar-media-controls.png)

### Live audio visualizer

Turn the center of the bar into moving audio bars that follow your desktop's sound, including apps without media metadata. Bass sits at the outer edges, with higher frequencies toward the center, and the bars use the wallpaper's accent color. Click the visualizer to return to the full date.

![Wallpaper-colored audio spectrum in the center of the bar](screenshots/bar-media-vis.png)

The visualizer requires `cava` and `pipewire-pulse`. Audio capture runs only while this mode is visible.

### Quick menu

The LiakOS menu gives you access to power profiles, display brightness, screen recording, screenshots, and the desktop's settings apps.

<img src="screenshots/QuickMenu.png" alt="LiakOS quick menu with power profiles, brightness, capture tools, and settings shortcuts" width="420">

### Bus schedules

Check upcoming departures for your selected bus lines without leaving the desktop. Click the bus icon to view schedules, or right-click it to choose your lines.

The background fetcher currently supports **OASA transport in Athens, Greece**.

| Upcoming departures | Choose your bus lines |
| --- | --- |
| ![Upcoming OASA departures for selected bus lines](screenshots/buss-plugin-1.png) | ![Searchable OASA bus line selector with multiple lines selected](screenshots/buss-plugin-2.png) |

### Sound mixer

Control the master volume, audio devices, and the volume of individual running applications from the bar.

<img src="screenshots/sound-mixer.png" alt="Bar sound mixer showing the master volume slider and application audio section" width="460">

### Bluetooth

Turn Bluetooth on or off, scan for devices, and manage connections from one panel.

<img src="screenshots/bluetooth.png" alt="Bluetooth panel with a power switch, scan button, and device list" width="420">

## Custom applications

### Lpaper — wallpapers and desktop colors

Choose a wallpaper and let **Pywal16** generate a matching color scheme. Lpaper applies those colors to GTK, Qt, the custom applications, and the bar, so the desktop follows your wallpaper.

![Lpaper wallpaper picker with a wallpaper preview and thumbnail gallery](screenshots/llpaper.png)

### Keybindings

Edit your current Wayfire shortcuts through a GUI instead of modifying `wayfire.ini` by hand. Search for an action, choose **Edit shortcut**, and record the new key combination.

<img src="screenshots/keybindings.png" alt="Keybindings editor with search, category filtering, and an Edit shortcut button on each row" width="800">

### MonitorApp

Configure your monitor setup from a simple interface. After the 15-second preview, **Keep settings** saves position, resolution/refresh, scale, rotation, and enabled state in `~/.config/kanshi/config`. Kanshi restores the saved layout when the session starts or monitors reconnect. See [display persistence and migration](monitor-app/README.md) for details and limitations.

<img src="screenshots/monitor.png" alt="Display setup app showing a two-monitor layout and output configuration controls" width="800">

### Autostart

Choose which applications run when you log in, including programs such as Steam and Spotify.

<img src="screenshots/startappp-apps.png" alt="Startup application manager with a searchable app list and enable switches" width="800">

### SessionApp

A simple session menu for logging out, restarting, or powering off the system.

<img src="screenshots/session-app.png" alt="Session menu with Log Out, Restart, and Power Off actions" width="800">

### Llauncher

A simple application launcher with search as you type. Launch an application or focus its existing Wayfire window.

<img src="screenshots/llauncher.png" alt="Llauncher displaying a search field and a list of installed applications" width="760">

### Settings

A simple settings app, still growing, for displays, mouse and touchpad, sound, and system updates, with shortcuts to wallpaper and keybinding tools.

<img src="screenshots/settings-app.png" alt="LiakOS Settings overview with navigation for displays, input, sound, themes, and updates" width="800">
