#define _POSIX_C_SOURCE 200809L

#include <gio/gdesktopappinfo.h>
#include <gio/gunixsocketaddress.h>
#include <gtk/gtk.h>
#include "../lui/lui.h"
#include <gtk4-layer-shell.h>
#include <json-glib/json-glib.h>

#include <string.h>

#define VIEWS_METHOD "window-rules/list-views"
#define FOCUS_METHOD "window-rules/focus-view"
#define MAX_IPC_MESSAGE (4 * 1024 * 1024)

typedef struct {
  GDesktopAppInfo *app;
  GtkListBoxRow *row;
  char *search_text;
  char *desktop_id;
  char *startup_wm_class;
  char *executable;
  gint match_score;
} AppEntry;

typedef struct {
  GtkApplication *application;
  GtkWindow *window;
  GtkSearchEntry *search;
  GtkListBox *list;
  GtkAdjustment *scroll_adjustment;
  GtkLabel *footer;
  GPtrArray *entries;
} Launcher;

static Launcher *launcher;

static void app_entry_free(gpointer data) {
  AppEntry *entry = data;
  if (!entry)
    return;
  g_clear_object(&entry->app);
  g_free(entry->search_text);
  g_free(entry->desktop_id);
  g_free(entry->startup_wm_class);
  g_free(entry->executable);
  g_free(entry);
}

static const char *json_string(JsonObject *object, const char *key) {
  if (!object || !json_object_has_member(object, key))
    return NULL;
  JsonNode *node = json_object_get_member(object, key);
  if (!JSON_NODE_HOLDS_VALUE(node) ||
      json_node_get_value_type(node) != G_TYPE_STRING)
    return NULL;
  return json_node_get_string(node);
}

static char *join_terms(const char *a, const char *b, const char *c,
                        const char *d, const char *e) {
  return g_strdup_printf("%s %s %s %s %s", a ? a : "", b ? b : "", c ? c : "",
                         d ? d : "", e ? e : "");
}

static char *app_executable_name(GAppInfo *app) {
  const char *command = g_app_info_get_executable(app);
  gint argc = 0;
  char **argv = NULL;
  if (command && g_shell_parse_argv(command, &argc, &argv, NULL) && argc > 0) {
    gint executable_index = 0;
    if (g_str_equal(argv[0], "env") && argc > 1)
      executable_index = 1;
    char *name = g_path_get_basename(argv[executable_index]);
    g_strfreev(argv);
    return name;
  }
  g_strfreev(argv);
  return g_strdup(command ? command : "");
}

static char *desktop_basename_id(GDesktopAppInfo *app) {
  const char *filename = g_desktop_app_info_get_filename(app);
  if (!filename) {
    const char *id = g_app_info_get_id(G_APP_INFO(app));
    return g_strdup(id ? id : "");
  }
  char *basename = g_path_get_basename(filename);
  if (g_str_has_suffix(basename, ".desktop"))
    basename[strlen(basename) - strlen(".desktop")] = '\0';
  return basename;
}

static gint compare_app_infos(gconstpointer left, gconstpointer right) {
  GAppInfo *a = (GAppInfo *)left;
  GAppInfo *b = (GAppInfo *)right;
  return g_utf8_collate(g_app_info_get_display_name(a),
                        g_app_info_get_display_name(b));
}

