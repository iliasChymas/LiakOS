#define _GNU_SOURCE
#include <errno.h>
#include <gio/gio.h>
#include <glib/gstdio.h>
#include <gtk/gtk.h>
#include <json-glib/json-glib.h>
#include <math.h>
#include <string.h>
#include "display-config.h"

typedef struct {
  int width, height;
  double refresh;
  gboolean preferred, current;
} Mode;
typedef struct {
  char *name, *description, *transform;
  GPtrArray *modes;
  gboolean enabled;
  guint mode_index;
  double scale;
  int x, y;
  GtkSwitch *enabled_switch;
  GtkDropDown *mode_dropdown, *transform_dropdown;
  GtkSpinButton *scale_spin, *x_spin, *y_spin;
  GtkWidget *card;
  GtkDrawingArea *preview;
} Monitor;
typedef struct {
  char *name;
  GPtrArray *settings;
} Profile;
typedef struct {
  GtkApplication *app;
  GtkWindow *window;
  GtkBox *monitor_list;
  GtkDropDown *profile_dropdown;
  GtkLabel *status;
  GtkWidget *apply_button;
  GtkDrawingArea *layout_preview;
  GPtrArray *monitors, *profiles;
  GPtrArray *rollback;
  char *profile_path;
  guint rollback_timer, countdown_timer;
  GtkWindow *confirm_window;
  GtkLabel *countdown_label;
  guint countdown_left;
  double layout_factor, layout_offset_x, layout_offset_y;
  int drag_start_x, drag_start_y;
  Monitor *drag_monitor;
} App;

static const char *wal_bg = "#181b24", *wal_fg = "#f3f4f6",
                  *wal_accent = "#8aa4ff";
static GtkCssProvider *css_provider;
static GFileMonitor *wal_monitor;
static guint wal_reload_timer;

static void mode_free(gpointer p) { g_free(p); }
static void monitor_free(gpointer p) {
  Monitor *m = p;
  g_free(m->name);
  g_free(m->description);
  g_free(m->transform);
  g_ptr_array_unref(m->modes);
  g_free(m);
}
static void setting_free(gpointer p) {
  MonitorSetting *s = p;
  g_free(s->name);
  g_free(s->mode);
  g_free(s->transform);
  g_free(s);
}
static void profile_free(gpointer p) {
  Profile *profile = p;
  g_free(profile->name);
  g_ptr_array_unref(profile->settings);
  g_free(profile);
}

static gboolean color_ok(const char *s) {
  if (!s || strlen(s) != 7 || s[0] != '#')
    return FALSE;
  for (int i = 1; i < 7; i++)
    if (!g_ascii_isxdigit(s[i]))
      return FALSE;
  return TRUE;
}
static const char *color_from(JsonObject *obj, const char *key,
                              const char *fallback) {
  if (!obj || !json_object_has_member(obj, key))
    return fallback;
  const char *s = json_object_get_string_member(obj, key);
  return color_ok(s) ? s : fallback;
}
static void load_palette(void) {
  char *path =
      g_build_filename(g_get_user_cache_dir(), "wal", "colors.json", NULL);
  JsonParser *parser = json_parser_new();
  GError *error = NULL;
  if (json_parser_load_from_file(parser, path, &error)) {
    JsonObject *root = json_node_get_object(json_parser_get_root(parser));
    JsonObject *special = json_object_get_object_member(root, "special");
    JsonObject *colors = json_object_get_object_member(root, "colors");
    wal_bg = g_strdup(color_from(special, "background", "#181b24"));
    wal_fg = g_strdup(color_from(special, "foreground", "#f3f4f6"));
    wal_accent = g_strdup(color_from(colors, "color4", "#8aa4ff"));
  }
  g_clear_error(&error);
  g_object_unref(parser);
  g_free(path);
}
static void update_css(void) {
  load_palette();
  char *css = g_strdup_printf(
      "window { background:%s; color:%s; } headerbar { background:%s; }"
      ".title { font-size:24px; font-weight:700; } .muted { opacity:.72; }"
      ".monitor-card { background:alpha(%s,.12); border:1px solid "
      "alpha(%s,.28); border-radius:16px; padding:16px; }"
      ".monitor-name { font-size:17px; font-weight:700; }"
      "button.suggested-action { background:%s; color:%s; border-radius:10px; }"
      "button { border-radius:9px; } button.compact-button { min-height:0; "
      "padding:8px; margin:0px;} entry, dropdown, spinbutton { "
      "border-radius:8px; }"
      ".status { color:%s; }",
      wal_bg, wal_fg, wal_bg, wal_fg, wal_accent, wal_accent, wal_bg,
      wal_accent);
  if (!css_provider) {
    css_provider = gtk_css_provider_new();
    gtk_style_context_add_provider_for_display(
        gdk_display_get_default(), GTK_STYLE_PROVIDER(css_provider),
        GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);
  }
  gtk_css_provider_load_from_string(css_provider, css);
  g_free(css);
}
static gboolean wal_reload(gpointer data) {
  (void)data;
  wal_reload_timer = 0;
  update_css();
  return G_SOURCE_REMOVE;
}
static void on_wal_changed(GFileMonitor *m, GFile *f, GFile *o,
                           GFileMonitorEvent e, gpointer d) {
  (void)m;
  (void)f;
  (void)o;
  (void)d;
  if (e != G_FILE_MONITOR_EVENT_CHANGED && e != G_FILE_MONITOR_EVENT_CREATED &&
      e != G_FILE_MONITOR_EVENT_MOVED &&
      e != G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT &&
      e != G_FILE_MONITOR_EVENT_RENAMED)
    return;
  if (wal_reload_timer)
    g_source_remove(wal_reload_timer);
  wal_reload_timer = g_timeout_add(120, wal_reload, NULL);
}
static void watch_wal(void) {
  char *path =
      g_build_filename(g_get_user_cache_dir(), "wal", "colors.json", NULL);
  GFile *f = g_file_new_for_path(path);
  GError *err = NULL;
  wal_monitor = g_file_monitor_file(f, G_FILE_MONITOR_WATCH_MOVES, NULL, &err);
  if (wal_monitor)
    g_signal_connect(wal_monitor, "changed", G_CALLBACK(on_wal_changed), NULL);
  g_clear_error(&err);
  g_object_unref(f);
  g_free(path);
}

