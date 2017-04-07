import { initialState, GeneratorState } from './state'

export function generatorState(state = initialState(), _action: any): GeneratorState {
  return state
}

export default generatorState
