const path = require('path')

const media = require(path.resolve(__dirname, 'src', 'styles', 'media.js'))
const variables = require(path.resolve(__dirname, 'src', 'styles', 'variables.js'))
const theme = require(path.resolve(__dirname, 'src', 'theme', 'theme.js'))

module.exports = (context) => ({
  plugins: [
    require('postcss-smart-import')({
      addDependencyTo: context,
      root: path.resolve(__dirname, 'src')
    }),
    require('postcss-cssnext')({
      // https://npmjs.com/package/pixrem
      // https://npmjs.com/package/autoprefixer
      browsers: 'last 2 versions',
      features: {
        // https://npmjs.com/package/postcss-custom-properties
        customProperties: {
          variables: Object.assign({}, variables, theme)
        },

        // https://github.com/postcss/postcss-custom-media
        customMedia: {
          extensions: media
        },

        // https://npmjs.com/package/postcss-calc
        calc: {
          warnWhenCannotResolve: false
        },

        // https://npmjs.com/package/postcss-nesting
        nesting: {},

        // https://www.npmjs.com/package/postcss-replace-overflow-wrap
        overflowWrap: {
          method: 'copy'
        }
      }
    }),
    // require('postcss-css-variables')(),
    require('postcss-color-function')(),
    require('postcss-mixins')(),
    require('postcss-each')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')({ clearAllMessages: true })
  ]
})
