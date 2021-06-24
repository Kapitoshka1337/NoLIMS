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
				<template v-slot:item.claim_check="{item}">
					{{ item.claim_check || 'Не указан' }}
				</template>
				<template v-slot:item.totals="{ item }">
					{{ item.cnt_before }} / {{ item.cnt_after }} (<strong>{{ item.cnt_total }}</strong>)
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn small icon color="orange" v-on:click="selectedVerification(item)"><v-icon>mdi-eye</v-icon></v-btn>
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
						<v-data-table dense :headers="tableColumn1" :items="gridData1"
						:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">>							
							<template v-slot:item.date_received_before="{ item }">
								{{ today(item.date_received_before) }}
							</template>
							<template v-slot:item.date_received_after="{ item }">
								{{ today(item.date_received_after) }}
							</template>
							<template v-slot:item.date_received_department="{ item }">
								{{ today(item.date_received_department) }}
							</template>
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
			<v-dialog dense persistent v-model="deleteVerificationDialog" max-width="300px">
				<v-card>
					<v-card-title>Подтверждение удаления</v-card-title>
					<v-card-text><v-icon color="red">mdi-alert</v-icon> Удалить заявку № {{ check.id }}?</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success">Удалить</v-btn>
						<v-btn color="error" @click="deleteVerificationDialog = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense persistent v-model="deleteEqDialog" max-width="300px">
				<v-card>
					<v-card-title>Подтверждение удаления</v-card-title>
					<v-card-text><v-icon color="red">mdi-alert</v-icon> Удалить {{ check.equipment }}?</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success">Удалить</v-btn>
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
									<v-text-field label="Приложение к договору" outlined dense v-model="check.descr"></v-text-field>
								</v-row>
							</v-container>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="printCSM()" :loading="loadDelete">Сформировать</v-btn>
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
						<v-btn color="success">Отправить</v-btn>
						<v-btn color="error" @click="playDialog = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<passed-dialog :visible="showPassed" :equipment="kit" @close="closeDialog()" @submit="submitAfter" :internal-submit="true"></passed-dialog>
		</v-col>
	</v-row>
</template>

<script>
import fs from 'file-saver';
import passedDialog from '../../../../equipment/metrolog/component/PassedVerification.vue';

