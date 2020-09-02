<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>История расхода</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск КОД/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
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
				<template v-slot:header.date_usage="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.usage_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.usage_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.usage_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.date_usage="{item}">
					{{ today(item.date_usage) }}
				</template>
				<template v-slot:header.date_record="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.record_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.record_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.record_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.date_record="{item}">
					{{ today(item.date_record) }}
				</template>
				<template v-slot:item.measure="{item}">
					{{ idDep === 5 ? item.order_measure : item.measure }}
				</template>
				<template v-slot:item.amount_outgo="{item}">
					{{ idDep === 5 ? item.amount_outgo : convert(item, 'amount_outgo')}}
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon small color="orange" v-if="item.moving_type === 'Продление'"><v-icon>mdi-alert</v-icon></v-btn>
					<v-btn icon small color="green" v-if="item.moving_type === 'Потребление'" @click="dialogCorrection(item)"><v-icon>mdi-alert-circle</v-icon></v-btn>
					<v-btn icon small color="blue" v-if="item.moving_type === 'Перевод'"><v-icon>mdi-information-variant</v-icon></v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialog" max-width="574">
			<v-card>
				<v-card-title>Исправление расхода</v-card-title>
				<v-card-subtitle>{{ item.material_id }} / {{ item.date_order }}</v-card-subtitle>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field type="number" outlined dense label="Количество" v-model="correction.corrected_amount"></v-text-field>
							<v-textarea :rows="2" :height="100" outlined dense label="Причина" v-model="correction.reason_correct"></v-textarea>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="submit()" :loading="loading">Отправить</v-btn>
					<v-btn color="error" @click="dialog = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import unit from '../unit.js';

export default {
	data () {
		return {
			search: '',
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'material_id'},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order',
			filter: value => {return !this.DateFilters.order_start_date && !this.DateFilters.order_end_date ? true :
			value >= this.DateFilters.order_start_date && value <= this.DateFilters.order_end_date}},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Кол.', align: 'start', sortable: true, value: 'amount_outgo', filterable: false},
				{ text: 'Сотрудник', align: 'start', sortable: true, value: 'user',
			filter: value => {return this.activeFilters.user ? this.activeFilters.user.includes(value) : true}},
				{ text: 'Потрачено', align: 'start', sortable: true, value: 'date_usage',
				filter: value => {return !this.DateFilters.usage_start_date && !this.DateFilters.usage_end_date ? true :
				value >= this.DateFilters.usage_start_date && value <= this.DateFilters.usage_end_date}},
				{ text: 'Добавлено', align: 'start', sortable: true, value: 'date_record',
			filter: value => {return !this.DateFilters.record_start_date && !this.DateFilters.record_end_date ? true :
			value >= this.DateFilters.record_start_date && value <= this.DateFilters.record_end_date}},
				{ text: 'Операция', align: 'start', sortable: true, value: 'moving_type', filter: value => {return this.activeFilters.moving_type ? this.activeFilters.moving_type.includes(value) : true}},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false},
				{ text: '№', align: 'start', sortable: true, value: 'id_arrival_material'}
			],
			gridData: [],
			filters: { moving_type: [], user: []},
			activeFilters: {},
			DateFilters: {
				order_start_date: null,
				order_end_date: null,
				usage_start_date: null,
				usage_end_date: null,
				record_start_date: null,
				record_end_date: null
			},
			dialog: false,
			loading: false,
			load: false,
			item: {},
			correction: {
				corrected_amount: null,
				fcorrected_amount: null,
				reason_correct: null
			}
		}
	},
	watch: {
		'correction.corrected_amount': function(newVal, oldVal){
			this.correction.fcorrected_amount = this.$convert(newVal).param(this.item.density).measure(unit[this.item.id_measure]).to(unit[this.item.id_order_measure]);
		},
		gridData(){
			this.initFilters();
		}
	},
	methods: {
		getExpenses(){
			this.load = true;
			this.$http.get('/api/reagent/expenses').then(response => (this.gridData = response.data, this.load = false)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		dialogCorrection(item){
			this.item = item;
			this.dialog = true;
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		},
		submit(){
			this.correction.id_outgo = this.item.id;
			this.correction.spent_amount = this.item.amount_outgo;
			this.loading = true;
			this.$http.post("/api/reagent/expenses/correct", this.correction, {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.loading = false, this.dialog = false)).catch(error => (this.loading = false, alert(error.response.data.message)));
		},
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
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		}
	},
	created(){
		this.getExpenses();
	}
  }
</script>