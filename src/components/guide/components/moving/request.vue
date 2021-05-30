<template>
	<v-card-text>
		<v-card-text>
			Раздел меню <strong>Запрос</strong> предназначен для поиска поступившего материала в других отделах и запроса для перемещения в свой отдел.
		</v-card-text>
		<v-card-text>
			Для формирования запроса на перевод поступившего материала необходимо следующее:
			<ol>
				<li>С помощью фильтра <v-icon small color="blue">mdi-filter-variant</v-icon> выбрать нужный отдел</li>
				<li>Выбрать поступивший материал</li>
				<li>Нажать кнпоку "Сформировать"</li>
			</ol>
		</v-card-text>
		<v-alert dense outlined type="warning">
			Кнопка "Сформировать" доступна только при выборе отдела в котором запрашивается поступивший материал.
		</v-alert>
		<v-card-tex>
			После нажатия кнопки "Сформировать" появляется окно с запросом поступивших материалов. В данном окне необходимо заполнить следующие поля: Требуется, Место хранения.
			<v-card-text>
				<p>
					<h5>Требуется</h5>
					Запрашиваемое количество поступившего материала.
				</p>
				<v-alert dense outlined type="warning">
					Все отделы кроме Отдела МТС, заполняют данное поле в потребляемых единицах измерения. Например: материал поступает в килограммах, тратится к граммх, то в поле "Требуется" записывается количество в граммах
				</v-alert>
				<p>
					<h5>Место хранения</h5>
					Место хранения, запрашиваемого материала, в своем отделе.
				</p>
			</v-card-text>
		</v-card-tex>
		<v-card>
			<v-card-title>
				Пример содержимого страницы "Запрос".
			</v-card-title>
			<v-card-text>
				<v-data-table dense item-key="arrival_material_id" v-model="selected"
					:headers="tableColumn"
					:items="gridData"
					:items-per-page="50"
					:loading="load"
					:search="search"
					:show-select="true"
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
								<v-list flat dense>
									<v-list-item-group v-model="activeFilters[header.value]">
										<template v-for="(item, i) in filters[header.value]">
											<v-list-item :key="`${item}`" :value="item" :ripple="false">
												<template v-slot:default="{ active, toggle }">
													<v-list-item-action>
														<v-checkbox :input-value="active" :true-value="item" @click="toggle" color="primary" :ripple="false" dense></v-checkbox>
													</v-list-item-action>
													<v-list-item-content> 
														<v-list-item-title v-text="item"></v-list-item-title>
													</v-list-item-content>
												</template>
											</v-list-item>
										</template>
									</v-list-item-group>
								</v-list>
							</v-menu>
						</div>
					</template>
					<template v-slot:top>
						<v-toolbar flat dense>
							<v-toolbar-title>Выбор материала для передачи</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" label="Поиск ТИП/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
							<v-spacer></v-spacer>
							<v-btn small :ripple="false" color="success" @click="dialog = true" v-bind:disabled="Array.isArray(activeFilters.department) || typeof(activeFilters.department) === 'undefined'">Сформировать</v-btn>
						</v-toolbar>
					</template>
					<template v-slot:item.date_order="{item}">
						{{ today(item.date_order) }}
					</template>
					<template v-slot:item.material="{item}">
						{{ item.material}} ({{item.density}})
					</template>
					<template v-slot:item.measure="{item}">
						{{ idDep === 5 ? item.order_measure : item.measure }}
					</template>
					<template v-slot:item.total="{item}">
						{{ idDep === 5 ? parseFloat(item.total.toFixed(2)) : convert(item, 'total') }}
					</template>
					<template v-slot:item.amount="{item}">
						{{ idDep === 5 ? item.amount : convert(item, 'amount') }}
					</template>
					<template v-slot:item.shelf_life="{item}">
						{{ today(item.shelf_life) }} <strong>({{colorShelfLife(item.shelf_life)}})</strong>
					</template>
					<template v-slot:no-data>
						Пока ничего нет :(
					</template>
				</v-data-table>
				<v-dialog dense v-model="dialog" max-width="1512">
					<v-card>
						<v-card-title>Запрашиваемые материалы из {{ activeFilters.department }}</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<request-item :items="selectedDialog" :locations="dropdownLocation"></request-item>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="success" @click="submutMoving()" :loading="loading">Отправить</v-btn>
							<v-btn color="error" @click="dialog = false">Отмена</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-card-text>
		</v-card>
	</v-card-text>
</template>

<script>
import unit from '../../../reagent/unit.js';
import requestItem from '../../../reagent/component/requestItem.vue';

export default {
	components: {
		requestItem
	},
	data () {
		return {
			tableColumn: [
				{ text: 'Отдел', align: 'start', sortable: true, value: 'department', width: 120, filter: value => {return this.activeFilters.department ? this.activeFilters.department.includes(value) : true}},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location', filterable: false},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type', filter: value => {return this.activeFilters.type ? this.activeFilters.type.includes(value) : true}},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material', width: 200},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Остаток', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life', filterable: false}
			],
			search: '',
			selected: [],
			gridData: [
				{
					amount: 1,
					archive: 0,
					arrival_material_id: 2522,
					date_order: "2021-05-25",
					density: 1,
					department: "Вирусологический отдел",
					description: "-",
					id_department: 2,
					id_location: 299,
					id_measure: 5,
					id_order_measure: 5,
					location: "237 Холодильник № 4 -",
					material: "Парагрипп-3  КРС",
					material_id: 434,
					measure: "набор",
					order_measure: "набор",
					packing_name: "Набор для диагностики парагриппа-3 крупного рогатого скота",
					shelf_life: "2022-09-01",
					total: 1,
					type: "Диагностикум"
				},
				{
					amount: 4,
					archive: 0,
					arrival_material_id: 2521,
					date_order: "2021-05-19",
					density: 0.8,
					department: "Отдел МТС",
					description: "пар 2-05-1",
					id_department: 5,
					id_location: 279,
					id_measure: 6,
					id_order_measure: 3,
					location: "19 Стеллаж 2 2",
					material: "Ацетонитрил, осч",
					material_id: 397,
					measure: "см3",
					order_measure: "дм3",
					packing_name: "Ацетонитрил осч",
					shelf_life: "2021-11-02",
					total: 4,
					type: "Химреактив"
				},
				{
					amount: 13,
					archive: 0,
					arrival_material_id: 2505,
					date_order: "2021-05-19",
					density: 0.65,
					department: "Отдел МТС",
					description: "пар 13",
					id_department: 5,
					id_location: 279,
					id_measure: 6,
					id_order_measure: 4,
					location: "19 Стеллаж 2 2",
					material: "Гексан, хч",
					material_id: 159,
					measure: "см3",
					order_measure: "кг",
					packing_name: "н-гексан",
					shelf_life: "2022-04-04",
					total: 13,
					type: "Химреактив"
				}
			],
			filters: { department: [], type: [] },
			activeFilters: {},
			dialog: false,
			loading: false,
			listLocations: [],
			load: false,
			disabled: true
		}
	},
	methods: {
		submutMoving(){
			let obb = [];
			for(let item of this.selectedDialog)
			{
				obb.push({
					id_arrival_material: item.arrival_material_id,
					id_location: item.mlocation,
					amount: this.$convert(item.mamount).param(item.density).measure(unit[item.id_measure]).to(unit[item.id_order_measure])
				});
			}
			let obj = {
				id_department_to: this.selectedDialog[0].id_department,
				materials: obb
			};
			this.loading = true;
			this.$http.post('/api/reagent/moving', obj).then(response => (this.dialog = false, this.loading = false)).catch(error => (this.loading = false, alert(error.response.data.message)));
		},
		getStorageAll(){
			this.load = true;
			this.$http.get('/api/reagent/storage/all').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
			this.loadLocations();
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
		isMoreTotal(item){
			this.disabled = item;
		},
		loadLocations(){
			this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error.response.data.message)));
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		},
		isRole(){
			return this.$store.getters.isRoles;
		},
        dropdownLocation(){
			if(this.listLocations.length)
			{
				let result = [];
				for (let str of this.listLocations)
					result.push({value: str['id'], text: `${str['cabinet_number']} ${str['place']} ${str['notation']}`});
				return result;
			}
		},
		selectedDialog(){
			return JSON.parse(JSON.stringify(this.selected));
		}
	},
	created(){
		this.initFilters();
		this.loadLocations();
	}
  }
</script>