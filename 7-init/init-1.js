'use strict';
const requestThings = require('./request-things');
const deepCopy = require('deep-copy');

let _serviceConfig;

module.exports.init = (serviceConfig) => {
  _serviceConfig = serviceConfig;
};

module.exports.request = (requestOptions) => requestThings.request(deepCopy(_serviceConfig), requestOptions);
