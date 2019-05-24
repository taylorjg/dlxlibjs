[![CircleCI](https://circleci.com/gh/taylorjg/dlxlibjs.svg?style=svg)](https://circleci.com/gh/taylorjg/dlxlibjs)

## Description

This is a JavaScript library to solve exact cover problems by implementing Donald E. Knuth's Algorithm X using the Dancing Links technique.

* [Knuth's original paper](https://arxiv.org/pdf/cs/0011047v1.pdf)
* [Knuth's Algorithm X (Wikipedia)](http://en.wikipedia.org/wiki/Algorithm_X "Knuth's Algorithm X (Wikipedia)")
* [Dancing Links (Wikipedia)](http://en.wikipedia.org/wiki/Dancing_Links "Dancing Links (Wikipedia)")
* [Exact cover (Wikipedia)](http://en.wikipedia.org/wiki/Exact_cover "Exact cover (Wikipedia)")

## Examples

* [Visualisation of solving a Sudoku puzzle](https://sudoku-dlx-js.herokuapp.com/)
* [Visualisation of solving a Tetris Cube puzzle](https://tetriscubewebgl.herokuapp.com/)
* [Pentominoes](https://pentominoes.herokuapp.com/)
* [Visualisation of solving a Ripple Effect puzzle](https://ripple-effect-dlx.herokuapp.com/)

## Simple Example

```js
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

const solutions = solve(matrix)
solutions.forEach((solution, index) =>
  console.log('solution[%d]: %s', index, solution))

// solution[0]: 0,3,4
// solution[1]: 1,2
// solution[2]: 2,4,5
```

## Callbacks

The `onSearchStep` callback is particularly useful for visualising the progress of the algorithm.

```js
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

// onSearchStep[0]: 
// onSearchStep[1]: 0
// onSearchStep[2]: 0,3
// onSearchStep[3]: 0,3,4

// onSolutionFound[0]: 0,3,4

// onSearchStep[4]: 2
// onSearchStep[5]: 2,1

// onSolutionFound[1]: 2,1

// onSearchStep[6]: 2,4
// onSearchStep[7]: 2,4,5

// onSolutionFound[2]: 2,4,5
```

## Specifying the number of solutions to return

```js
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

// solution[0]: 0,3,4
```

## Using the solution generator

As an alternative to `dlxlib.solve`, `dlxlib.solutionGenerator` returns a
[Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

```js
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

// solution: 0,3,4
// solution: 1,2
// solution: 2,4,5
```
