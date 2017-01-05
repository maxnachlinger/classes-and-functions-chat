'use strict';
const urlLib = require('url');
const http = require('http');
const Promise = require('bluebird');
const _ = require('lodash');

const onRequest = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  const url = urlLib.parse(req.url, true);
  const type = _.get(url, 'query.thing-type', 'default-type');
  const limit = parseInt(_.get(url, 'query.limit', '10'), 10);

  const things = Array.from(new Array(limit), (x, i) => ({ id: i, name: `Thing ${i}`, type }));

  res.end(JSON.stringify(things));
};

const start = (port) => new Promise((resolve) => {
  const server = http.createServer(onRequest);
  const stopServer = () => Promise.promisify(server.close, { context: server });
  return server.listen(port || 9000, () => resolve(stopServer))
});

module.exports = (fx) => {
  let serverStopFn;

  return start()
    .then((stopFn) => {
      serverStopFn = stopFn;
      return fx();
    })
    .then((results) => {
      console.log('results:', results);
      serverStopFn();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err.stack || err);
      serverStopFn();
      process.exit(1);
    });
};
