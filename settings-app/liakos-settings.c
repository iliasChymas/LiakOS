#define _GNU_SOURCE
#include <gtk/gtk.h>
#include "../lui/lui.h"
#include <gio/gio.h>
#include <json-glib/json-glib.h>
#include <string.h>
#include <stdio.h>
#include <sys/wait.h>
#include <sys/utsname.h>
#include <astal/wireplumber/wp.h>

typedef struct _UpdateResult UpdateResult;

typedef struct {
    GtkWindow *window;
    GtkWidget *sidebar;
    GtkWidget *content;
    GtkWidget *toggle;
    GtkListBox *navigation;
    GtkWidget *status;
    GtkLabel *updates;
    GtkWidget *refresh_updates;
    GtkWidget *update_all;
    GtkGrid *updates_table;
    UpdateResult *update_result;
    GtkWidget *sound_list;
    AstalWpAudio *audio;
    guint active;
    gboolean updates_started;
    gboolean checking_updates;
} Settings;

typedef struct { Settings *settings; char *key; } SettingBinding;
typedef struct {
    char *name, *source, *installed, *available, *target, *scope;
} UpdateItem;
struct _UpdateResult { char *text; GPtrArray *items; };

static const char *sections[] = {
    "Overview", "Displays", "Mouse & Touchpad", "Sound", "Transit", "Updates", "About"
};
static GtkWidget *label(const char *text, const char *css_class) {
    GtkWidget *widget = lui_label_new(text);
    gtk_label_set_xalign(GTK_LABEL(widget), 0);
    gtk_widget_set_halign(widget, GTK_ALIGN_START);
    if (css_class) gtk_widget_add_css_class(widget, css_class);
    return widget;
}

static GtkWidget *info_card(const char *heading, const char *body) {
    GtkWidget *card = lui_card_new(NULL);
    if (heading && *heading) gtk_box_append(GTK_BOX(card), label(heading, "lui-heading"));
    GtkWidget *description = label(body, "lui-subtitle");
    gtk_label_set_wrap(GTK_LABEL(description), TRUE);
    gtk_label_set_justify(GTK_LABEL(description), GTK_JUSTIFY_LEFT);
    gtk_box_append(GTK_BOX(card), description);
    return card;
}

static GtkWidget *page_title(Settings *settings, const char *title, const char *subtitle) {
    GtkWidget *header = lui_page_header_new(title, subtitle);
    gtk_box_append(GTK_BOX(settings->content), header);
    return settings->content;
}

static void launch_app_clicked(GtkButton *button, gpointer data) {
    Settings *settings = data;
    const char *command = g_object_get_data(G_OBJECT(button), "launch-command");
    char *argv[] = {(char *)command, NULL};
    GError *error = NULL;
    if (!g_spawn_async(NULL, argv, NULL, G_SPAWN_SEARCH_PATH | G_SPAWN_STDOUT_TO_DEV_NULL |
                       G_SPAWN_STDERR_TO_DEV_NULL, NULL, NULL, NULL, &error)) {
        gtk_label_set_text(GTK_LABEL(settings->status), error->message);
        g_clear_error(&error);
    } else {
        gtk_label_set_text(GTK_LABEL(settings->status), "Application launched.");
    }
}

static GtkWidget *action_button(Settings *settings, const char *title, const char *command) {
    GtkWidget *button = lui_button_new(title, LUI_BUTTON_NORMAL);
    g_object_set_data_full(G_OBJECT(button), "launch-command", g_strdup(command), g_free);
    g_signal_connect(button, "clicked", G_CALLBACK(launch_app_clicked), settings);
    return button;
}

static void append_action(Settings *settings, const char *title, const char *command) {
    GtkWidget *button = action_button(settings, title, command);
    gtk_widget_set_halign(button, GTK_ALIGN_START);
    gtk_box_append(GTK_BOX(settings->content), button);
}

static GtkWidget *quick_tile(Settings *settings, const char *title, const char *subtitle,
                             const char *icon, const char *command) {
    GtkWidget *button = lui_action_tile_new(title, subtitle, icon, GTK_ORIENTATION_HORIZONTAL);
    gtk_widget_add_css_class(button, "quick-tile");
    g_object_set_data_full(G_OBJECT(button), "launch-command", g_strdup(command), g_free);
    g_signal_connect(button, "clicked", G_CALLBACK(launch_app_clicked), settings);
    return button;
}

static void append_status(Settings *settings) {
    settings->status = label("", "lui-subtitle");
    gtk_label_set_wrap(GTK_LABEL(settings->status), TRUE);
    gtk_box_append(GTK_BOX(settings->content), settings->status);
}

static char *wayfire_config_path(void) {
    const char *override = g_getenv("LIAKOS_WAYFIRE_CONFIG");
    if (override && *override) return g_canonicalize_filename(override, NULL);
    const char *config_home = g_get_user_config_dir();
    char *root = g_build_filename(config_home, "wayfire.ini", NULL);
    char *nested = g_build_filename(config_home, "wayfire", "wayfire.ini", NULL);
    char *found = g_file_test(root, G_FILE_TEST_IS_REGULAR) ? g_strdup(root) :
                  g_file_test(nested, G_FILE_TEST_IS_REGULAR) ? g_strdup(nested) : g_strdup(root);
    g_free(root); g_free(nested);
    return found;
}

static char *wayfire_option(const char *section, const char *key, const char *fallback) {
    char *path = wayfire_config_path(), *contents = NULL;
    if (!g_file_get_contents(path, &contents, NULL, NULL)) { g_free(path); return g_strdup(fallback); }
    gchar **lines = g_strsplit(contents, "\n", -1);
    gboolean in_section = FALSE;
    char *value = NULL;
    for (guint i = 0; lines[i] && !value; i++) {
        char *line = g_strstrip(lines[i]);
        if (*line == '[') {
            char *end = strchr(line, ']');
            in_section = end && (size_t)(end - line - 1) == strlen(section) &&
                         strncmp(line + 1, section, strlen(section)) == 0;
            continue;
        }
        if (!in_section || !*line || *line == '#' || *line == ';') continue;
        char *equal = strchr(line, '=');
        if (!equal) continue;
        *equal = '\0'; g_strstrip(line);
        if (g_str_equal(line, key)) value = g_strdup(g_strstrip(equal + 1));
    }
    g_strfreev(lines); g_free(contents); g_free(path);
    return value ? value : g_strdup(fallback);
}

