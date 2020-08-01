<template>
	<sui-grid class="padded">
		<sui-grid-row>
			<sui-grid-column>
				<menu-nav></menu-nav>
			</sui-grid-column>
		</sui-grid-row>
		<sui-grid-row>
			<sui-grid-column>
				<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
				<sui-table selectable compact v-if="gridData.length > 0">
					<sui-table-header>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
									Склад
									<sui-button v-bind:loading="isPrint" color="blue" size="mini"  icon="print" floated="right" v-on:click="printInventory()" v-bind:disabled="!selectedIdLocation"></sui-button>
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
								<sui-form>
									<sui-form-fields fields="two">
										<sui-form-field width="fifteen">
											<sui-input type="text" placeholder="Поиск по КОД / МАТЕРИАЛ" v-model="filterKey"></sui-input>
										</sui-form-field>
										<sui-form-field>
											<sui-dropdown placeholder="Местоположение" search selection :options="dropdownLocations" v-model="selectedIdLocation"></sui-dropdown>
										</sui-form-field>
									</sui-form-fields>
								</sui-form>
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
								{{ Object.values(column)[0] }}
								<i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
							</sui-table-header-cell>
						</sui-table-row>
					</sui-table-header>
					<sui-table-body>
						<sui-table-row v-for="(material, index) in paginateRows" :key="index">
							<sui-table-cell collapsing>{{ material.material_id }}</sui-table-cell>
							<sui-table-cell :width="1">{{ today(material.date_order) }}</sui-table-cell>
							<sui-table-cell collapsing>{{ material.location }}</sui-table-cell>
							<sui-table-cell >{{ material.material }}</sui-table-cell>
							<sui-table-cell collapsing>{{ material.measure }}</sui-table-cell>
							<sui-table-cell collapsing
							v-bind:class="{success: Math.round(material.total) > Math.round((material.amount / 10) * (50 / 10)), caution: Math.round(material.total) <= Math.round((material.amount / 10) * (50 / 10)), danger: Math.round(material.total) <= Math.round((material.amount / 10) * (36 / 10))}"
							>{{ material.total }} / {{ material.amount }}</sui-table-cell>
							<sui-table-cell :width="2"
							v-bind:class="{success: colorShelfLife(material.shelf_life) > 62, caution: colorShelfLife(material.shelf_life) <= 62, danger: colorShelfLife(material.shelf_life) <= 31}"
							>{{ today(material.shelf_life)  }} <strong> ({{ colorShelfLife(material.shelf_life)  }})</strong> </sui-table-cell>
							<sui-table-cell collapsing>
								<sui-button v-bind:loading="isToArchive" color="blue" size="mini" icon="archive" v-if="material.total <= 0 || colorShelfLife(material.shelf_life) <= 0" v-on:click="moveToArchive(index)"></sui-button>
								<sui-button color="red" size="mini" icon="tint" v-on:click="showModal(index)" v-if="!isWarehouse"></sui-button>
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
										<input type="text" v-bind:value="currentPage">
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
	</sui-grid>
</template>

<script>
import ExpensesModal from '../modals/expenses.vue';
import fs from 'file-saver';

export default {
	components: {
		'expenses-modal': ExpensesModal
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
					{'shelf_life':'Срок хранения'},
					{'action':''}
				],
				filterColumn: [
					{'material_id':'Код'},
					{'type':'Тип'},
					{'material':'Материал'},
					{'date_order':'Дата поступления'},
					{'shelf_life':'Срок хранения'},
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
			filterKey: '',
			selectedIdLocation: null,
			isPrint: false,
			isToArchive: false
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
			this.$http.get('/api/reagent/storage').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
		moveToArchive(index){
			this.isToArchive = !this.isToArchive;
			this.$http.post("/api/reagent/storage/archive", JSON.stringify({id: this.gridData[index].arrival_material_id}), {
				headers: {'Content-Type': 'application/json'}}).then( response => (this.gridData[index].archive = 1), this.isToArchive = !this.isToArchive)
				.catch(error => (alert(error), this.isToArchive = !this.isToArchive));
		},
		printInventory(){
			this.isPrint = !this.isPrint;
			this.$http.get('/api/reagent/storage/print/' + this.selectedIdLocation, {responseType: 'blob'})
			.then(response => {
				const file = new Blob([response.data], {type: 'application/pdf'});
				// const fileURL = URL.createObjectURL(file);
				// console.log(fileURL);
				fs.saveAs(file, 'Опись расходных материалов ' + this.todays + '.pdf');
				this.isPrint = !this.isPrint;
			})
			.catch(error => (alert(error), this.isPrint = !this.isPrint));	
		}
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
		isWarehouse(){
			return this.$store.getters.isRoles === 3 ? true : false
		},
		todays(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
		filteredRows: function () {
			let sortKey = this.sortKey;
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
		},
		dropdownLocations(){
			let result = [];
			let resa = [];
			for (let str of this.gridData)
			{
				let obj = {key: str['id_location'], value: str['id_location'], text: str['location']};
				if (!result.includes(obj, 0))
					result.push(obj);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
				});
			}
			return result;
		},
	},
	created(){
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