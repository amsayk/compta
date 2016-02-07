'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (company) {

  var name = 'Transaction_' + company.id;

  var Transaction = function (_Parse$Object) {
    _inherits(Transaction, _Parse$Object);

    function Transaction() {
      _classCallCheck(this, Transaction);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Transaction).call(this, name));

      _this.__type = 'Transaction';
      return _this;
    }

    return Transaction;
  }(_parse2.default.Object);

  _parse2.default.Object.registerSubclass(name, Transaction);
  return Transaction;
};