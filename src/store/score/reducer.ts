import { initialState, ScoreState } from './state'

import { linesToLevel } from './selectors'

import {
  ScoreAction,

  ACTION_CLEAR_COMBO,
  ACTION_COMBO,
  ACTION_LINES_CLEARED,
  ACTION_HARD_DROP,
  ACTION_SOFT_DROP
} from './actions'

declare const __DEV__: boolean

function comboPoints(combo: number) {
  return combo * 50
}

const comboAwardLineBrackets = [1, 3, 5, 7, 10, Number.MAX_VALUE]
function comboAwardLines(combo: number) {
  return comboAwardLineBrackets.findIndex(bracket => bracket > combo)
}

const pointsPerLineClear = [0, 100, 300, 500, 800]
function lineClearsPoints(lines: number) {
  return +pointsPerLineClear[lines]
}

const awardLinesPerLineClear = [0, 1, 3, 5, 8]
function lineClearsAwardLines(lines: number) {
  return +awardLinesPerLineClear[lines]
}

function softDropPoints(drops: number) {
  return drops * 1
}

function hardDropPoints(drops: number) {
  return drops * 2
}

export function scoreReducer(state = initialState(), action: ScoreAction): ScoreState {
  switch (action.type) {
    case ACTION_CLEAR_COMBO:
      return Object.freeze({ ...state, combo: 0 })

    case ACTION_COMBO:
      return Object.freeze({ ...state,
        combo: state.combo + 1,
        points: state.points + comboPoints(state.combo) * linesToLevel(state.awardLines),
        awardLines: state.awardLines + comboAwardLines(state.combo)
      })

    case ACTION_LINES_CLEARED:
      return Object.freeze({ ...state,
        points: state.points + lineClearsPoints(action.payload) * linesToLevel(state.awardLines),
        awardLines: state.awardLines + lineClearsAwardLines(action.payload)
      })

    case ACTION_SOFT_DROP:
      return Object.freeze({ ...state,
        points: state.points + softDropPoints(action.payload),
      })

    case ACTION_HARD_DROP:
      return Object.freeze({ ...state,
        points: state.points + hardDropPoints(action.payload),
      })

  }
  return state
}

export default scoreReducer
