import type { Vec3 } from '../vec3'
import { vec3 } from '../vec3'

function unpolarize(xyz: Vec3): Vec3 {
  return vec3(xyz[0], xyz[1] * Math.cos((Math.PI * xyz[2]) / 180), xyz[1] * Math.sin((Math.PI * xyz[2]) / 180))
}

export { unpolarize }
