<template>
	<v-card flat>
		<v-card-title>
			Ошибки
		</v-card-title>
		<v-card-text>
			<v-alert dense outlined type="warning">
				Данный раздел предназначен для руководителя отдела!
			</v-alert>
			<v-card-text>
				Раздел меню <strong>Ошибки</strong> предназначен для исправления истории расхода.
			</v-card-text>
			<v-card-text>
				Запись запроса на исправление состоит из: сотрудника, даты создания запроса, даты ответа, статус.
				<v-card-text>
					<p>
						<h5>Сотрудник</h5>
						Специалист отдела, который совершил ошибку в истории расхода и отправил запрос на исправление.
					</p>
					<p>
						<h5>Создано</h5>
						Дата создания запроса на исправление.
					</p>
					<p>
						<h5>Отвечено</h5>
						Дата, когда принято решение по запросу на исправление.
					</p>
					<p>
						<h5>Статус</h5>
						Отображение состояние запроса. Статус имеет три состояния: Рассмотрение - первоначальное состояние запроса, Подтвержден - состояние при котором запрос на исправление принят, Отклонен - состояние при котором запрос на исправление отклонен.
					</p>
				</v-card-text>
			</v-card-text>
			<v-card-text>
				Руководителю отдела доступны следующие действия над запросом на исправление:
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
					Действие доступно при статусе запроса "Рассмотрение". При совершении данного действия в истории расхода изменится потраченное "Количество" материала, который указан в запросе на исправление и статус запроса перейдет в "Подтвержден".
				</p>
				<p>
					<h5>Отказать</h5>
					Действие доступно при статусе запроса "Рассмотрение". При совершении данного действия в истории расхода потраченное "Количество" материала, который указан в запросе на исправление, не изменится, а статус запроса перейдет в "Отклонен".
				</p>
			</v-card-text>
			<v-card-text>
				Информация, которая отображается в данном разделе, собирается с целью <strong>предупреждения</strong> о необходимости <strong>проведения закупки</strong> нового материала и <strong>соблюдения</strong> мер предосторожности от испортившегося материала.
			</v-card-text>
			<v-card-title>
				Пример содержания страницы "Ошибки". 
			</v-card-title>
			<v-card>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-data-table calculate-widths dense item-key="id"
								:headers="tableColumn"
								:items="content"
								:items-per-page="50"
								:loading="load"
								:search="search"
								:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
								<template v-slot:top>
									<v-toolbar flat dense>
										<v-toolbar-title>Исправления расхода</v-toolbar-title>
										<v-spacer></v-spacer>
										<v-text-field v-model="search" label="Поиск " clearable single-line hide-details></v-text-field>
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
								<template v-slot:header.created_at="{header}">
									{{header.text}}
									<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
										<template v-slot:activator="{ on, attrs }">
											<v-btn color="indigo" icon v-bind="attrs" v-on="on">
												<v-icon small :color="DateFilters.create_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
											</v-btn>
										</template>
										<v-card>
										<v-card-text>
											<v-container>
												<v-row>
													<v-col cols="12">
														<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.create_start_date"></v-text-field>
														<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.create_end_date" ></v-text-field>
													</v-col>
												</v-row>
											</v-container>
										</v-card-text>
										</v-card>
									</v-menu>
								</template>
								<template v-slot:item.created_at="{item}">
									{{today(item.created_at)}}
								</template>
								<template v-slot:item.date_response="{item}">
									{{today(item.date_response)}}
								</template>
								<template v-slot:item.actions="{item}">
									<v-btn x-small color="orange" @click="dialogDetail(item)">Просмотр</v-btn>
								</template>
								<template v-slot:no-data>
									Пока ничего нет :(
								</template>
							</v-data-table>
							<v-dialog dense v-model="dialog" max-width="574">
								<v-card>
									<v-card-title>Запрос № {{ selectedItem.id }}</v-card-title>
									<v-card-text>
										{{selectedItem.reason_correct}}
									</v-card-text>
									<v-divider></v-divider>
									<v-card-text>
										<v-list dense>
											<v-list-item two-line>
												<v-list-item-title>Код материала - {{ selectedItem.id_material }}</v-list-item-title>
											</v-list-item>
											<v-list-item two-line>
												<v-list-item-title>Расход ({{selectedItem.measure}}) - {{ today(selectedItem.date_usage) }}</v-list-item-title>
											</v-list-item>
											<v-list-item two-line>
												<v-list-item-title>Потраченное количество - {{ selectedItem.spent_amount }}</v-list-item-title>
											</v-list-item>
											<v-list-item two-line>
												<v-list-item-title>Исправляемое количество - {{ selectedItem.corrected_amount }}</v-list-item-title>
											</v-list-item>
										</v-list>
									</v-card-text>
									<v-divider></v-divider>
									<v-card-actions  v-if="selectedItem.id_status === 1">
										<v-spacer></v-spacer>
										<v-btn color="success">Принять</v-btn>
										<v-btn color="error" @click="dialog = false">Отказать</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	data () {
		return {
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id'},
				{ text: 'Сотрудник', align: 'start', sortable: true, value: 'user',
				filter: value => {return this.activeFilters.user ? this.activeFilters.user.includes(value) : true}},
				{ text: 'Создано', align: 'start', sortable: true, value: 'created_at',
				filter: value => {return !this.DateFilters.create_start_date && !this.DateFilters.create_end_date ? true :
				value >= this.DateFilters.create_start_date && value <= this.DateFilters.create_end_date}},
				{ text: 'Отвечено', align: 'start', sortable: true, value: 'date_response'},
				{ text: 'Статус', align: 'start', sortable: true, value: 'status',
				filter: value => {return this.activeFilters.status ? this.activeFilters.status.includes(value) : true}},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			search: '',
			filters: { user: [], status: []},
			activeFilters: {},
			DateFilters: {
				create_start_date: null,
				create_end_date: null
			},
			dialog: false,
			isDenyLoading: false,
			isAllowLoading: false,
			load: false,
			selectedItem: {},
			selectedIndex: null,
			content: [
				{
					corrected_amount: 3,
					created_at: "2021-05-22 00:00:00",
					date_response: null,
					date_usage: "2021-03-21",
					density: 0,
					id: 41,
					id_department: 14,
					id_material: 198,
					id_measure: 1,
					id_order_measure: 1,
					id_outgo: 3854,
					id_status: 1,
					measure: "ампул",
					order_measure: "ампул",
					reason_correct: "Неправильно указал потраченное количество.",
					spent_amount: 41,
					status: "Рассмотрение",
					user: "Иванов В.В."
				},
				{
					corrected_amount: 0.03,
					created_at: "2020-12-20 00:00:00",
					date_response: "2020-12-20",
					date_usage: "2020-12-20",
					density: 1,
					id: 10,
					id_department: 14,
					id_material: 327,
					id_measure: 2,
					id_order_measure: 4,
					id_outgo: 2387,
					id_status: 3,
					measure: "г",
					order_measure: "кг",
					reason_correct: "Не работала кнопка.",
					spent_amount: 0.05,
					status: "Отклонен",
					user: "Сидоров П.К."
				},
				{
					corrected_amount: 3,
					created_at: "2021-03-21 00:00:00",
					date_response: "2021-03-21",
					date_usage: "2021-03-21",
					density: 0,
					id: 24,
					id_department: 14,
					id_material: 31,
					id_measure: 1,
					id_order_measure: 1,
					id_outgo: 3853,
					id_status: 2,
					measure: "ампул",
					order_measure: "ампул",
					reason_correct: "Одная ампула разбилась.",
					spent_amount: 12,
					status: "Подтвержден",
					user: "Николаев А.Г."
				}
			]
		}
	},
	methods: {
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		dialogDetail(item){
			this.selectedIndex = this.content.indexOf(item);
			this.selectedItem = Object.assign({}, item);
			this.dialog = true;
		},
		initFilters() {
			for (let col in this.filters) {
				this.filters[col] = this.content.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })}
			this.activeFilters = Object.assign({}, this.filters)
		},
		toggleAll (col) {
			this.activeFilters[col] = this.content.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })
		},
		clearAll (col) {
			this.activeFilters[col] = []
		}
	},
	created(){
		this.initFilters();
	}
}
</script>