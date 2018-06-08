/* eslint strict: 0 */

var _ = global.fis.util
var INSERT_FINAL_NEWLINE = true
var EOL = '\n'
var INDENT = '  '
var CHARSET = 'utf-8'
var fs = require('fs')
var path = require('path')
var mkdirp = _.mkdir

var prettyStringify = function(data) {
  return JSON.stringify(data, null, 2)
}

var parsers = {
  json: prettyStringify,
  css: addFinalNewLine(jsonToCss),
  scss: addFinalNewLine(jsonToScss),
  less: addFinalNewLine(jsonToLess),
  pug: addFinalNewLine(function(config) {
    return '-\n' + INDENT + 'env = ' + JSON.stringify(config) + ';'
  }),
  js: addFinalNewLine(function(config) {
    return 'var env = ' + prettyStringify(config)
  })
}

// lodash.map is overwrited by fis
function lodashMap(collection, iteratee) {
  return _.reduce(
    collection,
    function(acc, current, key, collection) {
      return acc.concat([iteratee.call(collection, current, key, collection)])
    },
    []
  )
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

function cacheConfig(options) {
  var envData = options.data
  var folder = options.folder
  var lang = options.lang

  _.forEach(lang, function(lang) {
    var configFile = path.join(folder, '_env.' + lang)
    var parser = parsers[lang] || JSON.stringify

    try {
      mkdirp(path.dirname(configFile))
      fs.writeFileSync(configFile, parser(envData), CHARSET)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })
}

module.exports.cache = cacheConfig
