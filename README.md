# cc-mvc

##### for fe boys who still rely on jQuery, it is easy to use, and simpler than Backbone

### Controller, Model, View
	- 1 controller, 1 view, and (1 model or many models)
	- view events -> controller -> model
	- model => data change, and render => view
	- controller organize the models and the view

`e.g.`

```html
<div id="JS_aside">
	<button data-role='add'>+</button>
	<button data-role='minus'>-</button>
	<span data-role=count></span>
</div>

```

```javascript
import { Controller } from 'cc-mvc';

const controller = new Controller({
	init() {
		// transfer the data between the model and the view
		// TODO: bad for GC
		this.view.model = this.model;
		this.model.el = this.view.el;

		// init render
		this.model.v = 0;
	},

	model: {
		value: null,
		render(value) {
			this.el.find('[data-role=count]')
				.html(value);
		}
	},

	view: {
		selector: '#JS_aside',

		events: {
			'click [data-role=add]': 'add',
			'click [data-role=minus]': 'minus',
		},

		methods: {
			add() {
				this.model.v = this.model.v + 1;
			},

			minus() {
				this.model.v = this.model.v - 1;
			}
		}
	}
});

```