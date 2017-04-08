import { Component } from 'react'
import { connect } from 'react-redux'
import { pressDown, pressLeft, pressRight, pressUp, pressRotateClockwise, pressRotateCounterClockwise, pressHold } from 'store/input/actions'
import StoreState, { StoreDispatch } from 'store/state'

export interface InputListenerProps {}

interface ConnectedInputListenerProps extends InputListenerProps {
  enabled: boolean

  pressLeft(): void
  pressRight(): void
  pressUp(): void
  pressDown(): void
  pressRotateClockwise(): void
  pressRotateCounterClockwise(): void
  pressHold(): void
}

interface InputListenerState {}

const ARROW_LEFT = 37
const ARROW_RIGHT = 39
const ARROW_UP = 38
const ARROW_DOWN = 40
const SHIFT = 16
const CTRL = 17
const SPACE = 32

const W = 87
const A = 65
const S = 83
const D = 68
const Q = 81
const E = 69
const R = 82

export class InputListener extends Component<ConnectedInputListenerProps, InputListenerState> {

  private rotationLocked: boolean

  constructor(props: ConnectedInputListenerProps) {
    super(props)

    this.onPress = this.onPress.bind(this)
    this.onRelease = this.onRelease.bind(this)
    this.onPressLeft = this.onPressLeft.bind(this)
    this.onPressRight = this.onPressRight.bind(this)
    this.onPressUp = this.onPressUp.bind(this)
    this.onPressDown = this.onPressDown.bind(this)
    this.onPressRotateClockwise = this.onPressRotateClockwise.bind(this)
    this.onPressRotateCounterClockwise = this.onPressRotateCounterClockwise.bind(this)
    this.onPressHold = this.onPressHold.bind(this)
  }

  onPressLeft() {
    this.props.pressLeft()
  }

  onPressRight() {
    this.props.pressRight()
  }

  onPressUp() {
    this.props.pressUp()
  }

  onPressDown() {
    this.props.pressDown()
  }

  onPressHold() {
    this.props.pressHold()
  }

  onPressRotateClockwise() {
    if (this.rotationLocked) {
      return
    }

    this.props.pressRotateClockwise()
    this.rotationLocked = true
  }

  onPressRotateCounterClockwise() {
    if (this.rotationLocked) {
      return
    }

    this.props.pressRotateCounterClockwise()
    this.rotationLocked = true
  }

  onPress(ev: KeyboardEvent) {
    switch (ev.which) {
      case ARROW_LEFT:
      case A:
        return this.onPressLeft()
      case ARROW_RIGHT:
      case D:
         return this.onPressRight()
      case ARROW_UP:
      case W:
        return this.onPressUp()
      case ARROW_DOWN:
      case S:
        return this.onPressDown()
      case SHIFT:
      case Q:
        return this.onPressRotateCounterClockwise()
      case CTRL:
      case E:
        return this.onPressRotateClockwise()
      case SPACE:
      case R:
        return this.onPressHold()
    }
  }

  onRelease(ev: KeyboardEvent) {
    switch (ev.which) {
      case SHIFT:
      case CTRL:
      case Q:
      case E:
        this.rotationLocked = false
        return
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onPress)
    document.addEventListener('keyup', this.onRelease)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onPress)
    document.removeEventListener('keyup', this.onRelease)
  }

  render() {
    return null
  }
}

function mapStateToProps(_state: StoreState, ownProps: InputListenerProps) {
  return {
    ...ownProps
  }
}

function mapDispatchToProps(dispatch: StoreDispatch) {
  return {
    pressDown: () => { dispatch(pressDown()) },
    pressLeft: () => { dispatch(pressLeft()) },
    pressRight: () => { dispatch(pressRight()) },
    pressUp: () => { dispatch(pressUp()) },
    pressRotateClockwise: () => { dispatch(pressRotateClockwise()) },
    pressRotateCounterClockwise: () => { dispatch(pressRotateCounterClockwise()) },
    pressHold: () => { dispatch(pressHold()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputListener)
