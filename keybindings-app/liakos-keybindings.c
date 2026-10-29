#define _GNU_SOURCE
#include <gtk/gtk.h>
#include <gdk/gdkkeysyms.h>
#include <gio/gio.h>
#include <json-glib/json-glib.h>
#include <glib/gstdio.h>
#include <errno.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *section;
    char *option;
    char *shortcut;
    char *action;
    char *category;
    guint line;
} Binding;

typedef struct {
    GtkApplication *app;
    GtkWindow *window;
    GtkListBox *list;
    GtkDropDown *category;
    GtkSearchEntry *search;
    GPtrArray *bindings;
    char *config_path;
    char *config_text;
} AppState;

typedef struct {
    AppState *state;
    Binding *binding;
    GtkWindow *dialog;
    GtkLabel *preview;
    GtkWidget *save_button;
    char *recorded;
} Recorder;

typedef struct {
    const char *background, *foreground, *accent, *secondary, *tertiary, *surface, *muted;
} Palette;

static GtkCssProvider *app_css_provider;
static GFileMonitor *wal_monitor;
static guint wal_reload_source;
static const Palette fallback_palette = {
    "#181b24", "#f3f4f6", "#8aa4ff", "#d3869b", "#a3be8c", "#202431", "#a9aec7"
};

static void binding_free(gpointer data) {
    Binding *b = data;
    g_free(b->section); g_free(b->option); g_free(b->shortcut);
    g_free(b->action); g_free(b->category); g_free(b);
}

static char *trim_copy(const char *s) {
    char *copy = g_strdup(s);
    g_strstrip(copy);
    return copy;
}

static char *title_words(const char *s) {
    char *out = g_strdup(s && *s ? s : "General");
    gboolean upper = TRUE;
    for (char *p = out; *p; p++) {
        if (*p == '-' || *p == '_') { *p = ' '; upper = TRUE; }
        else if (upper) { *p = g_ascii_toupper(*p); upper = FALSE; }
    }
    return out;
}

static gboolean is_binding_option(const char *key) {
    return g_str_has_prefix(key, "binding_") ||
           g_str_has_prefix(key, "repeatable_binding_");
}

static gboolean is_shortcut_setting(const char *key, const char *value) {
    return is_binding_option(key) ||
           (!g_str_has_prefix(key, "command_") && strstr(value, "KEY_") && !strstr(value, "BTN_"));
}

static char *option_action(const char *key) {
    if (g_str_has_prefix(key, "repeatable_binding_")) return g_strdup_printf("command_%s", key + 19);
    if (g_str_has_prefix(key, "binding_")) return g_strdup_printf("command_%s", key + 8);
    return NULL;
}

static char *friendly_action(const char *value) {
    if (!value || !*value) return g_strdup("Wayfire action");
    if (g_str_has_prefix(value, "env QT_QPA_PLATFORMTHEME=")) return g_strdup("Open the LiakOs application launcher");
    if (g_str_has_prefix(value, "gtk-launch")) return g_strdup("Open the selected default application");
    if (g_str_has_prefix(value, "xdg-open")) return g_strdup("Open the default web browser");
    if (g_str_has_prefix(value, "ghostty")) return g_strdup("Open Ghostty terminal");
    if (g_str_has_prefix(value, "thunar")) return g_strdup("Open Thunar file manager");
    if (g_str_has_prefix(value, "swaylock")) return g_strdup("Lock the screen");
    if (g_str_equal(value, "lsession")) return g_strdup("Open LiakOs session actions");
    if (g_str_has_prefix(value, "wlogout")) return g_strdup("Show the logout menu");
    if (g_str_has_prefix(value, "grim") || g_str_has_prefix(value, "slurp")) return g_strdup("Take a screenshot");
    if (!strchr(value, ' ') && strchr(value, '_')) return title_words(value);
    return g_strdup(value);
}

