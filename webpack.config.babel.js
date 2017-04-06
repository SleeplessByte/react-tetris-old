const path = require('path')
const makeDebug = require('debug')
const debug = makeDebug('app:webpack:config')

// Start by determining the build environment. The three main options are:
// - development: for development servers
// - test: for running tests or developing tests
// - production: for staging and production servers
//
// Additionally coverage and cli can be turned on changing the configuration significantly.
const ENV = process.env.NODE_ENV || 'development'

const __DEV__ = ENV === 'development'
const __PROD__ = ENV === 'production'
const __TEST__ = ENV === 'test'

function config () { // eslint-disable-line complexity
  if (__PROD__) {
    return 'production'
  }
  if (__TEST__) {
    return 'test'
  }
  if (__DEV__) {
    return 'development'
  }

  throw new Error(`${ENV} is not a valid environment`)
}

debug('Loading webpack configuration')
debug('Environment is %s', ENV)

const configuration = config()
const resolvedPath = path.resolve(__dirname, 'webpack', `${configuration}.babel.js`)

debug('Configuration is %s', configuration)
debug('Loading from %s', resolvedPath)

module.exports = require(resolvedPath)
