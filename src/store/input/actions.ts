import {
  Movement,
  move,
  rotateClockwise,
  rotateCounterClockwise,
  MoveActiveAction,
  RotateActiveAction,

  MOVEMENT_MOVE_DOWN,
  MOVEMENT_MOVE_LEFT,
  MOVEMENT_MOVE_RIGHT
} from 'store/game/actions'

import {
  hold
} from 'store/hold/actions'

import { tick } from 'store/game/tick'
import { softDrop, hardDrop } from 'store/score/actions'
import { setNextFrameTo } from 'store/time/actions'
import { StoreThunkAction } from 'store/state'
import 'performance.now.polyfill'

const MOVE_FRAME_DELAY = 300
const ROTATE_FRAME_DELAY = 150

/**
 * Press based movement
 *
 * @param {Movement} movement
 * @returns {(StoreThunkAction<MoveActiveAction | null>)}
 */
function pressMovement(movement: Movement): StoreThunkAction<MoveActiveAction | null> {
  return (dispatch) => {
    const action = dispatch(move(movement))
    if (!action) {
      return null
    }

    // Delay because of move
    dispatch(setNextFrameTo(performance.now(), MOVE_FRAME_DELAY))
    return action
  }
}

/**
 * Convenience for movement based on pressing left
 *
 * @export
 * @returns {(StoreThunkAction<MoveActiveAction | null>)}
 */
export function pressLeft(): StoreThunkAction<MoveActiveAction | null> {
  return pressMovement(MOVEMENT_MOVE_LEFT)
}

/**
 * Convenience for movement based on pressing right
 *
 * @export
 * @returns {(StoreThunkAction<MoveActiveAction | null>)}
 */
export function pressRight(): StoreThunkAction<MoveActiveAction | null> {
  return pressMovement(MOVEMENT_MOVE_RIGHT)
}

/**
 * Convenience for movement based on pressing down
 *
 * @export
 * @returns {(StoreThunkAction<MoveActiveAction | null>)}
 */
export function pressDown(): StoreThunkAction<MoveActiveAction | null> {
  return (dispatch) => {
    const action = dispatch(pressMovement(MOVEMENT_MOVE_DOWN))
    if (action) {
      dispatch(softDrop())
    }
    return action
  }
}

/**
 * Hard drop movement when pressing up
 *
 * @export
 * @returns {StoreThunkAction<MoveActiveAction[]>}
 */
export function pressUp(): StoreThunkAction<MoveActiveAction[]> {
  return (dispatch) => {
    const actions: MoveActiveAction[] = []

    // Simulate 20G
    while (true) {
      const action = dispatch(pressMovement(MOVEMENT_MOVE_DOWN))
      if (!action) {
        break
      }

      actions.push(action)
    }

    if (actions.length > 0) {
      dispatch(hardDrop(actions.length))

      // No lock delay
      dispatch(tick())
    }

    return actions
  }
}

/**
 * Pressing rotate clockwise
 *
 * @export
 * @returns {(StoreThunkAction<RotateActiveAction | null>)}
 */
export function pressRotateClockwise(): StoreThunkAction<RotateActiveAction | null> {
  return (dispatch) => {
    const action = dispatch(rotateClockwise())
    if (!action) {
      return null
    }

    dispatch(setNextFrameTo(performance.now(), ROTATE_FRAME_DELAY))
    return action
  }
}

/**
 * Pressing rotate counter clockwise
 *
 * @export
 * @returns {(StoreThunkAction<RotateActiveAction | null>)}
 */
export function pressRotateCounterClockwise(): StoreThunkAction<RotateActiveAction | null> {
  return (dispatch) => {
    const action = dispatch(rotateCounterClockwise())
    if (!action) {
      return null
    }

    dispatch(setNextFrameTo(performance.now(), ROTATE_FRAME_DELAY))
    return action
  }
}

export function pressHold(): StoreThunkAction<void> {
  return (dispatch) => {
    dispatch(hold())
  }
}
