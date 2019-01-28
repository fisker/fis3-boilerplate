var editorConfig = {
  charset: 'utf-8',
  endOfLine: '\n',
  indent: '  ',
  trimTrailingWhitespace: true,
  insertFinalNewline: true,
}

var codeStyleForLang = {
  js: {
    quote: '\'',
    semi: false,
  },
  css: {
    quote: '"',
    declarationBlockSemicolonSpaceBefore: false,
    declarationBlockSemicolonSpaceAfter: true,
  },
}


var cache = {}
function codeStyleGetter(lang) {
  lang = lang || '_'
  var codeStyle = cache[lang]
  if (!codeStyle) {
    codeStyle = cache[lang] = Object.assign({}, codeStyleForLang[lang], editorConfig)
  }
  return codeStyle
}

var hasOwn = Object.prototype.hasOwnProperty

for (var key in editorConfig) {
  if (hasOwn.call(editorConfig, key)) {
    Object.defineProperty(codeStyleGetter, key, {
      value: editorConfig[key]
    })
  }
}

for (var lang in codeStyleForLang) {
  if (hasOwn.call(codeStyleForLang, lang)) {
    Object.defineProperty(codeStyleGetter, lang, {
      value: codeStyleGetter(lang)
    })
  }
}

module.exports = codeStyleGetter
