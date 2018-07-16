/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {
  _,
} = require('./common.js')

const loader = {}

function createLink(src) {
  return `<link href="${_.escape(src)}" rel="stylesheet">`
}

function loadStyles(styles) {
  styles = Array.isArray(styles) ? styles : [styles]

  return _.uniq(styles || []).filter(Boolean).map(function(mod) {
    return loader[mod] ? loader[mod]() : createLink(mod)
  }).join('\n')
}

module.exports = loadStyles
