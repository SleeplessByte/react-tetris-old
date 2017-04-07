import { initialState, GameState, Cell, CellState } from './state'
import { getCell, isPositionFree, isRowFilled } from './selectors'

import {
  GameAction,
  ACTION_FILL,
} from './actions'

import {
  TickAction,
  ACTION_TICK
} from '../time/actions'

import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

declare const __DEV__: boolean

function fillCell(state: GameState, props: { x: number, y: number, cell: Cell | null }): GameState {
  state.field[props.y * TILES_WIDTH + props.x] = props.cell
  return state
}

function moveCellDown(state: GameState, props: { x: number, y: number }): GameState {
  const { x, y } = props
  const cell = getCell(state, props)
  if (__DEV__ && !cell) {
    console.warn('Tried to move non existing cell', props)
    return state
  }
  state = fillCell(state, { x, y, cell: null })
  return fillCell(state, { x, y: y - 1, cell })
}

function settleCell(state: GameState, props: { x: number, y: number }): GameState {
  const cell = getCell(state, props)
  if (__DEV__ && (!cell || cell.state !== CellState.Active)) {
    console.warn('Tried to settle cell that could not be settled', cell)
    return state
  }
  (cell as Cell).state = CellState.InActive
  return state
}

function removeRows(state: GameState, ys: number[]): GameState {
  switch (ys.length) {
    case 0:
      return state
    case 1:
      return removeRow(state, ys[0])
  }

  const field: Array<Cell | null> = []
  for (let y = 0; y < TILES_HEIGHT + TILES_BUFFER_HEIGHT; y++) {
    if (ys.indexOf(y) >= 0 ) {
      continue
    }
    const row = state.field.slice(y * TILES_WIDTH, y * TILES_WIDTH + TILES_WIDTH)
    field.push(...row)
  }

  const removedCount = TILES_WIDTH * ys.length
  for (let i = 0; i < removedCount; i++) {
    field.push(null)
  }

  console.log(state.field.length, field.length)

  state.field = field
  return state
}

function removeRow(state: GameState, y: number): GameState {
  const until = Math.max(0, y * TILES_WIDTH)
  const after = until + TILES_WIDTH
  const insert = []
  for (let i = 0; i < TILES_WIDTH; i++) {
    insert.push(null)
  }

  state.field = state.field.slice(0, until).concat(state.field.slice(after), insert)
  return state
}

function tick(state: GameState) {
  const row: boolean[] = []

  for (let x = 0; x < TILES_WIDTH; x++) {
    row.push(true)
  }

  // Make all active blocks fall
  for (let y = 0; y < (TILES_HEIGHT + TILES_BUFFER_HEIGHT); y++) {
    for (let x = 0; x < TILES_WIDTH; x++) {
      const position = { x, y }
      const cell = getCell(state, position)
      if (!cell || cell.state !== CellState.Active) {
        row[x] = true
        continue
      }

      if (row[x] && isPositionFree(state, { x, y: y - 1 })) {
        state = moveCellDown(state, position)
      } else {
        state = settleCell(state, position)
        row[x] = false
      }
    }
  }

  // Remove settled full rows
  const remove: number[] = []
  for (let y = 0; y < (TILES_HEIGHT + TILES_BUFFER_HEIGHT); y++) {
    if (!isRowFilled(state, { y })) {
      continue
    }

    remove.push(y)
  }

  return removeRows(state, remove)
}

export function gameState(state = initialState(), action: GameAction | TickAction): GameState {
  switch (action.type) {
    case ACTION_FILL:
      return { ...fillCell(state, action.payload) }
    case ACTION_TICK:
      return { ...tick(state) }
  }
  return state
}

export default gameState
