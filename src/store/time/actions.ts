import { StoreDispatch } from 'store/state'
import gameTick from 'store/game/tick'

export const ACTION_TICK = 'ACTION_TICK'
export const ACTION_SET_NEXT_FRAME = 'ACTION_SET_NEXT_FRAME'

export type TickAction = { type: typeof ACTION_TICK, payload: number }
export type SetNextFrameAction = { type: typeof ACTION_SET_NEXT_FRAME, payload: { t0: number, length: number } }
export type TimeAction = TickAction
  | SetNextFrameAction

function createTickAction(t1: number): TickAction {
  return {
    type: ACTION_TICK,
    payload: t1
  }
}

function createDelayFrameAction(t0: number, length: number): SetNextFrameAction {
  return {
    type: ACTION_SET_NEXT_FRAME,
    payload: { t0, length }
  }
}

/**
 * Tick the time to t1
 *
 * @export
 * @param {number} t1
 * @returns
 */
export function tick(t1: number) {
  return (dispatch: StoreDispatch) => {
    dispatch(gameTick())
    dispatch(createTickAction(t1))
  }
}

/**
 * Ensure there is at least length, when the time is t0
 *
 * @export
 * @param {number} t0
 * @param {number} length
 * @returns
 */
export function setNextFrameTo(t0: number, length: number) {
  return (dispatch: StoreDispatch) => {
    dispatch(createDelayFrameAction(t0, length))
  }
}
