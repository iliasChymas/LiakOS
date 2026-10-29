#define _GNU_SOURCE
#include "display-config.h"
#include <glib/gstdio.h>
#include <sys/stat.h>
#include <unistd.h>

static char *directory, *kanshi;
static void put(const char *path, const char *text) {
  GError *error = NULL;
  g_assert_true(g_file_set_contents(path, text, -1, &error));
  g_assert_no_error(error);
}
static char *read_file(const char *path) {
  char *text = NULL;
  GError *error = NULL;
  g_assert_true(g_file_get_contents(path, &text, NULL, &error));
  g_assert_no_error(error);
  return text;
}
static void contains(const char *text, const char *part) { g_assert_nonnull(strstr(text, part)); }
static void reset(void) {
  g_unlink(kanshi);
  char *backup = g_strconcat(kanshi, ".liakos-backup", NULL);
  g_unlink(backup);
  g_free(backup);
}
static void save(GPtrArray *settings) {
  GError *error = NULL;
  g_assert_true(save_display_config(kanshi, settings, &error));
  g_assert_no_error(error);
}
static void test_save(void) {
  reset();
  const char *user = "# user profile\ninclude /etc/kanshi/config.d/*\nprofile user {\n output eDP-1 enable\n}\n";
  put(kanshi, user);
  g_assert_cmpint(g_chmod(kanshi, 0640), ==, 0);
  MonitorSetting a = {"DP-1", "1920x1080@71.910Hz", "flipped-90", TRUE, 1.25, -1536, 20};
  MonitorSetting b = {"HDMI-A-1", "3840x2160@59.940Hz", "270", FALSE, 1.5, 0, -80};
  GPtrArray *settings = g_ptr_array_new();
  g_ptr_array_add(settings, &a);
  g_ptr_array_add(settings, &b);
  save(settings);
  char *text = read_file(kanshi);
  contains(text, "output DP-1 enable mode 1920x1080@71.910Hz position -1536,20 scale 1.25 transform flipped-90\n");
  contains(text, "output HDMI-A-1 disable mode 3840x2160@59.940Hz position 0,-80 scale 1.5 transform 270\n");
  g_assert_true(g_str_has_suffix(text, user));
  /* Output enumeration order must not create a different topology/profile. */
  settings->pdata[0] = &b;
  settings->pdata[1] = &a;
  save(settings);
  char *again = read_file(kanshi);
  g_assert_cmpstr(again, ==, text);
  char *backup = g_strconcat(kanshi, ".liakos-backup", NULL);
  char *backup_text = read_file(backup);
  g_assert_cmpstr(backup_text, ==, user);
  struct stat st;
  g_assert_cmpint(stat(kanshi, &st), ==, 0);
  g_assert_cmpint(st.st_mode & 0777, ==, 0640);
  g_free(backup_text); g_free(backup); g_free(again);
  g_free(text); g_ptr_array_unref(settings);
}
static guint count(const char *text, const char *needle) {
  guint n = 0;
  while ((text = strstr(text, needle))) { n++; text += strlen(needle); }
  return n;
}
static void test_topologies(void) {
  reset();
  MonitorSetting a = {"DP-1", "1920x1080@60.000Hz", "normal", TRUE, 1, 0, 0};
  MonitorSetting b = {"eDP-1", "1920x1080@60.000Hz", "normal", FALSE, 1, 1920, 0};
  GPtrArray *settings = g_ptr_array_new();
  g_ptr_array_add(settings, &a); g_ptr_array_add(settings, &b);
  save(settings);
  g_ptr_array_remove_index(settings, 1);
  a.x = -1920;
  save(settings);
  char *text = read_file(kanshi);
  g_assert_cmpuint(count(text, "profile liakos-"), ==, 2);
  contains(text, "position -1920,0");
  contains(text, "output eDP-1 disable");
  a.x = -2560;
  save(settings);
  char *again = read_file(kanshi);
  g_assert_cmpuint(count(again, "profile liakos-"), ==, 2);
  contains(again, "position -2560,0");
  g_assert_null(strstr(again, "position -1920,0"));
  g_free(text); g_free(again); g_ptr_array_unref(settings);
}
static void test_markers(void) {
  reset();
  MonitorSetting a = {"DP-1", "1920x1080@60.000Hz", "normal", TRUE, 1, 0, 0};
  GPtrArray *settings = g_ptr_array_new(); g_ptr_array_add(settings, &a);
  save(settings);
  char *text = read_file(kanshi);
  char *end = strstr(text, "# END liakos-displays");
  g_assert_nonnull(end);
  *end = 0;
  put(kanshi, text);
  GError *error = NULL;
  g_assert_false(save_display_config(kanshi, settings, &error));
  g_assert_error(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA); g_clear_error(&error);
  char *after = read_file(kanshi); g_assert_cmpstr(after, ==, text);
  g_free(after); g_free(text); g_ptr_array_unref(settings);
}
static void test_transforms(void) {
  const char *transforms[] = {"normal", "90", "180", "270", "flipped", "flipped-90", "flipped-180", "flipped-270"};
  for (guint i = 0; i < G_N_ELEMENTS(transforms); i++) {
    reset();
    MonitorSetting a = {"DP-1", "2560x1440@143.998Hz", (char *)transforms[i], TRUE, 1.125, 0, -100};
    GPtrArray *settings = g_ptr_array_new(); g_ptr_array_add(settings, &a); save(settings);
    char *text = read_file(kanshi), *expected = g_strconcat("transform ", transforms[i], "\n", NULL);
    contains(text, expected); contains(text, "mode 2560x1440@143.998Hz");
    g_free(text); g_free(expected); g_ptr_array_unref(settings);
  }
}
static void test_symlink(void) {
  reset();
  char *target = g_build_filename(directory, "real.conf", NULL);
  put(target, "# untouched\n");
  g_assert_cmpint(symlink(target, kanshi), ==, 0);
  MonitorSetting a = {"DP-1", "1920x1080@60.000Hz", "normal", TRUE, 1, 0, 0};
  GPtrArray *settings = g_ptr_array_new(); g_ptr_array_add(settings, &a); save(settings);
  g_assert_true(g_file_test(kanshi, G_FILE_TEST_IS_SYMLINK));
  char *text = read_file(target); contains(text, "# untouched\n"); contains(text, "mode 1920x1080@60.000Hz");
  g_free(text); g_ptr_array_unref(settings); g_unlink(kanshi); g_unlink(target);
  char *backup = g_strconcat(target, ".liakos-backup", NULL);
  g_unlink(backup); g_free(backup); g_free(target);
}
static void test_invalid_save(void) {
  reset(); put(kanshi, "# unchanged\n");
  MonitorSetting a = {"DP-1]\\n[command", "1920x1080@60.000Hz", "normal", TRUE, 1, 0, 0};
  GPtrArray *settings = g_ptr_array_new(); g_ptr_array_add(settings, &a);
  for (guint i = 0; i < 3; i++) {
    if (i == 1) { a.name = "DP-1"; a.mode = "bad mode"; }
    if (i == 2) { a.mode = "1920x1080@60.000Hz"; a.enabled = FALSE; }
    GError *error = NULL;
    g_assert_false(save_display_config(kanshi, settings, &error));
    g_assert_error(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA); g_clear_error(&error);
    char *ks = read_file(kanshi);
    g_assert_cmpstr(ks, ==, "# unchanged\n");
    g_free(ks);
  }
  /* A disabled monitor with a bogus nonempty mode must not poison the file. */
  a.mode = "invalid mode";
  MonitorSetting b = {"HDMI-A-1", "1920x1080@60.000Hz", "normal", TRUE, 1, 0, 0};
  g_ptr_array_add(settings, &b);
  GError *error = NULL;
  g_assert_false(save_display_config(kanshi, settings, &error));
  g_assert_error(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA); g_clear_error(&error);
  char *after = read_file(kanshi); g_assert_cmpstr(after, ==, "# unchanged\n"); g_free(after);
  g_ptr_array_unref(settings);
}
static void test_retry_after_write_failure(void) {
  if (getuid() == 0) { g_test_skip("Read-only fixture requires an unprivileged user"); return; }
  reset();
  char *locked = g_build_filename(directory, "locked", NULL);
  char *path = g_build_filename(locked, "config", NULL);
  g_mkdir(locked, 0700);
  const char *original = "# original config\n";
  put(path, original); g_chmod(path, 0400); g_chmod(locked, 0500);
  MonitorSetting a = {"DP-1", "1920x1080@60.000Hz", "normal", TRUE, 1, 0, 0};
  GPtrArray *settings = g_ptr_array_new(); g_ptr_array_add(settings, &a);
  GError *error = NULL;
  g_assert_false(save_display_config(path, settings, &error));
  g_assert_nonnull(error); g_clear_error(&error);
  char *text = read_file(path); g_assert_cmpstr(text, ==, original); g_free(text);
  g_chmod(locked, 0700); g_chmod(path, 0600);
  g_assert_true(save_display_config(path, settings, &error)); g_assert_no_error(error);
  text = read_file(path); g_assert_cmpuint(count(text, "profile liakos-"), ==, 1); g_free(text);
  g_ptr_array_unref(settings);
  char *backup = g_strconcat(path, ".liakos-backup", NULL);
  g_unlink(backup); g_unlink(path); g_rmdir(locked);
  g_free(backup); g_free(path); g_free(locked);
}
static void test_runtime(void) {
  if (!g_test_subprocess()) {
    g_test_trap_subprocess(NULL, 5000000, G_TEST_SUBPROCESS_DEFAULT);
    g_test_trap_assert_passed();
    return;
  }
  char *ctl = g_build_filename(directory, "kanshictl", NULL);
  char *daemon = g_build_filename(directory, "kanshi", NULL);
  char *ready = g_build_filename(directory, "ready", NULL);
  char *log = g_build_filename(directory, "calls", NULL);
  char *fail = g_build_filename(directory, "fail", NULL);
  put(ctl, "#!/bin/sh\nprintf '%s\\n' \"$1\" >> \"$TEST_ROOT/calls\"\ncase $1 in\nstatus) test -f \"$TEST_ROOT/ready\";;\nreload) test ! -f \"$TEST_ROOT/fail\";;\nesac\n");
  put(daemon, "#!/bin/sh\nprintf 'start\\n' >> \"$TEST_ROOT/calls\"\nprintf ready > \"$TEST_ROOT/ready\"\n");
  g_chmod(ctl, 0700); g_chmod(daemon, 0700);
  g_setenv("PATH", directory, TRUE); g_setenv("TEST_ROOT", directory, TRUE);
  GError *error = NULL;
  g_assert_true(activate_kanshi(FALSE, &error)); g_assert_no_error(error);
  g_assert_true(activate_kanshi(FALSE, &error)); g_assert_no_error(error);
  g_assert_true(activate_kanshi(TRUE, &error)); g_assert_no_error(error);
  put(fail, "fail");
  g_assert_false(activate_kanshi(TRUE, &error)); g_clear_error(&error);
  char *text = read_file(log);
  g_assert_cmpuint(count(text, "start\n"), ==, 1);
  g_assert_cmpuint(count(text, "reload\n"), ==, 2);
  g_free(text);
  const char *files[] = {ctl, daemon, ready, log, fail};
  for (guint i = 0; i < G_N_ELEMENTS(files); i++) g_unlink(files[i]);
  g_free(ctl); g_free(daemon); g_free(ready); g_free(log); g_free(fail);
}
int main(int argc, char **argv) {
  g_test_init(&argc, &argv, NULL);
  directory = g_dir_make_tmp("ishell-displays-XXXXXX", NULL); g_assert_nonnull(directory);
  kanshi = g_build_filename(directory, "config", NULL);
  g_test_add_func("/config/save", test_save);
  g_test_add_func("/config/topologies", test_topologies);
  g_test_add_func("/config/markers", test_markers);
  g_test_add_func("/config/transforms", test_transforms);
  g_test_add_func("/config/symlink", test_symlink);
  g_test_add_func("/config/invalid-save", test_invalid_save);
  g_test_add_func("/config/retry-write-failure", test_retry_after_write_failure);
  g_test_add_func("/runtime/kanshi", test_runtime);
  int result = g_test_run();
  reset(); g_rmdir(directory);
  g_free(kanshi); g_free(directory);
  return result;
}
