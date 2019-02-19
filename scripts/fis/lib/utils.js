const {fis} = global
const _ = fis.util
const pluginConfig = require('./plugin-config.js')
const pluginTypes = require('./plugin-types.js')
const PLUGIN_PROP = '__plugin'

const fileExts = {}

function toArray(s) {
  return s.split ? s.split(',') : Array.from(s)
}

function getPlugin(pluginNames) {
  const plugins = []

  if (pluginNames[PLUGIN_PROP]) {
    return pluginNames
  }
  if (!pluginNames) {
    return null
  }

  _.forEach(toArray(pluginNames), function(pluginName) {
    let plugin
    let shortPluginName

    if (!pluginName) {
      return
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
  const properties = {}
  _.forEach(toArray(pluginNames), function(pluginName) {
    const {type} = parsePlugin(pluginName)
    const plugin = getPlugin(pluginName)
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
  const shortPluginName = parsePlugin(pluginName).short
  const options =
    pluginConfig[pluginName] || pluginConfig[shortPluginName] || {}
  return options
}

function parsePlugin(pluginName) {
  const reg = new RegExp(
    ['^', '(?:fis|fis3)-', `(${pluginTypes.join('|')})-`, '(.*?)', '$'].join('')
  )
  const match = pluginName.match(reg)
  return (
    match &&
    match[2] && {
      name: match[0],
      type: match[1],
      short: match[2],
    }
  )
}

let htmlLikeExt = ['html']

function setHtmlLikeExt(arr) {
  htmlLikeExt = htmlLikeExt.concat(arr || {})
}

function getExtsReg(ext, inline) {
  let exts = []
  let prefix = ''

  if (ext.split && fileExts[ext]) {
    exts = toArray(fileExts[ext])
    exts.unshift(ext)
  } else {
    exts = toArray(ext)
  }
  exts = exts.length === 1 ? exts : `{${exts.join(',')}}`
  if (inline === true) {
    prefix = `*.{${htmlLikeExt.join(',')}}:`
  } else if (inline === false) {
    prefix = '*.'
  } else {
    prefix = `{*.{${htmlLikeExt.join(',')}}:,*.}`
  }
  return prefix + exts
}

module.exports = {
  fileExts,
  toArray,
  getPlugin,
  pluginToProperties,
  getPluginOptions,
  parsePlugin,
  getExtsReg,
  setHtmlLikeExt,
}
