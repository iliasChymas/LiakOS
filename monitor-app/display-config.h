#pragma once
#include <gio/gio.h>

typedef struct {
  char *name, *mode, *transform;
  gboolean enabled;
  double scale;
  int x, y;
} MonitorSetting;

/* Layouts use the wlr-output-management syntax shared by wlr-randr/Kanshi. */
char *kanshi_config_path(void);
gboolean save_display_config(const char *path, GPtrArray *settings, GError **error);
/* Start only if IPC is absent. Reload only after a confirmed save. */
gboolean activate_kanshi(gboolean reload, GError **error);
