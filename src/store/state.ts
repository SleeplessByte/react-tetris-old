import { Dispatch } from 'redux'
import { GameState } from './game/state'

export type StoreDispatch = Dispatch<StoreState>

export type StoreState = object & {
  game: GameState
}

export default StoreState
