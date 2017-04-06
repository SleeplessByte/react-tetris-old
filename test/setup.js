const makeDebug = require('debug')
const debug = makeDebug('app:test:setup')
debug('Setup test')

// Skip css imports? temp
require.extensions['.css'] = () => {
  return undefined
}

const chai = require('chai')

const jsdom = require('jsdom').jsdom
const exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('<body></body>')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

documentRef = document // eslint-disable-line no-undef

// this has to happen after the globals are set up because `chai-enzyme`
// will require `enzyme`, which requires `react`, which ultimately
// requires `fbjs/lib/ExecutionEnvironment` which (at require time) will
// attempt to determine the current environment (this is where it checks
// for whether the globals are present). Hence, the globals need to be
// initialized before requiring `chai-enzyme`.
chai
  .use(require('sinon-chai'))
  .use(require('chai-enzyme')())
  .use(require('chai-as-promised'))

debug('Setup complete')
