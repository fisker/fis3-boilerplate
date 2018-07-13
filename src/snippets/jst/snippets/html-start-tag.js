/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {project} = require('../../../../scripts/fis/lib/config.js')

function renderHTMLTag(attrs) {
  attrs.class = attrs.class.filter(Boolean).join(' ')
  const attrStr = Object.keys(attrs).sort().map(function(attr) {
    let value = attrs[attr]
    if (value) {
      return attr + '="' + value + '"'
    }
  }).filter(Boolean).join(' ')
  return `<html${attrStr ? ' ' + attrStr : ''}>`
}

const commonAttrs = {
  lang: project.lang
}

function htmlStartTag(attrs) {
  attrs = attrs || {}
  if (typeof attrs === 'string' || Array.isArray(attrs)) {
    attrs = {
      class: attrs
    }
  }

  attrs.class = attrs.class || []

  if (!Array.isArray(attrs.class)) {
    attrs.class = attrs.class.split(' ')
  }

  attrs = {...commonAttrs, ...attrs}

  var html = ''
  if (project.device != 'mobile' && project.legacyIe < 9) {
    if (project.legacyIe < 7) {
      let classNames = 'lt-ie9 lt-ie8 lt-ie7 ie6'.split(' ')
      html += `<!--[if lt IE 7]>${renderHTMLTag({...attrs, class: [...attrs.class, ...classNames]})}<![endif]-->`
    }
    if (project.legacyIe < 8) {
      let classNames = 'lt-ie9 lt-ie8 ie7'.split(' ')
      html += `<!--[if IE 7]>${renderHTMLTag({...attrs, class: [...attrs.class, ...classNames]})}<![endif]-->`
    }
    if (project.legacyIe < 9) {
      let classNames = 'lt-ie9 ie8'.split(' ')
      html += `<!--[if IE 8]>${renderHTMLTag({...attrs, class: [...attrs.class, ...classNames]})}<![endif]-->`
    }

    html += `<!--[if gte IE 9]><!-->${renderHTMLTag(attrs)}<!--<![endif]-->`
  } else {
    html += renderHTMLTag(attrs)
  }

  return html
}

module.exports = htmlStartTag
