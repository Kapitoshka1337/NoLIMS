<template>
	<v-card flat>
		<v-card-title>
			Метролог
		</v-card-title>
		<v-card-text>
			<v-card-text>
				Раздел меню <strong>Метролог</strong> позволяет вести учет оборудования, управлять поверками, техническим обслуживанием, инструкциями к оборудованию. Раздел состоит из подразделов: Оборудование, Поверки, Инструкции, ТО.
			</v-card-text>
			<v-card-text>
				<v-expansion-panels accordion>
					<v-expansion-panel>
						<v-expansion-panel-header>Оборудование</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-card-text>
								Подраздел "Оборудование" позволяет вести учет оборудования и состоит из следующих колонок: Номер, Отдел, Вид, Оборудование, С/Н, Пройденная, Предстоящая, Тэг.
								<v-card-text>
									<p>
										<h5>Номер</h5>
										Регистрационный номер оборудования.
									</p>
									<p>
										<h5>Отдел</h5>
										Отдел, в котором находится оборудование.
									</p>
									<p>
										<h5>Вид</h5>
										Вид оборудования.
									</p>
									<v-alert dense outlined type="info">
										Существует 3 (три) вида оборудования: вспомогательное, испытательное, средство измерения.
									</v-alert>
									<p>
										<h5>Оборудование</h5>
										Наименование оборудования.
									</p>
									<p>
										<h5>С/Н</h5>
										Серийный (заводской) номер оборудования.
									</p>
									<p>
										<h5>Пройденная</h5>
										Дата пройденной поверки, аттестации, проверки техсостояния.
									</p>
									<p>
										<h5>Предстоящая</h5>
										Дата предстоящей поверки, аттестации, проверки техсостояния.
									</p>
									<p>
										<h5>Тэг</h5>
										Состояние в котором находится оборудование.
									<v-alert dense outlined type="info">
										Подробнее про тэги смотреть в разделе "Главная".
									</v-alert>
									</p>
								</v-card-text>
							</v-card-text>
							<v-card-text>
								Для работы с оборудованием доступен следующий функционал:
								<v-card-text>
									<p>
										<h5>Добавление нового обоорудования</h5>
										Добавление оборудования доступно в шапке таблицы по нажатию кнопки <v-icon color="orange">mdi-plus</v-icon>.
									</p>
									<p>
										<h5>Добавление оборудования на поверку</h5>
										Перед добавлением оборудования на поверку, его необходимо отметить. После отметки оборудования по нажатию, в шапке таблицы, <v-icon color="purple">mdi-beaker-check-outline</v-icon>, откроется окно с ранее отмеченным оборудованием для последующего формирования "запроса на поверку".
									</p>
									<p>
										<h5>Печать протокола проверки технического состояния (ПТС)</h5>
										Печать протокола ПТС расположено в шапке таблицы по нажатию кнопки <v-icon color="primary">mdi-printer</v-icon>. Перед печатью протокола ПТС необходимо отметить нужное оборудование, после ввести дату проведения осмотра оборудования.
									</p>
									<p>
										<h5>Печать этикетки</h5>
										Печать этикетки расположено в шапке таблицы по нажатию кнопки <v-icon color="primary">mdi-printer</v-icon>. На выбор предлагается три размера: маленькая, средняя, большая. Перед печатью этикетки необходимо отметить нужное оборудование.
									</p>
									<p>
										<h5>Печать таблицы проверок</h5>
										Печать таблицы поверок расположено в шапке таблицы по нажатию кнопки <v-icon color="primary">mdi-printer</v-icon>. Таблица поверок - это таблица, которая отражает оборудование запрашиваемое из отделов для последующей отпраки на поверку. Таблицу поверок необходимо формировать самостоятельно, отмечая нужное оборудование.
									</p>
									<p>
										<h5>Добавление пройденной поверки, аттестации, проверки техсостояния.</h5>
										Добавление пройденой поверки, аттестации, проверки техсостояния расположено в строке таблицы по нажатию кнопки <v-icon>mdi-cog</v-icon>. Добавление пройденной поверки заполняется после проведение поверки в ЦСМ, проведения технического осмотра или аттестации оборудования.
									</p>
								</v-card-text>
							</v-card-text>
							<v-card-title>
								Пример содержания страницы "Оборудование". 
							</v-card-title>
							<v-card>
								<v-card-text>
									<v-tabs>
										<v-tab>Оборудование</v-tab>
										<v-tab>Подробности</v-tab>
										<v-tab-item>
											<eq @id='inputId'></eq>
										</v-tab-item>
										<v-tab-item>
											<detail :id="idEquipment"></detail>
										</v-tab-item>
									</v-tabs>
								</v-card-text>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>Управление поверками</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-card-text>
								Подраздел "Поверки" позволяет вести учет отправляемого оборудования на поверку и состоит из следующих колонок: №, сформировано, отправлено, сформировал, номер квитанции, подготовленно / поверенно.
								<v-card-text>
									<p>
										<h5>№</h5>
										Идентификационный номер сформированного набора отправляемого оборудования.
									</p>
									<p>
										<h5>Сформировано</h5>
										Дата формирования набора отправляемого оборудования.
									</p>
									<p>
										<h5>Отправлено</h5>
										Дата оправки и принятия набора отправляемого оборудования в ЦСМ.
									</p>
									<p>
										<h5>Сформировал</h5>
										Сотрудник отдела, который сформировал набор отправляемого оборудования.
									</p>
									<p>
										<h5>Номер квитанции</h5>
										Номер квитанции выданный в ЦСМ.
									</p>
									<p>
										<h5>Подготовленно/Поверенно</h5>
										Отображает количество отправляемого оборудования и позволяет следить за полученным оборудование с поверки.
										Состоит из 3 значений, пример "1 / 2 (3)". Первое значение отображает подготовленное оборудование на поверку (получено из отделов), второе значение отображает полученное оборудование с поверки, значение в скобках отображает общее количество отправляемого оборудования на поверку.
									</p>
								</v-card-text>
								<v-card-text>
									Для управление поверками доступны следующие действия:
									<v-card-text>
										<p>
											<h5>Просмотр набора оборудования <v-icon color="orange">mdi-eye</v-icon></h5>
											Отображает набор отправляемого оборудования.
											<v-expansion-panels accordion>
												<v-expansion-panel>
													<v-expansion-panel-header>Набор оборудования</v-expansion-panel-header>
													<v-expansion-panel-content>
														<v-card-text>
															Последовательность действвий при получении оборудования из отделов, отправки на поверку, получения с поверки.
															<ol>
																<li>
																	При получении оборудования из отдела нажать <v-icon color="red">mdi-checkbox-marked</v-icon>
																	Цвет маркера изменится на <v-icon color="orange">mdi-checkbox-marked</v-icon> и зафиксируется дата, когда "Принесли" оборудование.
																</li>
																<li>
																	После того как необходимое оборудование собрано нажать <v-icon color="green">mdi-play</v-icon>.
																</li>
																<li>Напечатать заявку на поверку в Удмурсткий ЦСМ с помощью  <v-icon color="blue">mdi-printer</v-icon></li>
																<li>
																	Ввести номер квитанции выданный в Удмуртском ЦСМ. Данное действие зафиксирует момент отправки оборудования в Удмуртский ЦСМ.
																	Оборудование получит тэг <v-chip color="purple" small text-color="white" >ЦСМ</v-chip> / <v-chip color="purple" small text-color="white" >Ц</v-chip>
																</li>
																<li>
																	При получении оборудования из Удмуртского ЦСМ нажать <v-icon color="orange">mdi-checkbox-marked</v-icon> и заполнить сведения о пройденной поверке.
																	После заполнения маркер изменится на <v-icon color="blue">mdi-checkbox-marked</v-icon>.
																	У оборудование снимется тэг <v-chip color="purple" small text-color="white" >ЦСМ</v-chip> / <v-chip color="purple" small text-color="white" >Ц</v-chip>
																</li>
																<li>
																	Отдать оборудование в отделы и нажать <v-icon color="blue">mdi-checkbox-marked</v-icon>. После маркер изменится на <v-icon color="green">mdi-checkbox-marked</v-icon> 
																</li>
															</ol>
														</v-card-text>
														<v-card>
															<v-card-title>Пример содержания набора поверки.</v-card-title>
															<v-divider></v-divider>
															<v-card-text>
																<v-data-table dense :headers="tableColumn1" :items="content"
																:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">>							
																	<template v-slot:item.date_received_before="{ item }">
																		{{ today(item.date_received_before) }}
																	</template>
																	<template v-slot:item.date_received_after="{ item }">
																		{{ today(item.date_received_after) }}
																	</template>
																	<template v-slot:item.date_received_department="{ item }">
																		{{ today(item.date_received_department) }}
																	</template>
																	<template v-slot:item.actions="{ item }">
																		<v-btn small icon v-bind:color="
																		item.is_received_before && !item.is_received_after ? 'orange' :
																		item.is_received_before && item.is_received_after && !item.is_received_department ? 'blue' :
																		item.is_received_before && item.is_received_after && item.is_received_department ? 'green' :
																		'red'" :loading="param"><v-icon>mdi-checkbox-marked</v-icon></v-btn>
																		<v-btn small icon color="red" v-if="item.id_status_check != 2 && item.id_status_check != 3"><v-icon>mdi-delete</v-icon></v-btn>
																	</template>
																</v-data-table>
															</v-card-text>
														</v-card>
													</v-expansion-panel-content>
												</v-expansion-panel>
											</v-expansion-panels>
											<v-card-text>
												
												<v-alert dense outlined type="warning">
													Удаление оборудования из набора доступно до отправки на поверку.
												</v-alert>
											</v-card-text>
										</p>
										<p>
											<h5>Печать заявки в ЦСМ <v-icon color="blue">mdi-printer</v-icon></h5>
											Формирование заявки на поверку в Удмуртский ЦСМ.
										</p>
										<p>
											<h5>Удаление набора отправляемого оборудования <v-icon color="red">mdi-delete</v-icon></h5>
											При неправильном составлении набора отправляемого оборудования доступна возможность удаления со всем входящим набором отправляемого оборудования.
											<v-alert dense outlined type="warning">
												Удаление набора доступно до его "отправки" в Удмуртский ЦСМ.
											</v-alert>
										</p>
										<p>
											<h5>Отправить на поверку <v-icon color="green">mdi-play</v-icon></h5>
											После отправки отправляемого оборудования в Удмуртский ЦСМ региструется "отправка" с вводом номера квитанции.
										</p>
									</v-card-text> 
								</v-card-text>
								<v-card>
									<v-card-title>
										Пример содержания страницы "Поверки". 
									</v-card-title>
									<v-card-text>
										<verification></verification>
									</v-card-text>
								</v-card>
							</v-card-text>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>Инструкции</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-card-text>
								Подраздел "Инструкции" позволяет загружать, обновлять инструкции по эксплуатации оборудования и состоит из следующих колонок: код, номер, название (описание).

								<v-card-text>
									<p>
										<h5>Код</h5>
										Уникальный идентификатор инструкции. Необходим для быстрого поиска инструкции администратором.
									</p>
									<p>
										<h5>Номер</h5>
										Зарегистрированный номер инструкции по эксплуатации.
									</p>
									<p>
										<h5>Название (описание))</h5>
										Наименование инструкции по эксплуатации.
									</p>
								</v-card-text>
								<v-card-text>
									Для работы с инструкциями доступны следующие действия:
									<v-card-text>
										<p>
											<h5>Добавление инструкции</h5>
											Загрузка новой инструкции по эксплуатации.
										</p>
										<p>
											<h5>Просмотр загруженной инструкции</h5>
											Скачивает ранее загруженный файл инструкции. Действие доступно по кнопке <v-icon color="orange">mdi-eye</v-icon>
										</p>
										<p>
											<h5>Изменение загруженной инструкциями</h5>
											Позволяет изменить номер, название и загрузить новую инструкцию заменя прошлую версию. Действие доступно по кнопке <v-icon color="blue">mdi-pencil</v-icon>
										</p>
									</v-card-text>
								</v-card-text>
								<v-card-title>
									Пример содержания страницы "Инструкции". 
								</v-card-title>
								<v-card>
									<v-card-text>
										<instructions></instructions>
									</v-card-text>
								</v-card>
							</v-card-text>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>Техническое обслуживание</v-expansion-panel-header>
						<v-expansion-panel-content>
							<h5>В разработке</h5>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script>
