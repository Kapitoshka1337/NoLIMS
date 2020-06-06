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
		submitEq(id_check){
			axios.post("/equipment/submit-verification", JSON.stringify({id_check: id_check}), {headers: {'Content-Type': 'application/json'}}).then(response =>(demo1.getChecks()));
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
					if(r.total === null) r.total = r.amount;
						return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				})
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
		filreredBefore(){
			let rows = this.equipment;
			return rows.filter(r => { return r.is_received_before }).length;
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
				// {'status':'Статус'},
				{'action':'Получено/Всего'},
				{'action':''}
			],
			filterColumn: [
				{'date_create':'Сформировано'},
				{'date_submit':'Отправлено'},
				// {'status':'Статус'}
			]
		},
		gridData: [],
		filters: {
			date_create: [],
			date_submit: [],
			date_received: [],
			// status: []
		},
		countPost: 100,
		equipment: Object
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
		checkEqBefore(index){
			axios.post("/equipment/recieved-eq-before", JSON.stringify({id_kit: this.equipment.equipment[index].id_kit_row}), {headers: {'Content-Type': 'application/json'}}).then(response =>(this.getChecks(), this.equipment.equipment[index].is_received_before = true));
		},
		checkEqAfter(index){
			axios.post("/equipment/recieved-eq-after", JSON.stringify({id_kit: this.filteredEqBeforeAfter[index].id_kit_row}), {headers: {'Content-Type': 'application/json'}}).then(response =>(this.getChecks(), this.equipment.equipment[index].is_received_after = true));
		}
	},
	computed: {
		filteredEqBeforeAfter: function () {
			if(Object.keys(this.equipment).length > 0)
			{
				let rows = this.equipment;
				return rows.equipment.filter(r => {return r.is_received_before});
			}
		}
	},
	mounted: function() {
		this.getChecks();
		this.setDropdown();
	}
});