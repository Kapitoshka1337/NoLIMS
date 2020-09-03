<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="matertia_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Архивные материалы</v-toolbar-title>
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
				<template v-slot:item.material="{item}">
					{{ item.material }} ({{ item.density }})
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
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
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
				{ text: 'Код', align: 'start', sortable: true, value: 'material_id'},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order',
				filter: value => {return !this.DateFilters.order_start_date && !this.DateFilters.order_end_date ? true :
				value >= this.DateFilters.order_start_date && value <= this.DateFilters.order_end_date}},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location', filter: value => {return this.activeFilters.location ? this.activeFilters.location.includes(value) : true}},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type', filter: value => {return this.activeFilters.type ? this.activeFilters.type.includes(value) : true}},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Осталось', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life',
				filter: value => {return !this.DateFilters.shelf_start_date && !this.DateFilters.shelf_end_date ? true :
				value >= this.DateFilters.shelf_start_date && value <= this.DateFilters.shelf_end_date}}
			],
			gridData: [],
			filters: { location: [], type: []},
			activeFilters: {},
			DateFilters: {
				order_start_date: null,
				order_end_date: null,
				shelf_start_date: null,
				shelf_end_date: null
			},
			load: false
		}
	},
	methods: {
		getStorage(){
			this.load = true;
			this.$http.get('/api/reagent/storage/archives').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
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
		todays(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
		idDep(){
			return this.$store.getters.idDepartment;
		}

	},
	watch: {
		gridData(){
			this.initFilters();
		}
	},
	created(){
		this.getStorage();
	}
  }
</script>