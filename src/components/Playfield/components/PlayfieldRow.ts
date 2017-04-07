import { createElement, Component } from 'react'
import PlayfieldCell, { PlayfieldCellProps } from './PlayfieldCell'
import { TILES_WIDTH } from 'config'

interface ColumnProps { key: string, x: number }
const playfieldColumnProps: ColumnProps[] = []
for (let x = 0; x < TILES_WIDTH; x++) {
  playfieldColumnProps.push({
    x,
    key: `column-${x}`,
  })
}

interface PlayfieldRowProps {
  y: number
}

interface PlayfieldRowState {}

export class PlayfieldRow extends Component<PlayfieldRowProps, PlayfieldRowState> {

  private cellProps: PlayfieldCellProps[] = []

  constructor(props: PlayfieldRowProps) {
    super(props)

    this.cellProps = playfieldColumnProps.map(c => ({ ...c, y: props.y }))

    this.renderCell = this.renderCell.bind(this)
    this.renderColumns = this.renderColumns.bind(this)
  }

  shouldComponentUpdate(nextProps: PlayfieldRowProps) {
    // Cells are connected to store so don't update children through top-down row to cell
    return nextProps.y !== this.props.y
  }

  renderCell(column: ColumnProps) {
    return createElement(PlayfieldCell, this.cellProps[column.x])
  }

  renderColumns() {
    return playfieldColumnProps.map(this.renderCell)
  }

  render() {
    return createElement('tr', undefined, this.renderColumns())
  }
}

export default PlayfieldRow
