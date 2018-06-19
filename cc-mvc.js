(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.MVC = {})));
}(this, (function (exports) { 'use strict';

	function mixProps(inst, props) {
		if (!props) {
			return;
		}

		for (const prop in props) {
			if (props.hasOwnProperty(prop)) {
				if (inst[prop]) {
					console.warn(`prop: ${prop} is alreay exists`);
				}
				inst[prop] = props[prop];
			}
		}
	}

	/**
	 * view -> controller -> models
	 */
	class View {

		// props: el, events
		constructor(props) {
			this.init(props);
		}

		init(props) {
			const { selector, methods } = props;

			this.el = $(selector);
			mixProps(this, methods);

			this.props = props;

			if (props.init) {
				props.init.call(this);
			}
		}

		setController(controller) {
			this.controller = controller;
		}

		// 'click {sel}': 'onClick' | Function
		setEvents() {
			this.el.off();

			if (!this.props.events) {
				return;
			}
			const keys = Object.keys(this.props.events);

			keys.forEach(key => {
				const arr = key.split(/ +/);
				const ev = arr[0];
				const sel = arr[1];
				let cb = this.props.events[key];

				if (typeof cb === 'string') {
					if (!this[cb]) {
						throw new Error(`no func for ${cb}`);
					}

					this.el.on(ev, sel, this[cb].bind(this));

				} else if (typeof cb === 'function') {

					this.el.on(ev, sel, cb.bind(this));

				} else if (Array.isArray(cb)) {

					cb = cb.map(cb => {
						let callback = cb;

						if (typeof cb === 'string') {
							if (!this[cb]) {
								throw new Error(`no func for ${cb}`);
							}

							callback = this[cb];
						}

						return callback;
					});

					this.el.on(ev, sel, this._onEventCallbacks(cb));

				} else {

					throw new Error(`key: ${key} is not string, func or array`);
				}
			});
		}

		_onEventCallbacks(cbs) {
			return (e) => {
				const arr = cbs.slice();
				let cb;

				while (cb = arr.shift()) {
					if (cb.call(this, e) === false) {
						break;
					}
				}
			}
		}

		destroy() {
			this.el.off();
			this.el = null;
			this.controller = null;
			this.props = null;
			// TODO: keys -> = null
		}
	}

	const rAF = window.requestAnimationFrame;
	const cAF = window.cancelAnimationFrame;

	/**
	 * props: key, value, render
	 */
	class Model {

		constructor(props) {
			this.init(props);
		}

		init(props) {
			const { key, value } = props;
			this.key = key;
			this.value = value;
			this.props = props;

			if (props.init) {
				props.init.call(this);
			}
		}

		setController(controller) {
			this.controller = controller;
		}

		get v() {
			return this.value;
		}

		set v(value) {
			if (value === this.value) {
				return;
			}

			if (this.valueWillChange && this.valueWillChange(value) === false) {
				return;
			}

			// TODO: debounce render
			this._render(this.props.render, value);

			const prevValue = this.value;
			this.value = value;

			if (this.afterValueChange) {
				this.afterValueChange(prevValue);
			}
		}

		_render(cb, value) {
	(this._cbs || (this._cbs = [])).push([cb, value]);

			if (this._timer) {
				return;
			}

			this._timer = rAF(() => {
				const lastOne = this._cbs.pop();
				const [cb, value] = lastOne;

				cb.call(this, value);

				this._cbs = null;

				cAF(this._timer);
				this._timer = null;
			});
		}

		get k() {
			return this.key;
		}

		destroy() {
			this.key = null;
			this.value = null;
			this.props = null;
			this.controller = null;
			// TODO: keys -> = null
		}
	}

	/**
	 * 1 controller, 1 view, and many models
	 * props: view, models, model, data
	 * models is array
	 */
	class Controller {

		constructor(props) {
			this.init(props);
		}

		init(props) {
			const { methods } = props;

			this.props = props;
			mixProps(this, methods);

			this.setView();
			this.setModels();

			if (props.init) {
				props.init.call(this);
			}
		}

		setModels() {
			let { models, model } = this.props;

			this.models = {};
			this.model = null;

			if (models) {
				// this.models is object
				this.models = models.reduce((memo, model) => {
					if (!(model instanceof Model)) {
						model = new Model(model);
					}

					if (memo[model.k]) {
						throw new Error(`model key: ${model.k()} => repeated`);
					}

					memo[model.k] = model;
					model.setController(this);

					return memo;
				}, {});
				return;
			}

			if (!(model instanceof Model)) {
				model = new Model(model);
			}

			this.model = model;
			model.setController(this);
		}

		setView() {
			let { view } = this.props;

			if (!(view instanceof View)) {
				view = new View(view);
			}

			this.view = view;
			view.setController(this);

			view.setEvents();
		}

		m(key) {
			if (this.model) {
				return this.model;
			}

			return this.models[key];
		}

		eachModel(cb) {
			if (this.model) {
				cb(this.model);
				return;
			}

			const keys = Object.keys(this.models);
			let key;

			while (key = keys.shift()) {
				if (cb(this.m(key)) === false) {
					break;
				}
			}
		}

		destroy() {
			this.eachModel((m) => m.destroy());
			this.models = null;
			this.model = null;

			this.view.destroy();
			this.view = null;

			this.props = null;
			// TODO: keys -> = null
		}
	}

	/**
	 * for fe boys who still rely on jQuery,
	 * it is easy to use, and simpler than Backbone
	 *
	 * @author CC
	 * @since 2018-06-19
	 */

	exports.Controller = Controller;
	exports.View = View;
	exports.Model = Model;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