static char *strip_line(const char *s) {
  char *p = g_strdup(s);
  g_strstrip(p);
  return p;
}
static gboolean parse_mode_line(const char *line, Mode **out) {
  int w = 0, h = 0;
  if (sscanf(line, "%dx%d px,", &w, &h) != 2)
    return FALSE;
  const char *refresh = strchr(line, ',');
  if (!refresh)
    return FALSE;
  while (g_ascii_isspace(*++refresh)) {
  }
  char *end = NULL;
  double hz = g_ascii_strtod(refresh, &end);
  if (end == refresh || !g_str_has_prefix(end, " Hz"))
    return FALSE;
  Mode *m = g_new0(Mode, 1);
  m->width = w;
  m->height = h;
  m->refresh = hz;
  m->preferred = strstr(line, "preferred") != NULL;
  m->current = strstr(line, "current") != NULL;
  *out = m;
  return TRUE;
}
static gboolean detect_monitors(App *app, GError **error) {
  app->drag_monitor = NULL;
  g_ptr_array_set_size(app->monitors, 0);
  const char *argv[] = {"wlr-randr", NULL};
  char *stdout_text = NULL, *stderr_text = NULL;
  int status = 0;
  if (!g_spawn_sync(NULL, (char **)argv, NULL, G_SPAWN_SEARCH_PATH, NULL, NULL,
                    &stdout_text, &stderr_text, &status, error)) {
    if (error && *error && (*error)->domain == G_SPAWN_ERROR &&
        (*error)->code == G_SPAWN_ERROR_NOENT) {
      g_clear_error(error);
      g_set_error(error, G_IO_ERROR, G_IO_ERROR_NOT_FOUND,
                  "The display backend wlr-randr is not installed. Install the "
                  "wlr-randr package to manage Wayfire displays.");
    }
    return FALSE;
  }
  if (!g_spawn_check_wait_status(status, error)) {
    if (stderr_text && *stderr_text)
      g_prefix_error(error, "%s", stderr_text);
    g_free(stdout_text);
    g_free(stderr_text);
    return FALSE;
  }
  gchar **lines = g_strsplit(stdout_text, "\n", -1);
  Monitor *cur = NULL;
  gboolean in_modes = FALSE;
  for (guint i = 0; lines[i]; i++) {
    char *line = lines[i];
    char *trim = strip_line(line);
    if (*trim && line[0] != ' ' && line[0] != '\t' && strchr(trim, '"')) {
      char *quote = strchr(trim, '"');
      if (quote) {
        cur = g_new0(Monitor, 1);
        cur->modes = g_ptr_array_new_with_free_func(mode_free);
        cur->scale = 1.0;
        cur->transform = g_strdup("normal");
        cur->enabled = TRUE;
        cur->name = g_strndup(trim, quote - trim);
        g_strstrip(cur->name);
        char *end = strrchr(quote + 1, '"');
        cur->description =
            end ? g_strndup(quote + 1, end - quote - 1) : g_strdup(cur->name);
        g_ptr_array_add(app->monitors, cur);
        in_modes = FALSE;
      }
    } else if (cur) {
      if (strstr(trim, "Modes:")) {
        in_modes = TRUE;
      } else if (g_str_has_prefix(trim, "Enabled:")) {
        cur->enabled = strstr(trim, "yes") != NULL;
        in_modes = FALSE;
      } else if (g_str_has_prefix(trim, "Position:")) {
        in_modes = FALSE;
        sscanf(trim + 9, "%d,%d", &cur->x, &cur->y);
      } else if (g_str_has_prefix(trim, "Transform:")) {
        in_modes = FALSE;
        g_free(cur->transform);
        cur->transform = strip_line(trim + 10);
      } else if (g_str_has_prefix(trim, "Scale:")) {
        in_modes = FALSE;
        const char *scale_text = trim + 6;
        while (g_ascii_isspace(*scale_text))
          scale_text++;
        char *end = NULL;
        double scale = g_ascii_strtod(scale_text, &end);
        if (end != scale_text)
          cur->scale = scale;
      } else if (in_modes) {
        Mode *mode = NULL;
        if (parse_mode_line(trim, &mode)) {
          if (mode->current)
            cur->mode_index = cur->modes->len;
          g_ptr_array_add(cur->modes, mode);
        }
      }
    }
    g_free(trim);
  }
  g_strfreev(lines);
  g_free(stdout_text);
  g_free(stderr_text);
  if (!app->monitors->len) {
    g_set_error(error, G_IO_ERROR, G_IO_ERROR_NOT_FOUND,
                "Wayfire did not report any connected displays.");
    return FALSE;
  }
  for (guint i = 0; i < app->monitors->len; i++) {
    Monitor *m = g_ptr_array_index(app->monitors, i);
    if (m->modes->len && m->mode_index >= m->modes->len)
      m->mode_index = 0;
    if (!m->enabled && m->modes->len) {
      for (guint j = 0; j < m->modes->len; j++)
        if (((Mode *)g_ptr_array_index(m->modes, j))->preferred) {
          m->mode_index = j;
          break;
        }
    }
  }
  return TRUE;
}

static char *mode_to_string(Mode *m) {
  char refresh[G_ASCII_DTOSTR_BUF_SIZE];
  g_ascii_formatd(refresh, sizeof(refresh), "%.3f", m->refresh);
  return g_strdup_printf("%dx%d@%sHz", m->width, m->height, refresh);
}
static char *current_mode_string(Monitor *m) {
  if (!m->modes->len)
    return g_strdup("");
  Mode *mode =
      g_ptr_array_index(m->modes, MIN(m->mode_index, m->modes->len - 1));
  return mode_to_string(mode);
}
static MonitorSetting *setting_from_monitor(Monitor *m) {
  MonitorSetting *s = g_new0(MonitorSetting, 1);
  s->name = g_strdup(m->name);
  s->mode = current_mode_string(m);
  s->transform = g_strdup(m->transform);
  s->enabled = m->enabled;
  s->scale = m->scale;
  s->x = m->x;
  s->y = m->y;
  return s;
}
static GPtrArray *snapshot(App *app) {
  GPtrArray *a = g_ptr_array_new_with_free_func(setting_free);
  for (guint i = 0; i < app->monitors->len; i++)
    g_ptr_array_add(a,
                    setting_from_monitor(g_ptr_array_index(app->monitors, i)));
  return a;
}

static void set_status(App *app, const char *message) {
  gtk_label_set_text(app->status, message);
}
static void set_confirmation_backdrop(App *app, gboolean active) {
  gtk_widget_set_sensitive(GTK_WIDGET(app->window), !active);
  gtk_widget_set_opacity(GTK_WIDGET(app->window), active ? 0.65 : 1.0);
}
static gboolean run_wlr(GPtrArray *settings, gboolean dry_run, GError **error) {
  GPtrArray *args = g_ptr_array_new_with_free_func(g_free);
  g_ptr_array_add(args, g_strdup("wlr-randr"));
  if (dry_run)
    g_ptr_array_add(args, g_strdup("--dryrun"));
  for (guint i = 0; i < settings->len; i++) {
    MonitorSetting *s = g_ptr_array_index(settings, i);
    g_ptr_array_add(args, g_strdup("--output"));
    g_ptr_array_add(args, g_strdup(s->name));
    g_ptr_array_add(args, g_strdup(s->enabled ? "--on" : "--off"));
    if (!s->enabled)
      continue;
    g_ptr_array_add(args, g_strdup("--mode"));
    g_ptr_array_add(args, g_strdup(s->mode));
    g_ptr_array_add(args, g_strdup("--pos"));
    g_ptr_array_add(args, g_strdup_printf("%d,%d", s->x, s->y));
    char scale[G_ASCII_DTOSTR_BUF_SIZE];
    g_ascii_dtostr(scale, sizeof(scale), s->scale);
    g_ptr_array_add(args, g_strdup("--scale"));
    g_ptr_array_add(args, g_strdup(scale));
    g_ptr_array_add(args, g_strdup("--transform"));
    g_ptr_array_add(args, g_strdup(s->transform));
  }
  g_ptr_array_add(args, NULL);
  char *stderr_text = NULL;
  int status = 0;
  gboolean ok =
      g_spawn_sync(NULL, (char **)args->pdata, NULL, G_SPAWN_SEARCH_PATH, NULL,
                   NULL, NULL, &stderr_text, &status, error);
  if (ok)
    ok = g_spawn_check_wait_status(status, error);
  if (!ok && stderr_text && *stderr_text)
    g_prefix_error(error, "%s", stderr_text);
  g_free(stderr_text);
  g_ptr_array_unref(args);
  return ok;
}

