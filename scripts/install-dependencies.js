const fs = require('fs')
const path = require('path')
const projectConfig = require('../project.config')
const getDependencies = require('./dependencies/get-dependencies')
const flatDeep = require('./utils/flat-deep')
const copyFile = require('./utils/copy-file')

const VENDOR_DIR = projectConfig.build.vendors
const CACHE_FILE = path.join(
  projectConfig.build.src,
  '_config/dependencies.json'
)

const dependencies = getDependencies()
const files = flatDeep(
  dependencies.map(({pkg: package_, dir: directory, files}) =>
    files.map((file) => ({
      source: path.join(directory, file),
      target: path.join(VENDOR_DIR, package_.name, package_.version, file),
    }))
  )
).filter(
  ({source}) => !['.eslintrc', '.eslintrc.json'].includes(path.basename(source))
)

for (const {source, target} of files) {
  copyFile(source, target)
}

const cache = dependencies.reduce(
  (accumulator, current) =>
    Object.assign(accumulator, {[current.name]: current}),
  {}
)

fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
