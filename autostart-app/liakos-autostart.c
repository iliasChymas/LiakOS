#define _GNU_SOURCE
#include <gtk/gtk.h>
#include "../lui/lui.h"
#include <gio/gdesktopappinfo.h>
#include <glib/gstdio.h>
#include <sys/stat.h>
#include <errno.h>
#include <string.h>

#define KEY_PREFIX "liakos_app_"

typedef struct {
    char *id, *name, *description, *icon_name, *command;
    gboolean enabled;
} Application;

typedef struct {
    GtkApplication *application;
    GtkWindow *window;
    GtkListBox *list;
    GtkSearchEntry *search;
    GtkSwitch *enabled_only;
    GtkLabel *status;
    GtkWidget *save_button;
    GPtrArray *applications;
    char *config_path;
} App;

static void rebuild_rows(App *app);

static void application_free(gpointer data) {
    Application *application = data;
    g_free(application->id); g_free(application->name); g_free(application->description);
    g_free(application->icon_name); g_free(application->command); g_free(application);
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

static char *application_key(const char *desktop_id) {
    char *digest = g_compute_checksum_for_string(G_CHECKSUM_SHA256, desktop_id, -1);
    char *key = g_strconcat(KEY_PREFIX, digest, NULL);
    g_free(digest);
    return key;
}

/* Desktop Exec syntax is argv-like, but its field codes are not shell variables.
 * Expand the useful scalar codes, discard file/URL placeholders (there is no
 * document at login), and quote each argument for Wayfire's shell command. */
static char *desktop_command(GDesktopAppInfo *info) {
    const char *exec = g_app_info_get_commandline(G_APP_INFO(info));
    if (!exec || !*exec) return NULL;
    gint argc = 0;
    gchar **argv = NULL;
    if (!g_shell_parse_argv(exec, &argc, &argv, NULL) || argc == 0) {
        g_strfreev(argv); return NULL;
    }
    GString *command = g_string_new(NULL);
    const char *name = g_app_info_get_name(G_APP_INFO(info));
    char *icon_name = g_desktop_app_info_get_string(info, "Icon");
    for (gint i = 0; i < argc; i++) {
        const char *arg = argv[i];
        if (!strcmp(arg, "%f") || !strcmp(arg, "%F") || !strcmp(arg, "%u") || !strcmp(arg, "%U")) continue;
        if (!strcmp(arg, "%i")) {
            if (icon_name && *icon_name) {
                if (command->len) g_string_append_c(command, ' ');
                char *quoted = g_shell_quote("--icon"); g_string_append(command, quoted); g_free(quoted);
                g_string_append_c(command, ' '); quoted = g_shell_quote(icon_name); g_string_append(command, quoted); g_free(quoted);
            }
            continue;
        }
        GString *expanded = g_string_new(NULL);
        for (const char *p = arg; *p; p++) {
            if (*p != '%' || !p[1]) { g_string_append_c(expanded, *p); continue; }
            p++;
            if (*p == '%') g_string_append_c(expanded, '%');
            else if (*p == 'c') g_string_append(expanded, name ? name : "");
            else if (*p == 'k') {
                const char *filename = g_desktop_app_info_get_filename(info);
                if (filename) g_string_append(expanded, filename);
            }
            /* Unknown and file/URL field codes have no useful login value. */
        }
        if (expanded->len) {
            if (command->len) g_string_append_c(command, ' ');
            char *quoted = g_shell_quote(expanded->str); g_string_append(command, quoted); g_free(quoted);
        }
        g_string_free(expanded, TRUE);
    }
    g_free(icon_name); g_strfreev(argv);
    if (!command->len) { g_string_free(command, TRUE); return NULL; }
    return g_string_free(command, FALSE);
}

static gboolean config_enabled(const char *contents, const char *key) {
    gchar **lines = g_strsplit(contents, "\n", -1);
    gboolean in_section = FALSE, enabled = FALSE;
    for (guint i = 0; lines[i]; i++) {
        char *line = g_strstrip(lines[i]);
        if (*line == '[') { in_section = g_str_equal(line, "[autostart]"); continue; }
        if (!in_section || !*line || *line == '#' || *line == ';') continue;
        char *equal = strchr(line, '=');
        if (!equal) continue;
        *equal = '\0'; g_strstrip(line);
        if (g_str_equal(line, key)) { enabled = TRUE; break; }
    }
    g_strfreev(lines); return enabled;
}

static void load_applications(App *app) {
    char *contents = NULL;
    g_file_get_contents(app->config_path, &contents, NULL, NULL);
    GList *installed = g_app_info_get_all();
    GHashTable *seen = g_hash_table_new(g_str_hash, g_str_equal);
    for (GList *node = installed; node; node = node->next) {
        GAppInfo *base = node->data;
        if (!G_IS_DESKTOP_APP_INFO(base) || !g_app_info_should_show(base)) continue;
        const char *id = g_app_info_get_id(base);
        if (!id || g_hash_table_contains(seen, id)) continue;
        g_hash_table_add(seen, (gpointer)id);
        Application *entry = g_new0(Application, 1);
        entry->id = g_strdup(id); entry->name = g_strdup(g_app_info_get_name(base));
        entry->description = g_strdup(g_app_info_get_description(base));
        entry->icon_name = g_desktop_app_info_get_string(G_DESKTOP_APP_INFO(base), "Icon");
        entry->command = desktop_command(G_DESKTOP_APP_INFO(base));
        if (!entry->command) { application_free(entry); continue; }
        char *key = application_key(id);
        entry->enabled = contents && config_enabled(contents, key);
        g_free(key);
        g_ptr_array_add(app->applications, entry);
    }
    g_hash_table_unref(seen); g_list_free_full(installed, g_object_unref); g_free(contents);
    for (guint i = 0; i < app->applications->len; i++) {
        for (guint j = i + 1; j < app->applications->len; j++) {
            Application *a = g_ptr_array_index(app->applications, i), *b = g_ptr_array_index(app->applications, j);
            if (g_utf8_collate(a->name, b->name) > 0) {
                app->applications->pdata[i] = b; app->applications->pdata[j] = a;
            }
        }
    }
}

static void toggle_changed(GObject *object, GParamSpec *pspec, gpointer data) {
    (void)pspec;
    Application *entry = g_object_get_data(object, "application-entry");
    entry->enabled = gtk_switch_get_active(GTK_SWITCH(object));
    App *app = data;
    if (gtk_switch_get_active(app->enabled_only)) rebuild_rows(app);
}

static void rebuild_rows(App *app) {
    GtkWidget *child;
    while ((child = gtk_widget_get_first_child(GTK_WIDGET(app->list)))) gtk_list_box_remove(app->list, child);
    const char *query = gtk_editable_get_text(GTK_EDITABLE(app->search));
    char *folded_query = g_utf8_casefold(query ? query : "", -1);
    guint shown = 0;
    for (guint i = 0; i < app->applications->len; i++) {
        Application *entry = g_ptr_array_index(app->applications, i);
        if (gtk_switch_get_active(app->enabled_only) && !entry->enabled) continue;
        char *folded_name = g_utf8_casefold(entry->name, -1);
        char *folded_description = g_utf8_casefold(entry->description ? entry->description : "", -1);
        gboolean match = !*folded_query || strstr(folded_name, folded_query) || strstr(folded_description, folded_query);
        g_free(folded_name); g_free(folded_description);
        if (!match) continue;
        GtkWidget *row = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 12);
        gtk_widget_add_css_class(row, "application-row");
        GtkWidget *icon = gtk_image_new_from_icon_name(entry->icon_name && *entry->icon_name ? entry->icon_name : "application-x-executable");
        gtk_image_set_pixel_size(GTK_IMAGE(icon), 32);
        const char *subtitle = entry->description && *entry->description ? entry->description : entry->command;
        GtkWidget *texts = lui_text_group_new_ellipsized(entry->name, subtitle);
        gtk_box_append(GTK_BOX(row), icon);
        gtk_box_append(GTK_BOX(row), texts);
        GtkWidget *toggle = gtk_switch_new(); gtk_switch_set_active(GTK_SWITCH(toggle), entry->enabled);
        gtk_widget_set_valign(toggle, GTK_ALIGN_CENTER);
        g_object_set_data(G_OBJECT(toggle), "application-entry", entry);
        g_signal_connect(toggle, "notify::active", G_CALLBACK(toggle_changed), app);
        gtk_box_append(GTK_BOX(row), toggle);
        gtk_list_box_append(app->list, lui_list_row_new(row)); shown++;
    }
    if (!shown) {
        const char *empty_text = app->applications->len
            ? gtk_switch_get_active(app->enabled_only)
                ? "No enabled applications match your search."
                : "No applications match your search."
            : "No launchable desktop applications were found.";
        GtkWidget *empty = lui_label_new(empty_text);
        gtk_widget_add_css_class(empty, "lui-subtitle"); gtk_widget_set_margin_top(empty, 24); gtk_widget_set_margin_bottom(empty, 24);
        gtk_list_box_append(app->list, empty);
    }
    g_free(folded_query);
}

