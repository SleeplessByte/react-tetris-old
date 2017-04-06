import { SFC, ComponentClass, createElement } from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import reducers from 'store/reducers'

const { routerReducer, routerMiddleware } = require('react-router-redux')

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    router: routerReducer,
    ...reducers
  }),
  applyMiddleware(thunk, middleware)
)

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('store/reducers', () => {
    const nextRootReducer = require('store/reducers')
    store.replaceReducer(nextRootReducer)
  })
}

export function withProvider<P>(WithoutProvider: SFC<P & { history: any }> | ComponentClass<P & { history: any }>) {
  const withProvider = function withProvider(props: P) {
    return createElement(Provider, { store },
      createElement(
        WithoutProvider as SFC<P & { history: any }>,
        Object.assign<{}, P, { history: any }>({}, props, { history })
      )
    )
  } as SFC<P>
  withProvider.displayName = `withProvider(${WithoutProvider.displayName || WithoutProvider.name})`
  return withProvider
}

export default withProvider
