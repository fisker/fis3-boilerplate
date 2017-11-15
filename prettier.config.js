module.exports = {
  semi: false,
  singleQuote: true,
  bracketSpacing: false,

  overrides: [
    {
      files: '{bs-config.js,.stylelintrc.js,fis-conf.js,prettier.config.js}',
      options: {
        trailingComma: 'all'
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
