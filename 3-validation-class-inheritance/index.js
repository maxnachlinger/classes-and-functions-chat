'use strict';
const joi = require('joi');
const run = require('../run');
const ValidatedThingRequest = require('./ValidatedThingRequest');

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890',
  responseSchema: joi.array().items(joi.object().keys({
    id: joi.number().integer().required(),
    name: joi.string().required(),
    type: joi.string().required()
  })).required()
};

const thingRequest = new ValidatedThingRequest(serviceConfig);

run(() => {
  return thingRequest.request({ type: 'cool', limit: 20 })
});