static gboolean save_wayfire_option(const char *section, const char *key, const char *value, GError **error) {
    char *path = wayfire_config_path(), *contents = NULL;
    if (!g_file_get_contents(path, &contents, NULL, error)) {
        g_free(path);
        return FALSE;
    }
    char *backup = g_strconcat(path, ".liakos-backup", NULL);
    if (!g_file_test(backup, G_FILE_TEST_EXISTS) && !g_file_set_contents(backup, contents, -1, error)) {
        g_free(path); g_free(backup); g_free(contents); return FALSE;
    }
    gchar **lines = g_strsplit(contents, "\n", -1);
    GString *updated = g_string_new(NULL);
    gboolean in_section = FALSE, have_section = FALSE, wrote_option = FALSE;
    for (guint i = 0; lines[i]; i++) {
        char *line = lines[i];
        if (!*line && !lines[i + 1]) break;
        if (line[0] == '[') {
            if (in_section && !wrote_option) {
                g_string_append_printf(updated, "%s = %s\n", key, value);
                wrote_option = TRUE;
            }
            char *end = strchr(line, ']');
            in_section = end && (size_t)(end - line - 1) == strlen(section) &&
                         strncmp(line + 1, section, strlen(section)) == 0;
            if (in_section) have_section = TRUE;
            g_string_append_printf(updated, "%s\n", line);
            continue;
        }
        if (in_section && !wrote_option) {
            char *copy = g_strdup(line), *trimmed = g_strstrip(copy), *equal = strchr(trimmed, '=');
            if (equal) {
                *equal = '\0'; g_strstrip(trimmed);
                if (g_str_equal(trimmed, key)) {
                    g_string_append_printf(updated, "%s = %s\n", key, value);
                    wrote_option = TRUE;
                    g_free(copy);
                    continue;
                }
            }
            g_free(copy);
        }
        g_string_append_printf(updated, "%s\n", line);
    }
    if (in_section && !wrote_option) {
        g_string_append_printf(updated, "%s = %s\n", key, value);
        wrote_option = TRUE;
    }
    if (!have_section)
        g_string_append_printf(updated, "\n[%s]\n%s = %s\n", section, key, value);
    gboolean ok = g_file_set_contents(path, updated->str, updated->len, error);
    g_string_free(updated, TRUE); g_strfreev(lines); g_free(contents); g_free(path); g_free(backup);
    return ok;
}

static void save_setting(Settings *settings, const char *key, const char *value) {
    GError *error = NULL;
    if (save_wayfire_option("input", key, value, &error))
        gtk_label_set_text(GTK_LABEL(settings->status), "Saved to wayfire.ini. Wayfire reloads changed settings automatically when supported.");
    else {
        gtk_label_set_text(GTK_LABEL(settings->status), error ? error->message : "Could not save the Wayfire setting.");
        g_clear_error(&error);
    }
}

static void setting_binding_free(gpointer data) {
    SettingBinding *binding = data;
    g_free(binding->key); g_free(binding);
}

static SettingBinding *setting_binding(Settings *settings, GtkWidget *widget, const char *key) {
    SettingBinding *binding = g_new0(SettingBinding, 1);
    binding->settings = settings; binding->key = g_strdup(key);
    g_object_set_data_full(G_OBJECT(widget), "wayfire-setting", binding, setting_binding_free);
    return binding;
}

static void on_input_switch_changed(GtkSwitch *control, GParamSpec *pspec, gpointer data) {
    (void)pspec;
    SettingBinding *binding = data;
    save_setting(binding->settings, binding->key, gtk_switch_get_active(control) ? "true" : "false");
}

static void on_input_scale_changed(GtkRange *control, gpointer data) {
    SettingBinding *binding = data;
    char value[G_ASCII_DTOSTR_BUF_SIZE];
    g_ascii_formatd(value, sizeof(value), "%.2f", gtk_range_get_value(control));
    save_setting(binding->settings, binding->key, value);
}

static void on_input_choice_changed(GObject *control, GParamSpec *pspec, gpointer data) {
    (void)pspec;
    SettingBinding *binding = data;
    guint selected = gtk_drop_down_get_selected(GTK_DROP_DOWN(control));
    char **values = g_object_get_data(G_OBJECT(control), "setting-values");
    if (values && values[selected]) save_setting(binding->settings, binding->key, values[selected]);
}

static GtkWidget *setting_row(Settings *settings, const char *title, GtkWidget *control) {
    GtkWidget *row = lui_setting_row_new(title, NULL, control);
    gtk_box_append(GTK_BOX(settings->content), row);
    return row;
}

static void append_switch(Settings *settings, const char *title, const char *key, gboolean fallback) {
    char *value = wayfire_option("input", key, fallback ? "true" : "false");
    GtkWidget *control = gtk_switch_new();
    gtk_switch_set_active(GTK_SWITCH(control), g_str_equal(value, "true") || g_str_equal(value, "1"));
    SettingBinding *binding = setting_binding(settings, control, key);
    g_signal_connect(control, "notify::active", G_CALLBACK(on_input_switch_changed), binding);
    setting_row(settings, title, control);
    g_free(value);
}

static void append_pointer_speed(Settings *settings) {
    char *value = wayfire_option("input", "mouse_cursor_speed", "0");
    GtkWidget *control = gtk_scale_new_with_range(GTK_ORIENTATION_HORIZONTAL, -1.0, 1.0, 0.05);
    gtk_widget_add_css_class(control, "audio-volume-scale");
    gtk_scale_set_draw_value(GTK_SCALE(control), FALSE);
    gtk_widget_set_hexpand(control, TRUE);
    gtk_widget_set_size_request(control, 220, -1);
    gtk_range_set_value(GTK_RANGE(control), g_ascii_strtod(value, NULL));
    SettingBinding *binding = setting_binding(settings, control, "mouse_cursor_speed");
    g_signal_connect(control, "value-changed", G_CALLBACK(on_input_scale_changed), binding);
    setting_row(settings, "Pointer speed", control);
    g_free(value);
}

static void append_choice(Settings *settings, const char *title, const char *key,
                          const char *fallback, const char *const labels[],
                          const char *const values[], guint count) {
    char *current = wayfire_option("input", key, fallback);
    GtkStringList *choices = gtk_string_list_new(NULL);
    guint selected = 0;
    char **stored_values = g_new0(char *, count + 1);
    for (guint i = 0; i < count; i++) {
        gtk_string_list_append(choices, labels[i]);
        stored_values[i] = g_strdup(values[i]);
        if (g_str_equal(current, values[i])) selected = i;
    }
    GtkWidget *control = gtk_drop_down_new(G_LIST_MODEL(choices), NULL);
    gtk_drop_down_set_selected(GTK_DROP_DOWN(control), selected);
    g_object_set_data_full(G_OBJECT(control), "setting-values", stored_values, (GDestroyNotify)g_strfreev);
    SettingBinding *binding = setting_binding(settings, control, key);
    g_signal_connect(control, "notify::selected", G_CALLBACK(on_input_choice_changed), binding);
    setting_row(settings, title, control);
    g_free(current);
}

