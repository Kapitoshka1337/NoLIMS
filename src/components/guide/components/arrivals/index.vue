<template>
	<v-card-text>
		История расхода предназачена для хранения, поиска, сбора поступлений. Каждое поступление содержит следующую информацию: Код, Номер, Дата заказа, Операция.
		<v-card-text>
			<p>
				<h5>Код</h5>
				Уникальный идентификатор поступления. Необходим для быстрого поиска поступления администратором.
			</p>
			<p>
				<h5>Номер</h5>
				Номер накладной или универсального передаточного документа. необходим для сопоставления с бухгалтерией.
			</p>
			<p>
				<h5>Дата заказа</h5>
				Дата заказа по накладной или универсального передаточного документа. Дата заказа нужна для формирования регистрационного номера поступившего материала.
			</p>
			<v-alert dense outlined type="info">
				Регистрационный номер состоит из кода материала и даты заказа. Пример регистрационного номера: 158/12.02.2021 
			</v-alert>
			<v-alert dense outlined type="warning">
				После добавления поступления, на каждый поступивший материал пишется регистрационный номер. 
			</v-alert>
			<p>
				<h5>Операция</h5>
				Отображение типа поступления. Поступление имеет два типа: Поступление - присваивается при получении нового поступления, Перевод - присваивается при переводе поступившего материала между отделами.
			</p>
		</v-card-text>
		<v-card-text>
			На странице "Поступления" доступны два действия.
			<p>
				<h5>Добавить поступление</h5>
				Позволяет добавить поступление нового материала.
			</p>
			<p>
				<h5>Просмотр</h5>
				Отображает поступившие материалы. Действие доступна для каждого поступления.
			</p>
		</v-card-text>
		<v-card>
			<v-card-title>Пример содержания страницы "Поступления"</v-card-title>
			<v-card-text>
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
									<v-toolbar-title>Поступления</v-toolbar-title>
									<v-spacer></v-spacer>
									<v-text-field v-model="search" label="Поиск " clearable single-line hide-details></v-text-field>
									<v-spacer></v-spacer>
									<v-btn small to="/reagent/arrivals/create" :ripple="false" color="orange">Добавить поступление</v-btn>
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
								{{today(item.date_order)}}
							</template>
							<template v-slot:item.actions="{item}">
								<v-btn x-small color="orange" @click="confirmOrder(item)">Просмотр</v-btn>
							</template>
							<template v-slot:no-data>
								Пока ничего нет :(
							</template>
						</v-data-table>
					</v-col>
					<v-overlay :value="overlay">
						<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
					</v-overlay>
					<v-dialog dense v-model="dialogOrder" max-width="1512px">
						<v-card>
							<v-card-title>Заказ № {{ item.num_order }} от {{ today(item.date_order) }}</v-card-title>
							<v-divider></v-divider>
							<v-card-text>
								<v-data-table calculate-widths dense item-key="id"
									:headers="tableColumn1"
									:items="item.materials"
									:items-per-page="10"
									:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
								<template v-slot:item.material="{item}">
									{{ item.material }} ({{ item.density }})
								</template>
								</v-data-table>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="success" @click="dialogOrder = false">Закрыть</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-card-text>
</template>

<script>
export default {
	data () {
		return {
			search: '',
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id'},
				{ text: 'Номер', align: 'start', sortable: true, value: 'num_order'},
				{ text: 'Дата заказа', align: 'start', sortable: true, value: 'date_order',
				filter: value => {return !this.DateFilters.order_start_date && !this.DateFilters.order_end_date ? true :
				value >= this.DateFilters.order_start_date && value <= this.DateFilters.order_end_date}},
				{ text: 'Операция', align: 'start', sortable: true, value: 'moving_type', filter: value => {return this.activeFilters.moving_type ? this.activeFilters.moving_type.includes(value) : true}},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			tableColumn1: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id_material'},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location'},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure'},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount'},
				{ text: 'Изготовлен', align: 'start', sortable: true, value: 'date_create'},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life'}
			],
			gridData: [
				{
					date_order: "2020-10-15",
					department: "ТЕСТ",
					id: 302,
					id_department: 14,
					moving_type: "Перевод",
					num_order: "0",
					materials: [
						{
							amount: 4.2,
							date_create: "09.12.2019",
							density: 1.4,
							id: 302,
							id_department: 14,
							id_material: 396,
							location: "666 1559 Полка",
							material: "Кислота азотная, осч",
							measure: "кг",
							shelf_life: "09.02.2020",
							type: "Химреактив"
						}
					]
				},
				{
					date_order: "2020-08-19",
					department: "ТЕСТ",
					id: 287,
					id_department: 14,
					moving_type: "Поступление",
					num_order: "66",
					materials: [
						{
							amount: 1,
							date_create: "12.02.2020",
							density: 1,
							id: 174,
							id_department: 14,
							id_material: 327,
							location: "666 Мебельd Номер",
							material: "Кислота борная",
							measure: "кг",
							shelf_life: "20.03.2021",
							type: "Химреактив"
						},
						{
							amount: 2,
							date_create: "25.03.2020",
							density: 1,
							id: 174,
							id_department: 14,
							id_material: 579,
							location: "666 АПП 2 123",
							material: "Фосфор",
							measure: "набор",
							shelf_life: "12.05.2020",
							type: "Набор"
						},
						{
							amount: 1.4,
							date_create: "13.08.2020",
							density: 1.4,
							id: 174,
							id_department: 14,
							id_material: 155,
							location: "Кабинет Место Полка23",
							material: "Кислота азотная, хч",
							measure: "кг",
							shelf_life: "30.12.2020",
							type: "Химреактив"
						}
					]
				},
				{
					date_order: "2021-03-21",
					department: "ТЕСТ",
					id: 561,
					id_department: 14,
					moving_type: "Поступление",
					num_order: "12",
					materials: [
						{
							amount: 1,
							date_create: "28.08.2020",
							density: 23,
							id: 215,
							id_department: 14,
							id_material: 4,
							location: "Кабинет232 МестоМестоМесто Полка",
							material: "Кислота трихлоруксусная",
							measure: "кг",
							shelf_life: "18.12.2020",
							type: "Химреактив"
						}
					]
				}
			],
			filters: { moving_type: []},
			activeFilters: {},
			DateFilters: {
				order_start_date: null,
				order_end_date: null
			},
			overlay: false,
			dialogOrder: false,
			load: false,
			materials: [],
			item: {}
		}
	},
	methods: {
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
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
		},
		confirmOrder(item){
			this.item = item;
			this.dialogOrder = true;
		}
	},
	created(){
		this.initFilters();
	}
}
</script>