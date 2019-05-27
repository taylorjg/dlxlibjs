import { DataObject } from './dataObject'
import { ColumnObject } from './columnObject'

/**
 * @typedef {number[]} PartialSolution The indices of the matrix rows that comprise a partial solution.
 */

/**
 * @typedef {number[]} Solution The indices of the matrix rows that comprise a complete solution.
 */

/**
 * This callback is invoked for each step of the algorithm.
 * @callback searchStepCallback
 * @param {PartialSolution} partialSolution The partial solution that represents this step of the algorithm.
 */

/**
 * This callback is invoked for each solution found.
 * @callback solutionFoundCallback
 * @param {Solution} solution A complete solution to the matrix being solved.
 */

/**
 * @typedef {*} MatrixValue Matrix values can be of any time. Anything truthy is treated as a 1. Anything falsy is treated as a 0.
 */

/**
 * @typedef {MatrixValue[]} MatrixRow A matrix row is an array of {MatrixValue}.
 */

/**
 * @typedef {MatrixRow[]} Matrix A matrix is an array of {MatrixRow}.
 */

 const defaultOptions = {
   numSolutions: Number.MAX_SAFE_INTEGER,
   numPrimaryColumns: Number.MAX_SAFE_INTEGER
 }

/**
 * Solves the matrix and returns an array of solutions.
 * @param {Matrix} matrix The matrix to be solved.
 * @param {searchStepCallback} [onSearchStep] A callback to be invoked for each step of the algorithm.
 * @param {solutionFoundCallback} [onSolutionFound] A callback to be invoked for each solution found.
 * @param {object} [options] Optional options object.
 * @param {number} options.numSolutions The number of solutions to be returned. By default, all solutions are returned.
 * @param {number} options.numPrimaryColumns The number of primary columns. By default, all columns are primary.
 *     Any remaining columns are considered to be secondary columns.
 * @returns {Solution[]} The solutions that were found.
 */
export const solve = (matrix, onSearchStep, onSolutionFound, options) => {
  const actualOptions = Object.assign({}, defaultOptions, options)
  if (!Number.isInteger(actualOptions.numSolutions)) {
    throw new Error('options.numSolutions must be an integer')
  }
  if (actualOptions.numSolutions < 0) {
    throw new Error(`options.numSolutions can't be negative - don't be silly`)
  }
  const generator = solutionGenerator(matrix, onSearchStep, onSolutionFound, actualOptions)
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
 * @param {searchStepCallback} [onSearchStep] A callback to be invoked for each step of the algorithm.
 * @param {solutionFoundCallback} [onSolutionFound] A callback to be invoked for each solution found.
 * @param {object} [options] Optional options object.
 * @param {number} options.numPrimaryColumns The number of primary columns. By default, all columns are primary.
 *     Any remaining columns are considered to be secondary columns.
 * @returns {IterableIterator.<number>} An ES2015 Generator object that can be used to iterate over the solutions.
 */
export const solutionGenerator = function* (matrix, onSearchStep, onSolutionFound, options) {
  const actualOptions = Object.assign({}, defaultOptions, options)
  if (!Number.isInteger(actualOptions.numPrimaryColumns)) {
    throw new Error('options.numPrimaryColumns must be an integer')
  }
  if (actualOptions.numPrimaryColumns < 0) {
    throw new Error(`options.numPrimaryColumns can't be negative - don't be silly`)
  }
  const root = buildInternalStructure(matrix, actualOptions.numPrimaryColumns)
  const searchState = new SearchState(root, onSearchStep, onSolutionFound)
  yield* search(searchState)
}

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
      yield searchState.currentSolution.slice().sort()
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

  constructor(root, onSearchStep, onSolutionFound) {
    this.root = root
    this.onSearchStep = onSearchStep
    this.onSolutionFound = onSolutionFound
    this.currentSolution = []
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
    if (this.onSearchStep) {
      this.onSearchStep(this.currentSolution)
    }
  }

  solutionFound() {
    if (this.onSolutionFound) {
      this.onSolutionFound(this.currentSolution)
    }
  }
}
