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

export type Cell = CellType | null
export default Cell
