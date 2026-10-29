#define _GNU_SOURCE
#include "display-config.h"
#include <math.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>

static gboolean valid_transform(const char *s) {
  const char *values[] = {"normal", "90", "180", "270", "flipped",
                         "flipped-90", "flipped-180", "flipped-270"};
  for (guint i = 0; i < G_N_ELEMENTS(values); i++)
    if (g_strcmp0(s, values[i]) == 0)
      return TRUE;
  return FALSE;
}

static gboolean valid_name(const char *s) {
  if (!s || !*s)
    return FALSE;
  for (; *s; s++)
    if (!g_ascii_isalnum(*s) && !strchr("-_.:", *s))
      return FALSE;
  return TRUE;
}

static gboolean valid_mode(const char *mode) {
  if (!mode)
    return FALSE;
  GRegex *re = g_regex_new("^([0-9]+)x([0-9]+)@([0-9]+(?:\\.[0-9]+)?)Hz$", 0, 0, NULL);
  GMatchInfo *match = NULL;
  gboolean result = FALSE;
  if (g_regex_match(re, mode, 0, &match)) {
    char *w = g_match_info_fetch(match, 1), *h = g_match_info_fetch(match, 2);
    char *rate = g_match_info_fetch(match, 3);
    double hz = g_ascii_strtod(rate, NULL);
    if (g_ascii_strtoll(w, NULL, 10) > 0 && g_ascii_strtoll(w, NULL, 10) <= G_MAXINT &&
        g_ascii_strtoll(h, NULL, 10) > 0 && g_ascii_strtoll(h, NULL, 10) <= G_MAXINT &&
        hz >= 1 && hz <= G_MAXINT / 1000.0)
      result = TRUE;
    g_free(w);
    g_free(h);
    g_free(rate);
  }
  g_match_info_free(match);
  g_regex_unref(re);
  return result;
}

char *kanshi_config_path(void) {
  return g_build_filename(g_get_user_config_dir(), "kanshi", "config", NULL);
}

typedef struct {
  GFile *file;
  char *contents, *etag;
  gboolean exists;
} ConfigFile;

static void config_clear(ConfigFile *config) {
  g_clear_object(&config->file);
  g_free(config->contents);
  g_free(config->etag);
}

static gboolean config_load(ConfigFile *config, const char *path, GError **error) {
  char *resolved = realpath(path, NULL);
  if (!resolved && errno != ENOENT) {
    g_set_error(error, G_IO_ERROR, g_io_error_from_errno(errno),
                "Cannot resolve config %s: %s", path, g_strerror(errno));
    return FALSE;
  }
  config->file = g_file_new_for_path(resolved ? resolved : path);
  free(resolved);
  gsize length;
  GError *read_error = NULL;
  config->exists = g_file_load_contents(config->file, NULL, &config->contents,
                                        &length, &config->etag, &read_error);
  if (!config->exists) {
    if (g_error_matches(read_error, G_IO_ERROR, G_IO_ERROR_NOT_FOUND)) {
      g_clear_error(&read_error);
      config->contents = g_strdup("");
      return TRUE;
    }
    g_propagate_error(error, read_error);
    return FALSE;
  }
  if (strlen(config->contents) != length) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                        "Configuration contains NUL bytes.");
    return FALSE;
  }
  return TRUE;
}

static gboolean config_write(ConfigFile *config, const char *text, GError **error) {
  if (g_str_equal(config->contents, text))
    return TRUE;
  char *path = g_file_get_path(config->file);
  gboolean ok = TRUE;
  if (config->exists) {
    char *backup = g_strconcat(path, ".liakos-backup", NULL);
    GFile *file = g_file_new_for_path(backup);
    GError *backup_error = NULL;
    ok = g_file_copy(config->file, file, G_FILE_COPY_NONE, NULL, NULL, NULL, &backup_error);
    if (!ok && g_error_matches(backup_error, G_IO_ERROR, G_IO_ERROR_EXISTS))
      ok = TRUE;
    if (!ok)
      g_propagate_error(error, g_steal_pointer(&backup_error));
    g_clear_error(&backup_error);
    g_object_unref(file);
    g_free(backup);
    if (ok)
      ok = g_file_replace_contents(config->file, text, strlen(text), config->etag,
                                   FALSE, G_FILE_CREATE_NONE, NULL, NULL, error);
  } else {
    char *parent = g_path_get_dirname(path);
    if (g_mkdir_with_parents(parent, 0700) != 0) {
      g_set_error(error, G_IO_ERROR, g_io_error_from_errno(errno),
                  "Cannot create Kanshi config directory: %s", g_strerror(errno));
      ok = FALSE;
    }
    g_free(parent);
    if (ok) {
      /* Exclusive create: do not overwrite a file created since our read. */
      GFileOutputStream *stream = g_file_create(config->file, G_FILE_CREATE_PRIVATE, NULL, error);
      ok = stream != NULL;
      if (stream) {
        ok = g_output_stream_write_all(G_OUTPUT_STREAM(stream), text, strlen(text), NULL, NULL, error);
        if (ok)
          ok = g_output_stream_close(G_OUTPUT_STREAM(stream), NULL, error);
        g_object_unref(stream);
      }
    }
  }
  g_free(path);
  return ok;
}

