'use strict'
const joi = require('joi')
const Task = require('data.task')
const futurize = require('futurize').futurize(Task)
const validateT = futurize(joi.validate)

module.exports = (schema) => (result) => validateT(result, schema)
