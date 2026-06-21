"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _defaultTo2 = _interopRequireDefault(require("ramda/src/defaultTo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dTol = (0, _defaultTo2["default"])(1e-13);
var dEps = (0, _defaultTo2["default"])(1e-14);
var dMaxIter = (0, _defaultTo2["default"])(100);

var _newton = function _newton(f, fp, x0, tol, eps, maxIter, iter) {
  if (iter > maxIter) return x0;
  var y = f(x0);
  var yp = fp(x0);
  if (Math.abs(yp) < eps) throw new Error("Newton's method failed to converge because yp is smaller than eps (".concat(eps, ")"));
  var x1 = x0 - y / yp;
  if (Math.abs(x0 - x1) <= tol * Math.abs(x1)) return x1;
  return _newton(f, fp, x1, tol, eps, maxIter, iter + 1);
};

function _default(f, fp, x0, tol, eps, maxIter) {
  return _newton(f, fp, x0, dTol(tol), dEps(eps), dMaxIter(maxIter), 0);
}