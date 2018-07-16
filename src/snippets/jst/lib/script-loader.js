/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {
  project,
  env,
  createScript,
} = require('./common.js')

const loader = {
  dd_belatedpng: function() {
    if (project.device != 'mobile' && project.legacyIe <= 6) {
      return `<!--[if IE 6]>${createScript('/assets/vendors/dd_belatedpng/0.0.8a/dist/DD_belatedPNG_0.0.8a.min.js')}<script>DD_belatedPNG.fix('*')</script><![endif]-->`
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
      return `<!--[if lt IE 9]>${createScript('/assets/vendors/html5shiv/3.7.3-pre/dist/html5shiv.min.js')}<![endif]-->`
    }
  },
  rem: function() {
    if (project.flexibleRem) {
      return createScript('/assets/scripts/component/_rem.js?__inline')
    }
  },
}

module.exports = loader
