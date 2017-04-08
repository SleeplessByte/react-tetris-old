import Cell, { CellType } from './Cell'
export { Cell, CellType }

export interface Tetromino {
  type: CellType
  cells: Array<Cell>
  x0: number
  y0: number

  width: number
  height: number
}

export default Tetromino
