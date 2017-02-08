'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hoc;

var _withTrackingComponentDecorator = require('./withTrackingComponentDecorator');

var _withTrackingComponentDecorator2 = _interopRequireDefault(_withTrackingComponentDecorator);

var _trackEventMethodDecorator = require('./trackEventMethodDecorator');

var _trackEventMethodDecorator2 = _interopRequireDefault(_trackEventMethodDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handle(trackingInfo) {
  for (var _len = arguments.length, toDecorate = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    toDecorate[_key - 1] = arguments[_key];
  }

  if (toDecorate.length === 1) {
    // decorating a class
    return (0, _withTrackingComponentDecorator2.default)(trackingInfo).apply(undefined, toDecorate);
  }

  // decorating a method
  return (0, _trackEventMethodDecorator2.default)(trackingInfo).apply(undefined, toDecorate);
}

function hoc(trackingInfo) {
  return function decorator() {
    for (var _len2 = arguments.length, toDecorate = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      toDecorate[_key2] = arguments[_key2];
    }

    return handle.apply(undefined, [trackingInfo].concat(toDecorate));
  };
}