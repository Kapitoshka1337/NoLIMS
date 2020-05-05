Vue.config.devtools = true;
// Vue.component('demo-grid', {
// 	template: '#grid-template',
// 	props: {
// 		rows: Array,
// 		columns: Array,
// 		// filterKey: String,
// 		filterList: Array,
// 		countPost: Number,
// 	},
// 	data: function () {
// 		//Каждому заголовоку присвоить 1 = ASC -1 = DESC
// 		let sortColumns = {};
// 		// let headColumns = {};
// 		// let filterColumns = {};
// 		this.columns.forEach(function (key){
// 			Object.keys(key).some(function(row){
// 				if (row !== 'action')
// 				{
// 					sortColumns[row] = 1;
// 					// filterColumns[row] = [];
// 				}
// 			});
// 			// if(Object.keys(key)[0] === '#') return;
// 			// console.log(Object.keys(key));
// 			// sortColumns[Object.keys(key)] = 1;
// 			// headColumns[Object.keys(key)] = Object.values(key)[0];
// 			// filterColumns[key] = [];
// 		})
// 		return {
// 			sortKey: '',
// 			sortColumns: sortColumns,
// 			currentPage: 1,
// 			listPages: [],
// 			// headColumns: headColumns,
// 			// filterColumns: filterColumns,
// 		}
// 	},
// 	filters: {
// 		capitalize: function (str) {
// 			return str.charAt(0).toUpperCase() + str.slice(1);
// 		}
// 	},
// 	methods: {
// 		sortBy: function (key) {
// 			if(key === 'action') return;
// 			this.sortKey = key;
// 			this.sortColumns[key] = this.sortColumns[key] * -1;
// 		},
// 		setPages () {
// 			let numOfPage = Math.ceil(this.rows.length / this.countPost);
// 			for (let i = 1; i <= numOfPage; i++)
// 			{
// 				this.listPages.push(i);
// 			}
// 		},
// 		paginate (rows) {
// 			let page = this.currentPage;
// 			let curPost = this.countPost;
// 			let from = (page * curPost) - curPost;
// 			let to = ((page * curPost));
// 			return rows.slice(from, to);
// 			},
// 	},
// 	watch: {
// 		rows() {
// 			this.listPages = [];
// 			this.setPages();
// 		}
// 	},
// 	computed: {
// 		filteredRows: function () {
// 			let sortKey = this.sortKey;
// 			// let filterKey = this.filterKey && this.filterKey.toLowerCase();
// 			let order = this.sortColumns[sortKey] || 1;
// 			let rows = this.rows;
// // console.log(this.rows);
// 			// if (filterKey)
// 			// {
// 			// 	rows = rows.filter(function (row) {
// 			// 		return Object.keys(row).some(function (key) {
// 			// 			return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
// 			// 		})
// 			// 	})
// 			// }
			
// 			// if(this.filterList.length)
// 			// {

// 			// }
// 				// console.log(this.filterList)
// 				// for(var key in this.filterList)
// 				// {
// 				// 	if(this.filterList[key] != '')
// 				// 	{
// 				// 		// console.log(this.filterList[key]);
// 				// 		this.filterList[key].forEach(function(values){						
// 				// 			rows = rows.filter(function(row){
// 				// 				return row[key] === values;
// 				// 				// return Object.keys(row).some(function(item){});
// 				// 				// return this.filterList[key].includes(row[key]);
// 				// 			})
// 				// 		})
// 				// 		//Массив значений
// 				// 		// this.filterList[key].forEach(function(values){
// 				// 		// 	// console.log(key + "|" + values);
// 				// 		// 	rows = rows.filter(function (row) {
// 				// 		// 		//Ключевые поля
// 				// 		// 		// console.log(Object.keys(row));
// 				// 		// 		return Object.keys(row).some(function (keys) {
// 				// 		// 			console.log(row[key].toLowerCase().indexOf(values) > -1);
// 				// 		// 			// return String(row[keys]).toLowerCase().indexOf(filter) > -1;
// 				// 		// 		})
// 				// 		// 	})
// 				// 		// })
// 				// 	}
// 				// 	// let item = key + "|" + this.filterList[key]
// 				// 	// console.log(item);
// 				// }
// 			// }

// 			if (sortKey)
// 			{
// 				rows = rows.slice().sort(function (a, b) {
// 					a = a[sortKey];
// 					b = b[sortKey];
// 					if(a === b) return 0 * order;
// 					else if (a > b) return 1 * order;
// 					else return - 1 * order;
// 					//return (a === b ? 0 : a > b ? 1 : -1) * order;
// 				})
// 			}
// 			return this.paginate(rows.filter(r =>
// 			{
// 				return Object.keys(this.filterList).every(f =>
// 				{
// 					return this.filterList[f].length < 1 || this.filterList[f].includes(r[f])
// 				})
// 			}))
// 			// return rows;
// 		},
// 	},
// });