static void load_bindings(AppState *state) {
    g_ptr_array_set_size(state->bindings, 0);
    g_free(state->config_text);
    state->config_text = NULL;
    if (!g_file_get_contents(state->config_path, &state->config_text, NULL, NULL)) return;
    gchar **lines = g_strsplit(state->config_text, "\n", -1);
    char *section = g_strdup("General");
    GHashTable *values = g_hash_table_new_full(g_str_hash, g_str_equal, g_free, g_free);
    /* Collect the entire section first; command_* often follows binding_* in INI. */
    for (guint i = 0; lines[i]; i++) {
        char *line = g_strstrip(lines[i]);
        if (*line == '[') {
            g_free(section);
            char *end = strchr(line, ']');
            section = end ? g_strndup(line + 1, end - line - 1) : g_strdup("General");
            continue;
        }
        if (!*line || *line == '#' || *line == ';') continue;
        char *eq = strchr(line, '=');
        if (!eq) continue;
        char *key = g_strndup(line, eq - line);
        g_strstrip(key);
        char *value = trim_copy(eq + 1);
        char *qualified = g_strdup_printf("%s\037%s", section, key);
        g_hash_table_replace(values, qualified, g_strdup(value));
        g_free(key); g_free(value);
    }
    g_free(section);
    section = g_strdup("General");
    for (guint i = 0; lines[i]; i++) {
        char *line = g_strstrip(lines[i]);
        if (*line == '[') {
            g_free(section);
            char *end = strchr(line, ']');
            section = end ? g_strndup(line + 1, end - line - 1) : g_strdup("General");
            continue;
        }
        if (!*line || *line == '#' || *line == ';') continue;
        char *eq = strchr(line, '=');
        if (!eq) continue;
        char *key = g_strndup(line, eq - line);
        g_strstrip(key);
        char *value = trim_copy(eq + 1);
        if (is_shortcut_setting(key, value)) {
            Binding *b = g_new0(Binding, 1);
            b->section = g_strdup(section);
            b->option = g_strdup(key);
            b->shortcut = g_strdup(value);
            b->line = i;
            char *action_key = option_action(key);
            char *qualified = action_key ? g_strdup_printf("%s\037%s", section, action_key) : NULL;
            const char *action = qualified ? g_hash_table_lookup(values, qualified) : NULL;
            b->action = friendly_action(action ? action : key);
            b->category = title_words(section);
            g_ptr_array_add(state->bindings, b);
            g_free(qualified); g_free(action_key);
        }
        g_free(key); g_free(value);
    }
    g_free(section); g_hash_table_unref(values); g_strfreev(lines);
}

static void add_category(GtkStringList *model, GHashTable *seen, const char *name) {
    if (!g_hash_table_contains(seen, name)) {
        g_hash_table_add(seen, g_strdup(name));
        gtk_string_list_append(model, name);
    }
}

static gboolean row_matches(AppState *s, Binding *b) {
    guint selected = gtk_drop_down_get_selected(s->category);
    const char *cat = gtk_string_list_get_string(GTK_STRING_LIST(gtk_drop_down_get_model(s->category)), selected);
    if (cat && !g_str_equal(cat, "All categories") && !g_str_equal(cat, b->category)) return FALSE;
    const char *needle = gtk_editable_get_text(GTK_EDITABLE(s->search));
    if (!needle || !*needle) return TRUE;
    char *raw = g_strdup_printf("%s %s %s %s", b->category, b->option, b->shortcut, b->action);
    char *haystack = g_utf8_strdown(raw, -1);
    char *lower = g_utf8_strdown(needle, -1);
    gboolean found = strstr(haystack, lower) != NULL;
    g_free(raw); g_free(haystack); g_free(lower);
    return found;
}

static void edit_binding(AppState *state, Binding *binding);

typedef struct { AppState *state; Binding *binding; } EditData;
static void on_edit_clicked(GtkButton *button, gpointer data) {
    (void)button;
    EditData *edit = data;
    edit_binding(edit->state, edit->binding);
}
static void edit_data_free(gpointer data, GClosure *closure) {
    (void)closure;
    g_free(data);
}

