<template>
	<div>
		<v-data-table @item-selected="selectedEquipment" dense v-model="selected" :search="search" :headers="gridColumns.tableColumn" :items="gridData" :items-per-page="50" :loading="gridData.length <= 0" :show-select="true" :custom-filter="customFilter">
			<template v-slot:top>
				<v-toolbar flat dense>
					<v-text-field v-model="search" label="Поиск" single-line hide-details></v-text-field>
					<v-spacer></v-spacer>
					<v-btn icon color="orange">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
					<v-dialog dense v-model="filterDialog" max-width="600">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon color="teal" v-bind="attrs" v-on="on">
								<v-icon>mdi-filter</v-icon>
							</v-btn>
						</template>
						<v-card>
							<v-card-title>Поиск</v-card-title>
							<v-divider></v-divider>
							<v-card-text>
								<v-row>
									<v-col cols="12" md="12">
										<v-text-field type="date" dense outlined label="Дата1" v-model="start_date" @input="filterStartDate"></v-text-field>
										<v-text-field type="date" dense outlined label="Дата2" v-model="end_date" @input="filterEndDate"></v-text-field>
										<!--<v-autocomplete :items="dropdown" :clearable="true" outlined dense label="Вид" v-model="editedItem.doc_type"></v-autocomplete>-->
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-dialog>
					<v-menu offset-y :close-on-content-click="false">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="blue" icon v-bind="attrs" v-on="on">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
						</template>
						<v-list dense>
							<v-list-item v-on:click="confirmPrint()">
								<v-list-item-title>ПТС</v-list-item-title>
							</v-list-item>
							<v-list-group>
								<template v-slot:activator>
									<v-list-item-content>
										<v-list-item-title>Этикетки</v-list-item-title>
									</v-list-item-content>
								</template>
								<v-list-item @click="printSticker('sticker', 'large')">
									<v-list-item-content>
										<v-list-item-title>Большие</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
								<v-list-item @click="printSticker('sticker', 'middle')">
									<v-list-item-content>
										<v-list-item-title>Средние</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
								<v-list-item @click="printSticker('sticker', 'tiny')">
									<v-list-item-content>
										<v-list-item-title>Маленькие</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list-group>
							<v-list-item>
								<v-list-item-title>Таблица проверок</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
					<v-dialog v-model="dialog_verification" max-width="1256px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon color="purple" v-bind="attrs" v-on="on">
								<v-icon>mdi-beaker-check-outline</v-icon>
							</v-btn>
						</template>
						<v-card>
							<v-card-title>Подготавливаемое оборудование на проверку</v-card-title>
							<v-divider></v-divider>
							<v-card-text>
								<v-data-table dense :headers="tableColumn" :items="selected" :show-select="true" v-model="selected">
									<template v-slot:item.date_current_check="{ item }">
										{{ today(item.date_current_check) }}
									</template>
									<template v-slot:item.date_next_check="{ item }">
										{{ today(item.date_next_check) }}
									</template>
								</v-data-table>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="success" :loading="verification" @click="submitVerification()">Сохранить</v-btn>
								<v-btn color="error" @click="dialog_verification = false">Отмена</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.date_current_check="{ item }">
				{{ today(item.date_current_check) }}
			</template>
			<template v-slot:item.date_next_check="{ item }">
				{{ today(item.date_next_check) }}
			</template>
			<template v-slot:item.date_commissioning="{ item }">
				{{ today(item.date_commissioning) }}
			</template>
			<template v-slot:item.tag="{ item }">
				<v-chip color="teal" small text-color="white" v-if="item.is_archive">А</v-chip>
				<v-chip color="green" small text-color="white" v-if="item.is_working">И</v-chip>
				<v-chip color="orange" small text-color="white" v-if="item.is_conservation">К</v-chip>
				<v-chip color="red" small text-color="white" v-if="item.is_repair">Р</v-chip>
				<v-chip color="purple" small text-color="white" v-if="item.is_check">Ц</v-chip>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-btn icon @click="editItem(item)"><v-icon>mdi-cog</v-icon></v-btn>
			</template>
		</v-data-table>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
		<v-dialog v-model="dialog_append_verification" max-width="512px">
			<v-card>
				<v-card-title>Внесение иформации о пройденной проверке</v-card-title>
				<v-divider></v-divider>
				<v-list-item two-line>
					<v-list-item-content>
						<v-list-item-title>{{ editedItem.equipment }}</v-list-item-title>
						<v-list-item-subtitle>{{ editedItem.model }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				<v-divider></v-divider>
				<v-card-text>
					<!--<v-form>-->
						<v-row>
							<v-col cols="12" md="12">
								<v-autocomplete :items="dropdown" :clearable="true" outlined dense label="Вид загружаемого файла" v-model="editedItem.doc_type"></v-autocomplete>
								<v-text-field :clearable="true" dense label="Номер документа" outlined v-model="editedItem.number_document"></v-text-field>
							</v-col>
							<v-col cols="12" md="6">
								<input type="date" is="v-text-field" dense label="Пройденна" outlined v-model="editedItem.date_current_check">
							</v-col>
							<v-col cols="12" md="6">
								<input type="date" is="v-text-field" dense label="Предстоит" outlined v-model="editedItem.date_next_check">
							</v-col>
							<v-file-input :show-size="true" dense outlined label="Файл" placeholder="Выберите файл" v-model="editedItem.file"></v-file-input>
						</v-row>
					<!--</v-form>-->
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-card-title>{{ editedItem.number_card }}</v-card-title>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="passedVerification()" :loading="passed_verification">Сохранить</v-btn>
					<v-btn color="error" @click="dialog_append_verification = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog dense v-model="printDialog" max-width="512">
			<v-card>
				<v-card-title>Формирование ПТС</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-container>
							<v-row align-content="center">
								<v-text-field label="Дата проведения" outlined dense type="date" v-model="dateProtocol"></v-text-field>
							</v-row>
						</v-container>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="printProtocol()" :loading="loadProtocol">Сохранить</v-btn>
					<v-btn color="error" @click="printDialog = false">Отмена</v-btn>
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
			search: '',
			dialog_verification: false,
			dialog_append_verification: false,
			verification: false,
			passed_verification: false,
			selected: [],
			gridColumns: {
				tableColumn: [
					{ text: 'Номер', align: 'start', sortable: true, value: 'number_card', width: 120},
					{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment' },
					{ text: 'Модель', align: 'start', sortable: true, value: 'model' },
					{ text: 'С/Н', align: 'end', sortable: true, value: 'serial_number' },
					{ text: 'Пройденная', align: 'start', sortable: true, value: 'date_current_check'},
					{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
					{ text: '', align: 'center', sortable: false, value: 'tag', filterable: false },
					{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false }
				],
				filterColumn: [
					{'number':'Номер'},
					{'department':'Отдел'},
					{'type':'Вид'}
				]
			},
			tableColumn: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number_card', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model' },
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number' },
				{ text: 'Пройденная', align: 'start', sortable: false, value: 'date_current_check', filterable: false },
				{ text: 'Предстоящая', align: 'start', sortable: false, value: 'date_next_check', filterable: false}
			],
			gridData: [],
			docType: [],
			editedItem: {
				equipment: null,
				number_card: null,
				model: null,
				date_current_check: null,
				date_next_check: null,
				number_document: null,
				file: null
			},
			overlay: false,
			printDialog: false,
			loadProtocol: false,
			dateProtocol: null,
			filterDialog: false,
			filters: {
				//department: [],
				//type: [],
				start_date: null,
				end_date: null
			},
			start_date: null,
			end_date: null,
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
	watch: {
		dialog_append_verification(newVal, oldVal){
			if(newVal === true && this.docType.length <= 0)
				this.$http.get('/api/equipment/support/documents').then(response => (this.docType = response.data)).catch(error => (alert(error.response.data.message)));
		}
	},
	methods: {
      customFilter(items, filters, filter, headers) {
        // Init the filter class.
        const cf = new this.$MultiFilters(items, filters, filter, headers);
        // Use regular function(),
        // arrow functions does not allow context binding.
        // Register "start_date" filter.
        cf.registerFilter('start_date', function (start_date, items) {
          // If the filter has not been applied yet
          // just return all available items.
          if (start_date === null) return items;
          // Compare each item start_date and just return the matching ones.
          return items.filter(item => {
            return item.date_next_check >= start_date;
          }, start_date);
        });
        // Use regular function(),
        // arrow functions does not allow context binding.
        // Register "end_date" filter.
        cf.registerFilter('end_date', function (end_date, items) {
          // If the filter has not been applied yet
          // just return all available items.
          if (end_date === null) return items;
          // Compare each item end_date and just return the matching ones.
          return items.filter(item => {
            return item.date_next_check <= end_date;
          }, end_date);
        });
        // Its time to run all created filters.
        // Will be executed in the order thay were defined.
        return cf.runFilters();
	  },
	  filterStartDate(val){
        const timestamp = new Date(val + 'T00:00:00Z').getTime();
        this.filters = this.$MultiFilters.updateFilters(this.filters, {start_date: val});
	  },
	  filterEndDate(val){
        const timestamp = new Date(val + 'T00:00:00Z').getTime();
        this.filters = this.$MultiFilters.updateFilters(this.filters, {end_date: val});
	  },
		selectedEquipment(info){
			if(info.value)
				this.$emit('id', info.item.id);
		},
		getEquipment(){
			this.$http.get('/api/equipment/metrolog').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			if(date === null) return;
			return new Date(date).toLocaleString().split(',')[0];
		},
		submitVerification(){
			let request = [];
			for(let i in this.selected)
			{
				request.push({
					id_department: this.selected[i].id_department,
					id_equipment: this.selected[i].id
				});
			}
			this.verification = true;
			this.$http.post("/api/equipment/verification", JSON.stringify(request), {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.dialog_verification = false, this.verification = false, this.selected = [])).catch(error => (this.verification = false, alert(error.response.data.message)));
		},
		passedVerification(){
			let formData = new FormData();
			formData.append('id_equipment', this.editedItem.id);
			formData.append('date_current_check', this.editedItem.date_current_check);
			formData.append('date_next_check', this.editedItem.date_next_check);
			formData.append('id_upload_document_type', this.editedItem.doc_type);
			formData.append('number_document', this.editedItem.number_document);
			formData.append('file', this.editedItem.file);
			this.passed_verification = true;
			this.$http.post("/api/equipment/equipments/" + this.editedItem.id + "/passed", formData, {headers: {'Content-Type': 'multipart/form-data'}})
			.then(response => (this.dialog_append_verification = false, this.passed_verification = false, this.selected = [])).catch(error => (this.passed_verification = false, alert(error.response.data.message)));
		},
		editItem(item) {
			this.editedItem = Object.assign({}, item);
			this.dialog_append_verification = true;
		},
		printSticker(type = null, size = null) {
			if(this.selected.length > 0)
			{
				let obj = [];
				for (let item in this.selected)
					obj.push(this.selected[item].id);
				let objs = {size: size, item: obj};
				this.overlay = true;
				this.$http.post(`/api/equipment/printer/${type}`, objs, {responseType: 'blob'})
				.then(response =>{
					const file = new Blob([response.data], {type: 'application/pdf'});
					fs.saveAs(file, 'Этикетки.pdf');
					this.overlay = false;
				}).catch(error => (this.overlay = false, alert(error.response.data.message)));
			}
			else alert('Не выбрано оборудование');
		},
		confirmPrint(item){
			if(this.selected.length > 0) this.printDialog = true;
			else alert('Не выбрано оборудование');
		},
		printProtocol() {
			let obj = [];
			for (let item in this.selected) obj.push(this.selected[item].id);
			let objs = {item: obj, date: this.dateProtocol};
			this.loadProtocol = true;
			this.$http.post('/api/equipment/printer/protocol', objs, {responseType: 'blob'})
			.then(response =>{
				const file = new Blob([response.data], {type: 'application/pdf'});
				fs.saveAs(file, 'ПТС.pdf');
				this.loadProtocol = false;
			}).catch(error => (this.loadProtocol = false, alert(error.response.data.message)));
		},
		//returnUniq(column){
		//	let result = [];
		//	let resa = [];
		//	for (let str of this.gridData)
		//		if (!result.includes(str[column]))
		//			result.push(str[column]);
		//		result = result.slice().sort(function (a, b){
		//			if(a === b) return 0 ;
		//			else if (a > b) return 1;
		//			else return - 1;
		//		});
		//	for (let res of result)
		//	{
		//		resa.push({key: res, value: res, text: res});
		//	}
		//	return resa;
		//}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
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
	created(){
		this.getEquipment();
	}
  }
</script>