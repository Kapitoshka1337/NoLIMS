Vue.config.devtools = true;
Vue.component('equipment-dashboard', {
	template: '#equipment-dashboard',
	props: {
		rows: Object,
		// columns: Array,
		countPost: Number
	},
	data: function () {
		return {
			currentPage: 1,
			listPages: []
		}
	},
	methods: {
		setPages() {
			let numOfPage = Math.ceil(this.rows.content.length / this.countPost);
			for (let i = 1; i <= numOfPage; i++)
				this.listPages.push(i);
		},
		paginate(rows) {
			let page = this.currentPage;
			let curPost = this.countPost;
			let from = (page * curPost) - curPost;
			let to = ((page * curPost));
			return rows.slice(from, to);
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		printTable(id_type){
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
	watch: {
		filteredRows() {
			this.listPages = [];
			this.setPages();
		}
	},
	computed: {
		filteredRows(){
			let rows = this.rows.content;
			return this.paginate(rows);
		}
	}
})

let index = new Vue({
	el: "#index",
	data: {
		cards: [
			{
				title: 'Вспомогательное оборудование',
				gridColumns: {
					tableColumn: [
						{'card_number':'Номер'},
						{'equipment':'Оборудование'},
						{'date_next_check':'Проверка'},
						{'action': ''},
						{'action': ''}
					]
				},
				content: []
			},
			{
				title: 'Испытательное оборудование',
				gridColumns: {
					tableColumn: [
						{'card_number':'Номер'},
						{'equipment':'Оборудование'},
						{'date_next_check':'Проверка'},
						{'action': ''},
						{'action': ''}
					]
				},
				content: []
			},
			{
				title: 'Средство измерений',
				gridColumns: {
					tableColumn: [
						{'card_number':'Номер'},
						{'equipment':'Оборудование'},
						{'date_next_check':'Проверка'},
						{'action': ''},
						{'action': ''}
					]
				},
				content: []
			},
			{
				title: 'Техническое обслуживание',
				gridColumns: {
					tableColumn: [
						{'card_number':'Номер'},
						{'equipment':'Оборудование'},
						{'date_next_check':'Проверка'},
						{'action': ''},
						{'action': ''}
					]
				},
				content: []
			},
		],
		gridData: [],
		countPost: 10
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