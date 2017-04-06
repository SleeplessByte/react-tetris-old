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

const webpack = require('webpack')
const makeDebug = require('debug')
const debug = makeDebug('app:webpack:config:base')
const debugEnvironment = makeDebug('app:webpack:config:base:environment')
const debugPlugins = makeDebug('app:webpack:config:base:plugins')
const debugRules = makeDebug('app:webpack:config:base:rules')

const argv = require('yargs').argv
const path = require('path')
const dotenv = require('dotenv')

const __COVERAGE__ = !argv.watch && (argv.coverage || process.env.COVERAGE === 'on') && __TEST__
const __CLI__ = (argv.cli || process.env.CI === 'on')

debugEnvironment(`Environment ${ENV} with coverage=${__COVERAGE__} and cli=${__CLI__}.`)

if (!__DEV__ && !__PROD__ && !__TEST__) {
  // Make sure the environment exists or the configuration will be in an undefined but buildable state.
  throw new Error(`${ENV} is not a valid environment`)
}

// Parse the arguments and set options based on environment and arguments
const SERVICE_WORKER = process.env.SERVICE_WORKER || __PROD__
const HOT = argv.hot || false
const HOT_ONLY = argv.hotOnly || false

debugEnvironment(`This is HOT: ${HOT} ONLY: ${HOT_ONLY}`)

const JS_MAPS = !__PROD__

// Each key will be replaced wich each value and values are loaded from the a .env file if that's available. However
// if a value is provided through the environment already, it won't be loaded by dotenv. So even though dotenv will
// override anything in there, it's a safe process and environment variables take precedent over .env variables.
const env = Object.assign({
  'FACEBOOK_APP_ID_DEV': process.env.FACEBOOK_APP_ID_DEV,
  'FACEBOOK_APP_ID': process.env.FACEBOOK_APP_ID
}, dotenv.config({ silent: __CLI__ || __PROD__ }).parsed)

debugEnvironment(`Environment assigned ${Object.keys(env).length} variables.`)

// These definitions will be passed to a plugin later and each key in the webpack source files will be replaced by the
// value. This is an exact replacement and can be anything. Strings here are put into quotes so that when they are
// replaced, they are still string.
let DEFINITIONS = {
  'process.env.NODE_ENV': JSON.stringify(ENV),
  'process.env.SERVICE_WORKER': `'${SERVICE_WORKER ? 'on' : 'off'}'`,
  '__PROD__': __PROD__,
  '__DEV__': __DEV__,
  '__TEST__': __TEST__,
  '__COVERAGE__': __COVERAGE__
}

Object.keys(env).forEach((key) => {
  const value = JSON.stringify(env[key])
  DEFINITIONS[`process.env.${key}`] = value
  const missing = value === undefined || value === '' || value === '""'
  debugEnvironment(`${missing ? '☐' : '☑'} ${key} was ${missing ? 'not ' : ''}loaded. ${__DEV__ ? `[${value}]` : ''}`)
})

debugEnvironment(`Environment assigned ${Object.keys(DEFINITIONS).length} definitions.`)

// These constants will be filled before building the configuration
const plugins = []
const rules = []
const entry = {}

// Here the plugin definitions start. Each plugin has commentary on what it does, why it's added or in a conditional
// bracket and a link to its source.
debug(`Defining plugins`)

plugins.push(
  // Don't continue when there are errors
  new webpack.NoEmitOnErrorsPlugin(),

  // Check for watch analyzerMode
  // https://github.com/webpack/webpack/issues/3460
  new (require('awesome-typescript-loader').CheckerPlugin)(),

  // Resolve paths for Typescript 2+ baseUrl and paths.
  // https://www.typescriptlang.org/docs/handbook/module-resolution.html
  // https://github.com/s-panferov/awesome-typescript-loader#advanced-path-resolution-in-typescript-20
  new (require('awesome-typescript-loader').TsConfigPathsPlugin)({
    configFileName: 'tsconfig.json'
  }),

  // Ignore certain files and paths from being bundled at all.
  // https://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
  // Right now we only support the default locale (en_US) and thus ignore all the locale files in moment and
  // moment-timezone to minimize the bundle.
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

  // Compress all the files with the default settings, by preparing them with gzip compression source that they may be
  // delivered instead.
  // https://github.com/webpack-contrib/compression-webpack-plugin
  new (require('compression-webpack-plugin'))(),

  // Define the constants. Webpack will replace all keys in the object by the value in the object passed.
  // https://webpack.js.org/plugins/define-plugin/
  new webpack.DefinePlugin(DEFINITIONS),

  // Check for circular dependencies and break out if it fails.
  // https://github.com/aackerman/circular-dependency-plugin
  // Circular dependencies will make imports resolve to null, as the first time a file is refering its exports, not
  // all will be available. This breaks the build when this occurs and displays the cycle.
  new (require('circular-dependency-plugin'))({
    exclude: /node_modules/,
    failOnError: true
  }),
)

