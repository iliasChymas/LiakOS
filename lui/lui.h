#ifndef LIAKOS_UI_H
#define LIAKOS_UI_H

#include <gtk/gtk.h>

G_BEGIN_DECLS

/* One style profile per process. Repeated initialization is harmless. Call on
 * the GTK main thread after opening a display; release at application exit. */
typedef enum {
    LUI_STYLE_SETTINGS, LUI_STYLE_AUTOSTART, LUI_STYLE_KEYBINDINGS,
    LUI_STYLE_DISPLAYS, LUI_STYLE_LAUNCHER, LUI_STYLE_SESSION,
    LUI_STYLE_WALLPAPER, LUI_STYLE_GALLERY
} LuiStyle;
typedef enum {
    LUI_BUTTON_NORMAL, LUI_BUTTON_PRIMARY, LUI_BUTTON_DESTRUCTIVE,
    LUI_BUTTON_FLAT
} LuiButtonVariant;
typedef enum {
    LUI_TEXT_BODY, LUI_TEXT_TITLE, LUI_TEXT_SUBTITLE, LUI_TEXT_HEADING,
    LUI_TEXT_CAPTION, LUI_TEXT_STATUS
} LuiTextRole;
typedef enum {
    LUI_COLOR_BACKGROUND, LUI_COLOR_FOREGROUND, LUI_COLOR_ACCENT,
    LUI_COLOR_SURFACE, LUI_COLOR_MUTED, LUI_COLOR_BORDER,
    LUI_COLOR_SECONDARY, LUI_COLOR_TERTIARY, LUI_COLOR_COUNT
} LuiColor;
enum { LUI_SPACE_SMALL = 6, LUI_SPACE_MEDIUM = 12, LUI_SPACE_LARGE = 24 };

void lui_init(LuiStyle style);
void lui_shutdown(void);
/* For custom drawing only. Ordinary widgets receive their colors from LUI CSS.
 * Returned color is copied; call again when redrawing after palette changes. */
GdkRGBA lui_color(LuiColor role);
GdkRGBA lui_color_on(LuiColor background);
GdkRGBA lui_preview_background(void);
GdkRGBA lui_preview_foreground(void);

/* Constructors use the active profile's established geometry and follow GTK
 * floating-reference ownership. Containers take ownership when widgets are
 * parented. Text is plain text, never markup. */
GtkWidget *lui_text_new(const char *text, LuiTextRole role);
GtkWidget *lui_label_new(const char *text);
GtkWidget *lui_title_new(const char *text);
GtkWidget *lui_subtitle_new(const char *text);
GtkWidget *lui_button_new(const char *text, LuiButtonVariant variant);
GtkWidget *lui_icon_button_new(const char *icon, const char *accessible_label);
/* Update the visible hint and screen-reader label together. */
void lui_icon_button_set_label(GtkWidget *button, const char *label);
GtkWidget *lui_box_new(GtkOrientation orientation, int spacing);
GtkWidget *lui_grid_new(void);
GtkWidget *lui_page_new(void);
GtkWidget *lui_list_row_new(GtkWidget *child);
GtkWidget *lui_search_new(void);
GtkWidget *lui_card_new(GtkWidget *child);
GtkWidget *lui_page_header_new(const char *title, const char *subtitle);
GtkWidget *lui_setting_row_new(const char *title, const char *subtitle,
                               GtkWidget *control);
GtkWidget *lui_action_bar_new(void);
GtkWidget *lui_text_group_new(const char *title, const char *subtitle);
/* Single-line labels that shrink instead of imposing the text's full width. */
GtkWidget *lui_text_group_new_ellipsized(const char *title, const char *subtitle);
GtkWidget *lui_action_tile_new(const char *title, const char *subtitle,
                               const char *icon, GtkOrientation orientation);

G_END_DECLS
#endif
