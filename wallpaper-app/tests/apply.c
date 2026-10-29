#define _POSIX_C_SOURCE 200809L
#include <gtk/gtk.h>

/* Exercise the actual apply handler and asynchronous completion without GTK
 * initialization, a window, or any display-server connection. */
static char *status_text;
static gboolean apply_enabled = TRUE;
static void capture_status(GtkLabel *label, const char *text) {
  (void)label;
  g_free(status_text);
  status_text = g_strdup(text);
}
static void capture_sensitive(GtkWidget *widget, gboolean enabled) {
  (void)widget;
  apply_enabled = enabled;
}
#define gtk_label_set_text capture_status
#define gtk_widget_set_sensitive capture_sensitive
#define main wallpaper_main
#ifndef WALLPAPER_SOURCE
#define WALLPAPER_SOURCE "../tools/wallpaper-viewer-c.c"
#endif
#include WALLPAPER_SOURCE
#undef main
#undef gtk_label_set_text
#undef gtk_widget_set_sensitive

int main(int argc, char **argv) {
  g_assert_cmpint(argc, ==, 3);
  Viewer viewer = {0};
  viewer.images = g_ptr_array_new();
  g_ptr_array_add(viewer.images, argv[1]);
  apply_clicked(NULL, &viewer);
  g_assert_false(apply_enabled);
  gint64 deadline = g_get_monotonic_time() + 10 * G_TIME_SPAN_SECOND;
  while (!apply_enabled && g_get_monotonic_time() < deadline) {
    g_main_context_iteration(NULL, FALSE);
    g_usleep(1000);
  }
  g_assert_true(apply_enabled);
  if (!strstr(status_text, argv[2]))
    g_error("Expected status containing %s, got: %s", argv[2], status_text);
  g_free(status_text);
  g_ptr_array_unref(viewer.images);
  return 0;
}