if (!__TEST__) {
  // In the test environment these plugins may not work as expected, thus are excluded when running a test.
  // This should be resolved and these should be moved to the "always" group above.
  plugins.push(
    // The chunks plugin bundles common code together into a chunk
    // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
    //
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),

    // Code split common bundlewebpack --profile --json > stats.json
    new webpack.optimize.CommonsChunkPlugin({
      async: 'commonlazy.js',
      children: true
    }),

    // Build the index.html with the bundle.js and optional styles.css
    // https://github.com/jantimon/html-webpack-plugin
    new (require('html-webpack-plugin'))({
      template: './index.html',
      minify: { collapseWhitespace: __PROD__ }
    }),

    // Copy assets over to the root of the distribution folder.
    // https://github.com/kevlened/copy-webpack-plugin
    new (require('copy-webpack-plugin'))([
      { from: './manifest.json', to: './' },
      { from: './favicon.ico', to: './' }
    ])
  )

  debugPlugins(`Added the HTML webpack plugin and copied assets.`)
}

debugPlugins(`Added ${plugins.length} plugins.`)

// Here the rules definitions start. These are loaders, regular, post and pre, that will be used to load files and
// process them using webpack before being outputted.
debug('Defining rules.')

if (JS_MAPS) {
  // Load sourcemaps for all the included node modules. These sourcemaps are preloaded so that they may be used when
  // our own sourcemaps are created. The excluded node modules fail to have precompiles sourcemaps and thus have to
  // be excluded.
  rules.push({
    test: /\.jsx?$/,
    enforce: 'pre',
    exclude: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'src', 'dist'),
      path.resolve(__dirname, '..', 'node_modules', 'intl-messageformat-parser'),
      path.resolve(__dirname, '..', 'node_modules', 'intl-relativeformat'),
      path.resolve(__dirname, '..', 'node_modules', 'intl-messageformat'),
      path.resolve(__dirname, '..', 'node_modules', 'intl-format-cache')
    ],
    loader: 'source-map-loader'
  })

  debugRules('Added source-map-loader.')
}

rules.push(
  {
    // Transform our (js and jsx) files with Babel
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: {
      loader: 'babel-loader',
      options: {
        sourceMaps: JS_MAPS ? 1 : 0,
        plugins: __COVERAGE__ ? [] : []
      }
    }
  }, {
    // Transform our (ts and tsx) files with Typescript and Babel
    test: /\.tsx?$/,
    exclude: [
      /node_modules/,
      path.resolve(__dirname, '..', 'test')
    ],
    loader: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          babelOptions: {
            sourceMaps: JS_MAPS ? 1 : 0
          }
        }
      }
    ]
  }, {
    // Import images using the image loader
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: [
      {
        loader: 'url-loader',
        query: {
          limit: 1024 * 1024 * 0.5
        }
      },
      {
        loader: 'img-loader',
        query: {
          progressive: true
        }
      }
    ]
  }, {
    // Files that should be delivered rawly
    test: /\.(xml|html|txt|md)$/,
    loader: 'raw-loader'
  }, {
    // Fonts are using the file loader in production
    test: /\.(woff2?|ttf|eot)(\?.*)?$/i,
    loader: __PROD__ ? {
      loader: 'file-loader',
      options: {
        name: '[path][name]_[hash:base64:5].[ext]'
      }
    } : {
      loader: 'url-loader'
    }
  }
)

debugRules(`Added ${rules.length} rules`)

// Define the entry points for this app
//
// All the entries will be served up
//
entry['app'] = []
entry['app'].push('babel-polyfill')
debug('Added babel-polyfill as entry')

if (HOT) {
  entry['app'].push('react-hot-loader/patch')
  debug('Added react-hot-loader/patch as entry')
}

entry['app'].push('./styles/base.pcss')
debug('Added styles entry')

entry['app'].push('./index.ts')
debug('Added javascript entry')

// Define the aliases
//
const aliases = [
  'components',
  'interfaces',
  'containers',
  'routes',
  'static',
  'util',
  'styles',
  'theme',
  'services'
]

module.exports =
{
  context: path.resolve(__dirname, '..', 'src'),

  // Defines the files that are loaded and put in the html.
  entry,

  // This is where the build output goes
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/',
    filename: `${HOT ? '' : '[chunkhash].'}[name].js`,
    chunkFilename: `${HOT ? '' : '[chunkhash].'}[name].js`
  },

  // Resolve for webpack imports
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.sass', '.pcss', '.css'],

    // Base directories so you can import something inside src or node_modules without the need to type out src or
    // node_modules. The order is important. This allows us to override node_modules in src. Finally also allow loading
    // directly from the webpack node modules
    modules: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules'),
      'node_modules'
    ],

    alias: aliases.reduce((alias, current) => {
      alias[current] = path.resolve(__dirname, '..', 'src', current)
      return alias
    }, {
      test: path.resolve(__dirname, '..', 'test')
    })
  },

  module: { rules },

  plugins,

  stats: {
    children: false
  },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  externals: {
    'react/addons': 'react'
  },

  devtool: 'source-map',

  devServer: {
    port: process.env.PORT || 3000,
    host: 'localhost',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true,
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    }
  }
}

debug('Configuration ready.')
