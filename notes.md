## 0
### Changes 
A ``ThingRequest`` class.

### Question:
Where does ``ThingRequest::request()`` get its state from?

The answer is _lots of places_. The class instance, the function's arguments, the things we required above etc.

How a function gets it's state can be complicated. **Minimizing that complexity makes the function easier to think about,
work on, and test.**

In ``ThingRequest`` we have class instance variables that influence ``request()``'s behavior several lines away from that
function. We can improve this.

## 1
### Changes
This is a first pass at simplifying ``request()``. Now more of the function's state comes from it's arguments.

Some folks claim a benefit of classes is that you don't have to pass the state given to the constructor along to each
instance method. The calling code in ``index.js`` shows that partial application is a reasonable way around that.

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

instance.request({type: 'squirrels', limit: 20})
  .then((results) => console.log(results))
  .catch((err) => console.error(err.stack || err))
```
or a method you call passing 2 args?
```javascript
request(serviceConfig, {type: 'squirrels', limit: 20})
  .then((results) => console.log(results))
  .catch((err) => console.error(err.stack || err))
```

## 2
### Changes:
A few new pure functions are extracted, namely ``prepareParams()``, ``prepareRequestParams()``, and ``transformResults()``.

Promises are used to compose those functions along with ``requestP()``.

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

## 3
### Changes

This example adds result-validation by extending ``ThingRequest`` with a new child class ``ValidatedThingRequest``.

Unfortunately we had to modify ``ThingRequest`` and export ``serviceConfigSchema``, then use the exported ``serviceConfigSchema``
in ``ValidatedThingRequest``'s validation.

### Wait a moment
Wasn't the whole point of inheritance the ability to re-use code without modifying it? Modifying a base class when
inheriting is sadly quite common, and if lots of classes inherit from that base class, you can cause lots of bugs.

There are other ways of structuring ``ThingRequest`` and ``ValidatedThingRequest`` to get around _some_ of these issues but
that's not the point here.

The point is that **your requirements will change**, and when they do you'll not only have to change the functionality
itself, but you'll also have to contend with a whole set of classes meant to describe those requirements as a world
consisting of objects.

When using inheritance the issue gets even more complex as child classes gain access to and alter the internal state
of their parent classes. As systems structured in this way grow, these dependencies are rarely obvious and the
side-effects to altering state are even less obvious.

## 4
### Changes
This attempts to add result-validation by creating a class which adds that validation by having an instance of
``ThingRequest`` injected into it.

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

1. ``ValidatedThingRequest`` is now responsible for creating and destroying that instance of ``ThingRequest``.
2. It's also harder to test ``ValidatedThingRequest`` since we can easily supply a mocked ``ThingRequest``.
3. There are loads of other benefits (like loose coupling and programming to interfaces) but those are less relevant for Javascript IMHO.

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

Now we can easily mock thingRequest when testing, and ``ValidatedThingRequest`` isn't responsible for managing ``ThingRequest``. It can simply use the instance passed in.

The takeaway here is that if you're going to use classes to construct your programs, you should learn about OO Design
Patterns and techniques like dependency injection. There are book-shelves filled with great old tomes on this stuff.

For my part, what I love about javascript is that I can use much simpler approaches to get decoupled testable code :)

## 5
### Changes
``pass-thru.js`` is extracted since it's a common requirement to call a function on a promise with the promise's result and pass that promise's result through to the next ``.then()`` handler.

``add-validation.js`` simply adds a validation check to the result of a promise, this is another bit of reusable code.

Both functions are curried. In case you have no idea what currying is:

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
This stuff is hot like Vindaloo :) Of course only functions with a fixed arity (``arity == number of arguments``) can be curried since all ``curry`` library helpers use ``Function.length``. If you know of a way to curry in Javascript without using ``Function.length``, please let me know :)

One thing I find helpful when creating new functions is to think of the arguments you're going to have values for right away, and then add those arguments _first_ in the function. For example, we almost always have a ``joi`` validation schema before we have data to validate. Wouldn't this ``.validate`` signature be nice?
```javascript
// instead of: validate(value, schema, [options], [callback])
// how about: validate(schema, value, [options], [callback]) ?
```
Then we could do cool stuff like:
```javascript
const validate = _.curry(joi.validate, {
  name: joi.string().required()
}); // --> (value, [options], [callback]) => {}
```
## 6
### Changes
This example introduces the ``data.task`` Monad from the [Folktale library](https://github.com/origamitower/folktale).

The benefit here is that request-things is now totally pure and we push control for running ``request()`` and handling
the error out to the client, which is where those concerns belong. 

In systems, how the system is setup and started is a separate concern from how it runs. This captures that. You can
keep composing on to the Task via ``.map()`` and ``.chain()`` until you call ``.fork()`` which then executes the 
Task(s) and allows the caller to handle the result/error.

## 7
### Changes
So if we don't use the class approach to requesting things, do we still have to pass the ``serviceConfig`` parameter to
request each time?

Nope. Assuming your config won't change while the app is running, you can partially apply the ``serviceConfig ``to
``request()`` and add that to the ``require.cache``. If you config is dynamic, you really should pass it each time you invoke
the function :)

### 2 simple approaches:
1. ``init-0.js`` - Objects are passed by reference in javascript (yeah I know you knew that :).
So our exported object is a reference in the require.cache. ``init()`` simply adds our partially-applied method as a
new request property to that object.

2. ``init-1.js`` - ``init()`` sets a variable in the module, ``request()`` is exported as a normal function but uses that variable.

### Warning
Passing around shared config means that any function which receives a reference to that shared config can now screw
with it. These kinds of side-effects are especially hard to track down.

So, we need to share this config, but we don't want to give every function which receives a reference to it the power
to screw it up.

### Solution
Give each function a copy of the shared config :) That's why the shared variable reference is ``deep-copy``ied in the examples.

## 8
### Changes
This example shows one way to run ``data.task``'s in parallel. It's included as a silly bonus, or something.
