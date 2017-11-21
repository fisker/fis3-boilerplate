/* eslint comma-dangle: 0, no-console: 0 */

/*
fis-conf.js
by fisker Cheung <lionkay@gmail.com>
verion 1.0
last update 2017.04.28
*/

'use strict'

var fis = global.fis
var _ = fis.util
var fs = require('fs')
var path = require('path')
var CHARSET = 'utf-8'
var fixConfig = require('./scripts/fix-config')
var generateConfig = require('./scripts/generate-config').cache
var pluginTypes = require('./scripts/plugin-types')
var getPluginConfig = require('./scripts/plugin-config')

var ENV = {
  IS_PRODUCTION:
    (process.env.NODE_ENV || fis.project.currentMedia()) === 'production',
  ENGINE: process.version, // node 版本
  TEMP_RESOURCE_FOLDER: process.env.TEMP_RESOURCE_FOLDER || '.temp',
  SOURCE_FOLDER: process.env.SOURCE_FOLDER || 'src',
  DIST_FOLDER: process.env.DIST_FOLDER || 'dist',
  COMPUTER_NAME: process.env.COMPUTERNAME,
  USER_NAME: process.env.USERNAME,
}

var CONFIG = fixConfig({
  DEVICE: 'multi-device', // [multi-device, mobile, pc]
  LEGACY_IE: 6, // IE 支持最低版本, 仅非 'mobile' 生效
  USE_REM: false, // REM
  BRAND_COLOR: '', // 主色调，用于浏览器标题栏等
  // prettier-ignore
  ENV_LANG: [
    'json',
    'scss',
    'pug',
    'js',
    'css',
    'less',
  ],
  LINT: {
    HTML: true, // html 代码检查
    CSS: true, // css 代码检查
    JS: true, // js 代码检查
  },
  FIX: {
    HTML: false, // 暂无插件修复
    CSS: false, // stylelint 时使用 stylefmt 自动修复
    JS: false, // eslint 自动修复
  },
  OPTIMIZER: {
    CSS: false, // css 代码压缩
    JS: false, // js 代码压缩
    HTML: false, // html 代码压缩
    PNG: {
      LOSSY: true, // 有损压缩PNG
    },
    JPEG: {
      PROGRESSIVE: true, // 渐进式 JPEG
    },
    GIF: true,
    SVG: false,
  },
  HASH: {
    LENGTH: 6, // md5戳长度
    CONNECTOR: '.', // md5戳连接符
    EXCEPT: [
      '*',
      // '*.{html,htm}',
    ],
  },
  USE_RELATIVE: true, // 使用相对路径
  LIVERELOAD: {
    // PORT: 1988, // livereload 端口，留空自动查找
    // HOSTNAME: 'localhost', // livereload IP地址，留空自动查找
  },
  // 忽略文件
  // prettier-ignore
  IGNORE: {
    global: [
      '.**',
      '.{git,svn,hg,CVS,idea,sass-cache,vscode,devtools,cache,project}/**',
      '{node_modules,bower_components}/**',
      '$RECYCLE.BIN/**',
      '*.{bat,cmd,sh,tmp,bak}',
      'Thumbs.db',
      'ehthumbs.db',
      'Desktop.ini',
      'fis-conf.js',
    ],
    vendors: [
      'lib/**',
      'thirdparty/**',
      'third{_,-}party/**',
      'vendors/**',
    ],
    release: [
      '_**',
      '_**/**',
    ],
    lint: [
      '*{.,_,-}min.**',
    ],
    optimizer: [
      '*{.,_,-}min.**',
    ],
    postprocessor: [
      '*{.,_,-}min.**',
    ],
  },
})

// output crossLangConfig
generateConfig(ENV, CONFIG)

var PLUGINS_CONFIG = getPluginConfig(ENV, CONFIG)

var preProcessors = [
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
    parser: 'fis-parser-node-sass',
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
]

