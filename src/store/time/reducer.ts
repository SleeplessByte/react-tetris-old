import { initialState, TimeState } from './state'
import { ACTION_TICK, TimeAction } from './actions'

export function timeReducer(state = initialState(), action: TimeAction): TimeState {
  switch (action.type) {
    case ACTION_TICK:
      return { ...state, frame: state.frame + 1 }
  }
  return state
}

export default timeReducer
