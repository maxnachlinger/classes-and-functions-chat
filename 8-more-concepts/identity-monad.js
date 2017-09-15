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

const badMap = identity.of(42)
  .map((x) => x + 1)
  .map((x) => identity.of(`Test ${x}`))

console.log(badMap.inspect())

const chainToTheRescue = identity.of(42)
  .map((x) => x + 1)
  .chain((x) => identity.of(`Test ${x}`))

console.log(chainToTheRescue.inspect())
