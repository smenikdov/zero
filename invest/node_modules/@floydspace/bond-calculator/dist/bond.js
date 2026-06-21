"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcYield = exports.calcPrice = void 0;

var _contains2 = _interopRequireDefault(require("ramda/src/contains"));

var _range2 = _interopRequireDefault(require("ramda/src/range"));

var _reduce2 = _interopRequireDefault(require("ramda/src/reduce"));

var _difference_in_days = _interopRequireDefault(require("date-fns/difference_in_days"));

var _coupon = require("./coupon");

var _newton = _interopRequireDefault(require("./newton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _price = function _price(rate, yld, redemption, frequency, DSC, E, N, A) {
  return (0, _reduce2["default"])(function (acc, k) {
    return acc + 100 * rate / frequency / Math.pow(1 + yld / frequency, k - 1 + DSC / E);
  }, redemption / Math.pow(1 + yld / frequency, N - 1 + DSC / E) - 100 * rate / frequency * A / E, (0, _range2["default"])(1, N + 1));
};

var calcPrice = function calcPrice(settlement, maturity, rate, yld, redemption, frequency, convention) {
  var previous = (0, _coupon.previous)(settlement, maturity, frequency);
  var next = (0, _coupon.next)(settlement, maturity, frequency);
  var E = (0, _coupon.days)(previous, next, frequency, convention);
  var A = (0, _coupon.accrued)(previous, settlement, convention);
  var DSC = E - A;
  var N = (0, _coupon.num)(settlement, maturity, frequency);

  if (N === 1) {
    var T1 = 100 * rate / frequency + redemption;
    var T2 = yld / frequency * DSC / E + 1;
    var T3 = 100 * rate / frequency * A / E;
    return T1 / T2 - T3;
  }

  return _price(rate, yld, redemption, frequency, DSC, E, N, A);
};

exports.calcPrice = calcPrice;

var dPriceDYld = function dPriceDYld(rate, yld, redemption, frequency, DSC, E, N) {
  return (0, _reduce2["default"])(function (acc, k) {
    return acc - Math.pow(100 * rate / frequency, 2) * (k - 1 + DSC / E) * Math.pow(1 + yld / frequency, -(k + DSC / E));
  }, -redemption / frequency * (N - 1 + DSC / E) * Math.pow(1 + yld / frequency, -(N + DSC / E)), (0, _range2["default"])(1, N + 1));
};

var calcYield = function calcYield(settlement, maturity, rate, pr, redemption, frequency, convention) {
  var previous = (0, _coupon.previous)(settlement, maturity, frequency);
  var next = (0, _coupon.next)(settlement, maturity, frequency);
  var A = (0, _coupon.accrued)(previous, settlement, convention);
  var E = (0, _coupon.days)(previous, next, frequency, convention);
  var DSC = E - A;
  var N = (0, _coupon.num)(settlement, maturity, frequency);

  if (N === 1) {
    DSC = (0, _coupon.accrued)(settlement, maturity, convention);
    if ((0, _contains2["default"])('ACTUAL', convention)) E = (0, _difference_in_days["default"])(maturity, previous);
    return (redemption / 100 + rate / frequency - pr / 100 - A / E * rate / frequency) / (pr / 100 + A / E * rate / frequency) * frequency * E / DSC;
  }

  var f = function f(x) {
    return _price(rate, x, redemption, frequency, DSC, E, N, A) - pr;
  };

  var fp = function fp(x) {
    return dPriceDYld(rate, x, redemption, frequency, DSC, E, N);
  };

  return (0, _newton["default"])(f, fp, rate);
};

exports.calcYield = calcYield;