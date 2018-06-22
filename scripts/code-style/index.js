/* eslint comma-dangle: 0 */
'use strict'

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

for (var key in editorConfig) {
  if (editorConfig.hasOwnProperty(key)) {
    Object.defineProperty(codeStyleGetter, key, {
      value: editorConfig[key]
    })
  }
}

for (var lang in codeStyleForLang) {
  if (codeStyleForLang.hasOwnProperty(lang)) {
    Object.defineProperty(codeStyleGetter, lang, {
      value: codeStyleGetter(lang)
    })
  }
}

module.exports = codeStyleGetter