static void rebuild_rows(AppState *state) {
    GtkWidget *child;
    while ((child = gtk_widget_get_first_child(GTK_WIDGET(state->list)))) gtk_list_box_remove(state->list, child);
    for (guint i = 0; i < state->bindings->len; i++) {
        Binding *b = g_ptr_array_index(state->bindings, i);
        if (!row_matches(state, b)) continue;
        GtkWidget *row = gtk_list_box_row_new();
        GtkWidget *box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 16);
        gtk_widget_add_css_class(box, "binding-row");
        GtkWidget *text = gtk_box_new(GTK_ORIENTATION_VERTICAL, 5);
        gtk_widget_set_hexpand(text, TRUE);
        GtkWidget *title = gtk_label_new(b->action);
        gtk_label_set_xalign(GTK_LABEL(title), 0);
        gtk_widget_add_css_class(title, "binding-title");
        GtkWidget *meta = gtk_label_new(NULL);
        char *description = g_strdup_printf("%s  ·  %s", b->option, b->shortcut);
        gtk_label_set_text(GTK_LABEL(meta), description); g_free(description);
        gtk_label_set_xalign(GTK_LABEL(meta), 0);
        gtk_widget_add_css_class(meta, "binding-meta");
        gtk_box_append(GTK_BOX(text), title); gtk_box_append(GTK_BOX(text), meta);
        GtkWidget *edit = gtk_button_new_with_label("Edit shortcut");
        gtk_widget_add_css_class(edit, "suggested-action");
        EditData *edit_data = g_new0(EditData, 1);
        edit_data->state = state; edit_data->binding = b;
        g_signal_connect_data(edit, "clicked", G_CALLBACK(on_edit_clicked), edit_data, edit_data_free, 0);
        gtk_box_append(GTK_BOX(box), text); gtk_box_append(GTK_BOX(box), edit);
        gtk_list_box_row_set_child(GTK_LIST_BOX_ROW(row), box);
        gtk_list_box_append(state->list, row);
    }
}

static const char *key_name(guint keyval) {
    if (keyval >= GDK_KEY_a && keyval <= GDK_KEY_z) return NULL;
    if (keyval >= GDK_KEY_A && keyval <= GDK_KEY_Z) return NULL;
    if (keyval >= GDK_KEY_0 && keyval <= GDK_KEY_9) return NULL;
    switch (keyval) {
        case GDK_KEY_Return: case GDK_KEY_KP_Enter: return "KEY_ENTER";
        case GDK_KEY_Escape: return "KEY_ESC";
        case GDK_KEY_BackSpace: return "KEY_BACKSPACE";
        case GDK_KEY_Tab: return "KEY_TAB";
        case GDK_KEY_space: return "KEY_SPACE";
        case GDK_KEY_Left: return "KEY_LEFT"; case GDK_KEY_Right: return "KEY_RIGHT";
        case GDK_KEY_Up: return "KEY_UP"; case GDK_KEY_Down: return "KEY_DOWN";
        case GDK_KEY_Home: return "KEY_HOME"; case GDK_KEY_End: return "KEY_END";
        case GDK_KEY_Page_Up: return "KEY_PAGEUP"; case GDK_KEY_Page_Down: return "KEY_PAGEDOWN";
        case GDK_KEY_Delete: return "KEY_DELETE"; case GDK_KEY_Insert: return "KEY_INSERT";
        case GDK_KEY_Print: return "KEY_PRINT";
        case GDK_KEY_F1: return "KEY_F1"; case GDK_KEY_F2: return "KEY_F2"; case GDK_KEY_F3: return "KEY_F3";
        case GDK_KEY_F4: return "KEY_F4"; case GDK_KEY_F5: return "KEY_F5"; case GDK_KEY_F6: return "KEY_F6";
        case GDK_KEY_F7: return "KEY_F7"; case GDK_KEY_F8: return "KEY_F8"; case GDK_KEY_F9: return "KEY_F9";
        case GDK_KEY_F10: return "KEY_F10"; case GDK_KEY_F11: return "KEY_F11"; case GDK_KEY_F12: return "KEY_F12";
        case GDK_KEY_AudioRaiseVolume: return "KEY_VOLUMEUP";
        case GDK_KEY_AudioLowerVolume: return "KEY_VOLUMEDOWN";
        case GDK_KEY_AudioMute: return "KEY_MUTE";
        case GDK_KEY_MonBrightnessUp: return "KEY_BRIGHTNESSUP";
        case GDK_KEY_MonBrightnessDown: return "KEY_BRIGHTNESSDOWN";
        default: return NULL;
    }
}

