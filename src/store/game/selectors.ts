import { GameState, GameField, GameFieldState, Cell, CellType } from './state'
import { TILES_WIDTH, TILES_HEIGHT, TILES_BUFFER_HEIGHT } from 'config'
import { createSelector } from 'reselect'
import StoreState from 'store/state'

import Tetromino from 'interfaces/Tetromino'

declare const __DEV__: boolean

export enum CellState {
  None = 0,

  InActive = 1,
  Active = 2,
  Ghost = 3
}

export type AnnotatedCell = {
  state: CellState
  cell: Cell
}

/**
 * Get the Game Field
 *
 * @param {StoreState} state the store state
 * @returns {GameField} the field
 */
const getField = (state: GameState | GameFieldState): GameFieldState => {
  return Array.isArray(state)
    ? state as GameFieldState
    : getField((state as GameState).field)
}

const getActive = (state: GameState): Readonly<Tetromino> | null => state.active
const getGhost = (state: GameState): Readonly<Tetromino> | null => state.ghost

export function getActiveCell(active: Tetromino | Readonly<Tetromino> | null, props: { x: number, y: number}): CellType {
  const invalid = !active
    || active.x0 > props.x
    || active.y0 > props.y
    || active.x0 + active.width <= props.x
    || active.y0 + active.height <= props.y

  if (invalid || !active) {
    return CellType._
  }

  const dx = props.x - active.x0
  const dy = props.y - active.y0
  const i = dy * active.width + dx

  if (__DEV__ && (i < 0 || i > active.cells.length)) {
    console.error(`[invariant] ${props.x}:${props.y} resulted in ${i} and is not a valid active cell position`)
    return CellType._
  }

  return active.cells[i] || CellType._
}

export function getFieldCell(field: GameField | GameFieldState, props: { x: number, y: number}): CellType {
  const i = props.y * TILES_WIDTH + props.x
  if (__DEV__) {
    if (i < 0 || i >= field.length) {
      console.error(`[invariant] ${props.x}:${props.y} is not a valid field position`)
      return CellType._
    }
  }

  return field[i] || CellType._
}

/**
 * Get a cell
 *
 * @param {GameState|GameField} state the store state or field
 * @param {{ x: number, y: number }} props the props
 * @returns {Cell|null} the cell or null
 */
export function getCell(state: GameState, props: { x: number, y: number }): AnnotatedCell {
  const activeCell = getActiveCell(getActive(state), props)
  if (activeCell !== CellType._) {
    return {
      state: CellState.Active,
      cell: activeCell
    }
  }

  const ghostCell = getActiveCell(getGhost(state), props)
  if (ghostCell !== CellType._) {
    return {
      state: CellState.Ghost,
      cell: ghostCell
    }
  }

  const fieldCell = getFieldCell(getField(state), props)
  return {
    state: fieldCell !== CellType._ ? CellState.InActive : CellState.None,
    cell: fieldCell
  }

}

/**
 * Checks if a row is full
 *
 * @param {GameState|GameFieldState} state the store state
 * @param {{ y: number }} props the props
 * @returns {boolean} true if it is
 */
export function isRowFilled(state: GameState | GameFieldState, props: { y: number }): boolean {
  for (let x = 0; x < TILES_WIDTH; x++) {
    const cell = getFieldCell(getField(state), { ...props, x, })
    if (cell === CellType._) {
      return false
    }
  }

  return true
}

/**
 * @param {GameState|GameFieldState} state the store state or field
 */
export function isPositionFree(state: GameState | GameFieldState, props: { x: number, y: number }): boolean {
  const { x, y } = props
  return x >= 0
    && x < TILES_WIDTH
    && y >= 0
    && y < TILES_HEIGHT + TILES_BUFFER_HEIGHT
    && getFieldCell(getField(state), props) === CellType._
}

const _canMoveCheckProps = { x: -1, y: -1 }
export function canMoveActive(state: GameState, active: Tetromino | Readonly<Tetromino>, props: { dx: number, dy: number }): boolean {
  const { dx, dy } = props
  const { width, height, y0, x0, cells } = active

  for (let _y = 0; _y < height; _y++) {
    _canMoveCheckProps.y = y0 + _y + dy
    for (let _x = 0; _x < width; _x++) {
      _canMoveCheckProps.x = x0 + _x + dx
      const cell = cells[_y * width + _x]
      if (cell && !isPositionFree(state, _canMoveCheckProps)) {
        return false
      }
    }
  }

  return true
}

const MOVE_DOWN = Object.freeze({ dx: 0, dy: -1 })
const MOVE_LEFT = Object.freeze({ dx: -1, dy: 0 })
const MOVE_RIGHT = Object.freeze({ dx: 1, dy: 0 })
export function canMoveActiveDown(state: GameState, active: Tetromino | Readonly<Tetromino> | null): boolean {
  return active !== null && canMoveActive(state, active, MOVE_DOWN)
}

export function canMoveActiveLeft(state: GameState, active: Tetromino | Readonly<Tetromino> | null): boolean {
  return active !== null && canMoveActive(state, active, MOVE_LEFT)
}

export function canMoveActiveRight(state: GameState, active: Tetromino | Readonly<Tetromino> | null): boolean {
  return active !== null && canMoveActive(state, active, MOVE_RIGHT)
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
export const sliceGameStateActive = createSelector(sliceGameState, getActive)
export const sliceGameStateGhost = createSelector(sliceGameState, getGhost)
