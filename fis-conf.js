/* eslint comma-dangle: 0, no-console: 0 */

/*
fis-conf.js
by fisker Cheung <lionkay@gmail.com>
verion 1.0
last update 2017.04.28
*/

(function($) {
  'use strict';
  var fs = require('fs');
  var path = require('path');
  var CHARSET = 'utf-8';
  var EOL = '\n';
  var INSERT_FINAL_NEWLINE = true;
  var INDENT = '  ';

  var ENV = {
    FIS_MEDIA: process.env.NODE_ENV || $.project.currentMedia(),
    ENGINE: process.version, // node 版本
    TEMP_RESOURCE_FOLDER: process.env.TEMP_RESOURCE_FOLDER || '.temp',
    SOURCE_FOLDER: (process.env.SOURCE_FOLDER || 'src'),
    DIST_FOLDER: (process.env.DIST_FOLDER || 'dist'),
    COMPUTER_NAME: process.env.COMPUTERNAME,
    USER_NAME: process.env.USERNAME,
  };

  var CONFIG = {
    DEVICE: 'multi-device', // [multi-device, mobile, pc]
    LEGACY_IE: 6, // IE 支持最低版本, 仅非 'mobile' 生效
    USE_REM: false, // REM
    BRAND_COLOR: '', // 主色调，用于浏览器标题栏等
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
    IGNORE: {
      global: [
        '.**',
        '.{git,svn,hg,CVS,idea,sass-cache,vscode}/**',
        '{node_modules,bower_components}/**',
        '*.{bat,cmd,sh,tmp,bak}',
        'Thumbs.db',
        'fis-conf.js',
      ],
      release: [
        '_**',
        '_**/**',
      ],
      lint: [
        '*{.,_,-}min.**',
        'lib/**',
        'thirdparty/**',
        'third{_,-}party/**',
        'vendors/**',
      ],
      optimizer: [
        '*{.,_,-}min.**',
        // 'lib/**',
        // 'thirdparty/**',
        // 'third{_,-}party/**',
        // 'vendors/**',
      ],
    },
  };

  if (CONFIG.DEVICE === 'mobile') {
    CONFIG.LEGACY_IE = 9;
  }

  if (CONFIG.LEGACY_IE < 9 && CONFIG.USE_REM) {
    console.warn('[33m[WARNI][39m rem unit might not work with ie < 9.');
  }

  // output crossLangConfig
  var cacheEnv = {
    device: CONFIG.DEVICE,
    legacyIe: CONFIG.LEGACY_IE,
    useRem: CONFIG.USE_REM,
    brandColor: CONFIG.BRAND_COLOR || null,
    debug: ENV.FIS_MEDIA === 'dev',
  };
  if (ENV.FIS_MEDIA === 'dev') {
    cacheEnv.computerName = ENV.COMPUTER_NAME;
    cacheEnv.userName = ENV.USER_NAME;
  }
  cacheConfig(cacheEnv);

  var PLUGINS_CONFIG = {
    'fis-parser-node-sass': {
      includePaths: [],
      indentType: 'space',
      indentWidth: 2,
      linefeed: 'lf',
      omitSourceMapUrl: false,
      // outFile: '',
      outputStyle: 'expanded', // options: nested, expanded, compact, compressed
      precision: 8, // default: 5
      sourceComments: ENV.FIS_MEDIA === 'dev',
      sourceMap: false,
      sourceMapContents: true,
      sourceMapEmbed: ENV.FIS_MEDIA === 'dev',
      // sourceMapRoot: ''
    },
    'fis3-parser-dart-sass': {
      includePaths: [],
      indentType: 'space',
      indentWidth: 2,
      linefeed: 'lf',
      omitSourceMapUrl: false,
      // outFile: '',
      outputStyle: 'expanded', // options: nested, expanded, compact, compressed
      precision: 8, // default: 5
      sourceComments: ENV.FIS_MEDIA === 'dev',
      sourceMap: false,
      sourceMapContents: true,
      sourceMapEmbed: ENV.FIS_MEDIA === 'dev',
      // sourceMapRoot: ''
    },
    'fis-parser-stylus2': {},
    'fis-parser-less-2.x': {},
    'fis3-postprocessor-autoprefixer-latest': {
      browsers: (['ie >= ' + CONFIG.LEGACY_IE]).concat([
        'and_chr >= 1',
        'and_ff >=1',
        'and_uc >=1',
        'android >= 2.1',
        'bb >= 7',
        'chrome >= 4',  // default: >= 4
                        // >=5: strip -webkit for border-radius
        'edge >= 12',
        'firefox >= 16', // default: >= 2
                         // >=16: strip -moz for linear-gradient
                         // >=16: strip -moz for animation
        'ie_mob >= 10',
        'ios_saf >= 3.2',
        'op_mini >= 5',
        'op_mob >= 12.1', // default: >= 10
                          // >=12.1: strip -o for linear-gradient
        'opera >= 12.1', // default: >= 9
                         // >=12.1: strip -o for animation
        'safari >= 3.1',
      ]),
    },
    'fis-optimizer-uglify-js': {
      mangle: {
        except: 'exports, module, require, define',
      },
      compress: {
        'drop_console': true,
      },
    },
    'fis-optimizer-clean-css-2x': {
      advanced: false,
      aggressiveMerging: false,
      shorthandCompacting: false,
      roundingPrecision: 8, // default is 2
      compatibility: CONFIG.LEGACY_IE <= 8 ? [
        '+properties.ieBangHack',
        '+properties.iePrefixHack',
        '+properties.ieSuffixHack',
        '-properties.merging',
        '+selectors.ie7Hack',
      ] : [],
      keepSpecialComments: 0,
    },
    'fis-optimizer-png-compressor': {
      type: CONFIG.OPTIMIZER.PNG && CONFIG.OPTIMIZER.PNG.LOSSY ? 'pngquant' : 'pngcrush',
      speed: 1,
    },
    'fis-optimizer-jpeg-compressor': {
      progressive: CONFIG.OPTIMIZER.JPEG && CONFIG.OPTIMIZER.JPEG.PROGRESSIVE
    },
    'fis-spriter-csssprites': {
      margin: 10,
      layout: 'linear', // 'linear/matrix' default linear
    },
    'fis3-deploy-local-deliver': {
      to: './' + ENV.DIST_FOLDER,
    },
    'fis-parser-coffee-script': {
      // header: true,
    },
    'fis-parser-babel-5.x': {
      blacklist: ['regenerator'],
      optional: ['asyncToGenerator'],
      stage: 3,
      sourceMaps: ENV.FIS_MEDIA === 'dev',
    },
    'fis-parser-babel-6.x': {
      presets: 'react',
      sourceMaps: ENV.FIS_MEDIA === 'dev',
    },
    'fis3-parser-pug': {
      pretty: '  ',
      doctype: 'html',
    },
    'fis3-lint-htmlhint': {},
    'fis3-lint-eslint-noisy': {
      fix: CONFIG.FIX.JS,
      useEslintrc: true
    },
    'fis3-lint-stylelint': {
      fix: CONFIG.FIX.CSS,
    },
    'fis3-optimizer-imagemin': {
      '.png': CONFIG.OPTIMIZER.PNG && !CONFIG.OPTIMIZER.PNG.LOSSY ?
        {
          pngcrush: {},
        } :
        {
          upng: {
            cnum: 256,
          },
        }
    },
    'fis3-postprocessor-html': {
      'brace_style': 'collapse', // [collapse|expand|end-expand|none] Put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are
      'end_with_newline': true, // End output with newline
      'indent_char': ' ', // Indentation character
      'indent_handlebars': false, // e.g. {{#foo}}, {{/foo}}
      'indent_inner_html': false, // Indent <head> and <body> sections
      'indent_scripts': 'normal', // [keep|separate|normal]
      'indent_size': 2, // Indentation size
      'max_preserve_newlines': 0, // Maximum number of line breaks to be preserved in one chunk (0 disables)
      'preserve_newlines': true, // Whether existing line breaks before elements should be preserved (only works before elements, not inside tags or for text)
      'unformatted': [
        'a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u',
        'strike', 'big', 'small', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style'
        ], // List of tags that should not be reformatted
      'extra_liners': [],
      'wrap_line_length': 0 // Lines should wrap at next opportunity after this number of characters (0 disables)
    },
  };

  var pluginTypes = [
    'lint',
    'parser',
    'preprocessor',
    'standard',
    'postprocessor',
    'optimizer',
    'prepacakger',
    'spriter',
    'packager',
    'postpackager',
    'deploy',
  ];

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
  ];

  var standardProcessors = [
    {
      type: 'css',
      lint: CONFIG.LINT.CSS ? 'fis3-lint-stylelint' : null,
      preprocessor: CONFIG.LEGACY_IE <= 8 ? 'fis-preprocessor-cssgrace' : null,
      optimizer: CONFIG.OPTIMIZER.CSS ? 'fis-optimizer-clean-css-2x' : null,
      postprocessor: ['fis3-postprocessor-autoprefixer-latest'].concat(
          (CONFIG.OPTIMIZER.CSS || ENV.FIS_MEDIA === 'dev' || ENV.ENGINE < 'v4.0.0') ?
          [] :
          ['fis3-postprocessor-stylefmt']
        ),
      useSprite: true
    },
    {
      type: 'js',
      lint: CONFIG.LINT.JS ? 'fis3-lint-eslint-noisy' : null,
      optimizer: CONFIG.OPTIMIZER.JS ? 'fis-optimizer-uglify-js' : null,
    },
    {
      type: 'png',
      optimizer: CONFIG.OPTIMIZER.PNG ?
        (ENV.ENGINE >= 'v4.0.0' ? 'fis3-optimizer-imagemin' : 'fis-optimizer-png-compressor') :
        null,
    },
    {
      type: 'jpg',
      optimizer: CONFIG.OPTIMIZER.JPEG && ENV.ENGINE >= 'v4.0.0' ? 'fis3-optimizer-imagemin' : null,
    },
    {
      type: 'gif',
      optimizer: CONFIG.OPTIMIZER.GIF && ENV.ENGINE >= 'v4.0.0' ? 'fis3-optimizer-imagemin' : null,
    },
    {
      type: 'svg',
      optimizer: CONFIG.OPTIMIZER.SVG && ENV.ENGINE >= 'v4.0.0' ? 'fis3-optimizer-imagemin' : null,
    },
    {
      type: 'html',
      lint: CONFIG.LINT.HTML ? 'fis3-lint-htmlhint' : null,
      optimizer: CONFIG.OPTIMIZER.HTML ? 'fis-optimizer-htmlmin' : null,
      postprocessor: CONFIG.OPTIMIZER.HTML ? null : [
        // 'fis3-postprocessor-posthtml-beautify',
        'fis3-postprocessor-html'
      ],
    }
  ];

  var fileExts = {};
  var hasOwn = fileExts.hasOwnProperty;
  var slice = pluginTypes.slice;

  if (CONFIG.IGNORE.global) {
    $.set('project.ignore', CONFIG.IGNORE.global);
  }

  CONFIG.IGNORE.release.forEach(function(preg) {
    $.match(preg, {
      release: false
    });
  });

  if (CONFIG.LIVERELOAD.PORT) {
    $.set('livereload.port', CONFIG.LIVERELOAD.PORT);
  }
  if (CONFIG.LIVERELOAD.HOSTNAME) {
    $.set('livereload.hostname', CONFIG.LIVERELOAD.HOSTNAME);
  }

  if (ENV.FIS_MEDIA === 'production') {
    $.set('project.md5Length', CONFIG.HASH.LENGTH);
    $.set('project.md5Connector', CONFIG.HASH.CONNECTOR);
    $.match('*', {
      useHash: true
    });
    CONFIG.HASH.EXCEPT.forEach(function(reg) {
      $.match(reg, {
        useHash: false
      });
    });
  }


  if (CONFIG.USE_RELATIVE) {
    $.hook('relative-legal-html');
    $.match('*', {
      relative: CONFIG.USE_RELATIVE
    });
  }

  // help functions
  function type(obj) {
    return Object.prototype.toString.call(obj).toLowerCase().match(/\[object (.+)\]/)[1];
  }

  function cacheConfig(config) {
    var crossLangParser = {
      json: JSON.stringify,
      css: jsonToCss,
      scss: jsonToScss,
      less: jsonToLess,
      pug: function(config) {
        return '-\n' + INDENT + 'env = ' + JSON.stringify(config) + ';' +
          (INSERT_FINAL_NEWLINE ? EOL : '');
      },
      js: function(config) {
        return 'var env = ' + JSON.stringify(config) + ';' + (INSERT_FINAL_NEWLINE ? EOL : '');
      },
    };

    var changed = true;

    try {
      var oldConfig = JSON.parse(fs.readFileSync(ENV.SOURCE_FOLDER + '/_env/_env.json', CHARSET));
      changed = !oldConfig || JSON.stringify(oldConfig) !== JSON.stringify(config);
    } catch (_) {}

    CONFIG.ENV_LANG.forEach(function(lang) {
      var configFile = ENV.SOURCE_FOLDER + '/_env/_env.' + lang;
      var parser = crossLangParser[lang] || JSON.stringify;

      if (changed || !fs.existsSync(configFile)) {
        writeFileSync(configFile, parser(config));
      }
    });
  }

  function each(obj, fn) {
    if (type(obj) === 'array') {
      obj.forEach(fn);
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          fn(key, obj[key], obj);
        }
      }
    }
  }

  function writeFileSync(file, context) {
    if (mkdirsSync(file)) {
      fs.writeFileSync(file, context, CHARSET);
    } else {
      console.error('write file ' + file + 'failed.');
      process.exit(1);
    }
  }

  function mkdirsSync(dirpath, mode) {
    dirpath = path.normalize(dirpath);
    if (dirpath.slice(-1) !== path.sep) {
      dirpath = dirpath.slice(0, dirpath.lastIndexOf(path.sep) + 1);
    }
    if (!fs.existsSync(dirpath)) {
      var pathtmp;
      dirpath.split(path.sep).forEach(function(dirname) {
        if (pathtmp) {
          pathtmp = path.join(pathtmp, dirname);
        } else {
          pathtmp = dirname;
        }
        if (!fs.existsSync(pathtmp)) {
          fs.mkdirSync(pathtmp, mode);
        }
      });
    }
    return fs.existsSync(dirpath);
  }

  function jsonToCss(obj) {
    var css = [];
    each(obj, function(key, value) {
      var cssKey = INDENT + '--env-' + paramCase(key);
      css.push(cssKey + ': ' + value + ';');
    });

    return ':root {' + EOL + css.join(EOL) + EOL + '}' + (INSERT_FINAL_NEWLINE ? EOL : '');
  }

  function jsonToScss(obj) {
    var scss = [];

    each(obj, function(key, value) {
      var scssKey = '$env-' + paramCase(key);
      scss.push(scssKey + ': ' + value + ';');
    });

    return scss.join(EOL) + (INSERT_FINAL_NEWLINE ? EOL : '');
  }

  function jsonToLess(obj) {
    var less = [];
    each(obj, function(key, value) {
      var lessKey = '@env-' + paramCase(key);
      less.push(lessKey + ': ' + value + ';');
    });

    return less.join(EOL) + (INSERT_FINAL_NEWLINE ? EOL : '');
  }

  function paramCase(s) {
    return s.replace(/[A-Z]/g, function(s) {
      return '-' + s.toLowerCase();
    });
  }

  function toArray(s) {
    return s.split ? s.split(',') : slice.call(s);
  }

  function extend(dest) {
    var sources = toArray(arguments);
    sources.shift();
    sources.forEach(function(source) {
      each(source || {}, function(prop, value) {
        dest[prop] = value;
      });
    });
    return dest;
  }

  function parsePlugin(pluginName) {
    var reg = new RegExp([
      '^',
      '(?:fis|fis3)-',
      '(' + pluginTypes.join('|') + ')-',
      '(.*?)',
      '$'
    ].join(''));
    var match = pluginName.match(reg);
    return match && match[2] && {
      name: match[0],
      type: match[1],
      short: match[2],
    };
  }

  function getPluginOptions(pluginName) {
    var shortPluginName = parsePlugin(pluginName).short;
    var options = PLUGINS_CONFIG[pluginName] || PLUGINS_CONFIG[shortPluginName] || {};
    return options;
  }

  function getPlugin(pluginNames) {
    var plugins = [];

    if (pluginNames.__plugin) {
      return pluginNames;
    }
    if (!pluginNames) {
      return null;
    }
    toArray(pluginNames).forEach(function(pluginName) {
      var plugin;
      var shortPluginName;

      if (!pluginName) {
        return null;
      }
      if (pluginName.__plugin) {
        plugin = pluginName;
      } else {
        shortPluginName = parsePlugin(pluginName).short;
        plugin = $.plugin(shortPluginName, getPluginOptions(pluginName));
      }
      plugins.push(plugin);
    });

    return 1 === plugins.length ? plugins[0] : plugins;
  }

  function pluginToProperties(pluginNames) {
    var properties = {};
    toArray(pluginNames).forEach(function(pluginName) {
      var type = parsePlugin(pluginName).type;
      var plugin = getPlugin(pluginName);
      if (properties[type]) {
        properties[type] = properties[type].push ? properties[type] : [properties[type]];
        properties[type].push(plugin);
      } else {
        properties[type] = plugin;
      }
    });
    return properties;
  }

  function getExtsReg(ext, inline) {
    var exts = [];
    var prefix = '';

    if (ext.split && fileExts[ext]) {
      exts = toArray(fileExts[ext]);
      exts.unshift(ext);
    } else {
      exts = toArray(ext);
    }
    exts = 1 === exts.length ? exts : '{' + exts.join(',') + '}';
    if (true === inline) {
      prefix = '*.html:';
    } else if (false === inline) {
      prefix = '*.';
    } else {
      prefix = '{*.html:,*.}';
    }
    return prefix + exts;
  }

  preProcessors.forEach(function(data) {
    var exts = toArray(data.ext);
    var processor = {
      rExt: '.' + data.type,
    };
    // plugins
    var plugins = ['parser', 'lint'];

    fileExts[data.type] = fileExts[data.type] || [];
    fileExts[data.type] = fileExts[data.type].concat(exts);
    $.match(getExtsReg(exts), processor);

    processor = {};
    plugins.forEach(function(pluginType) {
      if (data[pluginType]) {
        processor[pluginType] = getPlugin(data[pluginType]);
      }
    });
    $.match(getExtsReg(exts), processor);
  });

  standardProcessors.forEach(function(data) {
    var processor = {};

    // lint can't used on preProcessor
    // and we only lint for production
    if (data.lint) {
      $.match(getExtsReg(toArray(data.type)), {
        lint: getPlugin(data.lint)
      });
    }

    ['useSprite'].forEach(function(type) {
      if (type in data) {
        processor[type] = data[type];
      }
    });

    // plugins
    ['preprocessor', 'optimizer', 'postprocessor'].forEach(function(type) {
      if (data[type]) {
        processor[type] = getPlugin(data[type]);
      }
    });

    $.match(getExtsReg(data.type), processor);
  });


  ['optimizer', 'lint'].forEach(function(type) {
    (CONFIG.IGNORE[type] || []).forEach(function(reg) {
      var settings = {};
      settings[type] = null;
      $.match(reg, settings);
    });
  });

  // standrad files should release
  // for inline include
  $.match('_' + getExtsReg(['png', 'jpg', 'gif', 'css', 'js', 'html', 'pug'], false), {
    release: '/' + ENV.TEMP_RESOURCE_FOLDER + '/$0',
    relative: '/',
  });

  // _*.html should not lint
  // _*.js should not lint
  $.match('_*', {
    lint: null,
    postprocessor: null,
  });

  // font/*.svg should not be compressed
  if (CONFIG.OPTIMIZER.SVG) {
    $.match('{fonts,font}/*.svg', {
      optimizer: null,
    });
  }

  $.match('::package', pluginToProperties('fis-spriter-csssprites'));

  if (ENV.FIS_MEDIA === 'production') {
    $.match('**', pluginToProperties('fis3-deploy-local-deliver'));
  }

  if (ENV.FIS_MEDIA === 'dev') {
    $.match('**', {
      optimizer: null
    });
  }

  // a empty config to avoid warning
  $.media(ENV.NODE_ENV).match('fisker', {});

})(global.fis);
