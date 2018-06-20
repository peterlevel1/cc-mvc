# cc-mvc

##### for fe boys who still rely on jQuery

### Controller, Model, View
  - 1 controller, 1 view, and (1 model or many models)
  - view events -> controller -> model
  - model => data change, and render => view
  - controller organize the models and the view
  - if mvvm like automatic, then cc-mvc just like manual, but good organized

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
    // organize the model and the viwe

    // 1. for triggering render work, give model to the view
    this.view.model = this.models.count;

    // 2. for convenience, give el to the model count
    this.models.count.el = this.view.el;

    // init render
    this.state.count = 0;
  },

  models: [{
    key: 'count',
    render(value) {
      this.el.find('[data-role=count]')
        .html(value);
    }
  }],

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