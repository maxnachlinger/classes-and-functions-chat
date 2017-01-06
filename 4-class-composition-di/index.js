'use strict'
const joi = require('joi')
const run = require('../run')
const ThingRequest = require('./ThingRequest')
const ValidatedThingRequest = require('./ValidatedThingRequest')

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890'
}

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required()

const thingRequest = new ThingRequest(serviceConfig)
const loggingThingRequest = new ValidatedThingRequest(responseSchema, thingRequest)

run(() => {
  return loggingThingRequest.request({type: 'cool', limit: 20})
})
