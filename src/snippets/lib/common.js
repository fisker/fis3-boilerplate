/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {project, env, build} = require('../../../scripts/fis/lib/config.js')
const {lodash} = global.fis.require('parser', 'lodash-template')
const _ = lodash

function createScript(src) {
  return `<script src="${_.escape(src)}"></script>`
}

function createLink(src) {
  return `<link href="${_.escape(src)}" rel="stylesheet">`
}

const conditionHTML = (CONDITION_OP => {
  return function conditionHTML(html, condition = '', length = 80) {
    condition = String(condition).trim()

    let conditionStart = ''
    let conditionEnd = ''

    let match = condition.match(/([<>=]{0,2})\s*(\d)/)

    if (match) {
      let op = CONDITION_OP[match[1]]
      let version = Number(match[2])
      // TODO: remove space after prettier fix bug
      // https://github.com/prettier/prettier/issues/5421
      conditionStart =
        '<!--[if ' + (op ? op + ' ' : '') + 'IE ' + version + ']>'
      conditionEnd = '<![endif]-->'

      if (version >= 9 && op !== 'lt') {
        conditionStart += '<!-->'
        conditionEnd = '<!--' + conditionEnd
      }
    }

    let arr = [conditionStart, html, conditionEnd].filter(Boolean)

    let totalLength = arr.reduce((acc, current) => acc + current.length, 0)

    html = arr.join(totalLength > length ? '\n' : '')

    return html
  }
})({
  '<': 'lt',
  '<=': 'lte',
  '>=': 'gte',
  '>': 'gt'
})

module.exports = {
  project,
  env,
  build,
  lodash,
  createScript,
  createLink,
  conditionHTML,
  _
}
