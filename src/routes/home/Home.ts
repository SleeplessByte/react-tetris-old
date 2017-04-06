import { createElement } from 'react'
import Landing from './routes/Landing'

const { Switch, Route, Redirect } = require('react-router-dom')

export function Home() {
  return createElement('main', { 'data-test': 'home' }, [
    createElement(Switch, { key: 'switch' }, [
      createElement(Route, { key: 'landing', component: Landing, path: '/', exact: true }),
      createElement(Redirect, { key: 'not-found', to: '/' })
    ])
  ])
}

export default Home
