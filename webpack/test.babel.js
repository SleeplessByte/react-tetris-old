import webpack from 'webpack'
import config from './base.babel'
import path from 'path'
import makeDebug from 'debug'
import { argv } from 'yargs'
import '../test/setup.js'

const ENV = process.env.NODE_ENV || 'development'

const __TEST__ = ENV === 'test'
const __COVERAGE__ = !argv.watch && (argv.coverage || process.env.COVERAGE === 'on') && __TEST__

const debug = makeDebug('app:webpack:config:test')
const debugPlugins = makeDebug('app:webpack:config:test:plugins')
const debugRules = makeDebug('app:webpack:config:test:rules')

debug('Test configuration')

// The named modules plugin transforms bundle ids into paths with a clear name so it's easier to trace errors and such.
config.plugins.unshift(new webpack.NamedModulesPlugin())
debugPlugins('Added the Named Modules Plugin')

config.target = 'node'
config.externals = [require('webpack-node-externals')()]

// CSS modules won't work on the server right here so don't
config.module.rules.push({
  test: /\.((p(ost)?)?css)$/,
  include: [
    path.join(__dirname, '..', 'src')
  ],
  loaders: ['css-loader/locals?modules', 'postcss-loader']
})
debugRules('Export class names for our own CSS-modules')

config.module.rules.push({
  test: /\.((p(ost)?)?css)$/,
  include: [
    path.resolve(__dirname, '..', 'node_modules', 'react-toolbox')
  ],
  loaders: ['css-loader/locals?modules', 'postcss-loader']
})
debugRules('Export class names for react-toolbox css modules')

config.module.rules.push({
  test: /\.((p(ost)?)?css)$/,
  exclude: [
    path.resolve(__dirname, '..', 'src'),
    path.resolve(__dirname, '..', 'node_modules', 'react-toolbox'),
    path.resolve(__dirname, '..', 'node_modules', 'mdi')
  ],
  loaders: ['null-loader']
})
debugRules('Null load styles')

config.module.rules.push({
  test: /\.tsx?$/,
  include: [
    path.resolve(__dirname, '..', 'test')
  ],
  loaders: [ { loader: 'awesome-typescript-loader' } ]
})
debugRules('Compile typescript tests')

if (__COVERAGE__) {
  let found = false
  for (const rule of config.module.rules) {
    const { loader } = rule
    if (!Array.isArray(loader)) {
      continue
    }

    for (const inner of loader) {
      const innerLoader = typeof inner === 'string' ? inner : inner.loader
      if (innerLoader === 'awesome-typescript-loader' || innerLoader === 'typescript-loader') {
        loader.unshift({
          loader: 'istanbul-instrumenter-loader',
          query: {
            esModules: true
          }
        })
        debugRules('Injected istanbul because __COVERAGE__ is enabled')
        found = true
        break
      }
    }

    if (found) {
      break
    }
  }
} else {
  debugRules('Skipping istanbul because __COVERAGE__ is not enabled')
}

module.exports = config

debug('Test configuration ready')
