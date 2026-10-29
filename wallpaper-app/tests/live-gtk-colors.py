"""Exercise the production palette writer against a running GTK3 color watcher.

Run with the system Python (PyGObject), a graphical session and KDE's
colorreload-gtk-module. All files and helper commands are isolated.
"""
import json
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]

with tempfile.TemporaryDirectory(prefix="liakos-live-gtk-") as directory:
    base = Path(directory)
    os.environ.update(XDG_CONFIG_HOME=str(base / "config"),
                      XDG_CACHE_HOME=str(base / "cache"),
                      GSETTINGS_BACKEND="memory",
                      GTK_MODULES="colorreload-gtk-module")
    for version in ("gtk-3.0", "gtk-4.0"):
        folder = base / "config" / version
        folder.mkdir(parents=True)
        (folder / "colors.css").write_text("@define-color theme_bg_color_breeze #112233;\n")
        (folder / "gtk.css").write_text(
            "@import 'colors.css'; window {background-color: @theme_bg_color_breeze;}\n")
    cache = base / "cache/wal"
    cache.mkdir(parents=True)
    (cache / "sequences").write_text("")
    commands = base / "bin"
    commands.mkdir()
    for name in ("systemctl", "pgrep"):
        command = commands / name
        command.write_text("#!/bin/sh\nexit 0\n")
        command.chmod(0o755)

    import gi
    gi.require_version("Gtk", "3.0")
    from gi.repository import Gtk, GLib

    window = Gtk.Window()
    window.show()

    def background():
        color = window.get_style_context().get_background_color(Gtk.StateFlags.NORMAL)
        return tuple(round(component * 255) for component in (color.red, color.green, color.blue))

    assert background() == (17, 34, 51)
    env = dict(os.environ, PATH=f"{commands}:/usr/bin:/bin")
    # No real desktop notifications or service/terminal changes during the test.
    env.pop("DBUS_SESSION_BUS_ADDRESS", None)
    for hex_color, rgb in (("#aabbcc", (170, 187, 204)), ("#445566", (68, 85, 102))):
        palette = {"colors": {f"color{i}": hex_color for i in range(16)},
                   "special": {"background": hex_color, "foreground": "#ffffff"}}
        (cache / "colors.json").write_text(json.dumps(palette))
        subprocess.run(["bash", str(ROOT / "scripts/test-pywal-gtk-colors.sh")],
                       env=env, check=True, stdout=subprocess.DEVNULL)
        loop = GLib.MainLoop()
        GLib.timeout_add(700, lambda: (loop.quit(), False)[1])
        loop.run()
        assert background() == rgb, (background(), rgb)
    window.destroy()
print("PASS: running GTK3 app receives two successive production palette updates")
