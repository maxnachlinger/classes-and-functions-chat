'use strict'
const urlLib = require('url') // urlLib since 'url' is a nice var name :)
const joi = require('joi')
const Task = require('data.task')
const request = require('request')
const futurize = require('futurize').futurize(Task)
const pointfreeFantasy = require('pointfree-fantasy');

const traverse = pointfreeFantasy.traverse;
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

const transformResults = (results) => {
  return results.reduce((acc, a) => acc.concat(a.body || []), [])
}

module.exports.request = (serviceConfig, requestOptions) => prepareParams(serviceConfig, requestOptions)
  .map((options) => prepareRequestParams(options))
  .chain((requestParams) => traverse(requestT, Task.of, [requestParams, requestParams, requestParams]))
  .map((results) => transformResults(results));

// traverse = map + sequence
// [value, value, value].map(requestT) // [Task, Task, Task] - you know map :)
// .sequence(Task.of) // Task.of([result, result, result])
// sequence flips our containers around

// for testing
module.exports.internals = {prepareParams, prepareRequestParams}
