import { createElement, Component } from 'react'
import { connect } from 'react-redux'

import StoreState, { StoreDispatch } from 'store/state'
import { getCellAt, fill } from 'store/game/reducer'
import { CellState, CellType } from 'store/game/state'

interface ConnectedPlayfieldCellProps extends PlayfieldCellProps {
  cellColor: string
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

function mapCellToColor(cell: CellType) {
  return cellToColorMapping[cell]
}

export class PlayfieldCell extends Component<ConnectedPlayfieldCellProps, PlayfieldCellState> {

  private cellProps = {}

  constructor(props: ConnectedPlayfieldCellProps) {
    super(props)

    this.cellProps = {
      style: {
        backgroundColor: props.cellColor
      },

      onClick: this.props.fill
    }
  }

  componentWillReceiveProps(nextProps: ConnectedPlayfieldCellProps) {
    if (nextProps.cellColor !== this.props.cellColor) {
      this.cellProps = {
        style: {
          backgroundColor: nextProps.cellColor
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
  const cell = getCellAt(state.game, ownProps.x, ownProps.y)
  return {
    cellColor: mapCellToColor(cell && cell.type || CellType._),
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
