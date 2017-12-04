/* eslint strict: 0, camelcase: 0 */

var fs = require('fs')
var path = require('path')
var fis = global.fis

function fixPackage(folder) {
  var file = path.join(folder, 'fis3-command-release', 'lib', 'watch.js')
  var code = ''
  try {
    code = fs.readFileSync(file, 'utf-8')
  } catch (err) {
    return
  }

  var newCode = code.replace(
    /(var safePathReg = \/.*\/)/g,
    'var safePathReg = /.*/'
  )
  if (newCode === code) {
    return
  }

  try {
    fs.writeFileSync(
      file +
        '-' +
        new Date()
          .toISOString()
          .replace(/\D/g, '')
          .slice(0, 8) +
        '.bak',
      code
    )
    fs.writeFileSync(file, newCode)
  } catch (err) {
    fis.log.warn('fis3可能无法监听到路径包含中文的文件的更新.\n你可以手动修改此文件[ %s ]', file)
  }
}

function fix() {
  fis.util.forEach(fis.require.paths, fixPackage)
}

module.exports.fix = fix
