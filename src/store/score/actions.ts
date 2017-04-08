import { StoreThunkAction } from 'store/state'

export const ACTION_CLEAR_COMBO = 'ACTION_CLEAR_COMBO'
export const ACTION_LINES_CLEARED = 'ACTION_LINES_CLEARED'
export const ACTION_COMBO = 'ACTION_COMBO'
export const ACTION_SOFT_DROP = 'ACTION_SOFT_DROP'
export const ACTION_HARD_DROP = 'ACTION_HARD_DROP'

export type SoftDropAction = { type: typeof ACTION_SOFT_DROP, payload: number }
export type HardDropAction = { type: typeof ACTION_HARD_DROP, payload: number }
export type ClearComboAction = { type: typeof ACTION_CLEAR_COMBO }
export type ComboAction = { type: typeof ACTION_COMBO }
export type LinesClearedAction = { type: typeof ACTION_LINES_CLEARED, payload: number }
export type ScoreAction = LinesClearedAction
 | ComboAction
 | ClearComboAction
 | SoftDropAction
 | HardDropAction

function createClearComboAction(): ClearComboAction {
  return {
    type: ACTION_CLEAR_COMBO
  }
}

function createComboAction(): ComboAction {
  return {
    type: ACTION_COMBO
  }
}

function createLinesClearedAction(lines: number): LinesClearedAction {
  return {
    type: ACTION_LINES_CLEARED,
    payload: lines
  }
}

function createSoftDropAction(lines: number): SoftDropAction {
  return {
    type: ACTION_SOFT_DROP,
    payload: lines
  }
}

function createHardDropAction(lines: number): HardDropAction {
  return {
    type: ACTION_HARD_DROP,
    payload: lines
  }
}

export function lineScore(lines: number): StoreThunkAction<void> {
  return (dispatch) => {
    if (lines === 0) {
      dispatch(createClearComboAction())
      return
    }

    dispatch(createComboAction())
    dispatch(createLinesClearedAction(lines))
  }
}

export function softDrop(lines = 1): StoreThunkAction<void> {
   return (dispatch) => {
     dispatch(createSoftDropAction(lines))
   }
}

export function hardDrop(lines = 1): StoreThunkAction<void> {
   return (dispatch) => {
     dispatch(createHardDropAction(lines))
   }
}

