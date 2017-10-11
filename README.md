## classes-and-functions-chat

## Installation
```shell
git clone git@github.com:maxnachlinger/classes-and-functions-chat.git
cd classes-and-functions-chat
npm i
```

## Run the examples
```shell
# you can run the index.js file in each directory
node ./0-class/index.js
```

## Notes
### for these to make sense, you'll need to look at the code for each section.
---
## Requirement: get a set of results from a REST API on the network
---
## 0 - Class
[Relevant code](./0-class)

A `ThingRequest` class.

### Question:
Where does `ThingRequest::request()` get its state from?

The answer is _lots of places_. The class instance, the function's arguments, the things we required above etc.

How a function gets its state can be complicated. **Minimizing that complexity makes the function easier to think 
about, work on, and test.**

In `ThingRequest` we have class instance variables that influence `request()`'s behavior several lines away from 
that function. We can improve this.

### Consider this example of code calling a function vs a class + method:
```javascript
// Function f
f(a, b, c)

// vs Class C with method f
const c = new C(a)
c.f(b,c)
```
The class approach sure adds a lot of complexity to save having to pass `a` to `f()`.

---
## 1 - Function
[Relevant code](./1-fx)

This is a first pass at simplifying `request()`. Now more of the function's state comes from it's arguments.

One benefit of this approach is that `request()` is open about its dependencies, which makes it easier to reason
about.

Some folks claim a benefit of classes is that you don't have to pass the state given to the constructor along to each
instance method. The calling code in `index.js` shows that partial application is a reasonable way around that.

In case you don't know what partial application is:

### Partial Application:

A fancy phrase for taking a function with, say, 3 params, like this:
```javascript
const getStuff = (url, accessKey, type) => {
  // etc
}
```
and making a new function that provides values for some of those params up-front. Like this:
```javascript
const getStuffLocal = (type) => getStuff('http://www.example.com', 'secret-access-key', type)

// you can also use a helper like lodash

const _ = require('lodash')
const getStuffLocal2 = _.partial(getStuff, 'http://www.example.com', 'secret-access-key')
```

### Question:
From the point of view of the calling code, which is more maintainable? A class you instantiate with an arg and
an instance method you call with another arg,

```javascript
const instance = new ThingRequest(serviceConfig)

// many lines of code later...

instance.request({type: 'squirrels', limit: 5})
  .then((results) => console.log(results))
  .catch((err) => console.error(err.stack || err))
```
or a method you call passing 2 args?
```javascript
request(serviceConfig, {type: 'squirrels', limit: 5})
  .then((results) => console.log(results))
  .catch((err) => console.error(err.stack || err))
```

---
## 2 - Extract and compose pure functions
[Relevant code](./2-fx-pure)

A few new pure functions are extracted, namely `prepareParams()`, `prepareRequestParams()`, and 
`transformResults()` .

Promises are used to compose those functions along with `requestP()`.

### Benefits of this approach:
- Each function gets just enough state to do it's job
- Each function has one responsibility
- + all the benefits of pure functions.

In case you've no idea what a Pure function is:

### Pure Function:

A fancy phrase which means a function that:
* given the same input will always return the same output
* produces no side effects - a side effect is any application state change that is observable outside the called 
function other than its return value.
* gets all its state from its arguments.

Why should I care about all this Pure Function nonsense anyway?

* You can memoize / cache them
* They are super easy to test
* They (can be) simple to reason about and maintain.
* You can run N of them at once without issue (less of a concern in JS)

It's worth noting that `requestP()` is _not_ pure. Its output varies based on state external to its input, namely 
the network :) We can make `requestP()` pure, and we'll explore what that looks like later on.

---
## Requirement-change: get a set of results from a REST API on the network and validate those results

---
## 3 - Class inheritance
[Relevant code](./3-class-inheritance)

This example adds result-validation by extending `ThingRequest` with a new child class `ValidatedThingRequest`.

Unfortunately we had to modify `ThingRequest` and export `serviceConfigSchema`, then use the exported 
`serviceConfigSchema` in `ValidatedThingRequest`'s validation.

### Wait a moment
Wasn't the whole point of inheritance the ability to reuse code without modifying it? Modifying a base class when
inheriting is sadly quite common, and if lots of classes inherit from that base class, you can cause lots of bugs.

There are other ways of structuring `ThingRequest` and `ValidatedThingRequest` to get around _some_ of these issues 
but that's not the point here.

