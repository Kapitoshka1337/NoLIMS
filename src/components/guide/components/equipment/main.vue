<template>
	<v-card flat>
		<v-card-title>
			Главная
		</v-card-title>
		<v-card-text>
			<v-card-text>
				Раздел меню <strong>Главная</strong> отображает новостную информацию на текущий месяц:
			</v-card-text>
			<v-card-text>
				<ul>
					<li>Вспомогательное оборудование</li>
					<li>Испытательное оборудование</li>
					<li>Средство измерения</li>
				</ul>
			</v-card-text>
			<v-card-text>
				Каждая таблица состоит из: Номер, Оборудование, Предстоящая, Тэг.
				<v-card-text>
					<p>
						<h5>Номер</h5>
						Регистрационный номер оборудования.
					</p>
					<p>
						<h5>Оборудование</h5>
						Наименование оборудования.
					</p>
					<p>
						<h5>Предстоящая</h5>
						Дата предстоящей поверки, аттестации, проверки техсостояния.
					</p>
					<p>
						<h5>Тэг</h5>
						Состояние, в котором находится оборудование. Описание тэгов приведено ниже.
					</p>
				</v-card-text>
			</v-card-text>
			<v-card-text>
				Тэги - необходимы для обозначения состояния оборудования. Существует 5 тэгов: архив, используется, консервация, ремонт, цсм. Каждый из тэгов имеет аббревиатуру.
				<v-card-text>
					<p>
						<h5><v-chip color="teal" small text-color="white" >Архив</v-chip> / <v-chip color="teal" small text-color="white" >А</v-chip></h5>
						Отображается у оборудования находящегося в архиве.
					</p>
					<p>
						<h5><v-chip color="green" small text-color="white" >Используется</v-chip> / <v-chip color="green" small text-color="white" >И</v-chip></h5>
						Отображается у оборудования находящегося в рабочем состоянии и прошедшее поверку.
					</p>
					<p>
						<h5><v-chip color="orange" small text-color="white" >Консервация</v-chip> / <v-chip color="orange" small text-color="white" >К</v-chip></h5>
						Отображается у оборудования находящегося в консервации.
					</p>
					<p>
						<h5><v-chip color="red" small text-color="white" >Ремонт</v-chip> / <v-chip color="red" small text-color="white" >Р</v-chip></h5>
						Отображается у оборудования находящегося в ремонте и не пригоднее для дальнейшего использования.
					</p>
					<p>
						<h5><v-chip color="purple" small text-color="white" >ЦСМ</v-chip> / <v-chip color="purple" small text-color="white" >Ц</v-chip></h5>
						Отображается у оборудования находящегося на поверке в "ЦСМ".
					</p>
				</v-card-text>
			</v-card-text>
			<v-card-text>
				Информация, которая отображается в данном разделе, собирается с целью <strong>предупреждения</strong> о необходимости
				<strong>поверки</strong> (СИ), <strong>аттестации</strong> (ИО) или <strong>проверки техсостояния</strong> (ВО) 
				 вида оборудования.
			</v-card-text>
			<v-card-title>
				Пример содержания страницы "Главная". 
			</v-card-title>
			<v-card>
				<v-card-text>
					<v-row>
						<v-col cols="6" v-for="card in cards" :key="card.id">
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
								<template v-slot:item.date_next_check="{ item }">
									{{ today(item.date_next_check) }}
								</template>
								<template v-slot:item.tag="{ item }">
									<v-chip-group>
										<v-chip color="teal" small text-color="white" v-if="item.is_archive">А</v-chip>
										<v-chip color="green" small text-color="white" v-if="item.is_working">И</v-chip>
										<v-chip color="orange" small text-color="white" v-if="item.is_conservation">К</v-chip>
										<v-chip color="red" small text-color="white" v-if="item.is_repair">Р</v-chip>
										<v-chip color="purple" small text-color="white" v-if="item.is_check">Ц</v-chip>
									</v-chip-group>
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
					id: 1,
					title: 'Вспомогательное оборудование',
					tableColumn: [
						{ text: 'Номер', align: 'start', sortable: true, value: 'card_number', width: 120},
						{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
						{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
						{ text: 'Тэг', align: 'start', sortable: false, value: 'tag'}
					],
					content: [
						{
							cabinet_number: "12",
							card_number: "111/И - ВО",
							date_next_check: "2021-06-18",
							department: "Игринская лаборатория",
							equipment: "Дозатор механический BIOHIT Proline",
							fif_number: "36152-12",
							id: 1578,
							id_department: 11,
							id_type: 1,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "Prospenser",
							number: "111",
							serial_number: "07М37523",
							type: "ВО"
						},
						{
							cabinet_number: "10",
							card_number: "47/И - ВО",
							date_next_check: "2021-06-18",
							department: "Игринская лаборатория",
							equipment: "Электропечь",
							fif_number: null,
							id: 1226,
							id_department: 11,
							id_type: 1,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "ЭКСП 10",
							number: "47",
							serial_number: "5481",
							type: "ВО"
						}
					]
				},
				{
					id: 2,
					title: 'Испытательное оборудование',
					tableColumn: [
						{ text: 'Номер', align: 'start', sortable: true, value: 'card_number', width: 120},
						{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
						{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
						{ text: 'Тэг', align: 'start', sortable: false, value: 'tag'}
					],
					content: [
						{
							cabinet_number: "263",
							card_number: "13/03 - ИО",
							date_next_check: "2021-06-25",
							department: "Микробиологический отдел (бактериологии)",
							equipment: "Термостат электрический суховоздушный",
							fif_number: null,
							id: 13,
							id_department: 4,
							id_type: 2,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "ТС-80М-2",
							number: "13",
							serial_number: "6219",
							type: "ИО"
						},
						{
							cabinet_number: "268",
							card_number: "14/03 - ИО",
							date_next_check: "2021-06-25",
							department: "Микробиологический отдел (бактериологии)",
							equipment: "Термостат электрический суховоздушный",
							fif_number: null,
							id: 14,
							id_department: 4,
							id_type: 2,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "ТС-1/80 СПУ",
							number: "14",
							serial_number: "14639",
							type: "ИО"
						},
						{
							cabinet_number: "324",
							card_number: "35/12 - ИО",
							date_next_check: "2021-06-29",
							department: "Серологический отдел",
							equipment: "Термостат электрический суховоздушный охлаждающий",
							fif_number: null,
							id: 909,
							id_department: 8,
							id_type: 2,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "ТСО-200 СПУ",
							number: "35",
							serial_number: "34",
							type: "ИО"
						}
					]
				},
				{
					id: 3,
					title: 'Средство измерений',
					tableColumn: [
						{ text: 'Номер', align: 'start', sortable: true, value: 'card_number', width: 120},
						{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
						{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
						{ text: 'Тэг', align: 'start', sortable: false, value: 'tag'}
					],
					content: [
						{
							cabinet_number: "406",
							card_number: "12/04 - СИ",
							date_next_check: "2021-06-10",
							department: "Отдел химико-токсикологических исследований (биохимики)",
							equipment: "Измеритель деформации клейковины",
							fif_number: "21636-01",
							id: 153,
							id_department: 1,
							id_type: 3,
							is_archive: 0,
							is_check: 1,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "ИДК-3М",
							number: "12",
							serial_number: "5249",
							type: "СИ"
						},
						{
							cabinet_number: null,
							card_number: "44/С - СИ",
							date_next_check: "2021-06-15",
							department: "Сарапульская лаборатория",
							equipment: "Набор ареометров ",
							fif_number: null,
							id: 1080,
							id_department: 12,
							id_type: 3,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "АОН-1",
							number: "44",
							serial_number: "90924",
							type: "СИ"
						},
						{
							cabinet_number: "406",
							card_number: "125/04 - СИ",
							date_next_check: "2021-06-14",
							department: "Отдел химико-токсикологических исследований (биохимики)",
							equipment: "Анализатор молока вискозиметрический",
							fif_number: "39563-08",
							id: 1180,
							id_department: 1,
							id_type: 3,
							is_archive: 0,
							is_check: 0,
							is_conservation: 0,
							is_repair: 0,
							is_working: 1,
							model: "Соматос-Мини",
							number: "125",
							serial_number: "101029",
							type: "СИ"
						}
					]
				},
			]
		}
	},
	methods: {
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
	},
}
</script>