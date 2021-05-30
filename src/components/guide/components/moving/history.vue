<template>
	<v-card-text>
		<v-alert dense outlined type="warning">
			Данный раздел предназначен для руководителя отдела!
		</v-alert>
		<v-card-text>
			Раздел меню <strong>История</strong> предназначен для поиска и принятии решения о переводе поступившего материала.
		</v-card-text>
		<v-card-text>
			<v-card-text>
				Запись запроса на перевод состоит из: код, запрос, получатель, запросил, отправитель, передано, статус.
				<v-card-text>
					<p>
						<h5>Код</h5>
						Уникальный идентификатор записи. Необходим для быстрого поиска администратором.
					</p>
					<p>
						<h5>Запрос</h5>
						Дата создания запроса на перевод.
					</p>
					<p>
						<h5>Получатель</h5>
						Тот кто запросил и кому необходим запрашиваемый материал.
					</p>
					<p>
						<h5>Запросил</h5>
						Сотрудник отдела, который сформировал запрос на перевод.
					</p>
					<p>
						<h5>Отправитель</h5>
						Отдел в который пришел запрос на перевод.
					</p>
					<p>
						<h5>Передано</h5>
						Дата принятия и передачи запрашиваемого материала.
					</p>
					<p>
						<h5>Статус</h5>
						Отображение состояние запроса. Статус имеет три состояния: Рассмотрение - первоначальное состояние запроса, Подтвержден - состояние при котором запрос принят, Отклонен - состояние при котором запрос на отклонен.
					</p>
				</v-card-text>
			</v-card-text>
			<v-card-text>
				Руководителю отдела доступны следующие действия над запросом на перевод:
			</v-card-text>
				<v-card-text>
					<ul>
						<li>Принять</li>
						<li>Отказать</li>
					</ul>
				</v-card-text>
			<v-card-text>
				<p>
					<h5>Принять</h5>
					Действие доступно при статусе запроса "Рассмотрение". <br>
					Подтвердив запросн на перевод запраишваемого материала, с склада отправителя переместятся запраишваемые материалы, согласно указанному местоположению и запрашиваемому количеству.
					В истории расхода появится запись с опероацией «Перевод».
				</p>
				<p>
					<h5>Отказать</h5>
					Действие доступно при статусе запроса "Рассмотрение".
					При отказе перевода, запрос сохранится со статусом «Отклонен», перемещения материала не произойдёт.
				</p>
			</v-card-text>
		</v-card-text>
		<v-card>
			<v-card-text>
				<v-data-table calculate-widths dense item-key="id"
					:headers="tableColumn"
					:items="gridData"
					:items-per-page="50"
					:loading="load"
					:search="search"
					:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
					<template v-slot:top>
						<v-toolbar flat dense>
							<v-toolbar-title>История заявок</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" label="Поиск " clearable single-line hide-details></v-text-field>
						</v-toolbar>
					</template>
					<template v-for="(col, i) in filters" v-slot:[`header.`]="{ header }">
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
					<template v-slot:item.created_at="{item}">
						{{today(item.created_at)}}
					</template>
					<template v-slot:item.date_moving="{item}">
						{{today(item.date_moving) || ""}}
					</template>
					<template v-slot:item.actions="{item}">
						<v-btn x-small color="orange" @click="confirmMoving(item)">Просмотр</v-btn>
					</template>
					<template v-slot:no-data>
						Пока ничего нет :(
					</template>
				</v-data-table>
			</v-card-text>
		</v-card>
		<v-dialog dense v-model="dialogMoving" max-width="1512px">
			<v-card>
				<v-card-title>Запрашиваемые материалы</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-data-table calculate-widths dense item-key="id"
						:headers="tableColumn1"
						:items="item.materials"
						:items-per-page="10"
						:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
					<template v-slot:item.id_material="{item}">
						{{item.id_material}} / {{today(item.date_order)}}
					</template>
					<template v-slot:item.material="{item}">
						{{ item.material }} ({{ item.density }})
					</template>
					<template v-slot:item.measure="{item}">
						{{ idDep === 5 ? item.order_measure : item.measure }}
					</template>
					<template v-slot:item.total="{item}">
						{{ idDep === 5 ? item.total : convert(item, 'total') }}
					</template>
					<template v-slot:item.amount="{item}">
						{{ idDep === 5 ? item.amount : convert(item, 'amount') }}
					</template>
					<template v-slot:item.date_create="{item}">
						{{today(item.date_create)}}
					</template>
					<template v-slot:item.shelf_life="{item}">
						{{today(item.shelf_life)}}
					</template>
					</v-data-table>
				</v-card-text>
				<v-card-actions v-if="item.id_department_from != idDep && item.id_status === 1">
					<v-spacer></v-spacer>
					<v-btn color="success" >Принять</v-btn>
					<v-btn color="error" @click="dialogMoving = false">Отказать</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card-text>
</template>

<script>
import unit from '../../../reagent/unit.js';

export default {
	data () {
		return {
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id'},
				{ text: 'Запрос', align: 'start', sortable: true, value: 'created_at'},
				{ text: 'Получатель', align: 'start', sortable: true, value: 'dep_from',
				filter: value => {return this.activeFilters.dep_from ? this.activeFilters.dep_from.includes(value) : true}},
				{ text: 'Запросил', align: 'start', sortable: true, value: 'user',
				filter: value => {return this.activeFilters.user ? this.activeFilters.user.includes(value) : true}},
				{ text: 'Отправитель', align: 'start', sortable: true, value: 'dep_to',
				filter: value => {return this.activeFilters.dep_to ? this.activeFilters.dep_to.includes(value) : true}},
				{ text: 'Передано', align: 'start', sortable: true, value: 'date_moving'},
				{ text: 'Статус', align: 'start', sortable: true, value: 'status',
				filter: value => {return this.activeFilters.status ? this.activeFilters.status.includes(value) : true}},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			tableColumn1: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id_material'},
				{ text: 'Место хранения', align: 'start', sortable: true, value: 'location'},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Накладная', align: 'start', sortable: true, value: 'packing_name'},
				{ text: 'Ед. изм.', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Требуют', align: 'start', sortable: true, value: 'amount'},
				{ text: 'Остаток', align: 'start', sortable: true, value: 'total'},
				{ text: 'Изготовлен', align: 'start', sortable: true, value: 'date_create'},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life'},
			],
			gridData: [
				{
					created_at: "2021-05-26 00:00:00",
					date_moving: "2021-05-26",
					dep_from: "Отдел химико-токсикологических исследований (биохимики)",
					dep_to: "Отдел МТС",
					id: 173,
					id_department_from: 1,
					id_department_to: 5,
					id_status: 1,
					status: "Рассмотрение",
					user: "Мануилова Ю.Г.",
					materials: [
						{
							amount: 1.4,
							arrival_amount: 20,
							date_create: "2020-09-09",
							date_order: "2021-02-11",
							density: 0.7,
							id_material: 174,
							id_measure: 6,
							id_moving: 170,
							id_order_measure: 4,
							location: "19 Шкаф 1 1",
							material: "Этоксиэтан (диэтиловый эфир), чда",
							measure: "см3",
							order_measure: "кг",
							packing_name: "Эфир диэтиловый",
							shelf_life: "2023-09-09",
							total: 15.1,
							type: "Химреактив",
						},
						{
							amount: 1.6,
							arrival_amount: 5.6,
							date_create: "2020-11-01",
							date_order: "2021-01-11",
							density: 0.8,
							id_material: 161,
							id_measure: 6,
							id_moving: 170,
							id_order_measure: 4,
							location: "19 Шкаф 2 1",
							material: "Ацетон",
							measure: "см3",
							order_measure: "кг",
							packing_name: "Ацетон",
							shelf_life: "2021-11-01",
							total: 4,
							type: "Химреактив"
						}
					]
				},
				{
					created_at: "2021-05-04 00:00:00",
					date_moving: "2021-05-05",
					dep_from: "Отдел химико-токсикологических исследований (биохимики)",
					dep_to: "Отдел МТС",
					id: 168,
					id_department_from: 1,
					id_department_to: 5,
					id_status: 2,
					status: "Подтвержден",
					user: "Мануилова Ю.Г.",
					materials: [
						{
							amount: 6.5,
							arrival_amount: 27.95,
							date_create: "2020-11-11",
							date_order: "2021-03-12",
							density: 0.65,
							id_material: 159,
							id_measure: 6,
							id_moving: 173,
							id_order_measure: 4,
							location: "19 Стеллаж 1 2",
							material: "Гексан, хч",
							measure: "см3",
							order_measure: "кг",
							packing_name: "Н-Гексан хч",
							shelf_life: "2021-11-11",
							total: 21.45,
							type: "Химреактив"
						},
						{
							amount: 0.9,
							arrival_amount: 6.3,
							date_create: "2020-12-01",
							date_order: "2021-01-11",
							density: 0.9,
							id_material: 160,
							id_measure: 6,
							id_moving: 173,
							id_order_measure: 4,
							location: "19 Шкаф 2 2",
							material: "Бензол, хч",
							measure: "см3",
							order_measure: "кг",
							packing_name: "Бензол",
							shelf_life: "2021-12-01",
							total: 3.6,
							type: "Химреактив"
						}
					]
				},
				{
					created_at: "2021-05-04 00:00:00",
					date_moving: "2021-05-04",
					dep_from: "Отдел химико-токсикологических исследований (биохимики)",
					dep_to: "Отдел химико-токсикологических исследований (токсикологи)",
					id: 167,
					id_department_from: 1,
					id_department_to: 9,
					id_status: 3,
					status: "Отклонен",
					user: "Трапезников М.С.",
					materials: [
						{
							amount: 0.9,
							arrival_amount: 6.3,
							date_create: "2020-12-01",
							date_order: "2021-01-11",
							density: 0.9,
							id_material: 160,
							id_measure: 6,
							id_moving: 173,
							id_order_measure: 4,
							location: "19 Шкаф 2 2",
							material: "Бензол, хч",
							measure: "см3",
							order_measure: "кг",
							packing_name: "Бензол",
							shelf_life: "2021-12-01",
							total: 3.6,
							type: "Химреактив"	
						}
					]
				}
			],
			filters: { dep_from: [], user: [], dep_to: [], status: []},
			activeFilters: {},
			materials: [],
			item: {},
			search: '',
			dialogMoving: false,
			overlay: false,
			isDenyLoading: false,
			isAllowLoading: false,
			load: false
		}
	},
	methods: {
		confirmMoving(item){
			this.item = item;
			this.dialogMoving = true;
		},
		today(date){
			return date === null ? false : new Date(date).toLocaleString().split(',')[0];
		},
		dateToday(){
			return new Date();
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
		idDep(){
			return this.$store.getters.idDepartment;
		}
	},
	created(){
		this.initFilters();
	}
  }
</script>