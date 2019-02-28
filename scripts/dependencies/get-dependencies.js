const path = require('path')
const getPackageFiles = require('./get-package-files')

function getDependencyInfo({name, version}) {
  const pkgLoc = require.resolve(`${name}/package.json`)
  const pkg = require(pkgLoc)
  const dir = path.dirname(pkgLoc)
  const files = getPackageFiles(
    {
      pkg,
      dir,
    },
    true
  )

  return {
    name,
    version,
    pkg,
    dir,
    files,
  }
}

function getDependencies(dir) {
  const pkg = require('../../package.json')
  const {dependencies = {}} = pkg
  const names = Object.keys(dependencies).sort()

  return names
    .map(name => ({name, version: dependencies[name]}))
    .map(getDependencyInfo)
}

module.exports = getDependencies
