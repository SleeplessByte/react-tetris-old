import { initialState, TimeState } from './state'
import { ACTION_TICK, ACTION_SET_NEXT_FRAME, TimeAction } from './actions'

function ensureFrameLengthOver(state: TimeState, { t0, length }: { t0: number, length: number }) {
  const remaining = (state.t0 + state.frameLength) - t0
  if (remaining > length) {
    return state.t0
  }

  return t0 - (state.frameLength - length)
}

export function timeReducer(state = initialState(), action: TimeAction): TimeState {
  switch (action.type) {
    case ACTION_TICK:
      return Object.freeze({ ...state, frame: state.frame + 1, t0: action.payload })
    case ACTION_SET_NEXT_FRAME:
      return Object.freeze({ ...state, t0: ensureFrameLengthOver(state, action.payload) })

  }
  return state
}

export default timeReducer