static void add_application(Launcher *state, GAppInfo *info) {
  if (!G_IS_DESKTOP_APP_INFO(info) || !g_app_info_should_show(info))
    return;

  GDesktopAppInfo *desktop_app = G_DESKTOP_APP_INFO(info);
  AppEntry *entry = g_new0(AppEntry, 1);
  entry->app = g_object_ref(desktop_app);
  entry->desktop_id = desktop_basename_id(desktop_app);
  entry->startup_wm_class =
      g_strdup(g_desktop_app_info_get_startup_wm_class(desktop_app));
  entry->executable = app_executable_name(info);

  char *keywords = g_desktop_app_info_get_string(desktop_app, "Keywords");
  char *generic_name =
      g_desktop_app_info_get_string(desktop_app, "GenericName");
  entry->search_text = join_terms(
      g_app_info_get_display_name(info), g_app_info_get_description(info),
      entry->desktop_id, entry->executable, keywords ? keywords : generic_name);
  g_free(keywords);
  g_free(generic_name);

  GtkWidget *row = lui_list_row_new(NULL);
  entry->row = GTK_LIST_BOX_ROW(row);
  g_object_set_data(G_OBJECT(row), "app-entry", entry);
  gtk_widget_add_css_class(row, "launcher-row");

  GtkWidget *line = lui_box_new(GTK_ORIENTATION_HORIZONTAL, 14);
  gtk_widget_set_valign(line, GTK_ALIGN_CENTER);
  GIcon *icon = g_app_info_get_icon(info);
  GtkWidget *image =
      icon ? gtk_image_new_from_gicon(icon)
           : gtk_image_new_from_icon_name("application-x-executable-symbolic");
  gtk_image_set_pixel_size(GTK_IMAGE(image), 32);
  gtk_widget_set_size_request(image, 36, 36);
  GtkWidget *label = lui_label_new(g_app_info_get_display_name(info));
  gtk_label_set_xalign(GTK_LABEL(label), 0.0f);
  gtk_label_set_ellipsize(GTK_LABEL(label), PANGO_ELLIPSIZE_END);
  gtk_widget_set_hexpand(label, TRUE);
  gtk_box_append(GTK_BOX(line), image);
  gtk_box_append(GTK_BOX(line), label);
  gtk_list_box_row_set_child(GTK_LIST_BOX_ROW(row), line);
  gtk_list_box_append(state->list, row);
  g_ptr_array_add(state->entries, entry);
}

static GtkListBoxRow *first_visible_row(Launcher *state, int direction,
                                        GtkListBoxRow *from) {
  GtkWidget *child = from ? gtk_widget_get_next_sibling(GTK_WIDGET(from))
                          : gtk_widget_get_first_child(GTK_WIDGET(state->list));
  while (child) {
    if (GTK_IS_LIST_BOX_ROW(child) && gtk_widget_get_visible(child))
      return GTK_LIST_BOX_ROW(child);
    child = gtk_widget_get_next_sibling(child);
  }
  if (direction <= 0)
    return NULL;
  for (child = gtk_widget_get_first_child(GTK_WIDGET(state->list)); child;
       child = gtk_widget_get_next_sibling(child)) {
    if (GTK_IS_LIST_BOX_ROW(child) && gtk_widget_get_visible(child))
      return GTK_LIST_BOX_ROW(child);
  }
  return NULL;
}

static void scroll_row_into_view(Launcher *state, GtkListBoxRow *row) {
  if (!row || !state->scroll_adjustment)
    return;

  graphene_rect_t bounds;
  if (!gtk_widget_compute_bounds(GTK_WIDGET(row), GTK_WIDGET(state->list),
                                 &bounds))
    return;

  double top = bounds.origin.y;
  double bottom = top + bounds.size.height;
  double value = gtk_adjustment_get_value(state->scroll_adjustment);
  double page_size = gtk_adjustment_get_page_size(state->scroll_adjustment);
  if (top < value)
    gtk_adjustment_set_value(state->scroll_adjustment, top);
  else if (bottom > value + page_size)
    gtk_adjustment_set_value(state->scroll_adjustment, bottom - page_size);
}

