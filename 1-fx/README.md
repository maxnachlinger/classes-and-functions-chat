#### Changes
This is a first pass at simplifying ``request()``. Now more of the function's state comes from it's arguments.

Some folks claim a benefit of classes is that you don't have to pass the state given to the constructor along to each
instance method. The calling code shows that partial application is a reasonable way around that.

In case you don't know:

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
