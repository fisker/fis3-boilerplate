module.exports = {
  semi: false,
  singleQuote: true,
  bracketSpacing: false,

  overrides: [
    {
      files: '{bs-config,.stylelintrc,fis-conf,prettier.config}.js',
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
