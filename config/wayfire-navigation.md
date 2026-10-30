Wayfire navigation (verified against upstream v0.11.0)

| Shortcut | Action |
| --- | --- |
| Super+O / Super+Ctrl+O | Focus next / previous screen |
| Super+Shift+O / Super+Ctrl+Shift+O | Move focused window to next / previous screen and follow |
| Super+Ctrl+arrows | Switch adjacent workspace on current screen |
| Super+Ctrl+Shift+arrows | Move focused window to adjacent workspace and follow |
| Super+1…9 | Switch numbered workspace on current screen |
| Super+Shift+1…9 | Send focused window to numbered workspace, stay here |
| Super+Ctrl+Shift+1…9 | Move focused window to numbered workspace and follow |

Numbers run across rows: 1–3, 4–6, 7–9 with the shipped 3×3 grid.
These use vswitch, not wsets (which manages whole workspace sets). Expo's
select_workspace_N only selects within an active overview; it is not a global
workspace shortcut. The existing Super+arrow bindings tile windows via grid.
Adjacent workspace navigation stops at grid edges by default.

Investigation, 2026-10-30

Repository and ~/.config/wayfire.ini both enable move, oswitch and vswitch.
Installed Wayfire and wf-config are 0.11.0-1.1; Wayfire reports
0.11.0-d3990237, wlroots 0.20.2. All three plugin libraries and metadata are
installed. Existing oswitch and directional vswitch option names match upstream;
no conflicting explicit keyboard chord was found for these actions in either
config. No missing-plugin diagnosis is justified for this machine.

Confirmed gaps: neither config defines numbered vswitch bindings or send-only
workspace actions. Existing deployment only copies defaults for a new config;
it did not migrate navigation options into existing configs. Deployment now adds
missing navigation entries, preserving explicit custom/disabled bindings and
comments, and warns if required plugins were disabled. Existing grid dimensions
are preserved; choose numbers within your configured grid. New shortcuts appear
in lkeybinds through its existing generic KEY_ parser.

Runtime limitation: this inspection ran in KDE (XDG_CURRENT_DESKTOP=KDE), with no
Wayfire process, WAYFIRE_SOCKET or runtime Wayfire socket. No useful current
Wayfire plugin errors appeared in the user journal. The reported failure of the
already-correct output shortcuts remains unconfirmed; these config changes do
not establish a compositor bug fix. No live config was edited or deployment run.

Manual verification after reviewing and applying the change in a Wayfire session:

1. Confirm the running compositor's actual config path (including any -c argument
   or WAYFIRE_CONFIG_FILE override) and that oswitch/vswitch loaded successfully.
2. With two enabled outputs, focus a normal application, press Super+O, then
   Super+Ctrl+O. Focus should cycle and return. Repeat with Shift; the window
   should move and focus should follow. A single enabled output cannot move it.
3. On one screen, send a normal window with Super+Shift+5: remain on the current
   workspace, then Super+5 should reveal it on workspace 5 of that same screen.
   Super+Ctrl+Shift+1 should bring it to workspace 1 and follow it.
4. Verify directional navigation away from a grid edge, then tiling with
   Super+arrows. Test Super+left-drag across the physical output boundary.
5. If existing output shortcuts still fail, capture Wayfire startup/plugin logs,
   enabled output layout and input-grab/shortcuts-inhibit state. Test outside
   applications that inhibit compositor shortcuts. Do not infer a missing plugin
   solely from a failed keypress.

Primary sources:

- [oswitch metadata](https://github.com/WayfireWM/wayfire/blob/v0.11.0/metadata/oswitch.xml)
- [oswitch implementation](https://github.com/WayfireWM/wayfire/blob/v0.11.0/plugins/single_plugins/oswitch.cpp)
- [vswitch metadata](https://github.com/WayfireWM/wayfire/blob/v0.11.0/metadata/vswitch.xml)
- [numbering and send/follow implementation](https://github.com/WayfireWM/wayfire/blob/v0.11.0/plugins/vswitch/wayfire/plugins/vswitch.hpp)
- [move metadata](https://github.com/WayfireWM/wayfire/blob/v0.11.0/metadata/move.xml)
