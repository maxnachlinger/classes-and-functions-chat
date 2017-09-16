'use strict'
const _ = require('lodash')
const joi = require('joi')
const run = require('../_etc/run')('6-fx-data.task')
const serviceConfig = require('../_etc/service-config')
const requestThings = require('./request-things')
const validateResult = require('./validate-result')

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required()

const request = _.partial(requestThings.request, serviceConfig)
const validateLocal = validateResult(responseSchema)

const task = request({type: 'cool', limit: 5})
  .chain((result) => validateLocal(result))

// transforming this into a promise to show how .fork() works
run(
  new Promise((resolve, reject) => task.fork(reject, resolve))
)
