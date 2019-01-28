module.exports = {
  root: true,
  extends: ['@xwtec/eslint-config/legacy'],
  rules: {},
  overrides: [
    {
      files: [
        '.*.js',
        '*.config.js',
        'bs-config.js',
        'fis-conf.js',
        'scripts/*.js',
        'scripts/**/*.js',
        'src/snippets/*.js',
        'src/snippets/**/*.js',
        'src/mock/**.js',
      ],
      rules: {
        strict: 'off',
        'comma-dangle': 'off',
        'global-require': 'warn',
      },
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
      env: {
        es6: true,
      },
    },
  ],
  globals: {
    __inline: true,
  },
}
