import { Dispatch } from 'redux'

import GameState from 'store/game/state'
import GeneratorState from 'store/generator/state'
import TimeState from 'store/time/state'
import StatsState from 'store/stats/state'

import { ThunkAction } from 'redux-thunk'

export type StoreDispatch = Dispatch<StoreState>

export type StoreThunkAction<R> = ThunkAction<R, StoreState, void>

export type StoreState = {
  game: GameState,
  generator: GeneratorState,
  time: TimeState,
  stats: StatsState
}

export default StoreState
