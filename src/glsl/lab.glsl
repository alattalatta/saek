#version 300 es
 
precision highp float;

uniform bool u_force_gamut;
uniform float u_chroma_max; // 134
uniform float u_hue;
uniform vec2 u_resolution;

out vec4 outColor;

#pragma glslify: unpolarize = require('./unpolarize')
#pragma glslify: xyz2srgb = require('./color/xyz2srgb')

#define LAB_XYZ_E 0.008856
#define LAB_XYZ_K 903.3

float transform(float a) {
  float b = pow(a, 3.0);
  return b > LAB_XYZ_E ? b : (116.0 * a - 16.0) / LAB_XYZ_K;
}

vec3 lab2xyz(vec3 lab_) {
  vec3 lab = lab_ / 100.0;

  float y = (lab[0] + 0.16) / 1.16;

  float x = lab[1] / 5.0 + y;
  float z = y - lab[2] / 2.0;

  vec3 xyz = vec3(
    transform(x),
    transform(y),
    transform(z)
  );

  return xyz * vec3(0.95047, 1, 1.08883); // D65
}

vec3 lch2srgb(vec3 lch) {
  return xyz2srgb(lab2xyz(unpolarize(lch)));
}

bool is_lch_within_srgb(vec3 lch) {
  vec3 rgb = lch2srgb(lch);
  float e = 0.0;

  return rgb.x >= (0.0 - e) && rgb.x <= (1.0 + e) &&
         rgb.y >= (0.0 - e) && rgb.y <= (1.0 + e) &&
         rgb.z >= (0.0 - e) && rgb.z <= (1.0 + e);
}

vec3 lch_into_srgb_gamut(vec3 lch_) {
  if (is_lch_within_srgb(lch_)) {
    return lch_;
  }

  vec3 lch = vec3(lch_);

  float hiC = lch[1];
  float loC = 0.0;
  float e = 0.0001;
  lch[1] /= 2.0;

  while (hiC - loC > e) {
    if (is_lch_within_srgb(lch)) {
      loC = lch[1];
    }
    else {
      hiC = lch[1];
    }
    lch[1] = (hiC + loC) / 2.0;
  }

  return lch;
}

void main() {
  vec2 rt = gl_FragCoord.xy / u_resolution;

  vec3 a = vec3(
    rt.y * 100.0,
    0.0,
    u_hue
  );
  vec3 b = vec3(
    rt.y * 100.0,
    u_chroma_max,
    u_hue
  );
  vec3 ab = mix(
    a,
    b,
    rt.x
  );

  outColor = vec4(
    lch2srgb(
      u_force_gamut ? lch_into_srgb_gamut(ab) : ab
    ),
    1.0
  );
}
