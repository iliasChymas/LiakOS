#define _POSIX_C_SOURCE 200809L

#include <gtk/gtk.h>
#include <vips/vips.h>

#include <stdio.h>
#include <string.h>
#include <time.h>
#include <errno.h>
#include <sys/stat.h>
#include <glib/gstdio.h>

#define THUMB_WIDTH 256
#define THUMB_HEIGHT 144
#define THUMB_COLUMNS 5
#define THUMB_WORKERS 4

typedef struct {
  GPtrArray *images;
  GPtrArray *buttons;
  GPtrArray *thumbnail_pictures;
  GtkPicture *preview;
  GtkLabel *caption;
  GtkLabel *status;
  GtkButton *apply_button;
  GtkWidget *previous_button;
  GtkWidget *next_button;
  GtkGrid *grid;
  GtkWidget *window;
  GtkWindow *folders_window;
  GtkListBox *folders_list;
  GThreadPool *workers;
  GPtrArray *directories;
  char *default_directory;
  guint selected;
  guint completed;
  guint generation;
  gint64 thumbnail_started;
} Viewer;

typedef struct {
  Viewer *viewer;
  guint index;
  guint generation;
  char *path;
} ThumbnailJob;

typedef struct {
  Viewer *viewer;
  guint index;
  guint generation;
  GBytes *encoded;
  char *error;
  double elapsed_ms;
} ThumbnailResult;

typedef struct {
  Viewer *viewer;
  GSubprocess *process;
  char *path;
} ApplyJob;

static Viewer *active_viewer;

static void reload_wallpapers(Viewer *viewer);
static void refresh_folder_list(Viewer *viewer);
static void remove_folder_action(Viewer *viewer, GtkButton *button);

static char *wayfire_config_path(void) {
  const char *override = g_getenv("LIAKOS_WAYFIRE_CONFIG");
  if (override && *override)
    return g_canonicalize_filename(override, NULL);
  const char *config_home = g_get_user_config_dir();
  char *root = g_build_filename(config_home, "wayfire.ini", NULL);
  char *nested = g_build_filename(config_home, "wayfire", "wayfire.ini", NULL);
  char *found = g_file_test(root, G_FILE_TEST_IS_REGULAR)
                    ? g_strdup(root)
                    : g_file_test(nested, G_FILE_TEST_IS_REGULAR) ? g_strdup(nested)
                                                                  : g_strdup(root);
  g_free(root);
  g_free(nested);
  return found;
}

static gboolean save_wallpaper_startup(const char *image_path, GError **error) {
  char *config_path = wayfire_config_path();
  char *contents = NULL;
  if (!g_file_get_contents(config_path, &contents, NULL, error)) {
    g_free(config_path);
    return FALSE;
  }

  char *absolute_path = g_canonicalize_filename(image_path, NULL);
  char *quoted_path = g_shell_quote(absolute_path);
  char *command = g_strdup_printf("wal -i %s", quoted_path);
  g_free(quoted_path);
  g_free(absolute_path);
  gchar **lines = g_strsplit(contents, "\n", -1);
  GString *updated = g_string_new(NULL);
  gboolean in_autostart = FALSE, have_autostart = FALSE, wrote_command = FALSE;
  for (guint i = 0; lines[i]; i++) {
    char *line = lines[i];
    char *trimmed = g_strdup(line);
    g_strstrip(trimmed);
    if (*trimmed == '[') {
      if (in_autostart && !wrote_command) {
        g_string_append_printf(updated, "liakos_wallpaper = %s\n", command);
        wrote_command = TRUE;
      }
      in_autostart = g_str_equal(trimmed, "[autostart]");
      if (in_autostart)
        have_autostart = TRUE;
      g_string_append_printf(updated, "%s\n", line);
      g_free(trimmed);
      continue;
    }
    if (in_autostart && *trimmed && *trimmed != '#' && *trimmed != ';') {
      char *equal = strchr(trimmed, '=');
      if (equal) {
        *equal = '\0';
        g_strstrip(trimmed);
        if (g_str_equal(trimmed, "liakos_wallpaper")) {
          g_string_append_printf(updated, "liakos_wallpaper = %s\n", command);
          wrote_command = TRUE;
          g_free(trimmed);
          continue;
        }
      }
    }
    g_string_append_printf(updated, "%s\n", line);
    g_free(trimmed);
  }
  if (in_autostart && !wrote_command)
    g_string_append_printf(updated, "liakos_wallpaper = %s\n", command);
  if (!have_autostart)
    g_string_append_printf(updated, "\n[autostart]\nliakos_wallpaper = %s\n", command);

  struct stat config_stat;
  char *backup_path = g_strconcat(config_path, ".liakos-backup", NULL);
  if (!g_file_test(backup_path, G_FILE_TEST_EXISTS)) {
    if (!g_file_set_contents(backup_path, contents, -1, error)) {
      g_free(backup_path); g_string_free(updated, TRUE); g_strfreev(lines);
      g_free(contents); g_free(command); g_free(config_path);
      return FALSE;
    }
    if (stat(config_path, &config_stat) == 0)
      g_chmod(backup_path, config_stat.st_mode & 07777);
  }
  gboolean have_mode = stat(config_path, &config_stat) == 0;
  char *temporary_path = g_strconcat(config_path, ".liakos-tmp", NULL);
  gboolean ok = g_file_set_contents(temporary_path, updated->str, updated->len, error);
  if (ok && have_mode)
    g_chmod(temporary_path, config_stat.st_mode & 07777);
  if (ok && g_rename(temporary_path, config_path) != 0) {
    g_set_error(error, G_FILE_ERROR, g_file_error_from_errno(errno),
                "Could not update %s: %s", config_path, g_strerror(errno));
    ok = FALSE;
  }
  if (!ok)
    g_unlink(temporary_path);
  g_free(temporary_path); g_free(backup_path); g_string_free(updated, TRUE);
  g_strfreev(lines); g_free(contents); g_free(command); g_free(config_path);
  return ok;
}

