'use strict'

const util = require('util')

const identity = ({
  // of() is also known as unit, pure, point, and return
  of: (x) => ({
    chain: (f) => f(x), // chain() is also known as flatMap or bind
    map: (f) => identity.of(f(x)),
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})

const simpleMap = identity.of(42)
  .map((x) => x + 1)

console.log(simpleMap)

const chainToTheRescue = identity.of(1)
  .chain((x) => identity.of(`Test ${x}`)) // Identity('Test 1')

console.log(chainToTheRescue.inspect())
