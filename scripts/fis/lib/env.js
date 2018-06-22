/* eslint-env node */

'use strict'

var ENV = process.env.NODE_ENV || (global.fis && global.fis.project.currentMedia())

module.exports = {
  production: ENV === 'production',
  engine: process.version, // node 版本
  computer: process.env.COMPUTERNAME,
  user: process.env.USERNAME
}
