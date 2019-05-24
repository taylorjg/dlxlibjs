require('@babel/polyfill')
const { solutionGenerator } = require('../lib')

const matrix = [
  [1, 0, 0, 0],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
  [0, 1, 0, 0],
  [0, 0, 1, 0]
]

for (const solution of solutionGenerator(matrix))
  console.log('solution: %s', solution)
