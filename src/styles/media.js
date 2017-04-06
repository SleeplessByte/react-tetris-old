const variables = require('./variables.js')

module.exports = {
  '--portrait': '(orientation: portrait)',
  '--landscape': '(orientation: landscape)',

  /* Devices (defined by max width) */
  '--xs-viewport': `(max-width: ${variables['media-xs-max-width']})`,
  '--sm-viewport': `(max-width: ${variables['media-sm-max-width']})`,
  '--md-viewport': `(max-width: ${variables['media-md-max-width']})`,
  '--lg-viewport': `(max-width: ${variables['media-lg-max-width']})`,
  '--xl-viewport': `(min-width: ${variables['media-xl-min-width']})`,

  /* Bigger than */
  '--min-xs': `(min-width: ${variables['media-xs-min-width']})`,
  '--min-sm': `(min-width: ${variables['media-sm-min-width']})`,
  '--min-md': `(min-width: ${variables['media-md-min-width']})`,
  '--min-lg': `(min-width: ${variables['media-lg-min-width']})`,
  '--min-xl': `(min-width: ${variables['media-xl-min-width']})`,
  '--min-xxl': `(min-width: ${variables['media-xxl-min-width']})`,
  '--min-xxxl': `(min-width: ${variables['media-xxxl-min-width']})`
}
