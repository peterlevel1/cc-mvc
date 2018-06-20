'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View = require('./View');

var _View2 = _interopRequireDefault(_View);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 1 controller, 1 view, and many models
 * props: view, models, model, data
 * models is array
 */
var Controller = function () {
	function Controller(props) {
		_classCallCheck(this, Controller);

		this.init(props);
	}

	_createClass(Controller, [{
		key: 'init',
		value: function init(props) {
			var methods = props.methods;


			this.state = {};
			this.props = props;
			(0, _util.mixProps)(this, methods);

			this.setView();
			this.setModels();

			if (props.init) {
				props.init.call(this);
			}
		}
	}, {
		key: 'setModels',
		value: function setModels() {
			var _this = this;

			var models = this.props.models;


			if (!models) {
				return;
			}

			this.models = models.reduce(function (memo, model) {
				if (!(model instanceof _Model2.default)) {
					model = new _Model2.default(model);
				}

				if (memo[model.k]) {
					throw new Error('model key: ' + model.k() + ' => repeated');
				}

				memo[model.k] = model;
				model.setController(_this);

				if (_this.state.hasOwnProperty(model.k)) {
					throw new Error('state key: ' + model.k + ', already exsits');
				}

				Object.defineProperty(_this.state, model.k, {
					get: function get() {
						return model.v;
					},
					set: function set(value) {
						model.v = value;
					},

					enumerable: true,
					configurable: true
				});

				return memo;
			}, {});
		}
	}, {
		key: 'setView',
		value: function setView() {
			var view = this.props.view;


			if (!view) {
				return;
			}

			if (!(view instanceof _View2.default)) {
				view = new _View2.default(view);
			}

			this.view = view;
			view.setController(this);

			view.setEvents();
		}
	}, {
		key: 'm',
		value: function m(key) {
			if (this.model) {
				return this.model;
			}

			return this.models[key];
		}
	}, {
		key: 'eachModel',
		value: function eachModel(cb) {
			if (this.model) {
				cb(this.model);
				return;
			}

			var keys = Object.keys(this.models);
			var key = void 0;

			while (key = keys.shift()) {
				if (cb(this.m(key)) === false) {
					break;
				}
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.eachModel(function (m) {
				return m.destroy();
			});
			this.models = null;
			this.model = null;

			this.view.destroy();
			this.view = null;

			this.props = null;
			// TODO: keys -> = null
		}
	}]);

	return Controller;
}();

exports.default = Controller;