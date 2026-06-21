"use strict";

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _bond = require("./bond");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var schema = _joi["default"].object().keys({
  settlement: _joi["default"].date().max(_joi["default"].ref('maturity')).required(),
  maturity: _joi["default"].date().required(),
  rate: _joi["default"].number().min(0).max(1).required(),
  redemption: _joi["default"].number().positive().required(),
  frequency: _joi["default"].number().valid([1, 2, 4, 12]).required(),
  convention: _joi["default"].string().valid(['30U/360', 'ACTUAL/ACTUAL', 'ACTUAL/360', 'ACTUAL/365', '30E/360', '30/360']).required()
});

module.exports = function (bond) {
  if (!bond) throw new Error('A bond object is required');

  var validation = _joi["default"].validate(bond, schema);

  if (validation.error) throw validation.error;
  var validBond = validation.value;
  return {
    price: function price(yld) {
      return (0, _bond.calcPrice)(validBond.settlement, validBond.maturity, validBond.rate, yld, validBond.redemption, validBond.frequency, validBond.convention);
    },
    "yield": function _yield(price) {
      return (0, _bond.calcYield)(validBond.settlement, validBond.maturity, validBond.rate, price, validBond.redemption, validBond.frequency, validBond.convention);
    }
  };
};