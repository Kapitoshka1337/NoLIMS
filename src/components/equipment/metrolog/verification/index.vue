<template>
	<v-row>
		<v-col cols="12">
			<v-data-table dense :search="search" :headers="tableColumn" :items="gridData" :items-per-page="50" :loading="gridData.length <= 0" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus'}">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Управление проверками</v-toolbar-title>
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
				<template v-slot:item.claim_check="{item}">
					{{ item.claim_check || 'Не указан' }}
				</template>
				<template v-slot:item.totals="{ item }">
					{{ item.cnt_before }} / {{ item.cnt_after }} (<strong>{{ item.cnt_total }}</strong>)
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn small icon color="orange" v-on:click="selectedRow(item)"><v-icon>mdi-eye</v-icon></v-btn>
					<v-btn small icon color="blue" v-on:click="confirmPrint(item)"><v-icon>mdi-printer</v-icon></v-btn>
					<v-btn small icon color="red" v-on:click="confirmDeleteVerification(item)" v-if="item.id_status_check != 2 && item.id_status_check != 3"><v-icon>mdi-delete</v-icon></v-btn>
					<v-btn small icon color="green" v-if="!item.date_submit" v-on:click="confirmPlay(item)"><v-icon>mdi-play</v-icon></v-btn>
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
						<v-data-table dense :headers="tableColumn1" :items="gridData1">
							<template v-slot:item.actions="{ item }">
								<v-btn small icon v-bind:color="item.is_received_before && !item.is_received_after ? 'orange': item.is_received_before && item.is_received_after ? 'green' : 'red'" v-on:click="submitBefore(item)" :loading="param"><v-icon>mdi-checkbox-marked</v-icon></v-btn>
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
			<v-dialog dense persistent v-model="deleteVerificationDialog" max-width="300px">
				<v-card>
					<v-card-title>Подтверждение удаления</v-card-title>
					<v-card-text><v-icon color="red">mdi-alert</v-icon> Удалить заявку № {{ item.id }}?</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="deleteVerification()" :loading="loadDelete">Удалить</v-btn>
						<v-btn color="error" @click="deleteVerificationDialog = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense persistent v-model="deleteEqDialog" max-width="300px">
				<v-card>
					<v-card-title>Подтверждение удаления</v-card-title>
					<v-card-text><v-icon color="red">mdi-alert</v-icon> Удалить {{ item.equipment }}?</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="deleteEq()" :loading="loadDelete">Удалить</v-btn>
						<v-btn color="error" @click="deleteEqDialog = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense v-model="printDialog" max-width="512">
				<v-card>
					<v-card-title>Формирование заявки</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-container>
								<v-row align-content="center">
									<v-text-field label="Приложение к договору" outlined dense v-model="item.descr"></v-text-field>
								</v-row>
							</v-container>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="printCSM()" :loading="loadDelete">Сохранить</v-btn>
						<v-btn color="error" @click="printDialog = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense v-model="playDialog" max-width="512">
				<v-card>
					<v-card-title>Отправка оборудования</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-container>
								<v-row align-content="center">
									<v-text-field label="Номер квитанции" outlined dense v-model="claim_check"></v-text-field>
								</v-row>
							</v-container>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="play()" :loading="loadDelete">Сохранить</v-btn>
						<v-btn color="error" @click="playDialog = false">Отмена</v-btn>
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
				{ text: 'Сформировал', align: 'start', sortable: true, value: 'user'},
				{ text: 'Номер квитанции', align: 'start', sortable: true, value: 'claim_check'},
				{ text: 'Полученю/Отправлено', align: 'start', sortable: false, value: 'totals', filterable: false },
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false }
			],
			tableColumn1: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model'},
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number', filterable: false },
				{ text: 'Подготовка', align: 'end', sortable: false, value: 'date_recieved_before' },
				{ text: 'Получение', align: 'end', sortable: false, value: 'date_recieved_after' },
				{ text: 'Отпуск', align: 'end', sortable: false, value: 'date_recieved_department' },
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false, width: 100}
			],
			search: '',
			gridData: [],
			verificationInfo: {},
			gridData1: [],
			dialog: false,
			param: false,
			deleteVerificationDialog: false,
			deleteEqDialog: false,
			printDialog: false,
			playDialog: false,
			loadDelete: false,
			item: {},
			claim_check: null,
			check: {},
			overlay: false
		}
	},
	methods: {
		getVerification(){
			this.$http.get('/api/equipment/verification').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			return date === null ? '' : new Date(date).toLocaleString().split(',')[0];
		},
		selectedRow(data){
			this.verificationInfo = data;
			this.overlay = true;
			this.$http.get('/api/equipment/verification/' + data.id + "/equipments").then(response => (this.gridData1 = response.data, this.overlay = false, this.dialog = true)).catch(error => (this.overlay = false, alert(error.response.data.message)));
		},
		submitBefore(item){
			let param;

			if(!item.is_received_before && !item.is_received_after)
				param = 'before';
			else if(item.is_received_before && !item.is_received_after) 
				param = 'after';
			else
				return;
			
			this.param = true;
			this.$http.put(`/api/equipment/verification/${item.id_checks}/${item.id_kit_row}/${param}`)
			.then(response => {
				item[`is_received_${param}`] = true;
				this.verificationInfo[`cnt_${param}`]++;
				this.param = false
			}).catch(error => (this.param = false, alert(error.response.data.message)));
		},
		confirmPlay(item){
			this.item = item;
			this.playDialog = true;
		},
		play(){
			this.loadDelete = true;
			this.$http.put(`/api/equipment/verification/${this.item.id}/play`, {claim_check: this.claim_check}).then(response => (this.playDialog = false, this.item.date_submit = new Date(), this.item.id_status_check = 2, this.item.claim_check = this.claim_check, this.loadDelete = false, this.item = {})).catch(error => (this.item = {}, this.loadDelete = false, alert(error.response.data.message)));
		},
		confirmDeleteVerification(item){
			this.item = item;
			this.deleteVerificationDialog = true;
		},
		confirmDeleteEq(item){
			this.item = item;
			this.deleteEqDialog = true;
		},
		deleteVerification(){
			this.loadDelete = true;
			this.$http.delete(`/api/equipment/verification/${this.item.id}/vdelete`).then(response => {
				this.gridData.splice(this.gridData.indexOf(this.item), 1);
				this.deleteVerificationDialog = false;
				this.loadDelete = false;
				this.item = {};
			}).catch(error => (this.deleteVerificationDialog = false, this.loadDelete = false, alert(error.response.data.message)));
		},
		deleteEq(){
			this.loadDelete = true;
			this.$http.delete(`/api/equipment/verification/${this.item.id_kit_row}/edelete`).then(response => {
				this.gridData1.splice(this.gridData.indexOf(this.item), 1);
				this.deleteEqDialog = false;
				this.loadDelete = false;
				this.item = {};
			}).catch(error => (this.deleteEqDialog = false, this.loadDelete = false, alert(error.response.data.message)));
		},
		confirmPrint(item){
			this.item = item;
			this.printDialog = true;
		},
		printCSM(){
			let obj = {id_check: this.item.id, descr: this.item.descr};
			this.loadDelete = true;
			this.$http.post('/api/equipment/printer/csm', obj, {responseType: 'blob'})
			.then(response =>{
				const file = new Blob([response.data], {type: 'application/pdf'});
				fs.saveAs(file, 'ЦСМ.pdf');
				this.loadDelete = this.printDialog = false;
			}).catch(error => (this.loadDelete = this.printDialog = false, alert('Файл не найден')));

		},
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