<template>
	<sui-grid class="padded">
		<sui-grid-row>
			<sui-grid-column>
				<sui-menu>
					<router-link to="/reagent/arrivals" is="sui-menu-item">Поступления</router-link>
					<router-link to="/reagent/expenses" is="sui-menu-item">Потребление</router-link>
					<router-link to="#" is="sui-menu-item">Списание</router-link>
					<router-link to="#" is="sui-dropdown" item simple text="Передача">
						<sui-dropdown-menu>
							<router-link to="/reagent/moving" is="sui-dropdown-item" item>Запрос</router-link>
							<router-link to="/reagent/moving/history" is="sui-dropdown-item" item>История</router-link>
						</sui-dropdown-menu>
					</router-link>
					<router-link to="/reagent/locations" is="sui-menu-item" floated="right">Местоположение</router-link>
				</sui-menu>
			</sui-grid-column>
		</sui-grid-row>
		<sui-grid-row>
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
			<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
			<sui-grid-column :width="13" v-if="gridData.length > 0">
				<div class="ui cards">
					<div class="ui fluid card" v-for="(moving, index) in filteredRows" :key="index">
						<div class="content">
							<span v-bind:class="{
							'ui top attached yellow right label': moving.status === 'Рассмотрение',
							'ui top attached green right label': moving.status === 'Подтверждена',
							'ui top attached red right label': moving.status === 'Отклонена'
							}">{{ moving.status }}</span>
							<div class="header">{{ moving.dep_from }} ({{ moving.user }}) -> {{ moving.dep_to }}</div>
							<div class="meta">
								<span class="category">Запроc/Ответ: {{ today(moving.created_at) }} / {{ today(moving.date_moving) }}</span>
							</div>
						</div>
						<div class="content">
							<sui-button size="mini" content="Запрашиваемые материалы" color="yellow" floated="right" v-on:click="showModal(index)"></sui-button>
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
                tableColumn: [ ],
                filterColumn: []
			},
			filters: {
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
                order: this.or,
                materials: []
            }
			//filterKey: ''
			//selectAllMaterials: false,
			//selectedEquipments: [],
		}
	},
	methods: {
		showModal(index = null){
            // this.orderIndex = index;
            this.order.order = this.gridData[index];
            this.$http.get('/api/reagent/moving/' + this.gridData[index].id + "/materials").then(response => (this.order.materials = response.data, this.isShowModal = true)).catch(error => (alert(error)));
            //this.isShowModal = true;
        },
		hideModal(){
			this.isShowModal = false;
		},
		//successExpenses(expenseAmount){
		//	this.isShowModal = false;
		//	this.gridData[this.orderIndex].total = this.gridData[this.orderIndex].total - expenseAmount;
		//},
		getMovings(){
			this.$http.get('/api/reagent/moving').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
		this.getMovings();
	}
  }
</script>