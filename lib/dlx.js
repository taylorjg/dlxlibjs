import EventEmitter from 'events'
import { DataObject } from './dataObject'
import { ColumnObject } from './columnObject'

/**
 * @typedef {number[]} PartialSolution The indices of the matrix rows that comprise a partial solution.
 */

/**
 * @typedef {number[]} Solution The indices of the matrix rows that comprise a complete solution.
 */

/**
 * @typedef {*} MatrixValue Matrix values can be of any type. Anything truthy is treated as a 1. Anything falsy is treated as a 0.
 */

/**
 * @typedef {MatrixValue[]} MatrixRow A matrix row is an array of {@link MatrixValue}.
 */

/**
 * @typedef {MatrixRow[]} Matrix A matrix is an array of {@link MatrixRow}.
 */

/**
 * Solves the matrix and returns an array of solutions.
 * This is a convenience function which avoids having to create an instance of the {@link Dlx} class.
 * It is useful if you are not interested in handling any events.
 * @param {Matrix} matrix The matrix to be solved.
 * @param {object} [options] Optional options object.
 * @param {number} options.numSolutions The number of solutions to be returned. By default, all solutions are returned.
 * @param {number} options.numPrimaryColumns The number of primary columns. By default, all columns are primary.
 *     Any remaining columns are considered to be secondary columns.
 * @returns {Solution[]} The solutions that were found.
 */
export function solve(matrix, options) {
  return new Dlx().solve(matrix, options)
}

/**
 * Creates an ES2015 Generator object that can be used to iterate over the solutions to the matrix.
 * This is a convenience function which avoids having to create an instance of the {@link Dlx} class.
 * It is useful if you are not interested in handling any events.
 * @param {Matrix} matrix The matrix to be solved.
 * @param {object} [options] Optional options object.
 * @param {number} options.numPrimaryColumns The number of primary columns. By default, all columns are primary.
 *     Any remaining columns are considered to be secondary columns.
 * @yields {Solution} The next solution.
 */
export function* solutionGenerator(matrix, options) {
  yield* new Dlx().solutionGenerator(matrix, options)
}

const defaultOptions = {
  numSolutions: Number.MAX_SAFE_INTEGER,
  numPrimaryColumns: Number.MAX_SAFE_INTEGER
}

/**
 * Use this class if you want to handle {@link Dlx#event:step} or {@link Dlx#event:solution} events.
 * Otherwise, it is easier to use the global functions, {@link solve} and {@link solutionGenerator}.
 */
export class Dlx extends EventEmitter {

  /**
   * Solves the matrix and returns an array of solutions.
   * @param {Matrix} matrix The matrix to be solved.
   * @param {object} [options] Additional options object.
   * @param {number} [options.numSolutions] The number of solutions to be returned. By default, all solutions are returned.
   * @param {number} [options.numPrimaryColumns] The number of primary columns. By default, all columns are primary.
   *     Any remaining columns are considered to be secondary columns.
   * @returns {Solution[]} The solutions that were found.
   * @fires Dlx#step
   * @fires Dlx#solution
   */
  solve(matrix, options) {
    const actualOptions = Object.assign({}, defaultOptions, options)
    if (!Number.isInteger(actualOptions.numSolutions)) {
      throw new Error('options.numSolutions must be an integer')
    }
    if (actualOptions.numSolutions < 0) {
      throw new Error(`options.numSolutions can't be negative - don't be silly`)
    }
    const generator = this.solutionGenerator(matrix, actualOptions)
    const numSolutions = actualOptions.numSolutions
    const solutions = []
    for (let index = 0; index < numSolutions; index++) {
      const iteratorResult = generator.next()
      if (iteratorResult.done) break
      solutions.push(iteratorResult.value)
    }
    return solutions
  }

