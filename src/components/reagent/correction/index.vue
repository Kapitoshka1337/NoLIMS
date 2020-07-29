<template>
	<sui-grid class="padded">
		<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
		<sui-grid-row v-if="gridData.length > 0">
			<sui-grid-column :width="3">
			<div class="ui fluid card">
				<div class="content">
					<div class="center aligned header">
						<h2>Поиск</h2>
					</div>
				</div>
				<div class="content">
					<div class="ui form">
						<div class="field" v-for="(key, index) in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))" :key="index">
							<label>{{ Object.values(key)[0] }}</label>
							<sui-dropdown fluid multiple search selection v-model="filters[Object.keys(key)]" :options="returnUniq(Object.keys(key))"></sui-dropdown>
						</div>
					</div>
				</div>
			</div>
			</sui-grid-column>
			<sui-grid-column :width="13">
				<div class="ui cards">
					<div class="ui fluid card" v-for="(correct, index) in filteredRows" :key="index">
						<div class="content">
							<span v-bind:class="{
							'ui top attached yellow right label': correct.id_status === 1,
							'ui top attached green right label': correct.id_status === 2,
							'ui top attached red right label': correct.id_status === 3
							}">{{ correct.status }}</span>
							<div class="header">{{ correct.user }} <span class="right floated">{{ today(correct.created_at) }}</span></div>
						</div>
						<div class="content">{{ correct.reason_correct }}</div>
						<div class="content">
							<sui-table compact>
								<sui-table-header>
									<sui-table-row>
										<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index">
											{{ Object.values(column)[0] }}
										</sui-table-header-cell>
									</sui-table-row>
								</sui-table-header>
								<sui-table-body>
									<sui-table-row>
										<sui-table-cell text-align="center" :width="1">{{ correct.id_material }}</sui-table-cell>
										<sui-table-cell :width="1">{{ today(correct.date_usage) }}</sui-table-cell>
										<sui-table-cell text-align="center" :width="2">{{ correct.spent_amount }}</sui-table-cell>
										<sui-table-cell text-align="center" :width="2">{{ correct.corrected_amount }}</sui-table-cell>
									</sui-table-row>
								</sui-table-body>
							</sui-table>
						</div>
						<div class="content">
							<span class="left floated header">{{ today(correct.date_response) }}</span>
							<div v-if="correct.id_status === 1">
								<sui-button size="mini" content="Отклонить"  color="red" floated="right" v-on:click="deny(index)"></sui-button>
								<sui-button size="mini" content="Принять" color="green" floated="right" v-on:click="allow(index)"></sui-button>
							</div>
						</div>
					</div>
				</div>
			</sui-grid-column>
		</sui-grid-row>
	</sui-grid>
</template>

<script>
//import axios from 'axios';
import ArrivalModal from '../modals/arrival_material.vue'

export default {
	components: {
		'arrival-modal': ArrivalModal
	},
	data () {
		return {
			gridColumns: {
                tableColumn: [
					{'id_material': 'Код материала'},
					{'date_usage': 'Дата потр-ия'},
					{'spent_amount': 'Потраченное кол-во'},
					{'correct_amount': 'Исправляемое кол-во'}
				],
                filterColumn: [
                    {'created_at':'Дата ошибки'},
                    {'date_usage':'Дата потребления'}
                ]
			},
			filters: {
                created_at: [],
                date_usage: []
			},
			gridData: [],
			//sortKey: '',
			//sortColumns: Object,
			//currentPage: 1,
			//listPages: [],
			//countPost: 100,
			//isShowModal: false,
            // orderIndex: null,
            // order: {
            //     order: this.or,
            //     materials: []
            // }
			//filterKey: ''
			//selectAllMaterials: false,
			//selectedEquipments: [],
		}
	},
	methods: {
		//showModal(index = null){
        //    // this.orderIndex = index;
        //    this.order.order = this.gridData[index];
        //    axios.get('/api/reagent/corrections/').then(response => (this.order.materials = response.data, this.isShowModal = true)).catch(error => (alert(error)));

        //},
		//hideModal(){
		//	this.isShowModal = false;
		//},
		getCorrections(){
			this.$http.get('/api/reagent/corrections').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
			//fetch("/api/reagent/storage").then(response => (
				//response.json().then(data => (this.gridData = data))
			//)).catch(function(data){alert(data)});
		},
		//sortBy: function (key) {
		//	if(key === 'action') return;
		//	this.sortKey = key;
		//	this.sortColumns[key] = this.sortColumns[key] * -1;
		//},
		//setPages () {
		//	let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
		//	for (let i = 1; i <= numOfPage; i++)
		//		this.listPages.push(i);
		//},
		//paginate (rows) {
		//	let page = this.currentPage;
		//	let curPost = this.countPost;
		//	let from = (page * curPost) - curPost;
		//	let to = ((page * curPost));
		//	return rows.slice(from, to);
		//},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		returnUniq(column){
            let result = [];
            let resa = [];
			for (let str of this.gridData)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
                })
            for (let res of result)
            {
                resa.push({key: res, value: res, text: res});
            }
			return resa;
		},
		allow(index = null){
			let obj = { id_outgo: this.gridData[index].id_outgo, amount: this.gridData[index].corrected_amount};
			this.$http.put("/api/reagent/corrections/allow/" + this.gridData[index].id, obj,{
				headers: {'Content-Type': 'application/json'}})
				.then(response => (this.gridData[index].id_status = 2, this.gridData[index].status = 'Подтверждена', this.gridData[index].date_response = this.dateToday())).catch(error => (alert(error.response.data.message)));
		},
		deny(index = null){
			this.$http.put("/api/reagent/corrections/deny/" + this.gridData[index].id, {
				headers: {'Content-Type': 'application/json'}})
				.then(response => (this.gridData[index].id_status = 3, this.gridData[index].status = 'Отклонена', this.gridData[index].date_response = this.dateToday())).catch(error => (alert(error.response.data.message)));
		},
		dateToday(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
	},
	//watch: {
	//	gridData(){
	//		this.setSortColumn();
	//	},
	//	filteredRows() {
	//		this.listPages = [];
	//		this.setPages();
	//	}
	//},
	computed: {
		filteredRows: function () {
			//let sortKey = this.sortKey;
			//let filterKey = this.filterKey && this.filterKey.toLowerCase();
			//let order = this.sortColumns[sortKey] || 1;
			let rows = this.gridData;
			//if (sortKey)
			//{
			//	rows = rows.slice().sort(function (a, b) {
			//		a = a[sortKey];
			//		b = b[sortKey];
			//		if(a === b) return 0 * order;
			//		else if (a > b) return 1 * order;
			//		else return - 1 * order;
			//	})
			//}
			//if (filterKey)
			//{
			//	rows = rows.filter(function(row)
			//	{
			//		return Object.keys(row).some(function(key)
			//		{
			//			return (String(row[key]).toLowerCase().indexOf(filterKey) > -1);});
			//	});
			//}
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					if(r.archive === 1) return;
					if(r.total === null) r.total = r.amount;
						return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				})
			})
        },
		//paginateRows(){
		//	return this.paginate(this.filteredRows);
		//}
	},
	created(){
		this.getCorrections();
	}
  }
</script>