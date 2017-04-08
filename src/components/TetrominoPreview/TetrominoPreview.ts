import { createElement, Component } from 'react'
import { CellState } from 'store/game/selectors'
import { CellType } from 'interfaces/Cell'
import { templates } from 'store/generator/tetrominoFactory'

import { mapCellToClassName } from 'components/Playfield/components/PlayfieldCell'

export interface TetrominoPreviewProps {
  cellType: CellType
}
interface TetrominoPreviewState {}


const styles = require('./TetrominoPreview.pcss') as { [key: string]: string | null }


export class TetrominoPreview extends Component<TetrominoPreviewProps, TetrominoPreviewState> {

  constructor(props: TetrominoPreviewProps) {
    super(props)

    this.renderCell = this.renderCell.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  renderCell(value: CellType, x: number) {
    return createElement('td', { key: `column-${x}`, className: mapCellToClassName(CellState.Active, value) })
  }

  renderRow(value: CellType[], y: number) {
    return createElement('tr', { key: `row-${y}` }, value.map(this.renderCell))
  }

  render() {
    return createElement('table', { className: styles['preview'] },
      createElement('tbody', {}, (templates[this.props.cellType] as CellType[][]).map(this.renderRow))
    )
  }
}

export default TetrominoPreview
