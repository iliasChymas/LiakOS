#define _POSIX_C_SOURCE 200809L

#include <gtk/gtk.h>
#include "../lui/lui.h"
#include <gtk4-layer-shell.h>

typedef struct {
  GtkApplication *application;
  GtkWindow *window;
  GtkStack *pages;
  GtkLabel *confirmation_title;
  GtkButton *confirm_button;
  GtkWidget *cancel_button;
  GtkWidget *selected_button;
  char *pending_action;
} SessionApp;

static SessionApp *app;

static void cancel_action(GtkButton *button, gpointer data) {
  (void)button; (void)data;
  g_clear_pointer(&app->pending_action, g_free);
  gtk_stack_set_visible_child_name(app->pages, "actions");
  if (app->selected_button) gtk_widget_grab_focus(app->selected_button);
}

static void accept_action(GtkButton *button, gpointer data) {
  (void)button; (void)data;
  const char *command = app->pending_action;
  if (!command) return;
  if (g_str_equal(command, "logout")) {
    const char *session_id = g_getenv("XDG_SESSION_ID");
    if (session_id && *session_id) {
      char *argv[] = { (char *)"loginctl", (char *)"terminate-session",
                       (char *)session_id, NULL };
      g_spawn_async(NULL, argv, NULL, G_SPAWN_SEARCH_PATH, NULL, NULL, NULL, NULL);
    }
  } else {
    char *argv[] = { (char *)"systemctl", (char *)command, NULL };
    g_spawn_async(NULL, argv, NULL, G_SPAWN_SEARCH_PATH, NULL, NULL, NULL, NULL);
  }
  cancel_action(NULL, NULL);
}

static void confirm_action(GtkButton *button, gpointer data) {
  (void)data;
  const char *action = g_object_get_data(G_OBJECT(button), "action");
  const char *label = g_object_get_data(G_OBJECT(button), "label");
  g_free(app->pending_action);
  app->pending_action = g_strdup(action);
  app->selected_button = GTK_WIDGET(button);
  char *title = g_strdup_printf("%s this session?", label);
  gtk_label_set_text(app->confirmation_title, title);
  g_free(title);
  gtk_button_set_label(app->confirm_button, label);
  gtk_stack_set_visible_child_name(app->pages, "confirmation");
  gtk_widget_grab_focus(app->cancel_button);
}

static GtkWidget *action_button(const char *title, const char *description,
                                const char *icon, const char *command) {
  GtkWidget *button = lui_action_tile_new(title, description, icon, GTK_ORIENTATION_VERTICAL);
  gtk_widget_add_css_class(button, "action");
  g_object_set_data_full(G_OBJECT(button), "action", g_strdup(command), g_free);
  g_object_set_data_full(G_OBJECT(button), "label", g_strdup(title), g_free);
  g_signal_connect(button, "clicked", G_CALLBACK(confirm_action), NULL);
  return button;
}

static gboolean key_pressed(GtkEventControllerKey *controller, guint keyval,
                            guint keycode, GdkModifierType state, gpointer data) {
  (void)controller; (void)keycode; (void)state; (void)data;
  if (keyval == GDK_KEY_Escape) {
    if (app->pending_action) cancel_action(NULL, NULL);
    else gtk_window_destroy(app->window);
    return TRUE;
  }
  return FALSE;
}

