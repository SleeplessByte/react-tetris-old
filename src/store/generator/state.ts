import { CellType } from 'interfaces/Cell'
export { CellType }

export interface GeneratorState extends Readonly<GeneratorState> {
  bag: ReadonlyArray<CellType>
}

/**
 * Generate a bag
 *
 * @export
 * @param {ReadonlyArray<CellType>} [current=[]]
 * @returns {ReadonlyArray<CellType>}
 */
export function generateBag(current: ReadonlyArray<CellType> = []): ReadonlyArray<CellType> {
  const all = [CellType.I, CellType.J, CellType.L, CellType.O, CellType.S, CellType.T, CellType.Z]
  const bag = [...current]
  while (all.length > 0) {
    bag.push(...all.splice(Math.floor(Math.random() * all.length), 1))
  }

  return Object.freeze(bag)
}

export function initialState(): GeneratorState {
  return Object.freeze({
    bag: generateBag([])
  })
}

export default GeneratorState
