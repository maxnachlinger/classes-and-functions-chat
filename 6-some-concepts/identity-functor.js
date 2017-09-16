'use strict'

const util = require('util')

const add = (a, b) => a + b

const identity = (x) => ({
  map: (f) => identity(f(x)),
  inspect: () => `Identity(${util.inspect(x, {depth: null})})`
})

const simpleMap = identity(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)

console.log(simpleMap.inspect())
