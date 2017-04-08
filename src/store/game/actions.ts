import { Cell, CellType, GameField, GameFieldState, Tetromino } from './state'
import { StoreThunkAction } from 'store/state'
import { isMovePossible, sliceGameState, sliceGameStateActive } from './selectors'

export const ACTION_FILL = 'ACTION_FILL'
export const ACTION_UPDATE = 'ACTION_UPDATE'
export const ACTION_SPAWN_ACTIVE = 'ACTION_SPAWN_ACTIVE'
export const ACTION_RESPAWN_ACTIVE = 'ACTION_RESPAWN_ACTIVE'
export const ACTION_FALL_ACTIVE = 'ACTION_FALL_ACTIVE'
export const ACTION_MOVE_ACTIVE = 'ACTION_MOVE_ACTIVE'
export const ACTION_SETTLE_ACTIVE = 'ACTION_SETTLE_ACTIVE'
export const ACTION_ROTATE_ACTIVE = 'ACTION_ROTATE_ACTIVE'
export const ACTION_UPDATE_GHOST = 'ACTION_UPDATE_GHOST'

export const MOVEMENT_MOVE_DOWN = Object.freeze({ dx: 0, dy: -1 })
export const MOVEMENT_MOVE_LEFT = Object.freeze({ dx: -1, dy: 0 })
export const MOVEMENT_MOVE_RIGHT = Object.freeze({ dx: 1, dy: 0 })
export const MOVEMENT_NONE = Object.freeze({ dx: 0, dy: 0 })

export const enum Rotation {
  None              = 0,
  Clockwise         = 1,
  CounterClockwise  = 2
}

export type Movement = typeof MOVEMENT_MOVE_DOWN
 | typeof MOVEMENT_MOVE_LEFT
 | typeof MOVEMENT_MOVE_RIGHT
 | typeof MOVEMENT_NONE

export type UpdateAction = { type: typeof ACTION_UPDATE, payload: GameField | GameFieldState }
export type SpawnActiveAction = { type: typeof ACTION_SPAWN_ACTIVE, payload: CellType }
export type RespawnActiveAction = { type: typeof ACTION_RESPAWN_ACTIVE, payload: Tetromino }
export type MoveActiveAction = { type: typeof ACTION_MOVE_ACTIVE | typeof ACTION_FALL_ACTIVE, payload: Movement }
export type SettleActiveAction = { type: typeof ACTION_SETTLE_ACTIVE }
export type RotateActiveAction = { type: typeof ACTION_ROTATE_ACTIVE, payload: Tetromino }
export type UpdateGhostAction = { type: typeof ACTION_UPDATE_GHOST, payload: Tetromino | null }
export type GameAction = UpdateAction
 | RespawnActiveAction
 | SpawnActiveAction
 | MoveActiveAction
 | SettleActiveAction
 | RotateActiveAction
 | UpdateGhostAction

function createUpdateAction(field: GameField | GameFieldState): UpdateAction {
  return {
    type: ACTION_UPDATE,
    payload: field
  }
}

function createSpawnActiveAction(type: CellType): SpawnActiveAction {
  return {
    type: ACTION_SPAWN_ACTIVE,
    payload: type
  }
}

function createRepawnActiveAction(active: Tetromino): RespawnActiveAction {
  return {
    type: ACTION_RESPAWN_ACTIVE,
    payload: active
  }
}

export function createFallActiveAction(): MoveActiveAction {
  return {
    type: ACTION_FALL_ACTIVE,
    payload: MOVEMENT_MOVE_DOWN
  }
}

function createSettleActiveAction(): SettleActiveAction {
  return {
    type: ACTION_SETTLE_ACTIVE
  }
}

function createRotateActiveAction(rotated: Tetromino): RotateActiveAction {
  return {
    type: ACTION_ROTATE_ACTIVE,
    payload: rotated
  }
}

function createUpdateGhostAction(ghost: Tetromino | null): UpdateGhostAction {
  return {
    type: ACTION_UPDATE_GHOST,
    payload: ghost
  }
}

function createMoveActiveAction(movement: Movement): MoveActiveAction {
  return {
    type: ACTION_MOVE_ACTIVE,
    payload: movement
  }
}

/**
 * Update the settle field
 *
 * @export
 * @param {(GameField | GameFieldState)} field
 * @returns {StoreThunkAction<UpdateAction>}
 */
export function update(field: GameField | GameFieldState): StoreThunkAction<UpdateAction> {
  return (dispatch) => {
    return dispatch(createUpdateAction(field))
  }
}

/**
 * Update the ghost position based on the current active
 *
 * @returns {StoreThunkAction<UpdateGhostAction>}
 */
function calculateGhostPosition(): StoreThunkAction<UpdateGhostAction> {
  return (dispatch, getState) => {
    const state = getState()
    const gameState = sliceGameState(state)
    const active = sliceGameStateActive(state)

    if (!active) {
      return dispatch(createUpdateGhostAction(null))
    }

    const ghost = { ...active } as Tetromino
    while (isMovePossible(gameState, ghost, MOVEMENT_MOVE_DOWN)) {
      ghost.y0 -= 1
    }

    return dispatch(createUpdateGhostAction(ghost))
  }
}

