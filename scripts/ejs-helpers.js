/* eslint-env node, es6 */
/* eslint comma-dangle: 0, no-console: 0 */

function script(files) {
  files = Array.isArray(files) ? files : [files]
  return files
    .map(function (file) {
      return `<script src="${file}"></script>`
    })
    .join('\n')
}

function style(files) {
  files = Array.isArray(files) ? files : [files]
  return files
    .map(function (file) {
      return `<link href="${file}" rel="stylesheet">`
    })
    .join('\n')
}

module.exports = {
  script,
  style,
}
