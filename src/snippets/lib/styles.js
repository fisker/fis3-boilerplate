/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {_, createLink} = require('./common.js')

const loader = require('./loader.js')

function loadStyles(styles) {
  styles = Array.isArray(styles) ? styles : [styles]

  return _.uniq(styles || [])
    .filter(Boolean)
    .map(function(mod) {
      return loader[mod] ? loader[mod]() : createLink(mod)
    })
    .filter(Boolean)
    .join('\n')
}

module.exports = loadStyles
