import gameReducer from 'store/game/reducer'
import generatorReducer from 'store/generator/reducer'
import timeReducer from 'store/time/reducer'
import inputReducer from 'store/input/reducer'
import statsReducer from 'store/stats/reducer'

export default {
  game: gameReducer,
  generator: generatorReducer,
  time: timeReducer,
  input: inputReducer,
  stats: statsReducer
}
