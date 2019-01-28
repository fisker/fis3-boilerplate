/* eslint comma-dangle: 0 */
/* eslint-env node */

'use strict'

var fis = global.fis
var _ = fis.util
var pluginConfig = require('./plugin-config.js')
var pluginTypes = require('./plugin-types.js')
const PLUGIN_PROP = '__plugin'

var fileExts = {}

function toArray(s) {
  return s.split ? s.split(',') : Array.from(s)
}

function getPlugin(pluginNames) {
  var plugins = []

  if (pluginNames[PLUGIN_PROP]) {
    return pluginNames
  }
  if (!pluginNames) {
    return null
  }

  _.forEach(toArray(pluginNames), function(pluginName) {
    var plugin
    var shortPluginName

    if (!pluginName) {
      return null
    }
    if (pluginName[PLUGIN_PROP]) {
      plugin = pluginName
    } else {
      shortPluginName = parsePlugin(pluginName).short
      plugin = fis.plugin(shortPluginName, getPluginOptions(pluginName))
    }
    plugins.push(plugin)
  })

  return plugins.length === 1 ? plugins[0] : plugins
}

function pluginToProperties(pluginNames) {
  var properties = {}
  _.forEach(toArray(pluginNames), function(pluginName) {
    var type = parsePlugin(pluginName).type
    var plugin = getPlugin(pluginName)
    if (properties[type]) {
      properties[type] = properties[type].push
        ? properties[type]
        : [properties[type]]
      properties[type].push(plugin)
    } else {
      properties[type] = plugin
    }
  })
  return properties
}

function getPluginOptions(pluginName) {
  var shortPluginName = parsePlugin(pluginName).short
  var options = pluginConfig[pluginName] || pluginConfig[shortPluginName] || {}
  return options
}

function parsePlugin(pluginName) {
  var reg = new RegExp(
    [
      '^',
      '(?:fis|fis3)-',
      '(' + pluginTypes.join('|') + ')-',
      '(.*?)',
      '$',
    ].join('')
  )
  var match = pluginName.match(reg)
  return (
    match &&
    match[2] && {
      name: match[0],
      type: match[1],
      short: match[2],
    }
  )
}

var htmlLikeExt = ['html']

function setHtmlLikeExt(arr) {
  htmlLikeExt = htmlLikeExt.concat(arr || {})
}

function getExtsReg(ext, inline) {
  var exts = []
  var prefix = ''

  if (ext.split && fileExts[ext]) {
    exts = toArray(fileExts[ext])
    exts.unshift(ext)
  } else {
    exts = toArray(ext)
  }
  exts = exts.length === 1 ? exts : '{' + exts.join(',') + '}'
  if (inline === true) {
    prefix = '*.{' + htmlLikeExt.join(',') + '}:'
  } else if (inline === false) {
    prefix = '*.'
  } else {
    prefix = '{*.{' + htmlLikeExt.join(',') + '}:,*.}'
  }
  return prefix + exts
}

module.exports = {
  fileExts: fileExts,
  toArray: toArray,
  getPlugin: getPlugin,
  pluginToProperties: pluginToProperties,
  getPluginOptions: getPluginOptions,
  parsePlugin: parsePlugin,
  getExtsReg: getExtsReg,
  setHtmlLikeExt: setHtmlLikeExt,
}
