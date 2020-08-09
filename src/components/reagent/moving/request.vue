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
                                Формирование запроса на передачу
                                <sui-button  v-bind:disabled="filters.department === '' || !selectedMaterials.length" color="yellow" floated="right" content="Сформировать" size="mini" @click.native="toggle"></sui-button>
                                </sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
								<sui-form>
									<sui-form-fields fields="two">
                                        <sui-form-field width="fifteen">
                                            <sui-input type="text" placeholder="Поиск по МАТЕРИАЛ" v-model="filterKey"></sui-input>
                                        </sui-form-field>
                                        <sui-form-field>
											<sui-dropdown placeholder="Отдел" search selection :options="returnUniq" v-model="filters['department']"></sui-dropdown>
										</sui-form-field>
                                    </sui-form-fields>
								</sui-form>
							</sui-table-header-cell>
						</sui-table-row>
						<sui-table-row>
							<!-- <sui-table-header-cell><sui-checkbox label="" /></sui-table-header-cell> -->
							<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
								{{ Object.values(column)[0] }}
								<i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
							</sui-table-header-cell>
						</sui-table-row>
					</sui-table-header>
					<sui-table-body>
						<sui-table-row v-for="(material, index) in paginateRows" :key="index">
							<sui-table-cell collapsing>
                                <sui-checkbox v-model="selectedMaterials" v-bind:value="material"/>
                            </sui-table-cell>
							<sui-table-cell collapsing>{{ material.department }}</sui-table-cell>
                            <sui-table-cell collapsing>{{ today(material.date_order) }}</sui-table-cell>
							<sui-table-cell :width="1">{{ material.type }}</sui-table-cell>
							<sui-table-cell >{{ material.material }} ({{ material.density }})</sui-table-cell>
							<sui-table-cell collapsing>{{ material.order_measure }}</sui-table-cell>
							<sui-table-cell collapsing
							v-bind:class="{success: Math.round(material.total) > Math.round((material.amount / 10) * (50 / 10)), caution: Math.round(material.total) <= Math.round((material.amount / 10) * (50 / 10)), danger: Math.round(material.total) <= Math.round((material.amount / 10) * (36 / 10))}"
							>{{ material.total }} / {{ material.amount }}
                            </sui-table-cell>
							<sui-table-cell :width="2"
							v-bind:class="{success: colorShelfLife(material.shelf_life) > 62, caution: colorShelfLife(material.shelf_life) <= 62, danger: colorShelfLife(material.shelf_life) <= 31}"
							>{{ today(material.shelf_life)  }} <strong> ({{ colorShelfLife(material.shelf_life)  }})</strong>
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
			</sui-grid-column>
		</sui-grid-row>
        <sui-modal v-model="open">
            <sui-modal-header>Запрашиваемые материалы из {{ filters.department }}</sui-modal-header>
            <sui-modal-content>
                <sui-table>
                    <sui-table-header>
                        <sui-table-row>
                            <sui-table-header-cell>Тип</sui-table-header-cell>
                            <sui-table-header-cell>Материал</sui-table-header-cell>
                            <sui-table-header-cell>Ед.изм.</sui-table-header-cell>
                            <sui-table-header-cell>Остаток</sui-table-header-cell>
                            <sui-table-header-cell>Запр. кол.</sui-table-header-cell>
                            <sui-table-header-cell>Местоположение</sui-table-header-cell>
                            <sui-table-header-cell></sui-table-header-cell>
                        </sui-table-row>
                    </sui-table-header>
                    <sui-table-body>
                        <sui-table-row v-for="material in selectedMaterials" :key="material.material_id">
                            <sui-table-cell>{{ material.type }}</sui-table-cell>
                            <sui-table-cell>{{ material.material }} ({{ material.density }})</sui-table-cell>
                            <sui-table-cell>{{ material.measure }}</sui-table-cell>
                            <sui-table-cell>{{ material.total }}</sui-table-cell>
                            <sui-table-cell collapsing><sui-input type="number" min="0" v-model="material.moving_amount"></sui-input></sui-table-cell>
                            <sui-table-cell collapsing>
                                <sui-dropdown :options="forDropdown" search selection v-model="material.id_location"></sui-dropdown>
                            </sui-table-cell>
                        </sui-table-row>
                    </sui-table-body>
                </sui-table>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button v-bind:loading="loading" positive @click.native="submutMoving()" content="Отправить"></sui-button>
            </sui-modal-actions>
        </sui-modal>
	</div>
</template>

<script>
import ExpensesModal from '../modals/expenses.vue';
import unit from '../unit.js';

