import { createElement, Component } from 'react'
import { connect } from 'react-redux'

import StoreState, { StoreDispatch } from 'store/state'
import { fill } from 'store/game/actions'
import { getCell, sliceGameState } from 'store/game/selectors'
import { CellState, CellType } from 'store/game/state'

interface ConnectedPlayfieldCellProps extends PlayfieldCellProps {
  cellColor: string
  cellOpacity: number
  cellState: CellState

  fill(): void
}

export interface PlayfieldCellProps {
  key: string
  x: number
  y: number
}

interface PlayfieldCellState {}

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

const stateToOpacityMapping = {
  [CellState.None]: .13,
  [CellState.Active]: 1,
  [CellState.InActive]: .54,
  [CellState.Ghost]: .32
}

function mapCellToColor(type: CellType) {
  return cellToColorMapping[type]
}

function mapCellToOpacity(state: CellState) {
  return stateToOpacityMapping[state]
}


export class PlayfieldCell extends Component<ConnectedPlayfieldCellProps, PlayfieldCellState> {

  private cellProps = {}

  constructor(props: ConnectedPlayfieldCellProps) {
    super(props)

    this.cellProps = {
      style: {
        backgroundColor: props.cellColor,
        opacity: props.cellOpacity
      },

      onClick: this.props.fill
    }
  }

  componentWillReceiveProps(nextProps: ConnectedPlayfieldCellProps) {
    if (nextProps.cellColor !== this.props.cellColor || nextProps.cellOpacity !== this.props.cellOpacity) {
      this.cellProps = {
        style: {
          backgroundColor: nextProps.cellColor,
          opacity: nextProps.cellOpacity
        },

        onClick: this.props.fill
      }
    }
  }

  render() {
    return createElement('td', this.cellProps, `[${this.props.x}:${this.props.y}]`)
  }
}

function mapStateToProps(state: StoreState, ownProps: PlayfieldCellProps) {
  const cell = getCell(sliceGameState(state), ownProps)
  return {
    cellColor: mapCellToColor(cell && cell.type || CellType._),
    cellOpacity: mapCellToOpacity(cell && cell.state || CellState.None),
    cellState: cell && cell.state || CellState.None,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: StoreDispatch, ownProps: PlayfieldCellProps) {
  return {
    fill: () => { dispatch(fill(ownProps.x, ownProps.y)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayfieldCell)
