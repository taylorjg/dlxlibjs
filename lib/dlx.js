'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.solutionGenerator = exports.solve = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _dataObject = require('./dataObject');

var _columnObject = require('./columnObject');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [search].map(_regenerator2.default.mark);

var solve = exports.solve = function solve(matrix, onSearchStep, onSolutionFound, n) {
    var generator = solutionGenerator(matrix, onSearchStep, onSolutionFound);
    var max = n || Number.MAX_VALUE;
    var solutions = [];
    for (var i = 0; i < max; i++) {
        var iteratorResult = generator.next();
        if (iteratorResult.done) break;
        solutions.push(iteratorResult.value);
    }
    return solutions;
};

var solutionGenerator = exports.solutionGenerator = _regenerator2.default.mark(function solutionGenerator(matrix, onSearchStep, onSolutionFound) {
    var root, searchState;
    return _regenerator2.default.wrap(function solutionGenerator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    root = buildInternalStructure(matrix);
                    searchState = new SearchState(root, onSearchStep, onSolutionFound);
                    return _context.delegateYield(search(searchState), 't0', 3);

                case 3:
                case 'end':
                    return _context.stop();
            }
        }
    }, solutionGenerator, this);
});

var buildInternalStructure = function buildInternalStructure(matrix) {

    var root = new _columnObject.ColumnObject();
    var colIndexToListHeader = new _map2.default();

    matrix.forEach(function (row, rowIndex) {
        var firstDataObjectInThisRow = null;
        row.forEach(function (col, colIndex) {
            if (rowIndex === 0) {
                var listHeader = new _columnObject.ColumnObject();
                root.appendColumnHeader(listHeader);
                colIndexToListHeader.set(colIndex, listHeader);
            }
            if (col) {
                var _listHeader = colIndexToListHeader.get(colIndex);
                var dataObject = new _dataObject.DataObject(_listHeader, rowIndex);
                if (firstDataObjectInThisRow) firstDataObjectInThisRow.appendToRow(dataObject);else firstDataObjectInThisRow = dataObject;
            }
        });
    });

    return root;
};

function search(searchState) {
    var c, r;
    return _regenerator2.default.wrap(function search$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:

                    searchState.searchStep();

                    if (!searchState.isEmpty()) {
                        _context2.next = 7;
                        break;
                    }

                    if (!searchState.currentSolution.length) {
                        _context2.next = 6;
                        break;
                    }

                    searchState.solutionFound();
                    _context2.next = 6;
                    return searchState.currentSolution.slice().sort();

                case 6:
                    return _context2.abrupt('return');

                case 7:
                    c = chooseColumnWithFewestRows(searchState);

                    coverColumn(c);
                    r = c.down;

                case 10:
                    if (!(r !== c)) {
                        _context2.next = 19;
                        break;
                    }

                    searchState.pushRowIndex(r.rowIndex);
                    r.loopRight(function (j) {
                        return coverColumn(j.listHeader);
                    });
                    return _context2.delegateYield(search(searchState), 't0', 14);

                case 14:
                    r.loopLeft(function (j) {
                        return uncoverColumn(j.listHeader);
                    });
                    searchState.popRowIndex();

                case 16:
                    r = r.down;
                    _context2.next = 10;
                    break;

                case 19:
                    uncoverColumn(c);

                case 20:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[0], this);
}

var chooseColumnWithFewestRows = function chooseColumnWithFewestRows(searchState) {
    var chosenColumn = null;
    searchState.root.loopNext(function (column) {
        if (!chosenColumn || column.numberOfRows < chosenColumn.numberOfRows) {
            chosenColumn = column;
        }
    });
    return chosenColumn;
};

var coverColumn = function coverColumn(c) {
    c.unlinkColumnHeader();
    c.loopDown(function (i) {
        return i.loopRight(function (j) {
            return j.listHeader.unlinkDataObject(j);
        });
    });
};

var uncoverColumn = function uncoverColumn(c) {
    c.loopUp(function (i) {
        return i.loopLeft(function (j) {
            return j.listHeader.relinkDataObject(j);
        });
    });
    c.relinkColumnHeader();
};

var SearchState = function () {
    function SearchState(root, onSearchStep, onSolutionFound) {
        (0, _classCallCheck3.default)(this, SearchState);

        this.root = root;
        this.onSearchStep = onSearchStep;
        this.onSolutionFound = onSolutionFound;
        this.currentSolution = [];
    }

    (0, _createClass3.default)(SearchState, [{
        key: 'isEmpty',
        value: function isEmpty() {
            return this.root.nextColumnObject === this.root;
        }
    }, {
        key: 'pushRowIndex',
        value: function pushRowIndex(rowIndex) {
            this.currentSolution.push(rowIndex);
        }
    }, {
        key: 'popRowIndex',
        value: function popRowIndex() {
            this.currentSolution.pop();
        }
    }, {
        key: 'searchStep',
        value: function searchStep() {
            if (this.onSearchStep) {
                this.onSearchStep(this.currentSolution);
            }
        }
    }, {
        key: 'solutionFound',
        value: function solutionFound() {
            if (this.onSolutionFound) {
                this.onSolutionFound(this.currentSolution);
            }
        }
    }]);
    return SearchState;
}();