import type { Vec3 } from '../vec3'
import { div, mult, vec3 } from '../vec3'

// vec3 lab2xyz(vec3 lab_) {
//   vec3 lab = lab_ / 100.0;

//   float y = (lab[0] + 0.16) / 1.16;

//   float x = lab[1] / 5.0 + y;
//   float z = y - lab[2] / 2.0;

//   vec3 xyz = vec3(
//     transform(x),
//     transform(y),
//     transform(z)
//   );

//   return xyz * vec3(0.95047, 1, 1.08883); // D65
// }

function transform(x: number): number {
  const b = Math.pow(x, 3)
  return b > 0.008856 ? b : (116 * x - 16) / 903.3
}

function lab2xyz(lab_: Vec3): Vec3 {
  const lab = div(lab_, 100)

  const y = (lab[0] + 0.16) / 1.16

  const x = lab[1] / 5 + y
  const z = y - lab[2] / 2

  const xyz = vec3(transform(x), transform(y), transform(z))

  return mult(xyz, vec3(0.95047, 1, 1.08883)) // D65
}

export { lab2xyz }
