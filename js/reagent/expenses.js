// Vue.config.devtools = true;
Vue.component('expenses-grid', {
	template: '#expenses-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
		error: Array
	},
	data: function () {
		let sortColumns = {};
		this.columns.forEach(function (key){
			Object.keys(key).some(function(row){
				if (row !== 'action')
					sortColumns[row] = 1;
			});
		})
		return {
			sortKey: '',
			sortColumns: sortColumns,
			currentPage: 1,
			listPages: [],
		}
	},
	methods: {
		sortBy: function (key) {
			if(key === 'action') return;
			this.sortKey = key;
			this.sortColumns[key] = this.sortColumns[key] * -1;
		},
		setPages () {
			let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
			for (let i = 1; i <= numOfPage; i++)
				this.listPages.push(i);
		},
		paginate (rows) {
			let page = this.currentPage;
			let curPost = this.countPost;
			let from = (page * curPost) - curPost;
			let to = ((page * curPost));
			return rows.slice(from, to);
		},
		showModal(modalName, id_arrival_material, date_usage, amount_expenses, id_material, material){
			this.error.id_expenses = id_arrival_material;
			this.error.date_usage = date_usage;
			this.error.amount_expenses = amount_expenses;
			this.error.id_material = id_material;
			this.error.material = material;
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		}
	},
	watch: {
		filteredRows() {
			this.listPages = [];
			this.setPages();
		}
	},
	computed: {
		filteredRows: function () {
			let sortKey = this.sortKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = this.rows;
			if (sortKey)
			{
				rows = rows.slice().sort(function (a, b) {
					a = a[sortKey];
					b = b[sortKey];
					if(a === b) return 0 * order;
					else if (a > b) return 1 * order;
					else return - 1 * order;
				})
			}
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				})
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
	},
})

let demo1 = new Vue({
	el: '#demo1',
	data: {
		gridColumns: {
			tableColumn: [
				{'material_id':'Код'},
				{'date_create':'Дата изг.'},
				{'material':'Материал'},
				{'measure':'Ед.изм'},
				{'amount_outgo':'Кол.'},
				{'user':'Сотрудник'},
				{'date_usage':'Потрачено'},
				{'date_record':'Добавлено'},
				{'moving_type':'Операция'},
				{'action':''}
			],
			filterColumn: [
				{'material_id':'Код материала'},
				{'date_create':'Дата изготовления'},
				{'type':'Тип'},
				{'material':'Материал'},
				{'date_usage':'Дата потребления'},
				{'user':'Сотрудник'},
				{'moving_type':'Операция'},
			]
		},
		gridData: [],
		filters: {
			material_id: [],
			type: [],
			material: [],
			date_create: [],
			date_usage: [],
			user: [],
			moving_type: []
		},
		countPost: 32,
		error: {
			id_expenses: '',
			amount: '',
			description: '',
			date_record: '',
			date_usage: '',
			amount_expenses: '',
			id_material: '',
			material: '',
		},
		listError: []
	},
	methods: {
		getOutgo(){
			axios.get("/reagent/get-expenses").then( response => (this.gridData = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		returnUniq(column){
			let result = [];
			for (let str of this.gridData)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
				})
			return result;
		},
		getToday () {
			let today = new Date();
			this.error.date_record = today.toISOString().split('T')[0];
		},
		submitError(){
			axios.post("/reagent/submit-error", JSON.stringify(this.error), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.listError = response.data
				)
			).catch(error => (this.listError = error));
		}
	},
	computed: {
		validationExpense(){
			if ((this.error.amount === '') || (this.error.description === ''))
				return true;
		}
	},
	mounted: function() {
		this.getOutgo();
		this.getToday();
		this.setDropdown();
	}
});