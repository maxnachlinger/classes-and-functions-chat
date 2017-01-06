'use strict'
const run = require('../run')
const ThingRequest = require('./ThingRequest')

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890'
}

const thingRequest = new ThingRequest(serviceConfig)

run(() => {
  return thingRequest.request({type: 'cool', limit: 20})
})
