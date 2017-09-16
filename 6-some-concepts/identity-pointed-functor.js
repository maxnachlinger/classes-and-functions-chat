'use strict'

const util = require('util')

const identity = ({
  of: (x) => ({
    map: (f) => identity.of(f(x)),
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})

const badMap = identity.of(1)
  .map((x) => identity.of(`Test ${x}`)) // Identity(Identity('Test 1')) <-- Oh no!

console.log(badMap.inspect())
