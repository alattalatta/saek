#version 300 es
 
precision highp float;

uniform float u_hue;
uniform vec2 u_resolution;

out vec4 outColor;

vec3 unpolarize(vec3 lch) {
  return vec3(
    lch.x,
    lch.y * cos(radians(lch.z)),
    lch.y * sin(radians(lch.z))
  );
}

vec3 polarize(vec3 lab) {
  float hue = degrees(atan(lab.z, lab.y));

  return vec3(
    lab.x,
    length(lab.yz),
    hue
  );
}

vec3 xyz2rgb(vec3 xyz) {
  mat3 m = mat3(
     3.2409699419045226,  -1.537383177570094,  -0.4986107602930034,
    -0.9692436362808796,   1.8759675015077202,  0.04155505740717559,
     0.05563007969699366, -0.20397695888897652, 1.0569715142428786
  );

  return xyz * m;
}

float lin2srgb(float x) {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

vec3 rgb2srgb(vec3 rgb) {
  return vec3(
    lin2srgb(rgb.r),
    lin2srgb(rgb.g),
    lin2srgb(rgb.b)
  );
}

vec3 xyz2srgb(vec3 xyz) {
  return rgb2srgb(xyz2rgb(xyz));
}

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
    33,
    u_hue
  );
  vec3 ab = mix(
    a,
    b,
    rt.x
  );

  outColor = vec4(
    oklch2srgb(
      ab
    ),
    1.0
  );

  // if (!is_oklch_within_srgb(ab)) {
  //   if (mod(rt.y + rt.x, 0.1) > 0.05) {
  //     outColor = mix(outColor, vec4(1.0, 1.0, 1.0, 0.0), 0.1);
  //   } else {
  //     outColor = mix(outColor, vec4(1.0, 1.0, 1.0, 0.0), 0.2);
  //   }
  // }
}
