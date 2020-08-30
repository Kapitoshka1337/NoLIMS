<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="id"
				:headers="gridColumns.tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="gridData.length <= 0"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>История расхода</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск КОД/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-slot:item.measure="{item}">
					{{ idDep === 5 ? item.order_measure : item.measure }}
				</template>
				<template v-slot:item.amount_outgo="{item}">
					{{ idDep === 5 ? item.amount_outgo : convert(item, 'amount_outgo')}}
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon small color="orange" v-if="item.moving_type === 'Продление'"><v-icon>mdi-alert</v-icon></v-btn>
					<v-btn icon small color="green" v-if="item.moving_type === 'Потребление'" @click="dialogCorrection(item)"><v-icon>mdi-alert-circle</v-icon></v-btn>
					<v-btn icon small color="blue" v-if="item.moving_type === 'Перевод'"><v-icon>mdi-information-variant</v-icon></v-btn>
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialog" max-width="574">
			<v-card>
				<v-card-title>Исправление расхода</v-card-title>
				<v-card-subtitle>{{ item.material_id }} / {{ item.date_order }}</v-card-subtitle>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field type="number" outlined dense label="Количество" v-model="correction.corrected_amount"></v-text-field>
							<v-textarea :rows="2" :height="100" outlined dense label="Причина" v-model="correction.reason_correct"></v-textarea>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="submit()" :loading="loading">Отправить</v-btn>
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
			search: '',
            gridColumns: {
                tableColumn: [
					{ text: 'Код', align: 'start', sortable: true, value: 'material_id'},
					{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
					{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
					{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
					{ text: 'Кол.', align: 'start', sortable: true, value: 'amount_outgo', filterable: false},
					{ text: 'Сотрудник', align: 'start', sortable: true, value: 'user', filterable: false},
					{ text: 'Потрачено', align: 'start', sortable: true, value: 'date_usage', filterable: false},
					{ text: 'Добавлено', align: 'start', sortable: true, value: 'date_record', filterable: false},
					{ text: 'Операция', align: 'start', sortable: true, value: 'moving_type', filterable: false},
					{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
                ]
            },
			gridData: [],
			dialog: false,
			loading: false,
			item: {},
			correction: {
				corrected_amount: null,
				fcorrected_amount: null,
				reason_correct: null
			}
		}
	},
	watch: {
		'correction.corrected_amount': function(newVal, oldVal){
			this.correction.fcorrected_amount = this.$convert(newVal).param(this.item.density).measure(unit[this.item.id_measure]).to(unit[this.item.id_order_measure]);
		}
	},
	methods: {
		getExpenses(){
			this.$http.get('/api/reagent/expenses').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		dialogCorrection(item){
			this.item = item;
			this.dialog = true;
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		},
		submit(){
			this.correction.id_outgo = this.item.id;
			this.correction.spent_amount = this.item.amount_outgo;
			this.loading = true;
			this.$http.post("/api/reagent/expenses/correct", this.correction, {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.loading = false, this.dialog = false)).catch(error => (this.loading = false, alert(error.response.data.message)));
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		}
	},
	created(){
		this.getExpenses();
	}
  }
</script>