static const char *transforms[] = {"normal",      "90",          "180",
                                   "270",         "flipped",     "flipped-90",
                                   "flipped-180", "flipped-270", NULL};
static guint transform_index(const char *s) {
  for (guint i = 0; transforms[i]; i++)
    if (g_str_equal(s, transforms[i]))
      return i;
  return 0;
}
static void on_mode_changed(GObject *o, GParamSpec *p, gpointer data) {
  (void)o;
  (void)p;
  Monitor *m = data;
  m->mode_index = gtk_drop_down_get_selected(m->mode_dropdown);
  if (m->preview)
    gtk_widget_queue_draw(GTK_WIDGET(m->preview));
}
static void on_transform_changed(GObject *o, GParamSpec *p, gpointer data) {
  (void)o;
  (void)p;
  Monitor *m = data;
  g_free(m->transform);
  m->transform =
      g_strdup(transforms[gtk_drop_down_get_selected(m->transform_dropdown)]);
  if (m->preview)
    gtk_widget_queue_draw(GTK_WIDGET(m->preview));
}
static void on_enabled_changed(GObject *o, GParamSpec *p, gpointer data) {
  (void)o;
  (void)p;
  Monitor *m = data;
  m->enabled = gtk_switch_get_active(m->enabled_switch);
  if (m->preview)
    gtk_widget_queue_draw(GTK_WIDGET(m->preview));
}
static void on_scale_changed(GtkSpinButton *spin, gpointer data) {
  Monitor *m = data;
  m->scale = gtk_spin_button_get_value(spin);
  if (m->preview)
    gtk_widget_queue_draw(GTK_WIDGET(m->preview));
}
static void on_x_changed(GtkSpinButton *spin, gpointer data) {
  Monitor *m = data;
  m->x = gtk_spin_button_get_value_as_int(spin);
  if (m->preview)
    gtk_widget_queue_draw(GTK_WIDGET(m->preview));
}
static void on_y_changed(GtkSpinButton *spin, gpointer data) {
  Monitor *m = data;
  m->y = gtk_spin_button_get_value_as_int(spin);
  if (m->preview)
    gtk_widget_queue_draw(GTK_WIDGET(m->preview));
}

static GtkWidget *labeled_control(const char *label, GtkWidget *control) {
  GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 5);
  GtkWidget *l = gtk_label_new(label);
  gtk_widget_add_css_class(l, "muted");
  gtk_label_set_xalign(GTK_LABEL(l), 0);
  gtk_box_append(GTK_BOX(box), l);
  gtk_box_append(GTK_BOX(box), control);
  return box;
}

static void monitor_logical_size(Monitor *m, double *w, double *h) {
  if (!m->modes->len) {
    *w = 800;
    *h = 600;
    return;
  }
  Mode *mode =
      g_ptr_array_index(m->modes, MIN(m->mode_index, m->modes->len - 1));
  *w = mode->width / MAX(m->scale, .1);
  *h = mode->height / MAX(m->scale, .1);
  if (g_str_equal(m->transform, "90") || g_str_equal(m->transform, "270") ||
      g_str_has_suffix(m->transform, "-90") ||
      g_str_has_suffix(m->transform, "-270")) {
    double t = *w;
    *w = *h;
    *h = t;
  }
}
static void layout_bounds(App *app, double *minx, double *miny, double *maxx,
                          double *maxy) {
  *minx = *miny = 0;
  *maxx = *maxy = 1;
  gboolean first = TRUE;
  for (guint i = 0; i < app->monitors->len; i++) {
    Monitor *m = g_ptr_array_index(app->monitors, i);
    if (!m->enabled)
      continue;
    double w, h;
    monitor_logical_size(m, &w, &h);
    if (first) {
      *minx = m->x;
      *miny = m->y;
      *maxx = m->x + w;
      *maxy = m->y + h;
      first = FALSE;
    } else {
      *minx = MIN(*minx, m->x);
      *miny = MIN(*miny, m->y);
      *maxx = MAX(*maxx, m->x + w);
      *maxy = MAX(*maxy, m->y + h);
    }
  }
}
static void draw_layout(GtkDrawingArea *area, cairo_t *cr, int width,
                        int height, gpointer data) {
  App *app = data;
  double minx, miny, maxx, maxy;
  layout_bounds(app, &minx, &miny, &maxx, &maxy);
  double worldw = MAX(1, maxx - minx), worldh = MAX(1, maxy - miny);
  double factor = MIN((width - 40) / worldw, (height - 40) / worldh);
  factor = MAX(.015, MIN(factor, .35));
  app->layout_factor = factor;
  app->layout_offset_x = (width - worldw * factor) / 2 - minx * factor;
  app->layout_offset_y = (height - worldh * factor) / 2 - miny * factor;
  cairo_set_source_rgba(cr, 0, 0, 0, .12);
  cairo_paint(cr);
  gboolean drew = FALSE;
  for (guint i = 0; i < app->monitors->len; i++) {
    Monitor *m = g_ptr_array_index(app->monitors, i);
    if (!m->enabled)
      continue;
    double w, h;
    monitor_logical_size(m, &w, &h);
    double x = app->layout_offset_x + m->x * factor,
           y = app->layout_offset_y + m->y * factor;
    w *= factor;
    h *= factor;
    drew = TRUE;
    GdkRGBA color;
    gdk_rgba_parse(&color, wal_accent);
    cairo_set_source_rgba(cr, color.red, color.green, color.blue, .75);
    cairo_rectangle(cr, x, y, w, h);
    cairo_fill_preserve(cr);
    cairo_set_source_rgba(cr, 1, 1, 1, .75);
    cairo_set_line_width(cr, 1.5);
    cairo_stroke(cr);
    cairo_set_source_rgb(cr, 1, 1, 1);
    cairo_select_font_face(cr, "Sans", CAIRO_FONT_SLANT_NORMAL,
                           CAIRO_FONT_WEIGHT_BOLD);
    cairo_set_font_size(cr, MAX(10, MIN(14, h * .15)));
    cairo_move_to(cr, x + 8, y + 20);
    cairo_show_text(cr, m->name);
    if (m->modes->len) {
      Mode *mode =
          g_ptr_array_index(m->modes, MIN(m->mode_index, m->modes->len - 1));
      char *txt = g_strdup_printf("%d × %d", mode->width, mode->height);
      cairo_select_font_face(cr, "Sans", CAIRO_FONT_SLANT_NORMAL,
                             CAIRO_FONT_WEIGHT_NORMAL);
      cairo_set_font_size(cr, MAX(9, MIN(12, h * .1)));
      cairo_move_to(cr, x + 8, y + 38);
      cairo_show_text(cr, txt);
      g_free(txt);
    }
  }
  if (!drew) {
    cairo_set_source_rgba(cr, 1, 1, 1, .7);
    cairo_select_font_face(cr, "Sans", CAIRO_FONT_SLANT_NORMAL,
                           CAIRO_FONT_WEIGHT_NORMAL);
    cairo_set_font_size(cr, 14);
    cairo_move_to(cr, 20, height / 2);
    cairo_show_text(cr, "All displays are disabled");
  }
  (void)area;
}
static void layout_drag_begin(GtkGestureDrag *gesture, double x, double y,
                              gpointer data) {
  App *app = data;
  app->drag_monitor = NULL;
  double minx, miny, maxx, maxy;
  layout_bounds(app, &minx, &miny, &maxx, &maxy);
  (void)minx;
  (void)miny;
  (void)maxx;
  (void)maxy;
  for (guint i = 0; i < app->monitors->len; i++) {
    Monitor *m = g_ptr_array_index(app->monitors, i);
    if (!m->enabled)
      continue;
    double w, h;
    monitor_logical_size(m, &w, &h);
    double left = app->layout_offset_x + m->x * app->layout_factor,
           top = app->layout_offset_y + m->y * app->layout_factor;
    if (x >= left && x <= left + w * app->layout_factor && y >= top &&
        y <= top + h * app->layout_factor) {
      app->drag_monitor = m;
      app->drag_start_x = m->x;
      app->drag_start_y = m->y;
      break;
    }
  }
  if (app->drag_monitor)
    gtk_gesture_set_state(GTK_GESTURE(gesture), GTK_EVENT_SEQUENCE_CLAIMED);
}
static void layout_drag_update(GtkGestureDrag *gesture, double dx, double dy,
                               gpointer data) {
  (void)gesture;
  App *app = data;
  if (!app->drag_monitor || app->layout_factor <= 0)
    return;
  int x = (int)(round((app->drag_start_x + dx / app->layout_factor) / 10.0) *
                10),
      y = (int)(round((app->drag_start_y + dy / app->layout_factor) / 10.0) *
                10);
  gtk_spin_button_set_value(app->drag_monitor->x_spin, x);
  gtk_spin_button_set_value(app->drag_monitor->y_spin, y);
  if (app->layout_preview)
    gtk_widget_queue_draw(GTK_WIDGET(app->layout_preview));
}
static void layout_drag_end(GtkGestureDrag *gesture, double dx, double dy,
                            gpointer data) {
  (void)gesture;
  (void)dx;
  (void)dy;
  ((App *)data)->drag_monitor = NULL;
}

