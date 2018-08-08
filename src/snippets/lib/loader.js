/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

'use strict'

const {
  project,
  env,
  createScript,
  createLink,
} = require('./common.js')

const path = require('path')
function getPackageInfo(pkgName) {
  let arr = require.resolve(pkgName).replace(/\\/g, '/').split('/')
  let dir = arr.slice(0, arr.lastIndexOf('node_modules') + 2).join('/')
  return require(path.join(path.normalize(dir), 'package.json'))
}


const loader = {
  dd_belatedpng() {
    if (project.device != 'mobile' && project.legacyIe <= 6) {
      const version = getPackageInfo('dd_belatedpng').version
      const file = env.production ? 'DD_belatedPNG_${version}.min.js' : 'DD_belatedPNG_${version}.js'
      const src = `/assets/vendors/dd_belatedpng/${version}/dist/${file}`
      return `<!--[if IE 6]>${createScript(src)}<script>DD_belatedPNG.fix('*')</script><![endif]-->`
    }
  },
  jquery() {
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
  html5shiv() {
    if (project.device != 'mobile' && project.legacyIe < 9) {
      const version = getPackageInfo('html5shiv').version
      const file = env.production ? 'html5shiv.min.js' : 'html5shiv.js'
      const src = `/assets/vendors/html5shiv/${version}/dist/${file}`
      return `<!--[if lt IE 9]>${createScript(src)}<![endif]-->`
    }
  },
  rem() {
    if (project.flexibleRem) {
      return createScript('/assets/scripts/component/_rem.js?__inline')
    }
  },
  vue() {
    const file = env.production ? 'vue.min.js' : 'vue.js'
    const version = getPackageInfo('vue').version

    return createScript(`/assets/vendors/vue/${version}/dist/${file}`)
  },
  'element-ui': function() {
    const version = getPackageInfo('element-ui').version
    return createScript(`/assets/vendors/element-ui/${version}/lib/index.js`)
  },
  'element-ui.css': function() {
    const version = getPackageInfo('element-ui').version
    return createLink(`/assets/vendors/element-ui/${version}/lib/theme-chalk/index.css`)
  },
  dom4() {
    const version = getPackageInfo('dom4').version
    return createScript(`/assets/vendors/dom4/${version}/build/dom4.js`)
  },
  'core-js': () => {
    const version = getPackageInfo('core-js').version
    return createScript(`/assets/vendors/core-js/${version}/client/shim.min.js`)
  },
  nprogress() {
    const version = getPackageInfo('nprogress').version
    return createScript(`/assets/vendors/nprogress/${version}/nprogress.min.js`)
  }
}

module.exports = loader
