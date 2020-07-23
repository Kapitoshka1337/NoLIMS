<template>
	<div class="padded" is="sui-grid">
		<sui-grid-row>
			<sui-grid-column>
				<!-- <menu></menu> -->
				<sui-menu :width="3">
					<router-link to="/reagent/arrivals" is="sui-menu-item">Поступления</router-link>
					<router-link to="/reagent/expenses" is="sui-menu-item">Потребление</router-link>
					<router-link to="#" is="sui-menu-item">Списание</router-link>
					<router-link to="#" is="sui-menu-item">
						<sui-dropdown text="Передача">
							<sui-dropdown-menu>
								<sui-dropdown-item>Запрос</sui-dropdown-item>
								<sui-dropdown-item>История</sui-dropdown-item>
							</sui-dropdown-menu>
						</sui-dropdown>
					</router-link>
					<router-link to="#" is="sui-menu-item" floated="right">Местоположение</router-link>
				</sui-menu>
				<!-- <router-view></router-view> -->
				<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
				<sui-table selectable compact v-if="gridData.length > 0">
					<sui-table-header>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
									Склад
									<!--<sui-button class="ui right floated mini icon green button" v-on:click="clearFilter()"><i class="icon undo"></i></sui-button>-->
									<!--<button class="ui right floated mini icon teal button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>-->
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
								<sui-form>
									<sui-form-field>
										<sui-input type="text" placeholder="Поиск по КОДУ и МАТЕРИАЛУ" v-model="filterKey"></sui-input>
									</sui-form-field>
								</sui-form>
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<!--<sui-table-header-cell><sui-checkbox label="" /></sui-table-header-cell>-->
							<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
								{{ Object.values(column)[0] }}
								<i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
							</sui-table-header-cell>
						</sui-table-row>
					</sui-table-header>
					<sui-table-body>
						<sui-table-row v-for="(material, index) in paginateRows" :key="index">
							<!--<sui-table-cell collapsing><sui-checkbox label="" /></sui-table-cell>-->
							<sui-table-cell collapsing>{{ material.material_id }}</sui-table-cell>
							<sui-table-cell :width="1">{{ today(material.date_order) }}</sui-table-cell>
							<sui-table-cell collapsing>{{ material.location }}</sui-table-cell>
							<sui-table-cell >{{ material.material }}</sui-table-cell>
							<sui-table-cell collapsing>{{ material.measure }}</sui-table-cell>
							<sui-table-cell collapsing
							v-bind:class="{success: Math.round(material.total) > Math.round((material.amount / 10) * (50 / 10)), caution: Math.round(material.total) <= Math.round((material.amount / 10) * (50 / 10)), danger: Math.round(material.total) <= Math.round((material.amount / 10) * (36 / 10))}"
							>{{ material.total }} / {{ material.amount }}</sui-table-cell>
							<sui-table-cell collapsing
							v-bind:class="{success: colorShelfLife(material.shelf_life) > 62, caution: colorShelfLife(material.shelf_life) <= 62, danger: colorShelfLife(material.shelf_life) <= 31}"
							>{{ today(material.shelf_life)  }} <strong> ({{ colorShelfLife(material.shelf_life)  }})</strong> </sui-table-cell>
							<sui-table-cell collapsing>
								<button class="ui icon mini blue button" v-if="material.total <= 0 || colorShelfLife(material.shelf_life) <= 1" v-on:click="moveToArchive(index)"><i class="icon archive"></i></button>
								<button class="ui icon mini green button" v-if="material.passport != null" v-on:click="showPassport(material.arrival_material_id)"><i class="icon eye"></i></button>
								<!-- <button class="ui icon mini yellow button" v-if="material.passport === null" v-on:click="showModal('AppendPassport', material.arrival_material_id)"><i class="icon plus"></i></button> -->
								<button class="ui icon mini red button" v-on:click="showModal(index)"><i class="icon tint"></i></button>
							</sui-table-cell>
						</sui-table-row>
					</sui-table-body>
					<sui-table-footer>
						<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
							<sui-label >
								Страница {{ currentPage }} из {{ listPages.length }}
							</sui-label>
							<div class="ui icon basic right floated small buttons">
								<sui-button v-on:click="currentPage = listPages[0]"><i class="icon angle double left"></i></sui-button>
								<sui-button class="ui button" v-on:click="currentPage--" v-if="currentPage != 1"><i class="icon angle left"></i></sui-button>
								<sui-form>
									<sui-form-field>
										<input is="sui-input" type="text" :value="currentPage">
									</sui-form-field>
								</sui-form>
								<sui-button class="ui button" v-on:click="currentPage++" v-if="currentPage < listPages.length"><i class="icon angle right"></i></sui-button>
								<sui-button class="ui button" v-on:click="currentPage = listPages.length"><i class="icon angle double right"></i></sui-button>
							</div>
						</sui-table-header-cell>
					</sui-table-footer>
				</sui-table>
				<expenses-modal :open="isShowModal" @close="hideModal" @success="successExpenses" :material="paginateRows[materialIndex]"></expenses-modal>
			</sui-grid-column>
		</sui-grid-row>
	</div>
