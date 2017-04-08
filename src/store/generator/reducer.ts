import { initialState, GeneratorState, generateBag } from './state'
import { SpawnActiveAction, ACTION_SPAWN_ACTIVE } from 'store/game/actions'

declare const __DEV__: boolean

const MINIMUM_BAG_SIZE = 4

/**
 * Shift one from the bag and regenerate if neccessary
 *
 * @param {GeneratorState} state
 * @returns
 */
function shiftBag(state: GeneratorState) {
  const bag = state.bag.slice(1)
  if (bag.length <= MINIMUM_BAG_SIZE) {
    if (__DEV__) { console.log('[reducer] [generator] generate bag') }
    return generateBag(bag)
  }

  return Object.freeze(bag)
}

export function generatorReducer(state = initialState(), action: SpawnActiveAction): GeneratorState {
  switch (action.type) {
    case ACTION_SPAWN_ACTIVE:
      return Object.freeze({ ...state, bag: shiftBag(state) })
  }
  return state
}

export default generatorReducer
