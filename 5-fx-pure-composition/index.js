'use strict'
const _ = require('lodash')
const joi = require('joi')
const run = require('../_etc/run')('5-fx-pure-composition')
const serviceConfig = require('../_etc/service-config')
const requestThings = require('./request-things')
const validateResult = require('./validate-result')

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required()

const request = _.partial(requestThings.request, serviceConfig)
const validateResultLocal = validateResult(responseSchema)

run(
  request({type: 'cool', limit: 5})
    .then((result) => validateResultLocal(result))
)
