'use strict'
const urlLib = require('url')
const http = require('http')
const _ = require('lodash')
const Task = require('data.task')
const pino = require('pino')()

const getThings = (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})

  const url = urlLib.parse(req.url, true)
  const type = _.get(url, 'query.thing-type', 'default-type')
  const limit = parseInt(_.get(url, 'query.limit', '10'), 10)

  const things = Array.from(new Array(limit), (x, i) => ({id: i, name: `Thing ${i}`, type}))
  res.end(JSON.stringify(things))
}

const notFound = (req, res) => {
  res.writeHead(404, {'Content-Type': 'application/json'})
  res.end()
}

const routes = {
  '/thing': getThings
}

const onRequest = (req, res) => {
  const pathname = urlLib.parse(req.url).pathname
  const handler = routes[pathname] || notFound
  return handler(req, res)
}

const start = (port) => new Task((rej, res) => {
  const server = http.createServer(onRequest)
  return server.listen(port || 9000, () => res(server))
})

const displayResults = (tag) => (results) => {
  results = results || []
  pino.info({tag, amtResults: results.length, results})
}

module.exports = (tag) => (request) => {
  const display = displayResults(tag)

  // is there a better way to tell if a passed object is a Promise?
  const localRequest = request.then ? new Task((rej, res) => request.then(res).catch(rej)) : request

  return start()
    .chain((server) => {
      const stop = new Task((rej, res) => server.close(res))
      return localRequest.chain((results) => stop
        .map(() => results)
      )
    })
    .fork((err) => {
      pino.error(err.stack || err)
      process.exit(1)
    }, (results) => {
      display(results)
      process.exit(0)
    })
}