static gboolean save_config(App *app, GError **error) {
    char *contents = NULL;
    if (!g_file_get_contents(app->config_path, &contents, NULL, error)) return FALSE;
    gchar **lines = g_strsplit(contents, "\n", -1);
    GString *updated = g_string_new(NULL);
    gboolean in_section = FALSE, have_section = FALSE, wrote_apps = FALSE;
    for (guint i = 0; lines[i]; i++) {
        char *line = lines[i], *trimmed = g_strdup(line); g_strstrip(trimmed);
        if (*trimmed == '[') {
            if (in_section && !wrote_apps) {
                for (guint j = 0; j < app->applications->len; j++) {
                    Application *entry = g_ptr_array_index(app->applications, j);
                    if (!entry->enabled) continue;
                    char *key = application_key(entry->id);
                    g_string_append_printf(updated, "%s = %s\n", key, entry->command);
                    g_free(key);
                }
                wrote_apps = TRUE;
            }
            in_section = g_str_equal(trimmed, "[autostart]");
            if (in_section) have_section = TRUE;
            g_string_append_printf(updated, "%s\n", line); g_free(trimmed); continue;
        }
        if (in_section && *trimmed && *trimmed != '#' && *trimmed != ';') {
            char *equal = strchr(trimmed, '=');
            if (equal) {
                *equal = '\0'; g_strstrip(trimmed);
                if (g_str_has_prefix(trimmed, KEY_PREFIX)) { g_free(trimmed); continue; }
            }
        }
        g_string_append_printf(updated, "%s\n", line); g_free(trimmed);
    }
    if (in_section && !wrote_apps) {
        for (guint j = 0; j < app->applications->len; j++) {
            Application *entry = g_ptr_array_index(app->applications, j);
            if (!entry->enabled) continue;
            char *key = application_key(entry->id);
            g_string_append_printf(updated, "%s = %s\n", key, entry->command);
            g_free(key);
        }
        wrote_apps = TRUE;
    }
    if (!have_section) {
        g_string_append(updated, "\n[autostart]\n");
        for (guint j = 0; j < app->applications->len; j++) {
            Application *entry = g_ptr_array_index(app->applications, j);
            if (!entry->enabled) continue;
            char *key = application_key(entry->id);
            g_string_append_printf(updated, "%s = %s\n", key, entry->command);
            g_free(key);
        }
    }
    struct stat info;
    char *backup = g_strconcat(app->config_path, ".liakos-backup", NULL);
    if (!g_file_test(backup, G_FILE_TEST_EXISTS)) {
        if (!g_file_set_contents(backup, contents, -1, error)) {
            g_free(backup); g_string_free(updated, TRUE); g_strfreev(lines); g_free(contents); return FALSE;
        }
        if (stat(app->config_path, &info) == 0) g_chmod(backup, info.st_mode & 07777);
    }
    gboolean have_mode = stat(app->config_path, &info) == 0;
    char *temporary = g_strconcat(app->config_path, ".liakos-tmp", NULL);
    gboolean ok = g_file_set_contents(temporary, updated->str, updated->len, error);
    if (ok && have_mode) g_chmod(temporary, info.st_mode & 07777);
    if (ok && g_rename(temporary, app->config_path) != 0) {
        g_set_error(error, G_FILE_ERROR, g_file_error_from_errno(errno), "Could not replace %s: %s", app->config_path, g_strerror(errno));
        ok = FALSE;
    }
    if (!ok) g_unlink(temporary);
    g_free(temporary); g_free(backup); g_string_free(updated, TRUE); g_strfreev(lines); g_free(contents);
    return ok;
}

