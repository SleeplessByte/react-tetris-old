const makeDebug = require('debug')
const debug = makeDebug('app:test:context')

debug('Setup test context')
const context = require.context('..', true, /.+?\.spec\.(t|j)sx?$/)
const keys = context.keys()
keys.forEach(context)

debug('Found %d tests', keys.length)

module.exports = context
