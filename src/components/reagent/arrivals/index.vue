<template>
	<sui-grid class="padded">
		<sui-grid-row>
			<sui-grid-column>
				<menu-nav></menu-nav>
			</sui-grid-column>
		</sui-grid-row>
		<sui-grid-row>
			<sui-grid-column :width="3">
			<div class="ui fluid card">
				<div class="content">
					<div class="ui bottom attached buttons">
						<router-link to="/reagent/arrivals/create" class="ui yellow button">Новое</router-link>
					</div>
				</div>
			</div>
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
			<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
			<sui-grid-column :width="13" v-if="gridData.length > 0">
				<div class="ui cards">
					<div class="ui fluid card" v-for="(order, index) in filteredRows" :key="index">
						<div class="content">
							<span v-bind:class="{
							'ui top attached green right label': order.moving_type === 'Поступление',
							'ui top attached blue right label': order.moving_type === 'Перевод'
							}">{{ order.moving_type }}</span>
							<div class="header">Заказ № {{ order.num_order }} от {{ today(order.date_order) }}</div>
							<div class="meta">
								<span class="category">{{ order.department }}</span>
							</div>
						</div>
						<div class="content">
							<sui-button v-bind:loading="loading" size="mini" content="Поступившие материалы" color="yellow" floated="right" v-on:click="showModal(index)"></sui-button>
						</div>
					</div>
				</div>
				<arrival-modal :open="isShowModal" @close="hideModal" :order="order"></arrival-modal>
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
                    {'num_order': 'Номер заказа'},
                    {'date_order': 'Дата заказа'},
                    {'moving_type': 'Вид поступления'},
                    {'action': ''},
                ],
                filterColumn: [
                    {'num_order':'Номер заказа'},
                    {'date_order':'Дата заказа'},
                    {'moving_type':'Вид поступления'}
                ]
			},
			filters: {
                num_order: [],
                date_order: [],
                moving_type: []
			},
			gridData: [],
			//sortKey: '',
			//sortColumns: Object,
			//currentPage: 1,
			//listPages: [],
			//countPost: 100,
			isShowModal: false,
            // orderIndex: null,
            order: {
                order: null,
                materials: []
			},
			loading: false
			//filterKey: ''
			//selectAllMaterials: false,
			//selectedEquipments: [],
		}
	},
	methods: {
		showModal(index = null){
            // this.orderIndex = index;
			this.order.order = this.gridData[index];
			this.loading = !this.loading;
            this.$http.get('http://laravel/api/reagent/arrivals/' + this.gridData[index].id + "/materials").then(response => (this.order.materials = response.data, this.isShowModal = true, this.loading = !this.loading)).catch(error => (alert(error), this.loading = !this.loading));
            //this.isShowModal = true;
        },
		hideModal(){
			this.isShowModal = false;
		},
		//successExpenses(expenseAmount){
		//	this.isShowModal = false;
		//	this.gridData[this.orderIndex].total = this.gridData[this.orderIndex].total - expenseAmount;
		//},
		getArrivals(){
			this.$http.get('http://laravel/api/reagent/arrivals').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
		//setSortColumn(){
		//	let sortColumns = {};
		//	this.gridColumns.tableColumn.forEach(function (key){
		//		Object.keys(key).some(function(row){
		//			if (row !== 'action')
		//				sortColumns[row] = 1;
		//		});
		//	});
		//	this.sortColumns = sortColumns;
		//},
		//ПЕРЕДЕЛАТЬ
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
		this.getArrivals();
	}
  }
//</script>


//export default {
//    components: {
//        'axios': axios,
//        'arrival-modal': ArrivalModal
//    },
//    data(){
//        return {
//            gridColumns: {
//                tableColumn: [
//                ],
//                filterColumn: [
//                    {'num_order':'Номер заказа'},
//                    {'date_order':'Дата заказа'},
//                    {'moving_type':'Вид поступления'}
//                ]
//            },
//            gridData: [],
//            filters: {
//                date_order: [],
//                moving_type: [],
//                num_order: []
//            },
//            isShowModal: false,
//            orderIndex: null
//        }
//    },
//	computed: {
//		filteredRows: function () {
//			let rows = this.gridData;
//			return rows.filter(r =>
//			{
//				return Object.keys(this.filters).every(f =>
//				{
//					return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
//				})
//			})
//		}
//	},
//	methods: {
//		getArrivals(){
//			axios.get("/api/reagent/arrivals").then( response => (this.gridData = response.data));
//        },
//		today(date){
//			if(date === null) return;
//			let today = new Date(date);
//			return today.toLocaleString().split(',')[0];
//        },
//        //ПЕРЕДЕЛАТЬ
//		returnUniq(column){
//            let result = [];
//            let resa = [];
//			for (let str of this.gridData)
//				if (!result.includes(str[column]))
//					result.push(str[column]);
//				result = result.slice().sort(function (a, b){
//					if(a === b) return 0 ;
//					else if (a > b) return 1;
//					else return - 1;
//                })
//            for (let res of result)
//            {
//                resa.push({key: res, value: res, text: res});
//            }
//			return resa;
//        },
//		showModal(index = null){
//            this.orderIndex = index;
//			this.isShowModal = true;
//        },
//		hideModal(){
//			this.isShowModal = false;
//		},
//    },
//    mounted(){
//        this.getArrivals();
//    }
//}
</script>