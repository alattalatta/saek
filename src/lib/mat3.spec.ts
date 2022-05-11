import test from 'ava'

import { dotmv3, mat3 } from './mat3'
import { vec3 } from './vec3'

test('can perform mat3 x vec3', (t) => {
  t.deepEqual(dotmv3(mat3(0, 1, 2, 3, 4, 5, 6, 7, 8), vec3(3, 2, 1)), vec3(4, 22, 40))
})
