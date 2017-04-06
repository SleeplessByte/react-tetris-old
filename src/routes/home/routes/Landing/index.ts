import { createElement, SFC, ComponentClass } from 'react'
import Loadable from 'react-loadable'

type ModuleWithDefaultExport<P> = {
  default: SFC<P> | ComponentClass<P>
  [module: string]: any
}

/**
 * A functional component that represents a loader
 *
 * @param {{ pastDelay: boolean }} { pastDelay }
 * @returns
 */
function Loading({ pastDelay }: { pastDelay: boolean }) {
  // Past delay will be true if not loaded yet and loadable has been waiting for the past (or 200ms default) delay
  // We use this to not flash a loading for no reason. Basically "long loads" should have a loading state
  // Btw, we can still use react-motion and unmounting / mounting with willEnter and willLeave
  return pastDelay
    ? createElement('div', undefined, 'Loading...')
    : null
}

export const AsyncLanding = Loadable({
  loader: () => new Promise((resolve) => {
    require.ensure([], function (require) {
      resolve(require<ModuleWithDefaultExport<any>>('./Landing').default)
    }, 'landing')
  }),
  LoadingComponent: Loading,
  webpackRequireWeakId: () => {
    return require.resolveWeak('./Landing')
  }
})

AsyncLanding.displayName = 'Async(Landing)'

export function preload() {
  AsyncLanding.preload()
}

export default AsyncLanding
