import test from 'ava'

import { clamp, inRange } from './number'

test('can clamp a number into a range', (t) => {
  t.assert(clamp(-1, 1, 3) === 1)
  t.assert(clamp(-1, 1, 1) === 1)

  t.assert(clamp(-1, 1, -3) === -1)
  t.assert(clamp(-1, 1, -1) === -1)

  t.assert(clamp(-1, 1, 0.5) === 0.5)
})

test('can determine whether a given number is within a range, inclusive', (t) => {
  t.true(inRange(0, 10, 5))
  t.false(inRange(0, 10, 11))
})
