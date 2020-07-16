<template>
	<sui-grid>
		<sui-grid-column>
			<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
			<sui-table selectable compact v-if="gridData.length > 0">
				<sui-table-header>
					<sui-table-row>

					</sui-table-row>
					<sui-table-row>
						<sui-table-header-cell>
							<sui-checkbox label="" />
						</sui-table-header-cell>
						<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index">
							{{ Object.values(column)[0] }}
						</sui-table-header-cell>
					</sui-table-row>
				</sui-table-header>
				<sui-table-body>
					<sui-table-row v-for="(eq, index) in paginateRows" :key="index">
						<sui-table-cell>
							<sui-checkbox label="" />
						</sui-table-cell>
						<sui-table-cell>{{ eq.number_card }}</sui-table-cell>
						<sui-table-cell>{{ eq.equipment }}</sui-table-cell>
						<sui-table-cell>{{ eq.model }}</sui-table-cell>
						<sui-table-cell>{{ eq.serial_number }}</sui-table-cell>
						<sui-table-cell>{{ today(eq.date_current_check) }}</sui-table-cell>
						<sui-table-cell>{{ today(eq.date_next_check) }}</sui-table-cell>
					</sui-table-row>
				</sui-table-body>
				<sui-table-footer>
					<sui-table-header-cell v-bind:colspan="gridColumns.tableColumn.length + 1">
						СУКА
					</sui-table-header-cell>
				</sui-table-footer>
			</sui-table>
		</sui-grid-column>
	</sui-grid>
</template>

<script>
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
			//selectAllMaterials: false,
			//selectedEquipments: [],
		}
	},
	methods: {
		getEquipment(){
			fetch("http://localhost:8081/equipments").then(response => (
				response.json().then(data => (this.gridData = data))
			));
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
			//let interval = setInterval(function()
			//{ 
			//	if($('.dropdown').dropdown({fullTextSearch: true}).length <= 0)
			//		$('.dropdown').dropdown({fullTextSearch: true});
			//	else clearInterval(interval);
			//}, 0.5);
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
			//Object.keys(this.filtersCheck).forEach(f =>
			//{
			//	if(this.filtersCheck[f])
			//		rows = rows.filter(row => {
			//			return row[f] === 1;
			//		})
			//})
			//if(this.filterDate['start'] != null && this.filterDate['end'] != null)
			//	rows = rows.filter(row => {
			//		return row['date_next_check'] >= this.filterDate['start'] && row['date_next_check'] <= this.filterDate['end'];
			//	})
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
		this.getEquipment();
	}
  }
</script>