static void on_save(GtkButton *button, gpointer data) {
    (void)button; App *app = data; GError *error = NULL;
    if (save_config(app, &error)) {
        gtk_label_set_text(app->status, "Startup applications saved to Wayfire. Reload or restart Wayfire to apply changes.");
    } else {
        gtk_label_set_text(app->status, error ? error->message : "Could not save Wayfire configuration.");
        g_clear_error(&error);
    }
}

static void on_search_changed(GtkSearchEntry *entry, gpointer data) { (void)entry; rebuild_rows(data); }
static void on_enabled_only_changed(GObject *object, GParamSpec *pspec, gpointer data) {
    (void)object; (void)pspec; rebuild_rows(data);
}

static void activate(GtkApplication *application, gpointer data) {
    lui_init(LUI_STYLE_AUTOSTART);
    App *app = data;
    if (app->window) { gtk_window_present(app->window); return; }
    app->application = application; app->window = GTK_WINDOW(gtk_application_window_new(application));
    gtk_window_set_title(app->window, "Startup Applications"); gtk_window_set_default_size(app->window, 680, 720);
    GtkWidget *outer = lui_page_new();
    GtkWidget *header = lui_page_header_new("Startup applications",
        "Choose which installed applications Wayfire starts when you log in.");
    app->search = GTK_SEARCH_ENTRY(lui_search_new()); gtk_widget_add_css_class(GTK_WIDGET(app->search), "search-entry"); gtk_search_entry_set_placeholder_text(app->search, "Search applications");
    GtkWidget *filter_row = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 10);
    gtk_widget_set_halign(filter_row, GTK_ALIGN_END);
    GtkWidget *filter_label = lui_label_new("Show enabled only");
    gtk_widget_add_css_class(filter_label, "lui-subtitle");
    app->enabled_only = GTK_SWITCH(gtk_switch_new());
    gtk_widget_set_valign(GTK_WIDGET(app->enabled_only), GTK_ALIGN_CENTER);
    gtk_box_append(GTK_BOX(filter_row), filter_label);
    gtk_box_append(GTK_BOX(filter_row), GTK_WIDGET(app->enabled_only));
    app->list = GTK_LIST_BOX(gtk_list_box_new()); gtk_list_box_set_selection_mode(app->list, GTK_SELECTION_NONE);
    gtk_widget_add_css_class(GTK_WIDGET(app->list), "application-list");
    GtkWidget *scroll = gtk_scrolled_window_new(); gtk_widget_set_vexpand(scroll, TRUE);
    gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scroll), GTK_POLICY_NEVER, GTK_POLICY_AUTOMATIC);
    gtk_scrolled_window_set_overlay_scrolling(GTK_SCROLLED_WINDOW(scroll), TRUE);
    gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll), GTK_WIDGET(app->list));
    GtkWidget *scrollbar = gtk_scrolled_window_get_vscrollbar(GTK_SCROLLED_WINDOW(scroll));
    gtk_widget_set_opacity(scrollbar, 0.0);
    gtk_widget_set_can_target(scrollbar, FALSE);
    app->status = GTK_LABEL(lui_label_new("Changes are saved only when you select Save."));
    gtk_widget_add_css_class(GTK_WIDGET(app->status), "lui-status"); gtk_widget_set_halign(GTK_WIDGET(app->status), GTK_ALIGN_START); gtk_label_set_wrap(app->status, TRUE);
    GtkWidget *actions = lui_action_bar_new();
    app->save_button = lui_button_new("Save", LUI_BUTTON_NORMAL); gtk_widget_add_css_class(app->save_button, "suggested-action");
    gtk_box_append(GTK_BOX(actions), app->save_button);
    gtk_box_append(GTK_BOX(outer), header);
    gtk_box_append(GTK_BOX(outer), GTK_WIDGET(app->search)); gtk_box_append(GTK_BOX(outer), filter_row); gtk_box_append(GTK_BOX(outer), scroll);
    gtk_box_append(GTK_BOX(outer), GTK_WIDGET(app->status)); gtk_box_append(GTK_BOX(outer), actions);
    gtk_window_set_child(app->window, outer);
    gtk_widget_add_css_class(GTK_WIDGET(app->window), "autostart-window");
    g_signal_connect(app->search, "search-changed", G_CALLBACK(on_search_changed), app);
    g_signal_connect(app->enabled_only, "notify::active", G_CALLBACK(on_enabled_only_changed), app);
    g_signal_connect(app->save_button, "clicked", G_CALLBACK(on_save), app);
    load_applications(app); rebuild_rows(app); gtk_window_present(app->window);
}

int main(int argc, char **argv) {
    App app = {0}; app.applications = g_ptr_array_new_with_free_func(application_free);
    app.config_path = wayfire_config_path();
    GtkApplication *application = gtk_application_new("org.liakos.Autostart", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(application, "activate", G_CALLBACK(activate), &app);
    int status = g_application_run(G_APPLICATION(application), argc, argv);
    lui_shutdown();
    g_object_unref(application); g_ptr_array_unref(app.applications); g_free(app.config_path);
    return status;
}
