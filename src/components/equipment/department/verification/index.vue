<template>
	<v-row>
		<v-col cols="12">
			<v-data-table dense :search="search" :headers="tableColumn" :items="gridData" :items-per-page="50" :loading="gridData.length <= 0"
			:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">>
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Управление поверками</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-slot:item.date_create="{ item }">
					{{ today(item.date_create) }}
				</template>
				<template v-slot:item.date_submit="{ item }">
					{{ today(item.date_submit) }}
				</template>
				<!--<template v-slot:item.date_hand_over="{ item }">
					{{ today(item.date_hand_over) }}
				</template>-->
				<!--<template v-slot:item.claim_check="{item}">
					{{ item.claim_check || 'Не указан' }}
				</template>-->
				<!--<template v-slot:item.totals="{ item }">
					{{ item.cnt_before }} / {{ item.cnt_after }} (<strong>{{ item.cnt_total }}</strong>)
				</template>-->
				<template v-slot:item.actions="{ item }">
					<!--<v-btn x-small color="orange" v-on:click="selectedVerification(item)">Просмотр</v-btn>-->
					<!--<v-btn small icon color="blue" v-on:click="confirmPrint(item)"><v-icon>mdi-printer</v-icon></v-btn>-->
					<!--<v-btn small icon color="red" v-on:click="confirmDeleteVerification(item)" v-if="item.id_status_check != 2 && item.id_status_check != 3"><v-icon>mdi-delete</v-icon></v-btn>-->
					<!--<v-btn small icon color="green" v-if="!item.date_submit" v-on:click="confirmPlay(item)"><v-icon>mdi-play</v-icon></v-btn>-->
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
			<v-overlay :value="overlay">
				<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
			</v-overlay>
			<v-dialog dense v-model="dialog" max-width="1256px">
				<v-card>
					<v-card-title>{{header}}</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-data-table dense :headers="tableColumn1" :items="gridData1"
						:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">>
							<template v-slot:item.actions="{ item }">
								<v-btn small icon v-bind:color="
								item.is_received_before && !item.is_received_after ? 'orange' :
								item.is_received_before && item.is_received_after && !item.is_received_department ? 'blue' :
								item.is_received_before && item.is_received_after && item.is_received_department ? 'green' :
								'red'" v-on:click="beforeRecieved(item)" :loading="param"><v-icon>mdi-checkbox-marked</v-icon></v-btn>
								<v-btn small icon color="red" v-on:click="confirmDeleteEq(item)" v-if="item.id_status_check != 2 && item.id_status_check != 3"><v-icon>mdi-delete</v-icon></v-btn>
							</template>
						</v-data-table>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="dialog = false">Закрыть</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
	</v-row>
</template>

<script>
import fs from 'file-saver';