static gint fuzzy_match_score(const char *query, const char *text) {
  if (!*query)
    return 0;

  const char *cursor = text;
  const char *query_cursor = query;
  gint score = 1000;
  gint skipped = 0;
  gboolean first_character = TRUE;

  while (*query_cursor) {
    gunichar wanted = g_utf8_get_char(query_cursor);
    const char *match = g_utf8_strchr(cursor, -1, wanted);
    if (!match)
      return -1;

    if (first_character) {
      gint position = g_utf8_pointer_to_offset(text, match);
      score -= MIN(position * 8, 400);
      if (match == text ||
          !g_unichar_isalnum(g_utf8_get_char(g_utf8_prev_char(match))))
        score += 180;
      first_character = FALSE;
    } else if (match == cursor) {
      score += 35;
    } else {
      score -= (g_utf8_pointer_to_offset(cursor, match) * 12);
    }

    cursor = g_utf8_next_char(match);
    query_cursor = g_utf8_next_char(query_cursor);
    skipped++;
  }

  score -= MAX(0, (g_utf8_strlen(text, -1) - skipped) / 4);
  return MAX(1, score);
}

static gint compare_rows(GtkListBoxRow *left, GtkListBoxRow *right,
                         gpointer data) {
  (void)data;
  AppEntry *a = g_object_get_data(G_OBJECT(left), "app-entry");
  AppEntry *b = g_object_get_data(G_OBJECT(right), "app-entry");
  if (a->match_score != b->match_score)
    return a->match_score > b->match_score ? -1 : 1;
  return g_utf8_collate(g_app_info_get_display_name(G_APP_INFO(a->app)),
                        g_app_info_get_display_name(G_APP_INFO(b->app)));
}

static void update_search(GtkEditable *editable, gpointer data) {
  (void)editable;
  Launcher *state = data;
  const char *text = gtk_editable_get_text(GTK_EDITABLE(state->search));
  char *folded_query = g_utf8_casefold(text ? text : "", -1);
  guint count = 0;
  for (guint i = 0; i < state->entries->len; i++) {
    AppEntry *entry = g_ptr_array_index(state->entries, i);
    char *folded_entry = g_utf8_casefold(entry->search_text, -1);
    entry->match_score = fuzzy_match_score(folded_query, folded_entry);
    gboolean matches = entry->match_score >= 0;
    gtk_widget_set_visible(GTK_WIDGET(entry->row), matches);
    if (matches)
      count++;
    g_free(folded_entry);
  }
  gtk_list_box_invalidate_sort(state->list);
  g_free(folded_query);

  gtk_list_box_select_row(state->list, first_visible_row(state, 1, NULL));

  char *footer = g_strdup_printf(
      "%u applications   ·   ↑↓ navigate   ·   Enter focus/open   ·   "
      "Shift+Enter new instance   ·   Esc close",
      count);
  gtk_label_set_text(state->footer, footer);
  g_free(footer);
}

static char *normalize_match(const char *text) {
  if (!text)
    return g_strdup("");
  char *folded = g_utf8_casefold(text, -1);
  GString *normalized = g_string_new(NULL);
  for (const char *p = folded; *p; p = g_utf8_next_char(p)) {
    gunichar ch = g_utf8_get_char(p);
    if (g_unichar_isalnum(ch))
      g_string_append_unichar(normalized, ch);
  }
  g_free(folded);
  return g_string_free(normalized, FALSE);
}

static gboolean ends_with_component(const char *value, const char *candidate) {
  if (!*value || !*candidate)
    return FALSE;
  if (g_str_equal(value, candidate))
    return TRUE;
  gsize value_len = strlen(value);
  gsize candidate_len = strlen(candidate);
  return candidate_len >= 4 && candidate_len < value_len &&
         g_str_has_suffix(value, candidate);
}

static gboolean app_matches_view(AppEntry *entry, JsonObject *view) {
  const char *app_id = json_string(view, "app-id");
  if (!app_id)
    app_id = json_string(view, "app_id");
  if (!app_id)
    return FALSE;

  char *view_id = normalize_match(app_id);
  char *desktop_id = normalize_match(entry->desktop_id);
  char *wm_class = normalize_match(entry->startup_wm_class);
  char *executable = normalize_match(entry->executable);
  char *exec_base = g_path_get_basename(executable);

  gboolean matches = ends_with_component(view_id, desktop_id) ||
                     ends_with_component(view_id, wm_class) ||
                     ends_with_component(view_id, exec_base);
  g_free(view_id);
  g_free(desktop_id);
  g_free(wm_class);
  g_free(executable);
  g_free(exec_base);
  return matches;
}

