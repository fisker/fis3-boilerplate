/* eslint strict: 0 */

var _ = global.fis.util
var INSERT_FINAL_NEWLINE = true
var EOL = '\n'
var INDENT = '  '
var CHARSET = 'utf-8'
var fs = require('fs')
var path = require('path')
var mkdirp = _.mkdir

var parsers = {
  json: JSON.stringify,
  css: addFinalNewLine(jsonToCss),
  scss: addFinalNewLine(jsonToScss),
  less: addFinalNewLine(jsonToLess),
  pug: addFinalNewLine(function(config) {
    return '-\n' + INDENT + 'env = ' + JSON.stringify(config) + ';'
  }),
  js: addFinalNewLine(function(config) {
    return 'var env = ' + JSON.stringify(config)
  })
}

// lodash.map is overwrited by fis
function lodashMap(collection, iteratee) {
  return _.reduce(collection, function(acc, current, key, collection) {
    return acc.concat([iteratee.call(collection, current, key, collection)])
  }, [])
}

function addFinalNewLine(parser) {
  return function() {
    return parser.apply(this, arguments) + (INSERT_FINAL_NEWLINE ? EOL : '')
  }
}

function jsonToCss(obj) {
  var css = lodashMap(obj, function(value, key) {
    var cssKey = '--env-' + _.kebabCase(key)
    return INDENT + cssKey + ': ' + value + ';'
  })

  css.unshift(':root {')
  css.push('}')

  return css.join(EOL)
}

function jsonToScss(obj) {
  return lodashMap(obj, function(value, key) {
    var lessKey = '$env-' + _.kebabCase(key)
    return lessKey + ': ' + value + ';'
  }).join(EOL)
}

function jsonToLess(obj) {
  return lodashMap(obj, function(value, key) {
    var lessKey = '@env-' + _.kebabCase(key)
    return lessKey + ': ' + value + ';'
  }).join(EOL)
}

function cacheConfig(env, config) {
  var cacheEnv = {
    device: config.DEVICE,
    legacyIe: config.LEGACY_IE,
    useRem: config.USE_REM,
    brandColor: config.BRAND_COLOR || null,
    debug: !env.IS_PRODUCTION
  }
  if (!env.IS_PRODUCTION) {
    cacheEnv.computerName = env.COMPUTER_NAME
    cacheEnv.userName = env.USER_NAME
  }
  var changed = true
  var envFolder = path.join(process.cwd(), env.SOURCE_FOLDER, '_env')

  try {
    var oldConfig = JSON.parse(
      fs.readFileSync(path.join(envFolder, '_env.json'), CHARSET)
    )
    changed = !oldConfig || JSON.stringify(oldConfig) !== JSON.stringify(cacheEnv)
  } catch (err) {}

  _.forEach(config.ENV_LANG, function(lang) {
    var configFile = path.join(envFolder, '_env.' + lang)
    var parser = parsers[lang] || JSON.stringify

    if (changed || !fs.existsSync(configFile)) {
      try {
        mkdirp(path.dirname(configFile))
        fs.writeFileSync(configFile, parser(cacheEnv), CHARSET)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    }
  })
}

module.exports.cache = cacheConfig
