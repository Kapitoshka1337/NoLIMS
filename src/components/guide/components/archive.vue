<template>
	<v-card flat>
		<v-card-title>
			Архив
		</v-card-title>
		<v-card-text>
			<v-card-text>
				Раздел меню <strong>Архив</strong> отображает поступившие материалы у которых истек срок хранения или закончилось количество необходимое для выполнения исследований.
			</v-card-text>
			<v-card-title>
				Пример содержания страницы "Архив".
			</v-card-title>
			<v-card>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-data-table dense item-key="arrival_material_id"
								:headers="storageTable.tableColumn"
								:items="storageTable.content"
								:items-per-page="50"
								:search="storageTable.search"
								:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
								<template v-slot:top>
									<v-toolbar flat dense>
										<v-toolbar-title>Склад</v-toolbar-title>
										<v-spacer></v-spacer>
										<v-text-field v-model="storageTable.search" label="Поиск КОД/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
										<v-spacer></v-spacer>
										<v-btn :ripple="false" icon color="blue" @click="dialogPrint = true"><v-icon>mdi-printer</v-icon></v-btn>
									</v-toolbar>
								</template>
								<template v-for="(col, i) in storageTable.filters" v-slot:[`header.${i}`]="{ header }">
									<div style="display: inline-block; padding: 16px 0;">{{ header.text }}</div>
									<div style="float: right; margin-top: 8px">
										<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed style="position: absolute; right: 0">
											<template v-slot:activator="{ on, attrs }">
												<v-btn color="indigo" icon v-bind="attrs" v-on="on">
													<v-icon small 
														:color="storageTable.activeFilters[header.value] && storageTable.activeFilters[header.value].length < storageTable.filters[header.value].length ? 'red' : 'default'">mdi-filter-variant
													</v-icon>
												</v-btn>
											</template>
											<v-list dense>
												<v-list-item-content>
													<v-select :items="storageTable.filters[header.value]" v-model="storageTable.activeFilters[header.value]" :clearable="true" multiple outlined dense>
														<template v-slot:selection="{ item, index }">
															<v-chip small v-if="index === 0"><span>{{ item }}</span></v-chip>
															<span v-if="index === 1" class="grey--text caption">(+{{ storageTable.activeFilters[header.value].length - 1 }})</span>
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
												<v-icon small :color="storageTable.DateFilters.order_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
											</v-btn>
										</template>
										<v-card>
										<v-card-text>
											<v-container>
												<v-row>
													<v-col cols="12">
														<v-text-field clearable type="date" dense outlined label="Дата1" v-model="storageTable.DateFilters.order_start_date"></v-text-field>
														<v-text-field clearable type="date" dense outlined label="Дата2" v-model="storageTable.DateFilters.order_end_date" ></v-text-field>
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
												<v-icon small :color="storageTable.DateFilters.shelf_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
											</v-btn>
										</template>
										<v-card>
										<v-card-text>
											<v-container>
												<v-row>
													<v-col cols="12">
														<v-text-field clearable type="date" dense outlined label="Дата1" v-model="storageTable.DateFilters.shelf_start_date"></v-text-field>
														<v-text-field clearable type="date" dense outlined label="Дата2" v-model="storageTable.DateFilters.shelf_end_date" ></v-text-field>
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
				</v-card-text>
			</v-card>
		</v-card-text>
	</v-card>
</template>

<script>
import unit from '../../reagent/unit.js';

