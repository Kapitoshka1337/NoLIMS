<template>
	<v-card flat>
		<v-card-title>
			Общие сведения
		</v-card-title>
		<v-card-text>
			Программное обеспечение предназначенное для управления лабораторными складскими запасами, лабораторным оборудованием в части подтверждения его поверок и общего контроля состояния.
		</v-card-text>
		<v-card-text>
			Лабораторная информационная система разделена на модули: Реактив, Оборудование.
			<v-card-text>
				<p>
					<h5>Реактив</h5>
					Модуль "Реактив" предназначен для управления складскими запасами (расходные материалы и реагенты, контроль запасов и сроков годности).
				</p>
				<p>
					<h5>Оборудование</h5>
					Модуль "Оборудование" предназначен для управления лабораторным оборудованием (поверки, состояние Оборудования).
				</p>
			</v-card-text>
			<v-expansion-panels accordion>
				<v-expansion-panel>
					<v-expansion-panel-header>Элементы управления</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-card-text>
							<p>
								<h5>Шапка сайта</h5>
								<v-icon color="primary">mdi-menu</v-icon> - Отображает содержание раздела. <br>
								<v-icon color="primary">mdi-help-circle-outline</v-icon> - Справка по ЛИС.<br>
								<v-icon color="primary">mdi-home-circle-outline</v-icon> - Возвращает в проводник системы.<br>
								<v-icon color="primary">mdi-exit-to-app</v-icon> - Выход из учетной записи.
							</p>
							<p>
								<h5>Управление табличной частью</h5>
								<v-icon color="primary">mdi-arrow-up</v-icon> - Появляется при наведение на столбец. Позволяет производить сортировки от "А" до "Я". <br>
								<v-icon color="primary">mdi-arrow-down</v-icon> - Появляется при наведение на столбец. Позволяет производить сортировки от "Я" до "А". <br>
								<v-icon color="primary">mdi-arrow-collapse-left</v-icon> - Отображается в нижней части таблицы. Позволяет перейти в начало. <br>
								<v-icon color="primary">mdi-arrow-collapse-right</v-icon> - Отображается в нижней части таблицы. Позволяет перейти в конец. <br>
								<v-icon color="primary">mdi-minus</v-icon> - Отображается в нижней части таблицы. Позволяет перейти на одну страницу назад. <br>
								<v-icon color="primary">mdi-plus</v-icon> - Отображается в нижней части таблицы. Позволяет перейти на одну страницу вперед. <br>
								<v-icon color="primary">mdi-filter-variant</v-icon> - Отображается при наведение на столбец. Позволяет производить фильтрацию.
							</p>
						</v-card-text>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	data () {
		return {}
	}
}
</script>