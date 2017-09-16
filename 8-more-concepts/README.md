## Values and contexts
Here's an int: `42`
and here's that int in an array: `[42]`

`[42]` is still an int value, but now it's in a context - an array. So we might say, `42` is an int value in 
the content of an array `[]`.

## map()
Here's an awesome `add()` function which can handle an input of 2 numbers:
```javascript
const add = (a, b) => a + b
```
Look at it go!
```javascript
add(42, 1) // 43
```
but `add()` has no idea what to do with an int in an array :(
```javascript
add([42], 1) // '421' - egad! That's from the node repl BTW :)
```
To use `add()` on an int in an array we have to use `.map()`:
```javascript
[42].map((i) => add(i, 1)) // [43]
```

Great, so what's `map()` doing here? 

It's taking the value `42` out of the array (the context), running `add(42, 1)` 
against that value, and placing the result of `add(42, 1)` into a new array (a new context). 

`map()` also allows us to compose functions, check it out:
```javascript
[1]
  .map((i) => add(i, 1)) // [2]
  .map((i) => Math.pow(i, 2)) // [4]
  .map((i) => add(i, 1)) // [5]
```
We just got our result via composing `add()` and `Math.pow`. Another benefit here is that the functions in each map 
are pure - a function is pure if:

- given the same input, it will always return the same output
- produces no side effects - a side effect is any application state change that is observable outside the called 
function other than its return value.
- gets all its state from its arguments.

Why should I care about all this Pure Function nonsense anyway?

- You can memoize / cache them
- They are super easy to test
- They (can be) simple to reason about and maintain.
- You can run N of them at once without issue.

## Functor - a fancy name for a plain concept
You've just seen a `functor`. A `functor` is a fancy term for a mappable thing, or a thing with a `map()` method. 
When values are wrapped in contexts, we cannot run functions on those values, this is what `map()` helps us to do - 
run functions on values in contexts.

## Identity - A really simple functor
```javascript
'use strict'

const util = require('util')

const identity = (x) => ({
  map: (f) => identity(f(x)),
  // for debugging
  inspect: () => `Identity(${util.inspect(x, {depth: null})})`
})
```
`inspect()` just prints the value out fo us for debugging. Let's focus on `map()`. `map()` takes a function `f` and 
passes `f` the Identity functor's value as an argument `f(x)`. `map()` then places the result of `f(x)` into a new 
Identity functor via `identity(f(x)`.

Here's how to use it:
```javascript
const simpleMap = identity(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)

console.log(simpleMap.inspect())
```

## Pointed functors
A pointed functor is a functor with an `of()` method. Pretty simple, check it out:
```javascript
'use strict'

const util = require('util')

const identity = ({
  of: (x) => ({
    map: (f) => identity.of(f(x)),
    // for debugging
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})

const simpleMap = identity.of(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)

console.log(simpleMap.inspect())
```

`of()` probably looks a lot like a constructor, but it isn't. `of()` is a common interface which allows us to create 
a value and place it in a default minimal context. This is quite different from a constructor, constructors are by 
definition tied to specific classes, `of()` is common. You'll also hear `of()` referred to as `unit`, `pure`, and 
`point`.

# when map() doesn't work

Consider the previous Pointed Functor (you know, a unit of computation with a `map()` and an `of()` method).

```javascript
'use strict'

const util = require('util')

const identity = ({
  of: (x) => ({
    map: (f) => identity.of(f(x)),
    // for debugging
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})
```
Now say we wanted to use another pointed functor in our program. We're going to try using it via map, since we're keen 
on composition. Here's a first pass:
```javascript
const simpleMap = identity.of(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)
  .map((x) => identity.of(`Test ${x}`)) // Identity(Identity('Test 5'))
```
Egad! See that `Identity(Identity('Test 5'))` line? `map()` isn't broken. 

Remember that `map()` takes a value out of it's context (the Identity functor), runs a function using that value, and 
places the result of that function into a new context - in this case a new the Identity functor.

If this is still confusing, consider the same example with an array:
```javascript
const simpleMap = [1]
  .map((i) => add(i, 1)) // [2]
  .map((i) => Math.pow(i, 2)) // [4]
  .map((i) => add(i, 1)) // [5]
  .map((x) => [`Test ${x}`]) // [['Test 5']] <-- same nesting issue
```

# chain, a "flat" map
Let's fix this by adding a simple method called `chain()` to our functor.

```javascript
const identity = ({
  // of() is also known as unit, pure, and point
  of: (x) => ({
    chain: (f) => f(x), // chain() is also known as flatMap or bind
    map: (f) => identity.of(f(x)),
    // for debugging
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})
```
TODO - talk about chain
chain is also known as flatMap or bind


## monads!
TODO
Monads are pointed functors that can flatten. 

A monad is also a value in a context, and that context provides a few special methods - and you've already seen them!

Why? A monad is a unit of computation which can be chained with other monads to manage side effects and break larger 
operations down into simple steps.

To be considered a monad the structure has to provide three components:
of()
chain()
map())


TODO:
monadic laws:

// associativity
compose(join, map(join)) == compose(join, join);
// identity for all (M a)
compose(join, of) === compose(join, map(of)) === id

TODO 
practical monads - probably will use data.task :)
