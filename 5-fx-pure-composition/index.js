'use strict'
const _ = require('lodash')
const joi = require('joi')
const run = require('../_etc/run')
const serviceConfig = require('../_etc/service-config')
const requestThings = require('./request-things')
const addValidation = require('./add-validation')

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required()

const request = _.partial(requestThings.request, serviceConfig)

run(() => {
  return addValidation(responseSchema)(
    request({type: 'cool', limit: 20})
  )
})