export default {
	data () {
		return {
			storageTable: {
				tableColumn: [
					{ text: 'Код', align: 'start', sortable: true, value: 'material_id', width: 60},
					{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order',
					filter: value => {return !this.storageTable.DateFilters.order_start_date && !this.storageTable.DateFilters.order_end_date ? true :
					value >= this.storageTable.DateFilters.order_start_date && value <= this.storageTable.DateFilters.order_end_date}},
					{ text: 'Местоположение', align: 'start', sortable: true, value: 'location',
					filter: value => {return this.storageTable.activeFilters.location ? this.storageTable.activeFilters.location.includes(value) : true}},
					{ text: 'Тип', align: 'start', sortable: true, value: 'type',
					filter: value => {return this.storageTable.activeFilters.type ? this.storageTable.activeFilters.type.includes(value) : true}},
					{ text: 'Материал', align: 'start', sortable: true, value: 'material', width: 180},
					{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
					{ text: 'Остаток', align: 'start', sortable: true, value: 'total', filterable: false},
					{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
					{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life',
					filter: value => {return !this.storageTable.DateFilters.shelf_start_date && !this.storageTable.DateFilters.shelf_end_date ? true :
					value >= this.storageTable.DateFilters.shelf_start_date && value <= this.storageTable.DateFilters.shelf_end_date}},
				],
				search: '',
				filters: { location: [], type: []},
				activeFilters: {},
				DateFilters: {
					order_start_date: null,
					order_end_date: null,
					shelf_start_date: null,
					shelf_end_date: null
				},
				content: [
					{
						amount: 6,
						archive: 0,
						arrival_material_id: 1806,
						date_order: "2021-04-14",
						density: 1,
						department: "ТЕСТ",
						description: "номер парти 4659",
						id_department: 14,
						id_location: 270,
						id_measure: 1,
						id_order_measure: 1,
						location: "666 АПП 2 123",
						material: "Гидрокарбанат",
						material_id: 236,
						measure: "ампул",
						order_measure: "ампул",
						packing_name: "щркц",
						shelf_life: "2022-01-01",
						total: 6,
						type: "ГСО"
					},
					{
						amount: 1215,
						archive: 0,
						arrival_material_id: 1805,
						date_order: "2021-04-14",
						density: 1,
						department: "ТЕСТ",
						description: "номер парти 4659",
						id_department: 14,
						id_location: 266,
						id_measure: 2,
						id_order_measure: 2,
						location: "666 СумкаА 3",
						material: "Оксид хрома, чда",
						material_id: 185,
						measure: "г",
						order_measure: "г",
						packing_name: "дшг",
						shelf_life: "2022-01-01",
						total: 1215,
						type: "Химреактив"
					},
					{
						amount: 2,
						archive: 0,
						arrival_material_id: 1687,
						date_order: "2021-03-09",
						density: 2,
						department: "ТЕСТ",
						description: "Доп",
						id_department: 14,
						id_location: 268,
						id_measure: 5,
						id_order_measure: 1,
						location: "666 Мебель ПолкаНОМЕР",
						material: "Фосфор",
						material_id: 5,
						measure: "набор",
						order_measure: "ампул",
						packing_name: "Накладная",
						shelf_life: "2021-03-31",
						total: 2,
						type: "Антибиотик"
					}
				]
			},
			expense: {
				amount: null,
				famount: null,
				date_usage: new Date().toISOString().split('T')[0],
				date_renewal: null
			},
			editedItem: {},
			dialogExpenses: false,
			dialogDetail: false,
			dialogArchive: false,
			dialogPrint: false,
			editedIndex: -1,
			listLocations: [],
			id_location: null,
		}
	},
	methods: {
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		toggleAll (col) {
			this.storageTableactiveFilters[col] = this.storageTable.content.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })
		},
		clearAll (col) {
			this.storageTable.activeFilters[col] = []
		},
		confirmExepenses(item){
			this.editedItem = item;
			this.dialogExpenses = true;
		},
		confirmDetail(item){
			this.editedIndex = this.storageTable.content.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDetail = true;
		},
		confirmArchive(item){
			this.editedIndex = this.storageTable.content.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogArchive = true;
		},
		locationText(data){
			this.text = data;
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		},
		initFilters() {
			for (let col in this.storageTable.filters)
				this.storageTable.filters[col] = this.storageTable.content.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index });

			if(Object.keys(this.storageTable.activeFilters).length === 0)
				this.storageTable.activeFilters = Object.assign({}, this.storageTable.filters)
		},
	},
	computed: {
		isTime(){
			return Object.keys(this.editedItem).length && this.colorShelfLife(this.editedItem.shelf_life) <= 0;
		},
		isAmount(){
			return this.expense.amount === null || this.expense.amount <= 0;
		},
		isTotal(){
			return this.idDep === 5 ? this.editedItem.total - Number(this.expense.amount) < 0 : this.editedItem.total - Number(this.expense.famount) < 0;
		},
		idDep(){
			return this.$store.getters.idDepartment;
		},
		isHead(){
			return true;
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
		this.initFilters();
	}
}
</script>