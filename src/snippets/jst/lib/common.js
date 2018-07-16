/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {project, env, build} = require('../../../../scripts/fis/lib/config.js')
const {lodash} = global.fis.require('parser', 'lodash-template')
const _ = lodash

function createScript(src) {
  return `<script src="${_.escape(src)}"></script>`
}

module.exports = {
  project,
  env,
  build,
  lodash,
  createScript,
  _,
}