static double elapsed_ms(struct timespec start, struct timespec end) {
  return (end.tv_sec - start.tv_sec) * 1000.0 +
         (end.tv_nsec - start.tv_nsec) / 1000000.0;
}

static gint compare_paths(gconstpointer left, gconstpointer right) {
  return g_strcmp0(*(char *const *)left, *(char *const *)right);
}

static gboolean is_image_file(const char *name) {
  const char *dot = strrchr(name, '.');
  if (!dot)
    return FALSE;

  return g_ascii_strcasecmp(dot, ".bmp") == 0 ||
         g_ascii_strcasecmp(dot, ".gif") == 0 ||
         g_ascii_strcasecmp(dot, ".jpeg") == 0 ||
         g_ascii_strcasecmp(dot, ".jpg") == 0 ||
         g_ascii_strcasecmp(dot, ".png") == 0 ||
         g_ascii_strcasecmp(dot, ".tif") == 0 ||
         g_ascii_strcasecmp(dot, ".tiff") == 0 ||
         g_ascii_strcasecmp(dot, ".webp") == 0;
}

static GPtrArray *find_images(const char *directory) {
  GPtrArray *images = g_ptr_array_new_with_free_func(g_free);
  GError *error = NULL;
  GDir *dir = g_dir_open(directory, 0, &error);
  if (!dir) {
    g_printerr("Could not read %s: %s\n", directory, error->message);
    g_clear_error(&error);
    return images;
  }

  const char *name;
  while ((name = g_dir_read_name(dir))) {
    if (!is_image_file(name))
      continue;
    char *path = g_build_filename(directory, name, NULL);
    if (g_file_test(path, G_FILE_TEST_IS_REGULAR))
      g_ptr_array_add(images, path);
    else
      g_free(path);
  }
  g_dir_close(dir);
  g_ptr_array_sort(images, compare_paths);
  return images;
}

static char *folders_config_path(void) {
  return g_build_filename(g_get_user_config_dir(), "los",
                          "wallpaper-folders.ini", NULL);
}

static gboolean directory_is_listed(Viewer *viewer, const char *directory) {
  char *canonical = g_canonicalize_filename(directory, NULL);
  gboolean found = FALSE;
  for (guint i = 0; i < viewer->directories->len; i++) {
    char *existing = g_canonicalize_filename(
        g_ptr_array_index(viewer->directories, i), NULL);
    found = g_strcmp0(existing, canonical) == 0;
    g_free(existing);
    if (found)
      break;
  }
  g_free(canonical);
  return found;
}

static void save_directories(Viewer *viewer) {
  GKeyFile *key_file = g_key_file_new();
  if (viewer->directories->len > 1) {
    gsize count = viewer->directories->len - 1;
    const char **paths = g_new(const char *, count);
    for (gsize i = 0; i < count; i++)
      paths[i] = g_ptr_array_index(viewer->directories, i + 1);
    g_key_file_set_string_list(key_file, "wallpapers", "folders", paths,
                               count);
    g_free(paths);
  }
  gsize length = 0;
  char *contents = g_key_file_to_data(key_file, &length, NULL);
  char *path = folders_config_path();
  char *parent = g_path_get_dirname(path);
  if (g_mkdir_with_parents(parent, 0700) != 0 ||
      !g_file_set_contents(path, contents, length, NULL))
    g_warning("Could not save wallpaper folders to %s", path);
  g_free(parent);
  g_free(path);
  g_free(contents);
  g_key_file_unref(key_file);
}

