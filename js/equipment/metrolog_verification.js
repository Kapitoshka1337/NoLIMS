Vue.config.devtools = true;
Vue.component('checks-grid', {
	template: '#checks-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
		equipment: Array
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
		showModal(modalName, eq){
			this.$emit('request', eq);
			this.equipment = eq;
			// console.log(eq);
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
					if(r.total === null) r.total = r.amount;
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
	el: '#checks',
	data: {
		gridColumns: {
			tableColumn: [
				{'date_create':'Сформировано'},
				{'date_submit':'Отправлено'},
				{'date_received':'Получено'},
				{'status':'Статус'},
				{'action':''}
			],
			filterColumn: [
				{'date_create':'Сформировано'},
				{'date_submit':'Отправлено'},
				{'date_received':'Получено'},
				{'status':'Статус'}
			]
		},
		gridData: [],
		filters: {
			date_create: [],
			date_submit: [],
			date_received: [],
			status: []
		},
		countPost: 100,
		equipment: []
	},
	methods: {
		getChecks(){
			axios.get("/equipment/get-verification").then( response => (this.gridData = response.data));
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
		setEq(info){
			this.equipment = info;
		},
		checkEq(index, equipment){
			
		}
		// deleteMaterial(index, equipment){
		// 	var idx = this.selectedEquipments.indexOf(equipment);
		// 	if (idx > -1) this.selectedEquipments.splice(idx, 1);
		// },
	},
	// watch: {
	// 	gridData(){
	// 		if($('.ui.accordion').accordion().length <= 0)
	// 		{
	// 			let interval = setInterval(function()
	// 			{ 
	// 				if($('.ui.accordion').accordion().length <= 0)
	// 				{
	// 					$('.ui.accordion').accordion();
	// 				}
	// 				else clearInterval(interval);
	// 			}, 1000);
	// 		}
	// 	}
	// },
	computed: {
		filteredRows: function () {
			let rows = this.gridData;
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
				})
			})
		}
	},
	mounted: function() {
		this.getChecks();
		this.setDropdown();
		// setTimeout(() => { $('.ui.accordion').accordion();}, 2000);
	}
});