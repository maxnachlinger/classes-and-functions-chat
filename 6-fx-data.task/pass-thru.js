const deepCopy = require('deep-copy')

module.exports = (fn) => (data) => {
  fn(deepCopy(data))
  return data
}