static JsonNode *wayfire_call(const char *method, JsonObject *data,
                              GError **error) {
  const char *socket_path = g_getenv("WAYFIRE_SOCKET");
  if (!socket_path || !*socket_path) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_NOT_FOUND,
                        "WAYFIRE_SOCKET is not set");
    return NULL;
  }

  JsonBuilder *builder = json_builder_new();
  json_builder_begin_object(builder);
  json_builder_set_member_name(builder, "method");
  json_builder_add_string_value(builder, method);
  if (data) {
    json_builder_set_member_name(builder, "data");
    json_builder_begin_object(builder);
    GList *members = json_object_get_members(data);
    for (GList *it = members; it; it = it->next) {
      const char *key = it->data;
      json_builder_set_member_name(builder, key);
      json_builder_add_value(builder,
                             json_node_copy(json_object_get_member(data, key)));
    }
    g_list_free(members);
    json_builder_end_object(builder);
  } else {
    json_builder_set_member_name(builder, "data");
    json_builder_begin_object(builder);
    json_builder_end_object(builder);
  }
  json_builder_end_object(builder);

  JsonGenerator *generator = json_generator_new();
  JsonNode *request_node = json_builder_get_root(builder);
  json_generator_set_root(generator, request_node);
  gsize request_size = 0;
  char *request = json_generator_to_data(generator, &request_size);
  if (request_size > MAX_IPC_MESSAGE) {
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                        "Wayfire IPC request is too large");
    g_free(request);
    json_node_free(request_node);
    g_object_unref(generator);
    g_object_unref(builder);
    return NULL;
  }

  GSocketClient *client = g_socket_client_new();
  g_socket_client_set_timeout(client, 1);
  GSocketAddress *address = g_unix_socket_address_new(socket_path);
  GSocketConnection *connection = g_socket_client_connect(
      client, G_SOCKET_CONNECTABLE(address), NULL, error);
  g_object_unref(address);
  if (!connection) {
    g_free(request);
    json_node_free(request_node);
    g_object_unref(generator);
    g_object_unref(builder);
    g_object_unref(client);
    return NULL;
  }

  GOutputStream *output =
      g_io_stream_get_output_stream(G_IO_STREAM(connection));
  GInputStream *input = g_io_stream_get_input_stream(G_IO_STREAM(connection));
  guint32 payload_size = GUINT32_TO_LE((guint32)request_size);
  gsize bytes_written = 0;
  gboolean ok =
      g_output_stream_write_all(output, &payload_size, sizeof(payload_size),
                                &bytes_written, NULL, error) &&
      g_output_stream_write_all(output, request, request_size, &bytes_written,
                                NULL, error);
  g_free(request);
  json_node_free(request_node);
  g_object_unref(generator);
  g_object_unref(builder);
  if (!ok)
    goto cleanup;

  guint32 response_size_le = 0;
  gsize bytes_read = 0;
  if (!g_input_stream_read_all(input, &response_size_le,
                               sizeof(response_size_le), &bytes_read, NULL,
                               error))
    goto cleanup;
  guint32 response_size = GUINT32_FROM_LE(response_size_le);
  if (response_size == 0 || response_size > MAX_IPC_MESSAGE) {
    g_set_error(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                "Invalid Wayfire IPC response length: %u", response_size);
    goto cleanup;
  }

  char *response = g_malloc(response_size + 1);
  if (!g_input_stream_read_all(input, response, response_size, &bytes_read,
                               NULL, error)) {
    g_free(response);
    goto cleanup;
  }
  response[response_size] = '\0';
  JsonParser *parser = json_parser_new();
  JsonNode *response_node = NULL;
  if (json_parser_load_from_data(parser, response, response_size, error)) {
    response_node = json_node_copy(json_parser_get_root(parser));
    if (JSON_NODE_HOLDS_OBJECT(response_node) &&
        json_object_has_member(json_node_get_object(response_node), "error")) {
      const char *message =
          json_string(json_node_get_object(response_node), "error");
      g_set_error(error, G_IO_ERROR, G_IO_ERROR_FAILED, "Wayfire IPC %s: %s",
                  method, message ? message : "request failed");
      json_node_free(response_node);
      response_node = NULL;
    }
  }
  g_object_unref(parser);
  g_free(response);

  g_io_stream_close(G_IO_STREAM(connection), NULL, NULL);
  g_object_unref(connection);
  g_object_unref(client);
  return response_node;