static gboolean on_record_key(GtkEventControllerKey *controller, guint keyval, guint keycode,
                              GdkModifierType state_mask, gpointer data) {
    (void)controller; (void)keycode;
    Recorder *r = data;
    if (keyval == GDK_KEY_Shift_L || keyval == GDK_KEY_Shift_R ||
        keyval == GDK_KEY_Control_L || keyval == GDK_KEY_Control_R ||
        keyval == GDK_KEY_Alt_L || keyval == GDK_KEY_Alt_R ||
        keyval == GDK_KEY_Super_L || keyval == GDK_KEY_Super_R) return TRUE;

    GString *out = g_string_new(NULL);
    GdkModifierType mask = state_mask & (GDK_SHIFT_MASK | GDK_CONTROL_MASK | GDK_ALT_MASK | GDK_SUPER_MASK | GDK_META_MASK);
    if (mask & GDK_SUPER_MASK) g_string_append(out, "<super> ");
    if (mask & GDK_ALT_MASK) g_string_append(out, "<alt> ");
    if (mask & GDK_CONTROL_MASK) g_string_append(out, "<ctrl> ");
    if (mask & GDK_SHIFT_MASK) g_string_append(out, "<shift> ");

    const char *name = key_name(keyval);
    char keybuf[64];
    if (!name && ((keyval >= GDK_KEY_a && keyval <= GDK_KEY_z) || (keyval >= GDK_KEY_A && keyval <= GDK_KEY_Z))) {
        g_snprintf(keybuf, sizeof keybuf, "KEY_%c", g_ascii_toupper((char)keyval)); name = keybuf;
    } else if (!name && keyval >= GDK_KEY_0 && keyval <= GDK_KEY_9) {
        g_snprintf(keybuf, sizeof keybuf, "KEY_%c", (char)keyval); name = keybuf;
    }
    if (!name) {
        gtk_label_set_text(r->preview, "That key is not supported yet. Try a letter, number, function key, arrow, or media key.");
        gtk_widget_add_css_class(GTK_WIDGET(r->preview), "error");
        gtk_widget_set_sensitive(r->save_button, FALSE);
        g_string_free(out, TRUE);
        return TRUE;
    }
    g_string_append(out, name);
    g_free(r->recorded); r->recorded = g_string_free(out, FALSE);
    gtk_label_set_text(r->preview, r->recorded);
    gtk_widget_remove_css_class(GTK_WIDGET(r->preview), "error");
    gtk_widget_set_sensitive(r->save_button, TRUE);
    return TRUE;
}

static gboolean write_binding(AppState *state, Binding *binding, const char *shortcut, GError **error) {
    gchar **lines = g_strsplit(state->config_text, "\n", -1);
    char *line = lines[binding->line];
    char *eq = strchr(line, '=');
    if (!eq) { g_set_error(error, G_FILE_ERROR, G_FILE_ERROR_INVAL, "Could not locate this setting in the Wayfire config."); g_strfreev(lines); return FALSE; }
    char *prefix_end = eq + 1;
    while (*prefix_end == ' ' || *prefix_end == '\t') prefix_end++;
    char *suffix = strchr(prefix_end, '#');
    if (!suffix) suffix = line + strlen(line);
    while (suffix > prefix_end && (suffix[-1] == ' ' || suffix[-1] == '\t')) suffix--;
    char *prefix = g_strndup(line, prefix_end - line);
    char *tail = g_strdup(suffix);
    g_free(lines[binding->line]);
    lines[binding->line] = g_strdup_printf("%s%s%s", prefix, shortcut, tail);
    char *updated = g_strjoinv("\n", lines);
    struct stat info;
    char *backup = g_strconcat(state->config_path, ".liakos-backup", NULL);
    if (!g_file_test(backup, G_FILE_TEST_EXISTS) && !g_file_set_contents(backup, state->config_text, -1, error)) {
        g_free(backup); g_free(prefix); g_free(tail); g_free(updated); g_strfreev(lines); return FALSE;
    }
    if (g_file_test(backup, G_FILE_TEST_EXISTS) && stat(state->config_path, &info) == 0)
        g_chmod(backup, info.st_mode & 0777);
    char *temp_path = g_strconcat(state->config_path, ".liakos-tmp", NULL);
    mode_t mode = stat(state->config_path, &info) == 0 ? info.st_mode & 0777 : 0600;
    gboolean ok = g_file_set_contents(temp_path, updated, -1, error);
    if (ok && g_chmod(temp_path, mode) != 0) {
        g_set_error(error, G_FILE_ERROR, g_file_error_from_errno(errno), "Could not preserve Wayfire config permissions: %s", g_strerror(errno));
        ok = FALSE;
    }
    if (ok && g_rename(temp_path, state->config_path) != 0) {
        g_set_error(error, G_FILE_ERROR, g_file_error_from_errno(errno), "Could not replace Wayfire config: %s", g_strerror(errno));
        ok = FALSE;
    }
    if (!ok) g_unlink(temp_path);
    g_free(temp_path); g_free(backup); g_free(prefix); g_free(tail); g_free(updated); g_strfreev(lines);
    if (ok) {
        g_free(binding->shortcut); binding->shortcut = g_strdup(shortcut);
        g_free(state->config_text); state->config_text = NULL;
        g_file_get_contents(state->config_path, &state->config_text, NULL, NULL);
    }
    return ok;
}

