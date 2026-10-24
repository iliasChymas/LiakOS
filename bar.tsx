import app from "ags/gtk4/app"
import { For, createBinding } from "ags"
import { Astal } from "ags/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import Gio from "gi://Gio"
import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import AstalTray from "gi://AstalTray?version=0.1"

const tray = AstalTray.Tray.get_default()

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
      <image gicon={createBinding(item, "gicon")} pixelSize={18} />
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
          <box $type="center" />
          <SystemTray $type="end" />
        </centerbox>
      </window>
    )
  },
})
