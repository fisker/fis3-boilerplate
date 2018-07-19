/* eslint comma-dangle: 0 */
/* eslint-env node */

'use strict'

var project = {
  name: 'xwtec-project',
  author: 'xwtec',
  device: 'multi-device', // [multi-device, mobile, desktop]
  legacyIe: 6, // IE 支持最低版本, 仅非 'mobile' 生效
  flexibleRem: false, // REM
  brandColor: '', // 主色调，用于浏览器标题栏、css --config-primary-color等
  styles: [
    '/assets/styles/main.scss',
  ],
  headScripts: [
    'rem',
    'html5shiv',
  ],
  scripts: [
    '/project/scripts/config.js.jst',
    'dd_belatedpng',
    'jquery',
  ],
  lang: 'zh-CN',
  robots: {
    index: true,
    follow: true,
  },
}

var build = {
  sourceMap: false,
  lint: {
    html: true, // html 代码检查
    css: true, // css 代码检查
    js: true // js 代码检查
  },
  fix: {
    html: false, // 暂无插件修复
    css: false, // stylelint 时使用 stylefmt 自动修复
    js: false // eslint 自动修复
  },
  optimize: {
    css: false, // css 代码压缩
    js: false, // js 代码压缩
    html: false, // html 代码压缩
    png: {
      lossy: true // 有损压缩png
    },
    jpeg: {
      progressive: true // 渐进式 jpeg
    },
    gif: true,
    svg: false
  },
  hash: {
    length: 6, // md5戳长度
    connector: '.', // md5戳连接符
    except: [
      '*',
      // '*.{html,htm}',
    ]
  },
  relative: true, // 使用相对路径
  ignore: {
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
      'normalize.css/**',
      'snippets/**',
      '_**',
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
  minifyInlineScript: [
    'assets/scripts/component/_rem.js',
  ],
}

module.exports = {
  build: build,
  project: project,
}
