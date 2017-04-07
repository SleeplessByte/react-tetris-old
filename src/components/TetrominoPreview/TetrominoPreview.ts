import { createElement, Component } from 'react'
import { CellType } from 'interfaces/Cell'

export interface TetrominoPreviewProps {
  cellType: CellType
}
interface TetrominoPreviewState {}

const templates: { [x: number]: CellType[][] } = {}
const styles = require('./TetrominoPreview.pcss') as { [key: string]: string | null }

templates[CellType.I] = [
  [CellType._, CellType.I, CellType._, CellType._],
  [CellType._, CellType.I, CellType._, CellType._],
  [CellType._, CellType.I, CellType._, CellType._],
  [CellType._, CellType.I, CellType._, CellType._]
]

templates[CellType.L] = [
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType.L, CellType._, CellType._],
  [CellType._, CellType.L, CellType._, CellType._],
  [CellType._, CellType.L, CellType.L, CellType._]
]

templates[CellType.J] = [
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType._, CellType.J, CellType._],
  [CellType._, CellType._, CellType.J, CellType._],
  [CellType._, CellType.J, CellType.J, CellType._]
]

templates[CellType.O] = [
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType.O, CellType.O, CellType._],
  [CellType._, CellType.O, CellType.O, CellType._]
]

templates[CellType.S] = [
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType.S, CellType.S, CellType._],
  [CellType.S, CellType.S, CellType._, CellType._]
]

templates[CellType.T] = [
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType._, CellType.T, CellType._],
  [CellType._, CellType.T, CellType.T, CellType.T]
]

templates[CellType.Z] = [
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType._, CellType._, CellType._],
  [CellType._, CellType.Z, CellType.Z, CellType._],
  [CellType._, CellType._, CellType.Z, CellType.Z]
]

const cellToColorMapping = {
  [CellType.I]: 'cyan',
  [CellType.O]: 'yellow',
  [CellType.T]: 'purple',
  [CellType.S]: 'green',
  [CellType.Z]: 'red',
  [CellType.J]: 'blue',
  [CellType.L]: 'orange',

  [CellType._]: 'transparent'
}

export class TetrominoPreview extends Component<TetrominoPreviewProps, TetrominoPreviewState> {

  renderCell(x: number, y: number) {
    const cell = templates[this.props.cellType][3 - y][x]
    return createElement('td', { key: `column-${x}-row-${y}`, style: { backgroundColor: cellToColorMapping[cell] } }, `[${x}:${y}]`)
  }

  renderCells(y: number) {
    return [
      this.renderCell(0, y),
      this.renderCell(1, y),
      this.renderCell(2, y),
      this.renderCell(3, y)
    ]
  }

  renderRow(y: number) {
    return createElement('tr', { key: `row-${y}` }, this.renderCells(y))
  }

  renderRows() {
    return [
      this.renderRow(3),
      this.renderRow(2),
      this.renderRow(1),
      this.renderRow(0)
    ]
  }

  render() {
    return createElement('table', { className: styles['preview'] },
      createElement('tbody', {}, this.renderRows())
    )
  }
}

import { render } from 'react-dom'

const REACT_ROOT_PATTERN = new RegExp(/data-reactroot(?:="")?\s?/)
function getReactNodeHtml(node: JSX.Element) {
  const detached = document.createElement('div')
  render(node, detached)
  return detached.innerHTML.replace(REACT_ROOT_PATTERN, '')
}

const html = getReactNodeHtml(createElement('div', { className: 'hello' }, 'hello'))
console.log(html)


export default TetrominoPreview
