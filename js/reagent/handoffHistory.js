// Vue.config.devtools = true;
Vue.component('handoff-list', {
	template: '#handoff-list',
	props: {
		rows: Array,
		columns: Array,
		filters: Array
	},
	methods: {
		requestApprove(id, id_df, materials){
			let request = [];
			request.push({
				id_handoff: id,
				date_handoff: this.getToday(),
				id_department_from: id_df,
				materials: materials
			})
			axios.post("/reagent/approve-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (demo1.getHistory())).catch(error => (this.listError = error));
		},
		requestDeclining(id){
			let request = [];
			request.push({
				id_handoff: id,
				date_handoff: this.getToday()
			}) 
			axios.post("/reagent/declining-request", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (demo1.getHistory())).catch(error => (this.listError = error));
		},
		getToday () {
			let today = new Date();
			return today.toISOString().split('T')[0];
		},
	},
	computed: {
		filteredRows: function () {
			let rows = this.rows;
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					for (var i = r.materials.length - 1; i >= 0; i--)
						if(!r.materials[i].total) r.materials[i].total = r.materials[i].arrival_amount;
					return this.filters[f].length < 1 || this.filters[f].includes(r.materials[0][f]);
				})
			})
		}
	},
});

let demo1 = new Vue({
	el: '#demo1',
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
				{'department_to':'Отдел'},
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
			axios.get("/reagent/get-history?status=0").then( response => (this.gridData = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		returnUniq(column){
			let result = [];
			for (let str of this.gridData)
				if (!result.includes(str.materials[0][column]))
					result.push(str.materials[0][column]);
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
			if($('.ui.accordion').accordion().length <= 0)
			{
				let interval = setInterval(function()
				{ 
					if($('.ui.accordion').accordion().length <= 0)
						$('.ui.accordion').accordion();
					else clearInterval(interval);
				}, 1000);
			}
		}
	},
	computed: {
		today(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		}
	},
	mounted: function() {
		this.getHistory();
		this.setDropdown();
	}
});