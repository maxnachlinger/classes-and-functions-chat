'use strict';
const _ = require('lodash');
const joi = require('joi');
const Task = require('data.task');
const futurize = require('futurize').futurize(Task);
const run = require('../run');
const requestThings = require('./request-things');
const passThru = require('./pass-thru');

const validate = futurize(joi.validate);

const serviceConfig = {
  url: 'http://localhost:9000',
  accessKey: '1234567890'
};

const responseSchema = joi.array().items(joi.object().keys({
  id: joi.number().integer().required(),
  name: joi.string().required(),
  type: joi.string().required()
})).required();

const request = _.partial(requestThings.request, serviceConfig);

const task = request({ type: 'cool', limit: 20 })
  .map(passThru((result) => console.log(['info'], `Received ${result.length} items`)))
  .chain((result) => validate(result, responseSchema));

run(
  () => new Promise((resolve, reject) => task.fork(reject, resolve))
);
