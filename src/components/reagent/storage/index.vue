<template>
	<v-row>
		<v-col cols="12">
			<v-data-table dense item-key="arrival_material_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Склад</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск КОД/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn :ripple="false" icon color="blue" @click="dialogPrint = true"><v-icon>mdi-printer</v-icon></v-btn>
					</v-toolbar>
				</template>
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
				<template v-slot:header.date_order="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.order_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.order_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.order_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.date_order="{item}">
					{{ today(item.date_order) }}
				</template>
				<template v-slot:item.material="{item}">
					{{ item.material }} ({{ item.density }})
				</template>
				<template v-slot:item.measure="{item}">
					{{ idDep === 5 ? item.order_measure : item.measure }}
				</template>
				<template v-slot:item.total="{item}">
					{{ idDep === 5 ? parseFloat(item.total.toFixed(4)) : convert(item, 'total') }}
				</template>
				<template v-slot:item.amount="{item}">
					{{ idDep === 5 ? item.amount : convert(item, 'amount') }}
				</template>
				<template v-slot:header.shelf_life="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.shelf_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.shelf_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.shelf_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.shelf_life="{item}">
					{{ today(item.shelf_life) }} <strong>({{colorShelfLife(item.shelf_life)}})</strong>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon small color="red" @click="confirmExepenses(item)"><v-icon>mdi-water</v-icon></v-btn>
					<v-btn icon small color="orange" @click="confirmDetail(item)"><v-icon>mdi-pencil</v-icon></v-btn>
					<v-btn icon small color="blue" @click="confirmArchive(item)" v-if="isRole === 2 || 3"><v-icon>mdi-archive</v-icon></v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialogExpenses" max-width="700">
			<v-card>
				<v-card-title>{{ item.material }} ({{ item.measure }})</v-card-title>
				<v-card-subtitle>{{ item.material_id }} / {{ today(item.date_order) }}</v-card-subtitle>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-alert dense outlined type="error" v-if="isTime">Расход материала по истечение установленного срока хранения ({{today(item.shelf_life)}}) запрещается</v-alert>
							<v-alert dense outlined type="warning" v-if="isAmount">Введите потраченное количество</v-alert>
							<v-alert dense outlined type="warning" v-if="isTotal">Невозможно потратить больше {{ idDep === 5 ? parseFloat(item.total.toFixed(4)) : convert(item, 'total') }}</v-alert>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text v-if="isTime && isHead">
					<v-text-field type="date" outlined dense label="Продлить до" v-model="expense.date_renewal"></v-text-field>
				</v-card-text>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field type="number" dense outlined clearable label="Потраченное количество" v-model="expense.amount"></v-text-field>
							<v-text-field type="date" dense outlined clearable label="Продлить до" v-model="expense.date_usage"></v-text-field>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="submitExpenses()" :loading="loadExpenses" v-bind:disabled="(isAmount || isTotal || isTime) && (isAmount || !expense.date_renewal || isTotal)">Потратить</v-btn>
					<v-btn color="error" @click="dialogExpenses = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog dense v-model="dialogDetail" max-width="700">
			<v-card>
				<v-card-title>{{ item.material }} ({{ item.measure }})</v-card-title>
				<v-card-subtitle>{{ item.location }}</v-card-subtitle>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-autocomplete @update:search-input="locationText" v-model="item.id_location" :items="dropdownLocation" outlined dense label="Место хранения"></v-autocomplete>
							<v-textarea v-model="item.description" :rows="2" :height="100" outlined dense label="Дополнительная информация"></v-textarea>
							<v-textarea v-model="item.packing_name" :rows="2" :height="100" outlined dense label="Накладная"></v-textarea>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" :loading="loadExpenses" @click="saveDetail()">Сохранить</v-btn>
					<v-btn color="error" @click="dialogDetail = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog dense v-model="dialogPrint" max-width="512">
			<v-card>
				<v-card-title>Опись расходных материалов</v-card-title>
				<v-card-subtitle>Формирование описи</v-card-subtitle>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-autocomplete @update:search-input="locationText" v-model="id_location" :items="dropdownLocation" outlined dense label="Место хранения"></v-autocomplete>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" :loading="loadExpenses" @click="printInventory()">ОК</v-btn>
					<v-btn color="error" @click="dialogPrint = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog dense persistent v-model="dialogArchive" max-width="512">
				<v-card>
					<v-card-title>Перемещение в архив</v-card-title>
					<v-card-text><v-icon color="red">mdi-alert</v-icon>Переместить в архив?</v-card-text>
					<v-card-text>{{ item.material_id }} / {{ today(item.date_order) }}  {{ item.type }} {{ item.material }}</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="moveToArchive()" :loading="loadArchive">Переместить</v-btn>
						<v-btn color="error" @click="dialogArchive = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import fs from 'file-saver';
import unit from '../unit.js';

