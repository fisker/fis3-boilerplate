/* eslint strict: 0, camelcase: 0 */

function getPluginConfig(env, config) {
  var sassParserConfig = {
    includePaths: [],
    indentType: 'space',
    indentWidth: 2,
    linefeed: 'lf',
    omitSourceMapUrl: false,
    // outFile: '',
    outputStyle: 'expanded', // options: nested, expanded, compact, compressed
    precision: 8, // default: 5
    sourceComments: !env.IS_PRODUCTION,
    sourceMap: false,
    sourceMapContents: true,
    sourceMapEmbed: !env.IS_PRODUCTION
    // sourceMapRoot: ''
  }

  // prettier-ignore
  var browserslist = [
    'ie >= ' + config.LEGACY_IE,
    'and_chr >= 1',
    'and_ff >=1',
    'and_uc >=1',
    'android >= 2.1',
    'bb >= 7',
    'chrome >= 4', // default: >= 4
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
  ]

  return {
    'fis3-parser-node-sass-latest': sassParserConfig,
    'fis-parser-node-sass': sassParserConfig,
    'fis3-parser-dart-sass': sassParserConfig,
    'fis-parser-stylus2': {},
    'fis-parser-less-2.x': {},
    'fis3-postprocessor-autoprefixer-latest': {
      remove: false,
      browsers: browserslist
    },
    'fis-optimizer-uglify-js': {
      mangle: {
        except: 'exports, module, require, define'
      },
      compress: {
        drop_console: true
      }
    },
    'fis-optimizer-clean-css-2x': {
      advanced: false,
      aggressiveMerging: false,
      shorthandCompacting: false,
      roundingPrecision: 8, // default is 2
      compatibility:
        config.LEGACY_IE <= 8
          ? [
              '+properties.ieBangHack',
              '+properties.iePrefixHack',
              '+properties.ieSuffixHack',
              '-properties.merging',
              '+selectors.ie7Hack'
            ]
          : [],
      keepSpecialComments: 0
    },
    'fis-optimizer-png-compressor': {
      type:
        config.OPTIMIZER.PNG.LOSSY
          ? 'pngquant'
          : 'pngcrush',
      speed: 1
    },
    'fis-optimizer-jpeg-compressor': {
      progressive: config.OPTIMIZER.JPEG && config.OPTIMIZER.JPEG.PROGRESSIVE
    },
    'fis-spriter-csssprites': {
      margin: 10,
      layout: 'linear' // 'linear/matrix' default linear
    },
    'fis3-deploy-local-deliver': {
      to: './' + env.DIST_FOLDER
    },
    'fis-parser-coffee-script': {
      // header: true,
    },
    'fis-parser-babel-5.x': {
      blacklist: ['regenerator'],
      optional: ['asyncToGenerator'],
      stage: 3,
      sourceMaps: !env.IS_PRODUCTION
    },
    'fis-parser-babel-6.x': {
      presets: ['env', 'react'],
      sourceMaps: !env.IS_PRODUCTION
    },
    'fis3-parser-pug': {
      pretty: '  ',
      doctype: 'html'
    },
    'fis3-lint-htmlhint': {},
    'fis3-lint-eslint-noisy': {
      fix: config.FIX.JS,
      useEslintrc: true
    },
    'fis3-lint-stylelint': {
      fix: config.FIX.CSS
    },
    'fis3-optimizer-imagemin': {
      '.png': config.OPTIMIZER.PNG.LOSSY
        ? {
            upng: {
              cnum: 256
            }
          }
        : {
            pngcrush: {}
          }
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
        // 'a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u',
        // 'strike', 'big', 'small', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style'
      ], // List of tags that should not be reformatted
      extra_liners: [],
      wrap_line_length: 0 // Lines should wrap at next opportunity after this number of characters (0 disables)
    },
    'fis3-postprocessor-prettier': {}
  }
}

module.exports = getPluginConfig
