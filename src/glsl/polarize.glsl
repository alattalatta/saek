vec3 polarize(vec3 pos) {
  float hue = degrees(atan(pos.z, pos.y));

  return vec3(
    pos.x,
    length(pos.yz),
    hue
  );
}

#pragma glslify: export(polarize)
