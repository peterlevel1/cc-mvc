function setRouter(app) {
	const router = new Router();

	['all', 'active', 'completed'].forEach(function (hash) {
		router.on(hash, function () {
			app.setHash(hash);
		});
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			app.setHash('all');
		}
	});

	router.init();
}

function getStorage() {
	const STORAGE_KEY = 'todos-cc-mvc';

	return {
		fetch: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (todos) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		}
	};
}

function init() {
	const { Controller } = MVC;
	const storage = getStorage();

	setRouter(new Controller({
		init() {
			this.view.el.on({
				'view:add': ({ payload }) => {
					this.save([ { id: Date.now() + '', editing: false, checked: false, value: payload }, ...this.getList() ]);
				},

				'view:toggleChecked': ({ payload }) => {
					const { id, checked } = payload;

					const list = this.getList();
					const item = list.find(item => item.id === id);

					item.checked = checked;
					this.save([ ...list ]);
				},

				'view:toggleAllChecked': ({ payload }) => {
					const { checked } = payload;

					const list = this.getList();
					list.forEach(item => { item.checked = checked; });

					this.save([ ...list ]);
				},

				'view:clearItem': ({ payload }) => {
					const { id } = payload;

					const list = storage.fetch().filter(item => item.id !== id);

					this.save(list);
				},

				'view:clearCompleted': ({ payload }) => {
					const list = storage.fetch().filter(item => {
						return !item.checked;
					});

					this.save(list);
				},

				'view:startEditItem': ({ payload }) => {
					const { id } = payload;
					const list = this.getList();
					const item = list.find(item => item.id === id);
					item.editing = true;

					this.save([ ...list ]);
				},

				'view:stopEditItem': ({ payload }) => {
					const { id, value } = payload;
					const list = this.getList();
					const item = list.find(item => item.id === id);

					item.editing = false;
					item.value = value;

					this.save([ ...list ]);
				},
			});

			this.models.list.el = this.view.el.find('.todo-list');
			this.models.list.countLeft = this.countLeft.bind(this);

			this.setHash(location.hash.replace(/^#\//, '') || 'all');
		},

		methods: {
			filterList() {
				return storage.fetch().filter(item => {
					switch (this.hash) {
						case 'all': return true;
						case 'active': return !item.checked;
						case 'completed': return !!item.checked;
						default: throw new Error(`unknown hash: ${this.hash}`);
					}
				});
			},

			setList() {
				this.models.list.v = this.filterList();
			},

			getList() {
				return this.models.list.v;
			},

			setHash(hash) {
				if (hash === this.hash) return;
				this.hash = hash;
				this.setList();

				this.view.el.find('.filters a').each(function () {
					$(this).toggleClass('selected', ($(this).attr('href').replace(/^#\//, '') || 'all') === hash);
				});
			},

			save(list) {
				storage.save(list);
				this.setList();
			},

			countLeft() {
				const len = storage.fetch().filter(item => {
					return !item.checked;
				}).length;

				this.view.el.find('.todo-count').html(len + ' items left');
			},
		},

		models: [
			{
				key: 'list',
				render(list) {
					const html = list.map(item => `
						<li class="${item.editing ? 'editing' : ''} ${item.checked ? 'completed' : ''}" data-id="${item.id}">
							<div class="view">
								<input class="toggle" type="checkbox" ${item.checked ? 'checked' : ''}>
								<label>${item.value}</label>
								<button class="destroy"></button>
							</div>
							<input class="edit" type="text" value="${item.value}">
						</li>
					`).join('');

					this.el.html(html);

					this.countLeft();
				}
			}
		],

		view: {
			selector: '.todoapp',

			events: {
				'keyup .new-todo': 'keyup',

				'click .toggle': 'toggleChecked',

				'click .toggle-all': 'toggleAllChecked',

				'click .clear-completed': 'clearCompleted',

				'click .destroy': 'clearItem',

				'dblclick .view': 'startEditItem',

				'keyup .edit': 'stopEditItem',
			},

			methods: {
				keyup(e) {
					if (e.key === 'Enter') {
						this.el.trigger({
							type: 'view:add',
							payload: e.target.value
						});

						$(e.target).val('');
					}
				},

				toggleChecked(e) {
					const id = $(e.target).closest('li').data('id') + '';
					const checked = $(e.target).prop('checked');

					this.el.trigger({
						type: 'view:toggleChecked',
						payload: {
							id,
							checked
						}
					});
				},

				toggleAllChecked(e) {
					const checked = $(e.target).prop('checked');

					this.el.trigger({
						type: 'view:toggleAllChecked',
						payload: {
							checked
						}
					});
				},

				clearCompleted(e) {
					this.el.trigger({
						type: 'view:clearCompleted',
					});
				},

				clearItem(e) {
					const id = $(e.target).closest('li').data('id') + '';

					this.el.trigger({
						type: 'view:clearItem',
						payload: {
							id
						}
					});
				},

				startEditItem(e) {
					const id = $(e.target).closest('li').data('id') + '';

					this.el.trigger({
						type: 'view:startEditItem',
						payload: {
							id
						}
					});
				},

				stopEditItem(e) {
					if (e.key !== 'Enter') {
						return;
					}

					const id = $(e.target).closest('li').data('id') + '';

					this.el.trigger({
						type: 'view:stopEditItem',
						payload: {
							id,
							value: $(e.target).val()
						}
					});
				}

			}
		}
	}));
}

init();
