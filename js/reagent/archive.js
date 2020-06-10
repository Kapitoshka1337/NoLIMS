// Vue.config.devtools = true;
Vue.component('archive-grid', {
	template: '#archive-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
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
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		showPassport(id){
			axios.get("/reagent/get-passport?id=" + id).then( response => (window.open(response.data)));
		},
		showModal(modalName){
			$('#modal' + modalName).modal('show');
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
					if(r.total === null) r.total = r.amount;
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
				{'location':'Местоположение'},
				{'material':'Материал'},
				{'measure':'Ед.изм'},
				{'amount':'Количество'},
				{'shelf_life':'Годен до'},
				{'action':''}
			],
			filterColumn: [
				{'material_id':'Код материала'},
				{'type':'Тип'},
				{'material':'Материал'},
				{'date_create':'Дата изготовления'},
				{'shelf_life':'Годен до'},
				{'location':'Местоположение'}
			]
		},
		gridData: [],
		sortColumns: [],
		filters: {
			material_id: [],
			type: [],
			material: [],
			date_create: [],
			shelf_life: [],
			location: []
		},
		countPost: 64,
	},
	methods: {
		getArchive(){
			axios.get("/reagent/get-archive").then( response => (this.gridData = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true}, 'remove visible', 'remove active');
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
		}
	},
	mounted: function() {
		this.getArchive();
		this.setDropdown();
	}
});