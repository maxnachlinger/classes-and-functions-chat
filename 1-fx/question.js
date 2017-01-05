// From the point of view of the calling code, which is more maintainable? A class you instantiate with an arg and
// an instance method you call with another arg,

const instance = new ThingRequest(serviceConfig);

// many lines of code later...

instance.request({ type: 'squirrels', limit: 20 })
  .then((results) => console.log(results))
  .catch((err) => console.error(err.stack || err));


// or a method you call passing 2 args?
request(serviceConfig, { type: 'squirrels', limit: 20 })
  .then((results) => console.log(results))
  .catch((err) => console.error(err.stack || err));
