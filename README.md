## classes-and-functions-chat

### Installation
```shell
git clone git@github.com:maxnachlinger/classes-and-functions-chat.git
cd classes-and-functions-chat
npm i
```

### Run the examples
```shell
# you can run the index.js file in each directory
node ./0-class/index.js
```

### Notes (aka "The Presentation")

### Requirement: get a set of results from a REST API on the network
---
### 0 - Class
[Relevant code](./0-class)

A ``ThingRequest`` class.

#### Question:
Where does ``ThingRequest::request()`` get its state from?

The answer is _lots of places_. The class instance, the function's arguments, the things we required above etc.

How a function gets it's state can be complicated. **Minimizing that complexity makes the function easier to think 
about, work on, and test.**

In ``ThingRequest`` we have class instance variables that influence ``request()``'s behavior several lines away from 
that function. We can improve this.

#### Compared to languages like C# and JAVA, classes in Javascript are a bit _awkward_ 

- To use classes and objects in Javascript we have to `.bind` everywhere to ensure `this` doesn't change when a method 
in one of our classes is invoked. 
- and woe to he or she who forgets the `new` keyword when instantiating a class
- If you want private things, you can only have them via closures

---
### 1 - Function
[Relevant code](./1-fx)

This is a first pass at simplifying ``request()``. Now more of the function's state comes from it's arguments.

One benefit of this approach is that ``request()`` is open about its dependencies, which makes it easier to reason
about.

Some folks claim a benefit of classes is that you don't have to pass the state given to the constructor along to each
instance method. The calling code in ``index.js`` shows that partial application is a reasonable way around that.

In case you don't know what partial application is:

#### Partial Application:

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

#### Question:
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
### 2 - Extract and compose pure functions
[Relevant code](./2-fx-pure)

A few new pure functions are extracted, namely ``prepareParams()``, ``prepareRequestParams()``, and 
``transformResults()``.

Promises are used to compose those functions along with ``requestP()``.

#### Benefits of this approach:
- Each function gets just enough state to do it's job
- Each function has one responsibility
- + all the benefits of pure functions.

In case you've no idea what a Pure function is:

#### Pure Function:

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

It's worth noting that ``requestP()`` is _not_ pure. Its output varies based on state external to its input, namely 
the network :) We can make ``requestP()`` pure, and we'll explore what that looks like later on.

---
### Requirement-change: get a set of results from a REST API on the network and validate those results

---
### 3 - Class inheritance
[Relevant code](./3-class-inheritance)

This example adds result-validation by extending ``ThingRequest`` with a new child class ``ValidatedThingRequest``.

Unfortunately we had to modify ``ThingRequest`` and export ``serviceConfigSchema``, then use the exported 
``serviceConfigSchema`` in ``ValidatedThingRequest``'s validation.

#### Wait a moment
Wasn't the whole point of inheritance the ability to re-use code without modifying it? Modifying a base class when
inheriting is sadly quite common, and if lots of classes inherit from that base class, you can cause lots of bugs.

There are other ways of structuring ``ThingRequest`` and ``ValidatedThingRequest`` to get around _some_ of these issues 
but that's not the point here.

The point is that **your requirements will change**, and when they do you'll not only have to change the functionality
itself, but you'll also have to contend with a whole set of classes meant to describe those requirements as a world
consisting of objects.

When using inheritance the issue gets even more complex as child classes gain access to and alter the internal state
of their parent classes. As systems structured in this way grow, these dependencies are rarely obvious and the
side-effects to altering state are even less obvious.

---
### 4 - Class composition through Dependency Injection
[Relevant code](./4-class-composition-di)

This attempts to add result-validation by creating a class which adds that validation by having an instance of
``ThingRequest`` injected into it.

#### Dependency Injection

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

1. ``ValidatedThingRequest`` is now responsible for creating and destroying that instance of ``ThingRequest``.
2. It's also harder to test ``ValidatedThingRequest`` since we can easily supply a mocked ``ThingRequest``.
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
We're _injecting_ ``ValidatedThingRequest``'s ``ThingRequest`` dependency. 

Now we can easily mock thingRequest when testing, and ``ValidatedThingRequest`` isn't responsible for managing 
``ThingRequest``. It can simply use the instance passed in.

The takeaway here is that if you're going to use classes to construct your programs, you should learn about OO Design
Patterns and techniques like dependency injection. There are book-shelves filled with great old tomes on this stuff.
One benefit of dependency injection is it makes a class' dependencies explicit, which makes the class easier to 
reason about.

For my part, I think there are much simpler approaches to achieving decoupled, testable, code :)

---
### 5 - More pure function composition
[Relevant code](./5-fx-pure-composition)

``validate-result.js`` simply adds a validation check to the result. This function is curried because we have the 
result schema way before we have the result.

In case you have no idea what currying is:

#### Currying

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
This stuff is hot like Vindaloo :) Of course only functions with a fixed arity (``arity == number of arguments``) can 
be curried since all ``curry`` library helpers use ``Function.length``. If you know of a way to curry in Javascript 
without using ``Function.length``, please let me know :)

One thing I find helpful when creating new functions is to think of the arguments you're going to have values for 
right away, and then add those arguments _first_ in the function. For example, we almost always have a ``joi`` 
validation schema before we have data to validate. Wouldn't this ``.validate`` signature be nice?
```javascript
// instead of: 
validate(value, schema, [options], [callback])
// how about: 
validate(schema, value, [options], [callback])
```
Then we could do cool stuff like:
```javascript
const validate = _.curry(joi.validate, {
  name: joi.string().required()
}); // --> (value, [options], [callback]) => {}
```