The point is that **your requirements will change**, and when they do you'll not only have to change the functionality
itself, but you'll also have to contend with a whole set of classes meant to describe those requirements as a world
consisting of objects.

When using inheritance the issue gets even more complex as child classes gain access to and alter the internal state
of their parent classes. As systems structured in this way grow, these dependencies are rarely obvious and the
side-effects to altering state are even less obvious.

---
## 4 - Class composition through Dependency Injection
[Relevant code](./4-class-composition-di)

This attempts to add result-validation by creating a class which adds that validation by having an instance of `ThingRequest` injected into it.

### Dependency Injection

A fancy term for passing a class it's dependencies.

Consider this code:
```javascript
class ValidatedThingRequest {
  constructor (serviceConfig, responseSchema) {
    // snip
    this._thingRequest = new ThingRequest(serviceConfig);
  }
  
  // more methods here etc
```

Notice that:

1. `ValidatedThingRequest` is now responsible for creating and destroying that instance of `ThingRequest`.
2. It's also harder to test `ValidatedThingRequest` since we can easily supply a mocked `ThingRequest`.
3. There are loads of other benefits (like loose coupling and programming to interfaces) but those are less relevant 
for Javascript IMHO.

Consider this code:
```javascript
class ValidatedThingRequest {
  constructor (responseSchema, thingRequest) {
    // snip
    this._thingRequest = thingRequest
  }
  
  // more methods here etc
```
We're _injecting_ `ValidatedThingRequest`'s `ThingRequest` dependency. 

Now we can easily mock thingRequest when testing, and `ValidatedThingRequest` isn't responsible for managing 
`ThingRequest`. It can simply use the instance passed in.

The takeaway here is that if you're going to use classes to construct your programs, you should learn about OO Design
Patterns and techniques like dependency injection. There are bookshelves filled with great old tomes on this stuff.
One benefit of dependency injection is it makes a class' dependencies explicit, which makes the class easier to 
reason about.

---
## 5 - More pure function composition
[Relevant code](./5-fx-pure-composition)

`validate-result.js`  simply adds a validation check to the result. This function is curried because we have the 
result schema way before we have the result.

In case you have no idea what currying is:

### Currying

