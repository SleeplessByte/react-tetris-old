// Start by determining the build environment. The three main options are:
// - development: for development servers
// - test: for running tests or developing tests
// - production: for staging and production servers
//
// Additionally coverage and cli can be turned on changing the configuration significantly.
const ENV = process.env.NODE_ENV || 'development'

const __PROD__ = ENV === 'production'

const makeDebug = require('debug')
const debug = makeDebug('app:webpack:config:browser')
const debugPlugins = makeDebug('app:webpack:config:browser:plugins')
const debugRules = makeDebug('app:webpack:config:browser:rules')

const path = require('path')

const CSS_MAPS = !__PROD__
const CSS_LOADER_OPTIONS = {
  modules: false,
  importLoaders: 0,
  localIdentName: '[local]__[hash:base64:5]',
  sourceMap: CSS_MAPS
}
const CSS_LOADER_MODULES_OPTIONS = Object.assign(
  CSS_LOADER_OPTIONS, {
    modules: true,
    importLoaders: 1
  }
)

module.exports = function applyConfiguration (config) {
  debug('Browser configuration')

  const ExtractTextPlugin = require('extract-text-webpack-plugin')

  config.plugins.push(
    // Bundle all styles into a file, unless this is production.
    // https://github.com/webpack-contrib/extract-text-webpack-plugin
    //
    // In production we would like our service worker to update styles.
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: __PROD__,
      disable: !__PROD__
    })
  )

  debugPlugins('Added extract text plugin')

  // Transform our own .(p?css) files with PostCSS and CSS-modules
  config.module.rules.push({
    test: /\.((p(ost)?)?css)$/,
    include: [
      path.join(__dirname, '..', 'src')
    ],
    loader: ExtractTextPlugin.extract({
      fallback: {
        loader: 'style-loader',
        query: {
          singleton: true
        }
      },
      use: [
        {
          loader: 'css-loader',
          query: CSS_LOADER_MODULES_OPTIONS
        },
        { loader: 'postcss-loader' }
      ]
    })
  })
  debugRules('Transform our own .pcss files with PostCSS and CSS-modules')

  // Transform react toolbox. They are separated out because they have CSS modules turned on.
  config.module.rules.push({
    test: /\.((p(ost)?)?css)$/,
    include: [
      path.resolve(__dirname, '..', 'node_modules', 'react-toolbox')
    ],
    loader: ExtractTextPlugin.extract({
      fallback: {
        loader: 'style-loader',
        query: {
          singleton: true
        }
      },
      use: [
        {
          loader: 'css-loader',
          query: CSS_LOADER_MODULES_OPTIONS
        },
        { loader: 'postcss-loader' }
      ]
    })
  })
  debugRules('Transform react toolbox files with PostCSS and CSS-modules')

  // Transform everyone else' styles (with css modules turned off)
  config.module.rules.push({
    test: /\.((p(ost)?)?css)$/,
    exclude: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules', 'react-toolbox'),
      path.resolve(__dirname, '..', 'node_modules', 'mdi')
    ],
    loader: ExtractTextPlugin.extract({
      fallback:  {
        loader: 'style-loader',
        query: {
          singleton: true
        }
      },
      use: [
        {
          loader: 'css-loader',
          query: CSS_LOADER_OPTIONS
        },
        { loader: 'postcss-loader' }
      ]
    })
  })
  debugRules('Transform everyone else\' styles (with css modules turned off)')

  debug('Browser configuration done')
  return config
}