var demo = new Vue({
	el: '#demo',
	data: {
		gridColumns: [
			{'material_id':'ID'},
			{'type':'Тип'},
			{'material':'Материал'},
			{'measure':'Ед.изм'},
			{'action':''}
		],
		gridData: [],
		sortColumns: [],
		filters: {
			material_id: [],
			type: [],
			material: [],
			measure: []
		},
		sortKey: '',
		countPost: 32,
		currentPage: 1,
		listPages: [],
		materials: {
			materialId: '',
			materialType: '',
			materialDepartment: '',
			materialName: '',
			materialMeasure: '',
		},
		listType: [],
		listMeasure: []
	},
	methods: {
		showModal(modalName, id = null, type = null, title = null, measure = null, density = null){
			this.materials.materialId = id;
			this.materials.materialType = type;
			this.materials.materialName = title;
			this.materials.materialMeasure = measure;
			$('#modal' + modalName).modal('show');
		},
		createMaterial(){
			axios.post("/reagent/create-material", JSON.stringify(this.materials), {headers: {'Content-Type': 'application/json'}}).then(response =>
				(
					this.getMaterials()
				)
			).catch(error => (this.listError = error));
		},
		materialEdit(id, type, material, measure){
			axios.get("/reagent/edit-material?id=" + id + "&type=" + type + "&material=" + material + "&measure=" + measure).then( response => (this.getMaterials()));
		},
		materialDelete(id){
			axios.get("/reagent/delete-material?id=" + id).then( response => (this.getMaterials()));
		},
		getMaterials(){
			axios.get("/reagent/get-material").then( response => (this.gridData = response.data));
		},
		getType(){
			axios.get("/reagent/get-type").then( response => (this.listType = response.data));
		},
		getMeasure(){
			axios.get("/reagent/get-measure").then( response => (this.listMeasure = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		sortBy: function (key) {
			if(key === 'action') return;
			this.sortKey = key;
			this.sortColumns[key] = this.sortColumns[key] * -1;
		},
		setPages () {
			let numOfPage = Math.ceil(this.gridData.length / this.countPost);
			for (let i = 1; i <= numOfPage; i++)
			{
				this.listPages.push(i);
			}
		},
		paginate (rows) {
			let page = this.currentPage;
			let curPost = this.countPost;
			let from = (page * curPost) - curPost;
			let to = ((page * curPost));
			return rows.slice(from, to);
		},
		setSort(){
			let sort = {};
			this.gridColumns.forEach(function (key){
				Object.keys(key).some(function(row){
					if (row !== 'action')
						sort[row] = 1;
					});
				});
			this.sortColumns = sort;
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
	watch:{
		gridData(){
		this.listPages = [];
		this.setPages();
		}
	},
	computed: {
		filteredRows: function () {
			let sortKey = this.sortKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = this.gridData;
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
			return this.paginate(rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
				})
			}))
		},
	},
	mounted: function() {
		this.getMaterials();
		this.setSort();
		this.getType();
		this.getMeasure();
		this.setDropdown();
		$('#type').dropdown({fullTextSearch: true});
		$('#measure').dropdown({fullTextSearch: true});
	}
});

// var materials = new Vue({
// 	el: "#listMaterial",
// 	data: {
// 		listMaterials: [],
// 		listType: [],
// 		listMeasure: [],
// 		materials: {
// 			materialId: '',
// 			materialType: '',
// 			materialDepartment: '',
// 			materialName: '',
// 			materialMeasure: '',
// 			materialDensity: '',
// 			materialPassport: '',
// 		},
// 		filters: {
// 			type: '',
// 			material: ''
// 		},
// 		listError: '',//ВЫВОД ОШИБОК ЧЕРЕЗ УВЕДОМЛЕНИЯ
// 	},
// 	methods: {
// 		getType(){
// 			axios.get("/reagent/get-type").then( response => (this.listType = response.data));
// 		},
// 		getMeasure(){
// 			axios.get("/reagent/get-measure").then( response => (this.listMeasure = response.data));
// 		},
// 		getMaterials(){
// 			axios.get("/reagent/get-material").then( response => (this.listMaterials = response.data));
// 		},
// 		createMaterial(){
// 			axios.post("/reagent/create-material", JSON.stringify(this.materials), {headers: {'Content-Type': 'application/json'}}).then(response =>
// 				(
// 					this.listMaterials.push(response.data)
// 				)
// 			).catch(error => (this.listError = error));
// 		},
// 		materialEdit(id, title){
// 			axios.get("/reagent/edit-material?id=" + id + "&material=" + title).then( response => (this.getMaterials()));
// 		},
// 		materialDelete(id){
// 			axios.get("/reagent/delete-material?id=" + id).then( response => (this.getMaterials()));
// 		},
// 		showModal(modalName, id = null, type = null, title = null, measure = null, density = null){
// 			this.materials.materialId = id;
// 			this.materials.materialType = type;
// 			this.materials.materialName = title;
// 			this.materials.materialMeasure = measure;
// 			this.materials.materialDensity = density;
// 			$('#modal' + modalName).modal('show');
// 		},
// 		clearFilter(){
// 			this.filters = [];
// 		}
// 	},
// 	computed: {
// 		filteredList() {
// 			if(this.filters.type)
// 			{
// 					return this.listMaterials.filter((material) => 
// 					{
// 						return material.type.toLowerCase().includes(this.filters.type.toLowerCase());
// 					})
// 			}
// 			else
// 			{
// 				return this.listMaterials;
// 			}
// 		}
// 	},
// 	mounted: function(){
// 		$(".dropdown").dropdown();
// 		this.getMaterials();
// 		this.getType();
// 		this.getMeasure();
// 	}
// })