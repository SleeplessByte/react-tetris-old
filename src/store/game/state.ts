import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

import Cell, { CellState, CellType } from 'interfaces/Cell'
import Tetramino from 'interfaces/Tetramino'

export { Cell, CellState, CellType, Tetramino }

export interface GameState {
  active: Tetramino | null
  field: Array<Cell | null>
}

export function createRandomCell() {
  const cell: Cell = {
    type: 1 + Math.floor(Math.random() * 7),
    state: CellState.Active
  }
  return cell
}

export function initialState(): GameState {
  const size = (TILES_BUFFER_HEIGHT + TILES_HEIGHT) * TILES_WIDTH
  const field: Array<Cell | null> = new Array(size)
  for (let i = 0; i < size; i++) {
    field[i] = null
  }

  return {
    active: null,
    field
  }
}

export default GameState
