import app from "ags/gtk4/app"
import { For, createBinding } from "ags"
import { Astal } from "ags/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import Gio from "gi://Gio"
import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import Gtk4LayerShell from "gi://Gtk4LayerShell?version=1.0"
import Pango from "gi://Pango?version=1.0"
import AstalTray from "gi://AstalTray?version=0.1"
import AstalWp from "gi://AstalWp?version=0.1"
import AstalBluetooth from "gi://AstalBluetooth?version=0.1"
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1"

const ICON_SIZE=18
const DEBUG_LOG_PATH = "/tmp/liakos-bar-debug.log"

function debugLog(message: string) {
  const timestamp = GLib.DateTime.new_now_local().format("%Y-%m-%d %H:%M:%S") || "unknown-time"
  try {
    const stream = Gio.File.new_for_path(DEBUG_LOG_PATH).append_to(Gio.FileCreateFlags.NONE, null)
    const [written] = stream.write_all(new TextEncoder().encode(`[${timestamp}] ${message}\n`), null)
    if (!written) printerr(`Could not append to ${DEBUG_LOG_PATH}`)
    stream.close(null)
  } catch (error) {
    printerr(`Could not write ${DEBUG_LOG_PATH}: ${error}`)
  }
}

function resetDebugLog() {
  const timestamp = GLib.DateTime.new_now_local().format("%Y-%m-%d %H:%M:%S") || "unknown-time"
  try {
    const written = GLib.file_set_contents(DEBUG_LOG_PATH, `=== LiakOS bar debug session ${timestamp} ===\n`)
    if (!written) printerr(`Could not reset ${DEBUG_LOG_PATH}`)
  } catch (error) {
    printerr(`Could not reset ${DEBUG_LOG_PATH}: ${error}`)
  }
}

const tray = AstalTray.Tray.get_default()
const wireplumber = AstalWp.Wp.get_default()
const audio = wireplumber.audio
const bluetooth = AstalBluetooth.Bluetooth.get_default()

type Palette = {
  background: string
  foreground: string
  accent: string
  secondary: string
  tertiary: string
  surface: string
}

const fallbackPalette: Palette = {
  background: "#181b24",
  foreground: "#f3f4f6",
  accent: "#8aa4ff",
  secondary: "#d3869b",
  tertiary: "#a3be8c",
  surface: "#202431",
}

let walMonitor: Gio.FileMonitor | null = null
let walReloadSource = 0

function validColor(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value) ? value : fallback
}

