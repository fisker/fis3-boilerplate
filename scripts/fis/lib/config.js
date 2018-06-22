'use strict'

var config = require('../../../project-config')
var project = config.project
var build = config.build
var env = require('./env.js')
var codeStyle = require('../../code-style/index.js')

if (project.device === 'mobile') {
  project.legacyIe = 9
}

if (project.legacyIe < 9 && project.flexibleRem) {
  console.warn('rem unit might not work with ie < 9.')
}

if (env.production) {
  delete env.engine
  delete env.computer
  delete env.user
}

module.exports = Object.freeze({
  env: env,
  project: project,
  build: build,
  codeStyle: codeStyle
})
