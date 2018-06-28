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
    }
  ]
}
