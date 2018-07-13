/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {project, env} = require('../../../../scripts/fis/lib/config.js')
const _ = global.fis.util
const script = require('./script.js')

function head(page) {
  let html = ''

  html += '<meta charset="UTF-8">'

  if (project.device != 'mobile') {
    html += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
    html += '<meta name="renderer" content="webkit">'
  }

  if (project.device != 'page') {
    html += '<meta name="mobile-web-app-capable" content="yes">'
    html += '<meta name="apple-touch-fullscreen" content="yes">'
    html += '<meta name="apple-mobile-web-app-capable" content="yes">'
  }

  html += '<meta name="google" value="notranslate">'
  html += '<meta http-equiv="Cache-Control" content="no-siteapp">'
  html += '<meta name="robots" content="index,follow">'

  if (project.brandColor) {
    html += `<meta name="theme-color" content="${env.brandColor}">`
    html += `<meta name="msapplication-navbutton-color" content="${env.brandColor}">`
  }

  if (project.device != 'desktop') {
    html += '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,shrink-to-fit=no,viewport-fit=cover">'
  } else {
    html += '<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">'
  }

  if (project.device != 'desktop') {
    html += '<meta name="format-detection" content="telephone=no,email=no,address=no,date=no">'
    html += '<meta name="msapplication-tap-highlight" content="no">'
  }

  if (project.device != 'mobile' && project.legacyIe < 9) {
    html += `<!--[if lt IE 9]>${script('/assets/vendors/html5shiv/3.7.3-pre/dist/html5shiv.min.js')}<![endif]-->`
  }

  if (project.flexibleRem) {
    html += script('/assets/scripts/component/_rem.js?__inline')
  }

  html += `<title>${_.escape(page.title)}</title>`
  html += `<meta name="keywords" content="${_.escape(page.keywords)}">`
  html += `<meta name="description" content="${_.escape(page.description)}">`

  html += (page.styles || []).map(function(style) {
    return `<link href="${_.escape(style)}" rel="stylesheet">`
  }).join('\n')

  return html
}

module.exports = head
