import { createElement, Component } from 'react'

import Home from 'routes/home'

const { Switch, Route } = require('react-router-dom')

export interface AppProps {}
interface AppState {}

export class App extends Component<AppProps, AppState> {

  private switchProps = { key: 'routes' }
  private homeProps = { key: 'home', path: '/', component: Home }

  constructor(props: AppProps) {
    super(props)
  }

  componentDidMount() {
    Home.preload()
  }

  render() {
    return createElement(Switch, this.switchProps, [
      createElement(Route, this.homeProps),
    ])
  }
}

export default App
