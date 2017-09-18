'use strict'

const util = require('util')

const identityMonad = ({
  // of() is also known as unit, pure, point, and return
  of: (x) => ({
    chain: (f) => f(x), // chain() is also known as flatMap or bind
    map: (f) => identityMonad.of(f(x)),
    inspect: () => `IdentityMonad(${util.inspect(x, {depth: null})})`
  })
})

const simpleMap = identityMonad.of(42)
  .map((x) => x + 1)

console.log(simpleMap)

const chainToTheRescue = identityMonad.of(1)
  .chain((x) => identityMonad.of(`Test ${x}`)) // Identity('Test 1')

console.log(chainToTheRescue.inspect())
