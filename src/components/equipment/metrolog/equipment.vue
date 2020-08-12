<template>
	<sui-grid-row>
		<sui-grid-column>
			<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
			<sui-table selectable compact v-if="gridData.length > 0">
				<sui-table-header>
					<sui-table-row>
						<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
							Оборудование
							<sui-button color="violet" icon="calendar check outline" size="mini" floated="right" v-on:click="showModal('CheckReq')"></sui-button>
							<!-- <div class="ui orange right floated icon top right mini pointing dropdown button">
								<i class="icon tags"></i>
								<i class="icon dropdown"></i>
								<div class="menu">
									<div class="header">
										<i class="tags icon"></i>
										Поставить метку
									</div>
									<div class="item" v-on:click="setTag('is_archive', true)">
										<div class="ui teal empty circular label"></div>
										Архив
									</div>
									<div class="item" v-on:click="setTag('is_working', true)">
										<div class="ui green empty circular label"></div>
										Используется
									</div>
									<div class="item" v-on:click="setTag('is_conservation', true)">
										<div class="ui yellow empty circular label"></div>
										Консервация
									</div>
									<div class="item" v-on:click="setTag('is_repair', true)">
										<div class="ui red empty circular label"></div>
										Ремонт
									</div>
									<div class="item" v-on:click="setTag('is_check', true)">
										<div class="ui violet empty circular label"></div>
										ЦСМ
									</div>
									<div class="divider"></div>
									<div class="header" v-show="selectedEquipments.length > 0">
										<i class="tags icon"></i>
										Снять метку
									</div>
									<div class="item" v-for="item in Object.keys(tagsFromSelected)" v-on:click="setTag(item, false)">
										<div v-bind:class="{
										'ui violet empty circular label': item === 'is_check',
										'ui red empty circular label': item === 'is_repair',
										'ui yellow empty circular label': item === 'is_conservation',
										'ui green empty circular label': item === 'is_working',
										'ui teal empty circular label': item === 'is_archive'}"></div>
										{{ tagsFromSelected[item] }}
									</div>
								</div>
							</div> -->
							<sui-dropdown class="ui blue right floated icon top left mini pointing button" icon="print">
								<sui-dropdown-menu>
									<sui-dropdown-item>Большая этикетка</sui-dropdown-item>
									<sui-dropdown-item>Средняя этикетка</sui-dropdown-item>
									<sui-dropdown-item>Маленькая этикетка</sui-dropdown-item>
									<sui-dropdown-item v-on:click="GetCard()">Регистрационная карта</sui-dropdown-item>
									<sui-dropdown-item v-on:click="printTable()">Таблица проверок</sui-dropdown-item>
									<sui-dropdown-item v-on:click="showModal('Protocol')">ПТС</sui-dropdown-item>
								</sui-dropdown-menu>
							</sui-dropdown>
							<button class="ui green right floated mini icon button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
							<button class="ui teal right floated mini icon button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
							<a href="<?php echo Url::toRoute(['append/']) ?>" class="ui yellow right floated mini icon button" ><i class="icon plus"></i></a>
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
						<sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
							<sui-checkbox label="Архив"/>
							<sui-checkbox label="Используется"/>
							<sui-checkbox label="Консервация"/>
							<sui-checkbox label="Ремонт"/>
							<sui-checkbox label="ЦСМ"/>
						</sui-table-header-cell>
					</sui-table-row>
					<sui-table-row>
						<sui-table-header-cell><sui-checkbox label="" /></sui-table-header-cell>
						<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
							{{ Object.values(column)[0] }}
							<i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
						</sui-table-header-cell>
					</sui-table-row>
				</sui-table-header>
				<sui-table-body>
					<sui-table-row v-for="equipment in paginateRows" :key="equipment.id">
						<sui-table-cell collapsing>
							<sui-checkbox/>
						</sui-table-cell>
						<sui-table-cell collapsing>{{ equipment.number_card }}</sui-table-cell>
						<sui-table-cell>{{ equipment.equipment }}</sui-table-cell>
						<sui-table-cell collapsing>{{ equipment.model }}</sui-table-cell>
						<sui-table-cell collapsing text-align="right">{{ equipment.serial_number }}</sui-table-cell>
						<sui-table-cell collapsing>{{ today(equipment.date_current_check) }}</sui-table-cell>
						<sui-table-cell collapsing>{{ today(equipment.date_next_check) }}</sui-table-cell>
						<sui-table-cell collapsing>
							<a><span class="ui teal small circular label" v-show="equipment.is_archive">А</span></a>
							<a><span class="ui green small circular label" v-show="equipment.is_working">И</span></a>
							<a><span class="ui yellow small circular label" v-show="equipment.is_conservation">К</span></a>
							<a><span class="ui red small circular label" v-show="equipment.is_repair">Р</span></a>
							<a><span class="ui violet small circular label" v-show="equipment.is_check">Ц</span></a>
						</sui-table-cell>
						<sui-table-cell collapsing>
							<sui-dropdown class="icon mini" icon="settings" button pointing="right">
								<sui-dropdown-menu>
									<router-link :to="{ name: 'details', params: { id: equipment.id }}" is="sui-dropdown-item">Подробнее</router-link>
									<sui-dropdown-item>Добавить проверку</sui-dropdown-item>
								</sui-dropdown-menu>
							</sui-dropdown>
						</sui-table-cell>
					</sui-table-row>
				</sui-table-body>
				<sui-table-footer>
					<sui-table-row>
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
					</sui-table-row>
				</sui-table-footer>
			</sui-table>
		</sui-grid-column>
	</sui-grid-row>
