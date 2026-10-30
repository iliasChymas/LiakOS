#define main settings_application_main
#include "../liakos-settings.c"
#undef main

static void assert_action(GtkWidget *button, const char *label, const char *icon) {
    g_assert_cmpstr(gtk_widget_get_tooltip_text(button), ==, label);
    gtk_test_accessible_assert_property(GTK_ACCESSIBLE(button),
                                       GTK_ACCESSIBLE_PROPERTY_LABEL, label);
    g_assert_cmpstr(gtk_button_get_icon_name(GTK_BUTTON(button)), ==, icon);
    GtkIconTheme *theme = gtk_icon_theme_get_for_display(gtk_widget_get_display(button));
    g_assert_true(gtk_icon_theme_has_icon(theme, icon));
}
int main(int argc, char **argv) {
    g_test_init(&argc, &argv, NULL);
    gtk_init();
    Settings settings = {0};
    settings.sidebar = lui_box_new(GTK_ORIENTATION_VERTICAL, 0);
    settings.toggle = lui_icon_button_new("go-previous-symbolic", "Hide categories");
    g_object_ref_sink(settings.sidebar);
    g_object_ref_sink(settings.toggle);
    g_assert_true(gtk_widget_get_visible(settings.sidebar));
    assert_action(settings.toggle, "Hide categories", "go-previous-symbolic");
    for (int i = 0; i < 2; ++i) {
        on_sidebar_toggle(GTK_BUTTON(settings.toggle), &settings);
        g_assert_false(gtk_widget_get_visible(settings.sidebar));
        assert_action(settings.toggle, "Show categories", "sidebar-show-symbolic");
        on_sidebar_toggle(GTK_BUTTON(settings.toggle), &settings);
        g_assert_true(gtk_widget_get_visible(settings.sidebar));
        assert_action(settings.toggle, "Hide categories", "go-previous-symbolic");
    }
    g_object_unref(settings.toggle);
    g_object_unref(settings.sidebar);
    g_print("PASS: sidebar visibility, icon, tooltip, and accessible label stay synchronized\n");
    return 0;
}
