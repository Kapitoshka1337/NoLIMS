<template>
	<v-dialog dense persistent v-model="getVisible" max-width="512px">
		<v-card>
			<v-card-title>Добавление пройденной поверки</v-card-title>
			<v-divider></v-divider>
			<v-list-item two-line>
				<v-list-item-content>
					<v-list-item-title>{{ getEquipment.equipment }}</v-list-item-title>
					<v-list-item-subtitle>{{ getEquipment.model }}</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col cols="12" md="12">
						<v-autocomplete :loading="loadSelect" :disabled="loadSelect" :items="dropdown" :clearable="true" outlined dense label="Вид загружаемого файла" v-model="passedData.id_upload_document_type"></v-autocomplete>
						<v-text-field :clearable="true" dense label="Номер документа" outlined v-model="passedData.number_document"></v-text-field>
					</v-col>
					<v-col cols="12" md="6">
						<input type="date" is="v-text-field" dense label="Пройденная поверка" outlined v-model="passedData.date_current_check">
					</v-col>
					<v-col cols="12" md="6">
						<input type="date" is="v-text-field" dense label="Предстоящая поверка" outlined v-model="passedData.date_next_check">
					</v-col>
					<v-file-input :show-size="true" dense outlined label="Файл" placeholder="Выберите файл" v-model="passedData.file"></v-file-input>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-card-title>{{ getEquipment.number_card }}</v-card-title>
				<v-spacer></v-spacer>
				<v-btn color="success" @click="submit()" :loading="loading" v-bind:disabled="isTime">Добавить поверку</v-btn>
				<v-btn color="error" v-on:click="closeDialog()">Не добавлять</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	props:{
		visible: {type: Boolean},
		internalSubmit: {type: Boolean},
		equipment: {type: Object}
	},
	data(){
		return{
			passedData:{
				date_current_check: null,
				date_next_check: null,
				id_upload_document_type: null,
				number_document: null,
				file: null
			},
			docType: [],
			loading: false,
			loadSelect: false
		}
	},
	methods:{
		closeDialog(value){
			this.$emit('close', value);
			this.loading = false;
		},
		submit(){
			if(this.getInternalSubmit)
			{
				this.$emit('submit', this.passedData);
				this.loading = true;
				return true;
			}

			let formData = new FormData();
			formData.append('id_equipment', this.getEquipment.id_equipment);
			formData.append('date_current_check', this.passedData.date_current_check);
			formData.append('date_next_check', this.passedData.date_next_check);
			formData.append('id_upload_document_type', this.passedData.id_upload_document_type);
			formData.append('number_document', this.passedData.number_document);
			formData.append('file', this.passedData.file);
			this.loading = true;
			this.$http.post(`/api/equipment/equipments/${this.getEquipment.id_equipment}/passed`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
			.then(response => (this.closeDialog())).catch(error => (alert(error.response.data.message), this.closeDialog()));
		}
	},
	computed: {
		getVisible:{
			get(){
				return this.visible;
			},
			set(value){
				this.closeDialog(value);
			}
		},
		getEquipment(){
			return this.equipment
		},
		getInternalSubmit(){
			return this.internalSubmit
		},
		isTime(){
			let current = new Date(this.passedData.date_current_check);
			let next = new Date(this.passedData.date_next_check);
			return (current.getUTCFullYear() >= next.getUTCFullYear()) || current.getUTCFullYear() === null || next.getUTCFullYear() === null
		},
		nextDate(){
			return this.passedData.date_current_check;
		},
		dropdown(){
			if(this.docType.length > 0)
			{
				let result = [];
				for (let str of this.docType)
					result.push({value: str['id'], text: str['title']});
				return result;
			}
		}
	},
	watch: {
		getVisible(newVal, oldVal){
			if(newVal && this.docType.length <= 0)
			{
				this.loadSelect = true;
				this.$http.get('/api/equipment/support/documents').then(response => (this.docType = response.data, this.loadSelect = false)).catch(error => (alert(error.response.data.message), this.loadSelect = false));
			}
			if(!newVal)
				this.closeDialog()
		},
		'passedData.date_current_check': function(newVal, oldVal){
			let date = new Date(newVal);
			date.setFullYear(date.getFullYear() + 1);
			this.passedData.date_next_check = date.toISOString().split('T')[0];
		}
	}
}
</script>