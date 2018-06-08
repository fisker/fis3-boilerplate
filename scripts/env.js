/* eslint strict: 0 */

module.exports = function(env, config, projectConfig) {
  var data = {
    device: config.DEVICE,
    legacyIe: config.LEGACY_IE,
    useRem: config.USE_REM,
    brandColor: config.BRAND_COLOR || null,
    debug: !env.IS_PRODUCTION
  }

  if (!env.IS_PRODUCTION) {
    data.computerName = env.COMPUTER_NAME
    data.userName = env.USER_NAME
  }

  return Object.assign({}, data, projectConfig)
}
