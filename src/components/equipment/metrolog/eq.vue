<template>
	<div>
		<v-data-table
			@item-selected="selectedEquipment"
			dense
			v-model="selected"
			:headers="gridColumns.tableColumn"
			:items="gridData"
			:items-per-page="50"
			:loading="gridData.length <= 0" 
			:show-select="true"
			:search="search"
			item-key="id"
			:custom-filter="filterTags">
			<template v-slot:header.date_current_check="{header}">
				{{header.text}}
				<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="indigo" icon v-bind="attrs" v-on="on">
							<v-icon small color="red">mdi-filter-variant</v-icon>
						</v-btn>
					</template>
					<v-card>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12">
									<v-text-field small type="date" dense outlined label="Дата1" v-model="filters.current_start_date"></v-text-field>
									<v-text-field small type="date" dense outlined label="Дата2" v-model="filters.current_end_date" ></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					</v-card>
				</v-menu>
			</template>
			<template v-slot:header.date_next_check="{header}">
				{{header.text}}
				<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="indigo" icon v-bind="attrs" v-on="on">
							<v-icon small color="red">mdi-filter-variant</v-icon>
						</v-btn>
					</template>
					<v-card>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12">
									<v-text-field small type="date" dense outlined label="Дата1" v-model="filters.next_start_date"></v-text-field>
									<v-text-field small type="date" dense outlined label="Дата2" v-model="filters.next_end_date" ></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					</v-card>
				</v-menu>
			</template>
			<template v-slot:header.tag="{header}">
				{{header.text}}
				<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="indigo" icon v-bind="attrs" v-on="on">
							<v-icon small color="red">mdi-filter-variant</v-icon>
						</v-btn>
					</template>
					<v-list flat dense>
						<v-list-item-group multiple v-model="filters.tags">
							<v-list-item v-for="tag in filters.tag" :key="tag.text" :ripple="false" :value="tag.value">
								<template v-slot:default="{active}">
									<v-list-item-action>
										<v-checkbox :input-value="active" :ripple="false" dense :color="tag.color" :label="tag.text"></v-checkbox>
									</v-list-item-action>
								</template>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-menu>
			</template>
			<template v-slot:top>
				<v-toolbar flat dense>
					<v-text-field v-model="search" label="Поиск" single-line hide-details></v-text-field>
					<v-spacer></v-spacer>
					<v-dialog dense v-model="createDialog" max-width="1256">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon color="orange" v-bind="attrs" v-on="on">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</template>
						<v-card>
							<v-card-title>Новое оборудование</v-card-title>
							<v-divider></v-divider>
							<v-card-text>
								<v-row>
									<v-col cols="6" md="6">
										<v-textarea :rows="2" :height="60" dense label="Оборудование" outlined v-model="newEquipment.title"></v-textarea>
									</v-col>
									<v-col cols="6">
										<v-textarea :rows="2" :height="60" dense label="Производитель" outlined v-model="newEquipment.manufacturer"></v-textarea>
									</v-col>
									<v-col cols="3">
										<v-text-field clearable dense label="Модель" outlined v-model="newEquipment.model"></v-text-field>
									</v-col>
									<v-col cols="3">
										<v-text-field clearable dense label="Серийный номер" outlined v-model="newEquipment.serial_number"></v-text-field>
									</v-col>
									<v-col cols="3">
										<v-text-field type="date" clearable dense label="Дата изготовления" outlined v-model="newEquipment.date_create"></v-text-field>
									</v-col>
									<v-col cols="3">
										<v-text-field clearable dense label="Инвентарный номер" outlined v-model="newEquipment.inventory_number"></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field clearable dense label="Номер" outlined v-model="newEquipment.number"></v-text-field>
									</v-col>
									<v-col cols="4">
		                                <v-autocomplete clearable :items="dropdownCreate('department')" v-model="newEquipment.id_department" outlined dense label="Отдел"></v-autocomplete>
									</v-col>
									<v-col cols="4">
										<v-autocomplete clearable :items="filteredLocation" outlined dense label="Кабинет" v-model="newEquipment.id_location"></v-autocomplete>
									</v-col>
									<v-col cols="4">
										<v-autocomplete clearable :items="dropdownCreate('type')" v-model="newEquipment.id_equipment_type" outlined dense label="Вид"></v-autocomplete>
									</v-col>
								</v-row>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="success" v-on:click="createEq()" :loading="loadCreate">Сохранить</v-btn>
								<v-btn color="error" @click="createDialog = false">Отмена</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
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
				<v-chip-group>
					<v-chip color="teal" small text-color="white" v-if="item.is_archive">А</v-chip>
					<v-chip color="green" small text-color="white" v-if="item.is_working" @click="filterTags">И</v-chip>
					<v-chip color="orange" small text-color="white" v-if="item.is_conservation">К</v-chip>
					<v-chip color="red" small text-color="white" v-if="item.is_repair">Р</v-chip>
					<v-chip color="purple" small text-color="white" v-if="item.is_check">Ц</v-chip>
				</v-chip-group>
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
					{ text: 'Пройденная', align: 'start', sortable: true, value: 'date_current_check', width: 170, filter: this.filterCurrentDate},
					{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check', width: 170, filter: this.filterNextDate},
					{ text: 'Тег', align: 'center', sortable: false, value: 'tag', width: 100, filter: this.test },
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
			createDialog: false,
			loadCreate: false,
			newEquipment: {},
			filters: {
				current_start_date: null,
				current_end_date: null,
				next_start_date: null,
				next_end_date: null,
				tag: [
					{text: 'Архив', value: 'is_archive', color: 'teal'},
					{text: 'Используется', value: 'is_working', color: 'green'},
					{text: 'Консервация', value: 'is_conservation', color: 'orange'},
					{text: 'Ремонт', value: 'is_repair', color: 'red'},
					{text: 'ЦСМ', value: 'is_check', color: 'purple'}
				],
				tags: []
			},
			depLocation: null,
			tag: null
		}
	},
	watch: {
		dialog_append_verification(newVal, oldVal){
			if(newVal === true && this.docType.length <= 0)
				this.$http.get('/api/equipment/support/documents').then(response => (this.docType = response.data)).catch(error => (alert(error.response.data.message)));
		},
		createDialog(newVal, oldVal){
			if(newVal === true && !this.depLocation)
				this.$http.get('/api/equipment/support/locations').then(response => (this.depLocation = response.data)).catch(error => (alert(error.response.data.message)));
		}
	},
	methods: {
		filterCurrentDate(val){
			if (!this.filters.current_start_date && !this.filters.current_end_date) return true;
			return val >= this.filters.current_start_date && val <= this.filters.current_end_date;
			//const timestamp = new Date(val + 'T00:00:00Z').getTime();
			//this.filters = this.$MultiFilters.updateFilters(this.filters, {start_date: val});
		},
		filterNextDate(val){
			if (!this.filters.next_start_date && !this.filters.next_end_date) return true;
			return val >= this.filters.next_start_date && val <= this.filters.next_end_date;
		},
		filterTags(value, search, item){
			return this.filters.tags.filter(x => item.hasOwnProperty);
			//return value != null && search != null && typeof value === 'string' && value.toString().toLocaleUpperCase().indexOf(search) !== -1
			//console.log(this.filters.tags)
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
				}).catch(error => (this.overlay = false, alert('Ошибка формирования')));
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
			}).catch(error => (this.loadProtocol = false, alert('Ошибка формирования')));
		},
		createEq(){
			this.loadCreate = true;
			this.$http.post("/api/equipment/metrolog", this.newEquipment, {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.createDialog = false, this.loadCreate = false))
			.catch(error => (this.loadCreate = false, alert(error.response.data.message)));

		},
        // dropdownCreate(type){
        //     if(this.depLocation.length > 0)
        //     {
        //         let result = [];
        //         for (let str of this.depLocation[type])
        //             result.push({value: str.id, text: str.title});
        //         return result;
        //     }
		// },
        dropdownCreate(tp){
            if(this.depLocation)
            {
                let result = [];
				for (let str of this.depLocation[tp])
                    result.push({value: str['id'], text: str['title'] || str['cabinet_number']});
                return result;
            }
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
		},
		filteredLocation(){
			if(this.depLocation)
			{
				let result = [];
				this.depLocation.locations.filter(item => {
					if(item.id_department === this.newEquipment.id_department)
						result.push({value: item.id, text: item.cabinet_number});
				});
				return result;
			}
		}
	},
	created(){
		this.getEquipment();
	}
  }
</script>