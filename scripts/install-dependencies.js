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
  dependencies.map(({pkg, dir, files}) =>
    files.map(file => ({
      source: path.join(dir, file),
      target: path.join(VENDOR_DIR, pkg.name, pkg.version, file),
    }))
  )
)

for (const {source, target} of files) {
  copyFile(source, target)
}

const cache = dependencies.reduce(
  (acc, current) => Object.assign(acc, {[current.name]: current}),
  {}
)

fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
