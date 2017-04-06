const webpack = require('webpack')
const config = require('./base.babel')

const makeDebug = require('debug')
const debug = makeDebug('app:webpack:config:development')
const debugPlugins = makeDebug('app:webpack:config:development:plugins')

debug('Development configuration')

// The named modules plugin transforms bundle ids into paths with a clear name so it's easier to trace errors and such.
config.plugins.unshift(new webpack.NamedModulesPlugin())
debugPlugins('Added the Named Modules Plugin')

module.exports = require('./_browser.babel')(config)

debug('Development configuration ready')
