import { inRange as inRangeN } from './number'

type Vec3 = [number, number, number]

function vec3(xyz: Vec3): Vec3
function vec3(x: number, y: number, z: number): Vec3
function vec3(xyzOrX: Vec3 | number, y?: number, z?: number): Vec3 {
  if (typeof xyzOrX === 'number') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [xyzOrX, y!, z!]
  }
  return [...xyzOrX]
}

function div(a: Vec3, b: number): Vec3 {
  return vec3(a[0] / b, a[1] / b, a[2] / b)
}

function inRange(min: Vec3, max: Vec3, a: Vec3): boolean {
  return inRangeN(min[0], max[0], a[0]) && inRangeN(min[1], max[1], a[1]) && inRangeN(min[2], max[2], a[2])
}

function mult(a: Vec3, b: Vec3): Vec3
function mult(a: Vec3, b: number): Vec3
function mult(a: Vec3, b: Vec3 | number): Vec3 {
  if (typeof b === 'number') {
    return vec3(a[0] * b, a[1] * b, a[2] * b)
  }
  return vec3(a[0] * b[0], a[1] * b[1], a[2] * b[2])
}

export type { Vec3 }
export { div, inRange, mult, vec3 }
