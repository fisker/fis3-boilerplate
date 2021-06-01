const editorConfig = {
  charset: 'utf-8',
  endOfLine: '\n',
  indent: '  ',
  trimTrailingWhitespace: true,
  insertFinalNewline: true,
}

const codeStyleForLang = {
  js: {
    quote: "'",
    semi: false,
  },
  css: {
    quote: '"',
    declarationBlockSemicolonSpaceBefore: false,
    declarationBlockSemicolonSpaceAfter: true,
  },
}

const cache = {}
function codeStyleGetter(lang) {
  lang = lang || '_'
  let codeStyle = cache[lang]
  if (!codeStyle) {
    codeStyle = {...codeStyleForLang[lang], ...editorConfig}

    cache[lang] = codeStyle
  }
  return codeStyle
}

const hasOwn = Object.prototype.hasOwnProperty

for (const key in editorConfig) {
  if (hasOwn.call(editorConfig, key)) {
    Object.defineProperty(codeStyleGetter, key, {
      value: editorConfig[key],
    })
  }
}

for (const lang in codeStyleForLang) {
  if (hasOwn.call(codeStyleForLang, lang)) {
    Object.defineProperty(codeStyleGetter, lang, {
      value: codeStyleGetter(lang),
    })
  }
}

module.exports = codeStyleGetter
