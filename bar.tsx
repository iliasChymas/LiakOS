import app from "ags/gtk4/app"
import { For, createBinding } from "ags"
import { Astal } from "ags/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import Gio from "gi://Gio"
import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import Pango from "gi://Pango?version=1.0"
import AstalTray from "gi://AstalTray?version=0.1"
import AstalWp from "gi://AstalWp?version=0.1"
import AstalBluetooth from "gi://AstalBluetooth?version=0.1"

const ICON_SIZE=18
const tray = AstalTray.Tray.get_default()
const wireplumber = AstalWp.Wp.get_default()
const audio = wireplumber.audio
const bluetooth = AstalBluetooth.Bluetooth.get_default()

type Palette = {
  background: string
  foreground: string
  accent: string
  surface: string
}

const fallbackPalette: Palette = {
  background: "#181b24",
  foreground: "#f3f4f6",
  accent: "#8aa4ff",
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
      background: ${withAlpha(palette.accent, 0.18)};
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
    }

    .audio-section-title {
      margin: 8px 0 2px;
      color: ${palette.accent};
      font-size: 11px;
      font-weight: 700;
    }

    .audio-stream-row {
      min-height: 50px;
      padding: 4px 2px;
      border-bottom: 1px solid ${withAlpha(palette.foreground, 0.08)};
    }

    .audio-device-row {
      min-height: 42px;
      padding: 0 10px;
      border-radius: 8px;
      background: transparent;
      color: ${palette.foreground};
    }

    .audio-device-row:hover {
      background: ${withAlpha(palette.accent, 0.14)};
    }

    .audio-device-row.selected {
      color: ${palette.accent};
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

    button.radio-row:hover {
      background: ${withAlpha(palette.accent, 0.14)};
    }

    .radio-status {
      color: ${withAlpha(palette.foreground, 0.68)};
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
      background: ${withAlpha(palette.accent, 0.18)};
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
      background: ${withAlpha(palette.accent, 0.18)};
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

function radioPopover(anchor: Gtk.Button, title: string, content: Gtk.Widget, cleanup: () => void = () => {}) {
  const popover = new Gtk.Popover()
  popover.add_css_class("audio-popover")
  popover.set_has_arrow(false)
  popover.set_position(Gtk.PositionType.BOTTOM)
  popover.set_offset(0, 8)
  const panel = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 })
  panel.add_css_class("radio-panel")
  const heading = new Gtk.Label({ label: title, xalign: 0 })
  heading.add_css_class("audio-title")
  panel.append(heading)
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

function radioToggle(label: string, enabled: boolean, onToggle: (enabled: boolean) => void) {
  const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 })
  row.add_css_class("radio-row")
  row.set_halign(Gtk.Align.START)
  const toggle = new Gtk.Switch({ active: enabled, valign: Gtk.Align.CENTER })
  toggle.connect("notify::active", () => onToggle(toggle.active))
  row.append(toggle)
  row.append(new Gtk.Label({ label, xalign: 0 }))
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
      const toggle = radioToggle("Bluetooth", enabled, (state) => {
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
            let child = toggle.get_next_sibling()
            while (child) {
              const next = child.get_next_sibling()
              body.remove(child)
              child = next
            }
            body.append(new Gtk.Label({ label: "Bluetooth is turning off…", xalign: 0, wrap: true }))
          }
          adapter.powered = state
        } catch (error) { printerr(`Could not toggle Bluetooth: ${error}`) }
      })
      toggle.get_first_child()?.set_sensitive(!!adapter)
      body.append(toggle)

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
    })
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
  const masterHeader = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 8 })
  const masterIcon = Gtk.Image.new_from_icon_name("audio-volume-high-symbolic")
  const masterLabel = new Gtk.Label({ label: "Master volume", xalign: 0, hexpand: true })
  masterLabel.set_ellipsize(Pango.EllipsizeMode.END)
  const masterSlider = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 0, 1, 0.01)
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
          <box $type="start" />
          {/* TODO: Add Wayfire desktop/workspace handling when working in a Wayfire session. */}
          <box $type="center" />
          <box $type="end" spacing={0}>
            <SoundControl />
            <BluetoothControl />
            <SystemTray />
          </box>
        </centerbox>
      </window>
    )
  },
})
