'use strict'
const run = require('../_etc/run')
const ThingRequest = require('./ThingRequest')
const serviceConfig = require('../_etc/service-config')

const thingRequest = new ThingRequest(serviceConfig)

run(() => {
  return thingRequest.request({type: 'cool', limit: 20})
})