function withAlpha(hex: string, alpha: number) {
  const value = hex.slice(1)
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function barCss(palette: Palette) {
  return `
    window.top-bar {
      background: transparent;
    }

    .bar {
      min-height: 30px;
      margin: 8px 12px 0;
      padding: 0 10px;
      border: 1px solid ${withAlpha(palette.foreground, 0.10)};
      border-radius: 14px;
      background: ${withAlpha(palette.background, 0.94)};
      color: ${palette.foreground};
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.28);
    }

    .brand {
      padding: 0 8px;
      color: ${palette.accent};
      font-size: 12px;
      font-weight: 700;
    }

    .system-tray {
      padding: 0 2px;
    }

    .audio-button {
      min-width: 28px;
      min-height: 26px;
      padding: 0 5px;
      border-radius: 9px;
      color: ${palette.foreground};
    }

    .audio-button:hover {
      background: ${withAlpha(palette.accent, 0.32)};
    }

    .audio-button:checked {
      background: ${withAlpha(palette.accent, 0.28)};
      color: ${palette.accent};
    }

    .date-button {
      min-height: 26px;
      padding: 0 8px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: ${palette.foreground};
      font-size: 12px;
    }

    .date-button:hover {
      background: ${withAlpha(palette.secondary, 0.28)};
    }

    .utility-button {
      min-width: 28px;
      min-height: 26px;
      padding: 0 5px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: ${palette.foreground};
    }

    .utility-button:hover {
      background: ${withAlpha(palette.accent, 0.28)};
    }

    .brand-button {
      padding: 0 8px;
      border: 0;
      background: transparent;
      color: ${palette.accent};
      font-size: 12px;
      font-weight: 700;
    }

    .brand-button:hover {
      background: ${withAlpha(palette.accent, 0.16)};
    }

    .brand-button.hover-suppressed:hover {
      background: transparent;
    }

    .recording-indicator {
      min-width: 20px;
      min-height: 22px;
      padding: 0 4px;
      border: 0;
      background: transparent;
      color: #ff5a66;
      font-size: 14px;
      font-weight: 900;
    }

    .recording-indicator:hover {
      background: ${withAlpha("#ff5a66", 0.12)};
    }

    .utility-popover > contents {
      padding: 12px;
      border: 1px solid ${withAlpha(palette.foreground, 0.12)};
      border-radius: 12px;
      background: ${palette.background};
      color: ${palette.foreground};
    }

    .utility-panel {
      min-width: 340px;
      padding: 2px;
      color: ${palette.foreground};
    }

    .utility-title {
      margin-bottom: 1px;
      color: ${palette.accent};
      font-weight: 700;
    }

    .quick-access-button {
      min-height: 64px;
      padding: 6px;
      border-radius: 9px;
      background: ${withAlpha(palette.surface, 0.82)};
      color: ${palette.foreground};
    }

    .quick-access-button:hover {
      background: ${withAlpha(palette.accent, 0.22)};
    }

    .capture-button {
      min-height: 38px;
      border-radius: 8px;
    }

    .utility-muted {
      color: ${withAlpha(palette.foreground, 0.68)};
      font-size: 11px;
    }

    .recording-window {
      min-width: 380px;
      padding: 18px;
      color: ${palette.foreground};
      background: ${palette.background};
    }

    .recording-window-title {
      color: ${palette.accent};
      font-size: 17px;
      font-weight: 700;
    }

    .audio-popover {
      background: transparent;
      border: 0;
      box-shadow: none;
      padding: 0;
    }

    popover.audio-popover > contents {
      padding: 0;
      border: 0;
      border-radius: 14px;
      background: transparent;
      box-shadow: none;
    }

    .audio-panel {
      min-width: 360px;
      padding: 14px;
      border: 1px solid ${withAlpha(palette.foreground, 0.12)};
      border-radius: 14px;
      background: ${palette.background};
      color: ${palette.foreground};
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }

    .audio-title {
      font-size: 15px;
      font-weight: 700;
      color: ${palette.accent};
    }

    .transit-result {
      color: ${palette.foreground};
      font-size: 13px;
    }

    .transit-kicker {
      color: ${palette.secondary};
      font-size: 10px;
      font-weight: 750;
      letter-spacing: 1px;
    }

    .transit-line-title {
      color: ${palette.foreground};
      font-size: 16px;
      font-weight: 750;
    }

    .transit-card-row {
      margin-top: 4px;
    }

    .transit-card {
      min-width: 88px;
      min-height: 76px;
      padding: 10px;
      border: 1px solid ${withAlpha(palette.accent, 0.22)};
      border-radius: 12px;
      background: ${withAlpha(palette.surface, 0.94)};
    }

    .transit-card:first-child {
      border-color: ${withAlpha(palette.accent, 0.42)};
      background: ${withAlpha(palette.accent, 0.14)};
    }

    .transit-card-label {
      color: ${palette.secondary};
      font-size: 10px;
      font-weight: 700;
    }

    .transit-card-time {
      color: ${palette.foreground};
      font-size: 18px;
      font-weight: 750;
      font-variant-numeric: tabular-nums;
    }

    .transit-picker {
      min-width: 340px;
    }

    .transit-choose {
      min-height: 36px;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      color: ${palette.foreground};
    }

    .transit-choose > button {
      padding: 0 10px;
      border: 1px solid ${withAlpha(palette.accent, 0.28)};
      border-radius: 9px;
      background: ${withAlpha(palette.surface, 0.94)};
      color: ${palette.foreground};
      font-weight: 650;
      box-shadow: none;
    }

    .transit-choose > button:hover {
      background: ${withAlpha(palette.accent, 0.2)};
    }

    .transit-option-row {
      padding: 3px 5px;
      border-radius: 8px;
      background: transparent;
      color: ${palette.foreground};
    }

    .transit-option-row:hover {
      background: ${withAlpha(palette.accent, 0.12)};
    }

    .transit-option-row.transit-option-selected {
      background: ${withAlpha(palette.accent, 0.24)};
      color: ${palette.accent};
    }

    .transit-option-row check {
      border: 1px solid ${withAlpha(palette.foreground, 0.35)};
      border-radius: 5px;
      background: ${withAlpha(palette.surface, 0.9)};
    }

    .transit-option-row check:checked {
      border-color: ${palette.accent};
      background: ${palette.accent};
      color: ${palette.background};
    }

    .transit-option-row label {
      color: inherit;
    }

    .transit-search {
      min-height: 36px;
      padding: 0 10px;
      border: 1px solid ${withAlpha(palette.accent, 0.28)};
      border-radius: 9px;
      background: ${withAlpha(palette.surface, 0.94)};
      color: ${palette.foreground};
      caret-color: ${palette.accent};
      selection-background-color: ${withAlpha(palette.accent, 0.55)};
    }

    .transit-search:focus {
      border-color: ${palette.accent};
      box-shadow: 0 0 0 2px ${withAlpha(palette.accent, 0.18)};
    }

    .transit-selected-label {
      color: ${palette.secondary};
      font-size: 12px;
      font-weight: 700;
    }

    popover.menu > contents {
      border: 1px solid ${withAlpha(palette.accent, 0.3)};
      border-radius: 11px;
      background: ${palette.background};
      color: ${palette.foreground};
    }

    popover.menu listview,
    popover.menu row {
      background: ${palette.background};
      color: ${palette.foreground};
    }

    popover.menu row:hover,
    popover.menu row:selected {
      background: ${withAlpha(palette.accent, 0.32)};
      color: ${palette.foreground};
    }

    .transit-entry {
      min-height: 34px;
      padding: 0 10px;
      border: 1px solid ${withAlpha(palette.accent, 0.32)};
      border-radius: 8px;
      background: ${withAlpha(palette.surface, 0.92)};
      color: ${palette.foreground};
      caret-color: ${palette.accent};
      selection-background-color: ${withAlpha(palette.accent, 0.55)};
    }

    .transit-entry:focus {
      border-color: ${palette.accent};
      box-shadow: 0 0 0 2px ${withAlpha(palette.accent, 0.18)};
    }

    .transit-save {
      min-height: 34px;
      padding: 0 12px;
      border: 1px solid ${withAlpha(palette.accent, 0.38)};
      border-radius: 8px;
      background: ${withAlpha(palette.accent, 0.20)};
      color: ${palette.foreground};
      font-weight: 650;
    }

    .transit-save:hover {
      background: ${withAlpha(palette.accent, 0.38)};
    }

    .audio-section-title {
      margin: 8px 0 2px;
      color: ${palette.secondary};
      font-size: 11px;
      font-weight: 700;
    }

    .audio-stream-row {
      min-height: 50px;
      padding: 4px 2px;
      border-bottom: 1px solid ${withAlpha(palette.foreground, 0.08)};
    }

    .audio-master-row {
      padding: 6px 8px;
      border: 1px solid ${withAlpha(palette.accent, 0.2)};
      border-radius: 10px;
      background: ${withAlpha(palette.accent, 0.08)};
    }

    .audio-volume-scale trough {
      min-height: 6px;
      border-radius: 999px;
      background: ${withAlpha(palette.foreground, 0.16)};
    }

    .audio-volume-scale highlight {
      min-height: 6px;
      border-radius: 999px;
      background: ${palette.accent};
    }

    .audio-volume-scale slider {
      min-width: 14px;
      min-height: 14px;
      border: 2px solid ${palette.foreground};
      border-radius: 999px;
      background: ${palette.accent};
    }

    .audio-device-row {
      min-height: 42px;
      padding: 0 10px;
      border-radius: 8px;
      background: transparent;
      color: ${palette.foreground};
    }

    .audio-device-row:hover {
      background: ${withAlpha(palette.accent, 0.34)};
    }

    .audio-device-row.selected {
      color: ${palette.accent};
      background: ${withAlpha(palette.accent, 0.14)};
    }

    .audio-muted {
      color: ${palette.accent};
    }

    .radio-panel {
      min-width: 320px;
      max-width: 380px;
      padding: 14px;
      border: 1px solid ${withAlpha(palette.foreground, 0.12)};
      border-radius: 14px;
      background: ${palette.background};
      color: ${palette.foreground};
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }

    .radio-row {
      min-height: 42px;
      padding: 0 8px;
      border-radius: 8px;
      background: transparent;
      color: ${palette.foreground};
    }

    .radio-row switch:checked {
      background: ${withAlpha(palette.accent, 0.45)};
    }

    .radio-row switch:checked slider {
      background: ${palette.accent};
    }

    button.radio-row:hover {
      background: ${withAlpha(palette.accent, 0.34)};
    }

    .radio-status {
      color: ${palette.tertiary};
      font-size: 11px;
    }

    .tray-item {
      min-width: 20px;
      min-height: 20px;
      padding: 0;
      border-radius: 9px;
      background: transparent;
      color: ${palette.foreground};
    }

    .tray-item image {
      transition: -gtk-icon-transform 140ms ease-out;
    }

    .tray-item:hover image {
      -gtk-icon-transform: scale(1.2);
    }

    .tray-item:hover {
      background: ${withAlpha(palette.accent, 0.28)};
      color: ${palette.foreground};
    }

    popover > contents {
      padding: 6px;
      border: 1px solid ${withAlpha(palette.foreground, 0.12)};
      border-radius: 12px;
      background: ${palette.surface};
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }

    popover menuitem {
      min-height: 30px;
      padding: 0 10px;
      border-radius: 7px;
      color: ${palette.foreground};
    }

    popover menuitem:hover {
      background: ${withAlpha(palette.accent, 0.38)};
      color: ${palette.foreground};
    }

    popover.tray-menu > contents {
      padding: 6px;
      border: 1px solid ${withAlpha(palette.accent, 0.3)};
      border-radius: 12px;
      background: ${palette.surface};
    }

    popover.tray-menu modelbutton {
      min-height: 32px;
      padding: 0 10px;
      border-radius: 8px;
      color: ${palette.foreground};
    }

    popover.tray-menu modelbutton:hover,
    popover.tray-menu modelbutton:focus {
      background: ${withAlpha(palette.accent, 0.58)};
      color: ${palette.foreground};
    }

    popover.tray-menu modelbutton:checked {
      background: ${withAlpha(palette.secondary, 0.28)};
    }

    popover.tray-menu separator {
      background: ${withAlpha(palette.accent, 0.35)};
    }
  `
}

function paletteFromWal(path: string): Palette | null {
  try {
    const [success, contents] = Gio.File.new_for_path(path).load_contents(null)
    if (!success) return null

    const data = JSON.parse(new TextDecoder().decode(contents))
    const background = validColor(data.special?.background, fallbackPalette.background)
    return {
      background,
      foreground: validColor(data.special?.foreground, fallbackPalette.foreground),
      accent: validColor(data.colors?.color4, fallbackPalette.accent),
      secondary: validColor(data.colors?.color5, fallbackPalette.secondary),
      tertiary: validColor(data.colors?.color2, fallbackPalette.tertiary),
      surface: validColor(data.colors?.color0, background),
    }
  } catch (_error) {
    return null
  }
}

function openTrayMenu(button: Gtk.Button, item: AstalTray.TrayItem) {
  const model = item.menuModel
  if (!model) return

  const menu = Gtk.PopoverMenu.new_from_model(model)
  menu.add_css_class("tray-menu")
  const updateActionGroup = () => {
    button.insert_action_group("dbusmenu", item.actionGroup)
    menu.insert_action_group("dbusmenu", item.actionGroup)
  }

  const menuModelHandler = item.connect("notify::menu-model", () => {
    menu.set_menu_model(item.menuModel)
  })
  const actionGroupHandler = item.connect("notify::action-group", updateActionGroup)

  menu.set_has_arrow(false)
  // Keep the popover visually separated from the rounded bar surface.
  menu.set_offset(0, 8)
  menu.set_parent(button)
  updateActionGroup()
  menu.connect("closed", () => {
    item.disconnect(menuModelHandler)
    item.disconnect(actionGroupHandler)
    menu.unparent()
  })
  item.about_to_show()
  // Some tray apps (including Windscribe) rebuild their DBusMenu inside
  // AboutToShow. Let the queued layout/action updates reach AstalTray before
  // Gtk.PopoverMenu is shown, so its rows reference the current item IDs.
  GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
    if (menu.get_parent()) menu.popup()
    return GLib.SOURCE_REMOVE
  })
}
function TrayItem({ item }: { item: AstalTray.TrayItem }) {
  return (
    <button
      class="tray-item"
      tooltipText={createBinding(item, "tooltipText")}
    >
      <image gicon={createBinding(item, "gicon")} pixelSize={ICON_SIZE} />
      <Gtk.GestureClick
        button={1}
        onPressed={(gesture, _presses, x, y) => {
          if (item.isMenu) {
            const widget = gesture.get_widget()
            if (widget) openTrayMenu(widget as Gtk.Button, item)
            return
          }

          item.activate(Math.round(x), Math.round(y))
        }}
      />
      <Gtk.GestureClick
        button={3}
        onPressed={(button, _presses, _x, _y) => {
          const widget = button.get_widget()
          if (widget) openTrayMenu(widget as Gtk.Button, item)
        }}
      />
    </button>
  )
}

function SystemTray() {
  return (
    <box class="system-tray" spacing={4}>
      <For each={createBinding(tray, "items")}>
        {(item: AstalTray.TrayItem) => <TrayItem item={item} />}
      </For>
    </box>
  )
}

function DateControl() {
  const button = new Gtk.Button({ tooltip_text: "Click to show a compact date" })
  const label = new Gtk.Label({})
  button.set_child(label)
  button.add_css_class("date-button")
  let compact = false
  const update = () => {
    const now = GLib.DateTime.new_now_local()
    label.set_label(now.format(compact ? "%d %b" : "%A, %B %d, %Y") || "")
  }
  button.connect("clicked", () => {
    compact = !compact
    button.set_tooltip_text(compact ? "Click to show the full date" : "Click to show a compact date")
    update()
  })
  GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
    update()
    return GLib.SOURCE_CONTINUE
  })
  update()
  return button
}

type CommandResult = { ok: boolean; stdout: string; stderr: string }