static void rebuild_cards(App *app) {
  GtkWidget *child;
  while ((child = gtk_widget_get_first_child(GTK_WIDGET(app->monitor_list))))
    gtk_box_remove(app->monitor_list, child);
  for (guint i = 0; i < app->monitors->len; i++) {
    Monitor *m = g_ptr_array_index(app->monitors, i);
    GtkWidget *card = gtk_box_new(GTK_ORIENTATION_VERTICAL, 12);
    gtk_widget_add_css_class(card, "monitor-card");
    m->card = card;
    m->preview = app->layout_preview;
    GtkWidget *head = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
    GtkWidget *namebox = gtk_box_new(GTK_ORIENTATION_VERTICAL, 3);
    GtkWidget *name = gtk_label_new(m->description);
    gtk_widget_add_css_class(name, "monitor-name");
    gtk_label_set_xalign(GTK_LABEL(name), 0);
    GtkWidget *connector = gtk_label_new(m->name);
    gtk_widget_add_css_class(connector, "muted");
    gtk_label_set_xalign(GTK_LABEL(connector), 0);
    gtk_box_append(GTK_BOX(namebox), name);
    gtk_box_append(GTK_BOX(namebox), connector);
    gtk_widget_set_hexpand(namebox, TRUE);
    m->enabled_switch = GTK_SWITCH(gtk_switch_new());
    gtk_switch_set_active(m->enabled_switch, m->enabled);
    gtk_widget_set_valign(GTK_WIDGET(m->enabled_switch), GTK_ALIGN_CENTER);
    g_signal_connect(m->enabled_switch, "notify::active",
                     G_CALLBACK(on_enabled_changed), m);
    gtk_box_append(GTK_BOX(head), namebox);
    gtk_box_append(GTK_BOX(head), GTK_WIDGET(m->enabled_switch));
    gtk_box_append(GTK_BOX(card), head);
    GtkWidget *grid = gtk_grid_new();
    gtk_grid_set_row_spacing(GTK_GRID(grid), 10);
    gtk_grid_set_column_spacing(GTK_GRID(grid), 12);
    GtkStringList *modes = gtk_string_list_new(NULL);
    for (guint j = 0; j < m->modes->len; j++) {
      Mode *mode = g_ptr_array_index(m->modes, j);
      char *txt = g_strdup_printf("%d × %d  ·  %.2f Hz%s%s", mode->width,
                                  mode->height, mode->refresh,
                                  mode->preferred ? "  ·  Recommended" : "",
                                  mode->current ? "  ·  Current" : "");
      gtk_string_list_append(modes, txt);
      g_free(txt);
    }
    m->mode_dropdown =
        GTK_DROP_DOWN(gtk_drop_down_new(G_LIST_MODEL(modes), NULL));
    gtk_drop_down_set_selected(m->mode_dropdown, m->mode_index);
    gtk_widget_set_hexpand(GTK_WIDGET(m->mode_dropdown), TRUE);
    g_signal_connect(m->mode_dropdown, "notify::selected",
                     G_CALLBACK(on_mode_changed), m);
    GtkStringList *trans = gtk_string_list_new(NULL);
    for (guint j = 0; transforms[j]; j++)
      gtk_string_list_append(trans, transforms[j]);
    m->transform_dropdown =
        GTK_DROP_DOWN(gtk_drop_down_new(G_LIST_MODEL(trans), NULL));
    gtk_drop_down_set_selected(m->transform_dropdown,
                               transform_index(m->transform));
    g_signal_connect(m->transform_dropdown, "notify::selected",
                     G_CALLBACK(on_transform_changed), m);
    m->scale_spin = GTK_SPIN_BUTTON(gtk_spin_button_new_with_range(.5, 4, .05));
    gtk_spin_button_set_digits(m->scale_spin, 2);
    gtk_spin_button_set_value(m->scale_spin, m->scale);
    g_signal_connect(m->scale_spin, "value-changed",
                     G_CALLBACK(on_scale_changed), m);
    m->x_spin =
        GTK_SPIN_BUTTON(gtk_spin_button_new_with_range(-20000, 20000, 10));
    gtk_spin_button_set_value(m->x_spin, m->x);
    g_signal_connect(m->x_spin, "value-changed", G_CALLBACK(on_x_changed), m);
    m->y_spin =
        GTK_SPIN_BUTTON(gtk_spin_button_new_with_range(-20000, 20000, 10));
    gtk_spin_button_set_value(m->y_spin, m->y);
    g_signal_connect(m->y_spin, "value-changed", G_CALLBACK(on_y_changed), m);
    gtk_grid_attach(GTK_GRID(grid),
                    labeled_control("Resolution and refresh rate",
                                    GTK_WIDGET(m->mode_dropdown)),
                    0, 0, 2, 1);
    gtk_grid_attach(GTK_GRID(grid),
                    labeled_control("Scale", GTK_WIDGET(m->scale_spin)), 0, 1,
                    1, 1);
    gtk_grid_attach(
        GTK_GRID(grid),
        labeled_control("Rotation", GTK_WIDGET(m->transform_dropdown)), 1, 1, 1,
        1);
    GtkWidget *position = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 8);
    gtk_box_append(GTK_BOX(position),
                   labeled_control("Left position", GTK_WIDGET(m->x_spin)));
    gtk_box_append(GTK_BOX(position),
                   labeled_control("Top position", GTK_WIDGET(m->y_spin)));
    gtk_grid_attach(GTK_GRID(grid), position, 0, 2, 2, 1);
    gtk_box_append(GTK_BOX(card), grid);
    gtk_box_append(app->monitor_list, card);
  }
}

