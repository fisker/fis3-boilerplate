const {_, project, env: environment} = require('./common.js')

const scripts = require('./scripts.js')

function header(config = {}) {
  const html = []

  return html.join('\n')
}

module.exports = header
