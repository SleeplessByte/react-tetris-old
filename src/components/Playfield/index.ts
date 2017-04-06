import { createElement, SFC, ComponentClass } from 'react'
import Loadable from 'react-loadable'

type ModuleWithDefaultExport<P> = {
  default: SFC<P> | ComponentClass<P>
  [module: string]: any
}

const styles = require('./Playfield.pcss') as { [key: string]: string | null }

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
    ? createElement('table', { className: styles['playfield'] })
    : null
}

export const AsyncPlayfield = Loadable({
  loader: () => new Promise((resolve) => {
    require.ensure([], function (require) {
      resolve(require<ModuleWithDefaultExport<any>>('./Playfield').default)
    }, 'playfield')
  }),
  LoadingComponent: Loading,
  webpackRequireWeakId: () => {
    return require.resolveWeak('./Playfield')
  }
})

AsyncPlayfield.displayName = 'Async(Playfield)'

export function preload() {
  AsyncPlayfield.preload()
}

export default AsyncPlayfield
