const chai = require('chai')
const { expect } = chai
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
chai.use(deepEqualInAnyOrder)
const { solutionGenerator, Dlx } = require('../lib')
const M = require('./matrices')

describe('#solutionGenerator tests', function () {

  it('solving an empty matrix returns an empty generator', function () {
    const generator = solutionGenerator(M.MATRIX_EMPTY)
    const solutions = Array.from(generator)
    expect(solutions).to.be.empty
  })

  it('solving a matrix with one solution returns a generator with one solution', function () {
    const generator = solutionGenerator(M.MATRIX_WITH_ONE_SOLUTION)
    const solutions = Array.from(generator)
    expect(solutions).to.have.lengthOf(1)
  })

  it('solving a matrix with one solution returns a generator with the correct solution', function () {
    const generator = solutionGenerator(M.MATRIX_WITH_ONE_SOLUTION)
    const solutions = Array.from(generator)
    expect(solutions).to.deep.equalInAnyOrder([
      [0, 3, 4]
    ])
  })

  it('solving a matrix with three solutions returns a generator with three solutions', function () {
    const generator = solutionGenerator(M.MATRIX_WITH_THREE_SOLUTIONS)
    const solutions = Array.from(generator)
    expect(solutions).to.have.lengthOf(3)
  })

  it('solving a matrix with three solutions returns a generator with the correct three solutions', function () {
    const generator = solutionGenerator(M.MATRIX_WITH_THREE_SOLUTIONS)
    const solutions = Array.from(generator)
    expect(solutions).to.deep.equalInAnyOrder([
      [0, 3, 4],
      [1, 2],
      [2, 4, 5],
    ])
  })

  it('step events', () => {
    let numEvents = 0
    const dlx = new Dlx()
    dlx.on('step', () => numEvents++)
    const generator = dlx.solutionGenerator(M.MATRIX_WITH_THREE_SOLUTIONS)
    Array.from(generator)
    expect(numEvents).to.be.greaterThan(3)
  })

  it('solution events', () => {
    let numEvents = 0
    const dlx = new Dlx()
    dlx.on('solution', () => numEvents++)
    const generator = dlx.solutionGenerator(M.MATRIX_WITH_THREE_SOLUTIONS)
    Array.from(generator)
    expect(numEvents).to.equal(3)
  })
})
