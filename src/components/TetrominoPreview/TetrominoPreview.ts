import { createElement, Component } from 'react'
import { CellState } from 'store/game/selectors'
import { CellType } from 'interfaces/Cell'
import { templates } from 'store/generator/tetrominoFactory'
import StoreState from 'store/state'
import { connect } from 'react-redux'

import { mapCellToClassName } from 'components/Playfield/components/PlayfieldCell'

export interface TetrominoPreviewProps {
  future?: number
}

interface ConnectedTetrominoPreviewProps extends TetrominoPreviewProps {
  cellType: CellType
}

interface TetrominoPreviewState {}


const styles = require('./TetrominoPreview.pcss') as { [key: string]: string | null }


export class TetrominoPreview extends Component<ConnectedTetrominoPreviewProps, TetrominoPreviewState> {

  constructor(props: ConnectedTetrominoPreviewProps) {
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


function mapStateToProps(state: StoreState, ownProps: TetrominoPreviewProps) {
  return {
    cellType: state.generator.bag[ownProps.future || 0],
    ...ownProps
  }
}

export default connect(mapStateToProps)(TetrominoPreview)


function mapStateToPropsHoldPreview(state: StoreState, ownProps: TetrominoPreviewProps) {
  return {
    cellType: state.hold.held && state.hold.held.type || CellType._,
    ...ownProps
  }
}

export const HoldPreview = connect(mapStateToPropsHoldPreview)(TetrominoPreview)
