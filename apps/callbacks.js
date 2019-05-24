require('@babel/polyfill')
const { solve } = require('../lib')

const matrix = [
  [1, 0, 0, 0],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
  [0, 1, 0, 0],
  [0, 0, 1, 0]
]

let searchStepCount = 0
const onSearchStep = rowIndices =>
  console.log('onSearchStep[%d]: %s', searchStepCount++, rowIndices)

let solutionCount = 0
const onSolutionFound = rowIndices =>
  console.log('\nonSolutionFound[%d]: %s\n', solutionCount++, rowIndices)

solve(matrix, onSearchStep, onSolutionFound)
