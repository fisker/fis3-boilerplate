const fs = require('fs')
const path = require('path')

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), {
    recursive: true,
  })

  fs.copyFileSync(source, target)
}

module.exports = copyFile