static gboolean run_command(const char *const argv[], char **stdout_text, char **stderr_text, int *status) {
    GError *error = NULL;
    gboolean ok = g_spawn_sync(NULL, (char **)argv, NULL, G_SPAWN_SEARCH_PATH, NULL, NULL,
                               stdout_text, stderr_text, status, &error);
    if (!ok) {
        if (stderr_text) *stderr_text = g_strdup(error->message);
        g_clear_error(&error);
    }
    return ok;
}


static void update_item_free(gpointer data) {
    UpdateItem *item = data;
    g_free(item->name); g_free(item->source); g_free(item->installed);
    g_free(item->available); g_free(item->target); g_free(item->scope); g_free(item);
}

static void update_result_free(UpdateResult *result) {
    if (!result) return;
    g_free(result->text); g_ptr_array_unref(result->items); g_free(result);
}

static gboolean update_command(const char *const argv[], char **out, GString *summary,
                                const char *name, gboolean empty_exit_two) {
    char *program = g_find_program_in_path(argv[0]);
    if (!program) {
        g_string_append_printf(summary, "%s: %s is not installed. ", name, argv[0]);
        return FALSE;
    }
    g_free(program);
    char *err = NULL; int status = 0;
    gboolean spawned = run_command(argv, out, &err, &status);
    gboolean ok = spawned && WIFEXITED(status) &&
        (WEXITSTATUS(status) == 0 || (empty_exit_two && WEXITSTATUS(status) == 2));
    if (!ok) {
        char **lines = g_strsplit(err ? err : "", "\n", 2);
        g_string_append_printf(summary, "%s: %s. ", name,
            lines[0] && *lines[0] ? lines[0] : "check failed");
        g_strfreev(lines);
    }
    g_free(err);
    return ok;
}

static void collect_package_updates(UpdateResult *result, GString *summary,
                                     const char *source, const char *const argv[]) {
    char *out = NULL;
    if (update_command(argv, &out, summary, source, g_str_equal(source, "Pacman"))) {
        char **lines = g_strsplit(out ? out : "", "\n", -1);
        for (guint i = 0; lines[i]; i++) {
            char name[1024], installed[1024], available[1024];
            if (sscanf(lines[i], "%1023s %1023s -> %1023s", name, installed, available) != 3) continue;
            UpdateItem *item = g_new0(UpdateItem, 1);
            item->name = g_strdup(name); item->source = g_strdup(source);
            item->installed = g_strdup(installed); item->available = g_strdup(available);
            item->target = g_strdup(name); item->scope = g_strdup("");
            g_ptr_array_add(result->items, item);
        }
        g_strfreev(lines);
    }
    g_free(out);
}

static void collect_flatpak_updates(UpdateResult *result, GString *summary, const char *scope) {
    const char *list[] = {"flatpak", "list", scope, "--columns=ref,version", NULL};
    const char *pending[] = {"flatpak", "remote-ls", scope, "--updates",
                             "--columns=ref,version,name", NULL};
    char *installed_text = NULL, *pending_text = NULL;
    GHashTable *versions = g_hash_table_new_full(g_str_hash, g_str_equal, g_free, g_free);
    char *source = g_strdup_printf("Flatpak %s", scope + 2);
    if (update_command(list, &installed_text, summary, source, FALSE)) {
        char **lines = g_strsplit(installed_text ? installed_text : "", "\n", -1);
        for (guint i = 0; lines[i]; i++) {
            char **fields = g_strsplit(lines[i], "\t", 2);
            if (fields[0] && *fields[0])
                g_hash_table_insert(versions, g_strdup(fields[0]),
                    g_strdup(fields[1] && *fields[1] ? fields[1] : "Installed"));
            g_strfreev(fields);
        }
        g_strfreev(lines);
        if (g_hash_table_size(versions) > 0 &&
            update_command(pending, &pending_text, summary, source, FALSE)) {
            char **lines = g_strsplit(pending_text ? pending_text : "", "\n", -1);
            for (guint i = 0; lines[i]; i++) {
                char **fields = g_strsplit(lines[i], "\t", 3);
                if (g_strv_length(fields) >= 3 && *fields[0]) {
                    const char *version = g_hash_table_lookup(versions, fields[0]);
                    if (version) {
                        UpdateItem *item = g_new0(UpdateItem, 1);
                        item->name = g_strdup(*fields[2] ? fields[2] : fields[0]);
                        item->source = g_strdup("Flatpak"); item->installed = g_strdup(version);
                        item->available = g_strdup(*fields[1] ? fields[1] : "Latest commit");
                        item->target = g_strdup(fields[0]); item->scope = g_strdup(scope);
                        g_ptr_array_add(result->items, item);
                    }
                }
                g_strfreev(fields);
            }
            g_strfreev(lines);
        }
    }
    g_free(source); g_free(installed_text); g_free(pending_text); g_hash_table_unref(versions);
}

static void check_updates_worker(GTask *task, gpointer source, gpointer task_data, GCancellable *cancel) {
    (void)source; (void)task_data; (void)cancel;
    UpdateResult *result = g_new0(UpdateResult, 1);
    result->items = g_ptr_array_new_with_free_func(update_item_free);
    GString *summary = g_string_new(NULL);
    const char *pacman[] = {"checkupdates", "--nocolor", NULL};
    const char *aur[] = {"yay", "-Qua", "--color", "never", NULL};
    collect_package_updates(result, summary, "Pacman", pacman);
    collect_package_updates(result, summary, "AUR", aur);
    collect_flatpak_updates(result, summary, "--user");
    collect_flatpak_updates(result, summary, "--system");
    char *count = g_strdup_printf("%u update%s available.",
        result->items->len, result->items->len == 1 ? "" : "s");
    g_string_prepend(summary, count);
    g_free(count);
    result->text = g_string_free(summary, FALSE);
    g_task_return_pointer(task, result, (GDestroyNotify)update_result_free);
}

