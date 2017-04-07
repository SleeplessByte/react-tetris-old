import { Dispatch } from 'redux'

import GameState from './game/state'
import GeneratorState from './generator/state'
import TimeState from './time/state'

export type StoreDispatch = Dispatch<StoreState>

export type StoreState = {
  game: GameState,
  generator: GeneratorState,
  time: TimeState
}

export default StoreState
