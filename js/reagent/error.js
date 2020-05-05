Vue.config.devtools = true;
Vue.component('error-list', {
	template: '#error-list',
	props: {
		rows: Array,
		columns: Array,
		filters: Array
	},
	methods: {
		errorApprove(id_error, id_outgo, amount){
			let request = {
				id_error: id_error,
				id_expenses: id_outgo,
				amount: amount
			};
			axios.post("/reagent/approve-error", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (demo1.getError())).catch(error => (this.listError = error));
		},
		errorDeclining(id_error){
			let request = {
				id_error: id_error
			}; 
			axios.post("/reagent/declining-error", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (demo1.getError())).catch(error => (this.listError = error));
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
					return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
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
				{'user':'Сотрудник'},
				{'amount':'Количество'},
				{'description':'Причина исправления'},
				{'date_record':'Дата'}
			],
			filterColumn: [
				{'status':'Статус'},
				{'date_record':'Дата'}
			]
		},
		gridData: [],
		filters: {
			status: [],
			date_record: []
		},
		listError: []
	},
	methods: {
		getError(){
			axios.get("/reagent/get-error").then( response => (this.gridData = response.data));
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
		}
	},
	mounted: function() {
		this.getError();
		this.setDropdown();
	}
});