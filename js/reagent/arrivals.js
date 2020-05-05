// Vue.config.devtools = true;
Vue.component('order-list', {
	template: '#order-list',
	props: {
		rows: Array,
		columns: Array,
		filters: Array
	},
	data: function () {
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
})

let demo1 = new Vue({
	el: '#demo',
	data: {
		gridColumns: {
			tableColumn: [
			],
			filterColumn: [
				{'num_order':'Номер заказа'},
				{'date_order':'Дата заказа'},
				{'moving_type':'Вид поступления'}
			]
		},
		gridData: [],
		filters: {
			department: [],
			date_order: [],
			moving_type: [],
			num_order: []
		},
		listDepartment: []
	},
	methods: {
		getArrivals(){
			axios.get("/reagent/get-arrivals").then( response => (this.gridData = response.data));
		},
		getDepartment(){
			axios.get("/reagent/get-department").then( response => (this.listDepartment = response.data));
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
	watch: {
		gridData(){
			if($('.ui.accordion').accordion().length <= 0)
			{
				let interval = setInterval(function()
				{ 
					if($('.ui.accordion').accordion().length <= 0)
					{
						$('.ui.accordion').accordion();
					}
					else clearInterval(interval);
				}, 1000);
			}
		}
	},
	computed: {
		filteredRows: function () {
			let rows = this.gridData;
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
				})
			})
		}
	},
	mounted: function() {
		this.getArrivals();
		this.setDropdown();
		// setTimeout(() => { $('.ui.accordion').accordion();}, 2000);
	}
});