static void load_saved_directories(Viewer *viewer) {
  char *path = folders_config_path();
  GKeyFile *key_file = g_key_file_new();
  if (g_key_file_load_from_file(key_file, path, G_KEY_FILE_NONE, NULL)) {
    gsize count = 0;
    char **paths = g_key_file_get_string_list(
        key_file, "wallpapers", "folders", &count, NULL);
    for (gsize i = 0; paths && i < count; i++) {
      if (g_file_test(paths[i], G_FILE_TEST_IS_DIR) &&
          !directory_is_listed(viewer, paths[i]))
        g_ptr_array_add(viewer->directories,
                        g_canonicalize_filename(paths[i], NULL));
    }
    g_strfreev(paths);
  }
  g_key_file_unref(key_file);
  g_free(path);
}

static void show_current(Viewer *viewer) {
  if (viewer->images->len == 0)
    return;

  const char *path = g_ptr_array_index(viewer->images, viewer->selected);
  GError *error = NULL;
  gint64 started = g_get_monotonic_time();
  GdkTexture *texture = gdk_texture_new_from_filename(path, &error);
  g_print("[timing-c] preview file=%s elapsed_ms=%.3f\n", path,
          (g_get_monotonic_time() - started) / 1000.0);
  if (!texture) {
    gtk_label_set_text(viewer->caption, error->message);
    g_clear_error(&error);
    return;
  }

  gtk_picture_set_paintable(viewer->preview, GDK_PAINTABLE(texture));
  char *filename = g_path_get_basename(path);
  char *caption = g_strdup_printf("%s  ·  %u of %u", filename,
                                  viewer->selected + 1, viewer->images->len);
  gtk_label_set_text(viewer->caption, caption);
  g_free(caption);
  g_free(filename);
  g_object_unref(texture);

  for (guint i = 0; i < viewer->buttons->len; i++) {
    GtkWidget *button = g_ptr_array_index(viewer->buttons, i);
    if (i == viewer->selected)
      gtk_widget_add_css_class(button, "suggested-action");
    else
      gtk_widget_remove_css_class(button, "suggested-action");
  }
}

static void select_image(Viewer *viewer, guint index) {
  if (viewer->images->len == 0)
    return;
  viewer->selected = index % viewer->images->len;
  gtk_label_set_text(viewer->status, "");
  show_current(viewer);
}

static void previous_clicked(GtkButton *button, gpointer data) {
  (void)button;
  Viewer *viewer = data;
  select_image(viewer, (viewer->selected + viewer->images->len - 1) %
                           viewer->images->len);
}

static void next_clicked(GtkButton *button, gpointer data) {
  (void)button;
  Viewer *viewer = data;
  select_image(viewer, viewer->selected + 1);
}

static void thumbnail_clicked(GtkButton *button, gpointer data) {
  (void)button;
  ThumbnailJob *click = data;
  if (click->generation != click->viewer->generation)
    return;
  select_image(click->viewer, click->index);
}

static gboolean show_thumbnail_result(gpointer data) {
  ThumbnailResult *result = data;
  Viewer *viewer = result->viewer;
  if (result->generation != viewer->generation) {
    g_clear_pointer(&result->encoded, g_bytes_unref);
    g_free(result->error);
    g_free(result);
    return G_SOURCE_REMOVE;
  }
  GtkPicture *picture =
      g_ptr_array_index(viewer->thumbnail_pictures, result->index);

  if (result->encoded) {
    GError *error = NULL;
    gint64 started = g_get_monotonic_time();
    GdkTexture *texture = gdk_texture_new_from_bytes(result->encoded, &error);
    if (texture) {
      gtk_picture_set_paintable(picture, GDK_PAINTABLE(texture));
      g_object_unref(texture);
    } else {
      g_printerr("[timing-c] thumbnail texture error: %s\n", error->message);
      g_clear_error(&error);
    }
    g_print("[timing-c] texture index=%u elapsed_ms=%.3f\n", result->index,
            (g_get_monotonic_time() - started) / 1000.0);
  } else {
    g_printerr("[timing-c] thumbnail failed index=%u error=%s\n", result->index,
               result->error ? result->error : "unknown error");
  }

  viewer->completed++;
  char *progress = g_strdup_printf("Preparing thumbnails · %u/%u",
                                   viewer->completed, viewer->images->len);
  gtk_label_set_text(viewer->status, progress);
  g_free(progress);
  if (viewer->completed == viewer->images->len) {
    g_print("[timing-c] thumbnails complete count=%u elapsed_ms=%.3f\n",
            viewer->images->len,
            (g_get_monotonic_time() - viewer->thumbnail_started) / 1000.0);
    char *ready = g_strdup_printf("Ready · %u wallpapers", viewer->images->len);
    gtk_label_set_text(viewer->status, ready);
    g_free(ready);
  }

  g_clear_pointer(&result->encoded, g_bytes_unref);
  g_free(result->error);
  g_free(result);
  return G_SOURCE_REMOVE;
}