import eq from './eq/eq.vue';
import detail from './eq/detail.vue';
import verification from './verification/index.vue';
import instructions from './eq/instructions.vue';

export default {
	components:{
		eq, detail, verification, instructions
	},
	data () {
		return {
			idEquipment: 0,
			tableColumn1: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number_card', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model'},
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number', filterable: false },
				{ text: 'Принесли', align: 'end', sortable: false, value: 'date_received_before'},
				{ text: 'Получено из ЦСМ', align: 'end', sortable: false, value: 'date_received_after'},
				{ text: 'Отдано', align: 'end', sortable: false, value: 'date_received_department' },
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false, width: 100}
			],
			content: [
				{
					date_received_after: null,
					date_received_before: null,
					date_received_department: null,
					equipment: "Колориметр фотоэлектрический",
					id_checks: 135,
					id_equipment: 213,
					id_kit_row: 757,
					id_status_check: 1,
					is_received_after: 0,
					is_received_before: 0,
					is_received_department: 0,
					model: "КФК-2",
					number_card: "84/С - СИ",
					serial_number: "8807232"
				},
				{
					date_received_after: null,
					date_received_before: "2021-06-08",
					date_received_department: null,
					equipment: "Измеритель деформации клейковины",
					id_checks: 133,
					id_equipment: 153,
					id_kit_row: 742,
					id_status_check: 2,
					is_received_after: 0,
					is_received_before: 1,
					is_received_department: 0,
					model: "ИДК-3М",
					number_card: "12/04 - СИ",
					serial_number: "5249"
				},
				{
					date_received_after: "2021-05-19",
					date_received_before: "2021-05-05",
					date_received_department: "2021-05-26",
					equipment: "Дозатор пипеточный",
					id_checks: 122,
					id_equipment: 269,
					id_kit_row: 679,
					id_status_check: 3,
					is_received_after: 1,
					is_received_before: 1,
					is_received_department: 1,
					model: "Колор ДПОПц- 1-20-200",
					number_card: "25/05 - СИ",
					serial_number: "BN71621"
				}
			]
		}
	},
	methods: {
		inputId(data){
			this.idEquipment = data;
		},
		today(date){
			return date === null ? '' : new Date(date).toLocaleString().split(',')[0];
		},
	},
}
</script>