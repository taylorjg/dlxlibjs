[![CircleCI](https://circleci.com/gh/taylorjg/dlxlibjs.svg?style=svg)](https://circleci.com/gh/taylorjg/dlxlibjs)

## Description

This is a JavaScript library to solve exact cover problems by implementing Donald E. Knuth's Algorithm X using the Dancing Links technique.

* [Knuth's original paper](https://arxiv.org/pdf/cs/0011047v1.pdf)
* [Knuth's Algorithm X (Wikipedia)](http://en.wikipedia.org/wiki/Algorithm_X "Knuth's Algorithm X (Wikipedia)")
* [Dancing Links (Wikipedia)](http://en.wikipedia.org/wiki/Dancing_Links "Dancing Links (Wikipedia)")
* [Exact cover (Wikipedia)](http://en.wikipedia.org/wiki/Exact_cover "Exact cover (Wikipedia)")

## Demos

_(These projects are hosted on the [Heroku](http://heroku.com) free tier so may take 10s or so to spin up)_

* [Visualisation of solving a Sudoku puzzle](https://sudoku-dlx-js.herokuapp.com/)
* [Visualisation of solving a Tetris Cube puzzle](https://tetriscubewebgl.herokuapp.com/)
* [Visualisation of solving a Ripple Effect puzzle](https://ripple-effect-dlx.herokuapp.com/)
  * _demonstrates use of secondary columns_
* [Pentominoes](https://pentominoes.herokuapp.com/)
  * _demonstrates use of a web worker to do the solving_

## Documentation

> **NOTE:** This documentation pertains to the [dlxlib@next](https://www.npmjs.com/package/dlxlib/v/2.0.0-alpha.1) release of dlxlib.

* https://taylorjg.github.io/dlxlibjs

## Example

> **NOTE:** This example pertains to the [dlxlib@next](https://www.npmjs.com/package/dlxlib/v/2.0.0-alpha.1) release of dlxlib.

```
const { Dlx } = require('dlxlib')

const matrix = [
  [1, 0, 0, 0],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
  [0, 1, 0, 0],
  [0, 0, 1, 0]
]

const onStep = e =>
  console.log(`step[${e.stepIndex}]: ${e.partialSolution}`)

const onSolution = e =>
  console.log(`solution[${e.solutionIndex}]: ${e.solution}`)

const dlx = new Dlx()
dlx.on('step', onStep)
dlx.on('solution', onSolution)
dlx.solve(matrix)

// step[0]: 
// step[1]: 0
// step[2]: 0,3
// step[3]: 0,3,4
// solution[0]: 0,3,4
// step[4]: 2
// step[5]: 2,1
// solution[1]: 2,1
// step[6]: 2,4
// step[7]: 2,4,5
// solution[2]: 2,4,5
```

## Migrating from 1.0.3 to 2.0.0

See the [migration guide](MIGRATION_GUIDE.md).
