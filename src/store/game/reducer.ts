import { initialState, GameState, Cell, createRandomCell } from './state'
import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'
import StoreState from 'store/state'
import { ThunkAction } from 'redux-thunk'

export function getCellAt(state: GameState, x: number, y: number): Cell | null {
  return state.field[y * TILES_WIDTH + x]
}

function setCellAt(state: GameState, x: number, y: number, cell: Cell | null): GameState {
  state.field[y * TILES_WIDTH + x] = cell
  return state
}

function isPositionFree(state: GameState, x: number, y: number): boolean {
  return x >= 0
    && x < TILES_WIDTH
    && y >= 0
    && y < TILES_HEIGHT + TILES_BUFFER_HEIGHT
    && getCellAt(state, x, y) === null
}

function isRowFilled(state: GameState, y: number): boolean {
  for (let x = 0; x < TILES_WIDTH; x++) {
    const cell = getCellAt(state, x, y)
    console.log(`[row-filled] [${y}] ${x}`, cell)
    if (!cell) {
      return false
    }
  }

  return true
}

function moveCellDown(state: GameState, x: number, y: number): GameState {
  const cell = getCellAt(state, x, y)
  state = setCellAt(state, x, y, null)
  return setCellAt(state, x, y + 1, cell)
}

function moveCellLeft(state: GameState, x: number, y: number): GameState {
  const cell = getCellAt(state, x, y)
  state = setCellAt(state, x, y, null)
  return setCellAt(state, x - 1, y, cell)
}

function moveCellRight(state: GameState, x: number, y: number): GameState {
  const cell = getCellAt(state, x, y)
  state = setCellAt(state, x, y, null)
  return setCellAt(state, x + 1, y, cell)
}

function removeRow(state: GameState, y: number): GameState {
  const until = Math.max(0, y * TILES_WIDTH)
  const after = until + TILES_WIDTH
  const insert = []
  console.log(`[remove] until: ${until}, y: ${y}, after: ${after}`)
  for (let i = 0; i < TILES_WIDTH; i++) {
    insert.push(null)
  }

  state.field = state.field.slice(0, until).concat(state.field.slice(after), insert)
  return state
}

export function fill(x: number, y: number): ThunkAction<void, StoreState, void> {
  return (dispatch, getState) => {
    const initialState = getState().game
    if (!isPositionFree(initialState, x, y)) {
      return
    }

    dispatch({
      type: 'FILL',
      payload: {
        x,
        y,
        cell: createRandomCell()
      }
    })

    const state = getState().game
    if (!isRowFilled(state, y)) {
      return
    }

    console.log(`[row-filled] [${y}] full!`)
    dispatch({
      type: 'REMOVE',
      payload: y
    })
  }
}

export function gameState(state = initialState(), action: any): GameState {
  switch (action.type) {
    case 'FILL':
      return { ...state, field: setCellAt(state, action.payload.x, action.payload.y, action.payload.cell).field }
    case 'REMOVE':
      return { ...state, field: removeRow(state, action.payload).field }
  }
  return state
}

export default gameState