static void thumbnail_worker(gpointer data, gpointer user_data) {
  (void)user_data;
  ThumbnailJob *job = data;
  ThumbnailResult *result = g_new0(ThumbnailResult, 1);
  result->viewer = job->viewer;
  result->index = job->index;
  result->generation = job->generation;
  struct timespec started, pipeline_done, finished;
  clock_gettime(CLOCK_MONOTONIC, &started);

  VipsImage *thumbnail = NULL;
  if (vips_thumbnail(job->path, &thumbnail, THUMB_WIDTH, "height", THUMB_HEIGHT,
                     "size", VIPS_SIZE_BOTH, "crop", VIPS_INTERESTING_CENTRE,
                     NULL)) {
    result->error = g_strdup(vips_error_buffer());
    vips_error_clear();
  } else {
    clock_gettime(CLOCK_MONOTONIC, &pipeline_done);
    void *buffer = NULL;
    size_t length = 0;
    const char *extension = strrchr(job->path, '.');
    gboolean jpeg = extension && (g_ascii_strcasecmp(extension, ".jpg") == 0 ||
                                  g_ascii_strcasecmp(extension, ".jpeg") == 0);
    const char *format = jpeg ? ".jpg" : ".png";
    int write_failed =
        jpeg ? vips_image_write_to_buffer(thumbnail, format, &buffer, &length,
                                          "Q", 95, NULL)
             : vips_image_write_to_buffer(thumbnail, format, &buffer, &length,
                                          NULL);
    if (write_failed) {
      result->error = g_strdup(vips_error_buffer());
      vips_error_clear();
    } else {
      result->encoded = g_bytes_new(buffer, length);
      g_free(buffer);
    }
    clock_gettime(CLOCK_MONOTONIC, &finished);
    result->elapsed_ms = elapsed_ms(started, finished);
    g_print("[timing-c] resize index=%u source=%s output=%dx%d "
            "pipeline_ms=%.3f write_ms=%.3f total_ms=%.3f\n",
            job->index, job->path, vips_image_get_width(thumbnail),
            vips_image_get_height(thumbnail),
            elapsed_ms(started, pipeline_done),
            elapsed_ms(pipeline_done, finished), result->elapsed_ms);
    g_object_unref(thumbnail);
  }

  g_idle_add(show_thumbnail_result, result);
  g_free(job->path);
  g_free(job);
}

static void thumbnail_job_free(gpointer data) {
  ThumbnailJob *job = data;
  if (!job)
    return;
  g_free(job->path);
  g_free(job);
}

static void apply_finished(GObject *source, GAsyncResult *result,
                           gpointer data) {
  ApplyJob *job = data;
  GError *error = NULL;
  gboolean success =
      g_subprocess_wait_check_finish(G_SUBPROCESS(source), result, &error);
  if (success) {
    GError *save_error = NULL;
    if (save_wallpaper_startup(job->path, &save_error)) {
      gtk_label_set_text(job->viewer->status,
                         "Wallpaper applied and saved for the next Wayfire session. GTK/Qt colors updated; restart apps to see them.");
    } else if (g_error_matches(save_error, G_FILE_ERROR, G_FILE_ERROR_NOENT)) {
      g_print("lpaper: no Wayfire config found; wallpaper startup command was not saved.\n");
      gtk_label_set_text(job->viewer->status,
                         "Wallpaper applied and GTK/Qt colors updated. Restart apps to see them.");
    } else {
      char *message = g_strdup_printf(
          "Wallpaper applied, but its Wayfire startup command could not be saved: %s",
          save_error ? save_error->message : "unknown error");
      gtk_label_set_text(job->viewer->status, message);
      g_free(message);
    }
    g_clear_error(&save_error);
  } else {
    gtk_label_set_text(job->viewer->status,
                       error ? error->message : "Could not apply wallpaper.");
  }
  gtk_widget_set_sensitive(GTK_WIDGET(job->viewer->apply_button), TRUE);
  g_clear_error(&error);
  g_object_unref(job->process);
  g_free(job->path);
  g_free(job);
}

static void apply_clicked(GtkButton *button, gpointer data) {
  (void)button;
  Viewer *viewer = data;
  const char *path = g_ptr_array_index(viewer->images, viewer->selected);
  if (g_getenv("WAYLAND_DISPLAY")) {
    const char *setters[] = {"swww", "awww", "swaybg", "wbg", NULL};
    gboolean found_setter = FALSE;
    for (guint i = 0; setters[i]; i++) {
      char *program = g_find_program_in_path(setters[i]);
      if (program) {
        found_setter = TRUE;
        g_free(program);
        break;
      }
    }
    if (!found_setter) {
      gtk_label_set_text(
          viewer->status,
          "Colors can update, but no Wayland wallpaper setter is installed. "
          "Install swaybg: sudo pacman -S swaybg.");
      return;
    }
  }
  char *script =
      g_canonicalize_filename("scripts/test-pywal-gtk-colors.sh", NULL);
  if (!g_file_test(script, G_FILE_TEST_IS_EXECUTABLE)) {
    g_free(script);
    script = g_build_filename(g_get_user_data_dir(), "liakos", "scripts",
                              "test-pywal-gtk-colors.sh", NULL);
  }
  if (!g_file_test(script, G_FILE_TEST_IS_EXECUTABLE)) {
    gtk_label_set_text(viewer->status,
                       "Wallpaper color script is missing. Run deploy.sh.");
    g_free(script);
    return;
  }
  GError *error = NULL;
  GSubprocess *process = g_subprocess_new(
      G_SUBPROCESS_FLAGS_NONE, &error, "sh", "-c", "wal -i \"$1\" && \"$2\"",
      "liakos-wallpaper-c", path, script, NULL);
  g_free(script);
  if (!process) {
    gtk_label_set_text(viewer->status, error->message);
    g_clear_error(&error);
    return;
  }

  gtk_label_set_text(viewer->status,
                     "Applying wallpaper and generating Pywal colors…");
  gtk_widget_set_sensitive(GTK_WIDGET(viewer->apply_button), FALSE);
  ApplyJob *job = g_new0(ApplyJob, 1);
  job->viewer = viewer;
  job->process = process;
  job->path = g_strdup(path);
  g_subprocess_wait_check_async(process, NULL, apply_finished, job);
}

