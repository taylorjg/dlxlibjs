2.0.0-alpha.2 (xxx June 2019)

* Don't emit an initial `step` event with an empty partial solution

2.0.0-alpha.1 (1st June 2019)

* Added support for secondary columns

## Breaking API Changes

* Introduced an `options` parameter
  * Replaces the `onSearchStep`, `onSolutionFound` & `n` parameters
* Introduced a `Dlx` class
* Switched from callbacks to events
  * The `onSearchStep` callback has been replaced by the `step` event
  * The `onSolutionFound` callback has been replaced by the `solution` event

1.0.3 (7th April 2017)

* Added keywords to package.json
* Added JSDoc comments to the source code
* Added this CHANGELOG.md
* Updated README.md with links to a couple of example programs
