const fs = require('fs')
const path = require('path')
const flatDeep = require('./flat-deep')

function getFiles(dir) {
  const stat = fs.statSync(dir)

  if (stat.isFile()) {
    return [dir]
  }

  const files = fs.readdirSync(dir).map(file => getFiles(path.join(dir, file)))

  return flatDeep(files)
}

module.exports = getFiles
