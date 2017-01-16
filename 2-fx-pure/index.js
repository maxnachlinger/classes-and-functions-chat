'use strict'
const _ = require('lodash')
const run = require('../_etc/run')('2-fx-pure')
const serviceConfig = require('../_etc/service-config')
const requestThings = require('./request-things')

const request = _.partial(requestThings.request, serviceConfig)

run(
  request({type: 'cool', limit: 5})
)
