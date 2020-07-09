Vue.config.devtools = true;
Vue.component('equipment-grid', {
	template: '#equipment-grid',
	props: {
		rows: Array,
		columns: Array,
		filters: Array,
		filtersCheck: Object,
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
			selectAllMaterials: false,
			selectedEquipments: [],
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
		showModal(modalName, id_eq){
			this.$emit('repair', id_eq);
			$('#modal' + modalName).modal('show');
		},
		clearFilter(){
			this.$emit('clear');
			$('.dropdown').dropdown('clear');
		},
		select() {
			this.selectedEquipments = [];
			if (!this.selectAllMaterials)
				for (let i in this.paginateRows)
					this.selectedEquipments.push({id_equipment: this.paginateRows[i].id});
		},
		GetSticker() {
			if(this.selectedEquipments.length > 0)
			{
				let obj = [];
				for (let item in this.selectedEquipments)
					obj.push(this.selectedEquipments[item].id_equipment);
				axios.post("/equipment/print-sticker", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>(window.open('/assets/template/sticker.pdf'))).catch(error => (this.listError = error));
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
				axios.post("/equipment/print-card", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(window.open(response.data))).catch(error => (this.listError = error));
			}
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
		}
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
			Object.keys(this.filtersCheck).forEach(f =>
			{
				if(this.filtersCheck[f])
					rows = rows.filter(row => {
						return row[f] === 1;
					})
			})
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
				{'number':'Номер'},
				{'equipment':'Оборудование'},
				{'model':'Модель'},
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
				{'equipment':'Оборудование'}
			]
		},
		gridData: [],
		filters: {
			number: [],
			department: [],
			type: [],
			equipment: [],
		},
		countPost: 100,
		checks: {
			is_archive: false,
			is_conservation: false,
			is_check: false,
			is_repair: false,
			is_working: false
		},
		dateFilter: {
			start: null,
			end: null
		},
		selectedEquipments: [],
		repair: {
			description: null,
			date: null,
			id_equipment: null
		}
	},
	methods: {
		getEquipments(){
			axios.get("/equipment/get-equipments").then( response => (this.gridData = response.data));
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
		setSelectedEquipments(info){
			this.repair.id_equipment = info;
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
			axios.post("/equipment/send-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (console.log(1)));
		},
		clearDate(){
			this.dateFilter = {};
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		getToday () {
			let today = new Date();
			this.repair.date = today.toISOString().split('T')[0];
		},
		appendRepair(){
			axios.post("/equipment/append-repair", JSON.stringify(this.repair), {headers: {'Content-Type': 'application/json'}}).then(response => (console.log(1)));
		}
	},
	mounted: function() {
		this.getEquipments();
		this.getToday();
	}
});