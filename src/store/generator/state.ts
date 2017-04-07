import Cell, { CellState, CellType } from 'interfaces/Cell'
import Tetramino from 'interfaces/Tetramino'

export { Cell, CellState, CellType, Tetramino }

export interface GeneratorState {
  bag: CellType[]
}

function generateBag(): CellType[] {
  const all = [CellType.I, CellType.J, CellType.L, CellType.O, CellType.S, CellType.T, CellType.Z]
  const bag: CellType[] = []
  while (all.length > 0) {
    bag.push(...all.splice(Math.floor(Math.random() * all.length), 1))
  }

  return bag
}

export function initialState(): GeneratorState {
  return {
    bag: generateBag()
  }
}

export default GeneratorState
