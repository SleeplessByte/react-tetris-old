export interface StatsState extends Readonly<StatsState> {
  cleared: number
  combos: number
  softDrops: number
  hardDrops: number
  pieces: number
}

export function initialState(): StatsState {
  return Object.freeze({
    cleared: 0,
    combos: 0,
    softDrops: 0,
    hardDrops: 0,
    pieces: 0
  })
}

export default StatsState