export default {
	components: {
		'expenses-modal': ExpensesModal
	},
	data () {
		return {
            open: false,
            gridColumns: {
                tableColumn: [
                    {'action': ''},
                    {'department': 'Отдел'},
                    {'date_create':'Дата пост.'},
                    {'type':'Тип'},
                    {'material':'Материал'},
                    {'measure':'Ед.изм'},
                    {'amount':'Количество'},
                    {'shelf_life':'Срок хранения'}
                ],
                filterColumn: [
                    {'id_department':'Отдел'},
                ]
            },
			filters: {
				department: ''
			},
			gridData: [],
			sortKey: '',
			sortColumns: Object,
			currentPage: 1,
			listPages: [],
			countPost: 100,
			isShowModal: false,
			materialIndex: null,
            filterKey: '',
            selectedMaterials: [],
			listLocations: [],
			loading: false
		}
	},
	methods: {
        toggle() {
            this.open = !this.open;
		},
		submutMoving(){
			let obb = [];
			//let amount;
			for(let item of this.selectedMaterials)
			{

				//кг -> см3
				//if((item['id_order_measure'] === 4 && item['id_measure'] === 6) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
				//{
				//	amount = (item['moving_amount'] * item['density']) / 1000;
				//}
				////кг -> г
				//if((item['id_order_measure'] === 4 && item['id_measure'] === 2) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
				//{
				//	amount = item['moving_amount'] / 1000;
				//}
				obb.push({
					id_arrival_material: item['arrival_material_id'],
					id_location: item['id_location'],
					amount: this.$convert(item['moving_amount']).param(item['density']).measure(unit[item['id_measure']]).to(unit[item['id_order_measure']])
				});
			}
			let obj = {
				id_department_to: this.selectedMaterials[0].id_department,
				materials: obb
			};
			this.loading = !this.loading;
			this.$http.post('/api/reagent/moving', obj).then(response => (this.open = false, this.loading = !this.loading)).catch(error => (alert(error.response.data.message), this.loading = !this.loading));
		},
		getStorageAll(){
			this.$http.get('/api/reagent/storage/all').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
        }
	},
	watch: {
		gridData(){
			this.setSortColumn();
		},
		filteredRows() {
			this.listPages = [];
			this.setPages();
        },
        selectedMaterials(){
            if(!this.listLocations.length)
                this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error)));
        },
        "filters.department":function(newVal, oldVal){
            if(newVal != oldVal)
                this.selectedMaterials = [];
        }
	},
	computed: {
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
			if (filterKey)
			{
				rows = rows.filter(function(row)
				{
					return String(row['material']).toLowerCase().indexOf(filterKey) > -1;
				});
			}
			return rows.filter(r =>
			{
				//кг -> см3
				//if((r.id_order_measure === 4 && r.id_measure === 6) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
				//{
				//	r.amount = Math.round((r.amount / r.density) * 1000);
				//	r.order_measure = r.measure;
				//}
				////кг -> г
				//if((r.id_order_measure === 4 && r.id_measure === 2) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
				//{
				//	r.amount = Math.round(r.amount * 1000);
				//	r.order_measure = r.measure;
				//	if(r.total === null) r.total = r.amount;
				//	else r.total = Math.round(r.total * 1000);
				//}
				r.amount = this.$convert(r.amount).param(r.density).measure(unit[r.id_order_measure]).to(unit[r.id_measure]);
				r.order_measure = r.measure;
				if(r.total === null) r.total = r.amount
				else r.total = this.$convert(r.total).param(r.density).measure(unit[r.id_order_measure]).to(unit[r.id_measure]);
				
				return Object.keys(this.filters).every(f =>
				{
					if(r.total === null) r.total = r.amount;
					return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				})
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
        },
        forDropdown(){
            if(this.listLocations.length)
            {
				let result = [];
                for(let item of this.listLocations){
					let obj = { key: item.id, value: item.id, text: item.cabinet_number + " " + item.place + " " + item.notation};
                    result.push(obj);
                }
                return result;
            }
		},
		returnUniq(){
			let result = [];
			let resa = [];
			for (let str of this.gridData)
				if (!result.includes(str['department']))
					result.push(str['department']);
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
		//FormatAmount(){
		//		//кг -> см3
		//		if((this.selectedMaterials.id_order_measure === 4 && this.selectedMaterials.id_measure === 6) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
		//		{
		//			return (this.selectedMaterials.moving_amount * this.selectedMaterials.density) / 1000;
		//			//this.material.order_measure = this.material.measure;
		//		}
		//		////кг -> г
		//		if((this.selectedMaterials.id_order_measure === 4 && this.selectedMaterials.id_measure === 2) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
		//		{
		//			return this.selectedMaterials.moving_amount / 1000;
		//			//r.order_measure = r.measure;
		//			//if(r.total === null) r.total = r.amount;
		//			//else r.total = Math.round(r.total * 1000);
		//		}
		//		return this.selectedMaterials.moving_amount;
		//}
	},
	created(){
		this.getStorageAll();
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