static void on_update_clicked(GtkButton *button, gpointer data) {
    Settings *settings = data;
    char **args = g_object_get_data(G_OBJECT(button), "update-args");
    static const char script[] =
        "trap 'code=$?; printf \"\\nFinished (exit %s). Refresh Updates in Settings when done.\\n\" \"$code\"; "
        "printf \"Press Enter to close…\"; read -r update_reply' EXIT\n"
        "case \"$1\" in\n"
        "all)\n"
        " if command -v yay >/dev/null 2>&1; then yay -Syu || exit $?;\n"
        " elif command -v pacman >/dev/null 2>&1; then sudo pacman -Syu || exit $?; fi\n"
        " if command -v flatpak >/dev/null 2>&1; then flatpak update || exit $?; fi;;\n"
        "Pacman) sudo pacman -Syu -- \"$2\";;\n"
        "AUR) yay -S --aur -- \"$2\";;\n"
        "Flatpak) flatpak update \"$3\" -- \"$2\";;\n"
        "esac\n";
    const char *terminals[] = {"ghostty", "foot", "kgx", "gnome-terminal", "konsole", "xterm", NULL};
    char *terminal = NULL; const char *terminal_name = NULL;
    for (guint i = 0; terminals[i] && !terminal; i++) {
        terminal = g_find_program_in_path(terminals[i]);
        if (terminal) terminal_name = terminals[i];
    }
    if (!terminal) {
        gtk_label_set_text(settings->updates, "No supported terminal found. Install Ghostty, Foot, Console, GNOME Terminal, Konsole, or xterm.");
        return;
    }
    const char *separator = g_str_equal(terminal_name, "kgx") ||
        g_str_equal(terminal_name, "gnome-terminal") ? "--" : "-e";
    char *argv[] = {terminal, (char *)separator, "sh", "-c", (char *)script, "liakos-update",
                    args[0], args[1], args[2], NULL};
    GError *error = NULL;
    if (!g_spawn_async(NULL, argv, NULL, G_SPAWN_SEARCH_PATH, NULL, NULL, NULL, &error)) {
        gtk_label_set_text(settings->updates, error->message);
        g_clear_error(&error);
    } else {
        gtk_label_set_text(settings->updates, "Update opened in your terminal. Refresh this list after it finishes.");
    }
    g_free(terminal);
}

static GtkWidget *update_button(Settings *settings, const char *title,
                                const char *source, const char *target, const char *scope) {
    GtkWidget *button = lui_button_new(title, LUI_BUTTON_NORMAL);
    char **args = g_new0(char *, 4);
    args[0] = g_strdup(source); args[1] = g_strdup(target); args[2] = g_strdup(scope);
    g_object_set_data_full(G_OBJECT(button), "update-args", args, (GDestroyNotify)g_strfreev);
    g_signal_connect(button, "clicked", G_CALLBACK(on_update_clicked), settings);
    return button;
}

static void update_cell(GtkGrid *grid, int column, int row, const char *text, gboolean heading) {
    GtkWidget *cell = label(text, heading ? "eyebrow" : NULL);
    gtk_widget_set_halign(cell, GTK_ALIGN_FILL);
    gtk_label_set_xalign(GTK_LABEL(cell), 0);
    gtk_label_set_ellipsize(GTK_LABEL(cell), PANGO_ELLIPSIZE_END);
    gtk_label_set_selectable(GTK_LABEL(cell), !heading);
    gtk_widget_set_hexpand(cell, column == 0);
    gtk_label_set_max_width_chars(GTK_LABEL(cell), column == 0 ? 40 : 22);
    int cell_padding = heading ? 10 : 12;
    gtk_widget_set_margin_top(cell, cell_padding);
    gtk_widget_set_margin_bottom(cell, cell_padding);
    gtk_widget_set_tooltip_text(cell, text);
    gtk_grid_attach(grid, cell, column, row, 1, 1);
}

static void render_update_table(Settings *settings) {
    if (settings->active != 4 || !settings->updates_table) return;
    GtkWidget *child;
    while ((child = gtk_widget_get_first_child(GTK_WIDGET(settings->updates_table))))
        gtk_grid_remove(settings->updates_table, child);
    const char *columns[] = {"Package", "Source", "Installed", "Available"};
    for (int col = 0; col < 4; col++) update_cell(settings->updates_table, col, 0, columns[col], TRUE);
    gtk_grid_attach(settings->updates_table, gtk_separator_new(GTK_ORIENTATION_HORIZONTAL), 0, 1, 5, 1);
    if (settings->update_result) {
        gtk_label_set_text(settings->updates, settings->update_result->text);
        for (guint i = 0; i < settings->update_result->items->len; i++) {
            UpdateItem *item = g_ptr_array_index(settings->update_result->items, i);
            int row = 2 + (int)i * 2;
            char *source = g_str_equal(item->source, "Flatpak") ?
                g_strdup_printf("Flatpak (%s)", item->scope + 2) : g_strdup(item->source);
            update_cell(settings->updates_table, 0, row, item->name, FALSE);
            update_cell(settings->updates_table, 1, row, source, FALSE);
            update_cell(settings->updates_table, 2, row, item->installed, FALSE);
            update_cell(settings->updates_table, 3, row, item->available, FALSE);
            if (!g_str_equal(item->source, "Pacman")) {
                GtkWidget *button = update_button(settings, "Update",
                    item->source, item->target, item->scope);
                gtk_widget_set_valign(button, GTK_ALIGN_CENTER);
                gtk_grid_attach(settings->updates_table, button, 4, row, 1, 1);
            }
            gtk_grid_attach(settings->updates_table, gtk_separator_new(GTK_ORIENTATION_HORIZONTAL), 0, row + 1, 5, 1);
            g_free(source);
        }
    }
    if (settings->checking_updates)
        gtk_label_set_text(settings->updates, "Checking repository, AUR, and Flatpak updates…");
    gtk_widget_set_sensitive(settings->refresh_updates, !settings->checking_updates);
    gtk_widget_set_sensitive(settings->update_all, !settings->checking_updates &&
        settings->update_result && settings->update_result->items->len > 0);
}

static void on_updates_finished(GObject *source, GAsyncResult *result, gpointer data) {
    (void)source;
    Settings *settings = data;
    GError *error = NULL;
    UpdateResult *updates = g_task_propagate_pointer(G_TASK(result), &error);
    settings->checking_updates = FALSE;
    if (updates) {
        update_result_free(settings->update_result);
        settings->update_result = updates;
    }
    render_update_table(settings);
    if (error && settings->active == 5 && settings->updates)
        gtk_label_set_text(settings->updates, error->message);
    g_clear_error(&error);
}

