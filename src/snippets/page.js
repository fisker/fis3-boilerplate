const {project} = require('./lib/common.js')

const page = {
  head: {
    styles: [...project.styles],
    scripts: [...project.headScripts],
  },
  header: {},
  footer: {
    scripts: [...project.scripts],
  },
}

module.exports = page
