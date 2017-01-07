### Changes
pass-thru is extracted since it's a common requirement to call a function on a promise with the promise's result and
return the promise's result.

add-validation simply adds a validation check to the result of a promise, this is another bit of reusable code.
Both functions are curried.

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

When creating functions think of what arguments you're going to have values for first and put those at the beginning.

PS Hey ``joi.validate`` I always have my schema way before I have my stuff to validate! I sure wish ``schema`` was the 1st arg :)
