'use strict';
const joi = require('joi');
const Promise = require('bluebird');
const passThru = require('./pass-thru');

const validateP = Promise.promisify(joi.validate, { context: joi });

module.exports = (schema) => (promise) => {
  return promise
    .then(passThru((result) => console.log(['info'], `Received ${result.length} items`)))
    .then((result) => validateP(result, schema));
};
