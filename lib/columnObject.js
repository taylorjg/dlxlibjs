'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ColumnObject = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dataObject = require('./dataObject');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColumnObject = exports.ColumnObject = function (_DataObject) {
    (0, _inherits3.default)(ColumnObject, _DataObject);

    function ColumnObject() {
        (0, _classCallCheck3.default)(this, ColumnObject);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ColumnObject.__proto__ || (0, _getPrototypeOf2.default)(ColumnObject)).call(this, null, -1));

        _this.previousColumnObject = _this;
        _this.nextColumnObject = _this;
        _this.numberOfRows = 0;
        return _this;
    }

    (0, _createClass3.default)(ColumnObject, [{
        key: 'appendColumnHeader',
        value: function appendColumnHeader(columnObject) {
            this.previousColumnObject.nextColumnObject = columnObject;
            columnObject.nextColumnObject = this;
            columnObject.previousColumnObject = this.previousColumnObject;
            this.previousColumnObject = columnObject;
        }
    }, {
        key: 'unlinkColumnHeader',
        value: function unlinkColumnHeader() {
            this.nextColumnObject.previousColumnObject = this.previousColumnObject;
            this.previousColumnObject.nextColumnObject = this.nextColumnObject;
        }
    }, {
        key: 'relinkColumnHeader',
        value: function relinkColumnHeader() {
            this.nextColumnObject.previousColumnObject = this;
            this.previousColumnObject.nextColumnObject = this;
        }
    }, {
        key: 'addDataObject',
        value: function addDataObject(dataObject) {
            this.appendToColumn(dataObject);
            this.numberOfRows++;
        }
    }, {
        key: 'unlinkDataObject',
        value: function unlinkDataObject(dataObject) {
            dataObject.unlinkFromColumn();
            this.numberOfRows--;
        }
    }, {
        key: 'relinkDataObject',
        value: function relinkDataObject(dataObject) {
            dataObject.relinkIntoColumn();
            this.numberOfRows++;
        }
    }, {
        key: 'loopNext',
        value: function loopNext(fn) {
            for (var next = this.nextColumnObject; next !== this; next = next.nextColumnObject) {
                fn(next);
            }
        }
    }]);
    return ColumnObject;
}(_dataObject.DataObject);