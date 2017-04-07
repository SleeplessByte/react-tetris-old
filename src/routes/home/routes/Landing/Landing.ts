import { createElement } from 'react'

import StoreState from 'store/state'

import Playfield from 'components/Playfield'
import TimeManipulation from 'components/TimeManipulation'
import TetrominoPreview from 'components/TetrominoPreview'

import { connect } from 'react-redux'

const playfieldProps = {
  key: 'playfield'
}

const timeManipulationProps = {
  key: 'time-manipulation'
}

const nextTetrominoProps = {
  key: 'next-tetromino'
}

function mapStateToDispatch(state: StoreState) {
  return {
    cellType: state.generator.bag[0]
  }
}

const NextTetromino = connect(mapStateToDispatch)(TetrominoPreview)

export function Landing() {
  return createElement('section', { style: { display: 'flex' }}, [
    createElement(Playfield, playfieldProps),
    createElement(NextTetromino, nextTetrominoProps),
    createElement(TimeManipulation, timeManipulationProps)
  ])
}

export default Landing
