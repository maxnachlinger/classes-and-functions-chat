'use strict';
const _ = require('lodash');
const run = require('../run');
const requestThings = require('./init-0');

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890'
};
requestThings.init(serviceConfig);

const request = _.partial(requestThings.request, serviceConfig);

run(() => {
  return request({ type: 'cool', limit: 20 });
});
