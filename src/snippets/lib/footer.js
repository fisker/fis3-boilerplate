const scripts = require('./scripts.js')

function footer(config = {}) {
  let html = []

  html = [...html, scripts(config.scripts)]

  return html.join('\n')
}

module.exports = footer
