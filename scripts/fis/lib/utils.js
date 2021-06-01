const {fis} = global
const _ = fis.util
const pluginConfig = require('./plugin-config.js')
const pluginTypes = require('./plugin-types.js')

const PLUGIN_PROP = '__plugin'

const fileExtensions = {}

function toArray(s) {
  return s.split ? s.split(',') : [...s]
}

function getPlugin(pluginNames) {
  const plugins = []

  if (pluginNames[PLUGIN_PROP]) {
    return pluginNames
  }
  if (!pluginNames) {
    return null
  }

  for (const pluginName of toArray(pluginNames)) {
    let plugin
    let shortPluginName

    if (!pluginName) {
      continue
    }
    if (pluginName[PLUGIN_PROP]) {
      plugin = pluginName
    } else {
      shortPluginName = parsePlugin(pluginName).short
      plugin = fis.plugin(shortPluginName, getPluginOptions(pluginName))
    }
    plugins.push(plugin)
  }

  return plugins.length === 1 ? plugins[0] : plugins
}

function pluginToProperties(pluginNames) {
  const properties = {}
  for (const pluginName of toArray(pluginNames)) {
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
  }
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

let htmlLikeExtension = ['html']

function setHtmlLikeExtension(array) {
  htmlLikeExtension = [
    ...htmlLikeExtension,
    ...(Array.isArray(array) ? array : [{}]),
  ]
}

function getExtensionsReg(extension, inline) {
  let extensions = []
  let prefix = ''

  if (typeof extension === 'string' && fileExtensions[extension]) {
    extensions = toArray(fileExtensions[extension])
    extensions.unshift(extension)
  } else {
    extensions = toArray(extension)
  }
  extensions =
    extensions.length === 1 ? extensions : `{${extensions.join(',')}}`
  if (inline === true) {
    prefix = `*.{${htmlLikeExtension.join(',')}}:`
  } else if (inline === false) {
    prefix = '*.'
  } else {
    prefix = `{*.{${htmlLikeExtension.join(',')}}:,*.}`
  }
  return prefix + extensions
}

module.exports = {
  fileExts: fileExtensions,
  toArray,
  getPlugin,
  pluginToProperties,
  getPluginOptions,
  parsePlugin,
  getExtsReg: getExtensionsReg,
  setHtmlLikeExt: setHtmlLikeExtension,
}
