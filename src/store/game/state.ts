import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

export const enum CellType {
  _ = 0,

  I = 1,
  O = 2,
  T = 3,
  S = 4,
  Z = 5,
  J = 6,
  L = 7
}

export const enum CellState {
  None      = 0,
  Active    = 1,
  InActive  = 2,
  Ghost     = 3
}

export interface Cell {
  type: CellType
  state: CellState
}

export interface Tetramino {
  x: number
  y: number
  cells: Array<Cell | null>
}

export interface GameState {
  active: Tetramino | null,
  field: Array<Cell | null>
}

export function createRandomCell() {
  const cell: Cell = {
    type: 1 + Math.floor(Math.random() * 7),
    state: CellState.InActive
  }
  return cell
}

export function initialState(): GameState {
  const size = (TILES_BUFFER_HEIGHT + TILES_HEIGHT) * TILES_WIDTH
  const field: Array<Cell | null> = new Array(size)
  for (let i = 0; i < size; i++) {
    field[i] = Math.random() > .8
      ? createRandomCell()
      : null
  }

  return {
    active: null,
    field
  }
}
