const {fis} = global
const config = require('./lib/config.js')
const utils = require('./lib/utils.js')

const preProcessors = [
  {
    ext: 'less',
    type: 'css',
    // lint: CONFIG.LINT.CSS ? 'fis3-lint-stylelint' : null,
    parser: 'fis-parser-less-2.x',
  },
  {
    ext: ['sass', 'scss'],
    type: 'css',
    // lint: CONFIG.LINT.CSS ? 'fis3-lint-stylelint' : null,
    parser: 'fis3-parser-dart-sass',
  },
  {
    ext: 'styl',
    type: 'css',
    parser: 'fis-parser-stylus2',
  },
  {
    ext: 'coffee',
    type: 'js',
    parser: 'fis-parser-coffee-script',
  },
  {
    ext: ['es', 'es6', 'jsx'],
    type: 'js',
    parser: 'fis-parser-babel-5.x',
  },
  {
    ext: ['ts', 'tsx'],
    type: 'js',
    parser: 'fis3-parser-typescript',
  },
  {
    ext: 'pug',
    type: 'html',
    parser: 'fis3-parser-pug',
  },
  {
    ext: 'ejs',
    type: 'html',
    parser: 'fis3-parser-ejs',
  },
  {
    ext: 'jst',
    type: 'html',
    parser: 'fis3-parser-lodash-template',
  },
]

utils.setHtmlLikeExt(
  preProcessors
    .filter((config) => config.type === 'html')
    .map((config) => config.ext)
)

const standardProcessors = [
  {
    type: 'css',
    lint: config.build.lint.css ? 'fis3-lint-stylelint' : null,
    preprocessor:
      config.project.legacyIe <= 8 ? 'fis3-preprocessor-cssgrace' : null,
    optimizer: config.build.optimize.css ? 'fis3-optimizer-cleancss' : null,
    postprocessor: [
      'fis3-postprocessor-postcss-with-rc',
      ...(config.build.optimize.css ? [] : ['fis3-postprocessor-prettier']),
    ],
    useSprite: true,
  },
  {
    type: 'js',
    lint: config.build.lint.js ? 'fis3-lint-eslint-noisy' : null,
    optimizer: config.build.optimize.js ? 'fis3-optimizer-terser' : null,
    postprocessor: config.build.optimize.js
      ? null
      : 'fis3-postprocessor-prettier',
  },
  {
    type: 'png',
    optimizer: config.build.optimize.png ? 'fis3-optimizer-imagemin' : null,
  },
  {
    type: 'jpg',
    optimizer: config.build.optimize.jpeg ? 'fis3-optimizer-imagemin' : null,
  },
  {
    type: 'gif',
    optimizer: config.build.optimize.gif ? 'fis3-optimizer-imagemin' : null,
  },
  {
    type: 'svg',
    optimizer: config.build.optimize.svg ? 'fis3-optimizer-imagemin' : null,
  },
  {
    type: 'html',
    lint: config.build.lint.html ? 'fis3-lint-htmlhint' : null,
    optimizer: config.build.optimize.html ? 'fis-optimizer-htmlmin' : null,
    postprocessor: config.build.optimize.html
      ? null
      : 'fis3-postprocessor-prettier',
  },
]

// ignore
if (config.build.ignore.global) {
  fis.set('project.ignore', config.build.ignore.global)
}

// release ignored file
for (const glob of config.build.ignore.release) {
  fis.match(glob, {
    release: `/${config.build.temp}/$0`,
    relative: '/',
  })
}
fis.match('_**.{scss,sass}', {
  release: false,
})

// hash
if (config.env.production) {
  fis.set('project.md5Length', config.build.hash.length)
  fis.set('project.md5Connector', config.build.hash.connector)
  fis.match('*', {
    useHash: true,
  })
  for (const glob of config.build.hash.except) {
    fis.match(glob, {
      useHash: false,
    })
  }
}

// relative
if (config.build.relative) {
  fis.hook('relative-legal-html')
  fis.match('*', {
    relative: config.build.relative,
  })
}

