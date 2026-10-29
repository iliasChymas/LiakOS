#define _POSIX_C_SOURCE 200809L

#include <gtk/gtk.h>

static unsigned spawn_count;
static char **spawned_argv;

static gboolean capture_spawn(const gchar *working_directory, gchar **argv,
    gchar **envp, GSpawnFlags flags, GSpawnChildSetupFunc child_setup,
    gpointer user_data, GPid *child_pid, GError **error) {
  (void)working_directory; (void)envp; (void)flags; (void)child_setup;
  (void)user_data; (void)child_pid; (void)error;
  spawn_count++;
  g_strfreev(spawned_argv);
  spawned_argv = g_strdupv(argv);
  return TRUE;
}

static GtkApplication *test_application(const char *id, GApplicationFlags flags) {
  (void)id; (void)flags;
  return gtk_application_new("com.liakos.Session.ConfirmationTest", G_APPLICATION_NON_UNIQUE);
}

#define gtk_application_new test_application
#define g_spawn_async capture_spawn
#define main session_main
#include "../session-app.c"
#undef main
#undef g_spawn_async
#undef gtk_application_new

static gboolean verify_confirmation(gpointer data) {
  (void)data;
  const char *commands[] = { "logout", "reboot", "poweroff" };
  const char *labels[] = { "Log Out", "Restart", "Power Off" };
  GtkWidget *actions = gtk_stack_get_child_by_name(app->pages, "actions");
  GtkWidget *button = gtk_widget_get_first_child(actions);
  for (unsigned i = 0; i < G_N_ELEMENTS(commands); i++) {
    g_assert_nonnull(button);
    g_signal_emit_by_name(button, "clicked");
    g_assert_cmpstr(gtk_stack_get_visible_child_name(app->pages), ==, "confirmation");
    g_assert_true(gtk_widget_is_ancestor(GTK_WIDGET(app->confirmation_title), GTK_WIDGET(app->window)));
    g_assert_true(gtk_widget_get_mapped(GTK_WIDGET(app->confirmation_title)));
    g_assert_true(gtk_root_get_focus(GTK_ROOT(app->window)) == app->cancel_button);
    g_assert_cmpstr(gtk_button_get_label(app->confirm_button), ==, labels[i]);
    g_assert_cmpuint(spawn_count, ==, i);

    g_signal_emit_by_name(app->cancel_button, "clicked");
    g_assert_cmpstr(gtk_stack_get_visible_child_name(app->pages), ==, "actions");
    g_assert_null(app->pending_action);
    g_assert_true(gtk_root_get_focus(GTK_ROOT(app->window)) == button);

    g_signal_emit_by_name(button, "clicked");
    g_assert_true(key_pressed(NULL, GDK_KEY_Escape, 0, 0, NULL));
    g_assert_null(app->pending_action);
    g_assert_cmpuint(spawn_count, ==, i);

    g_signal_emit_by_name(button, "clicked");
    g_signal_emit_by_name(app->confirm_button, "clicked");
    g_assert_cmpuint(spawn_count, ==, i + 1);
    g_assert_cmpstr(spawned_argv[0], ==, i == 0 ? "loginctl" : "systemctl");
    g_assert_cmpstr(spawned_argv[1], ==, i == 0 ? "terminate-session" : commands[i]);
    if (i == 0) g_assert_cmpstr(spawned_argv[2], ==, "test-session");
    g_assert_null(app->pending_action);
    button = gtk_widget_get_next_sibling(button);
  }
  g_strfreev(spawned_argv);
  g_print("PASS: visible confirmation, safe focus, Cancel, Escape, and all action commands\n");
  g_application_quit(G_APPLICATION(app->application));
  return G_SOURCE_REMOVE;
}

int main(int argc, char **argv) {
  g_setenv("XDG_SESSION_ID", "test-session", TRUE);
  g_timeout_add(500, verify_confirmation, NULL);
  return session_main(argc, argv);
}
