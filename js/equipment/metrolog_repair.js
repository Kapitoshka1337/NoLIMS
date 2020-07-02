Vue.config.devtools = true;
Vue.component('repair-grid', {
	template: '#repair-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		filterDate: Object,
		filtersStatus: Object,
		countPost: Number,
		equipment: Object
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
		showModal(modalName, equipment){
			this.$emit('eq', equipment);
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
			// Object.keys(this.filtersStatus).forEach(f =>
			// {
			// 	if(this.filtersStatus[f])
			// 		rows = rows.filter(row => {
			// 			return row[f] === 1;
			// 		})
			// })
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
				{'id':'№'},
				{'status':'Статус'},
				{'date_request':'Дата'},
				{'date_start':'Принято'},
				{'date_end':'Завершено'},
				{'equipment':'Оборудование'},
				{'cabinet_number':'Кабинет'},
				{'user':'Инициатор'},
				{'executor':'Исполнитель'},
				{'action': ''}
			],
			filterColumn: [
				{'status':'Статус'},
				{'user':'Инициатор'}
			]
		},
		gridData: [],
		filters: {
			status: [],
			user: []
		},
		countPost: 100,
		dateFilter: {
			start: null,
			end: null
		},
		repair: {},
		selectedEq: {
			id: null,
			equipment: null,
			model: null,
			cabinet_number: null,
			user: null,
			problem: null,
			id_status: null,
			status: null,
			date_request: null,
			request_report: null
		},
		status: {
			1: false,
			2: false,
			3: false,
			4: false
		},
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
		},
		showModal(modalName){
			$('#modal' + modalName).modal('show');
		},
		setSelectedEquipment(info){
			this.selectedEq = info;
		},
		decliningRepair(){
			let obj = {id: this.selectedEq.id, request_report: this.selectedEq.request_report};
			axios.post("/equipment/declining-repair", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response => (this.getRepair()));
		},
		approveRepair(){
			let obj = {id: this.selectedEq.id, id_equipment: this.selectedEq.id_equipment };
			axios.post("/equipment/approve-repair", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response => (this.getRepair()));
		},
		finishRepair(){
			let obj = {id: this.selectedEq.id, id_equipment: this.selectedEq.id_equipment, request_report: this.selectedEq.request_report};
			axios.post("/equipment/finish-repair", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response => (this.getRepair()));
		}
	},
	mounted: function() {
		this.getRepair();
	}
});