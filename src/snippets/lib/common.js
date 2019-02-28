const {project, env, build} = require('../../../scripts/fis/lib/config.js')
const {lodash = {}} = (global.fis && global.fis.require('parser', 'lodash-template')) || {}
const _ = lodash

function createScript(src) {
  return `<script src="${_.escape(src)}"></script>`
}

function createLink(src) {
  return `<link href="${_.escape(src)}" rel="stylesheet">`
}

const conditionHTML = (CONDITION_OP =>
  function conditionHTML(html, condition = '', length = 80) {
    condition = String(condition).trim()

    let conditionStart = ''
    let conditionEnd = ''

    const match = condition.match(/([<>=]{0,2})\s*(\d)/)

    if (match) {
      const op = CONDITION_OP[match[1]]
      const version = Number(match[2])
      // TODO: remove space after prettier fix bug
      // https://github.com/prettier/prettier/issues/5421
      conditionStart = `<!--[if ${op ? `${op} ` : ''}IE ${version}]>`
      conditionEnd = '<![endif]-->'

      if (version >= 9 && op !== 'lt') {
        conditionStart += '<!-->'
        conditionEnd = `<!--${conditionEnd}`
      }
    }

    const arr = [conditionStart, html, conditionEnd].filter(Boolean)

    const totalLength = arr.reduce((acc, current) => acc + current.length, 0)

    html = arr.join(totalLength > length ? '\n' : '')

    return html
  })({
  '<': 'lt',
  '<=': 'lte',
  '>=': 'gte',
  '>': 'gt'
})

function parsePackage(file) {
  if (file[0] === '.' || file[0] === '/') {
    return {
      type: 'file',
      file,
    }
  }

  const pieces = file.split('/')
  const nameLength = file[0] === '@' ? 2 : 1

  return {
    name: pieces.slice(0, nameLength).join('/'),
    file: pieces.slice(nameLength).join('/')
  }
}

module.exports = {
  project,
  env,
  build,
  lodash,
  createScript,
  createLink,
  conditionHTML,
  parsePackage,
  _
}
