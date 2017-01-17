'use strict'
const urlLib = require('url')
const joi = require('joi')
const Task = require('data.task')
const request = require('request')
const futurize = require('futurize').futurize(Task)

const validateT = futurize(joi.validate)
const requestT = futurize(request)

const prepareParams = (serviceConfig, requestOptions) => {
  const schema = {
    requestOptions: joi.object().keys({
      type: joi.string().required(),
      limit: joi.number().integer().required()
    }),
    serviceConfig: joi.object().keys({
      url: joi.string().required(),
      accessKey: joi.string().required()
    })
  }
  return validateT({serviceConfig, requestOptions}, schema)
}

const prepareRequestParams = (options) => {
  // no destructuring in node 4 :(
  const url = options.serviceConfig.url
  const accessKey = options.serviceConfig.accessKey
  const type = options.requestOptions.type
  const limit = options.requestOptions.limit

  return {
    url: urlLib.format(Object.assign(urlLib.parse(url), {
      pathname: '/thing',
      query: {'thing-type': type, limit}
    })),
    headers: {'Access-Key': accessKey},
    json: true
  }
}

const transformResults = (results) => results ? results.body : []

module.exports.request = (serviceConfig, requestOptions) => prepareParams(serviceConfig, requestOptions)
  .map((options) => prepareRequestParams(options))
  .chain((requestParams) => requestT(requestParams))
  .map((results) => transformResults(results))

// for testing
module.exports.internals = {prepareParams, prepareRequestParams}
