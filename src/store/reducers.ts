import gameReducer from './game/reducer'
import generatorReducer from './generator/reducer'
import timeReducer from './time/reducer'

export default {
  game: gameReducer,
  generator: generatorReducer,
  time: timeReducer
}
