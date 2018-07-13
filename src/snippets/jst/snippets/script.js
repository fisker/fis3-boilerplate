/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const _ = global.fis.util
const {project, env} = require('../../../../scripts/fis/lib/config.js')

function script(src) {
  return `<script src="${_.escape(src)}"></script>`
}

const loader = {
  dd_belatedpng: function() {
    if (project.device != 'mobile' && project.legacyIe <= 6) {
      return `<!--[if IE 6]>${script('/assets/vendors/dd_belatedpng/0.0.8a/dist/DD_belatedPNG_0.0.8a.min.js')}<script>DD_belatedPNG.fix('*')</script><![endif]-->`
    }
  },
  jquery: function() {
    const file = env.production ? 'jquery.min.js' : 'jquery.js'

    function jquery(version) {
      return script(`/assets/vendors/jquery/${version}/dist/${file}`)
    }

    let html = ''

    if (project.device != 'mobile' && project.legacyIe <= 8) {
      html += `<!--[if lt IE 9]>${jquery('1.12.4')}<![endif]-->`
      html += `<!--[if gte IE 9]><!-->${jquery('2.2.4')}<!--<![endif]-->`
    } else {
      html += jquery('3.3.1')
    }

    return html
  },
}

function loadModule(scripts) {
  scripts = Array.isArray(scripts) ? scripts : [scripts]

  return (scripts || []).map(function(mod) {
    return loader[mod] ? loader[mod]() : script(mod)
  }).join('\n')
}

module.exports = loadModule

