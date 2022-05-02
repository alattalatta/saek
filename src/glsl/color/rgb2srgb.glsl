float transform(float x) {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

vec3 rgb2srgb(vec3 rgb) {
  return vec3(
    transform(rgb.r),
    transform(rgb.g),
    transform(rgb.b)
  );
}

#pragma glslify: export(rgb2srgb)