function runCommand(
  argv: string[],
  callback: (result: CommandResult) => void,
  { userInstalledApp = false }: { userInstalledApp?: boolean } = {},
) {
  debugLog(`command start argv=${JSON.stringify(argv)}`)
  try {
    const launcher = new Gio.SubprocessLauncher({
      flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
    })
    if (userInstalledApp) {
      // The installer uses ~/.local/bin, which need not be in AGS's session PATH.
      const binDir = GLib.build_filenamev([GLib.get_home_dir(), ".local", "bin"])
      const installedApp = GLib.build_filenamev([binDir, argv[0]])
      if (GLib.file_test(installedApp, GLib.FileTest.IS_EXECUTABLE)) {
        argv = [installedApp, ...argv.slice(1)]
      }
      // Gio searches the parent's PATH for bare argv[0]; the absolute path above
      // handles that. Pass the augmented PATH on for the app's own launchers too.
      const path = GLib.getenv("PATH")
      launcher.setenv("PATH", path ? `${binDir}:${path}` : `${binDir}:/usr/local/bin:/usr/bin:/bin`, true)
    }
    const process = launcher.spawnv(argv)
    process.communicate_utf8_async(null, null, (source, result) => {
      try {
        const process = source as Gio.Subprocess
        const [, stdout, stderr] = process.communicate_utf8_finish(result)
        const ok = process.get_successful()
        debugLog(`command exit ok=${ok} argv=${JSON.stringify(argv)} stdout=${JSON.stringify(stdout.slice(0, 1200))} stderr=${JSON.stringify(stderr.slice(0, 1200))}`)
        callback({ ok, stdout, stderr })
      } catch (error) {
        debugLog(`command communication error argv=${JSON.stringify(argv)} error=${String(error)}`)
        callback({ ok: false, stdout: "", stderr: String(error) })
      }
    })
  } catch (error) {
    debugLog(`command spawn error argv=${JSON.stringify(argv)} error=${String(error)}`)
    callback({ ok: false, stdout: "", stderr: String(error) })
  }
}

function sendBarNotification(title: string, body: string) {
  debugLog(`notification title=${JSON.stringify(title)} body=${JSON.stringify(body)}`)
  const notification = Gio.Notification.new(title)
  notification.set_body(body)
  try {
    app.send_notification(null, notification)
  } catch (error) {
    printerr(`Could not show notification: ${error}`)
  }
}

const powerProfiles = AstalPowerProfiles.PowerProfiles.get_default()

function appendPowerProfileOptions(panel: Gtk.Box) {
  const title = new Gtk.Label({ label: "Power profile", xalign: 0 })
  title.add_css_class("utility-title")
  panel.append(title)
  const dropdown = Gtk.DropDown.new_from_strings(["Checking profiles…"])
  dropdown.set_sensitive(false)
  panel.append(dropdown)
  const status = new Gtk.Label({ label: "", xalign: 0, wrap: true })
  status.add_css_class("utility-muted")
  panel.append(status)

  const choices = [
    { id: "performance", label: "Full performance" },
    { id: "balanced", label: "Balanced" },
    { id: "power-saver", label: "Power saver" },
  ] as const
  let available: Array<{ id: string; label: string }> = []
  let syncing = false
  const refresh = () => {
    const selected = available.findIndex(choice => choice.id === powerProfiles.active_profile)
    if (selected < 0) return
    syncing = true
    dropdown.set_selected(selected)
    syncing = false
  }

  dropdown.connect("notify::selected", () => {
    if (syncing) return
    const choice = available[dropdown.get_selected()]
    if (!choice) return
    debugLog(`power profile selection id=${choice.id}`)
    try {
      powerProfiles.active_profile = choice.id
      refresh()
    } catch (error) {
      sendBarNotification("Power profile unavailable", String(error))
    }
  })

  const refreshAvailable = () => {
    status.set_text("Checking available profiles…")
    runCommand(["powerprofilesctl", "list"], result => {
      const ids = result.ok
        ? new Set([...result.stdout.matchAll(/^\s*(?:\*\s*)?(performance|balanced|power-saver):/gm)].map(match => match[1]))
        : new Set<string>()
      available = choices.filter(choice => ids.has(choice.id))
      syncing = true
      dropdown.set_model(Gtk.StringList.new(available.map(choice => choice.label)))
      syncing = false
      dropdown.set_sensitive(available.length > 0)
      status.set_text(available.length ? "" : "Power Profiles service is unavailable.")
      refresh()
    })
  }
  powerProfiles.connect("notify::active-profile", refresh)
  refreshAvailable()
  refresh()
  return refreshAvailable
}

type DisplayChoice = { name: string; label: string }

function readDisplayChoices(): DisplayChoice[] {
  try {
    debugLog("reading enabled displays with wlr-randr --json")
    const [ok, stdout, stderr, status] = GLib.spawn_sync(null, ["wlr-randr", "--json"], null, GLib.SpawnFlags.SEARCH_PATH, null)
    debugLog(`wlr-randr result spawned=${ok} status=${status} stderr=${JSON.stringify(new TextDecoder().decode(stderr ?? new Uint8Array()).slice(0, 1200))}`)
    if (!ok) return []
    const outputs = JSON.parse(new TextDecoder().decode(stdout ?? new Uint8Array()))
    const choices = outputs.filter((output: any) => output.enabled).map((output: any) => ({
      name: String(output.name),
      label: `${output.description || output.name} (${output.name})`,
    }))
    debugLog(`enabled displays=${JSON.stringify(choices)}`)
    return choices
  } catch (_error) {
    debugLog(`could not read displays: ${String(_error)}`)
    return []
  }
}

type AudioChoice = { name: string; label: string }

function readAudioChoices(): AudioChoice[] {
  try {
    debugLog("reading audio sources with pactl list short sources")
    const [ok, stdout, stderr, status] = GLib.spawn_sync(null, ["pactl", "list", "short", "sources"], null, GLib.SpawnFlags.SEARCH_PATH, null)
    debugLog(`pactl result spawned=${ok} status=${status} stderr=${JSON.stringify(new TextDecoder().decode(stderr ?? new Uint8Array()).slice(0, 1200))}`)
    if (!ok) return []
    const lines = new TextDecoder().decode(stdout ?? new Uint8Array()).trim().split("\n")
    const choices = lines.filter(Boolean).map(line => {
      const fields = line.split("\t")
      const name = fields[1] || fields[0]
      const friendly = name
        .replace(/^alsa_(input|output)\./, "")
        .replace(/\.monitor$/, " (system audio)")
        .replace(/[._-]+/g, " ")
      return { name, label: friendly }
    })
    debugLog(`available audio sources=${JSON.stringify(choices)}`)
    return choices
  } catch (_error) {
    debugLog(`could not read audio sources: ${String(_error)}`)
    return []
  }
}

function videoFolder() {
  return GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_VIDEOS)
    || GLib.build_filenamev([GLib.get_home_dir(), "Videos"])
}

function makeRecordingPath() {
  const folder = videoFolder()
  GLib.mkdir_with_parents(folder, 0o755)
  const stamp = GLib.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S") || "recording"
  return GLib.build_filenamev([folder, `LiakOS-${stamp}.mp4`])
}

let recorderProcess: Gio.Subprocess | null = null
let recordingIndicator: Gtk.Button | null = null
let recorderAction: Gtk.Button | null = null

function updateRecordingButton() {
  if (!recordingIndicator) return
  const recording = recorderProcess !== null
  recordingIndicator.set_visible(recording)
  if (recorderAction) recorderAction.set_label(recording ? "Stop recording" : "Start recording")
}

function finishRecording(savedPath: string | null, successful: boolean) {
  recorderProcess = null
  updateRecordingButton()
  if (!savedPath) return
  if (successful) {
    sendBarNotification("Recording finished", `Saved in ${GLib.path_get_dirname(savedPath)} (${GLib.path_get_basename(savedPath)})`)
  } else {
    sendBarNotification("Recording stopped", `The file may be incomplete: ${savedPath}`)
  }
}

function stopRecording() {
  if (!recorderProcess) {
    debugLog("stop recording requested but no recorder process is active")
    return
  }
  debugLog("sending SIGINT to wf-recorder")
  recorderProcess.send_signal(2)
}

function startRecording(output: string, audioSource: string | null, region: boolean) {
  debugLog(`start recording requested output=${output} audio=${audioSource ?? "none"} region=${region}`)
  let savedPath: string
  try {
    savedPath = makeRecordingPath()
  } catch (error) {
    debugLog(`could not create recording output path: ${String(error)}`)
    sendBarNotification("Could not prepare recording folder", String(error))
    return
  }
  const begin = (geometry?: string) => {
    const argv = ["wf-recorder", "-f", savedPath]
    if (geometry) argv.push("-g", geometry)
    else if (output) argv.push("-o", output)
    if (audioSource) argv.push(`--audio=${audioSource}`)
    try {
      debugLog(`spawning wf-recorder argv=${JSON.stringify(argv)}`)
      const process = Gio.Subprocess.new(argv, Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE)
      recorderProcess = process
      updateRecordingButton()
      process.communicate_utf8_async(null, null, (source, result) => {
        const child = source as Gio.Subprocess
        let successful = false
        try {
          const [, stdout, stderr] = child.communicate_utf8_finish(result)
          successful = child.get_successful()
          debugLog(`wf-recorder exited success=${successful} status=${child.get_exit_status()} signal=${child.get_term_sig()} stdout=${JSON.stringify(stdout.slice(0, 1600))} stderr=${JSON.stringify(stderr.slice(0, 3000))}`)
        } catch (error) {
          debugLog(`wf-recorder wait error: ${String(error)}`)
          printerr(`Could not finish wf-recorder: ${error}`)
        }
        if (recorderProcess === child) finishRecording(savedPath, successful)
      })
    } catch (error) {
      debugLog(`wf-recorder spawn error argv=${JSON.stringify(argv)} error=${String(error)}`)
      sendBarNotification("Could not start recording", String(error))
    }
  }

  if (!region) {
    begin()
    return
  }
  runCommand(["slurp"], result => {
    const geometry = result.stdout.trim()
    debugLog(`slurp selection ok=${result.ok} geometry=${JSON.stringify(geometry)} stderr=${JSON.stringify(result.stderr.slice(0, 1200))}`)
    if (!result.ok || !geometry) {
      sendBarNotification("Recording cancelled", result.stderr.trim() || "Area selection did not complete.")
      return
    }
    begin(geometry)
  })
}

