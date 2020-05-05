Vue.config.devtools = true;
Vue.component('equipment-grid', {
	template: '#equipment-grid',
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
			selectAllMaterials: false,
			selectedMaterials: [],
			id_equipment: null
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
		showModal(modalName, id = null){
			this.$emit('request', this.selectedMaterials);
			this.$emit('equipment', this.id_equipment = id);
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
		select() {
			this.selectedMaterials = [];
			if (!this.selectAllMaterials)
			{
				for (let i in this.paginateRows)
				{
					this.selectedMaterials.push({
						id_equipment: this.paginateRows[i].id,
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
				{'action': ''},
				{'number':'Номер'},
				{'equipment':'Оборудование'},
				{'serial_number':'С/Н'},
				{'date_current_check':'Текущая'},
				{'date_next_check':'Следующая'},
				{'action': ''}
			],
			filterColumn: [
				{'number':'Номер'},
				{'department':'Отдел'},
				{'type':'Вид'},
				{'equipment':'Оборудование'},
				{'serial_number':'S/N'},
				{'date_current_check':'Текущая проверка'},
				{'date_next_check':'Следующая проверка'}
			]
		},
		gridData: [],
		filters: {
			number: [],
			department: [],
			type: [],
			equipment: [],
			date_current_check: [],
			date_next_check: []
		},
		countPost: 64,
		equipment: {
			number: null,
			id_department: null,
			id_equipment_type: null,
			title: null,
			model: null,
			serial_number: null,
			manufacturer: null,
			date_create: null,
			inventory_number: null,
			id_location: null
		},
		check: {
			id_equipment: null,
			current: null,
			next: null,
			typeUploadFile: null,
			file: [],
		},
		listDepartment: [],
		listLocations: [],
		selectedMaterials: [],
		listType: [],
		listDocType: []
	},
	methods: {
		appendEq(){
			axios.post("/equipment/append", JSON.stringify(this.equipment), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.getEquipments()
				)
			).catch(error => (this.listError = error));
		},
		getEquipments(){
			axios.get("/equipment/get-equipments").then( response => (this.gridData = response.data));
		},
		getDocType(){
			axios.get("/equipment/get-doc-type").then( response => (this.listDocType = response.data));
		},
		setDropdown(){
			console.log($('.dropdown').dropdown({fullTextSearch: true}));
		},
		changeCheck(){
			axios.post("/equipment/change-check", JSON.stringify(this.check), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.getEquipments()
				)
			).catch(error => (this.listError = error));
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
		handleFileUpload(){
			this.check.file[0] = this.$refs.file.files[0];
		},
		submitFile(id){
			let formData = new FormData();
			formData.append('File', this.check.file[0]);
			formData.append('id_arrival_material', this.check);
			formData.append('id_type_upload_files', this.check.typeUploadFile);
			axios.post( '/equipment/upload-file', formData, {headers:{'Content-Type': 'multipart/form-data'}
			}).then(response => (this.getEquipments(), this.check.file[0] = [])).catch(error => (alert('FAILURE')));
		},
	},
	watch: {
		gridData(){
			let interval = setInterval(function()
			{ 
				if($('.dropdown').dropdown({fullTextSearch: true}).length <= 0)
					$('.dropdown').dropdown({fullTextSearch: true});
				else clearInterval(interval);
			}, 1000);
		}
	},
	// computed: {
	// 	validationExpense(){
	// 		this.errors = [];
	// 		if ((this.materials.total - this.materials.amount) < 0)
	// 			return 'При потреблении ' + this.materials.amount + ' останется ' + (this.materials.total - this.materials.amount) + ' ';
	// 		// if(this.materials.amount === null || this.materials.amount === '')
	// 		// 	return 'Введите количество потребления';
	// 	}
	// },
	mounted: function() {
		this.getEquipments();
		this.getDocType();
	}
});