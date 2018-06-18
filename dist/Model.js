"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * for fe boys who still rely on jQuery,
 * it is easy to use, and simpler than Backbone
 *
 * @author CC
 * @since 2018-06-19
 */

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
		value: function _render(cb, value) {
			var _this = this;

			;(this._cbs || (this._cbs = [])).push([cb, value]);

			if (this._timer) {
				return;
			}

			this._timer = rAF(function () {
				var lastOne = _this._cbs.pop();

				var _lastOne = _slicedToArray(lastOne, 2),
				    cb = _lastOne[0],
				    value = _lastOne[1];

				cb.call(_this, value);

				_this._cbs = null;

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
			if (value === this.value) {
				return;
			}

			if (this.valueWillChange && this.valueWillChange(value) === false) {
				return;
			}

			// TODO: debounce render
			this._render(this.props.render, value);

			var prevValue = this.value;
			this.value = value;

			if (this.afterValueChange) {
				this.afterValueChange(prevValue);
			}
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