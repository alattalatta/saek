import test from 'ava'

import { inRange } from './number'

test('can determine whether a given number is within a range, inclusive', (t) => {
  t.true(inRange(0, 10, 5))
  t.false(inRange(0, 10, 11))
})
