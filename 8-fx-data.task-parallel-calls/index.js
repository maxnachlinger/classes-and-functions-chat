'use strict'
const _ = require('lodash')
const joi = require('joi')
const run = require('../_etc/run')('8-fx-data.task-parallel-calls')
const serviceConfig = require('../_etc/service-config')
const requestThings = require('./request-n-things')
const validateResult = require('./validate-result')

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required()

const request = _.partial(requestThings.request, serviceConfig)
const validateLocal = validateResult(responseSchema)

const task = request({type: 'cool', limit: 20})
  .chain((result) => validateLocal(result))

run(
  new Promise((resolve, reject) => task.fork(reject, resolve))
)
