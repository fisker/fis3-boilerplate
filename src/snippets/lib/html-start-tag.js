/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {
  _,
  project,
  conditionHTML,
} = require('./common.js')

const commonAttrs = {
  lang: project.lang
}

function renderHTMLTag(attrs, version) {
  let classNames = attrs.class.slice()

  if (version) {
    for (let ver = 9; ver > version; ver--) {
      classNames.push(`lt-ie${ver}`)
    }
    classNames.push(`ie${version}`)
  }

  classNames = classNames.filter(Boolean)

  const attrStr = Object.keys(attrs)
    .sort()
    .map(function(attr) {
      let value = attr === 'class' ? classNames.join(' ') : attrs[attr]
      if (value) {
        return attr + '="' + _.escape(value) + '"'
      }
    })
    .filter(Boolean)
    .join(' ')

  const html = `<html${attrStr ? ' ' + attrStr : ''}>`

  return conditionHTML(html, version)
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

  var html = []

  if (project.device != 'mobile' && project.legacyIe < 9) {
    if (project.legacyIe < 7) {
      html.push(renderHTMLTag(attrs, 6))
    }
    if (project.legacyIe < 8) {
      html.push(renderHTMLTag(attrs, 7))
    }
    if (project.legacyIe < 9) {
      html.push(renderHTMLTag(attrs, 8))
    }

    html.push(conditionHTML(renderHTMLTag(attrs), '>=9'))
  } else {
    html.push(renderHTMLTag(attrs))
  }

  return html.join('\n')
}

module.exports = htmlStartTag
