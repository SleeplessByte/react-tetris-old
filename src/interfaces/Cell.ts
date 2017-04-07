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

export default Cell
