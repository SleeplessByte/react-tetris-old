import { GameState, Cell, CellState } from './state'
import { TILES_WIDTH, TILES_HEIGHT, TILES_BUFFER_HEIGHT } from 'config'
import { createSelector } from 'reselect'
import StoreState from 'store/state'

/**
 * Get the Game Field
 *
 * @param {StoreState} state the store state
 * @returns {(Cell|null)[]} the field
 */
export const getField = (state: GameState) => state.field

/**
 * Get the current frame
 */
export const getCurrentFrame = (state: GameState) => state.frame

/**
 * Get a cell
 *
 * @param {GameState} state the store state
 * @param {{ x: number, y: number }} props the props
 * @returns {Cell|null} the cell or null
 */
export function getCell(state: GameState, props: { x: number, y: number }): Cell | null {
  const field = getField(state)
  return field[props.y * TILES_WIDTH + props.x]
}

/**
 * Checks if a row is full
 *
 * @param {GameState} state the store state
 * @param {{ y: number }} props the props
 * @returns {boolean} true if it is
 */
export function isRowFilled(state: GameState, props: { y: number }): boolean {
  for (let x = 0; x < TILES_WIDTH; x++) {
    const cell = getCell(state, { ...props, x, })
    if (!cell || cell.state !== CellState.InActive) {
      return false
    }
  }

  return true
}

function cellFreePredicate(cell: Cell | null): boolean {
  return cell === null
    || cell.state === CellState.Active
}

/**
 * Is a cell free
 */
export function isPositionFree(state: GameState, props: { x: number, y: number }): boolean {
  const { x, y } = props
  return x >= 0
    && x < TILES_WIDTH
    && y >= 0
    && y < TILES_HEIGHT + TILES_BUFFER_HEIGHT
    && cellFreePredicate(getCell(state, props))
}

/**
 * Get the GameState slice
 *
 * @param {StoreState} state the store state
 * @returns {GameState} the game state
 */
export function sliceGameState(state: StoreState): GameState {
  return state.game
}

/**
 * Get the GameState field
 */
export const sliceGameStateField = createSelector(sliceGameState, getField)

/**
 *Get the GameState frame
 */
export const sliceGameStateFrame = createSelector(sliceGameState, getCurrentFrame)
