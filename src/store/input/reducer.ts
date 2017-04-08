import { initialState, InputState } from './state'

export function inputState(state = initialState(), _action: any): InputState {
  return state
}

export default inputState
