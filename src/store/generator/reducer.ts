import { initialState, GeneratorState, generateBag } from './state'
import { SpawnActiveAction, ACTION_SPAWN_ACTIVE } from 'store/game/actions'

declare const __DEV__: boolean

function shiftBag(state: GeneratorState) {
  const bag = state.bag.slice(1)
  if (bag.length === 0) {
    if (__DEV__) { console.log('[reducer] [generator] generate bag') }
    return generateBag()
  }

  return Object.freeze(bag)
}

export function generatorState(state = initialState(), action: SpawnActiveAction): GeneratorState {
  switch (action.type) {
    case ACTION_SPAWN_ACTIVE:
      return Object.freeze({ ...state, bag: shiftBag(state) })
  }
  return state
}

export default generatorState
