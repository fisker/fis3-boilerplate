const fs = require('fs')
const path = require('path')
const flatDeep = require('../utils/flat-deep')
const getFiles = require('../utils/get-files')

function getPackageFiles({pkg, dir}, relative = false) {
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

  let files = getFiles(dir)

  if (relative) {
    files = files.map(file => path.relative(dir, file))
  }

  return files
}

module.exports = getPackageFiles
