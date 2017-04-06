import App from './App'
import withRouter from './withRouter'
import withProvider from './withProvider'

export { App, withRouter, withProvider }
export default withProvider(withRouter(App))