for (const data of preProcessors) {
  const extensions = utils.toArray(data.ext)
  let processor = {
    rExt: `.${data.type}`,
  }

  // plugins
  const plugins = ['parser', 'lint']

  utils.fileExts[data.type] = utils.fileExts[data.type] || []
  utils.fileExts[data.type] = [...utils.fileExts[data.type], ...extensions]
  fis.match(utils.getExtsReg(extensions), processor)

  processor = {}
  for (const pluginType of plugins) {
    if (data[pluginType]) {
      processor[pluginType] = utils.getPlugin(data[pluginType])
    }
  }

  fis.match(utils.getExtsReg(extensions), processor)
}

for (const data of standardProcessors) {
  const processor = {}

  // lint can't used on preProcessor
  // and we only lint for production
  if (data.lint) {
    fis.match(utils.getExtsReg(utils.toArray(data.type)), {
      lint: utils.getPlugin(data.lint),
    })
  }

  for (const type of ['useSprite']) {
    if (type in data) {
      processor[type] = data[type]
    }
  }

  // plugins
  for (const type of ['preprocessor', 'optimizer', 'postprocessor']) {
    if (data[type]) {
      processor[type] = utils.getPlugin(data[type])
    }
  }

  fis.match(utils.getExtsReg(data.type), processor)
}
for (const type of ['optimizer', 'lint', 'postprocessor']) {
  for (const reg of config.build.ignore[type] || []) {
    const settings = {}
    settings[type] = null
    fis.match(reg, settings)
  }
}
for (const type of ['html', 'js']) {
  const standardProcessor = standardProcessors.find(
    (processor) => processor.type === type
  )
  const config = {
    rExt: `.${type}`,
    release: '/$1',
  }
  // plugins
  for (const type of ['preprocessor', 'optimizer', 'postprocessor']) {
    config[type] = standardProcessor[type]
      ? utils.getPlugin(standardProcessor[type])
      : null
  }

  // process.exit(1)
  fis.match(`(**.${type}).{ejs,jst}`, config)
}

// snippets should not release
fis.match('/snippets/**', {
  release: `/${config.build.temp}/$0`,
  relative: '/',
  postprocessor: null,
})

// _*.html should not lint
// _*.js should not lint
fis.match('_*.{html,js}', {
  lint: null,
  // postprocessor: null,
})

// _*.html no postprocessor
fis.match('_*.html', {
  postprocessor: null,
})

// minify-inline-script
for (const re of config.build.minifyInlineScript) {
  fis.match(re, {
    release: `/${config.build.temp}/$0`,
    relative: '/',
    optimizer: utils.getPlugin('fis3-optimizer-terser'),
    postprocessor: null,
  })
}

// font/*.svg should not be compressed
// if (config.build.optimize.SVG) {
//   fis.match('{fonts,font}/*.svg', {
//     optimizer: null
//   })
// }

fis.match('::package', utils.pluginToProperties('fis-spriter-csssprites'))

// do noting to vendors
for (const preg of config.build.ignore.vendors) {
  // http://fis.baidu.com/fis3/docs/build.html#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BC%96%E8%AF%91%E6%B5%81%E7%A8%8B
  fis.match(preg, {
    lint: null,
    parser: null,
    preprocessor: null,
    standard: null,
    postprocessor: null,
    optimizer: null,
    useHash: false,
    useSprite: false,
  })
}

if (config.env.production) {
  fis.match('**', utils.pluginToProperties('fis3-deploy-local-deliver'))
  fis.match('{mock,test}/**.js', {
    release: false,
  })

  fis.match('server.conf', {
    release: false,
  })
} else {
  fis.match('**', {
    lint: null,
    optimizer: null,
    postprocessor: null,
  })
}

// store browserslist
require('../get-browserlist.js')

// store config
require('./lib/config-store.js')

// avoid warning
require('./hack/no-config-warning.js')

// fix fis3-command-release bug
require('./hack/fix-fis3-command-release.js')
