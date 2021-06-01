const fs = require('fs')
const path = require('path')

const {fis} = global

function fixPackage(folder) {
  const file = path.join(folder, 'fis3-command-release', 'lib', 'watch.js')
  let code = ''
  try {
    code = fs.readFileSync(file, 'utf-8')
  } catch {
    return
  }

  const newCode = code.replace(
    /(let safePathReg = \/.*\/)/g,
    'let safePathReg = /.*/'
  )
  if (newCode === code) {
    return
  }

  try {
    fs.writeFileSync(
      `${file}-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}.bak`,
      code
    )
    fs.writeFileSync(file, newCode)
  } catch {
    fis.log.warn(
      'fis3可能无法监听到路径包含中文的文件的更新.\n你可以手动修改此文件[ %s ]',
      file
    )
  }
}

function fix() {
  for (const file of fis.require.paths) {
    fixPackage(file)
  }
}

fix()
