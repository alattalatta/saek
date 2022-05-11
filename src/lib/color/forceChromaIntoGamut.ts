import type { Vec3 } from '../vec3'
import { vec3 } from '../vec3'

function forceChromaIntoGamut(lch_: Vec3, comparator: (lch: Vec3) => boolean): Vec3 {
  if (comparator(lch_)) {
    return lch_
  }

  const lch = vec3(lch_)

  let hiC = lch_[1]
  let loC = 0
  lch[1] /= 2

  while (hiC - loC > 0.0001) {
    if (comparator(lch)) {
      loC = lch[1]
    } else {
      hiC = lch[1]
    }
    lch[1] = (hiC + loC) / 2
  }

  return lch
}

export { forceChromaIntoGamut }
