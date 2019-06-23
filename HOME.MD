## Overview

Solves exact cover problems by implementing Donald E. Knuth's Algorithm X using the Dancing Links technique (DLX).

## Example

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

// step[0]: 0
// step[1]: 0,3
// step[2]: 0,3,4
// solution[0]: 0,3,4
// step[3]: 2
// step[4]: 2,1
// solution[1]: 2,1
// step[5]: 2,4
// step[6]: 2,4,5
// solution[2]: 2,4,5
```