static void start_thumbnails(Viewer *viewer) {
  if (viewer->images->len == 0)
    return;
  viewer->thumbnail_started = g_get_monotonic_time();
  if (!viewer->workers) {
    GError *error = NULL;
    viewer->workers =
        g_thread_pool_new(thumbnail_worker, NULL, THUMB_WORKERS, FALSE, &error);
    if (!viewer->workers) {
      gtk_label_set_text(viewer->status, error->message);
      g_clear_error(&error);
      return;
    }
  }
  gtk_label_set_text(viewer->status, "Preparing thumbnails…");
  g_print("[timing-c] thumbnail start generation=%u count=%u workers=%d "
          "target=%dx%d cache=none\n",
          viewer->generation, viewer->images->len, THUMB_WORKERS, THUMB_WIDTH,
          THUMB_HEIGHT);

  GError *error = NULL;
  for (guint i = 0; i < viewer->images->len; i++) {
    ThumbnailJob *job = g_new0(ThumbnailJob, 1);
    job->viewer = viewer;
    job->index = i;
    job->generation = viewer->generation;
    job->path = g_strdup(g_ptr_array_index(viewer->images, i));
    if (!g_thread_pool_push(viewer->workers, job, &error)) {
      thumbnail_job_free(job);
      gtk_label_set_text(viewer->status, error->message);
      g_clear_error(&error);
    }
  }
}

static void clear_thumbnail_grid(Viewer *viewer) {
  GtkWidget *child = gtk_widget_get_first_child(GTK_WIDGET(viewer->grid));
  while (child) {
    GtkWidget *next = gtk_widget_get_next_sibling(child);
    gtk_grid_remove(viewer->grid, child);
    child = next;
  }
  g_ptr_array_set_size(viewer->buttons, 0);
  g_ptr_array_set_size(viewer->thumbnail_pictures, 0);
}

static void populate_thumbnail_grid(Viewer *viewer) {
  for (guint i = 0; i < viewer->images->len; i++) {
    const char *path = g_ptr_array_index(viewer->images, i);
    GtkWidget *picture = gtk_picture_new();
    gtk_widget_set_size_request(picture, 128, 72);
    gtk_picture_set_can_shrink(GTK_PICTURE(picture), TRUE);
    gtk_picture_set_content_fit(GTK_PICTURE(picture), GTK_CONTENT_FIT_COVER);
    char *filename = g_path_get_basename(path);
    GtkWidget *label = gtk_label_new(filename);
    gtk_label_set_max_width_chars(GTK_LABEL(label), 18);
    gtk_label_set_ellipsize(GTK_LABEL(label), PANGO_ELLIPSIZE_MIDDLE);
    g_free(filename);
    GtkWidget *card = gtk_box_new(GTK_ORIENTATION_VERTICAL, 4);
    gtk_box_append(GTK_BOX(card), picture);
    gtk_box_append(GTK_BOX(card), label);
    GtkWidget *button = gtk_button_new();
    gtk_button_set_child(GTK_BUTTON(button), card);
    gtk_widget_set_tooltip_text(button, path);
    gtk_grid_attach(viewer->grid, button, i % THUMB_COLUMNS,
                    i / THUMB_COLUMNS, 1, 1);
    g_ptr_array_add(viewer->buttons, button);
    g_ptr_array_add(viewer->thumbnail_pictures, picture);
    ThumbnailJob *click = g_new0(ThumbnailJob, 1);
    click->viewer = viewer;
    click->index = i;
    click->generation = viewer->generation;
    g_object_set_data_full(G_OBJECT(button), "thumbnail-click-data", click,
                           (GDestroyNotify)thumbnail_job_free);
    g_signal_connect(button, "clicked", G_CALLBACK(thumbnail_clicked), click);
  }
}

