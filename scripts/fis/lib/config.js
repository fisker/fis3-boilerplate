const config = require('../../../project.config')
const {project} = config
const {build} = config
const env = require('./env.js')
const codeStyle = require('../../code-style/index.js')
const pkg = require('../../../package.json')

function toArray(data) {
  data = data || []
  if (!Array.isArray(data)) {
    data = String(data).split(',')
  }
  return data.map(keyword => String(keyword).trim()).filter(Boolean)
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

if (env.production) {
  delete env.engine
  delete env.computer
  delete env.user
}

module.exports = Object.freeze({
  env,
  project,
  build,
  codeStyle,
  package: pkg,
})
