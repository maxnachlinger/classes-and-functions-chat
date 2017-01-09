'use strict'
const run = require('../_etc/run')('7-init index-0')
const serviceConfig = require('../_etc/service-config')
const requestWrapper = require('./init-0')

requestWrapper.init(serviceConfig)

run(
  requestWrapper.request({type: 'cool', limit: 20})
)
