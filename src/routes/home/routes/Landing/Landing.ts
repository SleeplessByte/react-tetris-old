import { createElement } from 'react'

import Playfield from 'components/Playfield'

const playfieldProps = {
  key: 'playfield'
}

export function Landing() {
  return createElement('section', { style: { padding: 48 }},
    createElement(Playfield, playfieldProps)
  )
}

export default Landing
