import { GameState, GameField, GameFieldState, Tetromino } from './state'
import { sliceGameState, sliceGameStateActive, isMoveDownPossible, isRowFilled } from './selectors'
import { update, dropFromBag, applyGravity, settle } from './actions'

import { lineScore } from 'store/score/actions'

import { TILES_WIDTH, TILES_BUFFER_HEIGHT, TILES_HEIGHT } from 'config'

import { StoreThunkAction } from 'store/state'

/**
 * Gets the rows the active block is on
 *
 * @param {(Readonly<Tetromino> | null)} active the active block
 * @returns {number[]} the rows
 */
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

/**
 * Remove rows from the field
 *
 * @param {GameField} field the field
 * @param {number[]} ys y-coords of the rows to remove
 * @returns {GameField} the field if ys is empty or a copy without the rows
 */
function removeRows(field: GameField | GameFieldState, ys: number[]): GameField | GameFieldState {
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

/**
 * Optimized version for remove a single row
 *
 * @param {(GameField | GameFieldState)} field the field
 * @param {number} y the row to remove
 * @returns {GameField} the modified field
 */
function removeRow(field: GameField | GameFieldState, y: number): GameField {
  const until = Math.max(0, y * TILES_WIDTH)
  const after = until + TILES_WIDTH
  const insert = []
  for (let i = 0; i < TILES_WIDTH; i++) {
    insert.push(null)
  }

  return field.slice(0, until).concat(field.slice(after), insert)
}

/**
 * Clone the (immutable) field so it may be modified
 *
 * @param {(GameState | GameFieldState)} state
 * @returns {GameField}
 */
function cloneField(state: GameState | GameFieldState): GameField {
  return Array.isArray(state)
    ? (state as GameFieldState).slice()
    : cloneField((state as GameState).field)
}

/**
 * Mark the end of the frame and tick the game state
 *
 * @export
 * @returns {StoreThunkAction<void>}
 */
export function tick(): StoreThunkAction<void> {
  return (dispatch, getState) => {
    let state = getState()
    if (!sliceGameStateActive(state)) {
      dispatch(dropFromBag())
      state = getState()
    }

    // Try to move the active down
    if (isMoveDownPossible(sliceGameState(state), sliceGameStateActive(state))) {

      // If it could still fall, no need to settle
      dispatch(applyGravity())
      return
    }

    // Settle instead
    const ys = getActiveRows(sliceGameStateActive(state))
    dispatch(settle())
    state = getState()

    // Remove settled full rows (including one above and one row below) as there was a timing issue that was not isolated and by expanding
    // rows to check to one above and below it didn't happen.
    const field = cloneField(sliceGameState(state))
    const remove: number[] = []
    const min = Math.max(0, Math.min(...ys) - 1)
    const max = Math.min(TILES_BUFFER_HEIGHT + TILES_HEIGHT - 1, Math.max(...ys) + 1)
    for (let y = min; y < max; y++) {
      if (!isRowFilled(field, { y })) {
        continue
      }

      remove.push(y)
    }

    // Remove rows if any
    if (remove.length > 0) {
      dispatch(update(removeRows(field, remove)))
    }

    dispatch(lineScore(remove.length))

    // Time to drop a new piece from the bag
    dispatch(dropFromBag())
  }
}

export default tick
