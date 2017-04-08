import { ScoreState } from './state'
import { createSelector } from 'reselect'
import StoreState from 'store/state'

export const sliceScoreState = (state: StoreState) => state.score

export function linesToLevel(lines: number): number {
  return 1 + (lines / 15 | 0)
}

export function levelToLines(level: number): number {
  return level * 15
}

export const sliceScoreStateAwardLines = createSelector(sliceScoreState, (state: ScoreState) => state.awardLines)
export const sliceScoreStateCombo = createSelector(sliceScoreState, (state: ScoreState) => state.combo)
export const sliceScoreStatePoints = createSelector(sliceScoreState, (state: ScoreState) => state.points)
export const level = createSelector(sliceScoreStateAwardLines, (lines: number) => linesToLevel(lines))
export const levelUp = createSelector(sliceScoreStateAwardLines, level, (lines: number, current: number) => levelToLines(current) - lines)
