#pragma glslify: rgb2srgb = require('./rgb2srgb')
#pragma glslify: xyz2rgb = require('./xyz2rgb')

vec3 xyz2srgb(vec3 xyz) {
  return rgb2srgb(xyz2rgb(xyz));
}

#pragma glslify: export(xyz2srgb)
