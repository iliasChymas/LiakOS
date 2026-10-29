"""Run production apply code with fake commands and isolated XDG directories."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]


def executable(path, contents):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(contents)
    path.chmod(0o755)


def snapshot(path):
    stat = path.stat()
    return path.read_bytes(), stat.st_ino, stat.st_mtime_ns, stat.st_mode


with tempfile.TemporaryDirectory(prefix="lpaper-layout-") as temporary:
    base = Path(temporary)
    home = base / "home"
    config = home / "config"
    data = home / "data"
    cache = home / "cache"
    commands = base / "bin"
    for directory in (config, data, cache, commands):
        directory.mkdir(parents=True)
    env = {"HOME": str(home), "XDG_CONFIG_HOME": str(config),
           "XDG_DATA_HOME": str(data), "XDG_CACHE_HOME": str(cache),
           "PATH": f"{commands}:/usr/bin:/bin", "WAYLAND_DISPLAY": "fake-test-only",
           "XDG_SESSION_TYPE": "wayland", "XDG_CURRENT_DESKTOP": "wayfire",
           "TEST_LOG": str(base / "commands.jsonl")}
    env["DBUS_SESSION_BUS_ADDRESS"] = "test-only-no-real-session"
    env["THEME_LOG"] = str(base / "theme.jsonl")
    env["THEME_STATE"] = str(base / "theme-state")
    Path(env["THEME_STATE"]).write_text("'Breeze'")
    # No real wal, setter, display manager, service manager or terminal discovery
    # is allowed. The actual color script runs against fixture files only.
    executable(commands / "wal", '''#!/usr/bin/python3
import json, os, pathlib, sys
with open(os.environ['TEST_LOG'], 'a') as f:
    f.write(json.dumps(sys.argv[1:]) + '\\n')
if os.environ.get('WAL_FAIL'): sys.exit(7)
cache = pathlib.Path(os.environ['XDG_CACHE_HOME']) / 'wal'
cache.mkdir(exist_ok=True)
(cache / 'sequences').write_text('')
if sys.argv[1] == '-i':
    image = sys.argv[2]
    colors = {f'color{i}': '#123456' for i in range(16)}
    palette = {'wallpaper': image, 'colors': colors,
               'special': {'background': '#123456', 'foreground': '#abcdef'}}
    (cache / 'colors.json').write_text(json.dumps(palette))
    (cache / 'wal').write_text(image)
else:
    assert sys.argv[1:] == ['-R']
    assert json.loads((cache / 'colors.json').read_text())['wallpaper'] == (cache / 'wal').read_text()
''')
    for name in ("wlr-randr", "kanshi", "wayfire", "swaymsg", "swaybg", "swww", "awww", "wbg"):
        executable(commands / name, '#!/bin/sh\necho "Forbidden display command: $0" >> "$TEST_LOG"\nexit 99\n')
    executable(commands / "systemctl", '''#!/bin/sh
[ "$*" = 'reload --user app-com.mitchellh.ghostty.service' ] || exit 99
exit 0
''')
    executable(commands / "pgrep", "#!/bin/sh\nexit 1\n")
    executable(commands / "gsettings", '''#!/usr/bin/python3
import json, os, pathlib, sys
args = sys.argv[1:]
assert args[1:3] == ['org.gnome.desktop.interface', 'gtk-theme'], args
state = pathlib.Path(os.environ['THEME_STATE'])
if args[0] == 'get': print(state.read_text())
elif args[0] == 'writable': print('true')
elif args[0] == 'set':
    # Notifications must happen after both GTK palettes and the Thunar CSS
    # have been committed, so clients read the new palette on refresh.
    config = pathlib.Path(os.environ['XDG_CONFIG_HOME'])
    for version in ('gtk-3.0', 'gtk-4.0'):
        assert '#123456' in (config / version / 'colors.css').read_text()
    assert '#123456' in (config / 'gtk-3.0/thunar.css').read_text()
    with open(os.environ['THEME_LOG'], 'a') as f:
        f.write(json.dumps(args) + '\\n')
    if os.environ.get('THEME_FAIL') and args[3] == 'Adwaita-dark': sys.exit(1)
    state.write_text(args[3] if args[3].startswith("'") else "'" + args[3] + "'")
else: raise AssertionError(args)
''')
    color_script = data / "liakos/scripts/test-pywal-gtk-colors.sh"
    color_script.parent.mkdir(parents=True)
    shutil.copyfile(ROOT / "scripts/test-pywal-gtk-colors.sh", color_script)
    color_script.chmod(0o755)
    for toolkit in ("gtk-3.0", "gtk-4.0"):
        directory = config / toolkit
        directory.mkdir()
        (directory / "colors.css").write_text("@define-color theme_bg_color #000000;\n")
    palette_inodes = {config / version / 'colors.css': (config / version / 'colors.css').stat().st_ino
                      for version in ('gtk-3.0', 'gtk-4.0')}

    # Deliberately different persistent output settings and live-layout fixture:
    # a config reload would replace the latter even if INI bytes were preserved.
    ini = """# Preserve all output and unrelated settings verbatim.
