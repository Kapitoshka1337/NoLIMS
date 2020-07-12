<template>
	<sui-grid>
		<sui-grid-column>
			<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
			<sui-table selectable compact v-if="gridData.length > 0">
				<sui-table-header>
					<sui-table-row>
						<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index">
							{{ Object.values(column)[0] }}
						</sui-table-header-cell>
					</sui-table-row>
				</sui-table-header>
				<sui-table-body>
					<sui-table-row>
						<sui-table-cell></sui-table-cell>
					</sui-table-row>
				</sui-table-body>
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
			gridData: []
		}
	},
	methods: {
		getEquipment(){
			fetch("http://nolims/equipment/get-equipments").then(response => (this.gridData = response.data));
		}
	},
	mounted: function(){
		//this.getEquipment();
	}
  }
</script>