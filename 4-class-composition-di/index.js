'use strict'
const joi = require('joi')
const run = require('../_etc/run')('4-class-composition-di')
const serviceConfig = require('../_etc/service-config')
const ThingRequest = require('./ThingRequest')
const ValidatedThingRequest = require('./ValidatedThingRequest')

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required()

const thingRequest = new ThingRequest(serviceConfig)
const validatedThingRequest = new ValidatedThingRequest(responseSchema, thingRequest)

run(
  validatedThingRequest.request({type: 'cool', limit: 5})
)
