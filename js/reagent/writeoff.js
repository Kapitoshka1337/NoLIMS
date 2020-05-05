// Vue.config.devtools = true;
Vue.component('writeoff-grid', {
	template: '#writeoff-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number
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
		showModal(modalName){
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
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
				{'material_id':'ID'},
				{'date_create':'Дата изг.'},
				{'material':'Материал'},
				{'packing_name':'Наименование в накладной'},
				{'measure':'Ед.изм'},
				{'amount_outgo_total':'Количество'}
			],
			filterColumn: [
				{'material_id':'ID'},
				{'material':'Материал'},
			]
		},
		gridData: [],
		sortColumns: [],
		filters: {
			material_id: [],
			material: [],
		},
		countPost: 32,
		error: {
			id_arrival_material: '',
			amount: '',
			description: '',
			date_record: ''
		},
		start: '',
		end: '',
		listError: []
	},
	methods: {
		getWriteoff(){
			let obj = {
				start: this.start.split("-").reverse().join("."),
				end: this.end.split("-").reverse().join(".")
			}
			axios.post("/reagent/get-writeoff", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.gridData = response.data
				)
			)
			.catch(error => (this.listError = error));
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
	},
	mounted: function(){
		this.getToday();
		this.setDropdown();
	}
});