const path = require('path')
const CONSTANTS = require('./scripts/constants')

const resolvePath = path.join.bind(path, __dirname)

// 项目名称
// const PROJECT_NAME = (() => {
//   try {
//     return require('./package.json').name
//   } catch {
//     return __dirname.split(/[\\/]/).pop()
//   }
// })()
const PROJECT_NAME = (() => {
  try {
    return require('./package.json').name
  } catch {
    return __dirname.split(/[/\\]/).pop()
  }
})()

/*!
 * 新项目必须检查的选项
 * project.{device, legacyIe, styles}
 */

// 项目选项
const project = {
  // 项目名称
  // name: PROJECT_NAME,
  name: PROJECT_NAME,

  // 作者
  // author: 'xwtec',
  author: 'xwtec',

  // 支持设备
  // 选项:
  // CONSTANTS.DEVICE_MULTI, 多设备，默认
  // CONSTANTS.DEVICE_MOBILE, 仅移动设备
  // CONSTANTS.DEVICE_DESKTOP, 仅桌面版
  // device: CONSTANTS.DEVICE_MULTI,
  device: CONSTANTS.DEVICE_MULTI,

  // IE 支持最低版本
  // 仅非 DEVICE_MOBILE 生效
  // legacyIe: 6,
  legacyIe: 6,

  // 使用 自适应的 REM 单位
  // 页面会自动引入一个 rem 计算的 js
  // flexibleRem: false,
  flexibleRem: false,

  // 设计稿的宽度
  // designWidth: 750,
  designWidth: 750,

  // 主色调
  // 用于浏览器标题栏、scss、css、less等
  // brandColor: '',
  brandColor: '',

  // 公共样式
  // 数组
  // 路径从 src 开始的绝对路径
  // styles: [],
  styles: ['/assets/styles/main.scss'],

  // 头部公共脚本
  // 数组
  // 路径从 src 开始的绝对路径
  // 支持 别名， 需要在 src/snippets/lib/loader.js 中实现
  // rem 会根据 flexibleRem 自动决定, 建议一直保留
  // html5shiv 会根据 legacyIe 自动决定, 建议一直保留
  // headScripts: ['rem', 'html5shiv'],
  headScripts: ['rem', 'html5shiv'],

  // 页面底部公共脚本
  // 数组
  // 路径从 src 开始的绝对路径
  // 支持 别名， 需要在 src/snippets/lib/loader.js 中实现
  // scripts: [],
  // dd_belatedpng 会根据 legacyIe 自动决定, 建议一直保留
  scripts: ['/project/scripts/config.js.jst', 'dd_belatedpng', 'jquery'],

  // 页面 语言
  // lang: 'zh-CN',
  lang: 'zh-CN',

  // 页面 <meta name="robots" ...>
  // robots: {
  //   index: true,
  //   follow: true,
  // },
  robots: {
    index: true,
    follow: true,
  },
}

