'use strict'

const joi = require('joi')
const Promise = require('bluebird')

const validateP = Promise.promisify(joi.validate, { context: joi })

const schema = {
  responseSchema: joi.object().required(),
  thingRequest: joi.object().required()
}

class ValidatedThingRequest {
  constructor (responseSchema, thingRequest) {
    joi.assert({ responseSchema, thingRequest }, schema, 'Invalid parameters')
    this._responseSchema = responseSchema
    this._thingRequest = thingRequest
  }

  request (requestOptions) {
    return this._thingRequest.request(requestOptions)
      .then((result) => validateP(result, this._responseSchema))
  }
}
module.exports = ValidatedThingRequest
