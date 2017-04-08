import { createElement, Component } from 'react'
import { connect } from 'react-redux'

import StoreState, { StoreDispatch } from 'store/state'
import { getCell, sliceGameState, CellState } from 'store/game/selectors'
import { CellType } from 'store/game/state'

const styles = require('./PlayfieldCell.pcss') as { [key: string]: string | undefined }

interface ConnectedPlayfieldCellProps extends PlayfieldCellProps {
  className: string
}

export interface PlayfieldCellProps {
  key: string
  x: number
  y: number
}

interface PlayfieldCellState {}

const typeToClassName = {
  [CellType.I]: styles['I'],
  [CellType.O]: styles['O'],
  [CellType.T]: styles['T'],
  [CellType.S]: styles['S'],
  [CellType.Z]: styles['Z'],
  [CellType.J]: styles['J'],
  [CellType.L]: styles['L'],

  [CellType._]: ''
}

const stateToClassName = {
  [CellState.Active]: styles['active'],
  [CellState.InActive]: styles['locked'],
  [CellState.Ghost]: styles['ghost'],
  [CellState.None]: ''
}

export function mapCellToClassName(state: CellState, type: CellType) {
  return `${styles['cell']} ${typeToClassName[type]} ${stateToClassName[state]}`
}

export class PlayfieldCell extends Component<ConnectedPlayfieldCellProps, PlayfieldCellState> {

  private cellProps = {}

  constructor(props: ConnectedPlayfieldCellProps) {
    super(props)

    this.cellProps = {
      className: props.className || ''
    }
  }

  componentWillReceiveProps(nextProps: ConnectedPlayfieldCellProps) {
    if (nextProps.className !== this.props.className) {
      this.cellProps = {
        className: nextProps.className || ''
      }
    }
  }

  render() {
    return createElement('td', this.cellProps)
  }
}

function mapStateToProps(state: StoreState, ownProps: PlayfieldCellProps) {
  const cell = getCell(sliceGameState(state), ownProps)
  return {
    className: mapCellToClassName(cell.state, cell.cell || CellType._),
    ...ownProps
  }
}

function mapDispatchToProps(_dispatch: StoreDispatch, _ownProps: PlayfieldCellProps) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayfieldCell)
