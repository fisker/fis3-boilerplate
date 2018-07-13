/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */
/* globals obj: true */

'use strict'

module.exports = {
  htmlStartTag: require('./snippets/html-start-tag.js'),
  htmlEndTag: require('./snippets/html-end-tag.js'),
  head: require('./snippets/head.js'),
  script: require('./snippets/script.js')
}
