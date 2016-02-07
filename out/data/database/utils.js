'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode_period = encode_period;
function encode_period(period) {
  return period.replace('/', '_');
}