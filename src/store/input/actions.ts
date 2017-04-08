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

import { tick } from 'store/game/tick'

import { setNextFrameTo } from 'store/time/actions'
import { StoreThunkAction } from 'store/state'
import 'performance.now.polyfill'

const MOVE_FRAME_DELAY = 300
const ROTATE_FRAME_DELAY = 150

function pressMovement(movement: Movement): StoreThunkAction<MoveActiveAction | null> {
  return (dispatch) => {
    const action = dispatch(move(movement))
    if (!action) {
      return null
    }

    dispatch(setNextFrameTo(performance.now(), MOVE_FRAME_DELAY))
    return action
  }
}

export function pressLeft(): StoreThunkAction<MoveActiveAction | null> {
  return pressMovement(MOVEMENT_MOVE_LEFT)
}

export function pressRight(): StoreThunkAction<MoveActiveAction | null> {
  return pressMovement(MOVEMENT_MOVE_RIGHT)
}

export function pressDown(): StoreThunkAction<MoveActiveAction | null> {
  return pressMovement(MOVEMENT_MOVE_DOWN)
}

export function pressUp(): StoreThunkAction<MoveActiveAction[]> {
  return (dispatch) => {
    const actions: MoveActiveAction[] = []

    // Simulate 20G
    while (true) {
      const action = dispatch(pressDown())
      if (!action) {
        break
      }

      actions.push(action)
    }

    if (actions.length > 0) {
      // No lock delay
      dispatch(tick())
    }

    return actions
  }
}

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
