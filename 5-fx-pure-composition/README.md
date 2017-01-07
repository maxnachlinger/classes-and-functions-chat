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
This stuff is hot like Vindaloo :) Of course only functions with a fixed arity (arity == number of argumentS BTW) can be curried since all ``curry`` library helpers use ``Function.length``. If you know of a way to curry without using ``Function.length``, please let me know :)

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
