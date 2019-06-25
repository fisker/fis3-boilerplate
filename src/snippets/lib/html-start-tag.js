const {_, project, conditionHTML} = require('./common.js')

const commonAttributes = {
  lang: project.lang,
}

function renderHTMLTag(attributes, version) {
  let classNames = attributes.class.slice()

  if (version) {
    for (let ver = 9; ver > version; ver -= 1) {
      classNames.push(`lt-ie${ver}`)
    }
    classNames.push(`ie${version}`)
  }

  classNames = classNames.filter(Boolean)

  const attributeString = Object.keys(attributes)
    .sort()
    .map(function(attribute) {
      const value =
        attribute === 'class' ? classNames.join(' ') : attributes[attribute]
      if (value) {
        return `${attribute}="${_.escape(value)}"`
      }

      return ''
    })
    .filter(Boolean)
    .join(' ')

  const html = `<html${attributeString ? ` ${attributeString}` : ''}>`

  return conditionHTML(html, version)
}

function htmlStartTag(attributes) {
  attributes = attributes || {}
  if (typeof attributes === 'string' || Array.isArray(attributes)) {
    attributes = {
      class: attributes,
    }
  }

  attributes.class = attributes.class || []

  if (!Array.isArray(attributes.class)) {
    attributes.class = attributes.class.split(' ')
  }

  attributes = {...commonAttributes, ...attributes}

  const html = []

  if (project.device !== 'mobile' && project.legacyIe < 9) {
    if (project.legacyIe < 7) {
      html.push(renderHTMLTag(attributes, 6))
    }
    if (project.legacyIe < 8) {
      html.push(renderHTMLTag(attributes, 7))
    }
    if (project.legacyIe < 9) {
      html.push(renderHTMLTag(attributes, 8))
    }

    html.push(conditionHTML(renderHTMLTag(attributes), '>=9'))
  } else {
    html.push(renderHTMLTag(attributes))
  }

  return html.join('\n')
}

module.exports = htmlStartTag
