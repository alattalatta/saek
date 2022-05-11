import { dotmv3, mat3 } from '../mat3'
import type { Vec3 } from '../vec3'

// prettier-ignore
const m = mat3(
   3.2409699419045226,  -1.537383177570094,  -0.4986107602930034,
  -0.9692436362808796,   1.8759675015077202,  0.04155505740717559,
   0.05563007969699366, -0.20397695888897652, 1.0569715142428786)

function xyz2rgb(xyz: Vec3): Vec3 {
  return dotmv3(m, xyz)
}

export { xyz2rgb }
