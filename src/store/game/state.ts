import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

import Tetromino from 'interfaces/Tetromino'
import Cell, { CellType } from 'interfaces/Cell'

export { Cell, CellType, Tetromino }

/**
 * Entry in the {GameField}
 */
type GameFieldEntry = Cell

/**
 * The game field of settled cells
 */
export type GameField = GameFieldEntry[]

/**
 * Immutable version of the {GameField}
 */
export type GameFieldState = ReadonlyArray<GameFieldEntry>

export interface GameState extends Readonly<GameState> {
  active: Readonly<Tetromino> | null
  ghost: Readonly<Tetromino> | null
  field: GameFieldState
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