cleanup:
  g_io_stream_close(G_IO_STREAM(connection), NULL, NULL);
  g_object_unref(connection);
  g_object_unref(client);
  return NULL;
}

static gboolean focus_existing_view(AppEntry *entry) {
  GError *error = NULL;
  JsonNode *views_node = wayfire_call(VIEWS_METHOD, NULL, &error);
  if (!views_node) {
    g_debug("Wayfire window lookup unavailable: %s", error->message);
    g_clear_error(&error);
    return FALSE;
  }

  JsonArray *views = NULL;
  if (JSON_NODE_HOLDS_ARRAY(views_node))
    views = json_node_get_array(views_node);
  else if (JSON_NODE_HOLDS_OBJECT(views_node)) {
    JsonObject *object = json_node_get_object(views_node);
    if (json_object_has_member(object, "views")) {
      JsonNode *node = json_object_get_member(object, "views");
      if (JSON_NODE_HOLDS_ARRAY(node))
        views = json_node_get_array(node);
    }
  }
  if (!views) {
    json_node_free(views_node);
    return FALSE;
  }

  gboolean focused = FALSE;
  for (guint i = 0; i < json_array_get_length(views); i++) {
    JsonNode *view_node = json_array_get_element(views, i);
    if (!JSON_NODE_HOLDS_OBJECT(view_node))
      continue;
    JsonObject *view = json_node_get_object(view_node);
    if (!app_matches_view(entry, view))
      continue;
    JsonNode *id_node = json_object_get_member(view, "id");
    if (!id_node)
      continue;
    gint64 id = -1;
    if (JSON_NODE_HOLDS_VALUE(id_node)) {
      GType id_type = json_node_get_value_type(id_node);
      if (id_type == G_TYPE_INT64 || id_type == G_TYPE_INT ||
          id_type == G_TYPE_LONG || id_type == G_TYPE_UINT64 ||
          id_type == G_TYPE_UINT || id_type == G_TYPE_ULONG)
        id = json_node_get_int(id_node);
      else if (id_type == G_TYPE_STRING)
        id = g_ascii_strtoll(json_node_get_string(id_node), NULL, 10);
    }
    if (id < 0)
      continue;

    JsonBuilder *data_builder = json_builder_new();
    json_builder_begin_object(data_builder);
    json_builder_set_member_name(data_builder, "id");
    json_builder_add_int_value(data_builder, id);
    json_builder_end_object(data_builder);
    JsonNode *data_node = json_builder_get_root(data_builder);
    JsonObject *data = json_node_get_object(data_node);
    JsonNode *focus_result = wayfire_call(FOCUS_METHOD, data, &error);
    if (focus_result) {
      focused = TRUE;
      json_node_free(focus_result);
    } else {
      g_debug("Could not focus Wayfire view: %s",
              error ? error->message : "unknown error");
      g_clear_error(&error);
    }
    json_node_free(data_node);
    g_object_unref(data_builder);
    break;
  }
  json_node_free(views_node);
  return focused;
}

