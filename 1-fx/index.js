'use strict'
const _ = require('lodash')
const run = require('../_etc/run')
const serviceConfig = require('../_etc/service-config')
const requestThings = require('./request-things')

const request = _.partial(requestThings.request, serviceConfig)

run(() => {
  return request({type: 'cool', limit: 20})
})
