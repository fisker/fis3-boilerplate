module.exports = {
  semi: false,
  singleQuote: true,
  bracketSpacing: false,

  overrides: [
    {
      files: '*.{css,scss}',
      options: {
        parser: 'css',
        singleQuote: false
      }
    }
  ]
}
