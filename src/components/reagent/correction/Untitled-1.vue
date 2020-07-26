<template>
	<div class="padded" is="sui-grid">
		<sui-grid-row>
			<sui-grid-column>
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
					<router-link to="/reagent/location" is="sui-menu-item">Местоположение</router-link>
				</sui-menu>
				<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
				<sui-table selectable compact v-if="gridData.length > 0">
					<sui-table-header>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
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
							<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
								{{ Object.values(column)[0] }}
								<i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
							</sui-table-header-cell>
						</sui-table-row>
					</sui-table-header>
					<sui-table-body>
						<sui-table-row v-for="(correct, index) in paginateRows" :key="index">
							<sui-table-cell collapsing>{{ correct.id }}</sui-table-cell>
							<sui-table-cell collapsing>{{ correct.user }}</sui-table-cell>
							<sui-table-cell collapsing>{{ today(correct.created_at) }}</sui-table-cell>
							<sui-table-cell collapsing>{{ today(correct.date_usage) }}</sui-table-cell>
							<sui-table-cell :width="4">{{ correct.reason_correct }}</sui-table-cell>
							<sui-table-cell text-align="center" :width="2">{{ correct.spent_amount }}</sui-table-cell>
							<sui-table-cell text-align="center" :width="2">{{ correct.corrected_amount }}</sui-table-cell>
							<sui-table-cell>{{ correct.status }}</sui-table-cell>
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
	</div>
</template>

<script>
import ExpensesModal from '../modals/expenses.vue';
import axios from 'axios';

export default {
	components: {
		'expenses-modal': ExpensesModal,
	},
	data () {
		return {
			gridColumns: {
				tableColumn: [
					{'id':'№'},
					{'user':'Сотрудник'},
					{'created_at':'Дата'},
					{'date_usage':'Дата потр.'},
					{'reason_correct':'Причина'},
					{'spent_amount':'Потр. кол-во'},
					{'corrected_amount':'Испр. кол-во'},
					{'status':'Статус'},
					{'action':''}
				],
				filterColumn: [				]
			},
			filters: {},
			gridData: [],
			sortKey: '',
			sortColumns: Object,
			currentPage: 1,
			listPages: [],
			countPost: 100,
			isShowModal: false,
			materialIndex: null,
			filterKey: ''
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
		getCorrections(){
			axios.get('/api/reagent/corrections').then(response => (this.gridData = response.data)).catch(error => (alert(error)));
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
		}
	},
	mounted: function(){
		this.getCorrections();
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