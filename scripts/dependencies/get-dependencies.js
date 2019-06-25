const path = require('path')
const getPackageFiles = require('./get-package-files')

function getDependencyInfo({name, version}) {
  const packageLocation = require.resolve(`${name}/package.json`)
  const package_ = require(packageLocation)
  const directory = path.dirname(packageLocation)
  const files = getPackageFiles(
    {
      pkg: package_,
      dir: directory,
    },
    true
  )

  return {
    name,
    version,
    pkg: package_,
    dir: directory,
    files,
  }
}

function getDependencies(directory) {
  const package_ = require('../../package.json')
  const {dependencies = {}} = package_
  const names = Object.keys(dependencies).sort()

  return names
    .map(name => ({name, version: dependencies[name]}))
    .map(getDependencyInfo)
}

module.exports = getDependencies