</template>

<script>
import fs from 'file-saver';

export default {
	data () {
		return {
			gridColumns: {
				tableColumn: [
					{'number':'Номер'},
					{'equipment':'Оборудование'},
					{'model':'Модель'},
					{'serial_number':'С/Н'},
					{'date_current_check':'Текущая'},
					{'date_next_check':'Следующая'},
					{'Tag': ''},
					{'action': ''}
				],
				filterColumn: [
					{'number':'Номер'},
					{'department':'Отдел'},
					{'type':'Вид'},
					{'equipment':'Оборудование'}
				]
			},
			filters: {
				number: [],
				department: [],
				type: [],
				equipment: [],
			},
			gridData: [],
			sortKey: '',
			sortColumns: Object,
			currentPage: 1,
			listPages: [],
			countPost: 100,
			filterKey: '',
			check: {
				id_equipment: null,
				date_current_check: null,
				date_next_check: null,
				number_document: null,
				id_upload_document_type: null,
				upload_file_name: [],
				is_archive: false,
				is_conservation: false
			},
			checks: {
				is_archive: false,
				is_conservation: false,
				is_check: false,
				is_repair: false,
				is_working: false
			},
			dateFilter: {
				start: null,
				end: null
			},
			handoff: {
				id_equipment: null,
				department: null,
				id_department_to: null,
				id_location: null
			},
			//isShowModal: false,
			//materialIndex: null,
			//selectedIdLocation: null,
			//isPrint: false,
			//isToArchive: false
		}
	},
	methods: {
	//	showModal(index = null){
	//		this.materialIndex = index;
	//		this.isShowModal = true;
	//	},
	//	hideModal(){
	//		this.isShowModal = false;
	//	},
	//	successExpenses(expenseAmount, renewaDate){
	//		this.isShowModal = false;

	//		if(this.gridData[this.materialIndex].total === null)
	//			this.gridData[this.materialIndex].total = this.gridData[this.materialIndex].amount - expenseAmount;
	//		else
	//			this.gridData[this.materialIndex].total = this.gridData[this.materialIndex].total - expenseAmount;
			
	//		if(renewaDate)
	//			this.gridData[this.materialIndex].shelf_life = renewaDate;
	//	},
		getEquipment(){
			this.$http.get('/api/equipment/metrolog').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		sortBy(key) {
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
			return new Date(date).toLocaleString().split(',')[0];
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
		//printInventory(){
		//	this.isPrint = !this.isPrint;
		//	this.$http.get('/api/reagent/storage/print/' + this.selectedIdLocation, {responseType: 'blob'})
		//	.then(response => {
		//		const file = new Blob([response.data], {type: 'application/pdf'});
		//		fs.saveAs(file, 'Опись расходных материалов ' + this.todays + '.pdf');
		//		this.isPrint = !this.isPrint;
		//	})
		//	.catch(error => (alert(error), this.isPrint = !this.isPrint));	
		//}
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
		idDep(){
			return this.$store.getters.idDepartment;
		},
		sortedRows(){
			let sortKey = this.sortKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = JSON.parse(JSON.stringify(this.gridData));
			return rows.sort(function (a, b) {
				a = a[sortKey];
				b = b[sortKey];
				if(a === b) return 0 * order;
				else if (a > b) return 1 * order;
				else return - 1 * order;
			})
		},
		searchRows(){
			let filterKey = this.filterKey;
			let rows = this.sortedRows;
			return rows.filter(function(row)
			{
				return String(row['number_card']).includes(filterKey);
			});
		},
		filteredRows: function () {
			let rows = this.searchRows;
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					return this.filters[f].length < 1 || this.filters[f].includes(r[f])
				});
			})
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
		},
		//dropdownLocations(){
		//	let result = [];
		//	for (let str of this.gridData)
		//	{
		//		let obj = {key: str['id_location'], value: str['id_location'], text: str['location']};
		//		if (!result.includes(obj, 0))
		//			result.push(obj);
		//		result = result.slice().sort(function (a, b){
		//			if(a === b) return 0 ;
		//			else if (a > b) return 1;
		//			else return - 1;
		//		});
		//	}
		//	return result;
		//}
	},
	created(){
		this.getEquipment();
	}
  }
</script>