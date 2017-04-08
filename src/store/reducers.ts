import gameReducer from 'store/game/reducer'
import generatorReducer from 'store/generator/reducer'
import timeReducer from 'store/time/reducer'
import inputReducer from 'store/input/reducer'
import statsReducer from 'store/stats/reducer'
import scoreReducer from 'store/score/reducer'
import holdReducer from 'store/hold/reducer'

import StoreState from './state'

type RootReducer = {
  [K in keyof StoreState]: (state: StoreState[K], action: { type: string }) => StoreState[K]
}


export const rootReducer: RootReducer = {
  game: gameReducer,
  generator: generatorReducer,
  time: timeReducer,
  input: inputReducer,
  stats: statsReducer,
  score: scoreReducer,
  hold: holdReducer
}

export default rootReducer
