/* eslint-env node, es6 */
'use strict'

const fis = require('fis3')
fis.project.setProjectRoot(require('../project.config.js').build.src)
fis.log.throw = true

function getStdin() {
  const stdin = process.stdin
  return new Promise(resolve => {
    let ret = ''
    if (stdin.isTTY) {
      resolve(ret)
      return
    }

    stdin.setEncoding('utf8')

    stdin.on('readable', () => {
      let chunk

      while ((chunk = stdin.read())) {
        ret += chunk
      }
    })

    stdin.on('end', () => {
      resolve(ret)
    })
  })
}

;(async function() {
  var input = await getStdin()
  var plugins = input
    .split('\n')
    .map(text => {
      var match = text.match(/--\s*(.*?)\s+/)
      if (!match) {
        return
      }
      var type = match[1]
      var re = /\[plugin `(.*?)`\]/g
      var plugins = []
      var result
      while ((result = re.exec(text))) {
        plugins.push(result[1])
      }

      if (!plugins.length) {
        return
      }

      return plugins.map(name => type + '-' + name)
    })
    .filter(Boolean)

  plugins = plugins.reduce((acc, current) =>
    acc.concat(current.push ? current : [current])
  )

  plugins = [...new Set(plugins)]

  plugins = plugins.filter(name => {
    try {
      fis.require(name)
      return false
    } catch (err) {
      return true
    }
  })

  if (plugins.length) {
    var configFile = require('path').join(__dirname, 'fis/index.js')
    var source = require('fs')
      .readFileSync(configFile, 'utf-8')
      .replace('"', "'")

    plugins = plugins.map(name => {
      if (source.includes("'fis3-" + name + "'")) {
        return 'fis3-' + name
      }
      if (source.includes("'fis-" + name + "'")) {
        return 'fis-' + name
      }

      return name
    })

    var confirmedPlugins = plugins.filter(name => name.startsWith('fis'))
    var unConfirmedPlugins = plugins.filter(name => !name.startsWith('fis'))

    if (confirmedPlugins.length) {
      console.log(`缺少插件,安装脚本:

npm install -global ${confirmedPlugins.join(' ')}
`)
    }

    if (unConfirmedPlugins.length) {
      unConfirmedPlugins.forEach(name => {
        console.log(`缺少未知名称的插件 ${name} ,请确认插件名称后安装:
   npm install -global fis3-${name}
或 npm install -global fis-${name}
`)
      })
    }

    process.exit(1)
  }
})()
