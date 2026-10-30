#define main settings_application_main
#include "../liakos-settings.c"
#undef main
#include <locale.h>

static GtkWidget *find_control(GtkWidget *widget, const char *key) {
    SettingBinding *binding = g_object_get_data(G_OBJECT(widget), "wayfire-setting");
    if (binding && g_str_equal(binding->key, key)) return widget;
    for (GtkWidget *child = gtk_widget_get_first_child(widget); child;
         child = gtk_widget_get_next_sibling(child)) {
        GtkWidget *found = find_control(child, key);
        if (found) return found;
    }
    return NULL;
}

int main(int argc, char **argv) {
    g_test_init(&argc, &argv, NULL);
    gtk_init();
    char *path = g_build_filename(g_get_user_config_dir(), "wayfire.ini", NULL);
    g_setenv("LIAKOS_WAYFIRE_CONFIG", path, TRUE);
    const char *initial = "[input]\nmouse_cursor_speed = 0.00\nmouse_natural_scroll = false\nnatural_scroll = false\n[core]\nplugins = ipc\n";
    g_assert_true(g_file_set_contents(path, initial, -1, NULL));
    Settings settings = {0};
    settings.content = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
    g_object_ref_sink(settings.content);
    add_mouse_page(&settings);
    GtkWidget *speed = find_control(settings.content, "mouse_cursor_speed");
    GtkWidget *mouse_scroll = find_control(settings.content, "mouse_natural_scroll");
    GtkWidget *touchpad_scroll = find_control(settings.content, "natural_scroll");
    g_assert_nonnull(speed);
    g_assert_nonnull(mouse_scroll);
    g_assert_nonnull(touchpad_scroll);
    g_assert_nonnull(setlocale(LC_NUMERIC, "el_GR.UTF-8"));
    gtk_range_set_value(GTK_RANGE(speed), -0.55);
    char *value = wayfire_option("input", "mouse_cursor_speed", "missing");
    g_assert_cmpstr(value, ==, "-0.55");
    g_free(value);
    char *first = NULL, *second = NULL;
    g_assert_true(g_file_get_contents(path, &first, NULL, NULL));
    on_input_scale_changed(GTK_RANGE(speed), g_object_get_data(G_OBJECT(speed), "wayfire-setting"));
    g_assert_true(g_file_get_contents(path, &second, NULL, NULL));
    g_assert_cmpstr(first, ==, second);
    g_free(first); g_free(second);
    gtk_switch_set_active(GTK_SWITCH(mouse_scroll), TRUE);
    value = wayfire_option("input", "mouse_natural_scroll", "missing");
    g_assert_cmpstr(value, ==, "true"); g_free(value);
    value = wayfire_option("input", "natural_scroll", "missing");
    g_assert_cmpstr(value, ==, "false"); g_free(value);
    gtk_switch_set_active(GTK_SWITCH(touchpad_scroll), TRUE);
    gtk_switch_set_active(GTK_SWITCH(mouse_scroll), FALSE);
    value = wayfire_option("input", "natural_scroll", "missing");
    g_assert_cmpstr(value, ==, "true"); g_free(value);
    value = wayfire_option("core", "plugins", "missing");
    g_assert_cmpstr(value, ==, "ipc"); g_free(value);
    char *backup = g_strconcat(path, ".liakos-backup", NULL);
    g_assert_true(g_file_get_contents(backup, &first, NULL, NULL));
    g_assert_cmpstr(first, ==, initial);
    g_free(first); g_free(backup);
    g_object_unref(settings.content);
    g_free(path);
    g_print("PASS: locale-independent pointer speed, independent scrolling, stable saves, and config backup\n");
    return 0;
}
