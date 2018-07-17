/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {_, project, env} = require('./common.js')

const scripts = require('./scripts.js')

function header(config = {}) {
  let html = []

  return html.join('\n')
}

module.exports = header
