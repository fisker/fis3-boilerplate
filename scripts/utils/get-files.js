const fs = require('fs')
const path = require('path')
const flatDeep = require('./flat-deep')

function getFiles(directory) {
  const stat = fs.statSync(directory)

  if (stat.isFile()) {
    return [directory]
  }

  const files = fs
    .readdirSync(directory)
    .map(file => getFiles(path.join(directory, file)))

  return flatDeep(files)
}

module.exports = getFiles
