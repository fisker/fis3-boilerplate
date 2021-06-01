const fs = require('fs')
const path = require('path')
const flatDeep = require('../utils/flat-deep')
const getFiles = require('../utils/get-files')

function getPackageFiles({pkg: package_, dir: directory}, relative = false) {
  // let {files = []} = pkg

  // const isGlob = files.join('').includes('*')

  // // TODO: add glob support
  // if (files.length === 0 || isGlob) {
  //   files = getFiles(dir)
  // } else {
  //   files = files.map(file => {
  //     file = path.join(dir, file)

  //     if (!file.startsWith(dir) || !fs.existsSync(file)) {
  //       return []
  //     }

  //     return getFiles(file)
  //   })

  //   files = flatDeep(files)
  // }

  let files = getFiles(directory)

  if (relative) {
    files = files.map((file) => path.relative(directory, file))
  }

  return files
}

module.exports = getPackageFiles
