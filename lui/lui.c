#include "lui.h"
#include <json-glib/json-glib.h>
#include <math.h>
#include <string.h>

GResource *lui_assets_get_resource(void);

typedef struct {
    LuiStyle style;
    GdkDisplay *display;
    GtkCssProvider *provider;
    GPtrArray *monitors;
    char *path;
    char *stylesheet;
    guint reload;
    gboolean applied;
    GdkRGBA colors[LUI_COLOR_COUNT];
} LuiTheme;
static LuiTheme *theme;
static LuiStyle current_style(void) { return theme ? theme->style : LUI_STYLE_GALLERY; }

/* Preserve the established app geometry while keeping construction in LUI. */
typedef struct {
    int page_spacing, top, end, bottom, start;
    int card_spacing, header_spacing, text_spacing, tile_spacing;
} LuiLayout;
static const LuiLayout layouts[] = {
    [LUI_STYLE_SETTINGS] = {16, 12, 30, 24, 30, 9, 6, 4, 14},
    [LUI_STYLE_AUTOSTART] = {14, 20, 20, 16, 20, 12, 14, 3, 12},
    [LUI_STYLE_KEYBINDINGS] = {12, 24, 24, 24, 24, 12, 6, 5, 12},
    [LUI_STYLE_DISPLAYS] = {12, 24, 24, 24, 24, 12, 4, 3, 12},
    [LUI_STYLE_LAUNCHER] = {12, 24, 24, 24, 24, 12, 6, 6, 12},
    [LUI_STYLE_SESSION] = {12, 24, 24, 24, 24, 12, 6, 6, 12},
    [LUI_STYLE_WALLPAPER] = {12, 16, 16, 16, 16, 4, 6, 6, 12},
    [LUI_STYLE_GALLERY] = {12, 24, 24, 24, 24, 12, 6, 6, 12},
};
static const LuiLayout *layout(void) { return &layouts[current_style()]; }
static const char *names[] = {
    "background", "foreground", "accent", "surface", "muted", "border",
    "secondary", "tertiary"
};
static const char *defaults[] = {
    "#181b24", "#f3f4f6", "#8aa4ff", "#202431", "#a9aec7", "#414653",
    "#d3869b", "#a3be8c"
};

