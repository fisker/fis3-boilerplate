const {_, createScript, parsePackage} = require('./common.js')
const loader = require('./loader.js')

function loadScripts(scripts) {
  scripts = scripts || []
  scripts = Array.isArray(scripts) ? scripts : [scripts]

  return _.uniq(scripts)
    .filter(Boolean)
    .map(parsePackage)
    .map(function(module_) {
      if (module_.type === 'file') {
        return createScript(module_.file)
      }

      const moduleLoader = loader[module_.name] || loader.default

      return moduleLoader({
        ...module_,
        type: 'script',
      })
    })
    .filter(Boolean)
    .join('\n')
}

module.exports = loadScripts
