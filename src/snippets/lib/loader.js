const path = require('path')
const dependencies = require('../../_config/dependencies.json')
const projectConfig = require('../../../project.config.js')

const VENDOR_DIR = path
  .relative(projectConfig.build.src, projectConfig.build.vendors)
  .replace(/\\/g, '/')

const {
  project,
  env: environment,
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

  const {pkg: package_} = dependencies[options.name]
  const {version, name} = package_

  let file = options.file || package_.file || ''

  if (!file) {
    if (options.type === 'style') {
      file = package_.style
    } else {
      file =
        package_.unpkg || package_.jsdelivr || package_.browser || package_.main
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
  dd_belatedpng(package_) {
    if (project.device === 'mobile' || project.legacyIe > 6) {
      return ''
    }

    const script = getPackageEntry({
      ...package_,
      min: environment.production,
    })

    return conditionHTML(
      `${script}\n<script>DD_belatedPNG.fix('*')</script>`,
      6,
      80 - 6
    )
  },
  jquery(package_) {
    const opt = {
      min: environment.production,
    }

    if (project.device !== 'mobile' && project.legacyIe <= 8) {
      return [
        conditionHTML(getPackageEntry('jquery-v1', opt), '< 9', 80 - 6),
        conditionHTML(getPackageEntry('jquery-v2', opt), '>= 9', 80 - 6),
      ].join('\n')
    }

    return getPackageEntry(package_, opt)
  },
  html5shiv(package_) {
    if (project.device === 'mobile' || project.legacyIe >= 9) {
      return ''
    }
    const script = getPackageEntry({
      ...package_,
      min: environment.production,
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
