/*!
 * config file for prettier
 * project https://github.com/xwtec/dotfiles
 * primary link https://raw.githubusercontent.com/xwtec/dotfiles/master/prettier/prettier.config.js
 *
 * options https://prettier.io/docs/en/options.html
 *
 */

module.exports = require('@fisker/prettier-config').extend({
  overrides: [
    {
      files: 'src/**/*.{js,html}',
      options: {
        trailingComma: 'none',
      },
    },
    {
      files: [
        'src/**/*.eslintrc.js',
        'src/mock/**/*.js',
        'src/snippets/lib/**/*.js',
        'src/snippets/*.js',
      ],
      options: {
        trailingComma: 'es5',
      },
    },
  ],
})
