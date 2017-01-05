'use strict';
const requestThings = require('./request-things');
const deepCopy = require('deep-copy');

module.exports.init = (serviceConfig) => {
  exports.request = (requestOptions) => requestThings.request(deepCopy(serviceConfig), requestOptions);
};
