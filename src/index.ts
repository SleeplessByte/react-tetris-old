import { createElement } from 'react'
import { render as renderToDom } from 'react-dom'
import App from 'components/App'

const AppContainer = require<any>('react-hot-loader').AppContainer

const root = document.getElementById('root')

declare const __PROD__: boolean
if (__PROD__) {
  require('./pwa')
}

const render = (Component: any) =>
  renderToDom(
    createElement(AppContainer, undefined,
      createElement(Component)
    ),
    root
  )

setImmediate(function () { render(App) })

if (module.hot) {
  module.hot.accept(
    './components/App', () => {
      const NextApp = require<any>('./components/App').default
      render(NextApp)
    }
  )
}
