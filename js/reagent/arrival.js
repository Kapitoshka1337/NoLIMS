Vue.config.devtools = true;
var arrival = new Vue({
	el: "#arrival",
	data: {
		gridColumns: {
			tableColumn: [
				{'type':'Тип'},
				{'material':'Материал'},
				{'measure':'Ед.изм.'}
			],
			filterColumn: [
				{'action':''},
				{'type':'Тип'},
				{'action':''}
			]
		},
		filters: {
			type: [],
			material: null,
		},
		listError: [],
		listLocations: [],
		listMaterial: [],
		listMaterialForTable: [],
		listMaterialForSave: [],
		order: {
			num_order: '',
			date_order: '',
		},
		selectAllMaterials: false,
		countPost: 64,
		currentPage: 1,
		listPages: [],
	},
	methods: {
		showModal(){
			$('.coupled.modal').modal({allowMultiple: true});
		},
		tableMaterial(modalName){
			$('#modal' + modalName).modal('show');
		},
		tableFilter(modalName){
			console.log($('#modalAddMaterial #mod'));
			$('#modal' + modalName).modal('attach events', '#modalAddMaterial .button');
		},
		deleteMaterial(index, material) {
			var idx = this.listMaterialForTable.indexOf(material);
			if (idx > -1) this.listMaterialForTable.splice(idx, 1);
		},
		save(){
			// this.listError = [];
			// for(let material of this.listMaterialForTable)
			// {
			// 	if(material.amount === '')
			// 		this.listError.push(material);
			// }
			if (this.num_order != '')
			{
				let obj = [{
					num_order: this.order.num_order,
					date_order: this.order.date_order,
					materials: this.listMaterialForTable
				}];
				axios.post("/reagent/new-arrival", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(function (response)
				{ 
					if (response.status === 200) 
					{
						document.location.href = '/reagent/arrival';
					}
				});
			}
		},
		cancel(){
			document.location.href = '/reagent/arrival';
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		getMaterial(){
			axios.get("/reagent/get-material").then( response => (this.listMaterial = response.data));
		},
		select() {
			this.listMaterialForTable = [];
			if (!this.selectAllMaterials)
			{
				for (let i in this.paginateRows)
				{
					this.listMaterialForTable.push({
						type: this.paginateRows[i].type, 
						material_id: this.paginateRows[i].material_id, 
						material: this.paginateRows[i].material,
						measure: this.paginateRows[i].measure,
						amount: 0,
						date_create: '',
						shelf_life: '',
						id_location: null,
						packing_name: ''
					});
				}
			}
		},
		getLocation(){
			axios.get("/reagent/get-location").then( response => (this.listLocations = response.data));
		},
		returnUniq(column){
			let result = [];
			for (let str of this.listMaterial)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
				})
			return result;
		},
		clearFilter(){
			$('.dropdown').dropdown('clear');
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
		getToday () {
			let today = new Date();
			this.order.date_order = today.toISOString().split('T')[0];
		},
	},
	watch:{
		filteredRows(){
			this.listPages = [];
			this.setPages();
		}
	},
	computed: {
		filteredRows: function () {
			let mate = this.filters.material && this.filters.material.toLowerCase();
			if (mate != null || mate != '')
			{
				return this.listMaterial.filter(function(row){
					return Object.keys(row).some(function(key) {
						return ( String(row[key]).toLowerCase().indexOf(mate) > -1 );
					});
				});
			}
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		}
	},
	mounted: function(){
		this.getMaterial();
		this.getLocation();
		this.setDropdown();
		this.showModal();
		this.getToday();
	}
});