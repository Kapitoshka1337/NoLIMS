<template>
	<v-card flat>
		<v-card-title>
			Списание
		</v-card-title>
		<v-card-text>
			<v-card-text>
				Раздел меню <strong>Списание</strong> отображает отчет суммарного расхода поступившего материала за выбранный период.
			</v-card-text>
			<v-card-text>
				Запись отчета списание состоит из: код, дата поступления, материал, накладная, единица измерения, потрачено, поступило.
				<v-card-text>
					<p>
						<h5>Код</h5>
						Уникальный код материала, который участвует в формировании регистрационного номера поступаемого материала.
					</p>
					<p>
						<h5>Дата поступления</h5>
						Дата заказа, которая создается при добавленни нового поступления.
					</p>
					<p>
						<h5>Материал</h5>
						Поступивший материал.
					</p>
					<p>
						<h5>Накладная</h5>
						Наименование поступившего материала из накладной или универсального передаточного документа. Данное поле добавялется при добавлении нового поступления материалов.
					</p>
					<p>
						<h5>Единица измерения</h5>
						Единица измерения из накладной или универсального передаточного документа поступившего материала.
					</p>
					<p>
						<h5>Потрачено</h5>
						Суммарное количество из истории расхода с типом операции "Потребление", "Перевод", "Продление".
					</p>
					<p>
						<h5>Поступило</h5>
						Поступившее количество материала из накладной или универсального передаточного документа.
					</p>
				</v-card-text>
			</v-card-text>
			<v-card>
				<v-card-title>
					Пример содержимого страницы "Списание".
				</v-card-title>
				<v-card-text>
					<v-data-table calculate-widths dense item-key="id_matertial"
						:headers="tableColumn"
						:items="gridData"
						:items-per-page="50"
						:loading="loading"
						:search="search"
						:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
						<template v-slot:top>
							<v-toolbar flat dense>
								<v-toolbar-title>Отчет расхода за период</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
								<v-spacer></v-spacer>
								<v-btn :ripple="false" small color="primary" @click="dialog = true">Период</v-btn>
							</v-toolbar>
						</template>
						<template v-slot:item.date_order="{item}">
							{{ today(item.date_order) }}
						</template>
						<template v-slot:item.material="{item}">
							{{ item.material}} ({{item.density}})
						</template>
						<template v-slot:item.total="{item}">
							{{ parseFloat((item.total).toFixed(4)) || parseFloat((item.amount).toFixed(4)) }}
						</template>
					</v-data-table>
					<v-dialog dense v-model="dialog" max-width="700">
						<v-card>
							<v-card-title>Выбор периода</v-card-title>
							<v-divider></v-divider>
							<v-card-text>
								<v-row>
									<v-col cols="6">
										<v-text-field type="date" dense outlined clearable label="Начало" v-model="period.start"></v-text-field>
									</v-col>
									<v-col cols="6">
										<v-text-field type="date" dense outlined clearable label="Конец" v-model="period.end"></v-text-field>
									</v-col>
								</v-row>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="success" @click="submitPeriod()" :loading="loading">ОК</v-btn>
								<v-btn color="error" @click="dialog = false">Отмена</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-card-text>
			</v-card>
		</v-card-text>
	</v-card>
</template>

<script>
import unit from '../../../reagent/unit.js';

export default {
	data () {
		return {
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id_material'},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Накладная', align: 'start', sortable: true, value: 'packing_name'},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'order_measure', filterable: false},
				{ text: 'Потрачено', align: 'start', sortable: true, value: 'total'},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount'}
			],
			gridData: [
				{
					amount: 0.2,
					date_order: "2020-08-18",
					date_usage: "2021-05-04",
					density: 1,
					id_department: 1,
					id_material: 557,
					id_measure: 2,
					id_order_measure: 4,
					material: "Калий железистосинеродитый, чда",
					measure: "г",
					order_measure: "кг",
					packing_name: "Калий",
					total: 0.014999999664723873
				},
				{
					amount: 0.1,
					date_order: "2020-08-18",
					date_usage: "2021-05-06",
					density: 1,
					id_department: 1,
					id_material: 564,
					id_measure: 2,
					id_order_measure: 4,
					material: "Фенол кристаллический, чда",
					measure: "г",
					order_measure: "кг",
					packing_name: "Фенол",
					total: 0.006000000052154064
				},
				{
					amount: 1,
					date_order: "2020-08-19",
					date_usage: "2021-05-13",
					density: 1,
					id_department: 1,
					id_material: 4,
					id_measure: 6,
					id_order_measure: 4,
					material: "Кислота трихлоруксусная",
					measure: "см3",
					order_measure: "кг",
					packing_name: "Не знаем",
					total: 0.18000000063329935
				}
			],
			search: '',
			dialog: false,
			loading: false,
			period: {
				start: null,
				end: null
			}
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		}
	},
	methods: {
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		submitPeriod(){
			this.loading = true;
			this.$http.post('/api/reagent/writeoff', this.period, {headers: {'Content-Type': 'application/json'}})
			.then(response => {this.loading = false; this.dialog = false; this.gridData = response.data;})
			.catch(error => (this.loading = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		}
	}
  }
</script>