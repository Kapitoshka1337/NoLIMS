Vue.config.devtools = true;
Vue.component('equipment-grid', {
	template: '#equipment-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		countPost: Number,
		checkEq: Object,
		handoff: Object
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
			selectAllMaterials: false,
			selectedEquipments: [],
			tags: {
				is_archive: 'Архив',
				is_conservation: 'Консервация',
				is_repair: 'Ремонт',
				is_check: 'ЦСМ',
				is_working: 'Используется'
			},
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
		//ТАК НЕ ДЕЛАЕТСЯ
		showModalHandoff(modalName, id = null, department = null, id_to = null){
			this.handoff.department = department;
			this.handoff.id_equipment = id;
			this.handoff.id_department_to = id_to;
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
		},
		select() {
			this.selectedEquipments = [];
			if (!this.selectAllMaterials)
				for (let i in this.paginateRows)
					this.selectedEquipments.push({
						id_equipment: this.paginateRows[i].id,
						is_archive: this.paginateRows[i].is_archive,
						is_conservation: this.paginateRows[i].is_conservation,
						is_repair: this.paginateRows[i].is_repair,
						is_check: this.paginateRows[i].is_check,
						is_working: this.paginateRows[i].is_working,
						number: this.paginateRows[i].number,
						id_department: this.paginateRows[i].id_department,
						type: this.paginateRows[i].type,
						date_current_check: this.paginateRows[i].date_current_check,
						date_next_check: this.paginateRows[i].date_next_check,
						equipment: this.paginateRows[i].equipment
					});
		},
		Details(id_equipment)
		{
			// "'details/' + equipment.id" КОСТЫЛЬ
			document.location.href = '/equipment/details/' + id_equipment;
		},
		GetSticker() {
			if(this.selectedEquipments.length > 0)
			{
				let obj = [];
				for (let item in this.selectedEquipments)
					obj.push(this.selectedEquipments[item].id_equipment);
				axios.post("/equipment/create-sticker", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>(window.open('/assets/template/sticker.pdf'))).catch(error => (this.listError = error));
			}
		},
		GetCard() {
			if(this.selectedEquipments.length > 0)
			{
				let obj;
				let obj1 = [];
				for (let item in this.selectedEquipments)
					obj1.push(this.selectedEquipments[item].id_equipment);
				obj = {id: obj1};
				axios.post("/equipment/create-card", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(window.open(response.data))).catch(error => (this.listError = error));
			}
		},
		setTag(tag, value){
			if(this.selectedEquipments.length > 0)
			{
				let obj;
				let obj1 = [];
				for (let item in this.selectedEquipments)
					obj1.push(this.selectedEquipments[item].id_equipment);
				obj = {tag: tag, value: value, eq: obj1};
				axios.post("/equipment/set-tag", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>(demo1.getEquipments(), this.selectedEquipments = [])).catch(error => (this.listError = error));
			}
		},
		test(){
			console.log(1);
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
            if (filterKey) {
              rows = rows.filter(function(row) {
                return Object.keys(row).some(function(key) {
                  return (
                    String(row[key]).toLowerCase().indexOf(filterKey) > -1);
                });
              });
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
		tagsFromSelected(){
			// key[row] == value
			// key == object
			// row == name key
			let rows = this.selectedEquipments;
			let tags = this.tags;
			let obj_tags = {};
				rows.forEach(function(key)
				{
					Object.keys(key).forEach(function(row)
					{
						if(key[row])
							Object.keys(tags).forEach(function(tag)
							{
								if(row === tag) obj_tags[tag] = tags[tag];
							});
					});
				});
			return obj_tags;
		}
	},
})

let demo1 = new Vue({
	el: '#demo1',
	data: {
		gridColumns: {
			tableColumn: [
				{'number':'Номер'},
				{'equipment':'Оборудование'},
				{'serial_number':'С/Н'},
				{'date_current_check':'Текущая'},
				{'date_next_check':'Следующая'},
				{'Tag': ''},
				{'action': ''}
			],
			filterColumn: [
				{'number':'Номер'},
				{'department':'Отдел'},
				{'type':'Вид'},
				{'equipment':'Оборудование'},
				{'serial_number':'S/N'},
				{'date_current_check':'Текущая проверка'},
				{'date_next_check':'Следующая проверка'},
				{'is_archive':'Архив'},
				{'is_conservation':'Консервация'},
				{'is_check':'Проверка'},
				{'is_repair':'Ремонт'},
				{'is_working':'В работе'}
			]
		},
		gridData: [],
		filters: {
			number: [],
			department: [],
			type: [],
			equipment: [],
			date_current_check: [],
			date_next_check: [],
			is_archive: [],
			is_conservation: [],
			is_check: [],
			is_repair: [],
			is_working: []
		},
		countPost: 100,
		check: {
			id_equipment: null,
			date_current_check: null,
			date_next_check: null,
			number_document: null,
			id_upload_document_type: null,
			upload_file_name: [],
			is_archive: false,
			is_conservation: false
		},
		handoff: {
			id_equipment: null,
			department: null,
			id_department_to: null,
			id_location: null
		},
		listDocType: [],
		listDepartment: [],
		selectedEquipments: []
	},
	methods: {
		getEquipments(){
			axios.get("/equipment/get-equipments").then( response => (this.gridData = response.data));
		},
		getDocType(){
			axios.get("/equipment/get-doc-type").then( response => (this.listDocType = response.data));
		},
		getDepartment(){
			axios.get("/equipment/get-department").then( response => (this.listDepartment = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		handleFileUpload(){
			this.check.upload_file_name[0] = this.$refs.upload_file_name.files[0];
		},
		submitFile(){
			//ПЕРЕКИДЫВАЕТ В ERROR
			let formData = new FormData();
			formData.append('id_equipment', this.check.id_equipment);
			formData.append('date_current_check', this.check.date_current_check);
			formData.append('date_next_check', this.check.date_next_check);
			formData.append('id_upload_document_type', this.check.id_upload_document_type);
			formData.append('number_document', this.check.number_document);
			formData.append('is_archive', this.check.is_archive);
			formData.append('is_conservation', this.check.is_conservation);
			formData.append('upload_file_name', this.check.upload_file_name[0]);
			axios.post('/equipment/change-check', formData, {headers:{'Content-Type': 'multipart/form-data'}
			}).then(response => (this.getEquipments(), this.check.file[0] = [], this.check = {})).catch(error => (alert('ОШИБКА ЗАГРУЗКИ ФАЙЛА')));
		},
		setHandoff(){
			axios.post("/equipment/set-handoff", JSON.stringify(this.handoff), {headers: {'Content-Type': 'application/json'}}).then(response => (this.getEquipments())).catch(error => (this.listError = error));
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
		setSelectedEquipments(info){
			this.selectedEquipments = info;
		},
		deleteMaterial(index, equipment){
			var idx = this.selectedEquipments.indexOf(equipment);
			if (idx > -1) this.selectedEquipments.splice(idx, 1);
		},
		sendRequest(){
			let request = [];
			for(let i in this.selectedEquipments)
			{
				request.push({
					id_department: this.selectedEquipments[i].id_department,
					id_equipment: this.selectedEquipments[i].id_equipment
				});
			}
			// console.log(this.selectedEquipments);
			// this.SelectedEquipments.forEach(function(row){});
			axios.post("/equipment/send-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (console.log(1)));
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
	computed: {
		filteredLocation(){
			let rows = this.listDepartment;
			let id_department = this.handoff.id_department_to;
			let locs = [];
			if(id_department)
			{
				rows = rows.filter(r => { return r.id_department === id_department });
				rows.forEach(function(key){
					if(key.locations)
						key.locations.forEach(function(location){
							locs.push({
								id: location.id_location,
								cabinet_number: location.cabinet_number
							});
						})
				})
				return locs;
			}
			else return null;
		}
	},
	mounted: function() {
		this.getEquipments();
		this.getDepartment();
		this.getDocType();
	}
});