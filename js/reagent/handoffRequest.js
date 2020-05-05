Vue.config.devtools = true;
Vue.component('handoff-grid', {
	template: '#handoff-grid',
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
			selectAllMaterials: false,
			selectedMaterials: []
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
			this.$emit('request', this.selectedMaterials);
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		select() {
			this.selectedMaterials = [];
			if (!this.selectAllMaterials) {
				for (let i in this.filteredRows) {
					this.selectedMaterials.push({
						type: this.filteredRows[i].type, 
						id_arrival_material: this.filteredRows[i].arrival_material_id, 
						material: this.filteredRows[i].material,
						measure: this.filteredRows[i].measure,
						total: this.filteredRows[i].total,
						amount: '',
						location: ''
					});
				}
			}
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
				{'type':'Тип'},
				{'material':'Материал'},
				{'measure':'Ед.изм'},
				{'amount':'Количество'},
				{'date_create':'Дата изг.'},
				{'shelf_life':'Годен до'}
			],
			filterColumn: [
				{'id_department':'Отдел'},
			]
		},
		gridData: [],
		sortColumns: [],
		filters: {
			id_department: [],
		},
		countPost: 32,
		selectedMaterials: [],
		listDepartment: [],
		listLocations: []
	},
	methods: {
		sendRequest(){
			let request = [];
			request.push({
				id_department_to: this.filters.id_department[0],
				date_request: this.getToday(),
				materials: this.selectedMaterials
			});
			axios.post("/reagent/send-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(function (response)
			{
				if (response.status == 200) 
				{
					document.location.href = '/reagent/history-handoff';
				}
			});
		},
		getStorage(){
			axios.get("/reagent/get-storage?all=1").then( response => (this.gridData = response.data));
		},
		getDepartment(){
			axios.get("/reagent/get-department").then( response => (this.listDepartment = response.data));
		},
		getLocation(){
			axios.get("/reagent/get-location").then( response => (this.listLocations = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		sortBy: function (key) {
			this.sortKey = key;
			this.sortColumns[key] = this.sortColumns[key] * -1;
		},
		getToday () {
			let today = new Date();
			return today.toISOString().split('T')[0];
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
		setSelectedMaterials(info){
			this.selectedMaterials = info;
		}
	},
	watch:{
		'filters.id_department': function(){
			if(this.filters.id_department.length <= 0) this.selectedMaterials = []
		}
	},
	computed: {
		today(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		}
	},
	mounted: function() {
		this.getStorage();
		this.getDepartment();
		this.getLocation();
		this.setDropdown();
	}
});