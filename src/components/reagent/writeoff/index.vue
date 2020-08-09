<template>
	<sui-grid class="padded">
		<sui-grid-row>
			<sui-grid-column>
				<menu-nav></menu-nav>
			</sui-grid-column>
		</sui-grid-row>
		<sui-grid-row>
<sui-grid-column>
				<!--<sui-loader centered v-bind:active="gridData.length <= 0" inline/>-->
				<sui-table selectable compact>
					<sui-table-header>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
									Расход за период
									<sui-button color="blue" size="mini" floated="right" content="Период" @click.native="toggle"></sui-button>
							</sui-table-header-cell>
						</sui-table-row>
						<!--<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
								<sui-form>
									<sui-form-fields fields="two">
										<sui-form-field>
											<sui-input type="date"></sui-input>
										</sui-form-field>
										<sui-form-field>
											<sui-input type="date"></sui-input>
										</sui-form-field>
										<sui-button color="green" icon="check"></sui-button>
									</sui-form-fields>
								</sui-form>
							</sui-table-header-cell>							
						</sui-table-row>-->
						<!--<sui-table-row>
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
						</sui-table-row>-->
						<sui-table-row>
							<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
								{{ Object.values(column)[0] }}
								<i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
							</sui-table-header-cell>
						</sui-table-row>
					</sui-table-header>
					<sui-table-body>
						<sui-table-row v-for="(material, index) in paginateRows" :key="index">
							<sui-table-cell>{{ material.id_material }}</sui-table-cell>
							<sui-table-cell>{{ today(material.date_order) }}</sui-table-cell>
							<sui-table-cell>{{ material.material }} ({{material.density}})</sui-table-cell>
							<sui-table-cell>{{ material.packing_name }}</sui-table-cell>
							<sui-table-cell>{{ material.order_measure }}</sui-table-cell>
							<sui-table-cell>{{ material.total }} / {{ material.amount }}</sui-table-cell>
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
			</sui-grid-column>
		</sui-grid-row>
        <sui-modal v-model="open">
            <sui-modal-header>Выбор периода</sui-modal-header>
            <sui-modal-content>
				<sui-form>
					<sui-form-fields fields="two">
						<sui-form-field>
							<label>Начало</label>
							<sui-input type="date" v-model="period.start"></sui-input>
						</sui-form-field>
						<sui-form-field>
							<label>Конец</label>
							<sui-input type="date" v-model="period.end"></sui-input>
						</sui-form-field>
					</sui-form-fields>
				</sui-form>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button v-bind:loading="loading" positive @click.native="submitPeriod()" content="ОК"></sui-button>
            </sui-modal-actions>
        </sui-modal>
	</sui-grid>
</template>

<script>
import unit from '../unit.js';

export default {
	data () {
		return {
			gridColumns: {
				tableColumn: [
					{'material_id':'Код'},
					{'date_order':'Дата пост.'},
					{'material':'Материал'},
					{'material':'Наименование в накладной'},
					{'measure':'Ед.изм'},
					{'total':'Потр./Ост.'}
				],
				filterColumn: []
			},
			filters: {},
			gridData: [],
			sortKey: '',
			sortColumns: Object,
			currentPage: 1,
			listPages: [],
			countPost: 100,
			//isShowModal: false,
			materialIndex: null,
			//filterKey: '',
			//selectedIdLocation: null,
			//isPrint: false,
			open: false,
			loading: false,
			period: {
				start: null,
				end: null
			}
		}
	},
	methods: {
        toggle() {
            this.open = !this.open;
		},
		//showModal(index = null){
		//	this.materialIndex = index;
		//	this.isShowModal = true;
		//},
		//hideModal(){
		//	this.isShowModal = false;
		//},
		//successExpenses(expenseAmount, renewaDate){
		//	this.isShowModal = false;
		//	this.gridData[this.materialIndex].total = this.gridData[this.materialIndex].total - expenseAmount;
		//	if(renewaDate)
		//		this.gridData[this.materialIndex].shelf_life = renewaDate;
		//},
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
		submitPeriod(){
			this.loading = !this.loading;
			this.$http.get('/api/reagent/writeoff/?start=' + this.period.start + "&end=" + this.period.end, )
			.then(response => {this.loading = !this.loading; this.gridData = response.data; this.open = !this.open})
			.catch(error => (this.loading = !this.loading, alert(error)));
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
		todays(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
		filteredRows: function () {
			let sortKey = this.sortKey;
			let filterKey = this.filterKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = JSON.parse(JSON.stringify(this.gridData));
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
			//if (filterKey)
			//{
			//	rows = rows.filter(function(row)
			//	{
			//		return String(row['material_id']).toLowerCase().indexOf(filterKey) > -1 || String(row['material']).toLowerCase().indexOf(filterKey) > -1;
			//	});
			//}
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					if(r.total === null) r.total = r.amount;
					return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				});
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
		dropdownLocations(){
			let result = [];
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
		//this.getStorage();
	}
  }
</script>