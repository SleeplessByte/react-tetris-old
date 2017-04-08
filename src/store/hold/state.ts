import Tetromino from 'interfaces/Tetromino'

export interface HoldState extends Readonly<HoldState> {
  locked: boolean
  held:  Readonly<Tetromino> | null
}

export function initialState(): HoldState {
  return Object.freeze({
    locked: false,
    held: null
  })
}

export default HoldState
