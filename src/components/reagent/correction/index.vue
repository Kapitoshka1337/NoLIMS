<template><v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="gridData.length <= 0"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Исправления расхода</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск " clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-slot:item.created_at="{item}">
					{{today(item.created_at)}}
				</template>
				<template v-slot:item.date_response="{item}">
					{{today(item.date_response)}}
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon color="orange" @click="dialogDetail(item)"><v-icon>mdi-eye</v-icon></v-btn>
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialog" max-width="574">
			<v-card>
				<v-card-title>Запрос № {{ item.id }}</v-card-title>
				<v-card-text>
					{{item.reason_correct}}
				</v-card-text>
				<v-divider></v-divider>
				<v-card-text>
					<v-list dense>
						<v-list-item two-line>
							<v-list-item-title>Код материала - {{ item.id_material }}</v-list-item-title>
						</v-list-item>
						<v-list-item two-line>
							<v-list-item-title>Расход ({{item.measure}}) - {{ today(item.date_usage) }}</v-list-item-title>
						</v-list-item>
						<v-list-item two-line>
							<v-list-item-title>Потраченное количество - {{ item.spent_amount }}</v-list-item-title>
						</v-list-item>
						<v-list-item two-line>
							<v-list-item-title>Исправляемое количество - {{ item.corrected_amount }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success">Принять</v-btn>
					<v-btn color="error">Отказать</v-btn>
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
				{ text: 'Код', align: 'start', sortable: true, value: 'id'},
				{ text: 'Сотрудник', align: 'start', sortable: true, value: 'user'},
				{ text: 'Создано', align: 'start', sortable: true, value: 'created_at'},
				{ text: 'Отвечено', align: 'start', sortable: true, value: 'date_response'},
				{ text: 'Статус', align: 'start', sortable: true, value: 'status', },
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			gridData: [],
			dialog: false,
			item: {}
//id: 3
//id_department: 14
//user: "ТЕСТ"
//created_at: "2020-08-25 00:00:00"
//date_usage: "2020-08-20"
//reason_correct: "ггпогчпо"
//spent_amount: 1202000
//corrected_amount: 0.05
//id_outgo: 92
//id_material: 12
//status: "Подтвержден"
//id_status: 2
//date_response: "2020-08-25"
//density: 1
//id_measure: 2
//measure: "г"
//id_order_measure: 4
//order_measure: "кг"
			//],
		}
	},
	methods: {
		getCorrections(){
			this.$http.get('/api/reagent/corrections').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		dialogDetail(item){
			this.item = item;
			this.dialog = true;
		},
		//allow(index = null){
		//	let obj = { id_outgo: this.gridData[index].id_outgo, amount: this.gridData[index].corrected_amount};
		//	this.isAllowLoading = !this.isAllowLoading;
		//	this.$http.put("/api/reagent/corrections/allow/" + this.gridData[index].id, obj,{
		//		headers: {'Content-Type': 'application/json'}})
		//		.then(response => (this.gridData[index].id_status = 2,
		//		this.gridData[index].status = 'Подтверждена',
		//		this.gridData[index].date_response = this.dateToday(),
		//		this.isAllowLoading = !this.isAllowLoading)).catch(error => (alert(error.response.data.message), this.isAllowLoading = !this.isAllowLoading));
		//},
		deny(index = null){
			this.isDenyLoading = !this.isDenyLoading;
			this.$http.put("/api/reagent/corrections/deny/" + this.gridData[index].id, {
				headers: {'Content-Type': 'application/json'}})
				.then(response => (this.gridData[index].id_status = 3,
				this.gridData[index].status = 'Отклонена',
				this.gridData[index].date_response = this.dateToday(),
				this.isDenyLoading = !this.isDenyLoading)).catch(error => (alert(error.response.data.message), this.isDenyLoading = !this.isDenyLoading));
		},
		//dateToday(){
		//	let today = new Date();
		//	return today.toLocaleString().split(',')[0];
		//},
	},
	created(){
		this.getCorrections();
	}
  }
</script>