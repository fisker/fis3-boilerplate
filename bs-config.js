/* eslint-env node */

'use strict'

/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  ui: {
    port: 3001,
    weinre: {
      port: 3002
    }
  },
  files: false,
  // prettier-ignore
  watchEvents: [
    'change',
    'add',
    'addDir',
    'unlink',
    'unlinkDir',
  ],
  watch: false,
  ignore: [],
  single: false,
  watchOptions: {
    ignoreInitial: true
  },
  server: {
    // baseDir: '', // not working, override by fis3
    directory: true
  },
  proxy: false,
  port: 3000,
  middleware: [],
  serveStatic: [],
  serveStaticOptions: {},
  https: false,
  // httpModule: undefined,
  ghostMode: false,
  // ghostMode: {
  //   clicks: true,
  //   scroll: true,
  //   location: true,
  //   forms: {
  //     submit: true,
  //     inputs: true,
  //     toggles: true
  //   }
  // },
  logLevel: 'info',
  logPrefix: 'Browsersync',
  logConnections: false, // no useful info
  logFileChanges: true,
  logSnippet: true,
  snippetOptions: {},
  rewriteRules: [],
  tunnel: false,
  online: false,
  // open: 'local', // not working, override by fis3
  browser: 'default',
  cors: false,
  xip: false,
  hostnameSuffix: false, // in default-config.js not in document
  // xip.io sslip.io ipna.me nip.io
  reloadOnRestart: false,
  notify: false,
  scrollProportionally: true,
  scrollThrottle: 100,
  scrollRestoreTechnique: 'cookie',
  scrollElements: ['.js-scroller'],
  scrollElementMapping: [],
  reloadDelay: 0,
  reloadDebounce: 100,
  reloadThrottle: 0,
  plugins: [],
  injectChanges: true,
  startPath: null,
  minify: false,
  host: null,
  localOnly: false,
  codeSync: true,
  timestamps: true,
  // scriptPath: undefined,
  clientEvents: [
    // in default-config.js not in document
    'scroll',
    'scroll:element',
    'input:text',
    'input:toggles',
    'form:submit',
    'form:reset',
    'click'
  ],
  socket: {
    // some option in default-config.js not in document
    socketIoOptions: {
      log: false
    },
    socketIoClientConfig: {
      reconnectionAttempts: 50
    },
    path: '/browser-sync/socket.io',
    clientPath: '/browser-sync',
    namespace: '/browser-sync',
    // domain: undefined,
    // port: undefined,
    clients: {
      heartbeatTimeout: 5000
    }
  },
  tagNames: {
    less: 'link',
    scss: 'link',
    css: 'link',
    jpg: 'img',
    jpeg: 'img',
    png: 'img',
    svg: 'img',
    gif: 'img',
    js: 'script'
  },
  injectFileTypes: ['css', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'map'],
  injectNotification: 'console', // false | console | overlay
  excludedFileTypes: [
    'js',
    'css',
    'pdf',
    'map',
    'svg',
    'ico',
    'woff',
    'json',
    'eot',
    'ttf',
    'png',
    'jpg',
    'jpeg',
    'webp',
    'gif',
    'mp4',
    'mp3',
    '3gp',
    'ogg',
    'ogv',
    'webm',
    'm4a',
    'flv',
    'wmv',
    'avi',
    'swf',
    'scss'
  ],
  script: {
    // domain: undefined
  }
}
