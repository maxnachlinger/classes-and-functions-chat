'use strict'
const run = require('../_etc/run')('0-class')
const ThingRequest = require('./ThingRequest')
const serviceConfig = require('../_etc/service-config')

const thingRequest = new ThingRequest(serviceConfig)

run(
  thingRequest.request({type: 'cool', limit: 20})
)
