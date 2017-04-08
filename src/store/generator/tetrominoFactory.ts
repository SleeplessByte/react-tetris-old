import Cell, { CellType } from 'interfaces/Cell'
import Tetromino from 'interfaces/Tetromino'
import { TILES_WIDTH, TILES_HEIGHT, TILES_BUFFER_HEIGHT } from 'config'

export { Tetromino }

type Template4 = [
  [CellType, CellType],
  [CellType, CellType]
]

type Template9 = [
  [CellType, CellType, CellType],
  [CellType, CellType, CellType],
  [CellType, CellType, CellType]
]

type Template16 = [
 [CellType, CellType, CellType, CellType],
 [CellType, CellType, CellType, CellType],
 [CellType, CellType, CellType, CellType],
 [CellType, CellType, CellType, CellType]
]

type Template = Template4
  | Template9
  | Template16

export const templates: { [x: number]: Template } = {}

const _ = CellType._
const I = CellType.I
const L = CellType.L
const J = CellType.J
const O = CellType.O
const S = CellType.S
const T = CellType.T
const Z = CellType.Z

templates[_] = [
  [_, _, _],
  [_, _, _],
  [_, _, _]
]

templates[I] = [
  [_, _, _, _],
  [_, _, _, _],
  [I, I, I, I],
  [_, _, _, _]
]

templates[L] = [
  [_, _, L],
  [L, L, L],
  [_, _, _]
]

templates[J] = [
  [J, _, _],
  [J, J, J],
  [_, _, _]
]

templates[O] = [
  [O, O],
  [O, O]
]

templates[S] = [
  [_, _, _],
  [_, S, S],
  [S, S, _]
]

templates[T] = [
  [_, T, _],
  [T, T, T],
  [_, _, _]
]

templates[Z] = [
  [_, _, _],
  [Z, Z, _],
  [_, Z, Z]
]

/**
 * Generate a cell from a cell type
 *
 * @param {CellType} type
 * @returns {Cell}
 */
function generateCell(type: CellType): Cell {
  if (type === _) {
    return null
  }

  return type
}

/**
 * Unwraps the two dimensional template into a one dimensional array
 *
 * @param {CellType[][]} template
 * @returns
 */
function unwrap(template: CellType[][]) {
  const h = template.length
  const w = template[0].length

  return template.reduce((cells, row: CellType[], i) => {
    row.forEach((cell: CellType, j) => {
      cells[(h - 1 - i) * w + j] = generateCell(cell)
    })
    return cells
  }, new Array(w * h) as Array<Cell>)
}

/**
 * Generates a tetromino of cells based on a type
 *
 * @export
 * @param {CellType} type
 * @returns {(Tetromino | null)} null if _, tetromino otherwise
 */
export function tetrominoFactory(type: CellType): Tetromino | null {
  if (type === _) {
    return null
  }

  const template = templates[type]
  return moveToSpawnPosition({
    width: template[0].length,
    height: template.length,
    cells: unwrap(template),
    type
  })
}

export function moveToSpawnPosition(partial: Pick<Tetromino, 'width' | 'height' | 'cells' | 'type'>): Tetromino {
  return {
    x0: (TILES_WIDTH - partial.width) / 2 | 0,
    y0: TILES_HEIGHT + TILES_BUFFER_HEIGHT - partial.height - 1,
    ...partial
  } as Tetromino
}

export default tetrominoFactory