static char *replace_field_codes(const char *argument, AppEntry *entry,
                                 gboolean *skip_argument) {
  GString *result = g_string_new(NULL);
  const char *name = g_app_info_get_display_name(G_APP_INFO(entry->app));
  char *icon = g_desktop_app_info_get_string(entry->app, "Icon");
  const char *filename = g_desktop_app_info_get_filename(entry->app);
  for (const char *p = argument; *p; p++) {
    if (*p != '%' || !p[1]) {
      g_string_append_c(result, *p);
      continue;
    }
    p++;
    switch (*p) {
    case '%':
      g_string_append_c(result, '%');
      break;
    case 'c':
      g_string_append(result, name ? name : "");
      break;
    case 'k':
      g_string_append(result, filename ? filename : "");
      break;
    case 'i':
      /* The %i field expands to two argv entries, handled separately. */
      if (argument[0] == '%' && argument[1] == 'i' && !argument[2]) {
        if (icon && *icon) {
          g_string_append(result, "--icon=");
          g_string_append(result, icon);
        }
      }
      break;
    case 'f':
    case 'F':
    case 'u':
    case 'U':
    case 'd':
    case 'D':
    case 'n':
    case 'N':
    case 'v':
    case 'm':
      *skip_argument = TRUE;
      break;
    default:
      g_string_append_c(result, '%');
      g_string_append_c(result, *p);
      break;
    }
  }
  g_free(icon);
  return g_string_free(result, FALSE);
}

static gboolean launch_new_process(AppEntry *entry, GError **error) {
  if (g_desktop_app_info_get_boolean(entry->app, "Terminal")) {
    g_set_error_literal(
        error, G_IO_ERROR, G_IO_ERROR_NOT_SUPPORTED,
        "This app requires a terminal; using its normal launcher instead");
    return FALSE;
  }

  char *exec = g_desktop_app_info_get_string(entry->app, "Exec");
  if (!exec || !*exec) {
    g_free(exec);
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_NOT_FOUND,
                        "Desktop entry has no Exec command");
    return FALSE;
  }

  gint argc = 0;
  char **parsed = NULL;
  if (!g_shell_parse_argv(exec, &argc, &parsed, error)) {
    g_free(exec);
    return FALSE;
  }
  g_free(exec);

  GPtrArray *args = g_ptr_array_new_with_free_func(g_free);
  for (gint i = 0; i < argc; i++) {
    gboolean skip = FALSE;
    char *expanded = replace_field_codes(parsed[i], entry, &skip);
    if (skip || !*expanded) {
      g_free(expanded);
      continue;
    }
    g_ptr_array_add(args, expanded);
  }
  g_strfreev(parsed);
  if (args->len == 0) {
    g_ptr_array_unref(args);
    g_set_error_literal(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                        "Desktop entry has no usable command arguments");
    return FALSE;
  }
  g_ptr_array_add(args, NULL);
  gboolean launched =
      g_spawn_async(NULL, (char **)args->pdata, NULL, G_SPAWN_SEARCH_PATH, NULL,
                    NULL, NULL, error);
  g_ptr_array_unref(args);
  return launched;
}

static void activate_entry(AppEntry *entry, gboolean new_instance) {
  if (!entry)
    return;

  if (!new_instance && focus_existing_view(entry)) {
    g_application_quit(G_APPLICATION(launcher->application));
    return;
  }

  GError *error = NULL;
  gboolean launched = new_instance && launch_new_process(entry, &error);
  if (!launched) {
    if (error && new_instance)
      g_debug("Direct new-instance launch unavailable, falling back: %s",
              error->message);
    g_clear_error(&error);
    launched = g_app_info_launch(G_APP_INFO(entry->app), NULL, NULL, &error);
  }
  if (launched) {
    g_application_quit(G_APPLICATION(launcher->application));
  } else {
    gtk_label_set_text(launcher->footer,
                       error ? error->message : "Could not launch application");
    g_clear_error(&error);
  }
}