static void start_update_check(Settings *settings) {
    if (settings->checking_updates) return;
    settings->checking_updates = TRUE;
    render_update_table(settings);
    GTask *task = g_task_new(NULL, NULL, on_updates_finished, settings);
    g_task_run_in_thread(task, check_updates_worker);
    g_object_unref(task);
}

static void on_refresh_updates(GtkButton *button, gpointer data) {
    (void)button;
    start_update_check(data);
}

static void add_updates_page(Settings *settings) {
    page_title(settings, "Updates", "Available software updates across your system.");
    GtkWidget *actions = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
    settings->updates = GTK_LABEL(label("Check for available updates.", "lui-subtitle"));
    gtk_widget_set_halign(GTK_WIDGET(settings->updates), GTK_ALIGN_FILL);
    gtk_label_set_xalign(settings->updates, 0);
    gtk_label_set_wrap(settings->updates, TRUE);
    gtk_box_append(GTK_BOX(settings->content), GTK_WIDGET(settings->updates));
    settings->refresh_updates = lui_button_new("Refresh", LUI_BUTTON_NORMAL);
    g_signal_connect(settings->refresh_updates, "clicked", G_CALLBACK(on_refresh_updates), settings);
    settings->update_all = update_button(settings, "Update all", "all", "", "");
    gtk_widget_add_css_class(settings->update_all, "suggested-action");
    gtk_box_append(GTK_BOX(actions), settings->refresh_updates);
    gtk_box_append(GTK_BOX(actions), settings->update_all);
    gtk_box_append(GTK_BOX(settings->content), actions);
    settings->updates_table = GTK_GRID(lui_grid_new());
    gtk_grid_set_column_spacing(settings->updates_table, 18);
    gtk_widget_set_hexpand(GTK_WIDGET(settings->updates_table), TRUE);
    gtk_box_append(GTK_BOX(settings->content), GTK_WIDGET(settings->updates_table));
    render_update_table(settings);
    if (!settings->updates_started) {
        settings->updates_started = TRUE;
        start_update_check(settings);
    }
}

static void clear_content(Settings *settings) {
    GtkWidget *child;
    while ((child = gtk_widget_get_first_child(settings->content)))
        gtk_box_remove(GTK_BOX(settings->content), child);
}

static void add_mouse_page(Settings *settings) {
    page_title(settings, "Mouse & Touchpad", "Adjust pointer movement, buttons, and touchpad behavior.");
    static const char *profiles[] = {"Default", "None", "Adaptive", "Flat"};
    static const char *profile_values[] = {"default", "none", "adaptive", "flat"};
    gtk_box_append(GTK_BOX(settings->content), label("Pointer", "lui-heading"));
    append_pointer_speed(settings);
    append_choice(settings, "Acceleration profile", "mouse_accel_profile", "default", profiles, profile_values, G_N_ELEMENTS(profiles));
    gtk_box_append(GTK_BOX(settings->content), label("Buttons & scrolling", "lui-heading"));
    append_switch(settings, "Left-handed buttons", "left_handed_mode", FALSE);
    append_switch(settings, "Mouse natural scrolling", "mouse_natural_scroll", FALSE);
    append_switch(settings, "Middle-button emulation", "middle_emulation", FALSE);
    gtk_box_append(GTK_BOX(settings->content), label("Touchpad", "lui-heading"));
    append_switch(settings, "Touchpad natural scrolling", "natural_scroll", FALSE);
    append_switch(settings, "Touchpad tap to click", "tap_to_click", TRUE);
    append_switch(settings, "Disable touchpad while typing", "disable_touchpad_while_typing", FALSE);
    append_status(settings);
}

static void add_overview_page(Settings *settings) {
    GtkWidget *hero = lui_box_new(GTK_ORIENTATION_VERTICAL, 12);
    gtk_widget_add_css_class(hero, "welcome-hero");
    gtk_box_append(GTK_BOX(hero), label("Welcome to LiakOS", "welcome-title"));
    GtkWidget *about = label("LiakOS is a personal Linux desktop built around Wayfire,\nwith a focused set of tools for shaping your workspace.", "lui-subtitle");
    gtk_label_set_justify(GTK_LABEL(about), GTK_JUSTIFY_LEFT);
    gtk_label_set_wrap(GTK_LABEL(about), TRUE);
    gtk_box_append(GTK_BOX(hero), about);
    gtk_box_append(GTK_BOX(settings->content), hero);

    gtk_box_append(GTK_BOX(settings->content), label("Quick actions", "lui-heading"));
    GtkWidget *quick_actions = lui_box_new(GTK_ORIENTATION_VERTICAL, 0);
    gtk_box_append(GTK_BOX(quick_actions), quick_tile(settings, "Choose wallpaper", "Set your background and colors", "preferences-desktop-wallpaper-symbolic", "lpaper"));
    gtk_box_append(GTK_BOX(quick_actions), quick_tile(settings, "Edit shortcuts", "Search and change keybindings", "preferences-desktop-keyboard-shortcuts-symbolic", "lkeybinds"));
    gtk_box_append(GTK_BOX(settings->content), quick_actions);
    append_status(settings);
}

static void add_displays_page(Settings *settings) {
    page_title(settings, "Displays", "Arrange screens and manage display profiles.");
    char *out = NULL, *err = NULL; int status = 0;
    const char *argv[] = {"wlr-randr", NULL};
    if (run_command(argv, &out, &err, &status) && out && *out) {
        GtkWidget *summary = info_card("Connected displays", out);
        gtk_box_append(GTK_BOX(settings->content), summary);
    } else {
        gtk_box_append(GTK_BOX(settings->content), info_card("Display status", err && *err ? err : "Could not read connected displays. The display manager can still be opened."));
    }
    g_free(out); g_free(err);
    append_action(settings, "Open display setup", "ldisplays");
    gtk_box_append(GTK_BOX(settings->content), info_card("Display setup", "Choose resolution and refresh rate, adjust scale and rotation, arrange your screens, and save display profiles."));
    append_status(settings);
}

static const char *audio_node_title(AstalWpNode *node) {
    const char *description = astal_wp_node_get_description(node);
    if (description && *description) return description;
    const char *name = astal_wp_node_get_name(node);
    return name && *name ? name : "Audio device";
}

static gboolean widget_syncing(GtkWidget *widget) {
    return GPOINTER_TO_INT(g_object_get_data(G_OBJECT(widget), "syncing"));
}

