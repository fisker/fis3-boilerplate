module.exports = {
  // 第三方文件
  GLOB_THIRD_PARTY: '**/{lib,thirdparty,third{_,-}party,vendors}/**',
  // 压缩过的文件
  GLOB_MIN: '**/*{.,_,-}min.*',
  // 代码片段, 仅 src 根目录下的 snippets
  GLOB_SNIPPETS: '/snippets/**',
  // _ 开头的文件名
  GLOB_PRIVATE: '**/_{*/**,*}',
  // 脚本文件
  GLOB_SCRIPTS: '**/*.{bat,cmd,sh,command}',
  // 临时文件
  GLOB_TEMP: '**/*.tmp',
  // 备份文件
  GLOB_BACKUP: '**/*.bak',
  // 缩略图
  GLOB_THUMBS: '**/{Thumbs,ehthumbs}.db',
  // deskop
  GLOB_DESKTOP: '**/Desktop.ini',
  // fis-config
  GLOB_FIS_CONFIG: '**/fis-conf.js',
  // 回收站
  GLOB_RECYCLE: '**/$RECYCLE.BIN/**',
  // 包管理器
  GLOB_PACKAGE: '{node_modules,bower_components}/**',
  // 隐藏文件
  GLOB_HIDDEN: '**/.{*/**,*}',

  ARCHIVE_TYPE_ZIP: 'zip',
  ARCHIVE_TYPE_GZ: 'tar.gz',
  TIMESTAMP: new Date()
    .toJSON()
    .replace(/[:-]/g, '')
    .replace('T', '-')
    .slice(2, 15),
  DEVICE_MULTI: 'multi-device',
  DEVICE_MOBILE: 'mobile',
  DEVICE_DESKTOP: 'desktop',
}