/**
 * Drop a tetromino from the bag
 *
 * @export
 * @returns {StoreThunkAction<SpawnActiveAction>}
 */
export function dropFromBag(): StoreThunkAction<SpawnActiveAction> {
  return (dispatch, getState) => {
    const state = getState()
    const { bag } = state.generator
    const type = bag.length > 0
      ? bag[0]
      : CellType._
    const action = dispatch(createSpawnActiveAction(type))
    dispatch(calculateGhostPosition())
    return action
  }
}

/**
 * Apply gravity
 *
 * @export
 * @returns {StoreThunkAction<MoveActiveAction>}
 */
export function applyGravity(): StoreThunkAction<MoveActiveAction> {
  return (dispatch) => {
    return dispatch(createFallActiveAction())
  }
}

/**
 * Settle the active
 *
 * @export
 * @returns {StoreThunkAction<SettleActiveAction>}
 */
export function settle(): StoreThunkAction<SettleActiveAction> {
  return (dispatch) => {
    return dispatch(createSettleActiveAction())
  }
}

/**
 * Move the active
 *
 * @export
 * @param {Movement} movement
 * @returns {(StoreThunkAction<MoveActiveAction|null>)}
 */
export function move(movement: Movement): StoreThunkAction<MoveActiveAction|null> {
  return (dispatch, getState) => {
    const state = getState()
    const gameState = sliceGameState(state)
    const active = sliceGameStateActive(state)
    if (!active || !isMovePossible(gameState, active, movement)) {
      return null
    }

    const action = dispatch(createMoveActiveAction(movement))
    dispatch(calculateGhostPosition())
    return action
  }
}

/**
 * Transpose cells
 *
 * @param {number} width
 * @param {number} height
 * @param {Cell[]} cells
 * @returns
 */
function transpose(width: number, height: number, cells: Cell[]) {
  const result = new Array(cells.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      result[x * height + y] = cells[y * width + x]
    }
  }
  return result
}

/**
 * Reverse rows of cells
 *
 * @param {number} width
 * @param {number} height
 * @param {Cell[]} cells
 * @returns
 */
function reverseRows(width: number, height: number, cells: Cell[]) {
  const result = new Array(cells.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      result[(height - y  - 1) * width + x] = cells[y * width + x]
    }
  }
  return result
}

/**
 * Convenience method to rotate cells clockwise
 *
 * @param {number} width
 * @param {number} height
 * @param {Cell[]} cells
 * @returns
 */
function rotateCellsClockwise(width: number, height: number, cells: Cell[]) {
  return reverseRows(width, height, transpose(width, height, cells))
}

/**
 * Convience method to rotate cells counter clockwise
 *
 * @param {number} width
 * @param {number} height
 * @param {Cell[]} cells
 * @returns
 */
function rotateCellsCounterClockwise(width: number, height: number, cells: Cell[]) {
  return transpose(width, height, reverseRows(width, height, cells))
}

/**
 * Turns a rotation into the rotated cells of the passed in active
 *
 * @param {Tetromino} active
 * @param {Rotation} rotation
 * @returns {(Cell[] | null)}
 */
function rotationToRotated(active: Tetromino, rotation: Rotation): Cell[] | null {
   switch (rotation) {
      case Rotation.Clockwise:
        return rotateCellsClockwise(active.width, active.height, active.cells)
      case Rotation.CounterClockwise:
        return rotateCellsCounterClockwise(active.width, active.height, active.cells)
    }

    return null
}

/**
 * Rotate active clockwise
 *
 * @export
 * @returns {(StoreThunkAction<RotateActiveAction|null>)}
 */
export function rotateClockwise(): StoreThunkAction<RotateActiveAction|null> {
  return rotate(Rotation.Clockwise)
}

/**
 * Rotate active counter clockwise
 *
 * @export
 * @returns {(StoreThunkAction<RotateActiveAction|null>)}
 */
export function rotateCounterClockwise(): StoreThunkAction<RotateActiveAction|null> {
  return rotate(Rotation.CounterClockwise)
}

/**
 * Rotate active
 *
 * @param {Rotation} rotation
 * @returns {(StoreThunkAction<RotateActiveAction|null>)}
 */
function rotate(rotation: Rotation): StoreThunkAction<RotateActiveAction|null> {
  return (dispatch, getState) => {
    const state = getState()
    const gameState = sliceGameState(state)
    const active = sliceGameStateActive(state)
    if (!active) {
      return null
    }

    const cells = rotationToRotated(active, rotation)
    if (!cells) {
      return null
    }
    const rotated: Tetromino = { ...active, cells }

    if (!isMovePossible(gameState, rotated, MOVEMENT_NONE)) {
      // Wall kick ? Floor kick?
      // TODO implement here
      return null
    }

    const action = dispatch(createRotateActiveAction(rotated))
    dispatch(calculateGhostPosition())
    return action
  }
}

/**
 *
 *
 * @export
 * @param {(Tetromino | null)} active
 * @returns {StoreThunkAction<void>}
 */
export function respawn(active: Tetromino | null): StoreThunkAction<void> {
  return (dispatch) => {
    if (active === null) {
      return dispatch(dropFromBag())
    }

    const action = dispatch(createRepawnActiveAction(active))
    dispatch(calculateGhostPosition())
    return action
  }
}
