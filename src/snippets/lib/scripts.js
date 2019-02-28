const {_, createScript, parsePackage} = require('./common.js')
const loader = require('./loader.js')

function loadScripts(scripts) {
  scripts = scripts || []
  scripts = Array.isArray(scripts) ? scripts : [scripts]

  return _.uniq(scripts)
    .filter(Boolean)
    .map(parsePackage)
    .map(function(mod) {
      if (mod.type === 'file') {
        return createScript(mod.file)
      }

      const modLoader = loader[mod.name] || loader.default

      return modLoader({
        ...mod,
        type: 'script',
      })
    })
    .filter(Boolean)
    .join('\n')
}

module.exports = loadScripts
