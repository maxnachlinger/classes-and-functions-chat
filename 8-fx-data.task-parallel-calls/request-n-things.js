'use strict'
const urlLib = require('url') // urlLib since 'url' is a nice var name :)
const joi = require('joi')
const Task = require('data.task')
const request = require('request')
const R = require('ramda')
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
  return validateT({ serviceConfig, requestOptions }, schema)
}

const prepareRequestParams = (options) => {
  const { url, accessKey } = options.serviceConfig
  const { type, limit } = options.requestOptions

  return {
    url: urlLib.format(Object.assign(urlLib.parse(url), {
      pathname: '/thing',
      query: { 'thing-type': type, limit }
    })),
    headers: { 'Access-Key': accessKey },
    json: true
  }
}

const transformResults = (...results) => {
  return results.reduce((acc, a) => acc.concat(a.body || []), [])
}

const makeRequest = (serviceConfig, requestOptions) => prepareParams(serviceConfig, requestOptions)
  .map((options) => prepareRequestParams(options))
  .chain((requestParams) => requestT(requestParams))

module.exports.request = (serviceConfig, requestOptions) => R.liftN(3, transformResults)(
  makeRequest(serviceConfig, requestOptions),
  makeRequest(serviceConfig, requestOptions),
  makeRequest(serviceConfig, requestOptions)
)

// OR
// return Task.of((r0) => (r1) => (r2) => transformResults([r0, r1, r2]))
//   .ap(makeRequest(serviceConfig, requestOptions)) ....

// for testing
module.exports.internals = { prepareParams, prepareRequestParams }