function recordingSetupWindow() {
  debugLog("opening recording setup window")
  const screens = readDisplayChoices()
  const sources = readAudioChoices()
  debugLog(`recording setup choices displays=${JSON.stringify(screens)} audio=${JSON.stringify(sources)}`)
  const window = new Gtk.Window({
    title: "Screen recording",
    modal: true,
    resizable: false,
    transient_for: app.get_windows()[0] ?? null,
  })
  const root = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 12 })
  root.add_css_class("recording-window")
  const heading = new Gtk.Label({ label: "Set up your recording", xalign: 0 })
  heading.add_css_class("recording-window-title")
  root.append(heading)

  const screenLabel = new Gtk.Label({ label: "Screen", xalign: 0 })
  root.append(screenLabel)
  const screenNames = screens.map(screen => screen.label)
  const screenDropDown = Gtk.DropDown.new_from_strings(screenNames.length ? screenNames : ["No displays found"])
  screenDropDown.set_sensitive(screens.length > 0)
  root.append(screenDropDown)

  const regionCheck = new Gtk.CheckButton({ label: "Select a screen area" })
  regionCheck.set_sensitive(GLib.find_program_in_path("slurp") !== null)
  regionCheck.connect("toggled", () => {
    screenDropDown.set_sensitive(screens.length > 0 && !regionCheck.get_active())
  })
  root.append(regionCheck)

  const audioLabel = new Gtk.Label({ label: "Audio source", xalign: 0 })
  root.append(audioLabel)
  const audioNames = ["No audio", ...sources.map(source => source.label)]
  const audioDropDown = Gtk.DropDown.new_from_strings(audioNames)
  root.append(audioDropDown)
  const audioHint = new Gtk.Label({
    label: sources.length ? "Choose a microphone or a system-audio monitor." : "No PipeWire audio sources were found.",
    xalign: 0,
    wrap: true,
  })
  audioHint.add_css_class("utility-muted")
  root.append(audioHint)

  const status = new Gtk.Label({ label: `Videos folder: ${videoFolder()}`, xalign: 0, wrap: true })
  status.add_css_class("utility-muted")
  root.append(status)

  const buttons = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8, halign: Gtk.Align.END })
  const cancel = new Gtk.Button({ label: "Cancel" })
  cancel.connect("clicked", () => window.close())
  const start = new Gtk.Button({ label: "Start recording" })
  start.add_css_class("suggested-action")
  start.set_sensitive(screens.length > 0)
  start.connect("clicked", () => {
    const screenIndex = screenDropDown.get_selected()
    const audioIndex = audioDropDown.get_selected()
    const output = screens[screenIndex]?.name
    const audioSource = audioIndex > 0 ? sources[audioIndex - 1]?.name ?? null : null
    debugLog(`record setup submitted screen=${output ?? "none"} audio=${audioSource ?? "none"} region=${regionCheck.get_active()}`)
    if (!output) return
    window.close()
    startRecording(output, audioSource, regionCheck.get_active())
  })
  buttons.append(cancel)
  buttons.append(start)
  root.append(buttons)
  window.set_child(root)
  window.present()
}

function RecordingMenuButton(popover: Gtk.Popover) {
  const button = new Gtk.Button({ label: "Start recording" })
  recorderAction = button
  button.set_halign(Gtk.Align.FILL)
  button.add_css_class("audio-device-row")
  button.connect("clicked", () => {
    debugLog(`record menu button clicked active=${recorderProcess !== null}`)
    if (recorderProcess) {
      stopRecording()
    } else {
      popover.popdown()
      recordingSetupWindow()
    }
  })
  return button
}

function ScreenshotMenuButton(popover: Gtk.Popover) {
  const button = new Gtk.Button({ label: "Take screenshot" })
  button.set_halign(Gtk.Align.FILL)
  button.add_css_class("audio-device-row")
  button.connect("clicked", () => {
    debugLog("screenshot menu button clicked")
    popover.popdown()
    // Let GTK dismiss the settings popover before Flameshot starts its
    // full-screen selection overlay. Otherwise the popover can keep focus
    // and interfere with the selector.
    GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
      try {
        debugLog("spawning flameshot gui with QT_QPA_PLATFORM=wayland")
        // Flameshot's Wayland backend needs to be selected explicitly when
        // it is launched by a GTK process; otherwise it may inherit an
        // incompatible Qt platform setting from the desktop session.
        const launcher = new Gio.SubprocessLauncher({
          flags: Gio.SubprocessFlags.STDOUT_SILENCE | Gio.SubprocessFlags.STDERR_PIPE,
        })
        launcher.setenv("QT_QPA_PLATFORM", "wayland", true)
        const userFlameshot = GLib.build_filenamev([GLib.get_home_dir(), ".local", "bin", "flameshot"])
        const flameshotCommand = GLib.file_test(userFlameshot, GLib.FileTest.IS_EXECUTABLE)
          ? userFlameshot
          : "flameshot"
        const process = launcher.spawnv([flameshotCommand, "gui"])
        process.communicate_utf8_async(null, null, (_process, result) => {
          try {
            const [, , stderr] = process.communicate_utf8_finish(result)
            const status = process.get_exit_status()
            debugLog(`Flameshot exited success=${process.get_successful()} status=${status} stderr=${JSON.stringify(stderr?.slice(0, 2500) ?? "")}`)
            if (!process.get_successful()) {
              sendBarNotification("Flameshot failed", stderr?.trim() || `Exited with status ${status}`)
            }
          } catch (error) {
            debugLog(`Flameshot wait error: ${String(error)}`)
            sendBarNotification("Flameshot failed", String(error))
          }
        })
      } catch (error) {
        debugLog(`Flameshot spawn error: ${String(error)}`)
        sendBarNotification("Flameshot unavailable", String(error))
      }
      return GLib.SOURCE_REMOVE
    })
  })
  return button
}

type BrightnessTarget = { kind: "light" | "ddc"; display?: string; maximum?: number; label: string }

function findBrightnessTarget(callback: (target: BrightnessTarget | null, value: number) => void) {
  runCommand(["light", "-G"], result => {
    const value = Number.parseFloat(result.stdout.trim())
    if (result.ok && Number.isFinite(value)) {
      callback({ kind: "light", label: "Main display" }, Math.max(0, Math.min(100, value)))
      return
    }

    runCommand(["wlr-randr", "--json"], displaysResult => {
      let mainConnector: string | null = null
      try {
        const displays = JSON.parse(displaysResult.stdout)
        const enabled = displays.filter((display: any) => display.enabled)
        const main = enabled.find((display: any) => display.position?.x === 0 && display.position?.y === 0) || enabled[0]
        mainConnector = main?.name ?? null
      } catch (_error) {}

      runCommand(["ddcutil", "detect", "--brief"], detectResult => {
        if (!detectResult.ok) {
          callback(null, 0)
          return
        }
        const blocks = detectResult.stdout.split(/(?=Display \d+)/)
        const displays = blocks.map(block => {
          const number = block.match(/Display (\d+)/)?.[1]
          const connector = block.match(/DRM connector:\s+(?:card\d+-)?([^\s]+)/)?.[1]
          return number && connector ? { number, connector } : null
        }).filter((display): display is { number: string; connector: string } => display !== null)
        const selected = displays.find(display => display.connector === mainConnector) || displays[0]
        if (!selected) {
          callback(null, 0)
          return
        }
        runCommand(["ddcutil", "--display", selected.number, "getvcp", "10", "--brief"], currentResult => {
          const match = currentResult.stdout.match(/VCP 10 \w+ (\d+) (\d+)/)
          if (!currentResult.ok || !match) {
            callback(null, 0)
            return
          }
          const current = Number(match[1])
          const maximum = Number(match[2]) || 100
          callback({ kind: "ddc", display: selected.number, maximum, label: selected.connector }, Math.round(current * 100 / maximum))
        })
      })
    })
  })
}

function appendBrightnessSlider(panel: Gtk.Box) {
  const title = new Gtk.Label({ label: "Main display brightness", xalign: 0 })
  title.add_css_class("utility-title")
  title.set_margin_top(4)
  panel.append(title)
  const scale = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 0, 100, 1)
  scale.set_draw_value(true)
  scale.set_hexpand(true)
  scale.set_sensitive(false)
  panel.append(scale)
  const status = new Gtk.Label({ label: "Checking display support…", xalign: 0, wrap: true })
  status.add_css_class("utility-muted")
  panel.append(status)
  let target: BrightnessTarget | null = null
  let loading = false
  let initialized = false
  let applying = false
  let debounce = 0
  const load = () => {
    if (loading) return
    loading = true
    status.set_text("Checking display support…")
    findBrightnessTarget((found, value) => {
      loading = false
      target = found
      initialized = false
      if (!found) {
        status.set_text("No brightness control is available for the main display.")
        scale.set_sensitive(false)
        return
      }
      applying = true
      scale.set_value(value)
      applying = false
      initialized = true
      scale.set_sensitive(true)
      status.set_text(`${found.label}: ${Math.round(value)}%`)
    })
  }
  scale.connect("value-changed", () => {
    if (!initialized || applying || !target) return
    const value = Math.round(scale.get_value())
    status.set_text(`${target.label}: ${value}%`)
    if (debounce) GLib.source_remove(debounce)
    debounce = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 250, () => {
      debounce = 0
      const argv = target?.kind === "light"
        ? ["light", "-S", String(value)]
        : ["ddcutil", "--display", target?.display ?? "1", "setvcp", "10", String(Math.round(value * (target?.maximum ?? 100) / 100))]
      runCommand(argv, result => {
        if (!result.ok) status.set_text(`Could not change brightness: ${result.stderr.trim()}`)
      })
      return GLib.SOURCE_REMOVE
    })
  })
  return load
}

