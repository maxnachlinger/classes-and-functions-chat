'use strict'
const joi = require('joi')
const Promise = require('bluebird')

const validateP = Promise.promisify(joi.validate, {context: joi})

module.exports = (schema) => (result) => validateP(result, schema)
