import test from 'ava'

import { div, inRange, mult, vec3 } from './vec3'

test('can make vec3 from 3 numbers', (t) => {
  t.deepEqual(vec3(1, 2, 3), [1, 2, 3])
})

test('can make vec3 from another vec3', (t) => {
  t.deepEqual(vec3(1, 2, 3), [1, 2, 3])
})

test('can divide vec3 with a scalar value', (t) => {
  t.deepEqual(div(vec3(1, 2, 3), 2), [0.5, 1, 1.5])
})

test('can determine whether a given vec3 is within a two vec3 component-wise, inclusive', (t) => {
  const n = vec3(0, 1, 2)
  const m = vec3(3, 4, 5)
  t.true(inRange(n, m, vec3(2, 3, 4)))
  t.false(inRange(n, m, vec3(-1, 3, 4)))
  t.false(inRange(n, m, vec3(2, 0, 4)))
  t.false(inRange(n, m, vec3(2, 3, 1)))
})

test('can multiply vec3 with a scalar value', (t) => {
  t.deepEqual(mult(vec3(1, 2, 3), 2), [2, 4, 6])
})
