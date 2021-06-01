const {_, createLink, parsePackage} = require('./common.js')
const loader = require('./loader.js')

function loadStyles(styles) {
  styles = styles || []
  styles = Array.isArray(styles) ? styles : [styles]

  return _.uniq(styles || [])
    .filter(Boolean)
    .map(parsePackage)
    .map(function (module_) {
      if (module_.type === 'file') {
        return createLink(module_.file)
      }

      const moduleLoader = loader[module_] || loader.default

      return moduleLoader({
        ...module_,
        type: 'style',
      })
    })
    .filter(Boolean)
    .join('\n')
}

module.exports = loadStyles