static char *current_user_config(const char *name) {
  return g_build_filename(g_get_user_config_dir(), "liakos", name, NULL);
}
static void load_profiles(App *app) {
  g_ptr_array_set_size(app->profiles, 0);
  char *path = app->profile_path;
  JsonParser *parser = json_parser_new();
  GError *err = NULL;
  if (json_parser_load_from_file(parser, path, &err)) {
    JsonNode *root = json_parser_get_root(parser);
    if (JSON_NODE_HOLDS_ARRAY(root)) {
      JsonArray *array = json_node_get_array(root);
      for (guint i = 0; i < json_array_get_length(array); i++) {
        JsonObject *obj = json_array_get_object_element(array, i);
        if (!obj)
          continue;
        Profile *pr = g_new0(Profile, 1);
        pr->settings = g_ptr_array_new_with_free_func(setting_free);
        pr->name = g_strdup(
            json_object_get_string_member_with_default(obj, "name", "Unnamed"));
        JsonArray *outs = json_object_get_array_member(obj, "outputs");
        if (outs)
          for (guint j = 0; j < json_array_get_length(outs); j++) {
            JsonObject *o = json_array_get_object_element(outs, j);
            if (!o)
              continue;
            MonitorSetting *s = g_new0(MonitorSetting, 1);
            s->name = g_strdup(
                json_object_get_string_member_with_default(o, "name", ""));
            s->enabled =
                json_object_get_boolean_member_with_default(o, "enabled", TRUE);
            s->mode = g_strdup(
                json_object_get_string_member_with_default(o, "mode", ""));
            s->transform = g_strdup(json_object_get_string_member_with_default(
                o, "transform", "normal"));
            s->scale =
                json_object_get_double_member_with_default(o, "scale", 1);
            s->x = json_object_get_int_member_with_default(o, "x", 0);
            s->y = json_object_get_int_member_with_default(o, "y", 0);
            g_ptr_array_add(pr->settings, s);
          }
        g_ptr_array_add(app->profiles, pr);
      }
    }
  }
  g_clear_error(&err);
  g_object_unref(parser);
  GtkStringList *model = gtk_string_list_new(NULL);
  gtk_string_list_append(model, "Saved layouts");
  for (guint i = 0; i < app->profiles->len; i++)
    gtk_string_list_append(
        model, ((Profile *)g_ptr_array_index(app->profiles, i))->name);
  gtk_drop_down_set_model(app->profile_dropdown, G_LIST_MODEL(model));
  g_object_unref(model);
  gtk_drop_down_set_selected(app->profile_dropdown, 0);
}
static gboolean save_profiles(App *app, GError **error) {
  char *dir = g_path_get_dirname(app->profile_path);
  g_mkdir_with_parents(dir, 0700);
  g_free(dir);
  JsonBuilder *b = json_builder_new();
  json_builder_begin_array(b);
  for (guint i = 0; i < app->profiles->len; i++) {
    Profile *p = g_ptr_array_index(app->profiles, i);
    json_builder_begin_object(b);
    json_builder_set_member_name(b, "name");
    json_builder_add_string_value(b, p->name);
    json_builder_set_member_name(b, "outputs");
    json_builder_begin_array(b);
    for (guint j = 0; j < p->settings->len; j++) {
      MonitorSetting *s = g_ptr_array_index(p->settings, j);
      json_builder_begin_object(b);
      json_builder_set_member_name(b, "name");
      json_builder_add_string_value(b, s->name);
      json_builder_set_member_name(b, "enabled");
      json_builder_add_boolean_value(b, s->enabled);
      json_builder_set_member_name(b, "mode");
      json_builder_add_string_value(b, s->mode);
      json_builder_set_member_name(b, "transform");
      json_builder_add_string_value(b, s->transform);
      json_builder_set_member_name(b, "scale");
      json_builder_add_double_value(b, s->scale);
      json_builder_set_member_name(b, "x");
      json_builder_add_int_value(b, s->x);
      json_builder_set_member_name(b, "y");
      json_builder_add_int_value(b, s->y);
      json_builder_end_object(b);
    }
    json_builder_end_array(b);
    json_builder_end_object(b);
  }
  json_builder_end_array(b);
  JsonGenerator *gen = json_generator_new();
  JsonNode *root = json_builder_get_root(b);
  json_generator_set_root(gen, root);
  char *data = json_generator_to_data(gen, NULL);
  gboolean ok = g_file_set_contents(app->profile_path, data, -1, error);
  g_free(data);
  json_node_free(root);
  g_object_unref(gen);
  g_object_unref(b);
  if (ok)
    g_chmod(app->profile_path, 0600);
  return ok;
}

