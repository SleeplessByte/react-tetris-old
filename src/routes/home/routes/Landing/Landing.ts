import { createElement } from 'react'

import StoreState from 'store/state'

import Playfield from 'components/Playfield'
import TimeManipulation from 'components/TimeManipulation'
import InputListener from 'components/InputListener'
import TetrominoPreview from 'components/TetrominoPreview'

import { connect } from 'react-redux'

const styles = require('./Landing.pcss') as { [key: string]: string | undefined }

const sectionProps = {
  className: styles['landing']
}

const playfieldProps = {
  key: 'playfield'
}

const inputListenerProps = {
  key: 'input-listener'
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
  return createElement('section', sectionProps, [
    createElement(Playfield, playfieldProps),
    createElement(NextTetromino, nextTetrominoProps),
    createElement(InputListener, inputListenerProps),
    createElement(TimeManipulation, timeManipulationProps)
  ])
}

export default Landing
