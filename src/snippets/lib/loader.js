/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {
  project,
  env,
  createScript,
  createLink,
} = require('./common.js')

function loadNodeModules(mod) {
  console.log(require.resolve(mod))
}


const loader = {
  dd_belatedpng: function() {
    if (project.device != 'mobile' && project.legacyIe <= 6) {
      const file = env.production ? 'DD_belatedPNG_0.0.8a.min.js' : 'DD_belatedPNG_0.0.8a.js'
      const src = `/assets/vendors/dd_belatedpng/0.0.8a/dist/${file}`
      return `<!--[if IE 6]>${createScript(src)}<script>DD_belatedPNG.fix('*')</script><![endif]-->`
    }
  },
  jquery: function() {
    const file = env.production ? 'jquery.min.js' : 'jquery.js'

    function jquery(version) {
      return createScript(`/assets/vendors/jquery/${version}/dist/${file}`)
    }

    let html = []

    if (project.device != 'mobile' && project.legacyIe <= 8) {
      html.push(`<!--[if lt IE 9]>${jquery('1.12.4')}<![endif]-->`)
      html.push(`<!--[if gte IE 9]><!-->${jquery('2.2.4')}<!--<![endif]-->`)
    } else {
      html.push(jquery('3.3.1'))
    }

    return html.join('\n')
  },
  html5shiv: function() {
    if (project.device != 'mobile' && project.legacyIe < 9) {
      const file = env.production ? 'html5shiv.min.js' : 'html5shiv.js'
      const src = `/assets/vendors/html5shiv/3.7.3-pre/dist/${file}`
      return `<!--[if lt IE 9]>${createScript(src)}<![endif]-->`
    }
  },
  rem: function() {
    if (project.flexibleRem) {
      return createScript('/assets/scripts/component/_rem.js?__inline')
    }
  },
}

module.exports = loader
