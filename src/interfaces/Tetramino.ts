import Cell from './Cell'
export interface Tetramino {
  x: number
  y: number
  cells: Array<Cell | null>
}

export default Tetramino
