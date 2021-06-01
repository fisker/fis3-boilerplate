const config = require('./config.js')
const ejsHelpers = require('../../ejs-helpers.js')

const {env: environment} = config
const {project} = config
const {build} = config

function getPluginConfig() {
  const sassParserConfig = {
    includePaths: [],
    indentType: 'space',
    indentWidth: 2,
    linefeed: 'lf',
    omitSourceMapUrl: false,
    // outFile: '',
    outputStyle: 'expanded', // options: nested, expanded, compact, compressed
    precision: 8, // default: 5
    sourceComments: !environment.production,
    sourceMap: false,
    sourceMapContents: true,
    sourceMapEmbed: !environment.production,
    // sourceMapRoot: ''
  }

  // prettier-ignore
  const browserslist = require('../../get-browserlist')

  const uglifyJSConfig = {
    mangle: {
      reserved: ['exports', 'module', 'require', 'define'],
    },
    compress: {
      drop_console: environment.production,
    },
    ie8: project.legacyIe <= 8,
    sourceMap: build.sourceMap || !environment.production,
  }

  const cleanCSSConfig = {
    compatibility:
      project.legacyIe < 7
        ? 'ie7,+properties.iePrefixHack'
        : `ie${project.legacyIe}`,
    sourceMap: build.sourceMap || !environment.production,
  }

  return {
    'fis3-parser-node-sass-latest': sassParserConfig,
    'fis-parser-node-sass': sassParserConfig,
    'fis3-parser-dart-sass': sassParserConfig,
    'fis-parser-stylus2': {},
    'fis-parser-less-2.x': {},
    'fis3-postprocessor-autoprefixer-latest': {
      remove: false,
      browsers: browserslist,
    },
    'fis3-optimizer-uglifyjs': uglifyJSConfig,
    'fis3-optimizer-terser': uglifyJSConfig,
    'fis3-optimizer-cleancss': cleanCSSConfig,
    'fis-spriter-csssprites': {
      margin: 10,
      layout: 'linear', // 'linear/matrix' default linear
    },
    'fis3-deploy-local-deliver': {
      to: './dist',
    },
    'fis-parser-coffee-script': {
      // header: true,
    },
    'fis-parser-babel-5.x': {
      blacklist: ['regenerator'],
      optional: ['asyncToGenerator'],
      stage: 3,
      sourceMaps: !environment.production,
    },
    'fis-parser-babel-6.x': {
      presets: ['env', 'react'],
      sourceMaps: !environment.production,
    },
    'fis3-parser-pug': {
      pretty: '  ',
      doctype: 'html',
    },
    'fis3-lint-htmlhint': {},
    'fis3-lint-eslint-noisy': {
      fix: build.fix.js,
      useEslintrc: true,
    },
    'fis3-lint-stylelint': {
      fix: build.fix.css,
    },
    'fis3-optimizer-imagemin': {
      '.png': build.optimize.png.lossy
        ? {
            upng: {
              cnum: 256,
            },
          }
        : {
            pngcrush: {},
          },
    },
    'fis3-postprocessor-html': {
      brace_style: 'collapse', // [collapse|expand|end-expand|none] Put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are
      end_with_newline: true, // End output with newline
      indent_char: ' ', // Indentation character
      indent_handlebars: false, // e.g. {{#foo}}, {{/foo}}
      indent_inner_html: false, // Indent <head> and <body> sections
      indent_scripts: 'normal', // [keep|separate|normal]
      indent_size: 2, // Indentation size
      max_preserve_newlines: 0, // Maximum number of line breaks to be preserved in one chunk (0 disables)
      preserve_newlines: true, // Whether existing line breaks before elements should be preserved (only works before elements, not inside tags or for text)
      unformatted: [
        'script',
        'style',
        // 'a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u',
        // 'strike', 'big', 'small', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style'
      ], // List of tags that should not be reformatted
      extra_liners: [],
      wrap_line_length: 0, // Lines should wrap at next opportunity after this number of characters (0 disables)
    },
    'fis3-postprocessor-prettier': {},
    'fis3-parser-ejs': {
      data: {
        _: ejsHelpers,
        ...config,
      },
      options: {
        outputFunctionName: 'echo',
        // rmWhitespace: true,
        debug: !environment.production,
      },
    },
    'fis3-parser-lodash-template': {
      data: config,
      options: {},
    },
  }
}

module.exports = getPluginConfig()
