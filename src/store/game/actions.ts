import { Cell, CellType, GameField, Tetromino } from './state'
import { StoreThunkAction } from 'store/state'
import { canMoveActive, sliceGameState, sliceGameStateActive } from './selectors'

export const ACTION_FILL = 'ACTION_FILL'
export const ACTION_UPDATE = 'ACTION_UPDATE'
export const ACTION_ROWS_CLEARED = 'ACTION_ROWS_CLEARED'
export const ACTION_SPAWN_ACTIVE = 'ACTION_SPAWN_ACTIVE'
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

export type UpdateAction = { type: typeof ACTION_UPDATE, payload: GameField }
export type RowsClearedAction = { type: typeof ACTION_ROWS_CLEARED, payload: number[] }
export type SpawnActiveAction = { type: typeof ACTION_SPAWN_ACTIVE, payload: CellType }
export type MoveActiveAction = { type: typeof ACTION_MOVE_ACTIVE | typeof ACTION_FALL_ACTIVE, payload: Movement }
export type SettleActiveAction = { type: typeof ACTION_SETTLE_ACTIVE }
export type RotateActiveAction = { type: typeof ACTION_ROTATE_ACTIVE, payload: Tetromino }
export type UpdateGhostAction = { type: typeof ACTION_UPDATE_GHOST, payload: Tetromino | null }
export type GameAction = UpdateAction
 | RowsClearedAction
 | SpawnActiveAction
 | MoveActiveAction
 | SettleActiveAction
 | RotateActiveAction
 | UpdateGhostAction

function createUpdateAction(field: GameField): UpdateAction {
  return {
    type: ACTION_UPDATE,
    payload: field
  }
}

function createRowsClearedAction(ys: number[]): RowsClearedAction {
  return {
    type: ACTION_ROWS_CLEARED,
    payload: ys
  }
}

function createSpawnActiveAction(type: CellType): SpawnActiveAction {
  return {
    type: ACTION_SPAWN_ACTIVE,
    payload: type
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


export function update(field: GameField): StoreThunkAction<UpdateAction> {
  return (dispatch) => {
    return dispatch(createUpdateAction(field))
  }
}

function updateGhost(): StoreThunkAction<UpdateGhostAction> {
  return (dispatch, getState) => {
    const state = getState()
    const gameState = sliceGameState(state)
    const active = sliceGameStateActive(state)
    if (!active) {
      return dispatch(createUpdateGhostAction(null))
    }

    const ghost = { ...active } as Tetromino
    while (canMoveActive(gameState, ghost, MOVEMENT_MOVE_DOWN)) {
      ghost.y0 -= 1
    }

    return dispatch(createUpdateGhostAction(ghost))
  }
}

export function rowsCleared(ys: number[]): StoreThunkAction<RowsClearedAction|null> {
  return (dispatch) => {
    if (ys.length === 0) {
      return null
    }
    return dispatch(createRowsClearedAction(ys))
  }
}

export function dropFromBag(): StoreThunkAction<SpawnActiveAction> {
  return (dispatch, getState) => {
    const state = getState()
    const { bag } = state.generator
    const type = bag.length > 0
      ? bag[0]
      : CellType._
    const action = dispatch(createSpawnActiveAction(type))
    dispatch(updateGhost())
    return action
  }
}

export function applyGravity(): StoreThunkAction<MoveActiveAction> {
  return (dispatch) => {
    return dispatch(createFallActiveAction())
  }
}

export function settleActive(): StoreThunkAction<SettleActiveAction> {
  return (dispatch) => {
    return dispatch(createSettleActiveAction())
  }
}

export function move(movement: Movement): StoreThunkAction<MoveActiveAction|null> {
  return (dispatch, getState) => {
    const state = getState()
    const gameState = sliceGameState(state)
    const active = sliceGameStateActive(state)
    if (!active || !canMoveActive(gameState, active, movement)) {
      return null
    }

    const action = dispatch(createMoveActiveAction(movement))
    dispatch(updateGhost())
    return action
  }
}

function transpose(width: number, height: number, cells: Cell[]) {
  const result = new Array(cells.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      result[x * height + y] = cells[y * width + x]
    }
  }
  return result
}

function reverseRows(width: number, height: number, cells: Cell[]) {
  const result = new Array(cells.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      result[(height - y  - 1) * width + x] = cells[y * width + x]
    }
  }
  return result
}

function rotateCellsClockwise(width: number, height: number, cells: Cell[]) {
  return reverseRows(width, height, transpose(width, height, cells))
}

function rotateCellsCounterClockwise(width: number, height: number, cells: Cell[]) {
  return transpose(width, height, reverseRows(width, height, cells))
}

function rotationToRotated(active: Tetromino, rotation: Rotation): Cell[] | null {
   switch (rotation) {
      case Rotation.Clockwise:
        return rotateCellsClockwise(active.width, active.height, active.cells)
      case Rotation.CounterClockwise:
        return rotateCellsCounterClockwise(active.width, active.height, active.cells)
    }

    return null
}


export function rotateClockwise(): StoreThunkAction<RotateActiveAction|null> {
  return rotate(Rotation.Clockwise)
}

export function rotateCounterClockwise(): StoreThunkAction<RotateActiveAction|null> {
  return rotate(Rotation.CounterClockwise)
}

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

    if (!canMoveActive(gameState, rotated, MOVEMENT_NONE)) {
      // Wall kick ? Floor kick?
      // TODO implement here
      return null
    }

    const action = dispatch(createRotateActiveAction(rotated))
    dispatch(updateGhost())
    return action
  }
}