var standardProcessors = [
  {
    type: 'css',
    lint: CONFIG.LINT.CSS ? 'fis3-lint-stylelint' : null,
    preprocessor: CONFIG.LEGACY_IE <= 8 ? 'fis-preprocessor-cssgrace' : null,
    optimizer: CONFIG.OPTIMIZER.CSS ? 'fis-optimizer-clean-css-2x' : null,
    postprocessor: ['fis3-postprocessor-autoprefixer-latest'].concat(
      CONFIG.OPTIMIZER.CSS || ENV.ENGINE < 'v4.0.0'
        ? []
        : ['fis3-postprocessor-stylefmt'],
    ),
    useSprite: true,
  },
  {
    type: 'js',
    lint: CONFIG.LINT.JS ? 'fis3-lint-eslint-noisy' : null,
    optimizer: CONFIG.OPTIMIZER.JS ? 'fis-optimizer-uglify-js' : null,
    postprocessor: CONFIG.OPTIMIZER.JS ? null : 'fis3-postprocessor-prettier',
  },
  {
    type: 'png',
    optimizer: CONFIG.OPTIMIZER.PNG
      ? ENV.ENGINE >= 'v4.0.0'
        ? 'fis3-optimizer-imagemin'
        : 'fis-optimizer-png-compressor'
      : null,
  },
  {
    type: 'jpg',
    optimizer:
      CONFIG.OPTIMIZER.JPEG && ENV.ENGINE >= 'v4.0.0'
        ? 'fis3-optimizer-imagemin'
        : null,
  },
  {
    type: 'gif',
    optimizer:
      CONFIG.OPTIMIZER.GIF && ENV.ENGINE >= 'v4.0.0'
        ? 'fis3-optimizer-imagemin'
        : null,
  },
  {
    type: 'svg',
    optimizer:
      CONFIG.OPTIMIZER.SVG && ENV.ENGINE >= 'v4.0.0'
        ? 'fis3-optimizer-imagemin'
        : null,
  },
  {
    type: 'html',
    lint: CONFIG.LINT.HTML ? 'fis3-lint-htmlhint' : null,
    optimizer: CONFIG.OPTIMIZER.HTML ? 'fis-optimizer-htmlmin' : null,
    postprocessor: CONFIG.OPTIMIZER.HTML
      ? null
      : [
          // 'fis3-postprocessor-posthtml-beautify',
          'fis3-postprocessor-html',
        ],
  },
]

var fileExts = {}
var hasOwn = fileExts.hasOwnProperty
var slice = pluginTypes.slice

if (CONFIG.IGNORE.global) {
  fis.set('project.ignore', CONFIG.IGNORE.global)
}

_.forEach(CONFIG.IGNORE.release, function(glob) {
  fis.match(glob, {
    release: false,
  })
})

if (CONFIG.LIVERELOAD.PORT) {
  fis.set('livereload.port', CONFIG.LIVERELOAD.PORT)
}
if (CONFIG.LIVERELOAD.HOSTNAME) {
  fis.set('livereload.hostname', CONFIG.LIVERELOAD.HOSTNAME)
}

if (ENV.IS_PRODUCTION) {
  fis.set('project.md5Length', CONFIG.HASH.LENGTH)
  fis.set('project.md5Connector', CONFIG.HASH.CONNECTOR)
  fis.match('*', {
    useHash: true,
  })
  _.forEach(CONFIG.HASH.EXCEPT, function(glob) {
    fis.match(glob, {
      useHash: false,
    })
  })
}

if (CONFIG.USE_RELATIVE) {
  fis.hook('relative-legal-html')
  fis.match('*', {
    relative: CONFIG.USE_RELATIVE,
  })
}

function toArray(s) {
  return s.split ? s.split(',') : slice.call(s)
}

function parsePlugin(pluginName) {
  var reg = new RegExp(
    [
      '^',
      '(?:fis|fis3)-',
      '(' + pluginTypes.join('|') + ')-',
      '(.*?)',
      '$',
    ].join(''),
  )
  var match = pluginName.match(reg)
  return (
    match &&
    match[2] && {
      name: match[0],
      type: match[1],
      short: match[2],
    }
  )
}

function getPluginOptions(pluginName) {
  var shortPluginName = parsePlugin(pluginName).short
  var options =
    PLUGINS_CONFIG[pluginName] || PLUGINS_CONFIG[shortPluginName] || {}
  return options
}

