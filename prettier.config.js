// https://prettier.io/docs/en/options.html

module.exports = {
  trailingComma: 'es5',
  semi: false,
  singleQuote: true,
  bracketSpacing: false,
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel'
      },
    },
    {
      files: 'src/**/*.js',
      options: {
        trailingComma: 'es5',
      },
    },
    {
      files: '*.{css,less,scss}',
      options: {
        parser: 'css',
        singleQuote: false,
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.json5',
      options: {
        parser: 'json5',
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
      },
    },
    {
      files: '*.yaml',
      options: {
        parser: 'yaml',
      },
    },
    {
      files: '*.vue',
      options: {
        parser: 'vue',
      },
    },
    {
      files: '*.{html,htm}',
      options: {
        parser: 'html',
      },
    },
  ],
}
