/* eslint-env node */

'use strict'

module.exports = {
  overrides: [
    {
      files: '*.js',
      options: {
        trailingComma: 'none',
        parser: 'babylon',
        semi: false,
        singleQuote: true,
        bracketSpacing: false
      }
    },
    {
      files: '*.css',
      options: {
        parser: 'css',
        singleQuote: false
      }
    },
    {
      files: '*.scss',
      options: {
        parser: 'scss',
        singleQuote: false
      }
    },
    {
      files: '*.less',
      options: {
        parser: 'scss',
        singleQuote: false
      }
    },
    {
      files: '*.json',
      options: {
        parser: 'json'
      }
    },
    {
      files: '*.json5',
      options: {
        parser: 'json5'
      }
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown'
      }
    },
    {
      files: '*.yaml',
      options: {
        parser: 'yaml'
      }
    },
    {
      files: '*.{html,htm}',
      options: {
        parser: 'html',
        trailingComma: 'none',
        semi: false,
        singleQuote: true,
        bracketSpacing: false,
        htmlWhitespaceSensitivity: 'ignore'
      }
    }
  ]
}
