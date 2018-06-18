'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.View = exports.Controller = undefined;

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _View = require('./View');

var _View2 = _interopRequireDefault(_View);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Controller = _Controller2.default;
exports.View = _View2.default;
exports.Model = _Model2.default; /**
                                  * for fe boys who still rely on jQuery,
                                  * it is easy to use, and simpler than Backbone
                                  *
                                  * @author CC
                                  * @since 2018-06-19
                                  */