import { createElement, Component } from 'react'
import { TILES_HEIGHT } from 'config'

import PlayfieldRow from './components/PlayfieldRow'

const styles = require('./Playfield.pcss') as { [key: string]: string | null }

interface RowProps { key: string, y: number }
const playfieldRowProps: RowProps[] = []
for (let y = TILES_HEIGHT - 1; y >= 0; y--) {
  playfieldRowProps.push({
    y,
    key: `row-${y}`,
  })
}

export interface PlayfieldProps {

}

interface PlayfieldState {

}

export class Playfield extends Component<PlayfieldProps, PlayfieldState> {

  private playfieldProps = {
    className: styles['playfield']
  }

  constructor(props: PlayfieldProps) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }

  shouldComponentUpdate(nextProps: PlayfieldProps) {
    // Cells are connected to store so don't update children through top-down field to row to cell
    return nextProps !== this.props
  }

  renderRow(row: RowProps) {
    return createElement(PlayfieldRow, row)
  }

  renderRows() {
    return playfieldRowProps.map(this.renderRow)
  }

  render() {
    return createElement('table', this.playfieldProps,
      createElement('tbody', undefined, this.renderRows())
    )
  }
}

export default Playfield
