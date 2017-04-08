import { Component, createElement } from 'react'
import { connect } from 'react-redux'
import { tick } from 'store/time/actions'
import { sliceTimeStateFrame, sliceTimeStateFrameLength, sliceTimeStateActive, sliceTimeStateT0 } from 'store/time/selectors'
import StoreState, { StoreDispatch } from 'store/state'
import 'performance.now.polyfill'

const MS_IN_S = 1000
const __DROP_RENDER_FRAMES__ = false
const __DROP_LOGIC_FRAMES__ = true

export interface TimeManipulationProps {}

interface ConnectedTimeManipulationProps extends TimeManipulationProps {
  active: boolean
  frame: number
  frameLength: number
  t0: number
  tick(t1: number): void
}

interface TimeManipulationState {
  fps: number
}

const fpsProps = {
  style: {
    marginLeft: 16
  }
}

export class TimeManipulation extends Component<ConnectedTimeManipulationProps, TimeManipulationState> {

  private tickId: number | undefined
  private mounted: boolean
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
    this.tfps0 = this.props.t0
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
      this.requestTick()
      return
    }

    let dt = (t1 - this.props.t0) + this.dt
    while (dt > this.props.frameLength) {
      this.dt = dt - this.props.frameLength

      if (__DROP_RENDER_FRAMES__) {
        // Instead of dropping logic frames, keep executing until its up to date
        dt -= this.props.frameLength
      } else if (__DROP_LOGIC_FRAMES__) {
        // Instead of dropping render frames, simply act like the game was paused
        dt %= this.props.frameLength
      } else {
        // Drop both
        dt = 0
      }
      this.props.tick(t1)
    }

    this.requestTick()
  }

  render() {
    return createElement('section', fpsProps, `${this.state.fps} fps`)
  }
}

function mapStateToProps(state: StoreState, ownProps: TimeManipulationProps) {
  return {
    active: sliceTimeStateActive(state),
    frame: sliceTimeStateFrame(state),
    frameLength: sliceTimeStateFrameLength(state),
    t0: sliceTimeStateT0(state),
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: StoreDispatch) {
  return {
    tick: (t1: number) => { dispatch(tick(t1)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeManipulation)
