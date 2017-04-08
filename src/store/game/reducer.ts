import {
  initialState,
  GameState,
  GameField,
  GameFieldState,
  Cell,
  CellType,
  Tetromino
} from './state'

import tetrominoFactory, { moveToSpawnPosition } from 'store/generator/tetrominoFactory'

import {
  GameAction,

  ACTION_UPDATE_GHOST,
  ACTION_SPAWN_ACTIVE,
  ACTION_UPDATE,
  ACTION_MOVE_ACTIVE,
  ACTION_FALL_ACTIVE,
  ACTION_SETTLE_ACTIVE,
  ACTION_ROTATE_ACTIVE,
  ACTION_RESPAWN_ACTIVE
} from './actions'

import { TILES_WIDTH } from 'config'

declare const __DEV__: boolean

/**
 * Fill (settle) a cell in the game field
 *
 * @param {GameField} field mutable field
 * @param {{ x: number, y: number, cell: Cell }} props cell and position
 * @returns {GameField} the muted field
 */
function fillCell(field: GameField, props: { x: number, y: number, cell: Cell }): GameField {
  const i = props.y * TILES_WIDTH + props.x
  if (i - 1 < field.length) {
    field[i] = props.cell
  }
  return field
}

/**
 * Spawn a tetromino of a certain type
 *
 * @param {CellType} type
 * @returns {(Readonly<Tetromino> | null)}
 */
function spawnActive(type: CellType): Readonly<Tetromino> | null {
  return Object.freeze(tetrominoFactory(type))
}

/**
 *
 *
 * @param {Tetromino} active
 * @returns
 */
function respawnActive(active: Tetromino) {
  // tslint:disable-next-line:no-unused-variable
  const { x0, y0, ...partial } = active
  return Object.freeze(moveToSpawnPosition(partial))
}

/**
 * Move the active
 *
 * @param {GameState} state
 * @param {{ dx: number, dy: number }} props
 * @returns {(Readonly<Tetromino> | null)}
 */
function moveActive(state: GameState, props: { dx: number, dy: number }): Readonly<Tetromino> | null {
  const { active } = state
  if (!active) {
    if (__DEV__) {
      console.error('[invariant] tried to move active but there was none', props)
    }
    return null
  }

  return Object.freeze({ ...active, x0: active.x0 + props.dx, y0: active.y0 + props.dy })
}

/**
 * Settle the active
 *
 * @param {GameState} state
 * @returns {Partial<GameState>}
 */
function settleActive(state: GameState): Partial<GameState> {
  const { active } = state
  if (!active) {
    if (__DEV__) {
      console.error('[invariant] tried to settle active but there was none')
    }
    return {}
  }

  // Copy active to field
  let field = state.field.slice()
  const { width, height, y0, x0, cells } = active
  const checkProps = { x: -1, y: -1, cell: null as Cell }
  for (let _y = 0; _y < height; _y++) {
    checkProps.y = y0 + _y
    for (let _x = 0; _x < width; _x++) {
      checkProps.x = x0 + _x
      checkProps.cell = cells[_y * width + _x]
      if (checkProps.cell) {
        field = fillCell(field, checkProps)
      }
    }
  }

  return {
    active: null,
    field: Object.freeze(field)
  }
}

/**
 * Turns the field into a immutable state-able field
 *
 * @param {(GameField | GameFieldState)} field
 * @returns {GameFieldState}
 */
function makeFieldState(field: GameField | GameFieldState): GameFieldState {
  if (Object.isFrozen(field)) {
    return field
  }

  return Object.freeze(field as GameField)
}

export function gameReducer(state = initialState(), action: GameAction): GameState {
  switch (action.type) {
    case ACTION_MOVE_ACTIVE:
    case ACTION_FALL_ACTIVE:
      if (__DEV__) { console.log(`[reducer] [game] ${action.type} with movement: ${action.payload.dx}:${action.payload.dy}`) }
      return Object.freeze({ ...state, active: moveActive(state, action.payload) })

    case ACTION_ROTATE_ACTIVE:
      if (__DEV__) { console.log(`[reducer] [game] rotated actived`) }
      return Object.freeze({ ...state, active: Object.freeze(action.payload) })

    case ACTION_UPDATE_GHOST:
      if (__DEV__) { console.log(`[reducer] [game] update ghost`) }
      return Object.freeze({ ...state, ghost: Object.freeze(action.payload) })

    case ACTION_SETTLE_ACTIVE:
      if (__DEV__) { console.log('[reducer] [game] settle active') }
      return Object.freeze({ ...state, ...settleActive(state) })

    case ACTION_UPDATE:
      if (__DEV__) { console.log('[reducer] [game] update game field') }
      return Object.freeze({ ...state, field: makeFieldState(action.payload) })

    case ACTION_SPAWN_ACTIVE:
      if (__DEV__) { console.log(`[reducer] [game] spawn active with type: ${action.payload}`) }
      return Object.freeze({ ...state, active: spawnActive(action.payload) })

    case ACTION_RESPAWN_ACTIVE:
      if (__DEV__) { console.log(`[reducer] [game] respawn active with type: ${action.payload.type}`) }
      return Object.freeze({ ...state, active: respawnActive(action.payload) })
  }
  return state
}

export default gameReducer