static void recorder_free(gpointer data) {
    Recorder *r = data;
    g_free(r->recorded); g_free(r);
}

static void save_recording(GtkButton *button, gpointer data) {
    (void)button;
    Recorder *r = data;
    if (!r->recorded) return;
    GError *error = NULL;
    if (!write_binding(r->state, r->binding, r->recorded, &error)) {
        GtkAlertDialog *alert = gtk_alert_dialog_new("Couldn't save shortcut");
        gtk_alert_dialog_set_detail(alert, error ? error->message : "Unknown file error");
        gtk_alert_dialog_show(alert, r->dialog);
        g_clear_error(&error); g_object_unref(alert); return;
    }
    rebuild_rows(r->state);
    gtk_window_close(r->dialog);
}

static void edit_binding(AppState *state, Binding *binding) {
    Recorder *r = g_new0(Recorder, 1); r->state = state; r->binding = binding;
    GtkWidget *dialog = gtk_window_new();
    r->dialog = GTK_WINDOW(dialog);
    gtk_window_set_application(r->dialog, state->app);
    gtk_window_set_transient_for(r->dialog, state->window);
    gtk_window_set_modal(r->dialog, TRUE);
    gtk_window_set_title(r->dialog, "Record a shortcut");
    gtk_window_set_default_size(r->dialog, 420, 260);
    gtk_window_set_resizable(r->dialog, FALSE);
    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 14);
    gtk_widget_set_margin_top(box, 24); gtk_widget_set_margin_bottom(box, 22);
    gtk_widget_set_margin_start(box, 24); gtk_widget_set_margin_end(box, 24);
    GtkWidget *heading = gtk_label_new("Press the new shortcut");
    gtk_widget_add_css_class(heading, "record-heading");
    gtk_label_set_xalign(GTK_LABEL(heading), 0);
    GtkWidget *hint = gtk_label_new("Hold any modifiers (Super, Ctrl, Alt, Shift), then press a key. Use Cancel to leave without saving.");
    gtk_label_set_wrap(GTK_LABEL(hint), TRUE); gtk_label_set_xalign(GTK_LABEL(hint), 0);
    r->preview = GTK_LABEL(gtk_label_new("Waiting for a key…"));
    gtk_widget_add_css_class(GTK_WIDGET(r->preview), "shortcut-preview");
    GtkWidget *actions = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 8);
    gtk_widget_set_halign(actions, GTK_ALIGN_END);
    GtkWidget *cancel = gtk_button_new_with_label("Cancel");
    r->save_button = gtk_button_new_with_label("Save shortcut");
    gtk_widget_add_css_class(r->save_button, "suggested-action");
    gtk_widget_set_sensitive(r->save_button, FALSE);
    gtk_box_append(GTK_BOX(actions), cancel); gtk_box_append(GTK_BOX(actions), r->save_button);
    gtk_box_append(GTK_BOX(box), heading); gtk_box_append(GTK_BOX(box), hint);
    gtk_box_append(GTK_BOX(box), GTK_WIDGET(r->preview)); gtk_box_append(GTK_BOX(box), actions);
    gtk_window_set_child(r->dialog, box);
    GtkEventController *keys = gtk_event_controller_key_new();
    g_signal_connect(keys, "key-pressed", G_CALLBACK(on_record_key), r);
    gtk_widget_add_controller(dialog, keys);
    g_signal_connect_swapped(cancel, "clicked", G_CALLBACK(gtk_window_close), dialog);
    g_signal_connect(r->save_button, "clicked", G_CALLBACK(save_recording), r);
    g_object_set_data_full(G_OBJECT(dialog), "recorder", r, recorder_free);
    gtk_window_present(r->dialog);
    gtk_widget_grab_focus(dialog);
}

