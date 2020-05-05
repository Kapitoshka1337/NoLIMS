Vue.config.devtools = true;
let demo1 = new Vue({
	el: '#handoff',
	data: {
		gridColumns: {
			tableColumn: [
				{'material_id':'ID'},
				{'material':'Материал'},
				{'measure':'Ед.изм.'},
				{'amount':'Количество'},
				{'date_create':'Дата изг.'},
				{'shelf_life':'Годен до'},
			],
			filterColumn: [
				{'department_to':'Отдел (передано)'},
				{'status':'Статус'},
			]
		},
		gridData: [],
		filters: {
			department_to: [],
			status: []
		},
		listError: []
	},
	methods: {
		getHistory(){
			axios.get("/reagent/get-history?status=1").then( response => (this.gridData = response.data));
		},
		// setDropdown(){
		// 	$('.dropdown').dropdown({fullTextSearch: true});
		// },
		getToday () {
			let today = new Date();
			return today.toISOString().split('T')[0];
		},
		requestApprove(id, id_df, materials){
			let request = [];
			request.push({
				id_handoff: id,
				date_handoff: this.getToday(),
				id_department_from: id_df,
				materials: materials
			})
			axios.post("/reagent/approve-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.getHistory())).catch(error => (this.listError = error));
		},
		requestDeclining(id){
			let request = [];
			request.push({
				id_handoff: id,
				date_handoff: this.getToday()
			}) 
			axios.post("/reagent/declining-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.getHistory())).catch(error => (this.listError = error));
		},
		showModal(modalName){
			$('#modal' + modalName).modal('show');
		},
		// returnUniq(column){
		// 	let result = [];
		// 	for (let str of this.gridData)
		// 		if (!result.includes(str[column]))
		// 			result.push(str[column]);
		// 		result = result.slice().sort(function (a, b){
		// 			if(a === b) return 0 ;
		// 			else if (a > b) return 1;
		// 			else return - 1;
		// 		})
		// 	return result;
		// }
	},
	computed: {
		filteredRows: function () {
			let rows = this.gridData;
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					if(r.materials.total === null) r.materials.total = r.materials.amount;
						return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
				})
			})
		},
		// today(){
		// 	let today = new Date();
		// 	return today.toLocaleString().split(',')[0];
		// }
	},
	mounted: function() {
		this.getHistory();
		// this.setDropdown();
		// setTimeout(() => { $('.ui.accordion').accordion();}, 4000);
	}
});