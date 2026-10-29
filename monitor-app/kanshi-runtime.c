#include "display-config.h"

static gboolean control(const char *command, GError **error) {
  GSubprocess *process = g_subprocess_new(G_SUBPROCESS_FLAGS_STDOUT_SILENCE |
      G_SUBPROCESS_FLAGS_STDERR_PIPE, error, "kanshictl", command, NULL);
  if (!process)
    return FALSE;
  char *diagnostic = NULL;
  gboolean ok = g_subprocess_communicate_utf8(process, NULL, NULL, NULL, &diagnostic, error);
  if (ok && !g_subprocess_get_successful(process)) {
    g_set_error(error, G_IO_ERROR, G_IO_ERROR_FAILED, "kanshictl %s: %s", command,
                diagnostic && *diagnostic ? diagnostic : "daemon unavailable or profile not matched");
    ok = FALSE;
  }
  g_free(diagnostic);
  g_object_unref(process);
  return ok;
}

gboolean activate_kanshi(gboolean reload, GError **error) {
  if (control("status", NULL))
    return !reload || control("reload", error);
  char *program = g_find_program_in_path("kanshictl");
  if (!program) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_NOT_FOUND,
                        "Install Kanshi with kanshictl IPC support.");
    return FALSE;
  }
  g_free(program);
  GSubprocess *daemon = g_subprocess_new(G_SUBPROCESS_FLAGS_STDOUT_SILENCE,
                                        error, "kanshi", NULL);
  if (!daemon)
    return FALSE;
  /* The daemon reads the just-saved config on startup; don't reload it twice.
   * Wait briefly for the per-Wayland-session IPC socket before reporting success.
   * Unref does not terminate the long-lived child. GLib reaps it on exit. */
  gboolean ready = FALSE;
  for (guint i = 0; i < 20; i++) {
    if (control("status", NULL)) {
      ready = TRUE;
      break;
    }
    g_usleep(100000);
  }
  if (!ready)
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_FAILED,
                        "Kanshi did not become ready; check its config and Wayland session environment.");
  g_object_unref(daemon);
  return ready;
}
