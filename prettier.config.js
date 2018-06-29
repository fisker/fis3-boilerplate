/* eslint-env node */

'use strict'

module.exports = {
  singleQuote: true,
  bracketSpacing: false,

  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babylon',
        semi: false,
        singleQuote: true,
        bracketSpacing: false
      }
    },
    {
      files: '*.{css,scss}',
      options: {
        parser: 'css',
        singleQuote: false
      }
    },
    {
      files: '*.html',
      options: {
        parser: 'parse5'
      }
    }
  ]
}
