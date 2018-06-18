import View from './View';
import Model from './Model';

/**
 * 1 controller, 1 view, and many models
 * props: view, models, model, data
 * models is array
 */
export default class Controller {

	constructor(props) {
		this.init(props);
	}

	init(props) {
		this.props = props;

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
