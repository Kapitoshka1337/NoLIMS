// Vue.config.devtools = true;
Vue.component('storage-grid', {
	template: '#storage-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
		materials: Array,
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
		showModal(modalName, id = null, material = null, measure = null, total = null){
			this.materials.materialArrivalId = id;
			this.materials.materialName = material;
			this.materials.materialMeasure = measure;
			this.materials.total = total;
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
		showPassport(id){
			axios.get("/reagent/get-passport?id=" + id).then( response => (window.open(response.data)));
		},
		moveToArchive(id){
			axios.get("/reagent/material-to-archive?id=" + id).then( response => (demo1.getStorage()));
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
				{'material_id':'ID'},
				{'date_create':'Дата изг.'},
				{'location':'Местоположение'},
				{'material':'Материал'},
				{'measure':'Ед.изм'},
				{'total':'Количество'},
				{'shelf_life':'Годен до'},
				{'passport':'Паспорт'}
			],
			filterColumn: [
				{'material_id':'ID'},
				{'type':'Тип'},
				{'material':'Материал'},
				{'date_create':'Дата изготовления'},
				{'shelf_life':'Годен до'},
				{'location':'Местоположение'},
			]
		},
		gridData: [],
		filters: {
			material_id: [],
			type: [],
			material: [],
			date_create: [],
			shelf_life: [],
			location: []
		},
		countPost: 64,
		materials: {
			materialArrivalId: null,
			materialName: null,
			date_usage: null,
			date_record: null,
			amount: null,
			total: null,
			materialMeasure: null
		},
		file: [],
		typeUploadFile: '',
	},
	methods: {
		submitExpense(){
			if ((this.materials.total - this.materials.amount) >= 0 && this.materials.amount != null)
			{
				axios.get("/reagent/expense-material?id=" + this.materials.materialArrivalId + 
					"&date_usage=" + this.materials.date_usage + 
					"&amount=" + this.materials.amount + 
					"&date_record=" + this.materials.date_record).then( response => (this.getStorage()));
				this.materials.amount = null;
				this.getToday();
			}
		},
		getStorage(){
			axios.get("/reagent/get-storage?all=0").then( response => (this.gridData = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		getToday () {
			let today = new Date();
			this.materials.date_record = today.toISOString().split('T')[0];
			this.materials.date_usage = today.toISOString().split('T')[0];
		},
		handleFileUpload(){
			this.file[0] = this.$refs.file.files[0];
		},
		submitFile(id){
			let formData = new FormData();
			formData.append('File', this.file[0]);
			formData.append('id_arrival_material', this.materials.materialArrivalId);
			formData.append('id_type_upload_files', this.typeUploadFile);
			axios.post( '/reagent/upload-file', formData, {headers:{'Content-Type': 'multipart/form-data'}
			}).then(response => (this.getStorage(), this.file[0] = [])).catch(error => (alert('FAILURE')));
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
	computed: {
		validationExpense(){
			this.errors = [];
			if ((this.materials.total - this.materials.amount) < 0)
				return 'Нельзя потратить больше ' + this.materials.total;
		}
	},
	mounted: function() {
		this.getStorage();
		this.getToday();
		this.setDropdown();
	}
});