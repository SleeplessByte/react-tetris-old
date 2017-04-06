import { SFC, ComponentClass, createElement } from 'react'
const { ConnectedRouter } = require('react-router-redux')

export interface RouteredProps extends Object {
  history: any
}

export function withRouter<P>(WithoutRouter: SFC<P> | ComponentClass<P>) {
  const withRouter = function withRouter(props: P & RouteredProps) {
    const { history, ...otherProps } = props as {} & RouteredProps
    return createElement(ConnectedRouter, { history },
      createElement(WithoutRouter as ComponentClass<P>, otherProps as any)
    )
  } as SFC<P>
  withRouter.displayName = `withRouter(${WithoutRouter.displayName || WithoutRouter.name})`
  return withRouter
}

export default withRouter
