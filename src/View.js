/**
 * view -> controller -> models
 */
export default class View {

	// props: el, events
	constructor(props) {
		this.init(props);
	}

	init(props) {
		const { selector, methods } = props;

		this.el = $(selector);
		this.setMethods(methods);

		this.props = props;

		if (props.init) {
			props.init.call(this);
		}
	}

	setMethods(methods) {
		if (!methods) {
			return;
		}

		for (const method in methods) {
			if (methods.hasOwnProperty(method)) {
				if (this[method]) {
					console.warn(`method: ${method} is alreay exists`);
				}
				this[method] = methods[method];
			}
		}
	}

	setController(controller) {
		this.controller = controller;
	}

	// 'click {sel}': 'onClick' | Function
	setEvents() {
		const keys = Object.keys(this.props.events);
		this.el.off();

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
