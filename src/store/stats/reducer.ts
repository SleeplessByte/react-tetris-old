import { initialState, StatsState } from './state'

import { SettleActiveAction, ACTION_SETTLE_ACTIVE } from 'store/game/actions'
import { ScoreAction, ACTION_COMBO, ACTION_HARD_DROP, ACTION_SOFT_DROP, ACTION_LINES_CLEARED } from 'store/score/actions'

type StatsEnabledAction = SettleActiveAction
  | ScoreAction

declare const __DEV__: boolean

export function statsReducer(state = initialState(), action: StatsEnabledAction): StatsState {
  switch (action.type) {

    case ACTION_LINES_CLEARED:
      if (__DEV__) { console.log(`[reducer] [stats] cleared ${action.payload} rows`) }
      return Object.freeze({ ...state, cleared: state.cleared + action.payload })

    case ACTION_COMBO:
      if (__DEV__) { console.log(`[reducer] [stats] combo`) }
      return Object.freeze({ ...state, combos: state.combos + 1 })

    case ACTION_HARD_DROP:
      if (__DEV__) { console.log(`[reducer] [stats] hard drop ${action.payload} rows`) }
      return Object.freeze({ ...state, hardDrops: state.hardDrops + action.payload })

    case ACTION_SOFT_DROP:
      if (__DEV__) { console.log(`[reducer] [stats] soft drop ${action.payload} rows`) }
      return Object.freeze({ ...state, softDrops: state.softDrops + action.payload })

    case ACTION_SETTLE_ACTIVE:
      if (__DEV__) { console.log(`[reducer] [stats] settle piece`) }
      return Object.freeze({ ...state, pieces: state.pieces + 1 })
  }
  return state
}

export default statsReducer
