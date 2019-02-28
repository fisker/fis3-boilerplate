const path = require('path')
const dependencies = require('../../_config/dependencies.json')
const projectConfig = require('../../../project.config.js')
const VENDOR_DIR = path
  .relative(projectConfig.build.src, projectConfig.build.vendors)
  .replace(/\\/g, '/')

const {
  project,
  env,
  createScript,
  createLink,
  conditionHTML,
} = require('./common.js')

function getPackageEntry(options = {}, ...rest) {
  if (typeof options === 'string') {
    options = {
      name: options,
    }
  }

  options = Object.assign({}, options, ...rest)

  const {pkg} = dependencies[options.name]
  const {version, name} = pkg

  let file = options.file || pkg.file || ''

  if (!file) {
    if (options.type === 'style') {
      file = pkg.style
    } else {
      file = pkg.unpkg || pkg.jsdelivr || pkg.browser || pkg.main
    }
  }

  if (options.min) {
    file = file.replace(/\.(js|css)$/, '.min.$1')
  }

  file = `/${VENDOR_DIR}/${name}/${version}/${file}`

  return options.type === 'style' ? createLink(file) : createScript(file)
}

const loader = {
  default: getPackageEntry,
  dd_belatedpng(pkg) {
    if (project.device === 'mobile' || project.legacyIe > 6) {
      return ''
    }

    const script = getPackageEntry({
      ...pkg,
      min: env.production,
    })

    return conditionHTML(
      `${script}\n<script>DD_belatedPNG.fix('*')</script>`,
      6,
      80 - 6
    )
  },
  jquery(pkg) {
    const opt = {
      min: env.production,
    }

    if (project.device !== 'mobile' && project.legacyIe <= 8) {
      return [
        conditionHTML(getPackageEntry('jquery-v1', opt), '< 9', 80 - 6),
        conditionHTML(getPackageEntry('jquery-v2', opt), '>= 9', 80 - 6),
      ].join('\n')
    }

    return getPackageEntry(pkg, opt)
  },
  html5shiv(pkg) {
    if (project.device === 'mobile' || project.legacyIe >= 9) {
      return ''
    }
    const script = getPackageEntry({
      ...pkg,
      min: env.production,
    })
    return conditionHTML(script, '< 9', 80 - 6)
  },
  rem() {
    if (!project.flexibleRem) {
      return ''
    }

    return `<!-- prettier-ignore -->\n${createScript(
      '/assets/scripts/component/_rem.js.jst?__inline'
    )}`
  },
}

module.exports = loader
