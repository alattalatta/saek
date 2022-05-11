type Vec3 = readonly [number, number, number]

function vec3(x: number, y: number, z: number): Vec3 {
  return [x, y, z]
}

export type { Vec3 }
export { vec3 }
