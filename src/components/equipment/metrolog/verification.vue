<template>
	<v-row>
		<v-col cols="5">
			<v-data-table dense :headers="gridColumns.tableColumn" :items="gridData" :items-per-page="50" :loading="gridData.length <= 0" @dblclick:row="selectedRow">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Управление проверками</v-toolbar-title>
					</v-toolbar>
				</template>
				<template v-slot:item.date_create="{ item }">
					{{ today(item.date_create) }}
				</template>
				<template v-slot:item.date_submit="{ item }">
					{{ today(item.date_submit) }}
				</template>
				<template v-slot:item.total="{ item }">
					total
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn small icon color="blue"><v-icon>mdi-printer</v-icon></v-btn>
					<v-btn small icon color="red"><v-icon>mdi-delete</v-icon></v-btn>
					<v-btn small icon color="green"><v-icon>mdi-play</v-icon></v-btn>
				</template>
			</v-data-table>
		</v-col>
		<v-col cols="7">
			<v-data-table dense :headers="tableColumn" :items="gridData1" :loading="equipments">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>{{header}}</v-toolbar-title>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn small icon color="green"><v-icon>mdi-check</v-icon></v-btn>
					<v-btn small icon color="red"><v-icon>mdi-delete</v-icon></v-btn>
				</template>
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
import fs from 'file-saver';

export default {
	data () {
		return {
			gridColumns: {
				tableColumn: [
					{ text: '№', align: 'start', sortable: true, value: 'id', width: 70},
					{ text: 'Сформировано', align: 'start', sortable: true, value: 'date_create', width: 150},
					{ text: 'Отправлено', align: 'start', sortable: true, value: 'date_submit', width: 130},
					{ text: 'Пол./Всего', align: 'end', sortable: false, value: 'total', filterable: false, width: 100},
					{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false }
				],
				filterColumn: [
					{'number':'Номер'},
					{'department':'Отдел'},
					{'type':'Вид'}
				]
			},
			tableColumn: [
				{ text: 'Номер', align: 'start', sortable: true, value: 'number', width: 120 },
				{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: true, value: 'model', width: 120 },
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number', filterable: false },
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false, width: 100}
			],
			gridData: [],
			editedItem: {
				equipment: null,
				number_card: null,
				model: null,
				date_current_check: null,
				date_next_check: null,
				number_document: null,
				file: null
			},
			verificationInfo: {},
			gridData1: [],
			equipments: false
			//filters: {
			//	number: [],
			//	department: [],
			//	type: [],
			//},
			//dateFilterNext: {
			//	start: null,
			//	end: null
			//},
			//dateFilterCurrent: {
			//	start: null,
			//	end: null
			//},
			//dateFilterCommissioning: {
			//	start: null,
			//	end: null
			//}
		}
	},
	methods: {
		getVerification(){
			this.$http.get('/api/equipment/verification').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			if(date === null) return;
			return new Date(date).toLocaleString().split(',')[0];
		},
		selectedRow(event, data){
			this.verificationInfo = data.item;
			this.equipments = true;
			this.$http.get('/api/equipment/verification/' + this.verificationInfo.id + "/equipments").then(response => (this.gridData1 = response.data, this.equipments = false)).catch(error => (this.equipments = false, alert(error.response.data.message)));
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		},
		header(){
			if(this.verificationInfo.id_status_check === 1) return `№ ${this.verificationInfo.id} - Отправляемое оборудование`;
			if(this.verificationInfo.id_status_check === 2) return `№ ${this.verificationInfo.id} - Отправленное оборудование`;
			if(this.verificationInfo.id_status_check === 3) return `№ ${this.verificationInfo.id} - Полученное(аемое) оборудование`;
			return 'Подготавливаемое оборудование';
		}
	},
	created(){
		this.getVerification();
	}
  }
</script>