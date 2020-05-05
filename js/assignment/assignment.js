Vue.config.devtools = true;
Vue.component('assignment-grid', {
	template: '#grid-assignment',
	props: {
		rows: Array,
		columns: Array,
		filterList: Array,
		countPost: Number,
	},
	data: function () {
		let sortColumns = {};
		this.columns.forEach(function (key){
			Object.keys(key).some(function(row){
				if (row !== 'action')
				{
					sortColumns[row] = 1;
				}
			});
		})
		return {
			sortKey: '',
			sortColumns: sortColumns,
			currentPage: 1,
			listPages: [],
		}
	},
	filters: {
		capitalize: function (str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
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
			{
				this.listPages.push(i);
			}
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
				return Object.keys(this.filterList).every(f =>
				{
					return this.filterList[f].length < 1 || this.filterList[f].includes(r[f])
				})
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
	},
})

var demo2 = new Vue({
	el: '#demo',
	data: {
		gridColumns: {
			tableColumn: [
				{'id':'ID'},
				{'block':'Кв'},
				{'vet':'Вет.станция'},
				{'region':'Район'},
				{'farm':'Предприятие'},
				{'animal':'Животное'},
				{'method':'Исследование'},
				{'amount':'Кол'},
				{'block_balance':'Квартал'},
				{'plan_balance':'Год'},
				{'total':'Итог'},
				{'date':'Дата'},
				{'empl':'Принял'}
			],
			filterColumn: [
				{'vet':'Вет.станция'},
				{'region':'Район'},
				{'farm':'Предприятие'},
				{'animal':'Животное'},
				{'method':'Исследование'},
				{'date':'Дата'}
			]
		},
		gridData: [],
		filters: {
			vet: [],
			region: [],
			farm: [],
			animal: [],
			method: []
		},
		listType: [],
		listMeasure: [],
		count: 100,
	},
	methods: {
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
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		}
	},
	mounted: function() {
		axios.get("assignment/get-data").then( response => (this.gridData = response.data));
		this.setDropdown();
	}
});