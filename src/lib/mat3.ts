import type { Vec3 } from './vec3'

type Mat3 = [number, number, number, number, number, number, number, number, number]

function mat3(...values: Mat3): Mat3 {
  return values
}

function dotmv3(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ]
}

export type { Mat3 }
export { mat3, dotmv3 }
