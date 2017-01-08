'use strict'
const run = require('../_etc/run')
const serviceConfig = require('../_etc/service-config')
const requestWrapper = require('./init-0')

requestWrapper.init(serviceConfig)

run(() => {
  return requestWrapper.request({type: 'cool', limit: 20})
})