static void sync_audio_volume(AstalWpNode *node, GParamSpec *pspec, gpointer data) {
    (void)pspec;
    GtkRange *scale = GTK_RANGE(data);
    g_object_set_data(G_OBJECT(scale), "syncing", GINT_TO_POINTER(TRUE));
    gtk_range_set_value(scale, astal_wp_node_get_volume(node));
    g_object_set_data(G_OBJECT(scale), "syncing", GINT_TO_POINTER(FALSE));
}

static void on_audio_volume_changed(GtkRange *scale, gpointer data) {
    if (!widget_syncing(GTK_WIDGET(scale)))
        astal_wp_node_set_volume(ASTAL_WP_NODE(data), gtk_range_get_value(scale));
}

static void sync_audio_mute(AstalWpNode *node, GParamSpec *pspec, gpointer data) {
    (void)pspec;
    GtkToggleButton *button = GTK_TOGGLE_BUTTON(data);
    gboolean muted = astal_wp_node_get_mute(node);
    GtkWidget *icon = gtk_button_get_child(GTK_BUTTON(button));
    g_object_set_data(G_OBJECT(button), "syncing", GINT_TO_POINTER(TRUE));
    gtk_toggle_button_set_active(button, muted);
    if (GTK_IS_IMAGE(icon))
        gtk_image_set_from_icon_name(GTK_IMAGE(icon), muted ? "audio-volume-muted-symbolic" : "audio-volume-high-symbolic");
    g_object_set_data(G_OBJECT(button), "syncing", GINT_TO_POINTER(FALSE));
}

static void on_audio_mute_toggled(GtkToggleButton *button, gpointer data) {
    if (!widget_syncing(GTK_WIDGET(button)))
        astal_wp_node_set_mute(ASTAL_WP_NODE(data), gtk_toggle_button_get_active(button));
}

static GtkWidget *audio_node_row(AstalWpNode *node, gboolean master) {
    GtkWidget *row = lui_box_new(GTK_ORIENTATION_VERTICAL, 6);
    gtk_widget_add_css_class(row, "audio-stream-row");
    if (master) gtk_widget_add_css_class(row, "audio-master-row");
    GtkWidget *header = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
    if (!master) {
        GtkWidget *icon = gtk_image_new_from_icon_name("audio-x-generic-symbolic");
        GtkWidget *title = label(audio_node_title(node), NULL);
        gtk_widget_set_halign(title, GTK_ALIGN_START);
        gtk_widget_set_hexpand(title, TRUE);
        gtk_label_set_ellipsize(GTK_LABEL(title), PANGO_ELLIPSIZE_END);
        gtk_box_append(GTK_BOX(header), icon);
        gtk_box_append(GTK_BOX(header), title);
    }
    GtkWidget *mute = gtk_toggle_button_new();
    gtk_widget_add_css_class(mute, "audio-button");
    gtk_button_set_child(GTK_BUTTON(mute), gtk_image_new_from_icon_name("audio-volume-high-symbolic"));
    g_object_set_data_full(G_OBJECT(mute), "audio-node", g_object_ref(node), g_object_unref);
    g_signal_connect(mute, "toggled", G_CALLBACK(on_audio_mute_toggled), node);
    g_signal_connect_object(node, "notify::mute", G_CALLBACK(sync_audio_mute), mute, 0);
    sync_audio_mute(node, NULL, mute);

    GtkWidget *scale = gtk_scale_new_with_range(GTK_ORIENTATION_HORIZONTAL, 0, 1.5, 0.01);
    gtk_widget_add_css_class(scale, "audio-volume-scale");
    gtk_scale_set_draw_value(GTK_SCALE(scale), FALSE);
    gtk_widget_set_hexpand(scale, TRUE);
    gtk_range_set_value(GTK_RANGE(scale), astal_wp_node_get_volume(node));
    g_object_set_data_full(G_OBJECT(scale), "audio-node", g_object_ref(node), g_object_unref);
    g_signal_connect(scale, "value-changed", G_CALLBACK(on_audio_volume_changed), node);
    g_signal_connect_object(node, "notify::volume", G_CALLBACK(sync_audio_volume), scale, 0);

    if (master) {
        gtk_box_append(GTK_BOX(header), scale);
        gtk_box_append(GTK_BOX(header), mute);
        gtk_box_append(GTK_BOX(row), header);
    } else {
        gtk_box_append(GTK_BOX(header), mute);
        gtk_box_append(GTK_BOX(row), header);
        gtk_box_append(GTK_BOX(row), scale);
    }
    return row;
}

static void on_audio_endpoint_clicked(GtkButton *button, gpointer data) {
    (void)button;
    astal_wp_endpoint_set_is_default(ASTAL_WP_ENDPOINT(data), TRUE);
}

static GtkWidget *audio_endpoint_card(AstalWpEndpoint *endpoint) {
    GtkWidget *card = lui_box_new(GTK_ORIENTATION_VERTICAL, 8);
    gtk_widget_add_css_class(card, "audio-panel");
    GtkWidget *select = lui_button_new(NULL, LUI_BUTTON_NORMAL);
    gtk_widget_add_css_class(select, "device-row");
    if (astal_wp_endpoint_get_is_default(endpoint)) gtk_widget_add_css_class(select, "selected");
    GtkWidget *line = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
    GtkWidget *icon = gtk_image_new_from_icon_name(astal_wp_node_get_icon(ASTAL_WP_NODE(endpoint)) ?: "audio-card-symbolic");
    GtkWidget *name = label(audio_node_title(ASTAL_WP_NODE(endpoint)), NULL);
    gtk_widget_set_halign(name, GTK_ALIGN_START);
    gtk_label_set_ellipsize(GTK_LABEL(name), PANGO_ELLIPSIZE_END);
    gtk_widget_set_hexpand(name, TRUE);
    gtk_box_append(GTK_BOX(line), icon);
    gtk_box_append(GTK_BOX(line), name);
    if (astal_wp_endpoint_get_is_default(endpoint))
        gtk_box_append(GTK_BOX(line), gtk_image_new_from_icon_name("emblem-ok-symbolic"));
    else
        gtk_box_append(GTK_BOX(line), label("Use as default", "lui-subtitle"));
    gtk_button_set_child(GTK_BUTTON(select), line);
    g_object_set_data_full(G_OBJECT(select), "audio-endpoint", g_object_ref(endpoint), g_object_unref);
    g_signal_connect(select, "clicked", G_CALLBACK(on_audio_endpoint_clicked), endpoint);
    gtk_box_append(GTK_BOX(card), select);
    gtk_box_append(GTK_BOX(card), audio_node_row(ASTAL_WP_NODE(endpoint), TRUE));
    return card;
}