static gboolean apply_settings(App *app, GPtrArray *settings, gboolean confirm);
static void update_monitors_from_settings(App *app, GPtrArray *settings) {
  for (guint i = 0; i < settings->len; i++) {
    MonitorSetting *s = g_ptr_array_index(settings, i);
    for (guint j = 0; j < app->monitors->len; j++) {
      Monitor *m = g_ptr_array_index(app->monitors, j);
      if (!g_str_equal(s->name, m->name))
        continue;
      m->enabled = s->enabled;
      m->x = s->x;
      m->y = s->y;
      m->scale = s->scale;
      g_free(m->transform);
      m->transform = g_strdup(s->transform);
      for (guint k = 0; k < m->modes->len; k++) {
        char *str = mode_to_string(g_ptr_array_index(m->modes, k));
        if (g_str_equal(str, s->mode))
          m->mode_index = k;
        g_free(str);
      }
      break;
    }
  }
  rebuild_cards(app);
}
static void rollback_now(App *app) {
  if (!app->rollback)
    return;
  GError *err = NULL;
  run_wlr(app->rollback, FALSE, &err);
  if (err) {
    set_status(app, err->message);
    g_error_free(err);
  } else
    set_status(app, "Previous display setup restored.");
  if (app->rollback_timer) {
    g_source_remove(app->rollback_timer);
    app->rollback_timer = 0;
  }
  if (app->countdown_timer) {
    g_source_remove(app->countdown_timer);
    app->countdown_timer = 0;
  }
  if (app->confirm_window)
    gtk_window_destroy(app->confirm_window);
  app->confirm_window = NULL;
  g_clear_pointer(&app->rollback, g_ptr_array_unref);
  set_confirmation_backdrop(app, FALSE);
  GError *refresh_error = NULL;
  if (detect_monitors(app, &refresh_error))
    rebuild_cards(app);
  g_clear_error(&refresh_error);
}
static gboolean rollback_timeout(gpointer data) {
  App *app = data;
  app->rollback_timer = 0;
  rollback_now(app);
  return G_SOURCE_REMOVE;
}
static gboolean countdown_tick(gpointer data) {
  App *app = data;
  if (app->countdown_left > 0)
    app->countdown_left--;
  char *s =
      g_strdup_printf("Keep these display changes?\nReverting in %u seconds.",
                      app->countdown_left);
  gtk_label_set_text(app->countdown_label, s);
  g_free(s);
  if (!app->countdown_left) {
    app->countdown_timer = 0;
    return G_SOURCE_REMOVE;
  }
  return G_SOURCE_CONTINUE;
}
static void keep_settings(GtkButton *b, gpointer data) {
  (void)b;
  App *app = data;
  if (app->rollback_timer) {
    g_source_remove(app->rollback_timer);
    app->rollback_timer = 0;
  }
  if (app->countdown_timer) {
    g_source_remove(app->countdown_timer);
    app->countdown_timer = 0;
  }
  if (app->confirm_window)
    gtk_window_destroy(app->confirm_window);
  app->confirm_window = NULL;
  g_clear_pointer(&app->rollback, g_ptr_array_unref);
  set_confirmation_backdrop(app, FALSE);

  GPtrArray *settings = snapshot(app);
  GError *error = NULL;
  char *kanshi_path = kanshi_config_path();
  gboolean saved = save_display_config(kanshi_path, settings, &error);
  g_free(kanshi_path);
  g_ptr_array_unref(settings);
  if (!saved) {
    char *message = g_strdup_printf(
        "Display setup kept for this session, but persistent configuration setup failed: %s",
        error ? error->message : "unknown error");
    set_status(app, message);
    g_free(message);
    g_clear_error(&error);
    return;
  }

  if (!activate_kanshi(TRUE, &error)) {
    char *message = g_strdup_printf("Layout saved to Kanshi, but could not activate it: %s", error->message);
    set_status(app, message);
    g_free(message);
    g_clear_error(&error);
    return;
  }
  set_status(app, "Display setup saved to Kanshi for startup and reconnects.");
}
static void revert_settings(GtkButton *b, gpointer data) {
  (void)b;
  rollback_now(data);
}
static gboolean confirm_close_requested(GtkWindow *window, gpointer data) {
  (void)window;
  rollback_now(data);
  return TRUE;
}
static void show_confirm(App *app) {
  GtkWidget *w = gtk_window_new();
  app->confirm_window = GTK_WINDOW(w);
  gtk_window_set_application(app->confirm_window, app->app);
  gtk_window_set_transient_for(app->confirm_window, app->window);
  gtk_window_set_modal(app->confirm_window, TRUE);
  gtk_window_set_resizable(app->confirm_window, FALSE);
  gtk_window_set_title(app->confirm_window, "Confirm display setup");
  gtk_window_set_default_size(app->confirm_window, 251, 101);
  GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 8);
  gtk_widget_set_margin_top(box, 5);
  gtk_widget_set_margin_bottom(box, 5);
  gtk_widget_set_margin_start(box, 5);
  gtk_widget_set_margin_end(box, 5);
  app->countdown_label = GTK_LABEL(gtk_label_new(NULL));
  gtk_label_set_wrap(app->countdown_label, TRUE);
  gtk_label_set_justify(app->countdown_label, GTK_JUSTIFY_LEFT);
  gtk_label_set_xalign(app->countdown_label, 0);
  gtk_label_set_max_width_chars(app->countdown_label, 28);
  gtk_widget_set_vexpand(GTK_WIDGET(app->countdown_label), TRUE);
  gtk_widget_set_valign(GTK_WIDGET(app->countdown_label), GTK_ALIGN_CENTER);
  GtkWidget *buttons = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 5);
  gtk_widget_set_halign(buttons, GTK_ALIGN_END);
  gtk_widget_set_margin_end(buttons, 2);
  gtk_widget_set_margin_bottom(buttons, 2);
  GtkWidget *revert = gtk_button_new_with_label("Revert now");
  GtkWidget *keep = gtk_button_new_with_label("Keep settings");
  gtk_widget_add_css_class(keep, "suggested-action");
  gtk_box_append(GTK_BOX(buttons), revert);
  gtk_box_append(GTK_BOX(buttons), keep);
  gtk_box_append(GTK_BOX(box), GTK_WIDGET(app->countdown_label));
  gtk_box_append(GTK_BOX(box), buttons);
  gtk_window_set_child(app->confirm_window, box);
  g_signal_connect(revert, "clicked", G_CALLBACK(revert_settings), app);
  g_signal_connect(keep, "clicked", G_CALLBACK(keep_settings), app);
  g_signal_connect(app->confirm_window, "close-request",
                   G_CALLBACK(confirm_close_requested), app);
  set_confirmation_backdrop(app, TRUE);
  gtk_window_present(app->confirm_window);
  app->countdown_left = 15;
  countdown_tick(app);
  app->countdown_timer = g_timeout_add_seconds(1, countdown_tick, app);
  app->rollback_timer = g_timeout_add_seconds(15, rollback_timeout, app);
}
static gboolean apply_settings(App *app, GPtrArray *settings,
                               gboolean confirm) {
  GError *err = NULL;
  if (!run_wlr(settings, TRUE, &err)) {
    set_status(app,
               err ? err->message : "The display setup could not be tested.");
    g_clear_error(&err);
    return FALSE;
  }
  if (confirm)
    app->rollback = snapshot(app);
  if (!run_wlr(settings, FALSE, &err)) {
    if (confirm)
      g_clear_pointer(&app->rollback, g_ptr_array_unref);
    set_status(app, err ? err->message : "Could not apply display setup.");
    g_clear_error(&err);
    return FALSE;
  }
  update_monitors_from_settings(app, settings);
  if (confirm) {
    set_status(app, "Review the display setup. It will revert automatically "
                    "unless you keep it.");
    show_confirm(app);
  }
  return TRUE;
}

