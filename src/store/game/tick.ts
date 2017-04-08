import { GameState, GameField, GameFieldState, Tetromino } from './state'
import { sliceGameState, sliceGameStateActive, canMoveActiveDown, isRowFilled } from './selectors'
import { update, rowsCleared, dropFromBag, applyGravity, settleActive } from './actions'

import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

import { StoreThunkAction } from 'store/state'

function getActiveRows(active: Readonly<Tetromino> | null): number[] {
  if (!active) {
    return []
  }

  const rows = new Array(active.height)
  for (let i = 0; i < active.height; i++) {
    const y = active.y0 + i
    rows[i] = y
  }
  return rows
}


function removeRows(field: GameField, ys: number[]): GameField {
  switch (ys.length) {
    case 0:
      return field
    case 1:
      return removeRow(field, ys[0])
  }

  const result: GameField = []
  for (let y = 0; y < TILES_HEIGHT + TILES_BUFFER_HEIGHT; y++) {
    if (ys.indexOf(y) >= 0 ) {
      continue
    }
    const row = field.slice(y * TILES_WIDTH, y * TILES_WIDTH + TILES_WIDTH)
    result.push(...row)
  }

  const removedCount = TILES_WIDTH * ys.length
  for (let i = 0; i < removedCount; i++) {
    result.push(null)
  }

  return result
}

function removeRow(field: GameField, y: number): GameField {
  const until = Math.max(0, y * TILES_WIDTH)
  const after = until + TILES_WIDTH
  const insert = []
  for (let i = 0; i < TILES_WIDTH; i++) {
    insert.push(null)
  }

  return field.slice(0, until).concat(field.slice(after), insert)
}

function cloneField(state: GameState | GameFieldState): GameField {
  return Array.isArray(state)
    ? (state as GameFieldState).slice()
    : cloneField((state as GameState).field)
}

const _rowMarker: boolean[] = new Array(TILES_WIDTH)
for (let x = 0; x < TILES_WIDTH; x++) {
  _rowMarker[x] = true
}

export function tick(): StoreThunkAction<void> {
  return (dispatch, getState) => {
    let state = getState()
    if (!sliceGameStateActive(state)) {
      dispatch(dropFromBag())
      state = getState()
    }

    // Try to move the active down
    if (canMoveActiveDown(sliceGameState(state), sliceGameStateActive(state))) {
      dispatch(applyGravity())
      return
    }

    // Settle instead
    const ys = getActiveRows(sliceGameStateActive(state))
    dispatch(settleActive())
    state = getState()

    // Remove settled full rows
    let field = cloneField(sliceGameState(state))
    const remove: number[] = []
    const min = Math.max(0, Math.min(...ys) - 1)
    const max = Math.min(TILES_BUFFER_HEIGHT + TILES_HEIGHT - 1, Math.max(...ys) + 1)
    for (let y = min; y < max; y++) {
      if (!isRowFilled(field, { y })) {
        continue
      }

      remove.push(y)
    }

    if (remove.length > 0) {
      field = removeRows(field, remove)
      dispatch(rowsCleared(remove))
      dispatch(update(field))
    }

    dispatch(dropFromBag())
  }
}

export default tick