export default {
	data () {
		return {
			search: '',
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'material_id', width: 60},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order',
				filter: value => {return !this.DateFilters.order_start_date && !this.DateFilters.order_end_date ? true :
				value >= this.DateFilters.order_start_date && value <= this.DateFilters.order_end_date}},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location',
				filter: value => {return this.activeFilters.location ? this.activeFilters.location.includes(value) : true}},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type',
				filter: value => {return this.activeFilters.type ? this.activeFilters.type.includes(value) : true}},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material', width: 180},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Остаток', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life',
				filter: value => {return !this.DateFilters.shelf_start_date && !this.DateFilters.shelf_end_date ? true :
				value >= this.DateFilters.shelf_start_date && value <= this.DateFilters.shelf_end_date}},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false},
			],
			filters: { location: [], type: []},
			activeFilters: {},
			DateFilters: {
				order_start_date: null,
				order_end_date: null,
				shelf_start_date: null,
				shelf_end_date: null
			},
			listLocations: [],
			dialogExpenses: false,
			dialogDetail: false,
			dialogPrint: false,
			dialogArchive: false,
			loadExpenses: false,
			loadArchive: false,
			gridData: [],
			item: {},
			editedIndex: -1,
			expense: {
				amount: null,
				famount: null,
				date_usage: new Date().toISOString().split('T')[0],
				date_renewal: null
			},
			url: 'storage/expenses',
			text: '',
			load: false,
			id_location: null
		}
	},
	methods: {
		getStorage(){
			this.load = true;
			this.$http.get('/api/reagent/storage').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		confirmExepenses(item){
			this.item = item;
			this.dialogExpenses = true;
		},
		confirmDetail(item){
			this.editedIndex = this.gridData.indexOf(item);
			this.item = Object.assign({}, item);
			this.dialogDetail = true;
		},
		confirmArchive(item){
			this.editedIndex = this.gridData.indexOf(item);
			this.item = Object.assign({}, item);
			this.dialogArchive = true;
		},
		submitExpenses(){
			this.expense.id_arrival = this.item.arrival_material_id;
			this.loadExpenses = true;
			this.$http.post(`/api/reagent/${this.url}`, this.expense, {headers: {'Content-Type': 'application/json'}})
			.then(response => {
					if(this.item.total) this.idDep === 5 ? this.item.total -= this.expense.amount : this.item.total -= this.expense.famount;
					else this.idDep === 5 ? this.item.total = this.item.amount - this.expense.amount : this.item.total = this.item.amount - this.expense.famount;
					if(this.expense.date_renewal && this.expense.date_renewal != '') this.item.shelf_life = this.expense.date_renewal;
					this.loadExpenses = false;
					this.dialogExpenses = false;
					this.expense.amount = null;
				}
			).catch(error => (this.loadExpenses = false, this.dialogExpenses = false, alert(error.response.data.message)));
		},
		saveDetail(){
			this.loadExpenses = true;
			this.$http.put(`/api/reagent/arrivals/updloc/${this.item.arrival_material_id}`, {id_location: this.item.id_location, description: this.item.description, packing_name: this.item.packing_name}, {headers: {'Content-Type': 'application/json'}})
			.then(response => {
					this.gridData[this.editedIndex].id_location = this.item.id_location;
					this.gridData[this.editedIndex].description = this.item.description;
					this.gridData[this.editedIndex].packing_name = this.item.packing_name;
					this.gridData[this.editedIndex].location = this.text;
					this.loadExpenses = false;
					this.dialogDetail = false;
				})
			.catch(error => (this.loadExpenses = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		},
		closeArchive() {
			this.dialogArchive = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, {})
				this.editedIndex = -1;
			})
		},
		moveToArchive(){
			this.loadArchive = true;
			this.$http.put(`/api/reagent/storage/archive/${this.item.arrival_material_id}`, {headers: {'Content-Type': 'application/json'}})
			.then(response => {this.loadArchive = false; this.gridData.splice(this.editedIndex, 1); this.closeArchive(); })
			.catch(error => (this.loadArchive = false, this.closeArchive(), alert(error.response.data.message)));
		},
		locationText(data){
			this.text = data;
		},
		printInventory(){
			this.loadExpenses = true;
			this.$http.get(`/api/reagent/storage/print/${this.id_location}`, {responseType: 'blob'})
			.then(response => {
				const file = new Blob([response.data], {type: 'application/pdf'});
				fs.saveAs(file, 'Опись расходных материалов.pdf');
								this.loadExpenses = false;
				this.dialogPrint = false;
			});
		},
		initFilters() {
			for (let col in this.filters)
				this.filters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index });

			if(Object.keys(this.activeFilters).length === 0)
				this.activeFilters = Object.assign({}, this.filters)

			for(let col in this.activeFilters)
				if(this.filters[col].length === this.activeFilters[col].length)
					this.activeFilters = Object.assign({}, this.filters)
		},
		toggleAll (col) {
			this.activeFilters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })
		},
		clearAll (col) {
			this.activeFilters[col] = []
		}
	},
	watch: {
		'expense.date_renewal': function(newVal, oldVal){
			if(newVal != '' && newVal != oldVal) this.url = `expenses/${this.item.arrival_material_id}/renewal`;
			else this.url = 'storage/expenses';
		},
		'expense.amount': function(newVal, oldVal){
			this.expense.famount = this.$convert(newVal).param(this.item.density).measure(unit[this.item.id_measure]).to(unit[this.item.id_order_measure]);
		},
		gridData(){
			this.initFilters();
		}
	},
	computed: {
		todays(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
		idDep(){
			return this.$store.getters.idDepartment;
		},
		isRole(){
			return this.$store.getters.isRoles;
		},
		//Проверка на срок хранения
		isTime(){
			return Object.keys(this.item).length && this.colorShelfLife(this.item.shelf_life) <= 0;
		},
		//Проверка введенного количества
		isAmount(){
			return this.expense.amount === null || this.expense.amount <= 0;
		},
		//Проверка на введенное количество и сравненеи с остатком
		isTotal(){
			return this.idDep === 5 ? this.item.total - Number(this.expense.amount) < 0 : this.item.total - Number(this.expense.famount) < 0;
		},
		isHead(){
			return this.$store.getters.isRoles === 2;
		},
        dropdownLocation(){
            if(!this.listLocations.length)
                this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error.response.data.message)));
            else
            {
                let result = [];
				for (let str of this.listLocations)
                    result.push({value: str['id'], text: `${str['cabinet_number']} ${str['place']} ${str['notation']}`});
                return result;
            }
        }
	},
	created(){
		this.getStorage();
	}
  }
</script>