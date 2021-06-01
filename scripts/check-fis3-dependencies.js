const path = require('path')
const fs = require('fs')
// eslint-disable-next-line import/no-unresolved
const fis = require('fis3')
fis.project.setProjectRoot(require('../project.config.js').build.src)

fis.log.throw = true

function getStdin() {
  const {stdin} = process
  return new Promise((resolve) => {
    let result = ''
    if (stdin.isTTY) {
      resolve(result)
      return
    }

    stdin.setEncoding('utf8')

    stdin.on('readable', () => {
      let chunk

      while ((chunk = stdin.read())) {
        result += chunk
      }
    })

    stdin.on('end', () => {
      resolve(result)
    })
  })
}

;(async function () {
  const input = await getStdin()
  let plugins = input
    .split('\n')
    .map((text) => {
      const match = text.match(/--\s*(.*?)\s+/)
      if (!match) {
        return null
      }
      const type = match[1]
      const re = /\[plugin `(.*?)`]/g
      const plugins = []
      let result
      while ((result = re.exec(text))) {
        plugins.push(result[1])
      }

      if (plugins.length === 0) {
        return null
      }

      return plugins.map((name) => `${type}-${name}`)
    })
    .filter(Boolean)

  plugins = plugins.reduce((accumulator, current) => [
    ...accumulator,
    ...(Array.isArray(current) ? current : [current]),
  ])

  plugins = [...new Set(plugins)]

  plugins = plugins.filter((name) => {
    try {
      fis.require(name)
      return false
    } catch {
      return true
    }
  })

  if (plugins.length !== 0) {
    const configFile = path.join(__dirname, 'fis/index.js')
    const source = fs.readFileSync(configFile, 'utf-8').replace('"', "'")

    plugins = plugins.map((name) => {
      if (source.includes(`'fis3-${name}'`)) {
        return `fis3-${name}`
      }
      if (source.includes(`'fis-${name}'`)) {
        return `fis-${name}`
      }

      return name
    })

    const confirmedPlugins = plugins.filter((name) => name.startsWith('fis'))
    const unConfirmedPlugins = plugins.filter((name) => !name.startsWith('fis'))

    if (confirmedPlugins.length !== 0) {
      console.log(`缺少插件,安装脚本:

npm install -global ${confirmedPlugins.join(' ')}
`)
    }

    if (unConfirmedPlugins.length !== 0) {
      for (const name of unConfirmedPlugins) {
        console.log(`缺少未知名称的插件 ${name} ,请确认插件名称后安装:
   npm install -global fis3-${name}
或 npm install -global fis-${name}
`)
      }
    }

    process.exit(1)
  }
})()
