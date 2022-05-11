import test from 'ava'

import { vec3 } from './vec3'
import { vec4 } from './vec4'

test('can make vec4 from 4 numbers', (t) => {
  t.deepEqual(vec4(1, 2, 3, 4), [1, 2, 3, 4])
})

test('can make vec4 from a vec3 and a number', (t) => {
  t.deepEqual(vec4(vec3(1, 2, 3), 4), [1, 2, 3, 4])
})

test('can make vec4 from another vec4', (t) => {
  t.deepEqual(vec4(1, 2, 3, 4), [1, 2, 3, 4])
})
