import { createElement, Component } from 'react'
import { level, sliceScoreStatePoints, levelUp } from 'store/score/selectors'
import StoreState from 'store/state'
import { connect } from 'react-redux'

export interface ScoreBoardProps {

}

interface ConnectedScoreBoardProps extends ScoreBoardProps {
  level: number
  levelUp: number
  points: number
}
interface ScoreBoardState {}


export class ScoreBoard extends Component<ConnectedScoreBoardProps, ScoreBoardState> {

  constructor(props: ConnectedScoreBoardProps) {
    super(props)
  }

  render() {
    return createElement('table', {},
      createElement('tbody', {}, [
        createElement('tr', { key: 'lines-left' }, [
          createElement('th', { key: 'key' }, 'Lines'),
          createElement('td', { key: 'value' }, this.props.levelUp)
        ]),

        createElement('tr', { key: 'level' }, [
          createElement('th', { key: 'key' }, 'Level'),
          createElement('td', { key: 'value' }, this.props.level)
        ]),

        createElement('tr', { key: 'points' }, [
          createElement('th', { key: 'key' }, 'Points'),
          createElement('td', { key: 'value' }, this.props.points)
        ]),
      ])
    )
  }
}

function mapStateToDispatch(state: StoreState, ownProps: ScoreBoardProps) {
  return {
   level: level(state),
   levelUp: levelUp(state),
   points: sliceScoreStatePoints(state),
    ...ownProps
  }
}

export default connect(mapStateToDispatch)(ScoreBoard)