export default {
	components:{
		passedDialog
	},
	data () {
		return {
			tableColumn: [
				{ text: '№', align: 'start', sortable: true, value: 'id'},
				{ text: 'Сформировано', align: 'start', sortable: true, value: 'date_create', filterable: false},
				{ text: 'Отправлено', align: 'start', sortable: true, value: 'date_submit', filterable: false},
				{ text: 'Сформировал', align: 'start', sortable: true, value: 'user'},
				{ text: 'Номер квитанции', align: 'start', sortable: true, value: 'claim_check'},
				{ text: 'Подготовленно/Поверенно', align: 'start', sortable: false, value: 'totals', filterable: false },
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false }
			],
			tableColumn1: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number_card', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model'},
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number', filterable: false },
				{ text: 'Принесли', align: 'end', sortable: false, value: 'date_received_before'},
				{ text: 'Получено из ЦСМ', align: 'end', sortable: false, value: 'date_received_after'},
				{ text: 'Отдано', align: 'end', sortable: false, value: 'date_received_department' },
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false, width: 100}
			],
			search: '',
			gridData: [
                {
                    claim_check: null,
                    cnt_after: "0",
                    cnt_before: "0",
                    cnt_total: 3,
                    date_create: "2021-06-16",
                    date_submit: null,
                    id: 135,
                    id_status_check: 1,
                    user: "Швецов А.С. (метролог)",
                    content: [
                        {
                            date_received_after: null,
                            date_received_before: null,
                            date_received_department: null,
                            equipment: "Колориметр фотоэлектрический",
                            id_checks: 135,
                            id_equipment: 213,
                            id_kit_row: 757,
                            id_status_check: 1,
                            is_received_after: 0,
                            is_received_before: 0,
                            is_received_department: 0,
                            model: "КФК-2",
                            number_card: "84/С - СИ",
                            serial_number: "8807232"
                        },
                        {
                            date_received_after: null,
                            date_received_before: null,
                            date_received_department: null,
                            equipment: "Фотометр фотоэлектрический",
                            id_checks: 135,
                            id_equipment: 1069,
                            id_kit_row: 758,
                            id_status_check: 1,
                            is_received_after: 0,
                            is_received_before: 0,
                            is_received_department: 0,
                            model: "КФК-3",
                            number_card: "31/С - СИ",
                            serial_number: "9112823"
                        },
                        {
                            date_received_after: null,
                            date_received_before: null,
                            date_received_department: null,
                            equipment: "Фотометр фотоэлектрический КФК -3-01",
                            id_checks: 135,
                            id_equipment: 1229,
                            id_kit_row: 759,
                            id_status_check: 1,
                            is_received_after: 0,
                            is_received_before: 0,
                            is_received_department: 0,
                            model: "ЗОМЗ",
                            number_card: "50/И - СИ",
                            serial_number: "0800114"
                        }
                    ]
                },
                {
                    claim_check: "0-10175 0-10176 0-10177",
                    cnt_after: "0",
                    cnt_before: "2",
                    cnt_total: 2,
                    date_create: "2021-06-08",
                    date_submit: "2021-06-08",
                    id: 133,
                    id_status_check: 2,
                    user: "Швецов А.С. (метролог)",
                    content: [
                        {
                            date_received_after: null,
                            date_received_before: "2021-06-08",
                            date_received_department: null,
                            equipment: "Измеритель деформации клейковины",
                            id_checks: 133,
                            id_equipment: 153,
                            id_kit_row: 742,
                            id_status_check: 2,
                            is_received_after: 0,
                            is_received_before: 1,
                            is_received_department: 0,
                            model: "ИДК-3М",
                            number_card: "12/04 - СИ",
                            serial_number: "5249"
                        },
                        {
                            date_received_after: null,
                            date_received_before: "2021-06-08",
                            date_received_department: null,
                            equipment: "Термометр складской",
                            id_checks: 133,
                            id_equipment: 474,
                            id_kit_row: 743,
                            id_status_check: 2,
                            is_received_after: 0,
                            is_received_before: 1,
                            is_received_department: 0,
                            model: "ТС-7АМ",
                            number_card: "125/07 - СИ",
                            serial_number: "95"
                        }
                    ]
                },
                {
                    claim_check: "0-7824, 0-7823",
                    cnt_after: "3",
                    cnt_before: "3",
                    cnt_total: 3,
                    date_create: "2021-05-05",
                    date_submit: "2021-05-05",
                    id: 122,
                    id_status_check: 3,
                    user: "Швецов А.С. (метролог)",
                    content: [
                        {
                            date_received_after: "2021-05-19",
                            date_received_before: "2021-05-05",
                            date_received_department: "2021-05-26",
                            equipment: "Дозатор пипеточный",
                            id_checks: 122,
                            id_equipment: 185,
                            id_kit_row: 677,
                            id_status_check: 3,
                            is_received_after: 1,
                            is_received_before: 1,
                            is_received_department: 1,
                            model: "1 \"Колор\" ДПОПц-1-100-1000",
                            number_card: "47/04 - СИ",
                            serial_number: "BN50307"
                        },
                        {
                            date_received_after: "2021-05-19",
                            date_received_before: "2021-05-05",
                            date_received_department: "2021-05-26",
                            equipment: "Дозатор механический 1-канальный",
                            id_checks: 122,
                            id_equipment: 262,
                            id_kit_row: 678,
                            id_status_check: 3,
                            is_received_after: 1,
                            is_received_before: 1,
                            is_received_department: 1,
                            model: "Biohit  (0,5-10)мкл",
                            number_card: "17/05 - СИ",
                            serial_number: "11086865"
                        },
                        {
                            date_received_after: "2021-05-19",
                            date_received_before: "2021-05-05",
                            date_received_department: "2021-05-26",
                            equipment: "Дозатор пипеточный",
                            id_checks: 122,
                            id_equipment: 269,
                            id_kit_row: 679,
                            id_status_check: 3,
                            is_received_after: 1,
                            is_received_before: 1,
                            is_received_department: 1,
                            model: "Колор ДПОПц- 1-20-200",
                            number_card: "25/05 - СИ",
                            serial_number: "BN71621"
                        }
                    ]
                }
            ],
			gridData1: [],
			dialog: false,
			param: false,
			deleteVerificationDialog: false,
			deleteEqDialog: false,
			printDialog: false,
			playDialog: false,
			loadDelete: false,
			claim_check: null,
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
			kitDefault: {
				date_received_after: null,
				date_received_department: null,
				date_received_before: null,
				equipment: null,
				id_checks: null,
				id_kit_row: null,
				id_status_check: null,
				is_received_after: null,
				is_received_before: null,
				is_received_department: null,
				model: null,
				number: null,
				serial_number: null,
				id_equipment: null
			},
			kit: {
				date_received_after: null,
				date_received_department: null,
				date_received_before: null,
				equipment: null,
				id_checks: null,
				id_kit_row: null,
				id_status_check: null,
				is_received_after: null,
				is_received_before: null,
				is_received_department: null,
				model: null,
				number: null,
				serial_number: null,
				id_equipment: null
			},
			checkIndex: -1,
			kitIndex: -1,
			overlay: false,
			showPassed: false
		}
	},
	methods: {
		today(date){
			return date === null ? '' : new Date(date).toLocaleString().split(',')[0];
		},
		selectedVerification(item){
			this.gridData1 = item.content;
            this.dialog = true;
		},
		beforeRecieved(item){
			this.kitIndex = this.gridData1.indexOf(item);
			this.kit = Object.assign({}, item);
			if(!item.is_received_before && !item.is_received_after)
				this.submitBefore();
			else if(item.is_received_before && item.is_received_after && !item.is_received_department)
				this.submitDepartment();
			else if(item.id_status_check === 2 || 3)
				this.showPassed = true;
			//else if(item.is_received_before && !item.is_received_after)
		},
		submitBefore(){
			this.param = true;
			this.$http.put(`/api/equipment/verification/${this.kit.id_checks}/${this.kit.id_kit_row}/before`)
			.then(response => {
				this.param = false;
				Object.assign(this.gridData[this.checkIndex], response.data.check);
				Object.assign(this.gridData1[this.kitIndex], response.data.kit);
			}).catch(error => (this.param = false, alert(error.response.data.message), this.close()));
		},
		submitDepartment(){
			this.param = true;
			this.$http.put(`/api/equipment/verification/${this.kit.id_checks}/${this.kit.id_kit_row}/department`)
			.then(response => {
				this.param = false;
				Object.assign(this.gridData[this.checkIndex], response.data.check);
				Object.assign(this.gridData1[this.kitIndex], response.data.kit);
			}).catch(error => (this.param = false, alert(error.response.data.message), this.close()));
		},
		submitAfter(data){
			let prepare = data;
			let formData = new FormData();
			formData.append('id_equipment', this.kit.id_equipment);
			formData.append('date_current_check', prepare.date_current_check);
			formData.append('date_next_check', prepare.date_next_check);
			formData.append('id_upload_document_type', prepare.id_upload_document_type);
			formData.append('number_document', prepare.number_document);
			formData.append('file', prepare.file);

			this.$http.post(`/api/equipment/verification/${this.kit.id_checks}/${this.kit.id_kit_row}/after`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
			.then(response => {
				this.closeDialog();
				Object.assign(this.gridData[this.checkIndex], response.data.check);
				Object.assign(this.gridData1[this.kitIndex], response.data.kit);
			}).catch(error => (alert(error.response.data.message), this.showPassed = false));
		},
		closeDialog(){
			this.showPassed = false;
		},
		close(){
			this.param = false;
			this.$nextTick(() => {
				this.check = Object.assign({}, this.checkDefault);
				this.kit = Object.assign({}, this.kitDefault);
				this.checkIndex = -1;
				this.kitIndex = -1;
			})
		},
		confirmPlay(item){
			this.checkIndex = this.gridData.indexOf(item);
			this.check = Object.assign({}, item);
			this.playDialog = true;
		},
		play(){
			this.loadDelete = true;
			this.$http.put(`/api/equipment/verification/${this.check.id}/play`, {claim_check: this.claim_check}).then(response => (
					this.playDialog = false,
					this.loadDelete = false,
					Object.assign(this.gridData[this.checkIndex], response.data.check))
				).catch(error => (this.loadDelete = false, alert(error.response.data.message)));
		},
		confirmDeleteVerification(item){
			this.checkIndex = this.gridData.indexOf(item);
			this.check = Object.assign({}, item);
			this.deleteVerificationDialog = true;
		},
		confirmDeleteEq(item){
			this.kitIndex = this.gridData1.indexOf(item);
			this.kit = Object.assign({}, item);
			this.deleteEqDialog = true;
		},
		deleteVerification(){
			this.loadDelete = true;
			this.$http.delete(`/api/equipment/verification/${this.check.id}/vdelete`).then(response => {
				this.gridData.splice(this.checkIndex, 1);
				this.deleteVerificationDialog = false;
				this.loadDelete = false;
				this.close();
			}).catch(error => (this.deleteVerificationDialog = false, this.loadDelete = false, alert(error.response.data.message)));
		},
		deleteEq(){
			this.loadDelete = true;
			this.$http.delete(`/api/equipment/verification/${this.kit.id_kit_row}/edelete`).then(response => {
				Object.assign(this.gridData[this.checkIndex], response.data.check);
				this.gridData1.splice(this.kitIndex, 1);
				this.deleteEqDialog = false;
				this.loadDelete = false;
				this.close();
			}).catch(error => (this.deleteEqDialog = false, this.loadDelete = false, alert(error.response.data.message)));
		},
		confirmPrint(item){
			this.checkIndex = this.gridData.indexOf(item);
			this.check = Object.assign({}, item);
			this.printDialog = true;
		},
		printCSM(){
			let obj = {id_check: this.check.id, descr: this.check.descr};
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
		header(){
			if(this.check.id_status_check === 1) return `№ ${this.check.id} - Отправляемое оборудование`;
			if(this.check.id_status_check === 2) return `№ ${this.check.id} - Отправленное оборудование`;
			if(this.check.id_status_check === 3) return `№ ${this.check.id} - Полученное(аемое) оборудование`;
			return 'Подготавливаемое оборудование';
		}
	}
  }
</script>