static GPtrArray *collect_settings(App *app) {
  GPtrArray *a = g_ptr_array_new_with_free_func(setting_free);
  for (guint i = 0; i < app->monitors->len; i++) {
    Monitor *m = g_ptr_array_index(app->monitors, i);
    m->enabled = gtk_switch_get_active(m->enabled_switch);
    m->mode_index = gtk_drop_down_get_selected(m->mode_dropdown);
    m->scale = gtk_spin_button_get_value(m->scale_spin);
    m->x = gtk_spin_button_get_value_as_int(m->x_spin);
    m->y = gtk_spin_button_get_value_as_int(m->y_spin);
    g_free(m->transform);
    m->transform =
        g_strdup(transforms[gtk_drop_down_get_selected(m->transform_dropdown)]);
    g_ptr_array_add(a, setting_from_monitor(m));
  }
  return a;
}
static void apply_clicked(GtkButton *b, gpointer data) {
  (void)b;
  App *app = data;
  GPtrArray *a = collect_settings(app);
  apply_settings(app, a, TRUE);
  g_ptr_array_unref(a);
}
static void refresh_clicked(GtkButton *b, gpointer data) {
  (void)b;
  App *app = data;
  GError *err = NULL;
  if (detect_monitors(app, &err)) {
    rebuild_cards(app);
    set_status(app, "Displays refreshed.");
  } else {
    set_status(app, err->message);
    g_error_free(err);
  }
}
static void load_profile_clicked(GtkButton *b, gpointer data) {
  (void)b;
  App *app = data;
  guint i = gtk_drop_down_get_selected(app->profile_dropdown);
  if (i == 0 || i > app->profiles->len)
    return;
  Profile *p = g_ptr_array_index(app->profiles, i - 1);
  GPtrArray *settings = g_ptr_array_new_with_free_func(setting_free);
  for (guint j = 0; j < p->settings->len; j++) {
    MonitorSetting *old = g_ptr_array_index(p->settings, j);
    gboolean found = FALSE;
    for (guint k = 0; k < app->monitors->len; k++)
      if (g_str_equal(old->name,
                      ((Monitor *)g_ptr_array_index(app->monitors, k))->name)) {
        found = TRUE;
        break;
      }
    if (found) {
      MonitorSetting *s = g_new0(MonitorSetting, 1);
      *s = *old;
      s->name = g_strdup(old->name);
      s->mode = g_strdup(old->mode);
      s->transform = g_strdup(old->transform);
      g_ptr_array_add(settings, s);
    }
  }
  if (!settings->len) {
    set_status(app, "This profile has no connected displays.");
    g_ptr_array_unref(settings);
    return;
  }
  apply_settings(app, settings, TRUE);
  g_ptr_array_unref(settings);
}
static void save_profile_name(GtkButton *button, gpointer data) {
  (void)button;
  GtkWidget **pair = data;
  App *app = g_object_get_data(G_OBJECT(pair[0]), "app");
  GtkEntry *entry = GTK_ENTRY(pair[1]);
  const char *name = gtk_editable_get_text(GTK_EDITABLE(entry));
  if (!*name)
    return;
  Profile *p = g_new0(Profile, 1);
  p->name = g_strdup(name);
  p->settings = collect_settings(app);
  g_ptr_array_add(app->profiles, p);
  GError *err = NULL;
  if (!save_profiles(app, &err)) {
    set_status(app, err->message);
    g_error_free(err);
    g_ptr_array_remove(app->profiles, p);
    return;
  }
  load_profiles(app);
  gtk_drop_down_set_selected(app->profile_dropdown, app->profiles->len);
  set_status(app, "Display profile saved.");
  gtk_window_destroy(GTK_WINDOW(pair[0]));
  g_free(pair);
}
static void save_profile_clicked(GtkButton *b, gpointer data) {
  (void)b;
  App *app = data;
  GtkWidget *w = gtk_window_new();
  gtk_window_set_application(GTK_WINDOW(w), app->app);
  gtk_window_set_transient_for(GTK_WINDOW(w), app->window);
  gtk_window_set_modal(GTK_WINDOW(w), TRUE);
  gtk_window_set_title(GTK_WINDOW(w), "Save display profile");
  gtk_window_set_default_size(GTK_WINDOW(w), 360, 150);
  GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 10);
  gtk_widget_set_margin_top(box, 18);
  gtk_widget_set_margin_bottom(box, 18);
  gtk_widget_set_margin_start(box, 18);
  gtk_widget_set_margin_end(box, 18);
  GtkWidget *label = gtk_label_new("Name this display layout");
  GtkWidget *entry = gtk_entry_new();
  gtk_entry_set_placeholder_text(GTK_ENTRY(entry), "Desk, Travel, Projector…");
  GtkWidget *save = gtk_button_new_with_label("Save profile");
  gtk_widget_add_css_class(save, "suggested-action");
  gtk_widget_set_halign(save, GTK_ALIGN_END);
  GtkWidget **pair = g_new(GtkWidget *, 2);
  pair[0] = w;
  pair[1] = entry;
  g_object_set_data(G_OBJECT(w), "app", app);
  g_signal_connect(save, "clicked", G_CALLBACK(save_profile_name), pair);
  gtk_box_append(GTK_BOX(box), label);
  gtk_box_append(GTK_BOX(box), entry);
  gtk_box_append(GTK_BOX(box), save);
  gtk_window_set_child(GTK_WINDOW(w), box);
  gtk_window_present(GTK_WINDOW(w));
}

