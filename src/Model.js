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
		this._render(value);
	}

	_render(value) {
		;(this._stack || (this._stack = [])).push(value);

		if (this._timer) {
			return;
		}

		this._timer = rAF(() => {
			const value = this._stack.pop();

			if (this.props.valueWillChange && this.props.valueWillChange.call(this, value) === false) {
				return;
			}

			this.props.render.call(this, value);

			const prevValue = this.value;
			this.value = value;

			if (this.props.afterValueChange) {
				this.props.afterValueChange.call(this, prevValue);
			}

			this._stack = null;

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
