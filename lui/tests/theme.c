#include "../lui.h"
#include <glib/gstdio.h>

static char *palette_path;
static void settle(void) {
    gint64 deadline = g_get_monotonic_time() + 250 * G_TIME_SPAN_MILLISECOND;
    while (g_get_monotonic_time() < deadline) {
        while (g_main_context_iteration(NULL, FALSE)) {}
        g_usleep(1000);
    }
}
static gboolean is_color(LuiColor role, const char *hex) {
    GdkRGBA expected, actual = lui_color(role);
    gdk_rgba_parse(&expected, hex);
    return gdk_rgba_equal(&actual, &expected);
}
static void await_accent(const char *hex) {
    gint64 deadline = g_get_monotonic_time() + 3 * G_TIME_SPAN_SECOND;
    while (!is_color(LUI_COLOR_ACCENT, hex) && g_get_monotonic_time() < deadline) settle();
    g_assert_true(is_color(LUI_COLOR_ACCENT, hex));
}
static void write_palette(const char *contents) {
    GError *error = NULL;
    g_assert_true(g_file_set_contents(palette_path, contents, -1, &error));
    g_assert_no_error(error);
}
static void clicked(GtkButton *button, gpointer data) {
    (void)button;
    (*(int *)data)++;
}
static void bounded_text(void) {
    char *long_text = g_strnfill(160, 'W');
    GtkWidget *text = lui_text_group_new_ellipsized(long_text, long_text);
    g_object_ref_sink(text);
    int minimum, natural;
    gtk_widget_measure(text, GTK_ORIENTATION_HORIZONTAL, -1,
                       &minimum, &natural, NULL, NULL);
    /* Long metadata must fit alongside a row's icon and switch in a 680px
     * window, while retaining the full text at its natural width. */
    g_assert_cmpint(minimum, <, 200);
    g_assert_cmpint(natural, >, 1000);
    g_object_unref(text);
    text = lui_text_group_new_ellipsized(long_text, NULL);
    g_object_ref_sink(text);
    gtk_widget_measure(text, GTK_ORIENTATION_HORIZONTAL, -1,
                       &minimum, NULL, NULL, NULL);
    g_assert_cmpint(minimum, <, 200);
    g_object_unref(text);
    g_free(long_text);
}
static void components(LuiStyle style) {
    GtkWidget *window = gtk_window_new();
    GtkWidget *content = lui_box_new(GTK_ORIENTATION_VERTICAL, -1);
    if (style == LUI_STYLE_AUTOSTART)
        gtk_widget_add_css_class(window, "autostart-window");
    if (style == LUI_STYLE_LAUNCHER)
        gtk_widget_add_css_class(content, "launcher-panel");
    GtkWidget *header = lui_page_header_new("Title", "A long subtitle that wraps");
    static const int header_gaps[] = {6, 14, 6, 4, 6, 6, 6, 6};
    static const int card_gaps[] = {9, 12, 12, 12, 12, 12, 4, 12};
    g_assert_cmpint(gtk_box_get_spacing(GTK_BOX(header)), ==, header_gaps[style]);
    GtkWidget *page = lui_page_new();
    g_object_ref_sink(page);
    if (style == LUI_STYLE_SETTINGS) {
        g_assert_cmpint(gtk_box_get_spacing(GTK_BOX(page)), ==, 16);
        g_assert_cmpint(gtk_widget_get_margin_start(page), ==, 30);
        g_assert_cmpint(gtk_widget_get_margin_top(page), ==, 12);
    } else if (style == LUI_STYLE_AUTOSTART) {
        g_assert_cmpint(gtk_box_get_spacing(GTK_BOX(page)), ==, 14);
        g_assert_cmpint(gtk_widget_get_margin_start(page), ==, 20);
        g_assert_cmpint(gtk_widget_get_margin_bottom(page), ==, 16);
    } else if (style == LUI_STYLE_WALLPAPER) {
        g_assert_cmpint(gtk_box_get_spacing(GTK_BOX(page)), ==, 12);
        g_assert_cmpint(gtk_widget_get_margin_start(page), ==, 16);
    }
    g_object_unref(page);
    GtkWidget *button = lui_button_new("Save", LUI_BUTTON_PRIMARY);
    int count = 0;
    g_signal_connect(button, "clicked", G_CALLBACK(clicked), &count);
    g_signal_emit_by_name(button, "clicked");
    g_assert_cmpint(count, ==, 1);
    GtkWidget *row = lui_setting_row_new("Setting", "Description", button);
    g_assert_true(gtk_widget_is_ancestor(button, row));
    GtkWidget *card = lui_card_new(row);
    g_assert_cmpint(gtk_box_get_spacing(GTK_BOX(card)), ==, card_gaps[style]);
    gtk_box_append(GTK_BOX(content), header);
    gtk_box_append(GTK_BOX(content), card);
    gtk_box_append(GTK_BOX(content), lui_search_new());
    gtk_box_append(GTK_BOX(content), lui_icon_button_new("edit-copy-symbolic", "Copy"));
    gtk_box_append(GTK_BOX(content), lui_action_tile_new("Open", "Details", "folder-symbolic", GTK_ORIENTATION_HORIZONTAL));
    gtk_box_append(GTK_BOX(content), lui_grid_new());
    gtk_box_append(GTK_BOX(content), lui_list_row_new(lui_label_new("Row")));
    gtk_window_set_child(GTK_WINDOW(window), content);
    gtk_window_present(GTK_WINDOW(window));
    settle();
    GdkRGBA actual, expected = lui_color(LUI_COLOR_FOREGROUND);
    gtk_widget_get_color(header, &actual);
    if (style != LUI_STYLE_SESSION && style != LUI_STYLE_WALLPAPER)
        g_assert_true(gdk_rgba_equal(&actual, &expected));
    if (style == LUI_STYLE_GALLERY) {
        expected = lui_color_on(LUI_COLOR_ACCENT);
        gtk_widget_get_color(button, &actual);
        g_assert_true(gdk_rgba_equal(&actual, &expected));
    }
    if (style != LUI_STYLE_LAUNCHER && style != LUI_STYLE_WALLPAPER) {
        static const double title_pixels[] = {27, 25, 22, 24, 0, 34, 0, 26};
        GtkWidget *title = gtk_widget_get_first_child(header);
        const PangoFontDescription *font = pango_context_get_font_description(gtk_widget_get_pango_context(title));
        double size = pango_font_description_get_size(font) / (double)PANGO_SCALE;
        if (!pango_font_description_get_size_is_absolute(font)) size *= 96.0 / 72.0;
        g_assert_cmpfloat_with_epsilon(size, title_pixels[style], .1);
    }
    gtk_window_destroy(GTK_WINDOW(window));
}
int main(int argc, char **argv) {
    g_test_init(&argc, &argv, NULL);
    gtk_init();
    palette_path = g_build_filename(g_get_user_cache_dir(), "wal", "colors.json", NULL);
    /* Start without wal/ at all: initialization must not create user files. */
    lui_init(LUI_STYLE_GALLERY);
    bounded_text();
    g_assert_false(g_file_test(palette_path, G_FILE_TEST_EXISTS));
    g_assert_true(is_color(LUI_COLOR_ACCENT, "#8aa4ff"));
    char *directory = g_path_get_dirname(palette_path);
    g_assert_cmpint(g_mkdir_with_parents(directory, 0700), ==, 0);
    write_palette("{\"colors\":{\"color4\":\"#123456\"}}");
    await_accent("#123456");
    /* Atomic replacement (the same way palette generators commonly write). */
    write_palette("{\"special\":{\"background\":\"#000000\",\"foreground\":\"#ffffff\"},\"colors\":{\"color4\":\"#abcdef\"}}");
    await_accent("#abcdef");
    components(LUI_STYLE_GALLERY);
    /* Incomplete writes and malformed roots retain the last working palette. */
    const char *invalid[] = {"{", "[]", "null", "42"};
    for (guint i = 0; i < G_N_ELEMENTS(invalid); ++i) {
        write_palette(invalid[i]); settle();
        g_assert_true(is_color(LUI_COLOR_ACCENT, "#abcdef"));
    }
    /* Wrong member types and CSS injection strings fall back safely. */
    write_palette("{\"special\":[],\"colors\":{\"color4\":42,\"color8\":\"red; }\"}}");
    await_accent("#8aa4ff");
    /* Replacing the entire wal directory must reattach the watcher. */
    char *old_directory = g_strconcat(directory, ".old", NULL);
    g_assert_cmpint(g_rename(directory, old_directory), ==, 0);
    g_assert_cmpint(g_mkdir(directory, 0700), ==, 0);
    write_palette("{\"colors\":{\"color4\":\"#654321\"}}");
    await_accent("#654321");
    write_palette("{\"colors\":{\"color4\":\"#224466\"}}");
    await_accent("#224466");
    g_assert_cmpint(g_unlink(palette_path), ==, 0);
    await_accent("#8aa4ff");
    lui_shutdown();
    /* Every embedded profile must parse without CSS warnings. */
    for (LuiStyle style = LUI_STYLE_SETTINGS; style <= LUI_STYLE_GALLERY; ++style) {
        lui_init(style);
        lui_init(style);
        components(style);
        lui_shutdown();
        lui_shutdown();
    }
    write_palette("{");
    lui_init(LUI_STYLE_GALLERY);
    g_assert_true(is_color(LUI_COLOR_ACCENT, "#8aa4ff"));
    lui_shutdown();
    settle();
    g_free(old_directory); g_free(directory); g_free(palette_path);
    g_print("PASS: components, all styles, defaults, malformed palettes, live updates, atomic replacement, directory creation/replacement, deletion, and shutdown\n");
    return 0;
}
