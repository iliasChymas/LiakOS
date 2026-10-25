#define _POSIX_C_SOURCE 200809L

#include <gtk/gtk.h>
#include <vips/vips.h>

#include <stdio.h>
#include <string.h>
#include <time.h>

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
  GThreadPool *workers;
  char *directory;
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
} ApplyJob;

static Viewer *active_viewer;

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
  gtk_label_set_text(job->viewer->status,
                     success ? "Wallpaper applied and GTK/Qt colors updated. "
                               "Restart apps to see them."
                             : error->message);
  gtk_widget_set_sensitive(GTK_WIDGET(job->viewer->apply_button), TRUE);
  g_clear_error(&error);
  g_object_unref(job->process);
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

static void load_directory(Viewer *viewer, const char *directory) {
  viewer->generation++;
  viewer->completed = 0;
  viewer->selected = 0;
  clear_thumbnail_grid(viewer);
  g_ptr_array_unref(viewer->images);
  viewer->images = find_images(directory);
  g_free(viewer->directory);
  viewer->directory = g_strdup(directory);

  gboolean has_images = viewer->images->len > 0;
  gtk_widget_set_sensitive(viewer->previous_button, has_images);
  gtk_widget_set_sensitive(viewer->next_button, has_images);
  gtk_widget_set_sensitive(GTK_WIDGET(viewer->apply_button), has_images);
  if (!has_images) {
    char *message = g_strdup_printf("No images found in %s", directory);
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

static void folder_dialog_finish(GObject *source, GAsyncResult *result,
                                 gpointer data) {
  Viewer *viewer = data;
  GtkFileDialog *dialog = GTK_FILE_DIALOG(source);
  GError *error = NULL;
  GFile *folder = gtk_file_dialog_select_folder_finish(dialog, result, &error);
  if (folder) {
    char *path = g_file_get_path(folder);
    if (path) {
      load_directory(viewer, path);
      g_free(path);
    }
    g_object_unref(folder);
  } else if (error && !g_error_matches(error, GTK_DIALOG_ERROR,
                                       GTK_DIALOG_ERROR_DISMISSED) &&
             !g_error_matches(error, G_IO_ERROR, G_IO_ERROR_CANCELLED)) {
    gtk_label_set_text(viewer->status, error->message);
  }
  g_clear_error(&error);
  g_object_unref(source);
}

static void open_folder_action(GSimpleAction *action, GVariant *parameter,
                               gpointer data) {
  (void)action;
  (void)parameter;
  Viewer *viewer = data;
  GtkFileDialog *dialog = gtk_file_dialog_new();
  gtk_file_dialog_set_title(dialog, "Open wallpaper folder");
  gtk_file_dialog_set_accept_label(dialog, "Open folder");
  gtk_file_dialog_set_modal(dialog, TRUE);
  GFile *current = g_file_new_for_path(viewer->directory);
  gtk_file_dialog_set_initial_folder(dialog, current);
  g_object_unref(current);
  gtk_file_dialog_select_folder(dialog, GTK_WINDOW(viewer->window), NULL,
                                folder_dialog_finish, viewer);
}

static void build_ui(GtkApplication *application, gpointer user_data) {
  (void)user_data;
  gint64 ui_started = g_get_monotonic_time();
  Viewer *viewer = g_new0(Viewer, 1);
  active_viewer = viewer;
  viewer->images = g_ptr_array_new_with_free_func(g_free);
  viewer->buttons = g_ptr_array_new();
  viewer->thumbnail_pictures = g_ptr_array_new();
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
  g_menu_append(menu, "Open another folder…", "win.open-folder");
  gtk_menu_button_set_menu_model(GTK_MENU_BUTTON(menu_button),
                                 G_MENU_MODEL(menu));
  gtk_header_bar_pack_end(GTK_HEADER_BAR(header), menu_button);
  gtk_window_set_titlebar(GTK_WINDOW(viewer->window), header);
  g_object_unref(menu);

  GSimpleAction *open_folder = g_simple_action_new("open-folder", NULL);
  g_signal_connect(open_folder, "activate", G_CALLBACK(open_folder_action),
                   viewer);
  g_action_map_add_action(G_ACTION_MAP(viewer->window), G_ACTION(open_folder));
  g_object_unref(open_folder);

  g_signal_connect(viewer->previous_button, "clicked",
                   G_CALLBACK(previous_clicked), viewer);
  g_signal_connect(viewer->next_button, "clicked", G_CALLBACK(next_clicked),
                   viewer);
  g_signal_connect(viewer->apply_button, "clicked", G_CALLBACK(apply_clicked),
                   viewer);

  char *directory =
      g_build_filename(g_get_user_config_dir(), "los", "walls", NULL);
  viewer->directory = g_strdup(directory);
  gtk_window_present(GTK_WINDOW(viewer->window));
  g_print("[timing-c] window-presented total_ui_ms=%.3f\n",
          (g_get_monotonic_time() - ui_started) / 1000.0);
  load_directory(viewer, directory);
  g_free(directory);
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
