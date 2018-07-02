/* eslint-env node */

'use strict'

var path = require('path')
var fs = require('fs')
var STORE_LOCATION = path.join(process.cwd(), 'src/_config/')
var _ = global.fis.util
var config = require('./config.js')

var codeStyle = config.codeStyle

// lodash.map is overwrited by fis
function map(collection, iteratee) {
  return _.reduce(
    collection,
    function(acc, current, key, collection) {
      return acc.concat([iteratee.call(collection, current, key, collection)])
    }, []
  )
}

function prettyJSONStringify(data) {
  return JSON.stringify(data, null, 2)
}

function addFinalNewLine(parser) {
  return function addFinalNewLine() {
    return parser.apply(this, arguments) + (codeStyle.insertFinalNewline ? codeStyle.endOfLine : '')
  }
}

function jsParser(data) {
  var semi = codeStyle.js.semi ? ';' : ''
  return 'var config = ' + prettyJSONStringify(data) + semi
}

function increseIndent(str, level) {
  level = level || 1
  var indentStr = codeStyle.indent.repeat(level)
  return str.split('\n').map(function(s, line) {
    return line && s ? indentStr + s : s
  }).join('\n')
}

var toString = Object.prototype.toString
function type(x) {
  return toString.call(x).slice(8, -1).toLowerCase()
}

var reColor = (function() {
  var hex = [3,4,6,8].map(function(len) {
    return '[0-9a-f]{' + len + '}'
  }).join('|')

  function getFunctionalStringRe(func, args) {
    return func + '\\(' + args.map(function(arg) {
      return '\\s*' + arg + '\\s*'
    }).join(',') + '\\)'
  }

  var rgb = getFunctionalStringRe('rgb', ['\\d+', '\\d+', '\\d+'])
  var rgba = getFunctionalStringRe('rgba', ['\\d+', '\\d+', '\\d+', '[.\\d]+'])
  var hsl = getFunctionalStringRe('hls', ['\\d+', '[.\\d]+%', '[.\\d]+%'])
  var hsla = getFunctionalStringRe('hlsa', ['\\d+', '[.\\d]+%', '[.\\d]+%', '[.\\d]+'])

  var str = '^(?:' + [
    '(?:#(?:' + hex + '))',
    '(?:' + rgb + ')',
    '(?:' + rgba + ')',
    '(?:' + hsl + ')',
    '(?:' + hsla + ')',
  ].join('|') + ')$'

  return new RegExp(str, 'i')
})()

function cssPreprossorParser(lang) {
  var VAR_PREFIX = {
    scss: '$config-',
    less: '@config-',
  }
  function isColor(value) {
    return reColor.test(String(value))
  }

  function quoteKey(key) {
    key = String(key)
    if (/[.-]/.test(key)) {
      return JSON.stringify(key)
    }

    return key
  }

  var valueParser = {
    scss: (function() {
      function scssValue(value, indent) {
        indent = indent || 0
        switch (type(value)) {
          case 'map':
          case 'set':
            return scssValue(Array.from(value), indent)
          case 'undefined':
            return 'null'
          case 'object':
            return increseIndent(scssObjectToMap(value), indent)
          case 'array':
            return increseIndent(scssArrayToMap(value), indent)
          case 'date':
            return JSON.stringify(value)
          case 'string':
            return isColor(value) ? String(value) : JSON.stringify(value)
          case 'symbol':
            return JSON.stringify(String(value))
          default:
            return String(value)
        }
      }

      function toMapString(values) {
        if (!values.length) {
          return '()'
        }

        return [
          '(',
          values.join(',' + codeStyle.endOfLine) + ',',
          ')'
        ].join('\n')
      }

      function scssArrayToMap(arr, indent) {
        var values = arr.map(function(value) {
          return codeStyle.indent + scssValue(value, indent + 1) + ''
        })
        return toMapString(values)
      }

      function scssObjectToMap(obj, indent) {
        var values = Object.keys(obj).map(function(key) {
          return codeStyle.indent + quoteKey(key) + ': ' + scssValue(obj[key], indent + 1)
        })
        return toMapString(values)
      }

      return scssValue
    })()
  }

  var prefix = VAR_PREFIX[lang]
  var parser = valueParser[lang]

  return function(data) {
    return '$config: ' + parser(data) + ';'
  }
}

function pugParser(data) {
  return '-\n' + codeStyle.indent + 'config = ' + JSON.stringify(data) + ';'
}

var parsers = {
  json: prettyJSONStringify,
  js: jsParser,
  scss: cssPreprossorParser('scss'),
  pug: pugParser
}

function store(config) {
  Object.keys(parsers).forEach(function(lang) {
    var file = path.join(STORE_LOCATION, '_config.' + lang)
    var parser = parsers[lang] || JSON.stringify
    if (!/json$/.test(lang)) {
      parser = addFinalNewLine(parser)
    }

    // try {
      fs.writeFileSync(file, parser(config), codeStyle.charset)
    // } catch (err) {}
  })
}

_.mkdir(STORE_LOCATION)

store({
  env: config.env,
  project: config.project,
  package: config.package
})
module.exports = store
