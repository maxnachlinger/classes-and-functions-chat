'use strict';
const urlLib = require('url');
const joi = require('joi');
const Promise = require('bluebird');
const requestP = Promise.promisify(require('request'));

const serviceConfigSchema = {
  url: joi.string().required(),
  accessKey: joi.string().required()
};

const requestOptionsSchema = {
  type: joi.string().required(),
  limit: joi.number().integer().required()
};

class ThingRequest {
  constructor (serviceConfig) {
    joi.assert(serviceConfig, serviceConfigSchema, 'Invalid serviceConfig');

    this._urlObject = urlLib.parse(serviceConfig.url);
    this._headers = {
      'Access-Key': serviceConfig.accessKey
    };
  }

  request (requestOptions) {
    const validationError = joi.validate(requestOptions, requestOptionsSchema).error;
    if (validationError) {
      return Promise.reject(validationError);
    }

    const url = urlLib.format(Object.assign({}, this._urlObject, {
      pathname: '/thing',
      query: {
        'thing-type': requestOptions.type,
        limit: requestOptions.limit
      }
    }));
    return requestP({ url, headers: this._headers, json: true })
      .then((results) => results.body);
  }
}

module.exports = ThingRequest;
// base class modification
module.exports.serviceConfigSchema = serviceConfigSchema;