A fancy phrase for taking a function with, say, 3 params, like this:
```javascript
const getStuff = (url, accessKey, type) => {
  // etc
}
```
and turning it into a chained series of N functions each taking 1 argument. Like this:
```javascript
const getStuff = (type) => (timeout) => (url) => { /*body here*/ };

// you can also use a helper like lodash

const _ = require('lodash')
// (type) => {}
const getStuffLocal2 = _.curry(getStuff)('http://www.example.com')('secret-access-key')
```
Of course you can only curry functions with a fixed arity (``arity == number of arguments``) or you'll have to provide 
the function arity to the curry helper function up front (see lodash's `curry` function). 

One thing I find helpful when creating new functions is to think of the arguments you're going to have values for 
right away, and then add those arguments _first_ in the function. For example, we almost always have a `joi` 
validation schema before we have data to validate. Wouldn't this `joi.validate` signature be nice?
```javascript
joi.validate(schema, options, value, callback)
```
Then we could do cool stuff like:
```javascript
const validate = _.curry(joi.validate, {
  name: joi.string().required()
})({allowUnknown: true}); // --> (value) => (callback) => {}
```
---
## 6 - Some concepts
Here's an int: `42`

and here's that int in an array: `[42]`

`[42]` is still an int value, but now it's in a _context_ - an array. So we might say, `42` is an int value in 
the content of an array `[]`.

### map()
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

`map()` is taking the value `42` out of the array (the context), running `add(42, 1)` 
against that value, and placing the result of `add(42, 1)` into a new array (a new context). 

`map()` also allows us to compose functions, check this out:
```javascript
[1]
  .map((i) => add(i, 1)) // [2]
  .map((i) => Math.pow(i, 2)) // [4]
  .map((i) => add(i, 1)) // [5]
```
We just got our result via composing `add()` and `Math.pow`. Another benefit here is that the functions in each map 
are [pure](#pure-function). 

### Functor - a fancy name for a plain concept
You've just seen a `functor`. A `functor` is a fancy term for a mappable thing, or a thing with a `map()` function. 
When values are wrapped in contexts, we cannot run functions on those values, this is what `map()` helps us to do - 
run functions on values in contexts.

### Identity - A really simple functor
[Relevant code](6-some-concepts/identity-functor.js)
```javascript
'use strict'

const util = require('util')

const identity = (x) => ({
  map: (f) => identity(f(x)),
  // for debugging
  inspect: () => `Identity(${util.inspect(x, {depth: null})})`
})
```
`inspect()` just prints the value out for us for debugging. Let's focus on `map()`. `map()` takes a function `f` and 
passes `f` the Identity functor's value as an argument `f(x)`. `map()` then places the result of `f(x)` into a new 
Identity functor via `identity(f(x))`.

Here's how to use it:
```javascript
const simpleMap = identity(1)
  .map((i) => add(i, 1)) // Identity(2)
  .map((i) => Math.pow(i, 2)) // Identity(4)
  .map((i) => add(i, 1)) // Identity(5)
```

### Pointed functors
A pointed functor is a functor with an `of()` function. Pretty simple, check it out:
[Relevant code](6-some-concepts/identity-pointed-functor.js)
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
```

`of()` probably looks a lot like a constructor, but it isn't. `of()` is a common interface which allows us to create 
a value and place it in a default minimal context. This is quite different from a constructor, constructors are by 
definition tied to specific classes, `of()` is common. You'll also hear `of()` referred to as `unit`, `pure`, and 
`point`. 

It's worth noting that `Array` is actually a pointed functor:
```javascript
Array.of(1, 2, 3) // [1, 2, 3]
Array.of(23.95, 'Fun', false) // [ 23.95, 'Fun', false ]
```

### Why is having a common interface like "of()" so important?

Consider an array in Javascript. Is there a special syntax for `map()`-ing over an array of strings 
versus an array of numbers? Of course there isn't :) Arrays if any type - or mixed types - share a 
common interface (or API) which makes array quite flexible. Imagine how much more complex Javascript 
would be if we had to learn an API per collection.

### when map() doesn't work

Consider the previous Pointed Functor (you know, a unit of computation with a `map()` and an `of()` function).
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
Now say we wanted to use another pointed functor in our program. Since we're used to composing things in our programs, 
let's try to compose the new functor with our existing one using `map()`, here's a first pass:
```javascript
const mapAttempt = identity.of(1)
  .map((x) => identity.of(`Test ${x}`)) // Identity(Identity('Test 1'))
```
Egad! See that `Identity(Identity('Test 1'))` line? 

No, `map()` isn't broken. Like most annoyances in our field - _the code did exactly what we told it to do_ :)

Remember that `map()` takes a value out of it's context (the Identity functor), runs a function using that value, and 
places the result of that function into a new context - in this case a new the Identity functor.

If this is still confusing, consider the same example with an array:
```javascript
const mapAttempt = [1]
  .map((x) => [`Test ${x}`]) // [['Test 1']] <-- has the same nesting issue
```

### enter chain(), a "flat" map()
Let's fix this by adding a simple function called `chain()` to our functor.

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
`chain()` above is taking a function `f` and passing it the value from the functor `x` but instead of placing the 
result of `f(x)` back into a new functor (a new context) like `map()`, it's simply returning the result of `f(x)`. 
Now let's try composing 2 functors via `chain()`:
```javascript
const simpleChain = identity.of(1)
  .chain((x) => identity.of(`Test ${x}`)) // Identity('Test 1') much nicer!
```
Success! 
 
So in the example above, we start with: `identity.of(1)`, then we have a function ``(x) => identity.of(`Test ${x}`)``
which returns a new Identity functor of `'Test 1'`. `chain()` then takes the returned `identity.of('Test 1')` and returns
it. 

### The M word - Monads!
The code we created above, a pointed functor (with `of()` and `map()`) and a `chain()` function is a _Monad_. Monads are
pointed functors that have a `chain()` (or flatMap or bind) function. Hey, now you know what a Monad is!

[Relevant code](6-some-concepts/identity-monad.js)
```javascript
const identityMonad = ({
  // of() is also known as unit, pure, and point
  of: (x) => ({
    chain: (f) => f(x), // chain() is also known as flatMap or bind
    map: (f) => identityMonad.of(f(x)),
    // for debugging
    inspect: () => `Identity(${util.inspect(x, {depth: null})})`
  })
})
```
You can compose Monads together just like we composed functors together above, `chain()` works for that case too. 
```javascript
const chainToTheRescue = identity.of(1)
  .chain((x) => identity.of(`Test ${x}`)) // Identity('Test 1')
```

There are 3 laws monads must obey to be called monads, but I'm not going to go into them right now. We've had enough 
theory, let's take some Monads out for a spin!

---
## 7 - Awesome composition via the `data.task` Monad
[Relevant code](7-fx-data.task)

This example introduces the `data.task` Monad from the [Folktale library](https://github.com/origamitower/folktale).

Let's start out with the familiar `Promise` API, we'll then contrast it with `data.task`:
```javascript
const addPromiseYay = (value) => Promise.resolve(`${value} YAY! :)`)

const excitedPromise = Promise.resolve('fun') // = resolved Promise, execution starts here
  .then((value) => value.toUpperCase()) // = simple value
  .then((value) => addPromiseYay(value)) // = resolved Promise
  .then(console.log) // = simple value
```
Note that the `Promise` API does not make a distinction between returning a value, or a resolved Promise, both are 
handled with `.then()`.

It's also worth noting that Promises run as soon as they're defined 
([per the ECMAScript spec](https://tc39.github.io/ecma262/#sec-promise-constructor)). This code:
```javascript
console.log('Before promise is defined')
const promise = new Promise((res, rej) => {
  console.log('Promise is executing')
  return res()
})
console.log('After promise is defined')
```
Prints:
```
Before promise is defined
Promise is executing
After promise is defined
```

Back to `data.task`, it has our friends `of()`, `map()` and `chain()`. Here's a `map()` over `data.task`:

`map()` is pulling a value out of a `Task`, transforming it, and placing it back inside a new `Task` e.g.:
```javascript
Task.of('fun')
  .map((value) => value.toUpperCase()) // Task('FUN')
```

Now if we want to pull a value out of a `Task` and use it in a new `Task` we know `map()` won't help us, e.g.:
```javascript
Task.of('fun') // Task('fun')
  .map((value) => Task.of(value.toUpperCase())) // Task(Task('FUN'))
```
but `chain()` will:
```javascript
Task.of('fun') // Task('fun')
  .chain((value) => Task.of(value.toUpperCase())) // Task('FUN')
```

OK, let's consider the `Task` analog to the above `Promise` example:
```javascript
const addTaskYay = (value) => Task.of(`${value} YAY! :)`)

const excitedTask = Task.of('fun') // Task('fun')
  // value is taken out of the Task, upper-cased, and put back in to the Task
  .map((value) => value.toUpperCase()) // Task('FUN')
  // value is taken out of the Task and placed inside a new Task
  .chain((value) => addTaskYay(value)) // Task('FUN YAY! :)')
  // execution starts, error and result handlers get simple values
  .fork(console.error, console.log); // error or FUN YAY! :)
```

### Why use data.Task?

Remember that previously `request()` wasn't pure, its output varied based on state external to its input, namely the 
network. Now `request()` is pure and easily composable with other functions. We've also pushed control for running 
`request()` and handling errors out to the caller, which is where those concerns belong. By letting the caller 
control when the `Task` runs, the caller can take that `Task` and compose it with other computations via 
`.map()` and `.chain()` as per above. Once the caller has composed everything it needs, it can call `fork()` 
to run the composed computations.

---
## 8 - (fun?) bonus
[Relevant code](8-fx-data.task-parallel-calls)

This example shows one way to run `data.task`'s in parallel. It's included as a silly bonus, or something.

---
## Solutions not considered:
### Factory function
It would have been possible to define `request-things::request` like this (pseudo code):
```javascript
(serviceConfig) => {
  validateServiceConfig(serviceConfig) // only option is to throw here
  return (requestOptions) => {
    // rest of the functions + request
  }
}
```
This design not only encourages devs to keep an instance of the returned function around in memory, but also the only 
benefit to this design is when making a request, `joi` validates an object that looks like this:
```javascript
{
  type: 'cool', 
  limit: 5
}
```
instead of one which looks like this:
```javascript
{
  serviceConfig: {
    url: 'http://localhost:9000',
    accessKey: '1234567890'
  },
  requestOptions: {
    type: 'cool', 
    limit: 5
  }
}
```
Not much of a benefit, well, unless `joi` is our bottleneck :)

---
## Hey watch these videos, they're awesome!

- [Professor Frisby Introduces Composable Functional JavaScript](
https://egghead.io/courses/professor-frisby-introduces-function-composition)

- Classroom Coding with Prof. Frisby
 - [Part 1](https://www.youtube.com/watch?v=h_tkIpwbsxY&t=3s)
 - [Part 2](https://www.youtube.com/watch?v=oZ6C9h49bu8&t=7s)
 - [Part 3](https://www.youtube.com/watch?v=mMCgJA8HScA&t=609s)