static void activate(GtkApplication *application, gpointer data) {
  (void)data;
  App *app = g_new0(App, 1);
  app->app = application;
  app->monitors = g_ptr_array_new_with_free_func(monitor_free);
  app->profiles = g_ptr_array_new_with_free_func(profile_free);
  app->profile_path = current_user_config("display-profiles.json");
  GError *err = NULL;
  if (!detect_monitors(app, &err)) {
    app->window = GTK_WINDOW(gtk_application_window_new(application));
    gtk_window_set_title(app->window, "LiakOS Display Setup");
    gtk_window_set_default_size(app->window, 640, 380);
    update_css();
    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 12);
    gtk_widget_set_margin_top(box, 32);
    gtk_widget_set_margin_start(box, 32);
    gtk_widget_set_margin_end(box, 32);
    GtkWidget *title = gtk_label_new("Display setup is unavailable");
    gtk_widget_add_css_class(title, "title");
    gtk_label_set_xalign(GTK_LABEL(title), 0);
    GtkWidget *detail = gtk_label_new(
        err ? err->message : "Could not read the display configuration.");
    gtk_label_set_wrap(GTK_LABEL(detail), TRUE);
    gtk_label_set_xalign(GTK_LABEL(detail), 0);
    gtk_box_append(GTK_BOX(box), title);
    gtk_box_append(GTK_BOX(box), detail);
    gtk_window_set_child(app->window, box);
    gtk_window_present(app->window);
    g_clear_error(&err);
    return;
  }
  app->window = GTK_WINDOW(gtk_application_window_new(application));
  gtk_window_set_title(app->window, "LiakOS Display Setup");
  gtk_window_set_default_size(app->window, 900, 720);
  update_css();
  watch_wal();
  GtkWidget *root = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
  GtkWidget *header = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
  gtk_widget_set_margin_top(header, 20);
  gtk_widget_set_margin_bottom(header, 12);
  gtk_widget_set_margin_start(header, 24);
  gtk_widget_set_margin_end(header, 24);
  GtkWidget *titlebox = gtk_box_new(GTK_ORIENTATION_VERTICAL, 4);
  GtkWidget *title = gtk_label_new("Display setup");
  gtk_widget_add_css_class(title, "title");
  gtk_label_set_xalign(GTK_LABEL(title), 0);
  GtkWidget *sub = gtk_label_new("Arrange screens and choose how they look.");
  gtk_widget_add_css_class(sub, "muted");
  gtk_label_set_xalign(GTK_LABEL(sub), 0);
  gtk_box_append(GTK_BOX(titlebox), title);
  gtk_box_append(GTK_BOX(titlebox), sub);
  gtk_widget_set_hexpand(titlebox, TRUE);
  GtkWidget *refresh = gtk_button_new_with_label("Refresh");
  gtk_widget_add_css_class(refresh, "compact-button");
  gtk_widget_set_valign(refresh, GTK_ALIGN_CENTER);
  gtk_box_append(GTK_BOX(header), titlebox);
  gtk_box_append(GTK_BOX(header), refresh);
  gtk_box_append(GTK_BOX(root), header);
  GtkWidget *profiles = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 8);
  gtk_widget_set_margin_start(profiles, 24);
  gtk_widget_set_margin_end(profiles, 24);
  gtk_widget_set_margin_bottom(profiles, 12);
  app->profile_dropdown = GTK_DROP_DOWN(gtk_drop_down_new(NULL, NULL));
  gtk_widget_set_hexpand(GTK_WIDGET(app->profile_dropdown), TRUE);
  GtkWidget *load = gtk_button_new_with_label("Load profile");
  GtkWidget *save = gtk_button_new_with_label("Save current layout…");
  gtk_box_append(GTK_BOX(profiles), GTK_WIDGET(app->profile_dropdown));
  gtk_box_append(GTK_BOX(profiles), load);
  gtk_box_append(GTK_BOX(profiles), save);
  gtk_box_append(GTK_BOX(root), profiles);
  GtkWidget *previewbox = gtk_box_new(GTK_ORIENTATION_VERTICAL, 5);
  gtk_widget_set_margin_start(previewbox, 24);
  gtk_widget_set_margin_end(previewbox, 24);
  gtk_widget_set_margin_bottom(previewbox, 12);
  GtkWidget *previewlabel = gtk_label_new("Drag screens to arrange them");
  gtk_widget_add_css_class(previewlabel, "muted");
  gtk_label_set_xalign(GTK_LABEL(previewlabel), 0);
  app->layout_preview = GTK_DRAWING_AREA(gtk_drawing_area_new());
  gtk_drawing_area_set_content_height(app->layout_preview, 190);
  gtk_widget_set_hexpand(GTK_WIDGET(app->layout_preview), TRUE);
  gtk_drawing_area_set_draw_func(app->layout_preview, draw_layout, app, NULL);
  GtkGesture *drag = gtk_gesture_drag_new();
  g_signal_connect(drag, "drag-begin", G_CALLBACK(layout_drag_begin), app);
  g_signal_connect(drag, "drag-update", G_CALLBACK(layout_drag_update), app);
  g_signal_connect(drag, "drag-end", G_CALLBACK(layout_drag_end), app);
  gtk_widget_add_controller(GTK_WIDGET(app->layout_preview),
                            GTK_EVENT_CONTROLLER(drag));
  gtk_box_append(GTK_BOX(previewbox), previewlabel);
  gtk_box_append(GTK_BOX(previewbox), GTK_WIDGET(app->layout_preview));
  gtk_box_append(GTK_BOX(root), previewbox);
  GtkWidget *scroll = gtk_scrolled_window_new();
  gtk_widget_set_vexpand(scroll, TRUE);
  gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scroll), GTK_POLICY_NEVER,
                                 GTK_POLICY_AUTOMATIC);
  app->monitor_list = GTK_BOX(gtk_box_new(GTK_ORIENTATION_VERTICAL, 10));
  gtk_widget_set_margin_start(GTK_WIDGET(app->monitor_list), 24);
  gtk_widget_set_margin_end(GTK_WIDGET(app->monitor_list), 24);
  gtk_widget_set_margin_bottom(GTK_WIDGET(app->monitor_list), 12);
  gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll),
                                GTK_WIDGET(app->monitor_list));
  gtk_box_append(GTK_BOX(root), scroll);
  GtkWidget *footer = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 12);
  gtk_widget_set_margin_start(footer, 24);
  gtk_widget_set_margin_end(footer, 24);
  gtk_widget_set_margin_top(footer, 8);
  gtk_widget_set_margin_bottom(footer, 18);
  app->status = GTK_LABEL(gtk_label_new(
      "Changes are previewed for 15 seconds before they revert."));
  gtk_widget_add_css_class(GTK_WIDGET(app->status), "status");
  gtk_label_set_xalign(app->status, 0);
  gtk_widget_set_hexpand(GTK_WIDGET(app->status), TRUE);
  app->apply_button = gtk_button_new_with_label("Apply changes");
  gtk_widget_add_css_class(app->apply_button, "suggested-action");
  gtk_box_append(GTK_BOX(footer), GTK_WIDGET(app->status));
  gtk_box_append(GTK_BOX(footer), app->apply_button);
  gtk_box_append(GTK_BOX(root), footer);
  gtk_window_set_child(app->window, root);
  g_signal_connect(refresh, "clicked", G_CALLBACK(refresh_clicked), app);
  g_signal_connect(app->apply_button, "clicked", G_CALLBACK(apply_clicked),
                   app);
  g_signal_connect(save, "clicked", G_CALLBACK(save_profile_clicked), app);
  g_signal_connect(load, "clicked", G_CALLBACK(load_profile_clicked), app);
  rebuild_cards(app);
  load_profiles(app);
  gtk_window_present(app->window);
}
int main(int argc, char **argv) {
  if (argc == 2 && g_str_equal(argv[1], "--start-kanshi")) {
    GError *error = NULL;
    if (!activate_kanshi(FALSE, &error)) {
      g_printerr("Could not start Kanshi: %s\n", error->message);
      g_error_free(error);
      return 1;
    }
    return 0;
  }
  GtkApplication *app = gtk_application_new("org.liakos.DisplaySetup",
                                            G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
  int status = g_application_run(G_APPLICATION(app), argc, argv);
  g_object_unref(app);
  return status;
}
