<template>
	<div>
		<v-data-table dense :headers="gridColumns.tableColumn" :items="gridData" :items-per-page="50" :loading="gridData.length <= 0" @click:row="selectedCheck">
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
			<!-- <template v-slot:item.total="{ item }">
				{{gridData.map(function(x) {return x.id; }).indexOf(item.id)}}
			</template> -->
			<template v-slot:item.actions="{ item }">
				<v-btn small icon color="orange" v-on:click="selectedRow(item)"><v-icon>mdi-eye</v-icon></v-btn>
				<v-btn small icon color="blue"><v-icon>mdi-printer</v-icon></v-btn>
				<v-btn small icon color="red"><v-icon>mdi-delete</v-icon></v-btn>
				<v-btn small icon color="green" v-if="!item.date_submit" v-on:click="play(item)"><v-icon>mdi-play</v-icon></v-btn>
			</template>
		</v-data-table>
		<v-dialog dense v-model="dialog" max-width="1256px">
			<v-card>
				<v-card-title>{{header}}</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-data-table dense :headers="tableColumn" :items="gridData1">
						<template v-slot:item.actions="{ item }">
							<!-- <v-chip color="green" small text-color="white" v-if="(item.is_received_before && !item.is_received_after)
							|| (!item.is_received_before && item.is_received_after)
							&& (!item.is_received_before && !item.is_received_after)">Получено</v-chip>
							<v-btn small icon color="green" v-if="(item.is_received_before && !item.is_received_after)
							|| (!item.is_received_before && item.is_received_after)
							|| (!item.is_received_before && !item.is_received_after)" v-on:click="submitBefore(item)"><v-icon>mdi-check</v-icon></v-btn> -->
							<v-btn small icon v-bind:color="item.is_received_before && !item.is_received_after ? 'orange': item.is_received_before && item.is_received_after ? 'green' : 'red'" v-on:click="submitBefore(item)"><v-icon>mdi-check</v-icon></v-btn>
							<v-btn small icon color="red"><v-icon>mdi-delete</v-icon></v-btn>
						</template>
					</v-data-table>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="dialog = false">Закрыть</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import fs from 'file-saver';

export default {
	data () {
		return {
			gridColumns: {
				tableColumn: [
					{ text: '№', align: 'start', sortable: true, value: 'id'},
					{ text: 'Сформировано', align: 'start', sortable: true, value: 'date_create',},
					{ text: 'Отправлено', align: 'start', sortable: true, value: 'date_submit'},
					// { text: 'Получено/Всего', align: 'end', sortable: false, value: 'total', filterable: false},
					{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false }
				],
				filterColumn: [
					{'number':'Номер'},
					{'department':'Отдел'},
					{'type':'Вид'}
				]
			},
			tableColumn: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model'},
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number', filterable: false },
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false, width: 100}
			],
			gridData: [],
			verificationInfo: {},
			gridData1: [],
			equipments: false,
			dialog: false,
			check: {}
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
		selectedRow(data){
			this.verificationInfo = data;
			// this.equipments = true;
			this.$http.get('/api/equipment/verification/' + data.id + "/equipments").then(response => (this.gridData1 = response.data, this.equipments = false, this.dialog = true)).catch(error => (this.equipments = false, alert(error.response.data.message)));
		},
		selectedCheck(data){
			this.check = data;
		},
		submitBefore(item){
			let param;
			if(!item.is_received_before && !item.is_received_after) param = 'before';
			if(item.is_received_before && !item.is_received_after) param = 'after';
			this.$http.put(`/api/equipment/verification/${item.id_checks}/${item.id_kit_row}/${param}`)
			.then(response => (item[`is_received_${param}`] = true)).catch(error => (alert(error.response.data.message)));
		},
		play(item){
			this.$http.put(`/api/equipment/verification/${item.id}/play`)
			.then(response => (item.date_submit = '')).catch(error => (alert(error.response.data.message)));
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