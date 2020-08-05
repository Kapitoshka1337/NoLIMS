<template>
	<div class="padded" is="sui-grid">
		<sui-grid-row>
			<sui-grid-column>
				<menu-nav></menu-nav>
			</sui-grid-column>
		</sui-grid-row>
		<sui-grid-row>
			<sui-grid-column>
				<!--<sui-menu :width="3">
					<router-link to="/reagent/arrivals" is="sui-menu-item">Поступления</router-link>
					<router-link to="/reagent/expenses" is="sui-menu-item">Потребление</router-link>
					<router-link to="#" is="sui-menu-item">Списание</router-link>
					<router-link to="#" is="sui-dropdown" item simple text="Передача">
						<sui-dropdown-menu>
							<router-link to="/reagent/moving" is="sui-dropdown-item" item>Запрос</router-link>
							<router-link to="/reagent/moving/history" is="sui-dropdown-item" item>История</router-link>						</sui-dropdown-menu>
					</router-link>
					<router-link to="/reagent/locations" is="sui-menu-item" floated="right">Местоположение</router-link>
				</sui-menu>-->
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
	</div>
</template>

<script>
import CorrectionModal from '../modals/correction.vue';

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
			this.$http.get('http://laravel/api/reagent/expenses').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
					return String(row['material_id']).toLowerCase().indexOf(filterKey) > -1
					|| String(row['material']).toLowerCase().indexOf(filterKey) > -1
					|| String(row['date_usage']).toLowerCase().indexOf(filterKey) > -1;
				});
//var app = new Vue({
//  el: '#app',
//  data: {
//    keyword: '',
//    samsungList: []
//  },
//  computed: {
//    samsungFilteredList() {
//      return this.samsungList.filter((samsung) => {
//        return this.keyword.toLowerCase().split(' ').every(v => samsung.title.toLowerCase().includes(v));
//      });
//    }
//  }
//});
			}
			return rows.filter(r =>
			{
				//кг -> см3
				if((r.id_measure === 6) && (this.$store.getters.idDepartment != 5 || this.$store.getters.idDepartment != 15))
				{
					r.amount_outgo = Math.round((r.amount_outgo / r.density) * 1000);
					r.order_measure = r.measure;
				}
				//кг -> г
				if((r.id_measure === 2) && (this.$store.getters.idDepartment != 5 || this.$store.getters.idDepartment != 15))
				{
					r.amount_outgo = Math.round(r.amount_outgo * 1000);
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