static double linear(double channel) {
    return channel <= .04045 ? channel / 12.92 : pow((channel + .055) / 1.055, 2.4);
}
static double luminance(GdkRGBA c) {
    return .2126 * linear(c.red) + .7152 * linear(c.green) + .0722 * linear(c.blue);
}
static double contrast(GdkRGBA a, GdkRGBA b) {
    double x = luminance(a), y = luminance(b);
    return (MAX(x, y) + .05) / (MIN(x, y) + .05);
}
static GdkRGBA readable_on(GdkRGBA background) {
    GdkRGBA black = {0, 0, 0, 1}, white = {1, 1, 1, 1};
    return contrast(black, background) > contrast(white, background) ? black : white;
}
static gboolean valid_hex(const char *value) {
    if (!value || value[0] != '#' || strlen(value) != 7) return FALSE;
    for (int i = 1; i < 7; ++i) if (!g_ascii_isxdigit(value[i])) return FALSE;
    return TRUE;
}
static const char *palette_value(JsonObject *root, const char *group, const char *key) {
    if (!root || !json_object_has_member(root, group)) return NULL;
    JsonNode *node = json_object_get_member(root, group);
    if (!JSON_NODE_HOLDS_OBJECT(node)) return NULL;
    JsonObject *object = json_node_get_object(node);
    if (!json_object_has_member(object, key)) return NULL;
    node = json_object_get_member(object, key);
    if (!JSON_NODE_HOLDS_VALUE(node) || json_node_get_value_type(node) != G_TYPE_STRING)
        return NULL;
    const char *value = json_node_get_string(node);
    return valid_hex(value) ? value : NULL;
}
static void defaults_into(GdkRGBA *colors) {
    for (int i = 0; i < LUI_COLOR_COUNT; ++i) gdk_rgba_parse(&colors[i], defaults[i]);
    switch (current_style()) {
    case LUI_STYLE_SETTINGS:
        gdk_rgba_parse(&colors[LUI_COLOR_SURFACE], "#252a38");
        break;
    case LUI_STYLE_AUTOSTART:
    case LUI_STYLE_LAUNCHER:
        gdk_rgba_parse(&colors[LUI_COLOR_BACKGROUND], "#15171c");
        gdk_rgba_parse(&colors[LUI_COLOR_FOREGROUND], "#e6e8ef");
        gdk_rgba_parse(&colors[LUI_COLOR_ACCENT], "#89b4fa");
        gdk_rgba_parse(&colors[LUI_COLOR_SURFACE], "#20232b");
        gdk_rgba_parse(&colors[LUI_COLOR_MUTED], "#818595");
        break;
    case LUI_STYLE_SESSION:
        gdk_rgba_parse(&colors[LUI_COLOR_MUTED], "#9298a8");
        break;
    default:
        break;
    }
}
static void append_color(GString *css, const char *name, GdkRGBA color) {
    char *value = gdk_rgba_to_string(&color);
    g_string_append_printf(css, "@define-color lui_%s %s;\n", name, value);
    g_free(value);
}
static void apply_theme(void) {
    JsonParser *parser = json_parser_new();
    JsonObject *root = NULL;
    GError *error = NULL;
    gboolean loaded = json_parser_load_from_file(parser, theme->path, &error);
    if (loaded && JSON_NODE_HOLDS_OBJECT(json_parser_get_root(parser)))
        root = json_node_get_object(json_parser_get_root(parser));
    /* Keep the last working palette during incomplete/invalid writes. A missing
     * file returns to defaults; the directory monitors also catch its creation. */
    if (theme->applied && ((!loaded && !g_error_matches(error, G_FILE_ERROR, G_FILE_ERROR_NOENT)) ||
        (loaded && !root))) {
        g_clear_error(&error);
        g_object_unref(parser);
        return;
    }
    const char *groups[] = {"special", "special", "colors", "colors", "colors",
                            "colors", "colors", "colors"};
    const char *keys[] = {"background", "foreground", "color4", "color0", "color8",
                          "color8", "color5", "color2"};
    defaults_into(theme->colors);
    for (int i = 0; i < LUI_COLOR_COUNT; ++i) {
        const char *value = palette_value(root, groups[i], keys[i]);
        if (value) gdk_rgba_parse(&theme->colors[i], value);
    }
    GdkRGBA bg = theme->colors[LUI_COLOR_BACKGROUND];
    if (theme->style == LUI_STYLE_GALLERY && contrast(theme->colors[LUI_COLOR_FOREGROUND], bg) < 4.5)
        theme->colors[LUI_COLOR_FOREGROUND] = readable_on(bg);
    if (theme->style == LUI_STYLE_GALLERY && contrast(theme->colors[LUI_COLOR_MUTED], bg) < 4.5)
        theme->colors[LUI_COLOR_MUTED] = theme->colors[LUI_COLOR_FOREGROUND];
    GString *css = g_string_new(NULL);
    for (int i = 0; i < LUI_COLOR_COUNT; ++i) append_color(css, names[i], theme->colors[i]);
    append_color(css, "on_accent", readable_on(theme->colors[LUI_COLOR_ACCENT]));
    GdkRGBA destructive;
    gdk_rgba_parse(&destructive, "#c53b53");
    append_color(css, "destructive", destructive);
    append_color(css, "on_destructive", readable_on(destructive));
    g_string_append(css, theme->stylesheet);
    gtk_css_provider_load_from_string(theme->provider, css->str);
    g_string_free(css, TRUE);
    theme->applied = TRUE;
    g_clear_error(&error);
    g_object_unref(parser);
    /* Includes custom drawing areas, e.g. the display arrangement preview. */
    GListModel *windows = gtk_window_get_toplevels();
    for (guint i = 0; i < g_list_model_get_n_items(windows); ++i) {
        GtkWidget *window = g_list_model_get_item(windows, i);
        gtk_widget_queue_draw(window);
        g_object_unref(window);
    }
}
static void watch_palette(void);
static gboolean reload_theme(gpointer data) {
    (void)data;
    theme->reload = 0;
    apply_theme();
    watch_palette();
    return G_SOURCE_REMOVE;
}
static void changed(GFileMonitor *monitor, GFile *file, GFile *other,
                     GFileMonitorEvent event, gpointer data) {
    (void)monitor; (void)event; (void)data;
    /* Observe only the palette or its ancestors, not unrelated cache writes. */
    GFile *palette = g_file_new_for_path(theme->path);
    gboolean relevant = g_file_equal(palette, file) || g_file_has_prefix(palette, file) ||
        (other && (g_file_equal(palette, other) || g_file_has_prefix(palette, other)));
    g_object_unref(palette);
    if (!relevant) return;
    if (theme->reload) g_source_remove(theme->reload);
    theme->reload = g_timeout_add(100, reload_theme, NULL);
}
static void cancel_monitor(gpointer data) {
    g_file_monitor_cancel(G_FILE_MONITOR(data));
    g_object_unref(data);
}
static void watch_palette(void) {
    g_ptr_array_set_size(theme->monitors, 0);
    char *directory = g_path_get_dirname(theme->path);
    /* Watch the nearest existing ancestor as well as its parent so initial
     * directory creation and atomic replacement of the wal directory work. */
    while (!g_file_test(directory, G_FILE_TEST_IS_DIR)) {
        char *parent = g_path_get_dirname(directory);
        if (g_str_equal(parent, directory)) { g_free(parent); break; }
        g_free(directory); directory = parent;
    }
    for (int i = 0; i < 2; ++i) {
        GFile *file = g_file_new_for_path(directory);
        GFileMonitor *monitor = g_file_monitor_directory(file, G_FILE_MONITOR_WATCH_MOVES, NULL, NULL);
        if (monitor) {
            g_signal_connect(monitor, "changed", G_CALLBACK(changed), NULL);
            g_ptr_array_add(theme->monitors, monitor);
        }
        g_object_unref(file);
        char *parent = g_path_get_dirname(directory);
        g_free(directory); directory = parent;
    }
    g_free(directory);
}
static void append_resource(GString *css, const char *name) {
    char *path = g_strdup_printf("/org/liakos/lui/styles/%s.css", name);
    GBytes *bytes = g_resource_lookup_data(lui_assets_get_resource(), path, 0, NULL);
    g_assert(bytes != NULL);
    gsize size;
    const char *data = g_bytes_get_data(bytes, &size);
    g_string_append_len(css, data, size);
    g_bytes_unref(bytes);
    g_free(path);
}
void lui_init(LuiStyle style) {
    g_return_if_fail(style >= LUI_STYLE_SETTINGS && style <= LUI_STYLE_GALLERY);
    if (theme) return;
    GdkDisplay *display = gdk_display_get_default();
    g_return_if_fail(display != NULL);
    theme = g_new0(LuiTheme, 1);
    theme->style = style;
    theme->display = g_object_ref(display);
    theme->provider = gtk_css_provider_new();
    theme->path = g_build_filename(g_get_user_cache_dir(), "wal", "colors.json", NULL);
    theme->monitors = g_ptr_array_new_with_free_func(cancel_monitor);
    defaults_into(theme->colors);
    GString *css = g_string_new(NULL);
    /* Native profiles preserve their original styling. In particular, Lpaper
     * keeps the system GTK appearance it used before adopting LUI. */
    const char *profiles[] = {"settings", "autostart", "keybindings", "displays", "launcher", "session"};
    if (style < LUI_STYLE_WALLPAPER) append_resource(css, profiles[style]);
    if (style == LUI_STYLE_GALLERY) {
        append_resource(css, "common");
        append_resource(css, "components");
    }
    theme->stylesheet = g_string_free(css, FALSE);
    gtk_style_context_add_provider_for_display(display, GTK_STYLE_PROVIDER(theme->provider),
                                               GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);
    apply_theme();
    watch_palette();
}
void lui_shutdown(void) {
    if (!theme) return;
    if (theme->reload) g_source_remove(theme->reload);
    g_ptr_array_unref(theme->monitors);
    gtk_style_context_remove_provider_for_display(theme->display, GTK_STYLE_PROVIDER(theme->provider));
    g_object_unref(theme->provider);
    g_object_unref(theme->display);
    g_free(theme->path); g_free(theme->stylesheet); g_free(theme); theme = NULL;
}
GdkRGBA lui_color(LuiColor role) {
    g_return_val_if_fail(role >= 0 && role < LUI_COLOR_COUNT, ((GdkRGBA){0, 0, 0, 1}));
    if (theme) return theme->colors[role];
    GdkRGBA color;
    gdk_rgba_parse(&color, defaults[role]);
    return color;
}
GdkRGBA lui_color_on(LuiColor background) { return readable_on(lui_color(background)); }
GdkRGBA lui_preview_background(void) { return (GdkRGBA){0, 0, 0, .12}; }
GdkRGBA lui_preview_foreground(void) { return (GdkRGBA){1, 1, 1, 1}; }
GtkWidget *lui_text_new(const char *text, LuiTextRole role) {
    static const char *classes[] = {"lui-body", "lui-title", "lui-subtitle", "lui-heading", "lui-caption", "lui-status"};
    g_return_val_if_fail(role >= LUI_TEXT_BODY && role <= LUI_TEXT_STATUS, NULL);
    GtkWidget *label = gtk_label_new(text);
    gtk_widget_add_css_class(label, classes[role]);
    return label;
}
GtkWidget *lui_label_new(const char *text) { return lui_text_new(text, LUI_TEXT_BODY); }
GtkWidget *lui_title_new(const char *text) { return lui_text_new(text, LUI_TEXT_TITLE); }
GtkWidget *lui_subtitle_new(const char *text) {
    GtkWidget *label = lui_text_new(text, LUI_TEXT_SUBTITLE);
    gtk_label_set_wrap(GTK_LABEL(label), TRUE);
    return label;
}
GtkWidget *lui_button_new(const char *text, LuiButtonVariant variant) {
    g_return_val_if_fail(variant >= LUI_BUTTON_NORMAL && variant <= LUI_BUTTON_FLAT, NULL);
    GtkWidget *button = text ? gtk_button_new_with_label(text) : gtk_button_new();
    gtk_widget_add_css_class(button, "lui-button");
    const char *classes[] = {NULL, "suggested-action", "destructive-action", "flat"};
    if (classes[variant]) gtk_widget_add_css_class(button, classes[variant]);
    return button;
}
GtkWidget *lui_icon_button_new(const char *icon, const char *accessible_label) {
    GtkWidget *button = lui_button_new(NULL, current_style() == LUI_STYLE_GALLERY ? LUI_BUTTON_FLAT : LUI_BUTTON_NORMAL);
    gtk_button_set_icon_name(GTK_BUTTON(button), icon);
    gtk_widget_add_css_class(button, "lui-icon-button");
    lui_icon_button_set_label(button, accessible_label);
    return button;
}
void lui_icon_button_set_label(GtkWidget *button, const char *label) {
    g_return_if_fail(GTK_IS_BUTTON(button));
    gtk_widget_set_tooltip_text(button, label);
    gtk_accessible_update_property(GTK_ACCESSIBLE(button), GTK_ACCESSIBLE_PROPERTY_LABEL, label, -1);
}
GtkWidget *lui_box_new(GtkOrientation orientation, int spacing) {
    return gtk_box_new(orientation, spacing < 0 ? LUI_SPACE_MEDIUM : spacing);
}
GtkWidget *lui_grid_new(void) {
    GtkWidget *grid = gtk_grid_new();
    if (current_style() == LUI_STYLE_GALLERY) {
        gtk_grid_set_row_spacing(GTK_GRID(grid), LUI_SPACE_MEDIUM);
        gtk_grid_set_column_spacing(GTK_GRID(grid), LUI_SPACE_MEDIUM);
    }
    return grid;
}
GtkWidget *lui_search_new(void) {
    GtkWidget *search = gtk_search_entry_new();
    gtk_widget_add_css_class(search, "lui-search");
    return search;
}
GtkWidget *lui_card_new(GtkWidget *child) {
    GtkWidget *box = lui_box_new(GTK_ORIENTATION_VERTICAL, layout()->card_spacing);
    gtk_widget_add_css_class(box, "lui-card");
    if (child) gtk_box_append(GTK_BOX(box), child);
    return box;
}
static GtkWidget *left_text(const char *text, LuiTextRole role) {
    GtkWidget *label = lui_text_new(text, role);
    gtk_label_set_xalign(GTK_LABEL(label), 0);
    gtk_label_set_wrap(GTK_LABEL(label), current_style() == LUI_STYLE_GALLERY);
    return label;
}
GtkWidget *lui_page_header_new(const char *title, const char *subtitle) {
    GtkWidget *box = lui_box_new(GTK_ORIENTATION_VERTICAL, layout()->header_spacing);
    gtk_widget_add_css_class(box, "lui-page-header");
    gtk_box_append(GTK_BOX(box), left_text(title, LUI_TEXT_TITLE));
    if (subtitle && *subtitle) {
        GtkWidget *description = left_text(subtitle, LUI_TEXT_SUBTITLE);
        if (current_style() == LUI_STYLE_SETTINGS)
            gtk_label_set_wrap(GTK_LABEL(description), TRUE);
        gtk_box_append(GTK_BOX(box), description);
    }
    if (current_style() == LUI_STYLE_AUTOSTART || current_style() == LUI_STYLE_SETTINGS) {
        for (GtkWidget *label = gtk_widget_get_first_child(box); label; label = gtk_widget_get_next_sibling(label))
            gtk_widget_set_halign(label, GTK_ALIGN_START);
    }
    return box;
}
GtkWidget *lui_setting_row_new(const char *title, const char *subtitle, GtkWidget *control) {
    GtkWidget *row = lui_box_new(GTK_ORIENTATION_HORIZONTAL, current_style() == LUI_STYLE_SETTINGS ? 20 : LUI_SPACE_MEDIUM);
    GtkWidget *text = subtitle ? lui_text_group_new(title, subtitle) : left_text(title, LUI_TEXT_BODY);
    gtk_widget_set_hexpand(text, TRUE);
    if (!subtitle) gtk_widget_set_halign(text, GTK_ALIGN_START);
    gtk_widget_add_css_class(row, "lui-setting-row");
    gtk_box_append(GTK_BOX(row), text);
    if (control) {
        gtk_widget_set_valign(control, GTK_ALIGN_CENTER);
        gtk_box_append(GTK_BOX(row), control);
    }
    return row;
}
GtkWidget *lui_action_bar_new(void) {
    GtkWidget *box = lui_box_new(GTK_ORIENTATION_HORIZONTAL, current_style() == LUI_STYLE_AUTOSTART ? 10 : LUI_SPACE_MEDIUM);
    gtk_widget_set_halign(box, GTK_ALIGN_END);
    return box;
}

