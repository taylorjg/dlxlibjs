[![CircleCI](https://circleci.com/gh/taylorjg/dlxlibjs.svg?style=svg)](https://circleci.com/gh/taylorjg/dlxlibjs)

## Description

This is a JavaScript library to solve exact cover problems by implementing Donald E. Knuth's Algorithm X using the Dancing Links technique.

* [Knuth's original paper](https://arxiv.org/pdf/cs/0011047v1.pdf)
* [Knuth's Algorithm X (Wikipedia)](http://en.wikipedia.org/wiki/Algorithm_X "Knuth's Algorithm X (Wikipedia)")
* [Dancing Links (Wikipedia)](http://en.wikipedia.org/wiki/Dancing_Links "Dancing Links (Wikipedia)")
* [Exact cover (Wikipedia)](http://en.wikipedia.org/wiki/Exact_cover "Exact cover (Wikipedia)")

## Simple Example

```js
var dlxlib = require('dlxlib');

var matrix = [
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 0]
];

var solutions = dlxlib.solve(matrix);
for (var i = 0; i < solutions.length; i++) {
    console.log('solution[%d]: %s', i, JSON.stringify(solutions[i]));
}

// solution[0]: [0,3,4]
// solution[1]: [1,2]
// solution[2]: [2,4,5]
```

## Callbacks

The `onSearchStep` callback is particularly useful for visualising the progress of the algorithm.
For an example of this approach, see [this Sudoku solver](https://sudoku-dlx-js.herokuapp.com/).

```js
var dlxlib = require('dlxlib');

var matrix = [
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 0]
];

var searchStepCount = 0;
function onSearchStep(rowIndices) {
    console.log('\tpartial solution[%d]: %s', searchStepCount++, JSON.stringify(rowIndices));
}

var solutionCount = 0;
function onSolutionFound(rowIndices) {
    console.log('solution[%d]: %s', solutionCount++, JSON.stringify(rowIndices));
    searchStepCount = 0;
}

dlxlib.solve(matrix, onSearchStep, onSolutionFound);

//         partial solution[0]: []
//         partial solution[1]: [0]
//         partial solution[2]: [0,3]
//         partial solution[3]: [0,3,4]
// solution[0]: [0,3,4]
//         partial solution[0]: [2]
//         partial solution[1]: [2,1]
// solution[1]: [2,1]
//         partial solution[0]: [2,4]
//         partial solution[1]: [2,4,5]
// solution[2]: [2,4,5]
```

## Specifying the number of solutions to return

```js
var dlxlib = require('dlxlib');

var matrix = [
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 0]
];

var solutions = dlxlib.solve(matrix, null, null, 1);
if (solutions.length) {
    console.log('first solution: %s', JSON.stringify(solutions[0]));
}

// first solution: [0,3,4]
```

## Using the solution generator

As an alternative to `dlxlib.solve`, `dlxlib.solutionGenerator` returns a
[Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

```js
import { solutionGenerator } from 'dlxlib';

const matrix = [
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 0]
];

const generator = solutionGenerator(matrix);
const iteratorResult = generator.next();
if (!iteratorResult.done) {
    console.log('first solution: %s', JSON.stringify(iteratorResult.value));
}

// first solution: [0,3,4]
```
