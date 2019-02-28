const {_, project, env} = require('./common.js')

const scripts = require('./scripts.js')
const styles = require('./styles.js')

function meta(name, content) {
  if (typeof name === 'object') {
    const data = name
    return `<meta ${Object.keys(data)
      .map(function(key) {
        return `${_.escape(key)}="${_.escape(data[key])}"`
      })
      .join(' ')}>`
  }

  if (name === 'robots') {
    if (typeof content === 'object') {
      content = Object.keys(content).map(key =>
        content[key] ? key : `no${key}`
      )
    }
  }

  if (Array.isArray(content)) {
    content = content.join(',')
  } else if (typeof content === 'object') {
    content = Object.keys(content)
      .map(function(key) {
        return `${key}=${content[key]}`
      })
      .join(',')
  }

  return `<meta name="${_.escape(name)}" content="${_.escape(content)}">`
}

function head(config = {}) {
  let html = []

  html.push(
    meta({
      charset: 'UTF-8'
    })
  )

  if (project.device !== 'mobile') {
    html.push(
      meta({
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge,chrome=1'
      })
    )
    html.push(meta('renderer', 'webkit'))
    html.push(meta('force-rendering', 'webkit'))
  }

  if (project.device !== 'desktop') {
    html.push(meta('mobile-web-app-capable', 'yes'))
    html.push(meta('apple-touch-fullscreen', 'yes'))
    html.push(meta('apple-mobile-web-app-capable', 'yes'))
  }

  html.push(
    meta({
      name: 'google',
      value: 'notranslate'
    })
  )

  html.push(
    meta({
      'http-equiv': 'Cache-Control',
      content: 'no-siteapp'
    })
  )

  html.push(meta('robots', config.robots || project.robots))

  if (project.brandColor) {
    html.push(meta('theme-color', env.brandColor))
    html.push(meta('msapplication-navbutton-color', env.brandColor))
  }

  const viewport =
    project.device !== 'desktop'
      ? {
          width: 'device-width',
          'initial-scale': 1,
          'maximum-scale': 1,
          'minimum-scale': 1,
          'user-scalable': 'no',
          'shrink-to-fit': 'no',
          'viewport-fit': 'cover'
        }
      : {
          width: 'device-width',
          'initial-scale': 1,
          'shrink-to-fit': 'no'
        }

  html.push(meta('viewport', viewport))

  if (project.device !== 'desktop') {
    html.push(
      meta('format-detection', {
        telephone: 'no',
        email: 'no',
        address: 'no',
        date: 'no'
      })
    )
    html.push(meta('msapplication-tap-highlight', 'no'))
  }

  html = html.concat(scripts(config.scripts))

  if ('title' in config) {
    html.push(`<title>${_.escape(config.title || '')}</title>`)
    html.push(meta('keywords', config.keywords || ''))
    html.push(meta('description', config.description || ''))
  }

  html = html.concat(styles(config.styles))

  return html.filter(Boolean).join('\n')
}

module.exports = head