export default {
	data () {
		return {
			tableColumn: [
				{ text: '№', align: 'start', sortable: true, value: 'id'},
				{ text: 'Сформировано', align: 'start', sortable: true, value: 'date_create', filterable: false},
				{ text: 'Отправлено', align: 'start', sortable: true, value: 'date_submit', filterable: false},
				{ text: 'Срок сдачи', align: 'start', sortable: true, value: 'date_hand_over', filterable: false},
				{ text: 'Сформировал', align: 'start', sortable: true, value: 'user'},
				//{ text: 'Номер квитанции', align: 'start', sortable: true, value: 'claim_check'},
				{ text: 'Подготовленно/Поверенно', align: 'start', sortable: false, value: 'totals', filterable: false },
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false }
			],
			tableColumn1: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number_card', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model'},
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number', filterable: false },
				{ text: 'Получено', align: 'end', sortable: false, value: 'date_received_after' },
				{ text: 'Отдано', align: 'end', sortable: false, value: 'date_received_department' },
				//{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false, width: 100}
			],
			search: '',
			gridData: [],
			gridData1: [],
			dialog: false,
			//param: false,
			//deleteVerificationDialog: false,
			//deleteEqDialog: false,
			//printDialog: false,
			//playDialog: false,
			//loadDelete: false,
			//claim_check: null,
			checkDefault: {
				claim_check: null,
				cnt_after: null,
				cnt_before: null,
				cnt_total: null,
				date_create: null,
				date_submit: null,
				id: null,
				id_status_check: 1,
				user: null,
			},
			check: {
				claim_check: null,
				cnt_after: null,
				cnt_before: null,
				cnt_total: null,
				date_create: null,
				date_submit: null,
				id: null,
				id_status_check: 1,
				user: null,
			},
			//kitDefault: {
			//	date_received_after: null,
			//	date_received_department: null,
			//	equipment: null,
			//	id_checks: null,
			//	id_kit_row: null,
			//	id_status_check: null,
			//	is_received_after: null,
			//	is_received_before: null,
			//	is_received_department: null,
			//	model: null,
			//	number: null,
			//	serial_number: null,
			//	id_equipment: null
			//},
			//kit: {
			//	date_received_after: null,
			//	date_received_department: null,
			//	equipment: null,
			//	id_checks: null,
			//	id_kit_row: null,
			//	id_status_check: null,
			//	is_received_after: null,
			//	is_received_before: null,
			//	is_received_department: null,
			//	model: null,
			//	number: null,
			//	serial_number: null,
			//	id_equipment: null
			//},
			//checkIndex: -1,
			//kitIndex: -1,
			overlay: false,
			//showPassed: false
		}
	},
	methods: {
		getVerification(){
			this.$http.get('/api/equipment/verification').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			return date === null ? '' : new Date(date).toLocaleString().split(',')[0];
		},
		selectedVerification(item){
			this.checkIndex = this.gridData.indexOf(item);
			this.check = Object.assign({}, item);
			this.overlay = true;
			this.$http.get(`/api/equipment/verification/${item.id}/equipments`).then(response => (this.gridData1 = response.data, this.overlay = false, this.dialog = true)).catch(error => (this.overlay = false, alert(error.response.data.message)));
		},
		//beforeRecieved(item){
		//	this.kitIndex = this.gridData1.indexOf(item);
		//	this.kit = Object.assign({}, item);
		//	if(!item.is_received_before && !item.is_received_after)
		//		this.submitBefore();
		//	else if(item.is_received_before && !item.is_received_after)
		//		this.showPassed = true;
		//	else if(item.is_received_before && item.is_received_after && !item.is_received_department)
		//		this.submitDepartment();
		//},
		//submitBefore(){
		//	this.param = true;
		//	this.$http.put(`/api/equipment/verification/${this.kit.id_checks}/${this.kit.id_kit_row}/before`)
		//	.then(response => {
		//		this.param = false;
		//		Object.assign(this.gridData[this.checkIndex], response.data.check);
		//		Object.assign(this.gridData1[this.kitIndex], response.data.kit);
		//	}).catch(error => (this.param = false, alert(error.response.data.message), this.close()));
		//},
		//submitDepartment(){
		//	this.param = true;
		//	this.$http.put(`/api/equipment/verification/${this.kit.id_checks}/${this.kit.id_kit_row}/department`)
		//	.then(response => {
		//		this.param = false;
		//		Object.assign(this.gridData[this.checkIndex], response.data.check);
		//		Object.assign(this.gridData1[this.kitIndex], response.data.kit);
		//	}).catch(error => (this.param = false, alert(error.response.data.message), this.close()));
		//},
		//submitAfter(data){
		//	let prepare = data;
		//	let formData = new FormData();
		//	formData.append('id_equipment', this.kit.id_equipment);
		//	formData.append('date_current_check', prepare.date_current_check);
		//	formData.append('date_next_check', prepare.date_next_check);
		//	formData.append('id_upload_document_type', prepare.id_upload_document_type);
		//	formData.append('number_document', prepare.number_document);
		//	formData.append('file', prepare.file);

		//	this.$http.post(`/api/equipment/verification/${this.kit.id_checks}/${this.kit.id_kit_row}/after`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
		//	.then(response => {
		//		this.closeDialog();
		//		Object.assign(this.gridData[this.checkIndex], response.data.check);
		//		Object.assign(this.gridData1[this.kitIndex], response.data.kit);
		//	}).catch(error => (alert(error.response.data.message), this.showPassed = false));
		//},
		//closeDialog(){
		//	this.showPassed = false;
		//},
		close(){
			this.param = false;
			this.$nextTick(() => {
				this.check = Object.assign({}, this.checkDefault);
				this.kit = Object.assign({}, this.kitDefault);
				this.checkIndex = -1;
				this.kitIndex = -1;
			})
		},
		//confirmPlay(item){
		//	this.checkIndex = this.gridData.indexOf(item);
		//	this.check = Object.assign({}, item);
		//	this.playDialog = true;
		//},
		//play(){
		//	this.loadDelete = true;
		//	this.$http.put(`/api/equipment/verification/${this.check.id}/play`, {claim_check: this.claim_check}).then(response => (
		//			this.playDialog = false,
		//			this.loadDelete = false,
		//			Object.assign(this.gridData[this.checkIndex], response.data.check))
		//		).catch(error => (this.loadDelete = false, alert(error.response.data.message)));
		//},
		//confirmDeleteVerification(item){
		//	this.checkIndex = this.gridData.indexOf(item);
		//	this.check = Object.assign({}, item);
		//	this.deleteVerificationDialog = true;
		//},
		//confirmDeleteEq(item){
		//	this.checkIndex = this.gridData.indexOf(item);
		//	this.check = Object.assign({}, item);
		//	this.deleteEqDialog = true;
		//},
		//deleteVerification(){
		//	this.loadDelete = true;
		//	this.$http.delete(`/api/equipment/verification/${this.check.id}/vdelete`).then(response => {
		//		this.gridData.splice(this.checkIndex, 1);
		//		this.deleteVerificationDialog = false;
		//		this.loadDelete = false;
		//		this.close();
		//	}).catch(error => (this.deleteVerificationDialog = false, this.loadDelete = false, alert(error.response.data.message)));
		//},
		//deleteEq(){
		//	this.loadDelete = true;
		//	this.$http.delete(`/api/equipment/verification/${this.check.id_kit_row}/edelete`).then(response => {
		//		this.gridData1.splice(this.checkIndex, 1);
		//		this.deleteEqDialog = false;
		//		this.loadDelete = false;
		//		this.close();
		//	}).catch(error => (this.deleteEqDialog = false, this.loadDelete = false, alert(error.response.data.message)));
		//},
		//confirmPrint(item){
		//	this.checkIndex = this.gridData.indexOf(item);
		//	this.check = Object.assign({}, item);
		//	this.printDialog = true;
		//},
		//printCSM(){
		//	let obj = {id_check: this.check.id, descr: this.check.descr};
		//	this.loadDelete = true;
		//	this.$http.post('/api/equipment/printer/csm', obj, {responseType: 'blob'})
		//	.then(response =>{
		//		const file = new Blob([response.data], {type: 'application/pdf'});
		//		fs.saveAs(file, 'ЦСМ.pdf');
		//		this.loadDelete = this.printDialog = false;
		//	}).catch(error => (this.loadDelete = this.printDialog = false, alert('Файл не найден')));

		//},
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		},
		header(){
			if(this.check.id_status_check === 1) return `№ ${this.check.id} - Отправляемое оборудование`;
			if(this.check.id_status_check === 2) return `№ ${this.check.id} - Отправленное оборудование`;
			if(this.check.id_status_check === 3) return `№ ${this.check.id} - Полученное(аемое) оборудование`;
			return 'Подготавливаемое оборудование';
		}
	},
	created(){
		this.getVerification();
	}
  }
</script>