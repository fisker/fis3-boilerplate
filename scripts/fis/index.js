/* eslint comma-dangle: 0, no-console: 0 */

/*
fis-conf.js
by fisker Cheung <lionkay@gmail.com>
verion 2.0
last update 2018.06.22
*/

'use strict'

var fis = global.fis
var config = require('./lib/config.js')
var utils = require('./lib/utils.js')

var preProcessors = [
  {
    ext: 'less',
    type: 'css',
    // lint: CONFIG.LINT.CSS ? 'fis3-lint-stylelint' : null,
    parser: 'fis-parser-less-2.x'
  },
  {
    ext: ['sass', 'scss'],
    type: 'css',
    // lint: CONFIG.LINT.CSS ? 'fis3-lint-stylelint' : null,
    parser: 'fis3-parser-node-sass-latest'
  },
  {
    ext: 'styl',
    type: 'css',
    parser: 'fis-parser-stylus2'
  },
  {
    ext: 'coffee',
    type: 'js',
    parser: 'fis-parser-coffee-script'
  },
  {
    ext: ['es', 'es6', 'jsx'],
    type: 'js',
    parser: 'fis-parser-babel-5.x'
  },
  {
    ext: ['ts', 'tsx'],
    type: 'js',
    parser: 'fis3-parser-typescript'
  },
  {
    ext: 'pug',
    type: 'html',
    parser: 'fis3-parser-pug'
  },
  {
    ext: 'ejs',
    type: 'html',
    parser: 'fis3-parser-ejs'
  }
]

var standardProcessors = [
  {
    type: 'css',
    lint: config.build.lint.css ? 'fis3-lint-stylelint' : null,
    preprocessor: config.project.legacyIe <= 8 ? 'fis-preprocessor-cssgrace' : null,
    optimizer: config.build.optimize.css ? 'fis-optimizer-clean-css-2x' : null,
    postprocessor: ['fis3-postprocessor-autoprefixer-latest'].concat(
      config.build.optimize.css ? [] : ['fis3-postprocessor-prettier']
    ),
    useSprite: true
  },
  {
    type: 'js',
    lint: config.build.lint.js ? 'fis3-lint-eslint-noisy' : null,
    optimizer: config.build.optimize.js ? 'fis-optimizer-uglify-js' : null,
    postprocessor: config.build.optimize.js ? null : 'fis3-postprocessor-prettier'
  },
  {
    type: 'png',
    optimizer: config.build.optimize.png ? 'fis3-optimizer-imagemin' : null
  },
  {
    type: 'jpg',
    optimizer: config.build.optimize.jpeg ? 'fis3-optimizer-imagemin' : null
  },
  {
    type: 'gif',
    optimizer: config.build.optimize.gif ? 'fis3-optimizer-imagemin' : null
  },
  {
    type: 'svg',
    optimizer: config.build.optimize.svg ? 'fis3-optimizer-imagemin' : null
  },
  {
    type: 'html',
    lint: config.build.lint.html ? 'fis3-lint-htmlhint' : null,
    optimizer: config.build.optimize.html ? 'fis-optimizer-htmlmin' : null,
    postprocessor: config.build.optimize.html
      ? null
      : [
          // 'fis3-postprocessor-posthtml-beautify',
          'fis3-postprocessor-html'
        ]
  }
]

// ignore
if (config.build.ignore.global) {
  fis.set('project.ignore', config.build.ignore.global)
}

config.build.ignore.release.forEach(function(glob) {
  fis.match(glob, {
    release: false
  })
})


// hash
if (config.env.production) {
  fis.set('project.md5Length', config.build.hash.length)
  fis.set('project.md5Connector', config.build.hash.connector)
  fis.match('*', {
    useHash: true
  })
  config.build.hash.except.forEach(function(glob) {
    fis.match(glob, {
      useHash: false
    })
  })
}

// relative
if (config.build.relative) {
  fis.hook('relative-legal-html')
  fis.match('*', {
    relative: config.build.relative
  })
}


preProcessors.forEach(function(data) {
  var exts = utils.toArray(data.ext)
  var processor = {
    rExt: '.' + data.type
  }
  // plugins
  var plugins = ['parser', 'lint']

  utils.fileExts[data.type] = utils.fileExts[data.type] || []
  utils.fileExts[data.type] = utils.fileExts[data.type].concat(exts)
  fis.match(utils.getExtsReg(exts), processor)

  processor = {}
  plugins.forEach(function(pluginType) {
    if (data[pluginType]) {
      processor[pluginType] = utils.getPlugin(data[pluginType])
    }
  })
  fis.match(utils.getExtsReg(exts), processor)
})

standardProcessors.forEach(function(data) {
  var processor = {}

  // lint can't used on preProcessor
  // and we only lint for production
  if (data.lint) {
    fis.match(utils.getExtsReg(utils.toArray(data.type)), {
      lint: utils.getPlugin(data.lint)
    })
  }

  ;['useSprite'].forEach(function(type) {
    if (type in data) {
      processor[type] = data[type]
    }
  })

  // plugins
  ;['preprocessor', 'optimizer', 'postprocessor'].forEach(function(type) {
    if (data[type]) {
      processor[type] = utils.getPlugin(data[type])
    }
  })

  fis.match(utils.getExtsReg(data.type), processor)
})
;['optimizer', 'lint', 'postprocessor'].forEach(function(type) {
  ;(config.build.ignore[type] || []).forEach(function(reg) {
    var settings = {}
    settings[type] = null
    fis.match(reg, settings)
  })
})

// standrad files should release
// for inline include
fis.match(
  '_' +
    utils.getExtsReg(
      [
        'png',
        'jpg',
        'gif',
        'css',
        'js',
        'html',
        'pug',
        'es6',
        'es',
        'ts',
        'tsx',
        'svg'
      ],
      false
    ),
  {
    release: '/.temp/$0',
    relative: '/'
  }
)

// _*.html should not lint
// _*.js should not lint
fis.match('_*', {
  lint: null,
  postprocessor: null
})

// font/*.svg should not be compressed
// if (config.build.optimize.SVG) {
//   fis.match('{fonts,font}/*.svg', {
//     optimizer: null
//   })
// }

fis.match('::package', utils.pluginToProperties('fis-spriter-csssprites'))

// do noting to vendors
config.build.ignore.vendors.forEach(function(preg) {
  fis.match(preg, {
    parser: null,
    lint: null,
    preprocessor: null,
    optimizer: null,
    postprocessor: null,
    useSprite: false
  })
})

if (config.env.production) {
  fis.match('**', utils.pluginToProperties('fis3-deploy-local-deliver'))
}

if (!config.env.production) {
  fis.match('**', {
    lint: null,
    optimizer: null,
    postprocessor: null
  })
}

// store config
require('./lib/config-store.js')

// avoid warning
require('./hack/no-config-warning.js')

// fix fis3-command-release bug
require('./hack/fix-fis3-command-release.js')
