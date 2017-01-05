'use strict';
const urlLib = require('url'); // urlLib since 'url' is a nice var name :)
const joi = require('joi');
const Promise = require('bluebird');
const requestLib = Promise.promisify(require('request'));

const schema = {
  serviceConfig: {
    url: joi.string().required(),
    accessKey: joi.string().required()
  },
  requestOptions: {
    type: joi.string().required(),
    limit: joi.number().integer().required()
  }
};

module.exports.request = (serviceConfig, requestOptions) => {
  const validationError = joi.validate({ serviceConfig, requestOptions }, schema).error;
  if (validationError) {
    return Promise.reject(validationError);
  }

  const url = urlLib.format(Object.assign(urlLib.parse(serviceConfig.url), {
    pathname: '/thing',
    query: { 'thing-type': requestOptions.type, limit: requestOptions.limit }
  }));

  const headers = { 'Access-Key': serviceConfig.accessKey };
  return requestLib({ url, headers, json: true })
    .then((results) => results.body);
};
