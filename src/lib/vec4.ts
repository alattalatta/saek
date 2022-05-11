import type { Vec3 } from './vec3'

type Vec4 = readonly [number, number, number, number]

function vec4(xyz: Vec3, w: number): Vec4
function vec4(x: number, y: number, z: number, w: number): Vec4
function vec4(xyzOrX: Vec3 | number, wOrY: number, z?: number, w?: number): Vec4 {
  if (typeof xyzOrX === 'number') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [xyzOrX, wOrY, z!, w!]
  }

  return [...xyzOrX, wOrY]
}

export type { Vec4 }
export { vec4 }
