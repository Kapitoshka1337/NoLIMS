<template>
	<v-row>
		<v-col cols="12">
			<v-data-table dense item-key="matertia_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="gridData.length <= 0"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Склад</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск КОД/ТИП/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn :ripple="false" icon color="blue"><v-icon>mdi-printer</v-icon></v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.date_order="{item}">
					{{ today(item.date_order) }}
				</template>
				<template v-slot:item.measure="{item}">
					{{ idDep === 5 ? item.order_measure : item.measure }}
				</template>
				<template v-slot:item.total="{item}">
					{{ idDep === 5 ? item.total || item.amount : convert(item, 'total') || convert(item, 'amount')}}
				</template>
				<template v-slot:item.amount="{item}">
					{{ idDep === 5 ? item.amount : convert(item, 'amount') }}
				</template>
				<template v-slot:item.shelf_life="{item}">
					{{ today(item.shelf_life) }} <strong>({{colorShelfLife(item.shelf_life)}})</strong>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon small color="red" @click="confirmExepenses(item)"><v-icon>mdi-water</v-icon></v-btn>
					<v-btn icon small color="orange" @click="confirmDetail(item)"><v-icon>mdi-pencil</v-icon></v-btn>
					<v-btn icon small color="blue" @click="moveToArchive(item)" v-if="item.total <= 0 || colorShelfLife(item.shelf_life) <= 0"><v-icon>mdi-archive</v-icon></v-btn>
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
							<v-alert dense outlined type="warning" v-if="isAmount">Введите протраченное количество</v-alert>
							<v-alert dense outlined type="warning" v-if="isTotal">Невозможно потратить больше {{ idDep === 5 ? item.total || item.amount : convert(item, 'total') || convert(item, 'amount')}}</v-alert>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text v-if="isTime && isHead">
					<v-text-field type="date" outlined dense label="Дата продления" v-model="expense.date_renewal"></v-text-field>
				</v-card-text>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field type="number" dense outlined clearable label="Потраченное количество" v-model="expense.amount"></v-text-field>
							<v-text-field type="date" dense outlined clearable label="Дата потребления" v-model="expense.date_usage"></v-text-field>
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
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
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
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location', filterable: false},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material', width: 180},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Остаток', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life', filterable: false},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false},
			],
			listLocations: [],
			dialogExpenses: false,
			dialogDetail: false,
			loadExpenses: false,
			overlay: false,
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
			text: ''
		}
	},
	methods: {
		getStorage(){
			this.$http.get('/api/reagent/storage').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
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
			this.$http.put(`/api/reagent/arrivals/updloc/${this.item.arrival_material_id}`, {id_location: this.item.id_location, description: this.item.description}, {headers: {'Content-Type': 'application/json'}})
			.then(response => {
					// Object.assign(this.gridData[this.editedIndex], this.item);
					this.gridData[this.editedIndex].id_location = this.item.id_location;
					this.gridData[this.editedIndex].description = this.item.description;
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
		moveToArchive(item){
            this.editedIndex = this.gridData.indexOf(item);
			this.overlay = true;
			this.$http.put(`/api/reagent/storage/archive/${item.arrival_material_id}`, {headers: {'Content-Type': 'application/json'}})
			.then(response => {this.overlay = false; this.gridData.splice(this.editedIndex, 1);})
			.catch(error => (this.overlay = false, alert(error.response.data.message)));
		},
		locationText(data){
			this.text = data;
		}
	},
	watch: {
		'expense.date_renewal': function(newVal, oldVal){
			if(newVal != '' && newVal != oldVal) this.url = `expenses/${this.item.arrival_material_id}/renewal`;
			else this.url = 'storage/expenses';
		},
		'expense.amount': function(newVal, oldVal){
			this.expense.famount = this.$convert(newVal).param(this.item.density).measure(unit[this.item.id_measure]).to(unit[this.item.id_order_measure]);
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
		isTime(){
			return Object.keys(this.item).length && this.colorShelfLife(this.item.shelf_life) <= 0;
		},
		isAmount(){
			return this.expense.amount === null || this.expense.amount <= 0;
		},
		isTotal(){
			if(this.item.total) return this.idDep === 5 ? this.item.total - Number(this.expense.amount) < 0 : this.item.total - Number(this.expense.famount) < 0;
			return this.idDep === 5 ? this.item.amount - Number(this.expense.amount) < 0 : this.item.amount - Number(this.expense.famount) < 0;
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