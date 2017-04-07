export interface TimeState {
  frame: number
  frameLength: number
}

export function initialState(): TimeState {
  return {
    frame: 0,
    frameLength: 1000
  }
}

export default TimeState
