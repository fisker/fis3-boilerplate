const config = require('../../../project.config')

const {project} = config
const {build} = config
const environment = require('./env.js')
const codeStyle = require('../../code-style')
const package_ = require('../../../package.json')

function toArray(data) {
  data = data || []
  if (!Array.isArray(data)) {
    data = String(data).split(',')
  }
  return data.map((keyword) => String(keyword).trim()).filter(Boolean)
}

if (project.legacyIe < 9 && project.device === 'mobile') {
  project.legacyIe = 9
}

project.keywords = toArray(project.keywords)
project.styles = toArray(project.styles)
project.headScripts = toArray(project.headScripts)
project.scripts = toArray(project.scripts)

if (project.legacyIe < 9 && project.flexibleRem) {
  console.warn('rem unit might not work with ie < 9.')
}

if (environment.production) {
  delete environment.engine
  delete environment.computer
  delete environment.user
}

module.exports = Object.freeze({
  env: environment,
  project,
  build,
  codeStyle,
  package: package_,
})
