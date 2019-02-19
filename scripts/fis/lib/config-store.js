const path = require('path')
const fs = require('fs')
const STORE_LOCATION = path.join(process.cwd(), 'src/_config/')
const _ = global.fis.util
const config = require('./config.js')

const {codeStyle} = config

// lodash.map is overwrited by fis
function map(collection, iteratee) {
  return _.reduce(
    collection,
    function(acc, current, key, collection) {
      return acc.concat([iteratee.call(collection, current, key, collection)])
    },
    []
  )
}

function prettyJSONStringify(data) {
  return JSON.stringify(data, null, 2)
}

function addFinalNewLine(parser) {
  return function addFinalNewLine(...args) {
    return (
      parser.apply(this, args) +
      (codeStyle.insertFinalNewline ? codeStyle.endOfLine : '')
    )
  }
}

function jsParser(data) {
  const semi = codeStyle.js.semi ? ';' : ''
  return `let config = ${prettyJSONStringify(data)}${semi}`
}

function increseIndent(str, level) {
  level = level || 1
  const indentStr = codeStyle.indent.repeat(level)
  return str
    .split('\n')
    .map(function(s, line) {
      return line && s ? indentStr + s : s
    })
    .join('\n')
}

const {toString} = Object.prototype

function type(x) {
  return toString
    .call(x)
    .slice(8, -1)
    .toLowerCase()
}

const reColor = (function() {
  function getFunctionalStringRe(func, args) {
    return `${func}\\(${args
      .map(function(arg) {
        return `\\s*${arg}\\s*`
      })
      .join(',')}\\)`
  }

  // let keywords = 'black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple|transparent|currentColor'
  const hex = '#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})'
  const rgb = getFunctionalStringRe('rgb', ['\\d+', '\\d+', '\\d+'])
  const rgba = getFunctionalStringRe('rgba', [
    '\\d+',
    '\\d+',
    '\\d+',
    '[.\\d]+',
  ])
  const hsl = getFunctionalStringRe('hsl', ['\\d+', '[\\d]+%', '[.\\d]+%'])
  const hsla = getFunctionalStringRe('hsla', [
    '\\d+',
    '[.\\d]+%',
    '[.\\d]+%',
    '[.\\d]+',
  ])

  return new RegExp(
    `^(?:${[
      // keywords,
      hex,
      rgb,
      rgba,
      hsl,
      hsla,
    ].join('|')})$`,
    'i'
  )
})()

function cssPreprossorParser(lang) {
  const VAR_PREFIX = {
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

  const valueParser = {
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

        return ['(', `${values.join(`,${codeStyle.endOfLine}`)},`, ')'].join(
          '\n'
        )
      }

      function scssArrayToMap(arr, indent) {
        const values = arr.map(function(value) {
          return `${codeStyle.indent + scssValue(value, indent + 1)}`
        })
        return toMapString(values)
      }

      function scssObjectToMap(obj, indent) {
        const values = Object.keys(obj).map(function(key) {
          return `${codeStyle.indent +
            quoteKey(key)}: ${scssValue(obj[key], indent + 1)}`
        })
        return toMapString(values)
      }

      return scssValue
    })(),
  }

  const prefix = VAR_PREFIX[lang]
  const parser = valueParser[lang]

  return function(data) {
    return `$config: ${parser(data)};`
  }
}

function pugParser(data) {
  return `-\n${codeStyle.indent}config = ${JSON.stringify(data)};`
}

const parsers = {
  json: prettyJSONStringify,
  js: jsParser,
  scss: cssPreprossorParser('scss'),
  pug: pugParser,
}

function store(config) {
  Object.keys(parsers).forEach(function(lang) {
    const file = path.join(STORE_LOCATION, `_config.${lang}`)
    let parser = parsers[lang] || JSON.stringify
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
  package: config.package,
})
module.exports = store
