/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {_, createScript} = require('./common.js')

const loader = require('./loader.js')

function loadScripts(scripts) {
  scripts = Array.isArray(scripts) ? scripts : [scripts]

  return _.uniq(scripts || [])
    .filter(Boolean)
    .map(function(mod) {
      return loader[mod] ? loader[mod]() : createScript(mod)
    })
    .filter(Boolean)
    .join('\n')
}

module.exports = loadScripts