static void append_audio_section(GtkWidget *list, const char *title, GList *nodes, gboolean streams) {
    gtk_box_append(GTK_BOX(list), label(title, "audio-section-title"));
    if (!nodes) {
        gtk_box_append(GTK_BOX(list), info_card("", streams ? "No apps are playing audio right now." : "No devices available."));
        return;
    }
    for (GList *item = nodes; item; item = item->next) {
        AstalWpNode *node = ASTAL_WP_NODE(item->data);
        if (streams) {
            if (astal_wp_stream_get_media_category(ASTAL_WP_STREAM(node)) == ASTAL_WP_MEDIA_CATEGORY_MONITOR) continue;
            const char *title = audio_node_title(node);
            char *normalized = title ? g_ascii_strdown(title, -1) : g_strdup("");
            gboolean internal = g_strrstr(normalized, "monitor") || g_strrstr(normalized, "loopback");
            g_free(normalized);
            if (internal) continue;
            gtk_box_append(GTK_BOX(list), audio_node_row(node, FALSE));
        } else {
            gtk_box_append(GTK_BOX(list), audio_endpoint_card(ASTAL_WP_ENDPOINT(node)));
        }
    }
    g_list_free(nodes);
}

static void rebuild_sound_page(Settings *settings) {
    if (!settings->sound_list) return;
    GtkWidget *child;
    while ((child = gtk_widget_get_first_child(settings->sound_list)))
        gtk_box_remove(GTK_BOX(settings->sound_list), child);
    if (!settings->audio) {
        gtk_box_append(GTK_BOX(settings->sound_list), info_card("Audio unavailable", "WirePlumber could not be reached."));
        return;
    }
    GList *streams = astal_wp_audio_get_streams(settings->audio);
    GList *speakers = astal_wp_audio_get_speakers(settings->audio);
    GList *microphones = astal_wp_audio_get_microphones(settings->audio);
    append_audio_section(settings->sound_list, "APPLICATION VOLUME", streams, TRUE);
    append_audio_section(settings->sound_list, "OUTPUT DEVICES", speakers, FALSE);
    append_audio_section(settings->sound_list, "INPUT DEVICES", microphones, FALSE);
}

static void on_audio_collection_changed(GObject *audio, GParamSpec *pspec, gpointer data) {
    (void)audio; (void)pspec;
    Settings *settings = data;
    if (settings->active == 3) rebuild_sound_page(settings);
}

static void add_sound_page(Settings *settings) {
    page_title(settings, "Sound", "App volume, playback devices, and microphones.");
    settings->sound_list = lui_box_new(GTK_ORIENTATION_VERTICAL, 12);
    gtk_box_append(GTK_BOX(settings->content), settings->sound_list);
    rebuild_sound_page(settings);
}

static void add_transit_page(Settings *settings) {
    page_title(settings, "Transit", "Manage the OASA lines shown in your top bar.");
    char *path = g_build_filename(g_get_user_config_dir(), "ags", "oasa-line", NULL);
    char *contents = NULL;
    char *selected = NULL;
    if (g_file_get_contents(path, &contents, NULL, NULL) && contents && contents[0] == '[') {
        JsonParser *parser = json_parser_new();
        if (json_parser_load_from_data(parser, contents, -1, NULL)) {
            JsonArray *array = json_node_get_array(json_parser_get_root(parser));
            GString *joined = g_string_new(NULL);
            for (guint i = 0; array && i < json_array_get_length(array); i++) {
                const char *line = json_array_get_string_element(array, i);
                if (!line) continue;
                if (joined->len) g_string_append(joined, ", ");
                g_string_append(joined, line);
            }
            selected = g_string_free(joined, FALSE);
        }
        g_object_unref(parser);
    } else if (contents && *contents) {
        selected = g_strdup(contents);
    }
    if (!selected || !*selected) {
        g_free(selected);
        selected = g_strdup("524");
    }
    g_free(contents); g_free(path);
    char *summary = g_strdup_printf("Selected lines: %s", selected);
    gtk_box_append(GTK_BOX(settings->content), info_card("Selected lines", summary));
    gtk_box_append(GTK_BOX(settings->content), info_card("Change selection", "Right click the bus icon on the top bar to search the OASA line dropdown. Click a selected line chip to remove it; add as many lines as you like."));
    gtk_box_append(GTK_BOX(settings->content), info_card("Local line catalog", "The OASA catalog is cached locally and refreshed weekly. Line IDs are validated against this catalog before they are added."));
    g_free(summary); g_free(selected);
}

static void about_row(GtkGrid *grid, int row, const char *key, const char *value) {
    GtkWidget *key_label = label(key, "about-key");
    GtkWidget *value_label = label(value, NULL);
    gtk_label_set_xalign(GTK_LABEL(key_label), 0);
    gtk_label_set_xalign(GTK_LABEL(value_label), 0);
    gtk_widget_set_hexpand(value_label, TRUE);
    gtk_widget_set_halign(key_label, GTK_ALIGN_START);
    gtk_widget_set_halign(value_label, GTK_ALIGN_START);
    gtk_grid_attach(grid, key_label, 0, row * 2, 1, 1);
    gtk_grid_attach(grid, value_label, 1, row * 2, 1, 1);
    if (row < 4)
        gtk_grid_attach(grid, gtk_separator_new(GTK_ORIENTATION_HORIZONTAL), 0, row * 2 + 1, 2, 1);
}

static void add_about_page(Settings *settings) {
    page_title(settings, "About", "System information");
    struct utsname info;
    memset(&info, 0, sizeof(info));
    uname(&info);
    GtkWidget *table = lui_grid_new();
    gtk_widget_add_css_class(table, "about-table");
    gtk_grid_set_row_spacing(GTK_GRID(table), 16);
    gtk_grid_set_column_spacing(GTK_GRID(table), 50);
    about_row(GTK_GRID(table), 0, "Operating system", "LiakOS");
    about_row(GTK_GRID(table), 1, "Kernel", info.release);
    about_row(GTK_GRID(table), 2, "Architecture", info.machine);
    about_row(GTK_GRID(table), 3, "Desktop", "Wayfire");
    char *gtk_version = g_strdup_printf("%d.%d.%d", GTK_MAJOR_VERSION, GTK_MINOR_VERSION, GTK_MICRO_VERSION);
    about_row(GTK_GRID(table), 4, "GTK", gtk_version);
    gtk_box_append(GTK_BOX(settings->content), table);
    g_free(gtk_version);
}

