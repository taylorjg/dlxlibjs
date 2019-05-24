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

const solutions = solve(matrix, undefined, undefined, 1)
solutions.forEach((solution, index) =>
  console.log('solution[%d]: %s', index, solution))