static void reload_wallpapers(Viewer *viewer) {
  viewer->generation++;
  viewer->completed = 0;
  viewer->selected = 0;
  clear_thumbnail_grid(viewer);
  g_ptr_array_unref(viewer->images);
  viewer->images = g_ptr_array_new_with_free_func(g_free);
  GHashTable *seen = g_hash_table_new_full(g_str_hash, g_str_equal, g_free,
                                           NULL);
  for (guint i = 0; i < viewer->directories->len; i++) {
    const char *directory = g_ptr_array_index(viewer->directories, i);
    GPtrArray *found = find_images(directory);
    for (guint j = 0; j < found->len; j++) {
      char *path = g_canonicalize_filename(g_ptr_array_index(found, j), NULL);
      if (g_hash_table_add(seen, g_strdup(path)))
        g_ptr_array_add(viewer->images, path);
      else
        g_free(path);
    }
    g_ptr_array_unref(found);
  }
  g_hash_table_unref(seen);
  g_ptr_array_sort(viewer->images, compare_paths);

  gboolean has_images = viewer->images->len > 0;
  gtk_widget_set_sensitive(viewer->previous_button, has_images);
  gtk_widget_set_sensitive(viewer->next_button, has_images);
  gtk_widget_set_sensitive(GTK_WIDGET(viewer->apply_button), has_images);
  if (!has_images) {
    char *message = g_strdup_printf("No images found in %u wallpaper folders",
                                    viewer->directories->len);
    gtk_label_set_text(viewer->status, message);
    g_free(message);
    gtk_label_set_text(viewer->caption, "");
    gtk_picture_set_paintable(viewer->preview, NULL);
    return;
  }

  populate_thumbnail_grid(viewer);
  show_current(viewer);
  start_thumbnails(viewer);
}

static void refresh_folder_list(Viewer *viewer) {
  GtkWidget *child = gtk_widget_get_first_child(GTK_WIDGET(viewer->folders_list));
  while (child) {
    GtkWidget *next = gtk_widget_get_next_sibling(child);
    gtk_list_box_remove(viewer->folders_list, child);
    child = next;
  }
  for (guint i = 0; i < viewer->directories->len; i++) {
    const char *path = g_ptr_array_index(viewer->directories, i);
    GtkWidget *row = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 12);
    GtkWidget *label = gtk_label_new(path);
    gtk_label_set_xalign(GTK_LABEL(label), 0);
    gtk_label_set_ellipsize(GTK_LABEL(label), PANGO_ELLIPSIZE_MIDDLE);
    gtk_widget_set_hexpand(label, TRUE);
    gtk_box_append(GTK_BOX(row), label);
    if (i == 0) {
      GtkWidget *badge = gtk_label_new("Current");
      gtk_widget_add_css_class(badge, "dim-label");
      gtk_box_append(GTK_BOX(row), badge);
    } else {
      GtkWidget *remove = gtk_button_new_from_icon_name("user-trash-symbolic");
      gtk_widget_set_tooltip_text(remove, "Remove folder");
      g_object_set_data(G_OBJECT(remove), "folder-index",
                        GUINT_TO_POINTER(i));
      g_signal_connect_swapped(remove, "clicked",
                               G_CALLBACK(remove_folder_action), viewer);
      gtk_box_append(GTK_BOX(row), remove);
    }
    gtk_list_box_append(viewer->folders_list, row);
  }
}

static void remove_folder_action(Viewer *viewer, GtkButton *button) {
  guint index = GPOINTER_TO_UINT(
      g_object_get_data(G_OBJECT(button), "folder-index"));
  if (index == 0 || index >= viewer->directories->len)
    return;
  g_ptr_array_remove_index(viewer->directories, index);
  save_directories(viewer);
  refresh_folder_list(viewer);
  reload_wallpapers(viewer);
}

static void add_folder_dialog_finish(GObject *source, GAsyncResult *result,
                                     gpointer data) {
  Viewer *viewer = data;
  GtkFileDialog *dialog = GTK_FILE_DIALOG(source);
  GError *error = NULL;
  GFile *folder = gtk_file_dialog_select_folder_finish(dialog, result, &error);
  if (folder) {
    char *path = g_file_get_path(folder);
    if (path && !directory_is_listed(viewer, path)) {
      g_ptr_array_add(viewer->directories, g_canonicalize_filename(path, NULL));
      save_directories(viewer);
      refresh_folder_list(viewer);
      reload_wallpapers(viewer);
    } else if (path) {
      gtk_label_set_text(viewer->status, "That folder is already in the list.");
    }
    if (path)
      g_free(path);
    g_object_unref(folder);
  } else if (error && !g_error_matches(error, GTK_DIALOG_ERROR,
                                       GTK_DIALOG_ERROR_DISMISSED) &&
             !g_error_matches(error, G_IO_ERROR, G_IO_ERROR_CANCELLED)) {
    gtk_label_set_text(viewer->status, error->message);
  }
  g_clear_error(&error);
  g_object_unref(source);
}

