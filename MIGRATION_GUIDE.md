# Overview

This document gives details of how to migrate from version 1.0.3 to version 2.0.0 of dlxlib.

# Simple Scenario

If you do not use callbacks or limit the number of solutions then no changes are required:

```
const solutions = solve(matrix)
```

# Callbacks

You may be using callbacks like this:

```
const onSearchStep = rowIndices => {
  // ...
}

const onSolutionFound = rowIndices => {
  // ...
}

const solutions = solve(matrix, onSearchStep, onSolutionFound)
```

In this case, you will now have to create an instance of the `Dlx` class and then
use `.on` to add handlers for the `step` and `solution` events:

```
const onStep = ({ partialSolution, stepIndex }) => {
  // ...
}

const onSolution = ({ solution, solutionIndex }) => {
  // ...
}

const dlx = new Dlx())
dlx.on('step', onStep)
dlx.on('solution', onSolution)
const solutions = dlx.solve(matrix)
```

# Limiting the number of solutions

You may be limiting the number of solutions like this:

```
const solutions = solve(matrix, undefined, undefined, 1)
```

In this case, you will now have to pass in an `options` object with a `numSolutions` property:

```
const options = {
  numSolutions: 1
}
const solutions = solve(matrix, options)
```
