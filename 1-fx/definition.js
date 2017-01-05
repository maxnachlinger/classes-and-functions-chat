'use strict';

// Partial Application:
// A fancy phrase for taking a function with, say, 3 params, like this:

const getStuff = (url, accessKey, type) => {
  // etc
};

// and making a new function that provides values for some of those params up-front. Like this:

const getStuffLocal = (type) => getStuff('http://www.example.com', 'secret-access-key', type);

// you can also use a helper like lodash

const _ = require('lodash');
const getStuffLocal2 = _.partial(getStuff, 'http://www.example.com', 'secret-access-key');