function SettingsControl() {
  const button = new Gtk.Button({ label: "LiakOS", tooltip_text: "Desktop controls and settings" })
  button.add_css_class("brand-button")
  const popover = new Gtk.Popover()
  popover.add_css_class("utility-popover")
  popover.set_has_arrow(false)
  popover.set_position(Gtk.PositionType.BOTTOM)
  popover.set_halign(Gtk.Align.START)
  // Keep the left alignment adjustment and match the other bar popups' gap.
  popover.set_offset(1, 8)
  const scroll = new Gtk.ScrolledWindow()
  scroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
  scroll.set_max_content_height(640)
  scroll.set_propagate_natural_height(true)
  const panel = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 3 })
  panel.add_css_class("utility-panel")
  const profileRefresh = appendPowerProfileOptions(panel)
  const brightnessRefresh = appendBrightnessSlider(panel)
  const captureTitle = new Gtk.Label({ label: "Capture", xalign: 0 })
  captureTitle.add_css_class("utility-title")
  captureTitle.set_margin_top(4)
  panel.append(captureTitle)
  const captureButtons = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
  const recordButton = RecordingMenuButton(popover)
  const screenshotButton = ScreenshotMenuButton(popover)
  recordButton.add_css_class("capture-button")
  screenshotButton.add_css_class("capture-button")
  recordButton.set_hexpand(true)
  screenshotButton.set_hexpand(true)
  captureButtons.append(recordButton)
  captureButtons.append(screenshotButton)
  panel.append(captureButtons)

  const quickAccessTitle = new Gtk.Label({ label: "Quick settings", xalign: 0 })
  quickAccessTitle.add_css_class("utility-title")
  quickAccessTitle.set_margin_top(4)
  panel.append(quickAccessTitle)
  const quickAccess = new Gtk.Grid({ column_spacing: 8, row_spacing: 8, column_homogeneous: true })
  quickAccess.add_css_class("quick-access-grid")
  const items = [
    ["System settings", "preferences-system-symbolic", "lsettings"],
    ["Displays", "video-display-symbolic", "ldisplays"],
    ["Shortcuts", "input-keyboard-symbolic", "lkeybinds"],
    ["Startup apps", "system-run-symbolic", "lautostart"],
    ["Wallpaper", "preferences-desktop-wallpaper-symbolic", "lpaper"],
  ] as const
  for (let index = 0; index < items.length; index++) {
    const [label, iconName, command] = items[index]
    const item = new Gtk.Button({ tooltip_text: label })
    item.add_css_class("quick-access-button")
    item.set_hexpand(true)
    const content = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
    content.set_halign(Gtk.Align.CENTER)
    content.set_valign(Gtk.Align.CENTER)
    const icon = new Gtk.Image({ icon_name: iconName })
    icon.set_pixel_size(20)
    icon.set_halign(Gtk.Align.CENTER)
    const name = new Gtk.Label({ label, xalign: 0.5, justify: Gtk.Justification.CENTER })
    name.set_halign(Gtk.Align.CENTER)
    name.set_ellipsize(Pango.EllipsizeMode.END)
    content.append(icon)
    content.append(name)
    item.set_child(content)
    item.set_halign(Gtk.Align.FILL)
    item.set_valign(Gtk.Align.FILL)
    item.connect("clicked", () => {
      debugLog(`quick settings button clicked label=${JSON.stringify(label)} command=${JSON.stringify(command)}`)
      runCommand([command], result => {
        if (!result.ok) sendBarNotification(`Could not open ${label}`, result.stderr.trim() || `Command failed: ${command}`)
      }, { userInstalledApp: true })
      popover.popdown()
    })
    quickAccess.attach(item, index % 2, Math.floor(index / 2), 1, 1)
  }
  panel.append(quickAccess)
  scroll.set_child(panel)
  popover.set_child(scroll)
  popover.set_parent(button)
  popover.set_autohide(true)
  const hoverMotion = new Gtk.EventControllerMotion()
  hoverMotion.connect("leave", () => button.remove_css_class("hover-suppressed"))
  button.add_controller(hoverMotion)
  popover.connect("closed", () => {
    button.add_css_class("hover-suppressed")
    popover.unparent()
  })
  button.connect("clicked", () => {
    button.remove_css_class("hover-suppressed")
    debugLog("LiakOS menu opened")
    if (!popover.get_parent()) popover.set_parent(button)
    profileRefresh()
    brightnessRefresh()
    popover.popup()
  })
  return button
}

function RecordingIndicator() {
  const indicator = new Gtk.Button({ label: "●", tooltip_text: "Stop recording" })
  indicator.add_css_class("recording-indicator")
  indicator.set_visible(false)
  indicator.connect("clicked", stopRecording)
  recordingIndicator = indicator
  return indicator
}

function transitConfigPath() {
  return GLib.build_filenamev([GLib.get_user_config_dir(), "ags", "oasa-line"])
}

function validLineId(value: string) {
  return /^[\p{L}\p{N}]{1,8}$/u.test(value)
}

function displayLineId(value: string) {
  const latin = "ABEZHIKMNOPTYX"
  const greek = "ΑΒΕΖΗΙΚΜΝΟΡΤΥΧ"
  return [...value].map(character => {
    const index = greek.indexOf(character.toUpperCase())
    return index >= 0 && character === character.toUpperCase() ? latin[index] : character
  }).join("")
}

function selectedBusLines(): string[] {
  try {
    const [, bytes] = Gio.File.new_for_path(transitConfigPath()).load_contents(null)
    const value = new TextDecoder().decode(bytes).trim()
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      const lines = parsed.filter((line): line is string => typeof line === "string" && validLineId(line))
      return [...new Set(lines)]
    }
    return typeof parsed === "string" && validLineId(parsed) ? [parsed] : ["524"]
  } catch (_error) {
    const raw = (() => {
      try {
        const [, bytes] = Gio.File.new_for_path(transitConfigPath()).load_contents(null)
        return new TextDecoder().decode(bytes).trim()
      } catch (_readError) { return "524" }
    })()
    return validLineId(raw) ? [raw] : ["524"]
  }
}

function saveBusLines(values: string[]) {
  const lines = [...new Set(values.filter(validLineId))]
  const path = transitConfigPath()
  GLib.mkdir_with_parents(GLib.path_get_dirname(path)!, 0o755)
  const data = new TextEncoder().encode(JSON.stringify(lines))
  return Gio.File.new_for_path(path).replace_contents(data, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null)[0]
}

function readOasaLineCatalog() {
  const path = GLib.build_filenamev([GLib.get_user_cache_dir(), "liakos", "oasa-lines.json"])
  try {
    const [, bytes] = Gio.File.new_for_path(path).load_contents(null)
    const payload = JSON.parse(new TextDecoder().decode(bytes))
    const byId = new Map<string, { id: string; description: string; master: boolean }>()
    for (const line of payload.lines ?? []) {
      const id = String(line.line_id ?? "").trim()
      if (!validLineId(id)) continue
      const candidate = {
        id,
        description: String(line.line_descr_eng || line.line_descr || "").trim(),
        master: String(line.mld_master ?? "") === "1",
      }
      const previous = byId.get(id)
      if (!previous || (!previous.master && candidate.master)) byId.set(id, candidate)
    }
    return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" }))
  } catch (_error) {
    return []
  }
}