// 构建选项
const build = {
  // 编译日志保存路径
  // log: resolvePath('./build.log'),
  log: resolvePath('./build.log'),

  // 源文件路径
  // src: resolvePath('./src'),
  src: resolvePath('./src'),

  // 临时文件夹名称(非路径)
  // temp: '.temp',
  temp: '.temp',

  // 依赖保存路径
  vendors: resolvePath('./src/assets/vendors'),

  // fis-config 路径
  // config: resolvePath('./scripts/fis/index.js'),
  config: resolvePath('./scripts/fis/index.js'),

  // 编译文件保存路径
  // dist: resolvePath('./dist'),
  dist: resolvePath('./dist'),

  // 压缩文件保存文件夹路径
  // archive: resolvePath('./archive'),
  archive: resolvePath('./archive'),

  // 压缩文件类型
  // 选项:
  // CONSTANTS.ARCHIVE_TYPE_ZIP, zip 文件
  // CONSTANTS.ARCHIVE_TYPE_GZ, gz 文件, 非英文文件名可能有问题
  // archiveType: CONSTANTS.ARCHIVE_TYPE_ZIP,
  archiveType: CONSTANTS.ARCHIVE_TYPE_ZIP,

  // 压缩文件名（无文件后缀, archiveType 决定）
  // archiveFile: `${PROJECT_NAME}.${CONSTANTS.TIMESTAMP}`,
  archiveFile: `${PROJECT_NAME}.${CONSTANTS.TIMESTAMP}`,

  // 是否编译 sourceMap
  // sourceMap: false,
  sourceMap: false,

  // 代码检查选项
  // lint: {
  //   html: true,
  //   css: true,
  //   js: true,
  // },
  lint: {
    html: true,
    css: true,
    js: true,
  },

  // 自动源代码修复选项, 如果你不确切知道工作原理请不要打开
  // fix: {
  //   html: false, // 暂不支持
  //   css: false,
  //   js: false,
  // },
  fix: {
    html: false, // 暂不支持
    css: false,
    js: false,
  },

  // 代码压缩
  // optimize: {
  //   css: false,
  //   js: false,
  //   html: false,
  //   png: {
  //     lossy: true, // 有损压缩png
  //   },
  //   jpeg: {
  //     progressive: true, // 渐进式 jpeg
  //   },
  //   gif: true,
  //   svg: false,
  // },
  optimize: {
    css: false,
    js: false,
    html: false,
    png: {
      lossy: true, // 有损压缩png
    },
    jpeg: {
      progressive: true, // 渐进式 jpeg
    },
    gif: true,
    svg: false,
  },

  // 编译文件 hash 选项
  // hash: {
  //   length: 6, // md5戳长度
  //   connector: '.', // md5戳连接符
  //   except: [
  //     '*', // 排除文件， 默认全部不添加
  //     // '*.{html,htm}',
  //   ],
  // },
  hash: {
    length: 6, // md5戳长度
    connector: '.', // md5戳连接符
    except: [
      '*', // 排除文件， 默认全部不添加
      // '*.{html,htm}',
    ],
  },

  // 使用相对路径
  // relative: true,
  relative: true,

  // 忽略文件
  // ignore: {
  //   // 全局忽略
  //   global: [
  //     CONSTANTS.GLOB_HIDDEN,
  //     CONSTANTS.GLOB_PACKAGE,
  //     CONSTANTS.GLOB_RECYCLE,
  //     CONSTANTS.GLOB_SCRIPTS,
  //     CONSTANTS.GLOB_TEMP,
  //     CONSTANTS.GLOB_BACKUP,
  //     CONSTANTS.GLOB_THUMBS,
  //     CONSTANTS.GLOB_DESKTOP,
  //     CONSTANTS.GLOB_FIS_CONFIG,
  //   ],
  //   vendors: [CONSTANTS.GLOB_THIRD_PARTY],

  //   // 发布忽略
  //   release: [
  //     'normalize.css/**',
  //     CONSTANTS.GLOB_SNIPPETS,
  //     CONSTANTS.GLOB_PRIVATE,
  //   ],

  //   // 代码检查忽略
  //   lint: [CONSTANTS.GLOB_SNIPPETS, CONSTANTS.GLOB_MIN],

  //   // 代码压缩忽略
  //   optimizer: [CONSTANTS.GLOB_SNIPPETS, CONSTANTS.GLOB_MIN],

  //   // 后处理程序忽略
  //   postprocessor: [CONSTANTS.GLOB_MIN],
  // },
  ignore: {
    // 全局忽略
    global: [
      CONSTANTS.GLOB_HIDDEN,
      CONSTANTS.GLOB_PACKAGE,
      CONSTANTS.GLOB_RECYCLE,
      CONSTANTS.GLOB_SCRIPTS,
      CONSTANTS.GLOB_TEMP,
      CONSTANTS.GLOB_BACKUP,
      CONSTANTS.GLOB_THUMBS,
      CONSTANTS.GLOB_DESKTOP,
      CONSTANTS.GLOB_FIS_CONFIG,
    ],

    // 第三方忽略
    vendors: [CONSTANTS.GLOB_THIRD_PARTY],

    // 发布忽略
    release: [
      'normalize.css/**',
      CONSTANTS.GLOB_SNIPPETS,
      CONSTANTS.GLOB_PRIVATE,
    ],

    // 代码检查忽略
    lint: [CONSTANTS.GLOB_SNIPPETS, CONSTANTS.GLOB_MIN],

    // 代码压缩忽略
    optimizer: [CONSTANTS.GLOB_SNIPPETS, CONSTANTS.GLOB_MIN],

    // 后处理程序忽略
    postprocessor: [CONSTANTS.GLOB_MIN],
  },

  // 页面内嵌压缩的脚本文件
  // minifyInlineScript: ['assets/scripts/component/_rem.js.jst'],
  minifyInlineScript: ['assets/scripts/component/_rem.js.jst'],
}

// 开发服务器配置, 一般不需要修改
const server = {
  type: 'browsersync',
  configFile: resolvePath('./bs-config.js'),
  config: require('./bs-config.js'),
}

module.exports = {
  build,
  project,
  server,
}
