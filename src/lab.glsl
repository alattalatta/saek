#version 300 es
 
precision highp float;

#define LAB_XYZ_E 0.008856
#define LAB_XYZ_K 903.3

uniform bool u_force_gamut;
uniform float u_hue;
uniform vec2 u_resolution;

out vec4 outColor;

vec3 d65 = vec3(0.95047, 1, 1.08883);

vec3 lch2lab(vec3 lch) {
  return vec3(
    lch.x,
    lch.y * cos(radians(lch.z)),
    lch.y * sin(radians(lch.z))
  );
}

vec3 lab2lch(vec3 lab) {
  float hue = degrees(atan(lab.z, lab.y));

  return vec3(
    lab.x,
    length(lab.yz),
    hue
  );
}

float transform(float a) {
  float b = pow(a, 3.0);
  return b > LAB_XYZ_E ? b : (116.0 * a - 16.0) / LAB_XYZ_K;
}

// D65 Lab
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

  return xyz * d65;
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

vec3 lab2srgb(vec3 lab) {
  return xyz2srgb(lab2xyz(lab));
}

vec3 lch2srgb(vec3 lch) {
  return lab2srgb(lch2lab(lch));
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
    134.0,
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
