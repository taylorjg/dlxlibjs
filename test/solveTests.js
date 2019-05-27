import { expect } from 'chai'
import { solve, Dlx } from '../lib'
import * as M from './matrices'

describe('#solve tests', function () {

  it('solving an empty matrix returns an empty array of solutions', function () {
    const solutions = solve(M.MATRIX_EMPTY)
    expect(solutions).to.be.empty
  })

  it('solving a matrix with one solution returns an array with one solution', function () {
    const solutions = solve(M.MATRIX_WITH_ONE_SOLUTION)
    expect(solutions).to.have.lengthOf(1)
  })

  it('solving a matrix with one solution returns an array with the correct solution', function () {
    const solutions = solve(M.MATRIX_WITH_ONE_SOLUTION)
    const solution = solutions[0]
    expect(solution).to.deep.equal([0, 3, 4])
  })

  it('solving a matrix with three solutions returns an array with three solutions', function () {
    const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS)
    expect(solutions).to.have.lengthOf(3)
  })

  it('solving a matrix with three solutions returns an array with the correct three solutions', function () {
    const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS)
    expect(solutions).to.deep.include.members([[0, 3, 4]])
    expect(solutions).to.deep.include.members([[1, 2]])
    expect(solutions).to.deep.include.members([[2, 4, 5]])
  })

  it('solving a matrix with three solutions but n set to two returns an array with two solutions', function () {
    const options = {
      numSolutions: 2
    }
    const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS, options)
    expect(solutions).to.have.lengthOf(2)
  })

  it('solving a matrix with three solutions but n set to five returns an array with three solutions', function () {
    const options = {
      numSolutions: 3
    }
    const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS, options)
    expect(solutions).to.have.lengthOf(3)
  })

  it('step events', () => {
    let numEvents = 0
    const dlx = new Dlx()
    dlx.on('step', () => numEvents++)
    dlx.solve(M.MATRIX_WITH_THREE_SOLUTIONS)
    expect(numEvents).to.be.greaterThan(3)
  })

  it('solution events', () => {
    let numEvents = 0
    const dlx = new Dlx()
    dlx.on('solution', () => numEvents++)
    dlx.solve(M.MATRIX_WITH_THREE_SOLUTIONS)
    expect(numEvents).to.equal(3)
  })

  it('seconday columns can be all zeros unlike primary columns', () => {
    const matrix = M.MATRIX_WITH_ONE_SOLUTION.map(primaryColumns => [
      ...primaryColumns,
      0
    ])

    const solutionsWithNoOptionsSpecified = solve(matrix)
    expect(solutionsWithNoOptionsSpecified).to.have.lengthOf(0)

    const numPrimaryColumns = M.MATRIX_WITH_ONE_SOLUTION[0].length
    const options = { numPrimaryColumns }
    const solutionsWithOneSecondaryColumnSpecified = solve(matrix, options)
    expect(solutionsWithOneSecondaryColumnSpecified).to.have.lengthOf(1)
  })

  it('secondary columns can be covered only once like primary columns', () => {
    const solutions = solve(M.MATRIX_WITH_ONE_SOLUTION)
    expect(solutions).to.have.lengthOf(1)
    const solution = solutions[0]
    const matrixWithSecondaryColumn = M.MATRIX_WITH_ONE_SOLUTION
      .map((primaryColumns, index) => [
        ...primaryColumns,
        solution.includes(index) ? 1 : 0
      ])
    const numPrimaryColumns = M.MATRIX_WITH_ONE_SOLUTION[0].length
    const options = { numPrimaryColumns }
    const solutionsWithSecondaryColumn = solve(matrixWithSecondaryColumn, options)
    expect(solutionsWithSecondaryColumn).to.have.lengthOf(0)
  })
})