---
### 6 - Awesome composition via the ``data.task`` Monad
[Relevant code](./6-fx-data.task)

This example introduces the ``data.task`` Monad from the [Folktale library](https://github.com/origamitower/folktale).
Before I go on, you're probably wondering...

#### map, chain, what?
Right, here's the familiar ``Promise`` API:
```javascript
const addPromiseYay = (value) => Promise.resolve(`${value} YAY! :)`)

const excitedPromise = Promise.resolve('fun') // = resolved Promise, execution starts here
  .then((value) => value.toUpperCase()) // = simple value
  .then((value) => addPromiseYay(value)) // = resolved Promise
  .then(console.log) // = simple value
```
The ``Promise`` API doesn't make a distinction between returning a value, or a resolved Promise, both are handled with 
``.then()``.

Now consider ``map()`` and ``chain()``. We know ``map()`` from Arrays:
```javascript
[0,1,2,3].map((i) => i + 1) // [1,2,3,4]
```
What's ``map()`` doing? Well, you could say it takes an item out of an array, transforms it, and places it back into an 
array.  That's exactly what the ``.map()`` in our ``data.task`` example is doing. It pulls a value out of a ``Task``, 
transforms it, and places it back inside the ``Task`` e.g.:
```javascript
Task.of('fun') // start off with a Task('fun')
  // map pulls out the value "fun" from the Task, upper-cases it, and then places it back into the Task.
  .map((value) => value.toUpperCase()) // Task('FUN')
```

Now what if I want to pull a value out of a ``Task`` and use it in a new ``Task``? Here's what ``.map()`` would get us:
```javascript
Task.of('fun') // Task('fun')
  // map pulls out the value "fun" from the Task, creates a new Task with that value upper-cased, 
  // and then places it back into the Task.
  .map((value) => Task.of(value.toUpperCase())) // Task(Task('FUN')) <-- :(
```
See that crazy ``Task(Task('FUN'))``? That's not what we want! ``map()`` isn't up to shenanigans, it's following it's 
contract. The problem is, we don't want the new ``Task`` put back inside a ``Task``, we want a new ``Task``.

This is what ``chain()`` does. ``.chain()`` takes a value and returns a new ``Task`` with that value inside it. So instead
of nesting like ``.map()``, ``chain()`` transforms a value and places it in to a new ``Task``. ``chain()`` is sometimes 
called ``flatMap()``, which (hopefully now) is a pretty descriptive name :)

OK, let's consider the ``Task`` analog to the above ``Promise`` example:
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

#### Why use data.Task?

Remember that previously ``request()`` wasn't pure, its output varied based on state external to its input, namely the 
network. Now ``request()`` is pure and easily composable with other functions. We've also pushed control for running 
``request()`` and handling errors out to the caller, which is where those concerns belong. By letting the caller 
control when the ``Task`` runs, the caller can take that ``Task`` and compose it with other computations via 
``.map()`` and  ``.chain()`` as per above. Once the caller has composed everything it needs, it can call ``fork()`` 
to run the composed computations.

It's worth noting that Promises run as soon as they're defined 
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

### 

#### BTW
You'll find ``chain()`` and ``map()`` on other Monads as well, not just ``data.task``

---
### 7 - Some ideas on how to initialize things
[Relevant code](./7-init)

So if we don't use the class approach to requesting things, do we still have to pass the ``serviceConfig`` parameter to
request each time?

Nope. Assuming your config won't change while the app is running, you can partially apply the ``serviceConfig ``to
``request()`` and add that to the ``require.cache``. If you config is dynamic, you really should pass it each time 
you invoke the function :)

#### 2 simple approaches:
1. ``init-0.js`` - Objects are passed by reference in javascript (yeah I know you knew that :).
So our exported object is a reference in the require.cache. ``init()`` simply adds our partially-applied method as a
new request property to that object.

2. ``init-1.js`` - ``init()`` sets a variable in the module, ``request()`` is exported as a normal function but uses 
that variable.

#### Warning
Passing around shared config means that any function which receives a reference to that shared config can now screw
with it. These kinds of side-effects are especially hard to track down.

So, we need to share this config, but we don't want to give every function which receives a reference to it the power
to screw it up.

#### Solution
Give each function a copy of the shared config :) That's why the shared variable reference is ``deep-copy``ied 
in the examples.

---
### 8 - (fun?) bonus
[Relevant code](./8-fx-data.task-parallel-calls)

This example shows one way to run ``data.task``'s in parallel. It's included as a silly bonus, or something.

---
### Solutions not considered:
#### Factory function
It would have been possible to define ``request-things::request`` like this (pseudo code):
```javascript
(serviceConfig) => {
  validateServiceConfig(serviceConfig) // only option is to throw here
  return (requestOptions) => {
    // rest of the functions + request
  }
}
```
This design not only encourages devs to keep an instance of the returned function around in memory, but also the only 
benefit to this design is when making a request, ``joi`` validates an object that looks like this:
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
Not much of a benefit, well, unless ``joi`` is our bottleneck :)

---
### Hey watch these videos, they're awesome!

- [Professor Frisby Introduces Composable Functional JavaScript](
https://egghead.io/courses/professor-frisby-introduces-function-composition)

- Classroom Coding with Prof. Frisby
 - [Part 1](https://www.youtube.com/watch?v=h_tkIpwbsxY&t=3s)
 - [Part 2](https://www.youtube.com/watch?v=oZ6C9h49bu8&t=7s)
 - [Part 3](https://www.youtube.com/watch?v=mMCgJA8HScA&t=609s)