static char *find_config(void) {
    const char *override = g_getenv("LIAKOS_WAYFIRE_CONFIG");
    if (override && *override) return g_canonicalize_filename(override, NULL);
    const char *config_home = g_get_user_config_dir();
    char *a = g_build_filename(config_home, "wayfire.ini", NULL);
    char *b = g_build_filename(config_home, "wayfire", "wayfire.ini", NULL);
    char *found = g_file_test(a, G_FILE_TEST_IS_REGULAR) ? g_strdup(a) :
                  g_file_test(b, G_FILE_TEST_IS_REGULAR) ? g_strdup(b) : g_strdup(a);
    g_free(a); g_free(b); return found;
}

static void on_search_changed(GtkSearchEntry *entry, gpointer data) {
    (void)entry; rebuild_rows(data);
}

static void on_category_changed(GObject *obj, GParamSpec *pspec, gpointer data) {
    (void)obj; (void)pspec; rebuild_rows(data);
}

static gboolean valid_hex(const char *value) {
    if (!value || strlen(value) != 7 || value[0] != '#') return FALSE;
    for (int i = 1; i < 7; i++) if (!g_ascii_isxdigit(value[i])) return FALSE;
    return TRUE;
}

static const char *json_color(JsonObject *object, const char *key, const char *fallback) {
    if (!object || !json_object_has_member(object, key)) return fallback;
    const char *value = json_object_get_string_member(object, key);
    return valid_hex(value) ? value : fallback;
}

static Palette load_palette(void) {
    Palette palette = {
        g_strdup(fallback_palette.background), g_strdup(fallback_palette.foreground),
        g_strdup(fallback_palette.accent), g_strdup(fallback_palette.secondary),
        g_strdup(fallback_palette.tertiary), g_strdup(fallback_palette.surface),
        g_strdup(fallback_palette.muted)
    };
    char *path = g_build_filename(g_get_user_cache_dir(), "wal", "colors.json", NULL);
    JsonParser *parser = json_parser_new();
    GError *error = NULL;
    if (json_parser_load_from_file(parser, path, &error)) {
        JsonObject *root = json_node_get_object(json_parser_get_root(parser));
        JsonObject *special = json_object_get_object_member(root, "special");
        JsonObject *colors = json_object_get_object_member(root, "colors");
        const char *v;
        v = json_color(special, "background", fallback_palette.background); g_free((gpointer)palette.background); palette.background = g_strdup(v);
        v = json_color(special, "foreground", fallback_palette.foreground); g_free((gpointer)palette.foreground); palette.foreground = g_strdup(v);
        v = json_color(colors, "color4", fallback_palette.accent); g_free((gpointer)palette.accent); palette.accent = g_strdup(v);
        v = json_color(colors, "color5", fallback_palette.secondary); g_free((gpointer)palette.secondary); palette.secondary = g_strdup(v);
        v = json_color(colors, "color2", fallback_palette.tertiary); g_free((gpointer)palette.tertiary); palette.tertiary = g_strdup(v);
        v = json_color(colors, "color0", fallback_palette.surface); g_free((gpointer)palette.surface); palette.surface = g_strdup(v);
        v = json_color(colors, "color8", fallback_palette.muted); g_free((gpointer)palette.muted); palette.muted = g_strdup(v);
    }
    g_clear_error(&error);
    g_object_unref(parser); g_free(path);
    return palette;
}

