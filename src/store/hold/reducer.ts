import { initialState, HoldState } from './state'
import { HoldAction, ACTION_SWITCH_HELD } from './actions'

import { SettleActiveAction, ACTION_SETTLE_ACTIVE } from 'store/game/actions'

type HoldEnabledAction = SettleActiveAction
  | HoldAction

declare const __DEV__: boolean

export function holdReducer(state = initialState(), action: HoldEnabledAction): HoldState {
  switch (action.type) {

    case ACTION_SWITCH_HELD:
      if (__DEV__) { console.log('[reducer] [hold] switch held') }
      return Object.freeze({ ...state, held: Object.freeze(action.payload), locked: true })

    case ACTION_SETTLE_ACTIVE:
    if (__DEV__) { console.log('[reducer] [hold] unlock held') }
      return Object.freeze({ ...state, locked: false })
  }
  return state
}

export default holdReducer
