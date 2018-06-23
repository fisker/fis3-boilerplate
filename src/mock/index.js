/* eslint-env node, es6 */
/* eslint no-unused-vars:0 */

'use strict'

module.exports = function(req, res, next) {
  res.write(`hello world! \n\n- from \`${__filename}\``)
  res.end()
}
