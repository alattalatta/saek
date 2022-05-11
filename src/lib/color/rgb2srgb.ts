import type { Vec3 } from '../vec3'
import { vec3 } from '../vec3'

function transform(x: number): number {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1.0 / 2.4) - 0.055
}

function rgb2srgb(rgb: Vec3): Vec3 {
  return vec3(transform(rgb[0]), transform(rgb[1]), transform(rgb[2]))
}

export { rgb2srgb }
