import { createRandomCell, Cell } from './state'
import { isPositionFree, sliceGameState } from './selectors'

import StoreState from 'store/state'
import { ThunkAction } from 'redux-thunk'

export const ACTION_FILL = 'ACTION_FILL'

export type FillAction = { type: typeof ACTION_FILL, payload: { x: number, y: number, cell: Cell } }
export type GameAction = FillAction

function createFillAction(x: number, y: number): FillAction {
  return {
    type: ACTION_FILL,
    payload: {
      x,
      y,
      cell: createRandomCell()
    }
  }
}

export function fill(x: number, y: number): ThunkAction<void, StoreState, void> {
  return (dispatch, getState) => {
    const initialState = sliceGameState(getState())
    if (!isPositionFree(initialState, { x, y })) {
      return
    }

    dispatch(createFillAction(x, y))
  }
}
