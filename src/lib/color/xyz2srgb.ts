import type { Vec3 } from '../vec3'
import { rgb2srgb } from './rgb2srgb'
import { xyz2rgb } from './xyz2rgb'

function xyz2srgb(xyz: Vec3): Vec3 {
  return rgb2srgb(xyz2rgb(xyz))
}

export { xyz2srgb }