function OasaControl() {
  const button = new Gtk.Button({ tooltip_text: "Next departures for selected lines (left click); select lines (right click)" })
  const icon = new Gtk.Image({ icon_name: "bus-symbolic" })
  const iconPaths = [
    GLib.build_filenamev([GLib.get_user_config_dir(), "ags", "icons", "oasa-bus.svg"]),
    GLib.build_filenamev([SRC, "assets", "icons", "oasa-bus.svg"]),
  ]
  const iconPath = iconPaths.find(path => Gio.File.new_for_path(path).query_exists(null))
  if (iconPath) icon.set_from_file(iconPath)
  icon.set_pixel_size(ICON_SIZE)
  button.set_child(icon)
  button.add_css_class("tray-item")
  const panel = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 8 })
  panel.add_css_class("audio-panel")
  const kicker = new Gtk.Label({ label: "UPCOMING DEPARTURES", xalign: 0 })
  kicker.add_css_class("transit-kicker")
  const status = new Gtk.Label({ label: "", xalign: 0, wrap: true })
  status.add_css_class("transit-result")
  const lineSections = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 12 })
  panel.append(kicker)
  panel.append(status)
  panel.append(lineSections)
  const showStatus = (message: string) => {
    status.set_label(message)
    status.set_visible(Boolean(message))
  }
  const showDepartures = (section: Gtk.Box, data: { line_id: string; description: string; departures: Array<{ time: string; direction: string }> }) => {
    const lineTitle = new Gtk.Label({ label: `${displayLineId(data.line_id)} — ${data.description}`, xalign: 0, wrap: true, max_width_chars: 34 })
    lineTitle.add_css_class("transit-line-title")
    const cards = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 7 })
    cards.add_css_class("transit-card-row")
    for (const [index, departure] of data.departures.entries()) {
      const card = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 7, hexpand: true, halign: Gtk.Align.FILL })
      card.add_css_class("transit-card")
      const caption = new Gtk.Label({ label: index === 0 ? "NEXT" : `NEXT +${index}`, xalign: 0 })
      caption.add_css_class("transit-card-label")
      const time = new Gtk.Label({ label: departure.time, xalign: 0 })
      time.add_css_class("transit-card-time")
      card.append(caption)
      card.append(time)
      cards.append(card)
    }
    while (section.get_first_child()) section.remove(section.get_first_child()!)
    section.append(lineTitle)
    if (data.departures.length) section.append(cards)
    else {
      const empty = new Gtk.Label({ label: "No more departures today.", xalign: 0 })
      empty.add_css_class("transit-result")
      section.append(empty)
    }
  }
  const popover = new Gtk.Popover()
  popover.add_css_class("audio-popover")
  popover.set_has_arrow(false)
  popover.set_position(Gtk.PositionType.BOTTOM)
  popover.set_offset(0, 8)
  popover.set_child(panel)
  popover.set_parent(button)
  let layerKeyboardEnabled = false
  popover.connect("closed", () => {
    if (!layerKeyboardEnabled) return
    const root = button.get_root()
    if (root instanceof Gtk.Window) {
      Gtk4LayerShell.set_keyboard_mode(root, Gtk4LayerShell.KeyboardMode.NONE)
    }
    layerKeyboardEnabled = false
  })
  const schedulePath = GLib.build_filenamev([GLib.get_user_data_dir(), "liakos", "scripts", "oasa-schedule.py"])
  const sourcePath = GLib.build_filenamev([SRC, "scripts", "oasa-schedule.py"])
  const runLine = (line: string, section: Gtk.Box, onComplete: () => void) => {
    const script = Gio.File.new_for_path(schedulePath).query_exists(null) ? schedulePath : sourcePath
    try {
      const process = Gio.Subprocess.new(["python3", script, line, "--upcoming", "3"], Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE)
      process.communicate_utf8_async(null, null, (proc, result) => {
        try {
          const [, stdout, stderr] = proc.communicate_utf8_finish(result)
          if (!proc.get_successful()) throw new Error((stderr || stdout || "Schedule request failed.").trim())
          showDepartures(section, JSON.parse(stdout.trim()))
        } catch (error) {
          while (section.get_first_child()) section.remove(section.get_first_child()!)
          const failure = new Gtk.Label({ label: `Line ${line}: ${error}`, xalign: 0, wrap: true })
          failure.add_css_class("transit-result")
          section.append(failure)
        } finally {
          onComplete()
        }
      })
    } catch (error) {
      const failure = new Gtk.Label({ label: `Could not start schedule fetcher: ${error}`, xalign: 0, wrap: true })
      failure.add_css_class("transit-result")
      section.append(failure)
      onComplete()
    }
  }
  button.connect("clicked", () => {
    const lines = selectedBusLines()
    popover.set_child(panel)
    popover.popup()
    while (lineSections.get_first_child()) lineSections.remove(lineSections.get_first_child()!)
    if (!lines.length) {
      showStatus("Right click to select one or more OASA lines.")
      return
    }
    showStatus(`Fetching schedules for ${lines.length} selected line${lines.length === 1 ? "" : "s"}…`)
    let pending = lines.length
    const onComplete = () => {
      pending -= 1
      if (pending === 0) showStatus("")
    }
    for (const line of lines) {
      const section = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 5 })
      lineSections.append(section)
      runLine(line, section, onComplete)
    }
  })
  const rightClick = new Gtk.GestureClick({ button: 3 })
  rightClick.connect("pressed", () => {
    const renderSelector = (catalog: Array<{ id: string; description: string }>) => {
      const contents = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 })
      contents.add_css_class("audio-panel")
      contents.add_css_class("transit-picker")
      const heading = new Gtk.Label({ label: "Select bus lines", xalign: 0 })
      heading.add_css_class("audio-title")
      const selectedHeading = new Gtk.Label({ label: "", xalign: 0, wrap: true })
      selectedHeading.add_css_class("transit-selected-label")
      contents.append(heading)
      contents.append(selectedHeading)
      const updateSelected = () => {
        const lines = selectedBusLines().map(displayLineId)
        selectedHeading.set_label(`Selected (${lines.join(", ") || "none"})`)
      }
      updateSelected()
      if (!catalog.length) {
        const message = new Gtk.Label({ label: "Loading OASA lines…", xalign: 0, wrap: true })
        message.add_css_class("transit-result")
        contents.append(message)
      } else {
        const choose = new Gtk.MenuButton({ label: "Choose lines", hexpand: true })
        choose.add_css_class("transit-choose")
        const choosePopover = new Gtk.Popover()
        choosePopover.add_css_class("audio-popover")
        choosePopover.set_has_arrow(false)
        const choosePanel = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 8 })
        choosePanel.add_css_class("audio-panel")
        const search = new Gtk.SearchEntry({ placeholder_text: "Search by line or destination" })
        search.add_css_class("transit-search")
        const scroll = new Gtk.ScrolledWindow()
        scroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
        scroll.set_size_request(360, 300)
        const list = new Gtk.ListBox({ selection_mode: Gtk.SelectionMode.NONE })
        const renderOptions = () => {
          const query = search.get_text().trim().toLocaleLowerCase()
          while (list.get_first_child()) list.remove(list.get_first_child()!)
          const matches = catalog.filter(item => `${displayLineId(item.id)} ${item.description}`.toLocaleLowerCase().includes(query))
          for (const item of matches) {
            const selected = selectedBusLines().includes(item.id)
            const row = new Gtk.ListBoxRow()
            row.add_css_class("transit-option-row")
            if (selected) row.add_css_class("transit-option-selected")
            const check = new Gtk.CheckButton({ label: `${displayLineId(item.id)} — ${item.description}`, active: selected })
            check.connect("toggled", () => {
              const current = selectedBusLines()
              const updated = check.get_active()
                ? [...current, item.id]
                : current.filter(line => line !== item.id)
              saveBusLines(updated)
              if (check.get_active()) row.add_css_class("transit-option-selected")
              else row.remove_css_class("transit-option-selected")
              updateSelected()
            })
            row.set_child(check)
            list.append(row)
          }
        }
        search.connect("search-changed", renderOptions)
        choosePanel.append(search)
        scroll.set_child(list)
        choosePanel.append(scroll)
        choosePopover.set_child(choosePanel)
        choose.set_popover(choosePopover)
        choosePopover.connect("notify::visible", () => {
          if (!choosePopover.get_visible()) return
          GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
            if (choosePopover.get_visible()) search.grab_focus()
            return GLib.SOURCE_REMOVE
          })
        })
        renderOptions()
        contents.append(choose)
      }
      popover.set_child(contents)
    }
    const catalog = readOasaLineCatalog()
    renderSelector(catalog)
    const root = button.get_root()
    if (root instanceof Gtk.Window) {
      Gtk4LayerShell.set_keyboard_mode(root, Gtk4LayerShell.KeyboardMode.ON_DEMAND)
      layerKeyboardEnabled = true
    }
    popover.set_focusable(true)
    popover.popup()
    if (!catalog.length) {
      const script = Gio.File.new_for_path(schedulePath).query_exists(null) ? schedulePath : sourcePath
      try {
        const process = Gio.Subprocess.new(["python3", script, "--refresh-lines"], Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE)
        process.communicate_utf8_async(null, null, (proc, result) => {
          try {
            const [, stdout, stderr] = proc.communicate_utf8_finish(result)
            if (!proc.get_successful()) throw new Error((stderr || stdout || "Could not load OASA lines.").trim())
            renderSelector(readOasaLineCatalog())
          } catch (error) {
            showStatus(`Could not load OASA lines: ${error}`)
          }
        })
      } catch (error) {
        showStatus(`Could not load OASA lines: ${error}`)
      }
    }
  })
  button.add_controller(rightClick)
  return button
}

function radioPopover(anchor: Gtk.Button, title: string, content: Gtk.Widget, cleanup: () => void = () => {}, headerAction?: Gtk.Widget) {
  const popover = new Gtk.Popover()
  popover.add_css_class("audio-popover")
  popover.set_has_arrow(false)
  popover.set_position(Gtk.PositionType.BOTTOM)
  popover.set_offset(0, 8)
  const panel = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 })
  panel.add_css_class("radio-panel")
  const heading = new Gtk.Label({ label: title, xalign: 0 })
  heading.add_css_class("audio-title")
  const header = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 })
  heading.set_hexpand(true)
  header.append(heading)
  if (headerAction) header.append(headerAction)
  panel.append(header)
  panel.append(content)
  popover.set_child(panel)
  popover.set_parent(anchor)
  popover.connect("closed", () => {
    cleanup()
    popover.unparent()
  })
  popover.popup()
}

function radioRow(label: string, detail = "") {
  const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 })
  row.add_css_class("radio-row")
  const name = new Gtk.Label({ label, xalign: 0, hexpand: true, ellipsize: Pango.EllipsizeMode.END })
  row.append(name)
  if (detail) {
    const status = new Gtk.Label({ label: detail })
    status.add_css_class("radio-status")
    row.append(status)
  }
  return row
}

function setBluetoothIcon(image: Gtk.Image, enabled: boolean) {
  const filename = enabled ? "bluetooth-open.svg" : "bluetooth-closed.svg"
  const candidates = [
    GLib.build_filenamev([GLib.get_user_config_dir(), "ags", "icons", filename]),
    GLib.build_filenamev([GLib.get_current_dir(), "assets", "icons", filename]),
  ]
  const path = candidates.find(candidate => Gio.File.new_for_path(candidate).query_exists(null))
  if (path) image.set_from_file(path)
  else image.set_from_icon_name("bluetooth-symbolic")
}

