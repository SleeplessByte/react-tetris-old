import { createElement } from 'react'

import Playfield from 'components/Playfield'
import TimeManipulation from 'components/TimeManipulation'
import InputListener from 'components/InputListener'
import NextTetromino, { AsyncHoldTetromino as HoldTetromino } from 'components/TetrominoPreview'
import ScoreBoard from 'components/ScoreBoard'


const styles = require('./Landing.pcss') as { [key: string]: string | undefined }

const sectionProps = {
  className: styles['landing']
}

const playfieldProps = { key: 'playfield' }
const inputListenerProps = { key: 'input-listener' }
const timeManipulationProps = { key: 'time-manipulation' }
const nextTetrominoProps = { key: 'next-tetromino' }
const holdTetrominoProps = { key: 'hold-tetromino' }
const rightColumnProps = { key: 'right-col' }
const scoreBoardProps = { key: 'score-board' }

function RightColumn() {
  return createElement('div', rightColumnProps, [
    createElement(NextTetromino, nextTetrominoProps),
    createElement(HoldTetromino, holdTetrominoProps),
    createElement(ScoreBoard, scoreBoardProps),
    createElement(TimeManipulation, timeManipulationProps),
    createElement(InputListener, inputListenerProps),
  ])
}

export function Landing() {
  return createElement('section', sectionProps, [
    createElement(Playfield, playfieldProps),
    createElement(RightColumn, rightColumnProps)
  ])
}

export default Landing
