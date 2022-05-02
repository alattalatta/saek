vec3 unpolarize(vec3 pos) {
  return vec3(
    pos.x,
    pos.y * cos(radians(pos.z)),
    pos.y * sin(radians(pos.z))
  );
}

#pragma glslify: export(unpolarize)
