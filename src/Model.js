const rAF = window.requestAnimationFrame;
const cAF = window.cancelAnimationFrame;

/**
 * props: key, value, render
 */
export default class Model {

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
		;(this._cbs || (this._cbs = [])).push([cb, value]);

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