static gint compare_setting(gconstpointer a, gconstpointer b) {
  const MonitorSetting *sa = *(MonitorSetting *const *)a;
  const MonitorSetting *sb = *(MonitorSetting *const *)b;
  return strcmp(sa->name, sb->name);
}

/* Exact connector-set profiles preserve each saved docking/undocking layout.
 * Markers delimit only the app's block, leaving all user profiles untouched. */
static char *update_kanshi(const char *contents, GPtrArray *settings, GError **error) {
  if (!settings || !settings->len) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA, "No monitors to save.");
    return NULL;
  }
  GPtrArray *sorted = g_ptr_array_new();
  gboolean enabled = FALSE;
  for (guint i = 0; i < settings->len; i++) {
    MonitorSetting *s = g_ptr_array_index(settings, i);
    gboolean valid = valid_name(s->name) && valid_transform(s->transform) &&
        isfinite(s->scale) && s->scale >= .1 &&
        (valid_mode(s->mode) || (!s->enabled && (!s->mode || !*s->mode)));
    if (!valid) {
      g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA, "Invalid monitor setting.");
      g_ptr_array_unref(sorted);
      return NULL;
    }
    enabled |= s->enabled;
    g_ptr_array_add(sorted, s);
  }
  if (!enabled) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                        "At least one monitor must remain enabled.");
    g_ptr_array_unref(sorted);
    return NULL;
  }
  g_ptr_array_sort(sorted, compare_setting);
  GString *topology = g_string_new(NULL), *body = g_string_new(NULL);
  for (guint i = 0; i < sorted->len; i++) {
    MonitorSetting *s = g_ptr_array_index(sorted, i);
    if (i && g_str_equal(s->name, ((MonitorSetting *)g_ptr_array_index(sorted, i - 1))->name)) {
      g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA, "Duplicate monitor name.");
      g_ptr_array_unref(sorted);
      g_string_free(topology, TRUE);
      g_string_free(body, TRUE);
      return NULL;
    }
    g_string_append_printf(topology, "%s\n", s->name);
    char scale[G_ASCII_DTOSTR_BUF_SIZE];
    g_ascii_dtostr(scale, sizeof(scale), s->scale);
    g_string_append_printf(body, "    output %s %s", s->name, s->enabled ? "enable" : "disable");
    if (s->mode && *s->mode)
      g_string_append_printf(body, " mode %s", s->mode);
    g_string_append_printf(body, " position %d,%d scale %s transform %s\n",
                           s->x, s->y, scale, s->transform);
  }
  char *id = g_compute_checksum_for_string(G_CHECKSUM_SHA256, topology->str, -1);
  char *begin = g_strdup_printf("# BEGIN liakos-displays %s\n", id);
  char *end = g_strdup_printf("# END liakos-displays %s\n", id);
  char *block = g_strdup_printf("%sprofile liakos-%s {\n%s}\n%s", begin, id, body->str, end);
  const char *start = strstr(contents, begin), *finish = strstr(contents, end);
  char *result = NULL;
  if ((start && start != contents && start[-1] != '\n') ||
      (start && (!finish || finish < start || strstr(start + strlen(begin), begin))) ||
      (!start && finish)) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                        "The app's Kanshi profile markers were edited; repair them before saving.");
  } else if (start) {
    finish += strlen(end);
    GString *updated = g_string_new_len(contents, start - contents);
    g_string_append(updated, block);
    g_string_append(updated, finish);
    result = g_string_free(updated, FALSE);
  } else {
    result = g_strconcat(block, contents, NULL);
  }
  g_free(begin);
  g_free(end);
  g_free(block);
  g_free(id);
  g_string_free(body, TRUE);
  g_string_free(topology, TRUE);
  g_ptr_array_unref(sorted);
  return result;
}

gboolean save_display_config(const char *path, GPtrArray *settings, GError **error) {
  ConfigFile config = {0};
  gboolean ok = FALSE;
  if (config_load(&config, path, error)) {
    char *updated = update_kanshi(config.contents, settings, error);
    if (updated) {
      ok = config_write(&config, updated, error);
      g_free(updated);
    }
  }
  config_clear(&config);
  return ok;
}