  /**
   * Creates an ES2015 Generator object that can be used to iterate over the solutions to the matrix.
   * @param {Matrix} matrix The matrix to be solved.
   * @param {object} [options] Additional options object.
   * @param {number} [options.numPrimaryColumns] The number of primary columns. By default, all columns are primary.
   *     Any remaining columns are considered to be secondary columns.
   * @yields {Solution} The next solution.
   * @fires Dlx#step
   * @fires Dlx#solution
   */
  * solutionGenerator(matrix, options) {
    const actualOptions = Object.assign({}, defaultOptions, options)
    if (!Number.isInteger(actualOptions.numPrimaryColumns)) {
      throw new Error('options.numPrimaryColumns must be an integer')
    }
    if (actualOptions.numPrimaryColumns < 0) {
      throw new Error(`options.numPrimaryColumns can't be negative - don't be silly`)
    }
    const root = buildInternalStructure(matrix, actualOptions.numPrimaryColumns)
    const searchState = new SearchState(this, root)
    yield* search(searchState)
  }
}

/**
 * Step event - fired for each step of the algorithm.
 * @event Dlx#step
 * @type object
 * @property {PartialSolution} partialSolution The current partial solution at this step of the algorithm.
 * @property {number} stepIndex The index of this step of the algorithm (0, 1, 2, ...).
 */

/**
 * Solution event - fired for each solution found.
 * @event Dlx#solution
 * @type object
 * @property {Solution} solution A solution to the matrix.
 * @property {number} solutionIndex The index of this solution (0, 1, 2, ...).
 */

const buildInternalStructure = (matrix, numPrimaryColumns) => {

  numPrimaryColumns = numPrimaryColumns || (matrix[0] ? matrix[0].length : 0)

  const root = new ColumnObject()
  const colIndexToListHeader = new Map()

  matrix.forEach((row, rowIndex) => {
    let firstDataObjectInThisRow = null
    row.forEach((col, colIndex) => {
      if (rowIndex === 0) {
        const listHeader = new ColumnObject()
        if (colIndex < numPrimaryColumns) {
          root.appendColumnHeader(listHeader)
        }
        colIndexToListHeader.set(colIndex, listHeader)
      }
      if (col) {
        const listHeader = colIndexToListHeader.get(colIndex)
        const dataObject = new DataObject(listHeader, rowIndex)
        if (firstDataObjectInThisRow)
          firstDataObjectInThisRow.appendToRow(dataObject)
        else
          firstDataObjectInThisRow = dataObject
      }
    })
  })

  return root
}

function* search(searchState) {

  searchState.searchStep()

  if (searchState.isEmpty()) {
    if (searchState.currentSolution.length) {
      searchState.solutionFound()
      yield searchState.currentSolution.slice()
    }
    return
  }

  const c = chooseColumnWithFewestRows(searchState)
  coverColumn(c)
  for (let r = c.down; r !== c; r = r.down) {
    searchState.pushRowIndex(r.rowIndex)
    r.loopRight(j => coverColumn(j.listHeader))
    yield* search(searchState)
    r.loopLeft(j => uncoverColumn(j.listHeader))
    searchState.popRowIndex()
  }
  uncoverColumn(c)
}

const chooseColumnWithFewestRows = searchState => {
  let chosenColumn = null
  searchState.root.loopNext(column => {
    if (!chosenColumn || column.numberOfRows < chosenColumn.numberOfRows) {
      chosenColumn = column
    }
  })
  return chosenColumn
}

const coverColumn = c => {
  c.unlinkColumnHeader()
  c.loopDown(i => i.loopRight(j => j.listHeader.unlinkDataObject(j)))
}

const uncoverColumn = c => {
  c.loopUp(i => i.loopLeft(j => j.listHeader.relinkDataObject(j)))
  c.relinkColumnHeader()
}

class SearchState {

  constructor(dlx, root) {
    this.dlx = dlx
    this.root = root
    this.currentSolution = []
    this.stepIndex = 0
    this.solutionIndex = 0
  }

  isEmpty() {
    return this.root.nextColumnObject === this.root
  }

  pushRowIndex(rowIndex) {
    this.currentSolution.push(rowIndex)
  }

  popRowIndex() {
    this.currentSolution.pop()
  }

  searchStep() {
    if (this.currentSolution.length) {
      const e = {
        partialSolution: this.currentSolution.slice(),
        stepIndex: this.stepIndex++
      }
      this.dlx.emit('step', e)
    }
  }

  solutionFound() {
    const e = {
      solution: this.currentSolution.slice(),
      solutionIndex: this.solutionIndex++
    }
    this.dlx.emit('solution', e)
  }
}
