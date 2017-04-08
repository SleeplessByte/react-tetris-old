import 'performance.now.polyfill'

export interface TimeState extends Readonly<TimeState> {
  active: boolean
  frame: number
  frameLength: number
  t0: number
}

export function initialState(): TimeState {
  return Object.freeze({
    active: true,
    frame: 0,
    frameLength: 500,
    t0: performance.now()
  })
}

export default TimeState
