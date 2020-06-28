Vue.config.devtools = true;
Vue.component('equipment-dashboard', {
	template: '#equipment-dashboard',
	props: {
		rows: Array
	},
	data: function () {},
	methods: {
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		printTable(id_type){
			alert(id_type);
			let date = new Date();
			let objs = {start: new Date(date.getFullYear(), date.getMonth(), 2).toISOString().split('T')[0], end: new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().split('T')[0], type: id_type};
			axios.post("/equipment/print-table?today", JSON.stringify(objs), {headers: {'Content-Type': 'application/json'}}).then( response => (window.open('/assets/template/plan.pdf')));
		},
		colorShelfLife(date){
			let today = new Date();
			let date1 = new Date(date);
			return Math.ceil((date1.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
	},
})

let index = new Vue({
	el: "#index",
	data: {
		cards: [
			{title: 'Вспомогательное оборудование', content: []},
			{title: 'Испытательное оборудование', content: []},
			{title: 'Средства измерения', content: []},
			{title: 'Техническое обслуживание', content: []}
		],
		gridData: []
	},
	watch: {
		gridData(){
			this.gridData.filter(f => {this.cards[f.id_type - 1].content.push(f);})
		}
	},
	methods:{
		getToday(){
			axios.get("/equipment/get-today").then( response => (this.gridData = response.data));
		}
	},
	mounted: function(){
		this.getToday();
	}
})