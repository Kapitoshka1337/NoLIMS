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
									История потребления
									<sui-button class="ui right floated mini icon green button" v-on:click="clearFilter()"><i class="icon undo"></i></sui-button>
									<button class="ui right floated mini icon teal button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
								<sui-form>
									<sui-form-field>
										<sui-input type="text" placeholder="Поиск" v-model="filterKey"></sui-input>
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
							<td class="collapsing">{{ material.material_id }}</td>
							<td class="collapsing">{{ material.date_order }}</td>
							<!-- <td class="two wide">{{ material.type }}</td> -->
							<td>{{ material.material }}</td>
							<td class="collapsing">{{ material.measure }}</td>
							<td class="collapsing">{{ material.amount_outgo }}</td>
							<td class="collapsing">{{ material.user }}</td>
							<td class="one wide">{{ material.date_usage }}</td>
							<td class="one wide">{{ material.date_record }}</td>
							<td class="collapsing">{{ material.moving_type }}</td>
							<td class="collapsing">
								<button class="ui red icon mini button" v-if="material.moving_type === 'Потребление'" v-on:click="showModal(index)"><i class="icon exclamation"></i></button>
							</td>
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
				<correction-modal :open="isShowModal" @close="hideModal" @success="successExpenses" :material="paginateRows[materialIndex]"></correction-modal>
			</sui-grid-column>
		</sui-grid-row>
	</div>
</template>

<script>
import CorrectionModal from '../modals/correction.vue'
import axios from 'axios';

export default {
	components: {
		'correction-modal': CorrectionModal
	},
	data () {
		return {
            gridColumns: {
                tableColumn: [
                    {'material_id':'Код'},
                    {'date_order':'Дата пост.'},
                    {'material':'Материал'},
                    {'measure':'Ед.изм'},
                    {'amount_outgo':'Кол.'},
                    {'user':'Сотрудник'},
                    {'date_usage':'Потрачено'},
                    {'date_record':'Добавлено'},
                    {'moving_type':'Операция'},
                    {'action':''}
                ],
                filterColumn: [
                    {'material_id':'Код материала'},
                    {'date_create':'Дата изготовления'},
                    {'type':'Тип'},
                    {'material':'Материал'},
                    {'date_usage':'Дата потребления'},
                    {'user':'Сотрудник'},
                    {'moving_type':'Операция'},
                ]
            },
            gridData: [],
            filters: {
                material_id: [],
                type: [],
                material: [],
                date_create: [],
                date_usage: [],
                user: [],
                moving_type: []
            },
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
		successExpenses(expenseAmount){
			this.isShowModal = false;
			// this.gridData[this.materialIndex].total = this.gridData[this.materialIndex].total - expenseAmount;
		},
		getExpenses(){
			axios.get('/api/reagent/expenses').then(response => (this.gridData = response.data)).catch(error => (alert(error)));
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
		filteredRows: function () {
			let sortKey = this.sortKey;
			let filterKey = this.filterKey && this.filterKey.toLowerCase();
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
					return Object.keys(row).some(function(key)
					{
						return (String(row[key]).toLowerCase().indexOf(filterKey) > -1);});
				});
			}
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
						return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				})
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		}
	},
	mounted: function(){
		this.getExpenses();
	}
  }
</script>