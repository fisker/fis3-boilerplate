;(function() {
  'use strict'

  "<%\n__inline('../../_config/_config.js')\n%>\n\nvar config = <%-JSON.stringify({\n  production: config.env.production\n})%>\n"

  // __inline('component/_pseudo.js')
  // __inline('component/_date-placeholder.js')
  // __inline('component/_number-input.js')
  // __inline('component/_meter.js')
  // __inline('component/_progress.js')
  // __inline('component/_number-password.js')

})()
