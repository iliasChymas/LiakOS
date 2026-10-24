#define _POSIX_C_SOURCE 200809L

#include <stdio.h>
#include <string.h>
#include <time.h>
#include <vips/vips.h>

static double elapsed_ms(struct timespec start, struct timespec end) {
  return (end.tv_sec - start.tv_sec) * 1000.0 +
         (end.tv_nsec - start.tv_nsec) / 1000000.0;
}

int main(int argc, char **argv) {
  if (argc != 3) {
    fprintf(stderr, "Usage: %s INPUT_IMAGE OUTPUT_IMAGE\n", argv[0]);
    return 2;
  }

  if (VIPS_INIT(argv[0])) {
    vips_error_exit("Could not initialize libvips");
  }

  const int width = 256;
  const int height = 144;
  VipsImage *thumbnail = NULL;
  struct timespec started, pipeline_done, finished;
  clock_gettime(CLOCK_MONOTONIC, &started);

  if (vips_thumbnail(argv[1], &thumbnail, width, "height", height, "size",
                     VIPS_SIZE_BOTH, "crop", VIPS_INTERESTING_CENTRE, NULL)) {
    vips_error_exit("Could not resize image");
  }
  clock_gettime(CLOCK_MONOTONIC, &pipeline_done);

  const char *extension = strrchr(argv[2], '.');
  int is_jpeg = extension && (g_ascii_strcasecmp(extension, ".jpg") == 0 ||
                              g_ascii_strcasecmp(extension, ".jpeg") == 0);
  int write_failed =
      is_jpeg ? vips_image_write_to_file(thumbnail, argv[2], "Q", 95, NULL)
              : vips_image_write_to_file(thumbnail, argv[2], NULL);
  if (write_failed) {
    vips_error_exit("Could not write output image");
  }
  clock_gettime(CLOCK_MONOTONIC, &finished);

  printf("input=%s dimensions=%dx%d\n", argv[1],
         vips_image_get_width(thumbnail), vips_image_get_height(thumbnail));
  printf("output=%s target=%dx%d\n", argv[2], width, height);
  printf("thumbnail_call_ms=%.3f\n", elapsed_ms(started, pipeline_done));
  printf("write_ms=%.3f (may include deferred image work)\n",
         elapsed_ms(pipeline_done, finished));
  printf("total_ms=%.3f\n", elapsed_ms(started, finished));

  g_object_unref(thumbnail);
  vips_shutdown();
  return 0;
}
