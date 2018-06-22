module.exports = {
  extends: 'eslint:recommended',
  globals: {
    __inline: true
  },
  rules: {
    // 必须严格模式
    strict: ['warn', 'safe'],

    // catch 变量
    'no-catch-shadow': 'error',

    // 禁止 undefined
    'no-undefined': 'error',

    // 禁止 eval
    'no-eval': 'error',

    // 禁止比较 null
    'no-eq-null': 'error',

    // 禁止 label
    'no-labels': 'error',

    // 禁止扩展原生对象
    'no-extend-native': 'error',

    // 禁止无用的块
    'no-lone-blocks': 'error',

    // 建议不在循环中定义函数
    'no-loop-func': 'warn',

    // 禁止多行文本
    'no-multi-str': 'error',

    // 禁止js链接
    'no-script-url': 'error',

    // 禁止自身比较
    'no-self-compare': 'error',

    // 禁止抛出无构造器的异常
    'no-throw-literal': 'error',

    'no-warning-comments': 'warn',

    // 禁止 with
    'no-with': 'error',

    // parseInt 必须带进制
    'radix': 'error',

    // iife inside
    'wrap-iife': ['error', 'inside'],

    // 禁止yoda
    'yoda': 'error',

    // 禁止 无用的 return
    'no-useless-return': 'error',

    // 禁止双引号
    'quotes': ['error', 'single'],

    // 建议省略分号
    'semi': ['warn', 'never'],

    // 不检查多余分号
    'no-extra-semi': 'off',

    // 警告未使用变量
    'no-unused-vars': 'warn',

    //
    'no-use-before-define': ['error', { variables : true, functions: false }],

    // 只允许 空的 catch 块
    'no-empty': ['error', { allowEmptyCatch: true }],

    // 逗号
    'comma-dangle': 'error'
  }
}
