import { Component, createElement } from 'react'
import { connect } from 'react-redux'
import { tick } from 'store/time/actions'
import { sliceGameStateFrame } from 'store/game/selectors'
import StoreState, { StoreDispatch } from 'store/state'
import './performance.now.polyfill'

const MS_IN_S = 1000

export interface TimeManipulationProps {}

interface ConnectedTimeManipulationProps extends TimeManipulationProps {
  active: boolean
  frame: number
  frameLength: number
  tick(): void
}

interface TimeManipulationState {
  fps: number
}

export class TimeManipulation extends Component<ConnectedTimeManipulationProps, TimeManipulationState> {

  private tickId: number | undefined
  private mounted: boolean
  private t0: number
  private dt: number

  private tfps0: number
  private dframes: number

  constructor(props: ConnectedTimeManipulationProps) {
    super(props)

    this.requestTick = this.requestTick.bind(this)
    this.onTick = this.onTick.bind(this)

    this.state = {
      fps: 0
    }
  }

  shouldComponentUpdate(_: ConnectedTimeManipulationProps, nextState: TimeManipulationState) {
    return nextState.fps !== this.state.fps
  }

  componentDidMount() {
    this.t0 = performance.now()
    this.tfps0 = this.t0
    this.dt = 0
    this.dframes = 0
    this.mounted = true

    this.requestTick()
  }

  componentWillUnmount() {
    if (this.tickId) {
      cancelAnimationFrame(this.tickId)
      this.tickId = undefined
      this.mounted = false
    }
  }

  requestTick() {
    if (!this.mounted) {
      return
    }

    this.tickId = requestAnimationFrame(this.onTick)
  }

  onTick() {
    const t1 = performance.now()

    this.dframes += 1
    if (t1 - this.tfps0 > MS_IN_S) {
      this.tfps0 = t1
      const fps = this.dframes
      this.dframes = 0
      this.setState((previousState) => ({ ...previousState, fps }))
    }

    if (!this.props.active) {
      this.t0 = t1
      this.requestTick()
      return
    }

    // Instead of dropping logic frames, keep executing until its up to date
    let dt = (t1 - this.t0) + this.dt
    while (dt > this.props.frameLength) {
      this.dt = dt - this.props.frameLength
      this.t0 = t1

      dt -= this.props.frameLength
      this.props.tick()
    }

    this.requestTick()
  }

  render() {
    return createElement('p', {}, `${this.state.fps} fps`)
  }
}

function mapStateToProps(state: StoreState, ownProps: TimeManipulationProps) {
  return {
    active: true,
    frame: sliceGameStateFrame(state),
    frameLength: 500,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: StoreDispatch) {
  return {
    tick: () => { dispatch(tick()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeManipulation)
