export interface StatsState extends Readonly<StatsState> {
  cleared: number
}

export function initialState(): StatsState {
  return Object.freeze({
    cleared: 0
  })
}

export default StatsState
