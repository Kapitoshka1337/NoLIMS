Vue.config.devtools = true;
Vue.component('equipment-grid', {
	template: '#equipment-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
		checkEq: Object
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
			selectedEquipments: [],
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
			this.checkEq.id_equipment = id;
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
		select() {
			this.selectedEquipments = [];
			if (!this.selectAllMaterials)
			{
				for (let i in this.paginateRows)
				{
					this.selectedEquipments.push(this.paginateRows[i].id);
				}
			}
		},
		Details(id_equipment)
		{
			// "'details/' + equipment.id" КОСТЫЛЬ
			document.location.href = '/equipment/details/' + id_equipment;
		},
		GetSticker() {
			axios.post("/equipment/create-sticker", JSON.stringify(this.selectedEquipments), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					window.open(response.data)
				)
			).catch(error => (this.listError = error));
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
		check: {
			id_equipment: null,
			date_current_check: null,
			date_next_check: null,
			number_document: null,
			id_upload_document_type: null,
			upload_file_name: [],
		},
		listDocType: []
	},
	methods: {
		getEquipments(){
			axios.get("/equipment/get-equipments").then( response => (this.gridData = response.data));
		},
		getDocType(){
			axios.get("/equipment/get-doc-type").then( response => (this.listDocType = response.data));
		},
		setDropdown(){
			console.log($('.dropdown').dropdown({fullTextSearch: true}));
		// },
		// changeCheck(){
		// 	axios.post("/equipment/change-check", JSON.stringify(this.check), { headers: {'Content-Type': 'application/json'}})
		// 	.then(function(response)
		// 		{
		// 			if(response.status === 200)
		// 				this.submitFile()
		// 			// this.getEquipments(), this.check = {}
		// 			// console.log(1)
		// 		}).catch(error => (this.listError = error));
		// },
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
			this.check.upload_file_name[0] = this.$refs.upload_file_name.files[0];
		},
		submitFile(){
			let formData = new FormData();
			formData.append('id_equipment', this.check.id_equipment);
			formData.append('date_current_check', this.check.date_current_check);
			formData.append('date_next_check', this.check.date_next_check);
			formData.append('id_upload_document_type', this.check.id_upload_document_type);
			formData.append('number_document', this.check.number_document);
			formData.append('upload_file_name', this.check.upload_file_name[0]);
			axios.post('/equipment/change-check', formData, {headers:{'Content-Type': 'multipart/form-data'}
			}).then(response => (this.getEquipments(), this.check.file[0] = [])).catch(error => (alert('ОШИБКА ЗАГРУЗКИ ФАЙЛА')));
		}
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
	mounted: function() {
		this.getEquipments();
		this.getDocType();
	}
});