import { initialState, StatsState } from './state'

import { RowsClearedAction, ACTION_ROWS_CLEARED } from 'store/game/actions'

declare const __DEV__: boolean

export function statsState(state = initialState(), action: RowsClearedAction): StatsState {
  switch (action.type) {
    case ACTION_ROWS_CLEARED:
      if (__DEV__) { console.log(`[reducer] [stats] cleared ${action.payload.length} rows`) }
      return Object.freeze({ ...state, cleared: state.cleared + action.payload.length })
  }
  return state
}

export default statsState
