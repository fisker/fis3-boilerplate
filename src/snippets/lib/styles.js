const {_, createLink, parsePackage} = require('./common.js')
const loader = require('./loader.js')

function loadStyles(styles) {
  styles = styles || []
  styles = Array.isArray(styles) ? styles : [styles]

  return _.uniq(styles || [])
    .filter(Boolean)
    .map(parsePackage)
    .map(function(mod) {
      if (mod.type === 'file') {
        return createLink(mod.file)
      }

      const modLoader = loader[mod] || loader.default

      return modLoader({
        ...mod,
        type: 'style',
      })
    })
    .filter(Boolean)
    .join('\n')
}

module.exports = loadStyles