static void add_folder_clicked(GtkButton *button, gpointer data) {
  (void)button;
  Viewer *viewer = data;
  GtkFileDialog *dialog = gtk_file_dialog_new();
  gtk_file_dialog_set_title(dialog, "Add wallpaper folder");
  gtk_file_dialog_set_accept_label(dialog, "Add folder");
  gtk_file_dialog_set_modal(dialog, TRUE);
  const char *initial = viewer->directories->len
                            ? g_ptr_array_index(viewer->directories, 0)
                            : viewer->default_directory;
  GFile *current = g_file_new_for_path(initial);
  gtk_file_dialog_set_initial_folder(dialog, current);
  g_object_unref(current);
  gtk_file_dialog_select_folder(dialog, viewer->folders_window, NULL,
                                add_folder_dialog_finish, viewer);
}

static void open_folders_action(GSimpleAction *action, GVariant *parameter,
                                gpointer data) {
  (void)action;
  (void)parameter;
  Viewer *viewer = data;
  if (!viewer->folders_window) {
    GtkWidget *content = gtk_box_new(GTK_ORIENTATION_VERTICAL, 12);
    gtk_widget_set_margin_top(content, 16);
    gtk_widget_set_margin_bottom(content, 16);
    gtk_widget_set_margin_start(content, 16);
    gtk_widget_set_margin_end(content, 16);
    GtkWidget *explanation = gtk_label_new(
        "Wallpapers are scanned from these folders. The current location stays first.");
    gtk_label_set_wrap(GTK_LABEL(explanation), TRUE);
    gtk_label_set_xalign(GTK_LABEL(explanation), 0);
    gtk_box_append(GTK_BOX(content), explanation);
    viewer->folders_list = GTK_LIST_BOX(gtk_list_box_new());
    gtk_list_box_set_selection_mode(viewer->folders_list, GTK_SELECTION_NONE);
    gtk_box_append(GTK_BOX(content), GTK_WIDGET(viewer->folders_list));
    GtkWidget *add = gtk_button_new_with_label("Add folder…");
    gtk_widget_set_halign(add, GTK_ALIGN_END);
    g_signal_connect(add, "clicked", G_CALLBACK(add_folder_clicked), viewer);
    gtk_box_append(GTK_BOX(content), add);
    viewer->folders_window = GTK_WINDOW(gtk_window_new());
    gtk_window_set_title(viewer->folders_window, "Wallpaper folders");
    gtk_window_set_default_size(viewer->folders_window, 560, 280);
    gtk_window_set_transient_for(viewer->folders_window,
                                 GTK_WINDOW(viewer->window));
    gtk_window_set_modal(viewer->folders_window, TRUE);
    gtk_window_set_child(viewer->folders_window, content);
    g_object_add_weak_pointer(G_OBJECT(viewer->folders_window),
                              (gpointer *)&viewer->folders_window);
    g_object_add_weak_pointer(G_OBJECT(viewer->folders_window),
                              (gpointer *)&viewer->folders_list);
  }
  refresh_folder_list(viewer);
  gtk_window_present(viewer->folders_window);
}