static void apply_css(void) {
    Palette p = load_palette();
    char *css = g_strdup_printf(
        "window { background: %s; color: %s; }"
        "headerbar { background: %s; border: none; }"
        ".page-title { font-size: 22px; font-weight: 700; }"
        ".page-subtitle { color: %s; }"
        ".toolbar { padding: 18px 22px 8px; }"
        ".binding-list { background: transparent; }"
        ".binding-row { padding: 15px 18px; }"
        ".binding-title { font-size: 14px; font-weight: 600; }"
        ".binding-meta { color: %s; font-size: 12px; }"
        ".shortcut-preview { background: %s; color: %s; padding: 18px; border-radius: 10px; font-size: 19px; font-weight: 700; }"
        ".record-heading { font-size: 20px; font-weight: 700; }"
        "button { border-radius: 9px; background: %s; color: %s; border: 1px solid %s; }"
        "button:hover { background: alpha(%s, 0.12); color: %s; }"
        "button:active, button:checked { background: alpha(%s, 0.22); color: %s; }"
        "button.suggested-action { background: %s; color: %s; border-color: %s; }"
        "button.suggested-action:hover { background: alpha(%s, 0.16); }"
        "entry, dropdown { border-radius: 9px; background: %s; color: %s; border: 1px solid %s; caret-color: %s; }"
        "entry:focus, dropdown:focus { border-color: %s; box-shadow: 0 0 0 2px alpha(%s, 0.20); }"
        "entry selection { background: alpha(%s, 0.24); color: %s; }"
        "popover, popover contents { background: %s; color: %s; border: 1px solid %s; }"
        "popover listview, popover row { background: %s; color: %s; }"
        "popover row:hover, popover row:selected { background: alpha(%s, 0.16); color: %s; }"
        "scrolledwindow, list { background: transparent; }"
        "list row { background: %s; border: 1px solid %s; border-radius: 12px; margin: 5px 18px; }"
        "list row:hover { background: alpha(%s, 0.10); border-color: %s; }"
        "scrollbar trough { background: %s; border-radius: 8px; }"
        "scrollbar slider { min-width: 8px; min-height: 8px; background: %s; border-radius: 8px; }"
        "scrollbar slider:hover { background: alpha(%s, 0.55); }"
        "*:focus-visible { outline-color: %s; }",
        p.background, p.foreground, p.surface, p.muted, p.muted,
        p.surface, p.accent,
        p.surface, p.foreground, p.muted, p.accent, p.foreground,
        p.accent, p.accent, p.foreground,
        p.surface, p.accent, p.accent, p.accent,
        p.surface, p.foreground, p.secondary, p.accent, p.accent,
        p.accent, p.foreground,
        p.surface, p.foreground, p.secondary,
        p.surface, p.foreground,
        p.accent, p.foreground,
        p.surface, p.muted, p.accent, p.accent,
        p.surface, p.muted, p.accent, p.accent);
    if (!app_css_provider) {
        app_css_provider = gtk_css_provider_new();
        gtk_style_context_add_provider_for_display(gdk_display_get_default(), GTK_STYLE_PROVIDER(app_css_provider), GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);
    }
    gtk_css_provider_load_from_string(app_css_provider, css);
    g_free(css);
    g_free((gpointer)p.background); g_free((gpointer)p.foreground);
    g_free((gpointer)p.accent); g_free((gpointer)p.secondary);
    g_free((gpointer)p.tertiary); g_free((gpointer)p.surface); g_free((gpointer)p.muted);
}

static gboolean reload_wal_css(gpointer data) {
    (void)data;
    wal_reload_source = 0;
    apply_css();
    return G_SOURCE_REMOVE;
}

static void on_wal_changed(GFileMonitor *monitor, GFile *file, GFile *other_file,
                          GFileMonitorEvent event, gpointer data) {
    (void)monitor; (void)file; (void)other_file; (void)data;
    if (event != G_FILE_MONITOR_EVENT_CHANGED && event != G_FILE_MONITOR_EVENT_CREATED &&
        event != G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT && event != G_FILE_MONITOR_EVENT_MOVED &&
        event != G_FILE_MONITOR_EVENT_RENAMED) return;
    if (wal_reload_source) g_source_remove(wal_reload_source);
    wal_reload_source = g_timeout_add(100, reload_wal_css, NULL);
}

static void watch_wal_palette(void) {
    char *path = g_build_filename(g_get_user_cache_dir(), "wal", "colors.json", NULL);
    GFile *file = g_file_new_for_path(path);
    GError *error = NULL;
    wal_monitor = g_file_monitor_file(file, G_FILE_MONITOR_WATCH_MOVES, NULL, &error);
    if (wal_monitor) g_signal_connect(wal_monitor, "changed", G_CALLBACK(on_wal_changed), NULL);
    g_clear_error(&error); g_object_unref(file); g_free(path);
}