GtkWidget *lui_text_group_new(const char *title, const char *subtitle) {
    GtkWidget *text = lui_box_new(GTK_ORIENTATION_VERTICAL, layout()->text_spacing);
    gtk_widget_set_hexpand(text, current_style() != LUI_STYLE_SETTINGS);
    GtkWidget *name = left_text(title, LUI_TEXT_BODY);
    gtk_box_append(GTK_BOX(text), name);
    GtkWidget *detail = NULL;
    if (subtitle && *subtitle) {
        detail = left_text(subtitle, LUI_TEXT_SUBTITLE);
        gtk_box_append(GTK_BOX(text), detail);
    }
    if (current_style() == LUI_STYLE_KEYBINDINGS) {
        gtk_widget_add_css_class(name, "binding-title");
        if (detail) gtk_widget_add_css_class(detail, "binding-meta");
    } else if (current_style() == LUI_STYLE_AUTOSTART) {
        gtk_widget_add_css_class(name, "application-name");
    }
    if (current_style() == LUI_STYLE_SETTINGS || current_style() == LUI_STYLE_AUTOSTART) {
        gtk_widget_set_halign(name, GTK_ALIGN_START);
        if (detail) gtk_widget_set_halign(detail, GTK_ALIGN_START);
    }
    return text;
}
GtkWidget *lui_text_group_new_ellipsized(const char *title, const char *subtitle) {
    GtkWidget *text = lui_text_group_new(title, subtitle);
    for (GtkWidget *label = gtk_widget_get_first_child(text); label;
         label = gtk_widget_get_next_sibling(label)) {
        gtk_label_set_wrap(GTK_LABEL(label), FALSE);
        gtk_label_set_ellipsize(GTK_LABEL(label), PANGO_ELLIPSIZE_END);
    }
    return text;
}
GtkWidget *lui_action_tile_new(const char *title, const char *subtitle,
                               const char *icon, GtkOrientation orientation) {
    GtkWidget *button = lui_button_new(NULL, LUI_BUTTON_NORMAL);
    GtkWidget *box = lui_box_new(orientation, layout()->tile_spacing);
    GtkWidget *image = gtk_image_new_from_icon_name(icon);
    if (current_style() != LUI_STYLE_SESSION) gtk_image_set_pixel_size(GTK_IMAGE(image), 28);
    gtk_box_append(GTK_BOX(box), image);
    if (current_style() == LUI_STYLE_SESSION) {
        gtk_widget_set_halign(box, GTK_ALIGN_CENTER);
        gtk_widget_set_valign(box, GTK_ALIGN_CENTER);
        GtkWidget *name = lui_label_new(title);
        gtk_widget_add_css_class(name, "action-label");
        GtkWidget *detail = lui_label_new(subtitle);
        gtk_widget_add_css_class(detail, "hint");
        gtk_box_append(GTK_BOX(box), name);
        gtk_box_append(GTK_BOX(box), detail);
    } else {
        gtk_box_append(GTK_BOX(box), lui_text_group_new(title, subtitle));
    }
    gtk_button_set_child(GTK_BUTTON(button), box);
    return button;
}

GtkWidget *lui_page_new(void) {
    GtkWidget *page = lui_box_new(GTK_ORIENTATION_VERTICAL, layout()->page_spacing);
    gtk_widget_set_margin_top(page, layout()->top);
    gtk_widget_set_margin_bottom(page, layout()->bottom);
    gtk_widget_set_margin_start(page, layout()->start);
    gtk_widget_set_margin_end(page, layout()->end);
    if (current_style() == LUI_STYLE_AUTOSTART) gtk_widget_add_css_class(page, "autostart-panel");
    return page;
}
GtkWidget *lui_list_row_new(GtkWidget *child) {
    GtkWidget *row = gtk_list_box_row_new();
    gtk_widget_add_css_class(row, "lui-list-row");
    if (child) gtk_list_box_row_set_child(GTK_LIST_BOX_ROW(row), child);
    return row;
}
