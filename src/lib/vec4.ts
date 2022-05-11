import type { Vec3 } from './vec3'

type Vec4 = [number, number, number, number]

function vec4(xyzw: Vec4): Vec4
function vec4(xyz: Vec3, w: number): Vec4
function vec4(x: number, y: number, z: number, w: number): Vec4
function vec4(xyz34OrX: Vec3 | Vec4 | number, wOrY?: number, z?: number, w?: number): Vec4 {
  if (typeof xyz34OrX === 'number') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [xyz34OrX, wOrY!, z!, w!]
  }

  return wOrY ? [...(xyz34OrX as Vec3), wOrY] : [...(xyz34OrX as Vec4)]
}

export type { Vec4 }
export { vec4 }
