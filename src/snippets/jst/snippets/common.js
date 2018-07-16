/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {project, env, build} = require('../../../../scripts/fis/lib/config.js')
const {lodash} = global.fis.require('parser', 'lodash-template')

module.exports = {
  project,
  env,
  build,
  lodash,
  _: lodash,
}
