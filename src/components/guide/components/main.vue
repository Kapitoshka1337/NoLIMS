<template>
	<v-card flat>
		<v-card-title>
			Главная
		</v-card-title>
		<v-card-text>
			<v-card-text>
				Раздел меню <strong>Главная</strong> отображает новостную информацию:
			</v-card-text>
			<v-card-text>
				<ul>
					<li>Остаток меньше 40%</li>
					<li>Срок хранения меньше 2 (двух) месяцев</li>
				</ul>
			</v-card-text>
			<v-card-text>
				Информация, которая отображается в данном разделе, собирается с целью <strong>предупреждения</strong> о необходимости <strong>проведения закупки</strong> нового материала и <strong>соблюдения</strong> мер предосторожности от испортившегося материала.
			</v-card-text>
			<v-card-title>
				Пример содержания страницы "Главная". 
			</v-card-title>
			<v-card>
				<v-card-text>
					<v-row>
						<v-col cols="12" v-for="card in cards" :key="card.id">
							<v-data-table
								dense
								:headers="card.tableColumn"
								:items="card.content"
								:items-per-page="10"
								item-key="id"
								:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [10, 20], itemsPerPageText: 'Отобразить на странице'}">
								<template v-slot:top>
									<v-toolbar flat>
										<v-toolbar-title>{{card.title}}</v-toolbar-title>
									</v-toolbar>
								</template>
								<template v-slot:footer>
									<v-card-text>
										{{ card.footer }} 
									</v-card-text>
								</template>
								<template v-slot:item.total="{item}">
									{{ parseFloat(item.total.toFixed(2)) }}
								</template>
								<template v-slot:item.date_order="{item}">
									{{ today(item.date_order) }}
								</template>
								<template v-slot:item.shelf_life="{item}">
									{{ today(item.shelf_life) }} <strong>({{colorShelfLife(item.shelf_life)}})</strong>
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
export default {
	data () {
		return {
				cards: [
				{
					id: 'total',
					title: 'Остаток меньше 40%',
					tableColumn: [
						{ text: 'Код', align: 'start', sortable: true, value: 'material_id'},
						{ text: 'Дата поступления', align: 'start', sortable: true, value: 'date_order'},
						{ text: 'Местоположение', align: 'start', sortable: true, value: 'location'},
						{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
						{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
						{ text: 'Ед.изм', align: 'start', sortable: true, value: 'order_measure'},
						{ text: 'Остаток', align: 'start', sortable: true, value: 'total'},
						{ text: 'Поступило', align: 'start', sortable: true, value: 'amount'},
						{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life'}
					],
					footer: "Таблица содержит список поступившего материала у которого остаток приближается к отметке менее 40% от поступившего количества.",
					content: [
						{
							amount: 2,
							archive: 0,
							arrival_material_id: 1695,
							date_order: "2021-03-16",
							density: 0,
							id_department: 14,
							id_measure: 1,
							id_order_measure: 1,
							location: "666 АПП 2 123",
							material: "РН 9,18",
							material_id: 198,
							measure: "ампул",
							order_measure: "ампул",
							shelf_life: "2021-03-31",
							total: -39,
							total_percent: -1950,
							type: "Стандарт-титр"
						},
						{
							amount: 54,
							archive: 0,
							arrival_material_id: 397,
							date_order: "2020-08-20",
							density: 1,
							id_department: 14,
							id_measure: 2,
							id_order_measure: 4,
							location: "666 СумкаА 3",
							material: "Оптимакс",
							material_id: 12,
							measure: "г",
							order_measure: "кг",
							shelf_life: "2020-10-30",
							total: 0,
							total_percent: 0,
							type: "Дез.средство"
						}
					]
				},
				{
					id: 'date',
					title: 'Срок хранения меньше 2 месяцев',
					tableColumn: [
						{ text: 'Код', align: 'start', sortable: true, value: 'material_id'},
						{ text: 'Дата поступления', align: 'start', sortable: true, value: 'date_order'},
						{ text: 'Местоположение', align: 'start', sortable: true, value: 'location'},
						{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
						{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
						{ text: 'Ед.изм', align: 'start', sortable: true, value: 'order_measure'},
						{ text: 'Остаток', align: 'start', sortable: true, value: 'total'},
						{ text: 'Поступило', align: 'start', sortable: true, value: 'amount'},
						{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life'}
					],
					footer: "Таблица содержит список поступившего материала у которого заявленный, при добавлении нового поступления, \"Срок хранения\" приближается к окончанию. Приближение к окончанию срока годности начинается действовать за 2 месяца до заявленного срока хранения и необходимости проведения закупки материала.",
					content: [
						{
							amount: 44,
							archive: 0,
							arrival_material_id: 398,
							date_order: "2020-08-20",
							density: 1,
							id_department: 14,
							id_measure: 2,
							id_order_measure: 4,
							location: "666 АПП 2 123",
							material: "Кристалический фиолетовый",
							material_id: 13,
							measure: "г",
							order_measure: "кг",
							shelf_life: "2020-08-31",
							total: 36,
							total_percent: 81.81818181818183,
							type: "Химреактив"
						},
						{
							amount: 345,
							archive: 0,
							arrival_material_id: 396,
							date_order: "2020-08-20",
							density: 1,
							id_department: 14,
							id_measure: 2,
							id_order_measure: 4,
							location: "Кабинет Место Полка23",
							material: "Мистраль",
							material_id: 8,
							measure: "г",
							order_measure: "кг",
							shelf_life: "2020-08-31",
							total: 300,
							total_percent: 86.95652173913044,
							type: "Дез.средство"
						}
					]
				}
			]
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
		}
	}
}
</script>