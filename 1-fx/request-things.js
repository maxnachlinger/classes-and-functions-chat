'use strict'
const urlLib = require('url')
const joi = require('joi')
const Promise = require('bluebird')

const requestP = Promise.promisify(require('request'))

const schema = {
  serviceConfig: {
    url: joi.string().required(),
    accessKey: joi.string().required()
  },
  requestOptions: {
    type: joi.string().required(),
    limit: joi.number().integer().required()
  }
}

module.exports.request = (serviceConfig, requestOptions) => {
  const validationError = joi.validate({serviceConfig, requestOptions}, schema).error
  if (validationError) {
    return Promise.reject(validationError)
  }

  const url = urlLib.format(Object.assign(urlLib.parse(serviceConfig.url), {
    pathname: '/thing',
    query: {'thing-type': requestOptions.type, limit: requestOptions.limit}
  }))

  const headers = {'Access-Key': serviceConfig.accessKey}
  return requestP({url, headers, json: true})
    .then((results) => results.body)
}
