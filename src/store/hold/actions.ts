import { StoreThunkAction } from 'store/state'
import Tetromino from 'interfaces/Tetromino'
export const ACTION_SWITCH_HELD = 'ACTION_SWITCH_HELD'

import { respawn, ACTION_UPDATE_GHOST } from 'store/game/actions'

export type SwitchHeldAction = { type: typeof ACTION_SWITCH_HELD, payload: Tetromino | null }
export type HoldAction = SwitchHeldAction

function createSwitchHeldAction(held: Tetromino | null): SwitchHeldAction {
  return {
    type: ACTION_SWITCH_HELD,
    payload: held
  }
}

export function hold(): StoreThunkAction<void> {
  return (dispatch, getState) => {
    const state = getState()
    const active = state.game.active
    const held = state.hold.held
    if (!state.hold.locked) {
      dispatch(createSwitchHeldAction(active))
      dispatch(respawn(held))
      dispatch()
    }
  }
}
