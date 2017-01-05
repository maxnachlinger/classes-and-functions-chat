'use strict';
const run = require('../run');
const requestWrapper = require('./init-0');

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890'
};
requestWrapper.init(serviceConfig);

run(() => {
  return requestWrapper.request({ type: 'cool', limit: 20 });
});