static void build_ui(GtkApplication *application, gpointer user_data) {
  (void)user_data;
  gint64 ui_started = g_get_monotonic_time();
  Viewer *viewer = g_new0(Viewer, 1);
  active_viewer = viewer;
  viewer->images = g_ptr_array_new_with_free_func(g_free);
  viewer->buttons = g_ptr_array_new();
  viewer->thumbnail_pictures = g_ptr_array_new();
  viewer->directories = g_ptr_array_new_with_free_func(g_free);
  viewer->preview = GTK_PICTURE(gtk_picture_new());
  gtk_widget_set_hexpand(GTK_WIDGET(viewer->preview), TRUE);
  gtk_widget_set_vexpand(GTK_WIDGET(viewer->preview), TRUE);
  gtk_picture_set_can_shrink(viewer->preview, TRUE);
  gtk_picture_set_content_fit(viewer->preview, GTK_CONTENT_FIT_CONTAIN);

  viewer->caption = GTK_LABEL(gtk_label_new(NULL));
  gtk_label_set_ellipsize(viewer->caption, PANGO_ELLIPSIZE_MIDDLE);
  viewer->status = GTK_LABEL(gtk_label_new(NULL));
  gtk_label_set_wrap(viewer->status, TRUE);

  GtkWidget *content = gtk_box_new(GTK_ORIENTATION_VERTICAL, 12);
  gtk_widget_set_margin_top(content, 16);
  gtk_widget_set_margin_bottom(content, 16);
  gtk_widget_set_margin_start(content, 16);
  gtk_widget_set_margin_end(content, 16);
  gtk_box_append(GTK_BOX(content), GTK_WIDGET(viewer->preview));
  gtk_box_append(GTK_BOX(content), GTK_WIDGET(viewer->caption));

  GtkWidget *controls = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 8);
  gtk_widget_set_halign(controls, GTK_ALIGN_CENTER);
  viewer->previous_button = gtk_button_new_with_label("Previous");
  viewer->next_button = gtk_button_new_with_label("Next");
  viewer->apply_button =
      GTK_BUTTON(gtk_button_new_with_label("Apply wallpaper"));
  gtk_box_append(GTK_BOX(controls), viewer->previous_button);
  gtk_box_append(GTK_BOX(controls), viewer->next_button);
  gtk_box_append(GTK_BOX(controls), GTK_WIDGET(viewer->apply_button));
  gtk_box_append(GTK_BOX(content), controls);

  viewer->grid = GTK_GRID(gtk_grid_new());
  gtk_grid_set_column_spacing(viewer->grid, 8);
  gtk_grid_set_row_spacing(viewer->grid, 8);
  gtk_widget_set_halign(GTK_WIDGET(viewer->grid), GTK_ALIGN_CENTER);
  GtkWidget *scrolled = gtk_scrolled_window_new();
  gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scrolled),
                                 GTK_POLICY_NEVER, GTK_POLICY_AUTOMATIC);
  gtk_scrolled_window_set_max_content_height(GTK_SCROLLED_WINDOW(scrolled),
                                             440);
  gtk_scrolled_window_set_propagate_natural_height(
      GTK_SCROLLED_WINDOW(scrolled), TRUE);
  gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scrolled),
                                GTK_WIDGET(viewer->grid));
  gtk_box_append(GTK_BOX(content), scrolled);
  gtk_box_append(GTK_BOX(content), GTK_WIDGET(viewer->status));

  viewer->window = gtk_application_window_new(application);
  gtk_window_set_title(GTK_WINDOW(viewer->window), "LiakOs Wallpapers");
  gtk_window_set_default_size(GTK_WINDOW(viewer->window), 1600, 900);
  gtk_window_set_child(GTK_WINDOW(viewer->window), content);

  GtkWidget *header = gtk_header_bar_new();
  gtk_header_bar_set_title_widget(GTK_HEADER_BAR(header),
                                  gtk_label_new("LiakOs Wallpapers"));
  GtkWidget *menu_button = gtk_menu_button_new();
  gtk_menu_button_set_child(GTK_MENU_BUTTON(menu_button),
                            gtk_image_new_from_icon_name("open-menu-symbolic"));
  gtk_widget_set_tooltip_text(menu_button, "Wallpaper options");
  GMenu *menu = g_menu_new();
  g_menu_append(menu, "Wallpaper folders…", "win.wallpaper-folders");
  gtk_menu_button_set_menu_model(GTK_MENU_BUTTON(menu_button),
                                 G_MENU_MODEL(menu));
  gtk_header_bar_pack_end(GTK_HEADER_BAR(header), menu_button);
  gtk_window_set_titlebar(GTK_WINDOW(viewer->window), header);
  g_object_unref(menu);

  GSimpleAction *folders_action =
      g_simple_action_new("wallpaper-folders", NULL);
  g_signal_connect(folders_action, "activate",
                   G_CALLBACK(open_folders_action), viewer);
  g_action_map_add_action(G_ACTION_MAP(viewer->window),
                          G_ACTION(folders_action));
  g_object_unref(folders_action);

  g_signal_connect(viewer->previous_button, "clicked",
                   G_CALLBACK(previous_clicked), viewer);
  g_signal_connect(viewer->next_button, "clicked", G_CALLBACK(next_clicked),
                   viewer);
  g_signal_connect(viewer->apply_button, "clicked", G_CALLBACK(apply_clicked),
                   viewer);

  viewer->default_directory =
      g_build_filename(g_get_user_config_dir(), "los", "walls", NULL);
  g_ptr_array_add(viewer->directories,
                  g_canonicalize_filename(viewer->default_directory, NULL));
  load_saved_directories(viewer);
  gtk_window_present(GTK_WINDOW(viewer->window));
  g_print("[timing-c] window-presented total_ui_ms=%.3f\n",
          (g_get_monotonic_time() - ui_started) / 1000.0);
  reload_wallpapers(viewer);
}

int main(int argc, char **argv) {
  if (VIPS_INIT(argv[0]))
    vips_error_exit("Could not initialize libvips");

  /* Four app workers, each with a single libvips worker, avoids
   * oversubscription. */
  vips_concurrency_set(1);
  GtkApplication *application = gtk_application_new(
      "com.liakos.Wallpapers", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(application, "activate", G_CALLBACK(build_ui), NULL);
  gint64 started = g_get_monotonic_time();
  int status = g_application_run(G_APPLICATION(application), argc, argv);
  if (active_viewer && active_viewer->workers) {
    g_thread_pool_free(active_viewer->workers, FALSE, TRUE);
    while (g_main_context_pending(NULL))
      g_main_context_iteration(NULL, FALSE);
  }
  g_print("[timing-c] application-exit lifetime_ms=%.3f\n",
          (g_get_monotonic_time() - started) / 1000.0);
  g_object_unref(application);
  vips_shutdown();
  return status;
}
