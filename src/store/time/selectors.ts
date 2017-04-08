import { TimeState } from './state'
import { createSelector } from 'reselect'
import StoreState from 'store/state'

export const sliceTimeState = (state: StoreState) => state.time

export const sliceTimeStateFrame = createSelector(sliceTimeState, (state: TimeState) => state.frame)
export const sliceTimeStateFrameLength = createSelector(sliceTimeState, (state: TimeState) => state.frameLength)
export const sliceTimeStateActive = createSelector(sliceTimeState, (state: TimeState) => state.active)
export const sliceTimeStateT0 = createSelector(sliceTimeState, (state: TimeState) => state.t0)
