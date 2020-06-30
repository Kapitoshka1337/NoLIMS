Vue.config.devtools = true;
Vue.component('repair-grid', {
	template: '#repair-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		filterDate: Object,
		countPost: Number
	},
	data: function () {
		let sortColumns = {};
		this.columns.forEach(function (key){
			Object.keys(key).some(function(row){
				if (row !== 'action')
					sortColumns[row] = 1;
			});
		});
		return {
			sortKey: '',
			sortColumns: sortColumns,
			currentPage: 1,
			listPages: [],
			filterKey: ''
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
		showModal(modalName, id = null, department = null){
			this.checkEq.id_equipment = id;
			this.handoff.department = department;
			if(modalName === 'CheckReq')
				this.$emit('request', this.selectedEquipments);
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			this.$emit('clear');
			$('.dropdown').dropdown('clear');
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
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
		showModal(modalName){
			$('#modal' + modalName).modal('show');
		},
	},
	watch: {
		filteredRows() {
			this.listPages = [];
			this.setPages();
			let interval = setInterval(function()
			{ 
				if($('.dropdown').dropdown({fullTextSearch: true}).length <= 0)
					$('.dropdown').dropdown({fullTextSearch: true});
				else clearInterval(interval);
			}, 0.5);
		}
	},
	computed: {
		filteredRows: function () {
			let sortKey = this.sortKey;
			let filterKey = this.filterKey && this.filterKey.toLowerCase();
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
			if (filterKey)
			{
				rows = rows.filter(function(row)
				{
					return Object.keys(row).some(function(key)
					{
						return (String(row[key]).toLowerCase().indexOf(filterKey) > -1);});
				});
			}
			if(this.filterDate['start'] != null && this.filterDate['end'] != null)
				rows = rows.filter(row => {
					return row['date_next_check'] >= this.filterDate['start'] && row['date_next_check'] <= this.filterDate['end'];
				})
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
		}
	},
})

let demo1 = new Vue({
	el: '#demo1',
	data: {
		gridColumns: {
			tableColumn: [
				{'status':'Статус'},
				{'date_request':'Дата'},
				{'equipment':'Оборудование'},
				{'cabinet_number':'Кабинет'},
				{'user':'Инициатор'},
				{'action': ''}
			],
			filterColumn: []
		},
		gridData: [],
		filters: {},
		countPost: 100,
		dateFilter: {
			start: null,
			end: null
		}
	},
	methods: {
		getRepair(){
			axios.get("/equipment/get-repair").then( response => (this.gridData = response.data));
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
		clearDate(){
			this.dateFilter = {};
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		}
	},
	mounted: function() {
		this.getRepair();
	}
});