static void activate(GtkApplication *app, gpointer user_data) {
    (void)user_data;
    AppState *s = g_new0(AppState, 1); s->app = app; s->bindings = g_ptr_array_new_with_free_func(binding_free);
    s->config_path = find_config();
    load_bindings(s);
    s->window = GTK_WINDOW(gtk_application_window_new(app));
    gtk_window_set_title(s->window, "LiakOs Keybindings");
    gtk_window_set_default_size(s->window, 820, 650);
    gtk_widget_set_size_request(GTK_WIDGET(s->window), 650, 480);
    apply_css();
    watch_wal_palette();

    GtkWidget *root = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
    GtkWidget *top = gtk_box_new(GTK_ORIENTATION_VERTICAL, 6);
    gtk_widget_add_css_class(top, "toolbar");
    GtkWidget *title = gtk_label_new("Keyboard shortcuts");
    gtk_widget_add_css_class(title, "page-title"); gtk_label_set_xalign(GTK_LABEL(title), 0);
    GtkWidget *subtitle = gtk_label_new("Find a shortcut, then record a new key combination.");
    gtk_widget_add_css_class(subtitle, "page-subtitle"); gtk_label_set_xalign(GTK_LABEL(subtitle), 0);
    gtk_box_append(GTK_BOX(top), title); gtk_box_append(GTK_BOX(top), subtitle);
    gtk_box_append(GTK_BOX(root), top);

    GtkWidget *filters = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
    gtk_widget_set_margin_start(filters, 22); gtk_widget_set_margin_end(filters, 22);
    gtk_widget_set_margin_top(filters, 12); gtk_widget_set_margin_bottom(filters, 8);
    s->search = GTK_SEARCH_ENTRY(gtk_search_entry_new());
    gtk_widget_set_hexpand(GTK_WIDGET(s->search), TRUE);
    gtk_search_entry_set_placeholder_text(s->search, "Search shortcuts or actions…");
    GtkStringList *categories = gtk_string_list_new(NULL);
    gtk_string_list_append(categories, "All categories");
    GHashTable *seen = g_hash_table_new_full(g_str_hash, g_str_equal, g_free, NULL);
    g_hash_table_add(seen, g_strdup("All categories"));
    for (guint i = 0; i < s->bindings->len; i++) add_category(categories, seen, ((Binding *)g_ptr_array_index(s->bindings, i))->category);
    g_hash_table_unref(seen);
    s->category = GTK_DROP_DOWN(gtk_drop_down_new(G_LIST_MODEL(categories), NULL));
    gtk_widget_set_size_request(GTK_WIDGET(s->category), 190, -1);
    gtk_box_append(GTK_BOX(filters), GTK_WIDGET(s->search)); gtk_box_append(GTK_BOX(filters), GTK_WIDGET(s->category));
    gtk_box_append(GTK_BOX(root), filters);

    GtkWidget *scroll = gtk_scrolled_window_new();
    gtk_widget_set_vexpand(scroll, TRUE);
    gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scroll), GTK_POLICY_NEVER, GTK_POLICY_AUTOMATIC);
    s->list = GTK_LIST_BOX(gtk_list_box_new());
    gtk_list_box_set_selection_mode(s->list, GTK_SELECTION_NONE);
    GtkWidget *empty = gtk_label_new("No shortcuts found. This app reads keybindings from your Wayfire config file.");
    gtk_label_set_wrap(GTK_LABEL(empty), TRUE);
    gtk_widget_set_margin_top(empty, 48); gtk_widget_set_margin_start(empty, 28); gtk_widget_set_margin_end(empty, 28);
    gtk_list_box_set_placeholder(s->list, empty);
    gtk_widget_add_css_class(GTK_WIDGET(s->list), "binding-list");
    gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll), GTK_WIDGET(s->list));
    gtk_box_append(GTK_BOX(root), scroll);

    GtkWidget *footer = gtk_label_new(NULL);
    char *foot = s->bindings->len ? g_strdup_printf("%u shortcuts  ·  %s", s->bindings->len, s->config_path) : g_strdup_printf("No shortcuts found in %s", s->config_path);
    gtk_label_set_text(GTK_LABEL(footer), foot); g_free(foot);
    gtk_label_set_xalign(GTK_LABEL(footer), 0); gtk_widget_add_css_class(footer, "page-subtitle");
    gtk_widget_set_margin_start(footer, 22); gtk_widget_set_margin_end(footer, 22);
    gtk_widget_set_margin_top(footer, 10); gtk_widget_set_margin_bottom(footer, 14);
    gtk_box_append(GTK_BOX(root), footer);
    gtk_window_set_child(s->window, root);
    g_signal_connect(s->search, "search-changed", G_CALLBACK(on_search_changed), s);
    g_signal_connect(s->category, "notify::selected", G_CALLBACK(on_category_changed), s);
    rebuild_rows(s);
    g_object_set_data_full(G_OBJECT(s->window), "app-state", s, (GDestroyNotify)NULL);
    gtk_window_present(s->window);
}

int main(int argc, char **argv) {
    GtkApplication *app = gtk_application_new("org.liakos.Keybindings", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    g_object_unref(app); return status;
}