function getPlugin(pluginNames) {
  var plugins = []

  if (pluginNames.__plugin) {
    return pluginNames
  }
  if (!pluginNames) {
    return null
  }

  _.forEach(toArray(pluginNames), function(pluginName) {
    var plugin
    var shortPluginName

    if (!pluginName) {
      return null
    }
    if (pluginName.__plugin) {
      plugin = pluginName
    } else {
      shortPluginName = parsePlugin(pluginName).short
      plugin = fis.plugin(shortPluginName, getPluginOptions(pluginName))
    }
    plugins.push(plugin)
  })

  return plugins.length === 1 ? plugins[0] : plugins
}

function pluginToProperties(pluginNames) {
  var properties = {}
  _.forEach(toArray(pluginNames), function(pluginName) {
    var type = parsePlugin(pluginName).type
    var plugin = getPlugin(pluginName)
    if (properties[type]) {
      properties[type] = properties[type].push
        ? properties[type]
        : [properties[type]]
      properties[type].push(plugin)
    } else {
      properties[type] = plugin
    }
  })
  return properties
}

function getExtsReg(ext, inline) {
  var exts = []
  var prefix = ''

  if (ext.split && fileExts[ext]) {
    exts = toArray(fileExts[ext])
    exts.unshift(ext)
  } else {
    exts = toArray(ext)
  }
  exts = 1 === exts.length ? exts : '{' + exts.join(',') + '}'
  if (true === inline) {
    prefix = '*.html:'
  } else if (false === inline) {
    prefix = '*.'
  } else {
    prefix = '{*.html:,*.}'
  }
  return prefix + exts
}

_.forEach(preProcessors, function(data) {
  var exts = toArray(data.ext)
  var processor = {
    rExt: '.' + data.type,
  }
  // plugins
  var plugins = ['parser', 'lint']

  fileExts[data.type] = fileExts[data.type] || []
  fileExts[data.type] = fileExts[data.type].concat(exts)
  fis.match(getExtsReg(exts), processor)

  processor = {}
  _.forEach(plugins, function(pluginType) {
    if (data[pluginType]) {
      processor[pluginType] = getPlugin(data[pluginType])
    }
  })
  fis.match(getExtsReg(exts), processor)
})

_.forEach(standardProcessors, function(data) {
  var processor = {}

  // lint can't used on preProcessor
  // and we only lint for production
  if (data.lint) {
    fis.match(getExtsReg(toArray(data.type)), {
      lint: getPlugin(data.lint),
    })
  }

  _.forEach(['useSprite'], function(type) {
    if (type in data) {
      processor[type] = data[type]
    }
  })

  // plugins
  _.forEach(['preprocessor', 'optimizer', 'postprocessor'], function(type) {
    if (data[type]) {
      processor[type] = getPlugin(data[type])
    }
  })

  fis.match(getExtsReg(data.type), processor)
})
_.forEach(['optimizer', 'lint', 'postprocessor'], function(type) {
  _.forEach(CONFIG.IGNORE[type] || [], function(reg) {
    var settings = {}
    settings[type] = null
    fis.match(reg, settings)
  })
})

// standrad files should release
// for inline include
fis.match(
  '_' +
    getExtsReg(
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
        'svg',
      ],
      false,
    ),
  {
    release: '/' + ENV.TEMP_RESOURCE_FOLDER + '/$0',
    relative: '/',
  },
)

// _*.html should not lint
// _*.js should not lint
fis.match('_*', {
  lint: null,
  postprocessor: null,
})

// font/*.svg should not be compressed
// if (CONFIG.OPTIMIZER.SVG) {
//   fis.match('{fonts,font}/*.svg', {
//     optimizer: null
//   })
// }

fis.match('::package', pluginToProperties('fis-spriter-csssprites'))

// do noting to vendors
_.forEach(CONFIG.IGNORE.vendors, function(preg) {
  fis.match(preg, {
    parser: null,
    lint: null,
    preprocessor: null,
    optimizer: null,
    postprocessor: null,
    useSprite: false,
  })
})

if (ENV.IS_PRODUCTION) {
  fis.match('**', pluginToProperties('fis3-deploy-local-deliver'))
}

if (!ENV.IS_PRODUCTION) {
  fis.match('**', {
    lint: null,
    optimizer: null,
    postprocessor: null,
  })
}

// fix fis3-command-release bug
require('./scripts/fix-fis3-command-release.js').fix()
