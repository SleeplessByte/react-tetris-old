import { createElement, SFC, ComponentClass } from 'react'
import Loadable from 'react-loadable'
import { TetrominoPreviewProps } from './TetrominoPreview'

type ModuleWithDefaultExport<P> = {
  default: SFC<P> | ComponentClass<P>
  [module: string]: any
}

const styles = require('./TetrominoPreview.pcss') as { [key: string]: string | null }

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
    ? createElement('table', { className: styles['preview'] })
    : null
}

export const AsyncTetrominoPreview = Loadable<TetrominoPreviewProps>({
  loader: () => new Promise((resolve) => {
    require.ensure([], function (require) {
      resolve(require<ModuleWithDefaultExport<any>>('./TetrominoPreview').default)
    }, 'tetromino-preview')
  }),
  LoadingComponent: Loading,
  webpackRequireWeakId: () => {
    return require.resolveWeak('./TetrominoPreview')
  }
})

AsyncTetrominoPreview.displayName = 'Async(TetrominoPreview)'

export function preload() {
  AsyncTetrominoPreview.preload()
}

export default AsyncTetrominoPreview