</template>

<script>
import ExpensesModal from '../modals/expenses.vue';
//import Menu from '../menu.vue';
import axios from 'axios';

export default {
	components: {
		'expenses-modal': ExpensesModal,
		//'menu': Menu
	},
	data () {
		return {
			gridColumns: {
				tableColumn: [
					{'material_id':'Код'},
					{'date_order':'Дата пост.'},
					{'location':'Местоположение'},
					{'material':'Материал'},
					{'measure':'Ед.изм'},
					{'total':'Количество'},
					{'shelf_life':'Годен до'},
					{'action':''}
				],
				filterColumn: [
					{'material_id':'Код'},
					{'type':'Тип'},
					{'material':'Материал'},
					{'date_order':'Дата поступления'},
					{'shelf_life':'Годен до'},
					{'location':'Местоположение'},
				]
			},
			filters: {
				number: [],
				department: [],
				type: [],
				equipment: [],
			},
			seartColumn: [
				{'material_id': 'material_id'}
			],
			gridData: [],
			sortKey: '',
			sortColumns: Object,
			currentPage: 1,
			listPages: [],
			countPost: 100,
			isShowModal: false,
			materialIndex: null,
			filterKey: ''
			//selectAllMaterials: false,
			//selectedEquipments: [],
		}
	},
	methods: {
		showModal(index = null){
			this.materialIndex = index;
			this.isShowModal = true;
		},
		hideModal(){
			this.isShowModal = false;
		},
		successExpenses(expenseAmount, renewaDate){
			this.isShowModal = false;
			this.gridData[this.materialIndex].total = this.gridData[this.materialIndex].total - expenseAmount;
			if(renewaDate)
				this.gridData[this.materialIndex].shelf_life = renewaDate;
		},
		getStorage(){
			axios.get('/api/reagent/storage').then(response => (this.gridData = response.data)).catch(error => (alert(error)));
			//fetch("/api/reagent/storage").then(response => (
				//response.json().then(data => (this.gridData = data))
			//)).catch(function(data){alert(data)});
		},
		sortBy: function (key) {
			if(key === 'action') return;
			this.sortKey = key;
			this.sortColumns[key] = this.sortColumns[key] * -1;
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
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		setSortColumn(){
			let sortColumns = {};
			this.gridColumns.tableColumn.forEach(function (key){
				Object.keys(key).some(function(row){
					if (row !== 'action')
						sortColumns[row] = 1;
				});
			});
			this.sortColumns = sortColumns;
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		//showPassport(id){
		//	axios.get("/reagent/get-passport?id=" + id).then( response => (window.open(response.data)));
		//},
		moveToArchive(index){
			axios.post("/api/reagent/storage/archive", JSON.stringify({id: this.gridData[index].arrival_material_id}), {
				headers: {'Content-Type': 'application/json'}}).then( response => (this.gridData[index].archive = 1));
		},
	},
	watch: {
		gridData(){
			this.setSortColumn();
		},
		filteredRows() {
			this.listPages = [];
			this.setPages();
		}
	},
	computed: {
		filteredRows: function () {
			let sortKey = this.sortKey;
			//let filterKey = this.filterKey && this.filterKey.toLowerCase();
			let filterKey = this.filterKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = this.gridData;
			if (sortKey)
			{
				rows = rows.slice().sort(function (a, b) {
					a = a[sortKey];
					b = b[sortKey];
					if(a === b) return 0 * order;
					else if (a > b) return 1 * order;
					else return - 1 * order;
				})
			}
			if (filterKey)
			{
				rows = rows.filter(function(row)
				{
					return String(row['material_id']).toLowerCase().indexOf(filterKey) > -1 || String(row['material']).toLowerCase().indexOf(filterKey) > -1;
					//return Object.keys(row).some(function(key)
					//{
						//return (String(row[key]).toLowerCase().indexOf(filterKey) > -1);
					//});
				});
			}
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
		paginateRows(){
			return this.paginate(this.filteredRows);
		}
	},
	mounted: function(){
		this.getStorage();
	}
  }
</script>

<style scoped>
	.success {
		background-color: #ddffdd;
	}
	.caution {
		background-color: #ffffcc;
	}
	.danger {
		background-color: #ffdddd;
	}
</style>