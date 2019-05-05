const fs = require('fs')
const path = require('path')

function mkdir(dir, options) {
  try {
    const stat = fs.statSync(dir)

    if (stat.isDirectory()) {
      return true
    }
  } catch (_) {}

  try {
    fs.mkdirSync(dir, options)
  } catch (_) {}
}

function mkdirP(dir, options) {
  try {
    return fs.mkdirSync(dir, options)
  } catch (_) {}

  const arr = path.normalize(dir).split(path.sep)
  let current = arr.shift()

  for (const seg of arr) {
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
