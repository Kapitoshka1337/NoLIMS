<template>
	<div class="padded" is="sui-grid">
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
									История потребления
									<!-- <sui-button color="green" size="mini" icon="undo" floated="right" v-on:click="clearFilter()"></i></sui-button> -->
									<sui-button color="teal" size="mini" icon="filter" floated="right" v-on:click="toggle()"></sui-button>
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
								<sui-form>
									<sui-form-field>
										<sui-input type="text" placeholder="Поиск по КОД / МАТЕРИАЛ / ПОТРАЧЕНО" v-model="filterKey"></sui-input>
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
						<sui-table-row v-for="(material, index) in paginateRows" :key="index">
							<td class="collapsing">{{ material.id }}</td>
							<td class="collapsing">{{ material.material_id }}</td>
							<td class="collapsing">{{ material.date_order }}</td>
							<td>{{ material.material }}</td>
							<td class="collapsing">{{ material.order_measure }}</td>
							<td class="collapsing">{{ material.amount_outgo }}</td>
							<td class="collapsing">{{ material.user }}</td>
							<td class="one wide">{{ material.date_usage }}</td>
							<td class="one wide">{{ material.date_record }}</td>
							<td class="collapsing">{{ material.moving_type }}</td>
							<td class="collapsing">
								<sui-icon v-on:click="showModal(index)" v-if="material.moving_type === 'Потребление'" color="green" name="exclamation circle" size="large"></sui-icon>
								<sui-icon v-if="material.moving_type === 'Продление'" color="yellow" name="exclamation triangle" size="large"></sui-icon>
								<sui-icon v-if="material.moving_type === 'Перевод'" color="blue" name="info" size="large"></sui-icon>							</td>
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
										<input type="text" :value="currentPage">
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
        <sui-modal v-model="open">
            <sui-modal-header>Поиск</sui-modal-header>
            <sui-modal-content>
				<sui-form>
					<sui-form-field v-for="key in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))">
						<label>{{ Object.values(key)[0] }}</label>
						<sui-dropdown v-bind:placeholder="Object.values(key)[0]" search selection multiple :options="returnUniq(Object.keys(key))" v-model="filters[Object.keys(key)]"></sui-dropdown>
					</sui-form-field>
				</sui-form>
            </sui-modal-content>
        </sui-modal>
	</div>
</template>

<script>
import CorrectionModal from '../modals/correction.vue';
import unit from '../unit.js';

export default {
	components: {
		'correction-modal': CorrectionModal
	},
	data () {
		return {
            gridColumns: {
                tableColumn: [
                    {'id':'№'},
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
                    {'date_order':'Дата поступления'},
                    {'type':'Тип'},
                    {'material':'Материал'},
                    {'date_usage':'Дата потребления'},
                    {'user':'Сотрудник'},
                    {'moving_type':'Операция'}
                ]
            },
            gridData: [],
            filters: {
                material_id: [],
                type: [],
                material: [],
                date_order: [],
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
			filterKey: '',
			open: false
		}
	},
	methods: {
		showModal(index = null){
			this.materialIndex = index;
			if(this.gridData[index].archive)
			{
				alert('Исправление архивного материала запрещено!');
				return false;
			}
			this.isShowModal = true;
		},
		hideModal(){
			this.isShowModal = false;
		},
		successExpenses(expenseAmount){
			this.isShowModal = false;
		},
		getExpenses(){
			this.$http.get('/api/reagent/expenses').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
				});
			for (let res of result)
			{
				resa.push({key: res, value: res, text: res});
			}
			return resa;
		},
		toggle() {
			this.open = !this.open;
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
		idDep(){
			return this.$store.getters.idDepartment;
		},
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
					return String(row['material_id']).toLowerCase().indexOf(filterKey) > -1
					|| String(row['material']).toLowerCase().indexOf(filterKey) > -1
					|| String(row['date_usage']).toLowerCase().indexOf(filterKey) > -1;
				});
			}
			return rows.filter(r =>
			{
				if(this.idDep != 5)
				{
					r.amount_outgo = this.$convert(r.amount_outgo).param(r.density).measure(unit[r.id_order_measure]).to(unit[r.id_measure]);
					r.order_measure = r.measure;
				}
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
	created(){
		this.getExpenses();
	}
  }
</script>