function BluetoothControl() {
  const button = new Gtk.Button({ tooltip_text: "Bluetooth devices" })
  const icon = Gtk.Image.new_from_icon_name("bluetooth-symbolic")
  icon.set_pixel_size(ICON_SIZE - 2)
  button.set_child(icon)
  button.add_css_class("tray-item")
  const updateIcon = () => {
    setBluetoothIcon(icon, bluetooth.is_powered)
    icon.set_opacity(1)
    icon.set_tooltip_text(bluetooth.is_powered
      ? (bluetooth.is_connected ? "Bluetooth connected" : "Bluetooth on")
      : "Bluetooth off")
  }
  bluetooth.connect("notify::is-powered", updateIcon)
  bluetooth.connect("notify::is-connected", updateIcon)
  bluetooth.connect("notify::devices", updateIcon)

  button.connect("clicked", () => {
    const body = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
    const headerAction = new Gtk.Box({ valign: Gtk.Align.CENTER })
    let timeout = 0
    let lastToggleAt = 0
    let discoveryPending = false
    const refreshSignals: Array<[any, number]> = []
    const observe = (object: any, signal: string, callback: () => void) => {
      if (object) refreshSignals.push([object, object.connect(signal, callback)])
    }
    const render = () => {
      while (body.get_first_child()) body.remove(body.get_first_child()!)
      const enabled = bluetooth.is_powered
      const adapter = bluetooth.adapter
      while (headerAction.get_first_child()) headerAction.remove(headerAction.get_first_child()!)
      const toggle = new Gtk.Switch({ active: enabled, valign: Gtk.Align.CENTER, tooltip_text: "Bluetooth" })
      toggle.update_property([Gtk.AccessibleProperty.LABEL], ["Bluetooth"])
      toggle.connect("notify::active", () => {
        const state = toggle.active
        lastToggleAt = Date.now()
        try {
          if (!adapter) return
          if (state) {
            // BlueZ cannot power up an rfkill-soft-blocked controller. Clear
            // that block first, then ask the adapter to power on.
            const rfkill = Gio.Subprocess.new(
              ["rfkill", "unblock", "bluetooth"],
              Gio.SubprocessFlags.NONE,
            )
            if (!rfkill.wait_check(null)) throw new Error("rfkill could not unblock Bluetooth")
          } else {
            discoveryPending = false
            while (body.get_first_child()) body.remove(body.get_first_child()!)
            body.append(new Gtk.Label({ label: "Bluetooth is turning off…", xalign: 0, wrap: true }))
          }
          adapter.powered = state
        } catch (error) { printerr(`Could not toggle Bluetooth: ${error}`) }
      })
      toggle.set_sensitive(!!adapter)
      headerAction.append(toggle)

      if (!enabled) {
        body.append(new Gtk.Label({
          label: adapter ? "Bluetooth is off. Turn it on to see available devices." : "No Bluetooth adapter is available.",
          xalign: 0,
          wrap: true,
        }))
        return
      }

      const scanningNow = !!adapter?.discovering || discoveryPending
      const discovery = new Gtk.Button({ label: scanningNow ? "Stop scanning" : "Scan for devices" })
      discovery.add_css_class("radio-row")
      discovery.set_sensitive(bluetooth.is_powered && !!adapter)
      discovery.connect("clicked", () => {
        if (!adapter) return
        try {
          if (adapter.discovering || discoveryPending) {
            discoveryPending = false
            adapter.stop_discovery()
          } else {
            discoveryPending = true
            adapter.start_discovery()
          }
        } catch (error) {
          discoveryPending = false
          printerr(`Bluetooth discovery failed: ${error}`)
          render()
        }
      })
      body.append(discovery)
      if (scanningNow) {
        const scanning = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
        scanning.add_css_class("radio-row")
        const spinner = new Gtk.Spinner()
        spinner.start()
        scanning.append(spinner)
        scanning.append(new Gtk.Label({ label: "Looking for Bluetooth devices…", xalign: 0 }))
        body.append(scanning)
      }
      const devices = (bluetooth.devices ?? []) as AstalBluetooth.Device[]
      const visible = devices
      if (!visible.length && !scanningNow) body.append(new Gtk.Label({ label: "No Bluetooth devices found. Scan to discover devices.", xalign: 0, wrap: true }))
      for (const device of visible) {
        const row = new Gtk.Button({})
        row.add_css_class("radio-row")
        row.set_child(radioRow(device.alias || device.name || "Bluetooth device", device.connected ? "Connected" : device.connecting ? "Connecting…" : device.paired ? "Paired" : "Tap to pair"))
        row.set_sensitive(!device.connecting)
        row.connect("clicked", () => {
          if (!device.paired) {
            try { device.pair() } catch (error) { printerr(`Bluetooth pairing failed: ${error}`) }
            render()
          } else if (device.connected) {
            device.disconnect_device((_source: unknown, result: Gio.AsyncResult) => {
              try { device.disconnect_device_finish(result) } catch (error) { printerr(`Bluetooth disconnect failed: ${error}`) }
              render()
            })
          } else {
            device.connect_device((_source: unknown, result: Gio.AsyncResult) => {
              try { device.connect_device_finish(result) } catch (error) { printerr(`Bluetooth connect failed: ${error}`) }
              render()
            })
          }
        })
        body.append(row)
      }
    }
    observe(bluetooth, "notify::is-powered", render)
    observe(bluetooth, "notify::devices", render)
    observe(bluetooth, "notify::is-connected", render)
    observe(bluetooth.adapter, "notify::powered", render)
    observe(bluetooth.adapter, "notify::discovering", () => {
      discoveryPending = false
      render()
    })
    render()
    timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1500, () => {
      if (Date.now() - lastToggleAt > 3000) render()
      return GLib.SOURCE_CONTINUE
    })
    radioPopover(button, "Bluetooth", body, () => {
      if (timeout) GLib.source_remove(timeout)
      for (const [object, signalId] of refreshSignals) object.disconnect(signalId)
      try { bluetooth.adapter?.stop_discovery() } catch (_error) {}
    }, headerAction)
  })
  updateIcon()
  return button
}

function audioStreamTitle(stream: AstalWp.Stream) {
  return (
    stream.get_pw_property("application.name") ||
    stream.description ||
    stream.name ||
    "Application audio"
  )
}

function isUserPlaybackStream(stream: AstalWp.Stream) {
  if (stream.media_category === AstalWp.MediaCategory.MONITOR) return false

  const identifiers = [
    audioStreamTitle(stream),
    stream.get_pw_property("node.name") || "",
    stream.get_pw_property("media.name") || "",
  ]
  return !identifiers.some((value) => /loopback|monitor/i.test(value))
}

function makeAudioStreamRow(
  stream: AstalWp.Stream,
  trackSignal: (object: AstalWp.Stream, id: number) => void,
) {
  const row = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  row.add_css_class("audio-stream-row")

  const header = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
  const icon = Gtk.Image.new_from_icon_name("audio-x-generic-symbolic")
  const title = new Gtk.Label({ label: audioStreamTitle(stream), xalign: 0, hexpand: true })
  title.set_ellipsize(Pango.EllipsizeMode.END)

  const mute = new Gtk.ToggleButton()
  mute.add_css_class("audio-button")
  const muteIcon = Gtk.Image.new_from_icon_name("audio-volume-high-symbolic")
  mute.set_child(muteIcon)

  let syncing = false
  const update = () => {
    syncing = true
    mute.set_active(stream.mute)
    muteIcon.set_from_icon_name(
      stream.mute ? "audio-volume-muted-symbolic" : stream.volume_icon,
    )
    title.set_label(audioStreamTitle(stream))
    syncing = false
  }

  mute.connect("toggled", () => {
    if (!syncing) stream.mute = mute.get_active()
  })
  trackSignal(stream, stream.connect("notify::mute", update))
  trackSignal(stream, stream.connect("notify::volume", update))
  trackSignal(stream, stream.connect("notify::volume-icon", update))
  trackSignal(stream, stream.connect("notify::description", update))
  trackSignal(stream, stream.connect("notify::name", update))

  const slider = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 0, 1, 0.01)
  slider.add_css_class("audio-volume-scale")
  slider.set_draw_value(false)
  slider.set_hexpand(true)
  slider.set_value(stream.volume)
  slider.connect("value-changed", () => {
    if (!syncing) stream.volume = slider.get_value()
  })
  trackSignal(stream, stream.connect("notify::volume", () => {
    syncing = true
    slider.set_value(stream.volume)
    syncing = false
  }))

  header.append(icon)
  header.append(title)
  header.append(mute)
  row.append(header)
  row.append(slider)
  return row
}

function clearBox(box: Gtk.Box) {
  let child = box.get_first_child()
  while (child) {
    const next = child.get_next_sibling()
    box.remove(child)
    child = next
  }
}

function appendAudioDevices(list: Gtk.Box, title: string, devices: AstalWp.Endpoint[]) {
  const section = new Gtk.Label({ label: title, xalign: 0 })
  section.add_css_class("audio-section-title")
  list.append(section)

  if (devices.length === 0) {
    const empty = new Gtk.Label({ label: "No devices available", xalign: 0 })
    list.append(empty)
    return
  }

  for (const device of devices) {
    const row = new Gtk.Button()
    row.add_css_class("audio-device-row")
    const content = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
    const icon = Gtk.Image.new_from_icon_name(device.icon || "audio-card-symbolic")
    const name = new Gtk.Label({
      label: device.description || device.name || "Audio device",
      xalign: 0,
      hexpand: true,
    })
    name.set_ellipsize(Pango.EllipsizeMode.END)
    content.append(icon)
    content.append(name)
    if (device.is_default) {
      row.add_css_class("selected")
      content.append(Gtk.Image.new_from_icon_name("emblem-ok-symbolic"))
    }
    row.set_child(content)
    row.connect("clicked", () => {
      device.is_default = true
    })
    list.append(row)
  }
}

