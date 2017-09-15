'use strict'

const util = require('util')

const add = (a, b) => a + b

const identity = ({
  of: (x) => ({
    map: (f) => identity.of(f(x)),
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})

const simpleMap = identity.of(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)

console.log(simpleMap.inspect())

const badMap = identity.of(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)
  .map((x) => identity.of(`Test ${x}`)) // Identity(Identity('Test 5'))

console.log(badMap.inspect())

const badArrayMap = [1]
  .map((i) => add(i, 1)) // [2]
  .map((i) => Math.pow(i, 2)) // [4]
  .map((i) => add(i, 1)) // [5]
  .map((x) => [`Test ${x}`]) // [['Test 5']]

console.log(badArrayMap)