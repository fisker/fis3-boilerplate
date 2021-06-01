const fs = require('fs')
const path = require('path')

function mkdir(directory, options) {
  try {
    const stat = fs.statSync(directory)

    if (stat.isDirectory()) {
      return true
    }
  } catch {}

  try {
    fs.mkdirSync(directory, options)
  } catch {}
}

function mkdirP(directory, options) {
  try {
    return fs.mkdirSync(directory, options)
  } catch {}

  const array = path.normalize(directory).split(path.sep)
  let current = array.shift()

  for (const seg of array) {
    current = path.join(current, seg)
    mkdir(current, options)
  }
}

function copyFile(source, target) {
  mkdirP(path.dirname(target), {
    recursive: true,
  })

  fs.copyFileSync(source, target)
}

module.exports = copyFile