[output:DP-3]
mode = 2560x1440@144000
position = -1440,120
scale = 1.25
transform = 90
[output:HDMI-A-1]
mode = off
[autostart]
liakos_display_layout = wlr-randr --output DP-3 --pos -1440,120
liakos_wallpaper = wal -i '/old wallpaper.jpg'
outputs = kanshi
[core]
xwayland = true
"""
    layout = base / "live-layout.json"
    layout.write_text(json.dumps({"DP-3": {"mode": "1920x1080@71.910Hz",
        "position": [-1080, 40], "scale": 1.5, "transform": "270"},
        "HDMI-A-1": {"enabled": False}}))
    protected = [layout, config / "wayfire.ini", config / "wayfire/wayfire.ini",
                 config / "custom/compositor.ini", config / "kanshi/config"]
    for path in protected[1:]:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(ini)
        path.chmod(0o640)
    before = {path: snapshot(path) for path in protected}

    def apply(image, extra_env=None, expected="Wallpaper applied"):
        subprocess.run([sys.argv[1], image, expected], cwd=base,
                       env=env | (extra_env or {}), check=True, stdout=subprocess.DEVNULL)
        for path in protected:
            assert snapshot(path) == before[path], f"Wallpaper apply modified {path}"
        for path, inode in palette_inodes.items():
            assert path.stat().st_ino == inode, f"Wallpaper apply broke GTK's file watch: {path}"
        assert not list(config.rglob('*.liakos-*')), "Unexpected compositor backup/temp files"

    images = [str(base / "wall ' one;$(touch forbidden).jpg"), str(base / "other wallpaper.jpg")]
    for image in images:
        apply(image)
        assert json.loads((cache / "wal/colors.json").read_text())["wallpaper"] == image
    apply(images[0], {"LIAKOS_WAYFIRE_CONFIG": str(protected[3])})
    # Exercise the nested-config fallback used by the old writer as well.
    protected[1].unlink()
    before.pop(protected.pop(1))
    apply(images[1])
    notifications = [json.loads(line)[3] for line in Path(env["THEME_LOG"]).read_text().splitlines()]
    assert notifications == ['Adwaita-dark', "'Breeze'"] * 4, notifications
    assert Path(env["THEME_STATE"]).read_text() == "'Breeze'"
    # A failed notification is nonfatal and still restores the original theme.
    apply(images[1], {"THEME_FAIL": "1"})
    assert Path(env["THEME_STATE"]).read_text() == "'Breeze'"
    apply(images[0], {"WAL_FAIL": "1"}, expected="Child process exited with code 7")
    assert json.loads((cache / "wal/colors.json").read_text())["wallpaper"] == images[1]
    color_script.write_text("#!/bin/sh\nexit 8\n")
    apply(images[0], expected="Child process exited with code 8")
    # Verify the fixed deployment entry replaces an old image-specific entry
    # and remains stable for subsequent applications. Only a temporary INI is edited.
    deployed = base / "deploy.ini"
    deployed.write_text(ini)
    subprocess.run(["sh", "-c", '. "$1"; set_wayfire_option "$2" autostart liakos_wallpaper "wal -R"',
                    "test", str(ROOT / "deployment/lib.sh"), str(deployed)], env=env, check=True)
    assert deployed.read_text() == ini.replace("wal -i '/old wallpaper.jpg'", "wal -R")
    assert "autostart liakos_wallpaper 'wal -R'" in (ROOT / "deployment/deploy.sh").read_text()
    subprocess.run([str(commands / "wal"), "-R"], env=env, check=True)
    calls = [json.loads(line) for line in Path(env["TEST_LOG"]).read_text().splitlines()]
    assert calls == [["-i", images[0]], ["-i", images[1]], ["-i", images[0]],
                     ["-i", images[1]], ["-i", images[1]], ["-i", images[0]], ["-i", images[0]], ["-R"]], calls
    assert not (base / "forbidden").exists(), "Image path was interpreted as shell code"
    assert (config / "ghostty/themes/liakos-pywal").exists()
    assert (config / "qt6ct/colors/liakos-pywal.conf").exists()
print("PASS: repeated applies and failures preserve compositor files and layout; startup uses cached wallpaper")
