<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="id_matertial"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="loading"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Отчет расхода за период</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn :ripple="false" small color="primary" @click="dialog = true">Период</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.date_order="{item}">
					{{ today(item.date_order) }}
				</template>
				<template v-slot:item.total="{item}">
					{{ parseFloat((item.total).toFixed(4)) || parseFloat((item.amount).toFixed(4)) }}
				</template>
			</v-data-table>
		</v-col>
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
	</v-row>
</template>

<script>
import unit from '../unit.js';

export default {
	data () {
		return {
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id_material'},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material', filterable: false},
				{ text: 'Накладная', align: 'start', sortable: true, value: 'packing_name', filterable: false},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'order_measure', filterable: false},
				{ text: 'Потрачено', align: 'start', sortable: true, value: 'total'},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount'}
			],
			gridData: [],
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
		getStorage(){
			this.$http.get('/api/reagent/storage').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
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