// Vue.config.devtools = true;
Vue.component('location-grid', {
	template: '#location-grid',
	props: {
		rows: Array,
		columns: Array,
		countPost: Number,
		locations: Array
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
		showModal(modalName, id = null, cabinet_number = null, place = null, notation = null){
			this.locations.id = id;
			this.locations.cabinet_number = cabinet_number;
			this.locations.place = place;
			this.locations.notation = notation;
			$('#modal' + modalName).modal('show');
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
			return this.paginate(rows);
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
	},
})

let demo = new Vue({
	el: '#demo',
	data: {
		gridColumns: {
			tableColumn: [
				{'cabinet_number':'Кабинет'},
				{'place':'Место (мебель)'},
				{'notation':'Полка (номер)'},
				{'action':''}
			],
			filterColumn: [
			]
		},
		gridData: [],
		countPost: 32,
		locations: {
			id: '',
			cabinet_number: '',
			place: '',
			notation: ''
		},
		listError: []
	},
	methods: {
		createLocation(){
			axios.post("/reagent/create-location", JSON.stringify(this.locations), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.getLocation()
				)
			).catch(error => (this.listError = error));
		},
		locationEdit(){
			axios.post("/reagent/edit-location", JSON.stringify(this.locations), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.getLocation()
				)
			).catch(error => (this.listError = error));
		},
		locationDelete(id){
			axios.get("/reagent/delete-location?id=" + id).then( response => (this.getLocation()));
		},
		getLocation(){
			axios.get("/reagent/get-location").then( response => (this.gridData = response.data));
		}
	},
	mounted: function() {
		this.getLocation();
	}
});