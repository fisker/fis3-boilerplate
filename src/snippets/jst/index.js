/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */
/* globals obj: true */

'use strict'

module.exports = {
  htmlStartTag: require('./lib/html-start-tag.js'),
  htmlEndTag: require('./lib/html-end-tag.js'),
  head: require('./lib/head.js'),
  header: require('./lib/header.js'),
  footer: require('./lib/footer.js'),
  scripts: require('./lib/scripts.js'),
  styles: require('./lib/styles.js'),
}
