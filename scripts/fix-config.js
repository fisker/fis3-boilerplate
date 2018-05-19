/* eslint strict: 0 */

module.exports = function(config) {
  if (config.DEVICE === 'mobile') {
    config.LEGACY_IE = 9
  }

  if (config.LEGACY_IE < 9 && config.USE_REM) {
    console.warn('rem unit might not work with ie < 9.')
  }

  return config
}
