'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * view -> controller -> models
 */
var View = function () {

	// props: el, events
	function View(props) {
		_classCallCheck(this, View);

		this.init(props);
	}

	_createClass(View, [{
		key: 'init',
		value: function init(props) {
			var selector = props.selector,
			    methods = props.methods;


			this.el = $(selector);
			(0, _util.mixProps)(this, methods);

			this.props = props;

			if (props.init) {
				props.init.call(this);
			}
		}
	}, {
		key: 'setController',
		value: function setController(controller) {
			this.controller = controller;
		}

		// 'click {sel}': 'onClick' | Function

	}, {
		key: 'setEvents',
		value: function setEvents() {
			var _this = this;

			this.el.off();

			if (!this.props.events) {
				return;
			}
			var keys = Object.keys(this.props.events);

			keys.forEach(function (key) {
				var arr = key.split(/ +/);
				var ev = arr[0];
				var sel = arr[1];
				var cb = _this.props.events[key];

				if (typeof cb === 'string') {
					if (!_this[cb]) {
						throw new Error('no func for ' + cb);
					}

					_this.el.on(ev, sel, _this[cb].bind(_this));
				} else if (typeof cb === 'function') {

					_this.el.on(ev, sel, cb.bind(_this));
				} else if (Array.isArray(cb)) {

					cb = cb.map(function (cb) {
						var callback = cb;

						if (typeof cb === 'string') {
							if (!_this[cb]) {
								throw new Error('no func for ' + cb);
							}

							callback = _this[cb];
						}

						return callback;
					});

					_this.el.on(ev, sel, _this._onEventCallbacks(cb));
				} else {

					throw new Error('key: ' + key + ' is not string, func or array');
				}
			});
		}
	}, {
		key: '_onEventCallbacks',
		value: function _onEventCallbacks(cbs) {
			var _this2 = this;

			return function (e) {
				var arr = cbs.slice();
				var cb = void 0;

				while (cb = arr.shift()) {
					if (cb.call(_this2, e) === false) {
						break;
					}
				}
			};
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.el.off();
			this.el = null;
			this.controller = null;
			this.props = null;
			// TODO: keys -> = null
		}
	}]);

	return View;
}();

exports.default = View;