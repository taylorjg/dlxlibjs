'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DataObject = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataObject = exports.DataObject = function () {
    function DataObject(listHeader, rowIndex) {
        (0, _classCallCheck3.default)(this, DataObject);

        this.listHeader = listHeader;
        this.rowIndex = rowIndex;
        this.up = this;
        this.down = this;
        this.left = this;
        this.right = this;
        if (listHeader) {
            listHeader.addDataObject(this);
        }
    }

    (0, _createClass3.default)(DataObject, [{
        key: 'appendToRow',
        value: function appendToRow(dataObject) {
            this.left.right = dataObject;
            dataObject.right = this;
            dataObject.left = this.left;
            this.left = dataObject;
        }
    }, {
        key: 'appendToColumn',
        value: function appendToColumn(dataObject) {
            this.up.down = dataObject;
            dataObject.down = this;
            dataObject.up = this.up;
            this.up = dataObject;
        }
    }, {
        key: 'unlinkFromColumn',
        value: function unlinkFromColumn() {
            this.down.up = this.up;
            this.up.down = this.down;
        }
    }, {
        key: 'relinkIntoColumn',
        value: function relinkIntoColumn() {
            this.down.up = this;
            this.up.down = this;
        }
    }, {
        key: 'loopUp',
        value: function loopUp(fn) {
            this.loop(fn, 'up');
        }
    }, {
        key: 'loopDown',
        value: function loopDown(fn) {
            this.loop(fn, 'down');
        }
    }, {
        key: 'loopLeft',
        value: function loopLeft(fn) {
            this.loop(fn, 'left');
        }
    }, {
        key: 'loopRight',
        value: function loopRight(fn) {
            this.loop(fn, 'right');
        }
    }, {
        key: 'loop',
        value: function loop(fn, propName) {
            for (var next = this[propName]; next !== this; next = next[propName]) {
                fn(next);
            }
        }
    }]);
    return DataObject;
}();