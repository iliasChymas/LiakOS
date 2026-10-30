#include "lui.h"

static void activate(GtkApplication *app, gpointer data) {
    (void)data;
    lui_init(LUI_STYLE_GALLERY);
    GtkWidget *window = gtk_application_window_new(app);
    gtk_window_set_title(GTK_WINDOW(window), "LiakOS UI components");
    gtk_window_set_default_size(GTK_WINDOW(window), 640, 620);
    GtkWidget *page = lui_box_new(GTK_ORIENTATION_VERTICAL, LUI_SPACE_MEDIUM);
    gtk_widget_set_margin_top(page, LUI_SPACE_LARGE);
    gtk_widget_set_margin_bottom(page, LUI_SPACE_LARGE);
    gtk_widget_set_margin_start(page, LUI_SPACE_LARGE);
    gtk_widget_set_margin_end(page, LUI_SPACE_LARGE);
    gtk_box_append(GTK_BOX(page), lui_page_header_new("LiakOS UI", "Shared components and live wallpaper colors"));
    gtk_box_append(GTK_BOX(page), lui_search_new());
    GtkWidget *card = lui_card_new(lui_setting_row_new("Example setting", "A title, description, and control", gtk_switch_new()));
    gtk_box_append(GTK_BOX(page), card);
    gtk_box_append(GTK_BOX(page), lui_action_tile_new("Action tile", "An icon with reusable text", "preferences-system-symbolic", GTK_ORIENTATION_HORIZONTAL));
    GtkWidget *actions = lui_grid_new();
    const char *labels[] = {"Normal", "Primary", "Destructive", "Flat"};
    for (int i = 0; i < 4; ++i)
        gtk_grid_attach(GTK_GRID(actions), lui_button_new(labels[i], i), i % 2, i / 2, 1, 1);
    gtk_box_append(GTK_BOX(page), actions);
    GtkWidget *disabled = lui_button_new("Disabled", LUI_BUTTON_NORMAL);
    gtk_widget_set_sensitive(disabled, FALSE);
    gtk_box_append(GTK_BOX(page), disabled);
    GtkWidget *scroll = gtk_scrolled_window_new();
    gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll), page);
    gtk_window_set_child(GTK_WINDOW(window), scroll);
    gtk_window_present(GTK_WINDOW(window));
}
int main(int argc, char **argv) {
    GtkApplication *app = gtk_application_new("org.liakos.LuiGallery", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    lui_shutdown();
    g_object_unref(app);
    return status;
}
