/* Compile with the unmodified upstream Kanshi v1.9 config.c for an offline
 * syntax/semantics integration check. No compositor or daemon is involved. */
#include <assert.h>
#include <stdio.h>
#include <string.h>
#include "config.h"
#include "display-config.h"

int main(int argc, char **argv) {
  assert(argc == 2);
  const char *transforms[] = {"normal", "90", "180", "270", "flipped", "flipped-90", "flipped-180", "flipped-270"};
  MonitorSetting settings[9] = {0};
  char names[8][16];
  GPtrArray *layout = g_ptr_array_new();
  for (int i = 0; i < 8; i++) {
    snprintf(names[i], sizeof(names[i]), "DP-%d", i);
    settings[i] = (MonitorSetting){names[i], "2560x1440@143.998Hz", (char *)transforms[i], TRUE, 1.25, -2048, 40};
    g_ptr_array_add(layout, &settings[i]);
  }
  settings[8] = (MonitorSetting){"DP-disabled", "", "normal", FALSE, 1, 0, 0};
  g_ptr_array_add(layout, &settings[8]);
  GError *error = NULL;
  assert(save_display_config(argv[1], layout, &error));
  assert(!error);
  g_ptr_array_unref(layout);
  struct kanshi_config *config = parse_config(argv[1]);
  assert(config);
  assert(wl_list_length(&config->profiles) == 1);
  struct kanshi_profile *profile = wl_container_of(config->profiles.next, profile, link);
  assert(wl_list_length(&profile->outputs) == 9);
  unsigned int seen = 0;
  struct kanshi_profile_output *output;
  wl_list_for_each(output, &profile->outputs, link) {
    if (strcmp(output->name, "DP-disabled") == 0) {
      assert(!output->enabled);
      continue;
    }
    int index = -1;
    assert(sscanf(output->name, "DP-%d", &index) == 1);
    assert(index >= 0 && index < 8);
    assert(output->enabled);
    assert(output->mode.width == 2560 && output->mode.height == 1440);
    assert(output->mode.refresh == 143998);
    assert(output->position.x == -2048 && output->position.y == 40);
    assert(output->scale == 1.25f);
    assert((int)output->transform == index);
    seen |= 1u << index;
  }
  assert(seen == 255);
  destroy_config(config);
  puts("Upstream Kanshi parser accepted all rotations, fractional refresh/scale, position and disabled state.");
  return 0;
}
