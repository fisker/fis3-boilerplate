/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {
  project,
} = require('./lib/common.js')

const page = {
  head: {
    styles: [
      ...project.styles,
    ],
    scripts: [
      ...project.headScripts,
    ],
  },
  header: {},
  footer: {
    scripts: [
      ...project.scripts,
    ]
  }
}

module.exports = page
