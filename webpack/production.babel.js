const config = require('./base.babel')

const makeDebug = require('debug')
const debug = makeDebug('app:webpack:config:production')
const debugPlugins = makeDebug('app:webpack:config:production:plugins')

debug('Production configuration')

const browserConfig = require('./_browser.babel')(config)
browserConfig.plugins.push(
  // Build the service worker and offline manifest.
  // https://github.com/NekR/offline-plugin
  new (require('offline-plugin'))({
    caches: 'all',
    responseStrategy: 'cache-first',
    updateStrategy: 'changed',
    externals: [
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://fonts.googleapis.com/css?family=Noto+Sans:400,700',
      'https://connect.facebook.net/en_US/sdk.js'
    ],
    relativePaths: false,
    AppCache: false,
    ServiceWorker: {
      output: 'sw.js',
      events: true
    },
    publicPath: '/'
  })
)

debugPlugins('Added the Offline plugin')

module.exports = browserConfig

debug('Production configuration ready')