function openAudioPopover(anchor: Gtk.Widget) {
  const popover = new Gtk.Popover()
  popover.add_css_class("audio-popover")
  popover.set_has_arrow(false)
  popover.set_position(Gtk.PositionType.BOTTOM)
  popover.set_offset(0, 8)

  const stack = new Gtk.Stack()
  stack.set_transition_type(Gtk.StackTransitionType.SLIDE_LEFT_RIGHT)
  stack.set_transition_duration(150)
  stack.set_vhomogeneous(false)

  const appsPage = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  appsPage.add_css_class("audio-panel")
  const appsHeader = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
  const appsTitle = new Gtk.Label({ label: "App volume", xalign: 0, hexpand: true })
  appsTitle.add_css_class("audio-title")
  const devicesButton = new Gtk.Button({ icon_name: "audio-card-symbolic", tooltip_text: "Sound devices" })
  devicesButton.add_css_class("audio-button")
  appsHeader.append(appsTitle)
  appsHeader.append(devicesButton)
  const streamsScroll = new Gtk.ScrolledWindow()
  streamsScroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
  streamsScroll.set_max_content_height(360)
  streamsScroll.set_propagate_natural_height(true)
  const streamsList = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  const streamSignals: Array<[AstalWp.Stream, number]> = []

  const masterRow = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  masterRow.add_css_class("audio-stream-row")
  masterRow.add_css_class("audio-master-row")
  const masterHeader = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
  const masterIcon = Gtk.Image.new_from_icon_name("audio-volume-high-symbolic")
  const masterLabel = new Gtk.Label({ label: "Master volume", xalign: 0, hexpand: true })
  masterLabel.set_ellipsize(Pango.EllipsizeMode.END)
  const masterSlider = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 0, 1, 0.01)
  masterSlider.add_css_class("audio-volume-scale")
  masterSlider.set_draw_value(false)
  masterSlider.set_hexpand(true)
  const masterMute = new Gtk.ToggleButton()
  masterMute.add_css_class("audio-button")
  const masterMuteIcon = Gtk.Image.new_from_icon_name("audio-volume-high-symbolic")
  masterMute.set_child(masterMuteIcon)
  masterHeader.append(masterIcon)
  masterHeader.append(masterLabel)
  masterHeader.append(masterMute)
  masterRow.append(masterHeader)
  masterRow.append(masterSlider)
  streamsScroll.set_child(streamsList)
  appsPage.append(appsHeader)
  appsPage.append(masterRow)
  appsPage.append(streamsScroll)

  const devicesPage = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 8 })
  devicesPage.add_css_class("audio-panel")
  const devicesHeader = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
  const backButton = new Gtk.Button({ icon_name: "go-previous-symbolic", tooltip_text: "Back to app volume" })
  backButton.add_css_class("audio-button")
  const devicesTitle = new Gtk.Label({ label: "Sound devices", xalign: 0 })
  devicesTitle.add_css_class("audio-title")
  devicesHeader.append(backButton)
  devicesHeader.append(devicesTitle)
  const devicesScroll = new Gtk.ScrolledWindow()
  devicesScroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
  devicesScroll.set_max_content_height(360)
  devicesScroll.set_propagate_natural_height(true)
  const devicesList = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  devicesScroll.set_child(devicesList)
  devicesPage.append(devicesHeader)
  devicesPage.append(devicesScroll)

  const updateStreams = () => {
    for (const [stream, signalId] of streamSignals) stream.disconnect(signalId)
    streamSignals.length = 0
    clearBox(streamsList)
    const streams = (audio.streams ?? [])
      .filter(
        (stream) =>
          stream.media_class === AstalWp.MediaClass.STREAM_OUTPUT_AUDIO &&
          isUserPlaybackStream(stream),
      )
      .sort((a, b) => audioStreamTitle(a).localeCompare(audioStreamTitle(b)))
    if (streams.length === 0) {
      streamsList.append(new Gtk.Label({ label: "No apps are playing audio", xalign: 0 }))
      return
    }
    for (const stream of streams) {
      streamsList.append(
        makeAudioStreamRow(stream, (object, signalId) => {
          streamSignals.push([object, signalId])
        }),
      )
    }
  }

  const updateDevices = () => {
    clearBox(devicesList)
    appendAudioDevices(devicesList, "OUTPUT", audio.speakers ?? [])
    appendAudioDevices(devicesList, "INPUT", audio.microphones ?? [])
  }

  let currentSpeaker: AstalWp.Endpoint | null = null
  let speakerSignals: number[] = []
  let syncingMaster = false
  const updateMasterValues = () => {
    syncingMaster = true
    const volume = currentSpeaker?.volume ?? 0
    masterSlider.set_value(Math.min(1, volume))
    masterMute.set_active(currentSpeaker?.mute ?? true)
    const iconName =
      !currentSpeaker || currentSpeaker.mute
        ? "audio-volume-muted-symbolic"
        : currentSpeaker.volume_icon
    masterIcon.set_from_icon_name(iconName)
    masterMuteIcon.set_from_icon_name(iconName)
    syncingMaster = false
  }
  const updateMasterSpeaker = () => {
    if (currentSpeaker) {
      for (const signalId of speakerSignals) currentSpeaker.disconnect(signalId)
    }
    currentSpeaker = audio.default_speaker
    speakerSignals = currentSpeaker
      ? [
          currentSpeaker.connect("notify::volume", updateMasterValues),
          currentSpeaker.connect("notify::mute", updateMasterValues),
          currentSpeaker.connect("notify::volume-icon", updateMasterValues),
        ]
      : []
    updateMasterValues()
  }
  masterSlider.connect("value-changed", () => {
    if (!syncingMaster && currentSpeaker)
      currentSpeaker.volume = masterSlider.get_value()
  })
  masterMute.connect("toggled", () => {
    if (!syncingMaster && currentSpeaker)
      currentSpeaker.mute = masterMute.get_active()
  })
  updateMasterSpeaker()

  const streamsChanged = audio.connect("notify::streams", updateStreams)
  const speakersChanged = audio.connect("notify::speakers", updateDevices)
  const microphonesChanged = audio.connect("notify::microphones", updateDevices)
  const defaultSpeakerChanged = audio.connect("notify::default-speaker", updateDevices)
  const masterSpeakerChanged = audio.connect("notify::default-speaker", updateMasterSpeaker)
  const defaultMicChanged = audio.connect("notify::default-microphone", updateDevices)
  devicesButton.connect("clicked", () => stack.set_visible_child_name("devices"))
  backButton.connect("clicked", () => stack.set_visible_child_name("apps"))

  stack.add_named(appsPage, "apps")
  stack.add_named(devicesPage, "devices")
  stack.set_visible_child_name("apps")
  popover.set_child(stack)
  updateStreams()
  updateDevices()
  popover.set_parent(anchor)
  popover.connect("closed", () => {
    audio.disconnect(streamsChanged)
    audio.disconnect(speakersChanged)
    audio.disconnect(microphonesChanged)
    audio.disconnect(defaultSpeakerChanged)
    audio.disconnect(masterSpeakerChanged)
    audio.disconnect(defaultMicChanged)
    if (currentSpeaker) {
      for (const signalId of speakerSignals) currentSpeaker.disconnect(signalId)
    }
    for (const [stream, signalId] of streamSignals) stream.disconnect(signalId)
    streamSignals.length = 0
    popover.unparent()
  })
  popover.popup()
}

function SoundControl() {
  const button = new Gtk.Button({ tooltip_text: "App volume and sound devices" })
  const buttonIcon = Gtk.Image.new_from_icon_name("audio-volume-high-symbolic")
  buttonIcon.set_pixel_size(ICON_SIZE)
  button.set_child(buttonIcon)
  button.add_css_class("tray-item")
  let currentSpeaker: AstalWp.Endpoint | null = null
  let speakerSignals: number[] = []
  const updateIcon = () => {
    if (currentSpeaker) {
      for (const signalId of speakerSignals) currentSpeaker.disconnect(signalId)
    }
    const speaker = audio.default_speaker
    currentSpeaker = speaker
    speakerSignals = speaker
      ? [
          speaker.connect("notify::mute", updateIcon),
          speaker.connect("notify::volume-icon", updateIcon),
        ]
      : []
    buttonIcon.set_from_icon_name(
      !speaker || speaker.mute ? "audio-volume-muted-symbolic" : speaker.volume_icon,
    )
  }
  audio.connect("notify::default-speaker", updateIcon)
  wireplumber.connect("notify::connected", updateIcon)
  button.connect("clicked", () => openAudioPopover(button))
  updateIcon()
  return button
}

app.start({
  main() {
    resetDebugLog()
    debugLog(`AGS bar main started PATH=${JSON.stringify(GLib.getenv("PATH") ?? "")} HOME=${JSON.stringify(GLib.getenv("HOME") ?? "")}`)
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
    const cssProvider = Gtk.CssProvider.new()
    const display = Gdk.Display.get_default()
    if (display) {
      Gtk.StyleContext.add_provider_for_display(
        display,
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
      )
    }

    const walPath = GLib.build_filenamev([GLib.get_user_cache_dir(), "wal", "colors.json"])
    const updateTheme = () => {
      const palette = paletteFromWal(walPath) ?? fallbackPalette
      cssProvider.load_from_data(barCss(palette), -1)
    }

    updateTheme()
    try {
      walMonitor = Gio.File.new_for_path(walPath).monitor_file(Gio.FileMonitorFlags.WATCH_MOVES, null)
      walMonitor.connect("changed", () => {
        if (walReloadSource) GLib.source_remove(walReloadSource)
        walReloadSource = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
          walReloadSource = 0
          updateTheme()
          return GLib.SOURCE_REMOVE
        })
      })
    } catch (error) {
      debugLog(`could not watch Pywal colors at ${walPath}: ${String(error)}`)
      printerr(`Could not watch Pywal colors at ${walPath}: ${error}`)
    }

    return (
      <window
        visible
        class="top-bar"
        namespace="top-bar"
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
      >
        <centerbox class="bar">
          <box $type="start" class="brand">
            <SettingsControl />
            <RecordingIndicator />
          </box>
          {/* TODO: Add Wayfire desktop/workspace handling when working in a Wayfire session. */}
          <box $type="center">
            <DateControl />
          </box>
          <box $type="end" spacing={0}>
            <OasaControl />
            <SoundControl />
            <BluetoothControl />
            <SystemTray />
          </box>
        </centerbox>
      </window>
    )
  },
})
