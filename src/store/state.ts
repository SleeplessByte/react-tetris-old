import { Dispatch } from 'redux'

import GameState from 'store/game/state'
import GeneratorState from 'store/generator/state'
import TimeState from 'store/time/state'
import InputState from 'store/input/state'
import StatsState from 'store/stats/state'
import ScoreState from 'store/score/state'
import HoldState from 'store/hold/state'

import { ThunkAction } from 'redux-thunk'

export type StoreDispatch = Dispatch<StoreState>

export type StoreThunkAction<R> = ThunkAction<R, StoreState, void>

export type StoreState = {
  game: GameState,
  generator: GeneratorState,
  time: TimeState,
  input: InputState,
  stats: StatsState,
  score: ScoreState,
  hold: HoldState
}

export default StoreState
