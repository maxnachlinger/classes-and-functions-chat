'use strict'
const _ = require('lodash')
const run = require('../run')
const requestThings = require('./request-things')

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890'
}

const request = _.partial(requestThings.request, serviceConfig)

run(() => {
  return request({ type: 'cool', limit: 20 })
})
