"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rAF = window.requestAnimationFrame;
var cAF = window.cancelAnimationFrame;

/**
 * props: key, value, render
 */

var Model = function () {
	function Model(props) {
		_classCallCheck(this, Model);

		this.init(props);
	}

	_createClass(Model, [{
		key: "init",
		value: function init(props) {
			var key = props.key,
			    value = props.value;

			this.key = key;
			this.value = value;
			this.props = props;

			if (props.init) {
				props.init.call(this);
			}
		}
	}, {
		key: "setController",
		value: function setController(controller) {
			this.controller = controller;
		}
	}, {
		key: "_render",
		value: function _render(value) {
			var _this = this;

			;(this._stack || (this._stack = [])).push(value);

			if (this._timer) {
				return;
			}

			this._timer = rAF(function () {
				var value = _this._stack.pop();

				if (_this.props.valueWillChange && _this.props.valueWillChange.call(_this, value) === false) {
					return;
				}

				_this.props.render.call(_this, value);

				var prevValue = _this.value;
				_this.value = value;

				if (_this.props.afterValueChange) {
					_this.props.afterValueChange.call(_this, prevValue);
				}

				_this._stack = null;

				cAF(_this._timer);
				_this._timer = null;
			});
		}
	}, {
		key: "destroy",
		value: function destroy() {
			this.key = null;
			this.value = null;
			this.props = null;
			this.controller = null;
			// TODO: keys -> = null
		}
	}, {
		key: "v",
		get: function get() {
			return this.value;
		},
		set: function set(value) {
			this._render(value);
		}
	}, {
		key: "k",
		get: function get() {
			return this.key;
		}
	}]);

	return Model;
}();

exports.default = Model;