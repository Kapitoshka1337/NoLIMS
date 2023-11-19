<template>
	<v-row>
		<v-col cols="12">
			<v-data-table
			calculate-widths
				@item-selected="selectedEquipment"
				dense
				v-model="selected"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="gridData.length <= 0" 
				:search="search"
				:show-select="true"
				item-key="id"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }">
					<div style="display: inline-block; padding: 16px 0;">{{ header.text }}</div>
					<div style="float: right; margin-top: 8px">
						<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed style="position: absolute; right: 0">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="indigo" icon v-bind="attrs" v-on="on">
									<v-icon small 
										:color="activeFilters[header.value] && activeFilters[header.value].length < filters[header.value].length ? 'red' : 'default'">mdi-filter-variant
									</v-icon>
								</v-btn>
							</template>
								<v-list dense>
									<v-list-item-content>
										<v-select :items="filters[header.value]" v-model="activeFilters[header.value]" :clearable="true" multiple outlined dense>
											<template v-slot:selection="{ item, index }">
												<v-chip small v-if="index === 0"><span>{{ item }}</span></v-chip>
												<span v-if="index === 1" class="grey--text caption">(+{{ activeFilters[header.value].length - 1 }})</span>
											</template>
										</v-select>
									</v-list-item-content>
									<v-divider></v-divider>
									<v-row no-gutters>
										<v-col cols="6">
											<v-btn text block @click="toggleAll(header.value)" color="success">Выделить всё</v-btn>
										</v-col>
										<v-col cols="6">
											<v-btn text block @click="clearAll(header.value)" color="warning">Снять всё</v-btn>
										</v-col>
									</v-row>
								</v-list>
						</v-menu>
					</div>
				</template>
				<template v-slot:header.date_current_check="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.current_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.current_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.current_end_date" ></v-text-field>
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
								<v-icon small :color="DateFilters.next_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.next_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.next_end_date" ></v-text-field>
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
								<v-icon small :color="DateFilters.tags.length ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-list flat dense>
							<v-list-item-group multiple v-model="DateFilters.tags">
								<v-list-item v-for="tag in tags" :key="tag.text" :ripple="false" :value="tag.value">
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
						<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-menu offset-y :close-on-content-click="false">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="blue" icon v-bind="attrs" v-on="on">
									<v-icon>mdi-printer</v-icon>
								</v-btn>
							</template>
							<v-list dense>
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
								<v-list-item @click="printTable()">
									<v-list-item-title>Таблица проверок</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
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
						<v-chip color="green" small text-color="white" v-if="item.is_working">И</v-chip>
						<v-chip color="orange" small text-color="white" v-if="item.is_conservation">К</v-chip>
						<v-chip color="red" small text-color="white" v-if="item.is_repair">Р</v-chip>
						<v-chip color="purple" small text-color="white" v-if="item.is_check">Ц</v-chip>
					</v-chip-group>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn icon color="blue" @click="editItem(item)"><v-icon>mdi-bug</v-icon></v-btn>
					<v-btn icon color="orange"><v-icon>mdi-hammer-wrench</v-icon></v-btn>
				</template>
			</v-data-table>
			<v-overlay :value="overlay">
				<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
			</v-overlay>
			<v-dialog v-model="dialogRepair" max-width="512px">
				<v-card>
					<v-card-title>Заявка на ремонт</v-card-title>
					<v-card-subtitle>{{ editedItem.equipment }}</v-card-subtitle>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-textarea :rows="2" :height="60" dense label="Описание проблемы" v-model="problem" outlined></v-textarea>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-card-title>{{ editedItem.number_card }}</v-card-title>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="passedVerification()" :loading="passed_verification">Отправить</v-btn>
						<v-btn color="error" @click="dialogRepair = false">Отмена</v-btn>
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
			search: '',
			dialogRepair: false,
			passed_verification: false,
			selected: [],
			tableColumn: [
				{ text: 'Номер', align: 'start', sortable: true, value: 'number'},
				{ text: 'Отдел', align: 'start', sortable: true, value: 'department', filter: value => {return this.activeFilters.department ? this.activeFilters.department.includes(value) : true}},
				{ text: 'Вид', align: 'start', sortable: true, value: 'type', filter: value => {return this.activeFilters.type ? this.activeFilters.type.includes(value) : true}},
				{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: true, value: 'model' },
				{ text: 'С/Н', align: 'end', sortable: true, value: 'serial_number'},
				{ text: 'Пройденная', align: 'start', sortable: true, value: 'date_current_check',
			filter: value => {return !this.DateFilters.current_start_date && !this.DateFilters.current_end_date ? true :
			value >= this.DateFilters.current_start_date && value <= this.DateFilters.current_end_date}},
				{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check',
			filter: value => {return !this.DateFilters.next_start_date && !this.DateFilters.next_end_date ? true :
			value >= this.DateFilters.next_start_date && value <= this.DateFilters.next_end_date}},
				{ text: 'Тег', align: 'center', sortable: false, value: 'tag', filter: this.filterTags},
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false }
			],
			tags: [
				{text: 'Архив', value: 'is_archive', color: 'teal'},
				{text: 'Используется', value: 'is_working', color: 'green'},
				{text: 'Консервация', value: 'is_conservation', color: 'orange'},
				{text: 'Ремонт', value: 'is_repair', color: 'red'},
				{text: 'ЦСМ', value: 'is_check', color: 'purple'}
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
			filters: { department: [], type: [] },
			activeFilters: {},
			DateFilters: {
				current_start_date: null,
				current_end_date: null,
				next_start_date: null,
				next_end_date: null,
				tags: []
			},
			editedIndex: null,
			problem: ''
		}
	},
	watch: {
		gridData(){
			this.initFilters();
		}
	},
	methods: {
		initFilters() {
			for (let col in this.filters) {
				this.filters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })}
			this.activeFilters = Object.assign({}, this.filters)
		},
		toggleAll (col) {
			this.activeFilters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })
		},
		clearAll (col) {
			this.activeFilters[col] = []
		},
		filterTags(val, srch, item){
			if(!this.DateFilters.tags.length) return true;
			let itms;
			this.DateFilters.tags.filter(x => (item[x] === 1 ? itms = item: false));
			return itms;
		},
		selectedEquipment(item){
			this.editedIndex = this.gridData.indexOf(item);
			if(item.value) this.$emit('id', item.item.id);
		},
		getEquipment(){
			this.$http.get('/api/equipment/metrolog').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		editItem(item) {
			this.editedIndex = this.gridData.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogRepair = true;
		},
		passedVerification(){
			this.passed_verification = true;
			this.$http.post("/api/equipment/repair/" + this.editedItem.id, {problem: this.problem}, {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.dialogRepair = false, this.passed_verification = false)).catch(error => (this.passed_verification = false, alert(error.response.data.message)));
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
		printTable(){
			if(this.selected.length > 0)
			{
				let obj = [];
				for (let item in this.selected) obj.push(this.selected[item].id);
				this.overlay = true;
				this.$http.post('/api/equipment/printer/table', {item: obj}, {responseType: 'blob'})
				.then(response =>{
					const file = new Blob([response.data], {type: 'application/pdf'});
					fs.saveAs(file, 'Таблица проверок.pdf');
					this.overlay = false;
				}).catch(error => (this.overlay = false, alert('Ошибка формирования')));
			}
			else alert('Не выбрано оборудование');
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		}
	},
	created(){
		this.getEquipment();
	}
  }
</script>