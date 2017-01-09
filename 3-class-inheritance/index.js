'use strict'
const joi = require('joi')
const run = require('../_etc/run')('3-class-inheritance')
const serviceConfig = require('../_etc/service-config')
const ValidatedThingRequest = require('./ValidatedThingRequest')

const serviceConfigLocal = Object.assign({}, serviceConfig, {
  responseSchema: joi.array().items(joi.object().keys({
    id: joi.number().integer().required(),
    name: joi.string().required(),
    type: joi.string().required()
  })).required()
})

const thingRequest = new ValidatedThingRequest(serviceConfigLocal)

run(
  thingRequest.request({type: 'cool', limit: 20})
)