static void row_activated(GtkListBox *list, GtkListBoxRow *row, gpointer data) {
  (void)list;
  (void)data;
  AppEntry *entry = g_object_get_data(G_OBJECT(row), "app-entry");
  activate_entry(entry, FALSE);
}

static gboolean handle_key(GtkEventControllerKey *controller, guint keyval,
                           guint keycode, GdkModifierType state,
                           gpointer data) {
  (void)controller;
  (void)keycode;
  Launcher *launcher_state = data;
  if (keyval == GDK_KEY_Escape) {
    g_application_quit(G_APPLICATION(launcher_state->application));
    return TRUE;
  }
  if (keyval == GDK_KEY_Return || keyval == GDK_KEY_KP_Enter) {
    GtkListBoxRow *row = gtk_list_box_get_selected_row(launcher_state->list);
    if (!row)
      row = first_visible_row(launcher_state, 1, NULL);
    if (row)
      activate_entry(g_object_get_data(G_OBJECT(row), "app-entry"),
                     (state & GDK_SHIFT_MASK) != 0);
    return TRUE;
  }
  if (keyval == GDK_KEY_Down || keyval == GDK_KEY_Up) {
    GtkListBoxRow *current =
        gtk_list_box_get_selected_row(launcher_state->list);
    GtkListBoxRow *next = NULL;
    if (keyval == GDK_KEY_Down) {
      next = current ? first_visible_row(launcher_state, 1, current)
                     : first_visible_row(launcher_state, 1, NULL);
    } else {
      if (current) {
        GtkWidget *previous = gtk_widget_get_prev_sibling(GTK_WIDGET(current));
        while (previous && !gtk_widget_get_visible(previous))
          previous = gtk_widget_get_prev_sibling(previous);
        if (previous && GTK_IS_LIST_BOX_ROW(previous))
          next = GTK_LIST_BOX_ROW(previous);
      }
      if (!next) {
        for (GtkWidget *child =
                 gtk_widget_get_first_child(GTK_WIDGET(launcher_state->list));
             child; child = gtk_widget_get_next_sibling(child))
          if (GTK_IS_LIST_BOX_ROW(child) && gtk_widget_get_visible(child))
            next = GTK_LIST_BOX_ROW(child);
      }
    }
    if (next) {
      gtk_list_box_select_row(launcher_state->list, next);
      scroll_row_into_view(launcher_state, next);
    }
    return TRUE;
  }
  return FALSE;
}

static void append_applications(Launcher *state) {
  GList *apps = g_app_info_get_all();
  apps = g_list_sort(apps, compare_app_infos);
  for (GList *it = apps; it; it = it->next)
    add_application(state, G_APP_INFO(it->data));
  g_list_free_full(apps, g_object_unref);
}

