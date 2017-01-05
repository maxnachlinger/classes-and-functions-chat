'use strict';
const urlLib = require('url'); // urlLib since 'url' is a nice var name :)
const joi = require('joi');
const Promise = require('bluebird');
const requestLib = Promise.promisify(require('request'));
const validate = Promise.promisify(joi.validate, { context: joi });

const prepareParams = (serviceConfig, requestOptions) => {
  const schema = {
    requestOptions: joi.object().keys({
      type: joi.string().required(),
      limit: joi.number().integer().required()
    }),
    serviceConfig: joi.object().keys({
      url: joi.string().required(),
      accessKey: joi.string().required()
    })
  };
  return validate({ serviceConfig, requestOptions }, schema);
};

const prepareRequestParams = (options) => {
  const url = options.serviceConfig.url;
  const accessKey = options.serviceConfig.accessKey;
  const type = options.requestOptions.type;
  const limit = options.requestOptions.limit;

  return {
    url: urlLib.format(Object.assign(urlLib.parse(url), {
      pathname: '/thing',
      query: { 'thing-type': type, limit }
    })),
    headers: { 'Access-Key': accessKey },
    json: true
  };
};

const transformResults = (results) => results ? results.body : {};

module.exports.request = (serviceConfig, requestOptions) => prepareParams(serviceConfig, requestOptions)
  .then((options) => prepareRequestParams(options))
  .then((requestParams) => requestLib(requestParams))
  .then((results) => transformResults(results));

// for testing
module.exports.internals = { prepareParams, prepareRequestParams, transformResults };