static void show_section(Settings *settings, guint index) {
    settings->active = index;
    GtkListBoxRow *selected = gtk_list_box_get_row_at_index(settings->navigation, (int)index);
    if (selected) gtk_list_box_select_row(settings->navigation, selected);
    clear_content(settings);
    settings->status = NULL;
    settings->sound_list = NULL;
    settings->updates = NULL;
    settings->refresh_updates = NULL;
    settings->update_all = NULL;
    settings->updates_table = NULL;
    switch (index) {
    case 0: add_overview_page(settings); break;
    case 1: add_displays_page(settings); break;
    case 2: add_mouse_page(settings); break;
    case 3: add_sound_page(settings); break;
    case 4: add_transit_page(settings); break;
    case 5: add_updates_page(settings); break;
    case 6: add_about_page(settings); break;
    default: break;
    }
}

static void on_nav_selected(GtkListBox *list, GtkListBoxRow *row, gpointer data) {
    (void)list;
    if (!row) return;
    Settings *settings = data;
    guint index = GPOINTER_TO_UINT(g_object_get_data(G_OBJECT(row), "section-index"));
    if (settings->active != index || gtk_widget_get_first_child(settings->content) == NULL)
        show_section(settings, index);
}

static void on_sidebar_toggle(GtkButton *button, gpointer data) {
    (void)button;
    Settings *settings = data;
    gboolean visible = gtk_widget_get_visible(settings->sidebar);
    gtk_widget_set_visible(settings->sidebar, !visible);
    gtk_button_set_icon_name(GTK_BUTTON(settings->toggle), visible ? "sidebar-show-symbolic" : "go-previous-symbolic");
    lui_icon_button_set_label(settings->toggle, visible ? "Show categories" : "Hide categories");
}

static void activate(GtkApplication *app, gpointer data) {
    lui_init(LUI_STYLE_SETTINGS);
    (void)data;
    Settings *settings = g_new0(Settings, 1);
    settings->window = GTK_WINDOW(gtk_application_window_new(app));
    gtk_window_set_title(settings->window, "LiakOS Settings");
    gtk_window_set_default_size(settings->window, 1020, 700);
    gtk_widget_set_size_request(GTK_WIDGET(settings->window), 720, 500);

    AstalWpWp *wireplumber = astal_wp_wp_get_default();
    settings->audio = astal_wp_wp_get_audio(wireplumber);
    if (settings->audio) {
        g_signal_connect(settings->audio, "notify::streams", G_CALLBACK(on_audio_collection_changed), settings);
        g_signal_connect(settings->audio, "notify::speakers", G_CALLBACK(on_audio_collection_changed), settings);
        g_signal_connect(settings->audio, "notify::microphones", G_CALLBACK(on_audio_collection_changed), settings);
        g_signal_connect(settings->audio, "notify::default-speaker", G_CALLBACK(on_audio_collection_changed), settings);
        g_signal_connect(settings->audio, "notify::default-microphone", G_CALLBACK(on_audio_collection_changed), settings);
    }

    GtkWidget *root = lui_box_new(GTK_ORIENTATION_VERTICAL, 0);
    GtkWidget *toolbar = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 12);
    gtk_widget_set_margin_start(toolbar, 14); gtk_widget_set_margin_end(toolbar, 14);
    gtk_widget_set_margin_top(toolbar, 10); gtk_widget_set_margin_bottom(toolbar, 10);
    settings->toggle = lui_icon_button_new("go-previous-symbolic", "Hide categories");
    g_signal_connect(settings->toggle, "clicked", G_CALLBACK(on_sidebar_toggle), settings);
    gtk_box_append(GTK_BOX(toolbar), settings->toggle);
    GtkWidget *app_name = label("LiakOS Settings", "brand");
    gtk_box_append(GTK_BOX(toolbar), app_name);
    gtk_box_append(GTK_BOX(root), toolbar);

    GtkWidget *body = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 0);
    settings->sidebar = lui_box_new(GTK_ORIENTATION_VERTICAL, 5);
    gtk_widget_add_css_class(settings->sidebar, "sidebar");
    gtk_widget_set_size_request(settings->sidebar, 236, -1);
    gtk_widget_set_margin_start(settings->sidebar, 12); gtk_widget_set_margin_end(settings->sidebar, 12);
    gtk_widget_set_margin_top(settings->sidebar, 12); gtk_widget_set_margin_bottom(settings->sidebar, 12);
    settings->navigation = GTK_LIST_BOX(gtk_list_box_new());
    gtk_widget_add_css_class(GTK_WIDGET(settings->navigation), "nav-list");
    gtk_list_box_set_selection_mode(settings->navigation, GTK_SELECTION_SINGLE);
    gtk_list_box_set_show_separators(settings->navigation, FALSE);
    g_signal_connect(settings->navigation, "row-selected", G_CALLBACK(on_nav_selected), settings);
    for (guint i = 0; i < G_N_ELEMENTS(sections); i++) {
        GtkWidget *row = gtk_list_box_row_new();
        GtkWidget *name = label(sections[i], NULL);
        gtk_widget_set_hexpand(name, TRUE);
        gtk_list_box_row_set_child(GTK_LIST_BOX_ROW(row), name);
        g_object_set_data(G_OBJECT(row), "section-index", GUINT_TO_POINTER(i));
        gtk_list_box_append(settings->navigation, row);
    }
    gtk_box_append(GTK_BOX(settings->sidebar), GTK_WIDGET(settings->navigation));
    gtk_box_append(GTK_BOX(body), settings->sidebar);

    GtkWidget *scroll = gtk_scrolled_window_new();
    gtk_widget_set_hexpand(scroll, TRUE); gtk_widget_set_vexpand(scroll, TRUE);
    settings->content = lui_page_new();
    gtk_widget_set_valign(settings->content, GTK_ALIGN_START);
    gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scroll), GTK_POLICY_NEVER, GTK_POLICY_AUTOMATIC);
    gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll), settings->content);
    gtk_box_append(GTK_BOX(body), scroll);
    gtk_box_append(GTK_BOX(root), body);
    gtk_window_set_child(settings->window, root);
    show_section(settings, 0);
    gtk_window_present(settings->window);
}

int main(int argc, char **argv) {
    GtkApplication *app = gtk_application_new("org.liakos.Settings", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    lui_shutdown();
    g_object_unref(app);
    return status;
}
