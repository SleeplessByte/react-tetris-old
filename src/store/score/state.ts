export interface ScoreState extends Readonly<ScoreState> {
  awardLines: number
  points: number
  combo: number
}

export function initialState(): ScoreState {
  return Object.freeze({
    awardLines: 0,
    points: 0,
    combo: 0
  })
}

export default ScoreState
