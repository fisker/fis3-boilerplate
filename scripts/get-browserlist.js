const {writeFileSync} = require('fs')
const path = require('path')
const config = require('./fis/lib/config.js')

const {project} = config

const browserslist = [
  `ie >= ${project.legacyIe}`,
  'and_chr >= 1',
  'and_ff >=1',
  'and_uc >=1',
  'android >= 2.1',
  'bb >= 7',
  'chrome >= 4', // default: >= 4
  // >=5: strip -webkit for border-radius
  'edge >= 12',
  'firefox >= 16', // default: >= 2
  // >=16: strip -moz for linear-gradient
  // >=16: strip -moz for animation
  'ie_mob >= 10',
  'ios_saf >= 3.2',
  'op_mini >= 5',
  'op_mob >= 12.1', // default: >= 10
  // >=12.1: strip -o for linear-gradient
  'opera >= 12.1', // default: >= 9
  // >=12.1: strip -o for animation
  'safari >= 3.1',
]

writeFileSync(
  path.join(__dirname, '../.browserslistrc'),
  ['# AUTO GENERATED FILE, DO NOT EDIT #', ...browserslist].join('\n')
)