static void activate(GtkApplication *application, gpointer data) {
  lui_init(LUI_STYLE_SESSION);
  (void)data;
  app = g_new0(SessionApp, 1);
  app->application = application;
  app->window = GTK_WINDOW(gtk_application_window_new(application));
  gtk_window_set_title(app->window, "Ending Session");
  gtk_window_set_default_size(app->window, 900, 560);
  gtk_window_set_decorated(app->window, FALSE);
  gtk_widget_add_css_class(GTK_WIDGET(app->window), "session-overlay");
  gtk_layer_init_for_window(app->window);
  gtk_layer_set_namespace(app->window, "liakos-session");
  gtk_layer_set_layer(app->window, GTK_LAYER_SHELL_LAYER_OVERLAY);
  gtk_layer_set_anchor(app->window, GTK_LAYER_SHELL_EDGE_TOP, TRUE);
  gtk_layer_set_anchor(app->window, GTK_LAYER_SHELL_EDGE_BOTTOM, TRUE);
  gtk_layer_set_anchor(app->window, GTK_LAYER_SHELL_EDGE_LEFT, TRUE);
  gtk_layer_set_anchor(app->window, GTK_LAYER_SHELL_EDGE_RIGHT, TRUE);
  GListModel *monitors = gdk_display_get_monitors(gdk_display_get_default());
  if (g_list_model_get_n_items(monitors) > 0) {
    GdkMonitor *monitor = g_list_model_get_item(monitors, 0);
    gtk_layer_set_monitor(app->window, monitor);
    g_object_unref(monitor);
  }
  gtk_layer_set_keyboard_mode(app->window, GTK_LAYER_SHELL_KEYBOARD_MODE_EXCLUSIVE);

  GtkWidget *center = gtk_center_box_new();
  gtk_widget_set_halign(center, GTK_ALIGN_FILL);
  gtk_widget_set_valign(center, GTK_ALIGN_FILL);
  gtk_widget_set_hexpand(center, TRUE);
  gtk_widget_set_vexpand(center, TRUE);
  GtkWidget *card = lui_box_new(GTK_ORIENTATION_VERTICAL, 0);
  gtk_widget_add_css_class(card, "session-card");
  gtk_widget_set_halign(card, GTK_ALIGN_CENTER);
  gtk_widget_set_valign(card, GTK_ALIGN_CENTER);
  gtk_center_box_set_center_widget(GTK_CENTER_BOX(center), card);

  GtkWidget *top = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 0);
  GtkWidget *eyebrow = lui_label_new("LIAKOS  /  SESSION");
  gtk_widget_add_css_class(eyebrow, "eyebrow");
  gtk_widget_set_halign(eyebrow, GTK_ALIGN_START);
  gtk_box_append(GTK_BOX(top), eyebrow);
  gtk_box_append(GTK_BOX(card), top);

  GtkWidget *heading = lui_label_new("Ending session");
  gtk_widget_add_css_class(heading, "lui-title");
  gtk_widget_set_halign(heading, GTK_ALIGN_START);
  gtk_widget_set_margin_top(heading, 24);
  gtk_box_append(GTK_BOX(card), heading);
  GtkWidget *subtitle = lui_label_new("What would you like to do?");
  gtk_widget_add_css_class(subtitle, "lui-subtitle");
  gtk_widget_set_halign(subtitle, GTK_ALIGN_START);
  gtk_widget_set_margin_top(subtitle, 6);
  gtk_box_append(GTK_BOX(card), subtitle);

  GtkWidget *actions = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 14);
  gtk_widget_set_halign(actions, GTK_ALIGN_CENTER);
  gtk_widget_set_margin_top(actions, 30);
  gtk_box_append(GTK_BOX(actions), action_button("Log Out", "End this session", "system-log-out-symbolic", "logout"));
  gtk_box_append(GTK_BOX(actions), action_button("Restart", "Start fresh", "system-reboot-symbolic", "reboot"));
  gtk_box_append(GTK_BOX(actions), action_button("Power Off", "Shut down device", "system-shutdown-symbolic", "poweroff"));
  // Keep confirmation inside the overlay: a normal dialog is below the layer
  // surface and cannot receive keyboard input while it has exclusive focus.
  app->pages = GTK_STACK(gtk_stack_new());
  gtk_stack_add_named(app->pages, actions, "actions");
  GtkWidget *confirmation = lui_box_new(GTK_ORIENTATION_VERTICAL, 18);
  gtk_widget_set_margin_top(confirmation, 30);
  app->confirmation_title = GTK_LABEL(lui_label_new(""));
  gtk_widget_add_css_class(GTK_WIDGET(app->confirmation_title), "action-label");
  gtk_box_append(GTK_BOX(confirmation), GTK_WIDGET(app->confirmation_title));
  gtk_box_append(GTK_BOX(confirmation), lui_label_new("Any unsaved work may be lost."));
  GtkWidget *confirmation_buttons = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 14);
  gtk_widget_set_halign(confirmation_buttons, GTK_ALIGN_CENTER);
  app->cancel_button = lui_button_new("Cancel", LUI_BUTTON_NORMAL);
  g_signal_connect(app->cancel_button, "clicked", G_CALLBACK(cancel_action), NULL);
  app->confirm_button = GTK_BUTTON(lui_button_new("Confirm", LUI_BUTTON_NORMAL));
  g_signal_connect(app->confirm_button, "clicked", G_CALLBACK(accept_action), NULL);
  gtk_box_append(GTK_BOX(confirmation_buttons), app->cancel_button);
  gtk_box_append(GTK_BOX(confirmation_buttons), GTK_WIDGET(app->confirm_button));
  gtk_box_append(GTK_BOX(confirmation), confirmation_buttons);
  gtk_stack_add_named(app->pages, confirmation, "confirmation");
  gtk_box_append(GTK_BOX(card), GTK_WIDGET(app->pages));
  GtkWidget *hint = lui_label_new("Press Esc to go back");
  gtk_widget_add_css_class(hint, "hint");
  gtk_widget_set_halign(hint, GTK_ALIGN_CENTER);
  gtk_widget_set_margin_top(hint, 22);
  gtk_box_append(GTK_BOX(card), hint);
  gtk_window_set_child(app->window, center);

  GtkEventController *keys = gtk_event_controller_key_new();
  g_signal_connect(keys, "key-pressed", G_CALLBACK(key_pressed), NULL);
  gtk_widget_add_controller(GTK_WIDGET(app->window), keys);
  gtk_window_present(app->window);
}

int main(int argc, char **argv) {
  GtkApplication *application = gtk_application_new("com.liakos.Session", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(application, "activate", G_CALLBACK(activate), NULL);
  int status = g_application_run(G_APPLICATION(application), argc, argv);
  lui_shutdown();
  if (app) {
    g_free(app->pending_action);
    g_free(app);
  }
  g_object_unref(application);
  return status;
}
