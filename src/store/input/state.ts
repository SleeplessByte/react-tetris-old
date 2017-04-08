export interface InputState extends Readonly<InputState> {
  enabled: boolean
}

export function initialState(): InputState {
  return Object.freeze({
    enabled: true
  })
}

export default InputState
