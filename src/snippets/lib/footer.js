/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {_, project, env} = require('./common.js')

const scripts = require('./scripts.js')

function footer(config = {}) {
  let html = []

  html = html.concat(scripts(config.scripts || []))

  return html.join('\n')
}

module.exports = footer
