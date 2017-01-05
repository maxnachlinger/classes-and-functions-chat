'use strict';

const _ = require('lodash');
const joi = require('joi');
const ThingRequest = require('./ThingRequest');
const Promise = require('bluebird');
const validate = Promise.promisify(joi.validate, { context: joi });

const serviceConfigSchema = Object.assign({}, ThingRequest.serviceConfigSchema, {
  responseSchema: joi.object().required()
});

class ValidatedThingRequest extends ThingRequest {
  constructor (serviceConfig) {
    joi.assert(serviceConfig, serviceConfigSchema, 'Invalid serviceConfig');
    super(_.omit(serviceConfig, 'responseSchema'));

    this._responseSchema = serviceConfig.responseSchema;
  }

  request (requestOptions) {
    return super.request(requestOptions)
      .then((result) => validate(result, this._responseSchema));
  }
}
module.exports = ValidatedThingRequest;
