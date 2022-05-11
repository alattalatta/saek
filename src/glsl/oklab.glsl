#version 300 es
 
precision highp float;

uniform bool u_force_gamut;
uniform float u_chroma_max; // 33
uniform float u_hue;
uniform vec2 u_resolution;

out vec4 outColor;

#pragma glslify: unpolarize = require('./unpolarize')
#pragma glslify: xyz2srgb = require('./color/xyz2srgb')

vec3 oklab2xyz(vec3 oklab_) {
  mat3 lmsxyz = mat3(
     1.2268798733741557,  -0.5578149965554813,  0.28139105017721583,
    -0.04057576262431372,  1.1122868293970594, -0.07171106666151701,
    -0.07637294974672142, -0.4214933239627914,  1.5869240244272418
  );
  mat3 oklablms = mat3(
    0.99999999845051981432, 0.39633779217376785678,   0.21580375806075880339,
    1.0000000088817607767, -0.1055613423236563494,   -0.063854174771705903402,
    1.0000000546724109177, -0.089484182094965759684, -1.2914855378640917399
  );

  vec3 lmsnl = (oklab_ / 100.0) * oklablms;
  return vec3(
    pow(lmsnl[0], 3.0),
    pow(lmsnl[1], 3.0),
    pow(lmsnl[2], 3.0)
  ) * lmsxyz;
}

vec3 oklch2srgb(vec3 oklch) {
  return xyz2srgb(oklab2xyz(unpolarize(oklch)));
}

bool is_oklch_within_srgb(vec3 lch) {
  vec3 rgb = oklch2srgb(lch);
  float e = 0.0;

  return rgb.x >= (0.0 - e) && rgb.x <= (1.0 + e) &&
         rgb.y >= (0.0 - e) && rgb.y <= (1.0 + e) &&
         rgb.z >= (0.0 - e) && rgb.z <= (1.0 + e);
}

vec3 oklch_into_srgb_gamut(vec3 lch_) {
  if (is_oklch_within_srgb(lch_)) {
    return lch_;
  }

  vec3 lch = vec3(lch_);

  float hiC = lch[1];
  float loC = 0.0;
  float e = 0.0001;
  lch[1] /= 2.0;

  while (hiC - loC > e) {
    if (is_oklch_within_srgb(lch)) {
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
    oklch2srgb(
      u_force_gamut ? oklch_into_srgb_gamut(ab) : ab
    ),
    1.0
  );
}