static void build_ui(GtkApplication *application, gpointer data) {
  lui_init(LUI_STYLE_LAUNCHER);
  (void)data;
  Launcher *state = g_new0(Launcher, 1);
  launcher = state;
  state->application = application;
  state->entries = g_ptr_array_new_with_free_func(app_entry_free);

  state->window = GTK_WINDOW(gtk_application_window_new(application));
  gtk_window_set_title(state->window, "LiakOS Launcher");
  gtk_window_set_default_size(state->window, 620, 590);
  gtk_window_set_decorated(state->window, FALSE);
  gtk_widget_add_css_class(GTK_WIDGET(state->window), "launcher-overlay");

  gtk_layer_init_for_window(state->window);
  gtk_layer_set_namespace(state->window, "liakos-launcher");
  gtk_layer_set_layer(state->window, GTK_LAYER_SHELL_LAYER_OVERLAY);
  gtk_layer_set_anchor(state->window, GTK_LAYER_SHELL_EDGE_TOP, TRUE);
  gtk_layer_set_anchor(state->window, GTK_LAYER_SHELL_EDGE_BOTTOM, TRUE);
  gtk_layer_set_anchor(state->window, GTK_LAYER_SHELL_EDGE_LEFT, TRUE);
  gtk_layer_set_anchor(state->window, GTK_LAYER_SHELL_EDGE_RIGHT, TRUE);
  gtk_layer_set_exclusive_zone(state->window, -1);
  gtk_layer_set_keyboard_mode(state->window,
                              GTK_LAYER_SHELL_KEYBOARD_MODE_EXCLUSIVE);

  GtkWidget *center = lui_box_new(GTK_ORIENTATION_VERTICAL, 0);
  gtk_widget_set_halign(center, GTK_ALIGN_FILL);
  gtk_widget_set_valign(center, GTK_ALIGN_FILL);
  GtkWidget *panel = lui_box_new(GTK_ORIENTATION_VERTICAL, 0);
  gtk_widget_add_css_class(panel, "launcher-panel");
  gtk_widget_set_size_request(panel, 620, 590);
  gtk_widget_set_halign(panel, GTK_ALIGN_CENTER);
  gtk_widget_set_valign(panel, GTK_ALIGN_CENTER);
  gtk_box_append(GTK_BOX(center), panel);

  state->search = GTK_SEARCH_ENTRY(lui_search_new());
  gtk_widget_add_css_class(GTK_WIDGET(state->search), "launcher-search");
  gtk_search_entry_set_placeholder_text(state->search, "Search applications");
  gtk_box_append(GTK_BOX(panel), GTK_WIDGET(state->search));

  GtkWidget *scroll = gtk_scrolled_window_new();
  gtk_widget_set_vexpand(scroll, TRUE);
  gtk_widget_set_margin_bottom(scroll, 4);
  gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scroll), GTK_POLICY_NEVER,
                                 GTK_POLICY_AUTOMATIC);
  state->list = GTK_LIST_BOX(gtk_list_box_new());
  gtk_list_box_set_selection_mode(state->list, GTK_SELECTION_SINGLE);
  gtk_list_box_set_sort_func(state->list, compare_rows, NULL, NULL);
  gtk_widget_add_css_class(GTK_WIDGET(state->list), "launcher-list");
  gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scroll),
                                GTK_WIDGET(state->list));
  state->scroll_adjustment =
      gtk_scrolled_window_get_vadjustment(GTK_SCROLLED_WINDOW(scroll));
  gtk_box_append(GTK_BOX(panel), scroll);

  state->footer = GTK_LABEL(lui_label_new("Loading applications…"));
  gtk_label_set_xalign(state->footer, 0.0f);
  gtk_widget_add_css_class(GTK_WIDGET(state->footer), "launcher-footer");
  gtk_box_append(GTK_BOX(panel), GTK_WIDGET(state->footer));
  gtk_window_set_child(state->window, center);

  append_applications(state);
  gtk_list_box_select_row(state->list, first_visible_row(state, 1, NULL));
  update_search(GTK_EDITABLE(state->search), state);
  g_signal_connect(state->search, "search-changed", G_CALLBACK(update_search),
                   state);
  g_signal_connect(state->list, "row-activated", G_CALLBACK(row_activated),
                   state);

  GtkEventController *keys = gtk_event_controller_key_new();
  gtk_event_controller_set_propagation_phase(keys, GTK_PHASE_CAPTURE);
  g_signal_connect(keys, "key-pressed", G_CALLBACK(handle_key), state);
  gtk_widget_add_controller(GTK_WIDGET(state->window), keys);

  gtk_window_present(state->window);
  gtk_widget_grab_focus(GTK_WIDGET(state->search));
}

int main(int argc, char **argv) {
  GtkApplication *application =
      gtk_application_new("com.liakos.Launcher", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(application, "activate", G_CALLBACK(build_ui), NULL);
  int status = g_application_run(G_APPLICATION(application), argc, argv);
  lui_shutdown();
  if (launcher) {
    g_ptr_array_unref(launcher->entries);
    g_free(launcher);
    launcher = NULL;
  }
  g_object_unref(application);
  return status;
}
