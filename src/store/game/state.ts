import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

import Tetromino from 'interfaces/Tetromino'
import Cell, { CellType } from 'interfaces/Cell'

export { Cell, CellType, Tetromino }

type GameFieldEntry = Cell
export type GameField = GameFieldEntry[]
export type GameFieldState = ReadonlyArray<GameFieldEntry>

export interface GameState extends Readonly<GameState> {
  active: Readonly<Tetromino> | null
  ghost: Readonly<Tetromino> | null
  field: GameFieldState
}

const cellTypes = [CellType.I, CellType.J, CellType.L, CellType.O, CellType.S, CellType.T, CellType.Z]
export function createRandomCell(): CellType {
  return cellTypes[Math.floor(Math.random() * cellTypes.length)]
}

export function initialState(): GameState {
  const size = (TILES_BUFFER_HEIGHT + TILES_HEIGHT) * TILES_WIDTH
  const field: GameField = new Array(size)
  for (let i = 0; i < size; i++) {
    field[i] = null
  }

  return Object.freeze({
    active: null,
    ghost: null,
    field: Object.freeze(field)
  })
}

export default GameState
