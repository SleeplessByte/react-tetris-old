import { StoreDispatch } from 'store/state'

export const ACTION_TICK = 'ACTION_TICK'

export type TickAction = { type: typeof ACTION_TICK }
export type TimeAction = TickAction

function createTickAction(): TickAction {
  return {
    type: ACTION_TICK
  }
}

export function tick() {
  return (dispatch: StoreDispatch) => {
    dispatch(createTickAction())
  }
}
