<template>
	<v-row>
		<v-col cols="12" v-for="card in cards" :key="card.id">
			<v-data-table
				dense
				:headers="card.tableColumn"
				:items="card.content"
				:items-per-page="10"
				:loading="load"
				item-key="id"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [10, 20], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>{{card.title}}</v-toolbar-title>
					</v-toolbar>
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
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
//import unit from './unit.js';

export default {
	data(){
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
				content: []
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
				content: []
			}
		],
			gridData: [],
			load: false,
		}
	},
	watch: {
		gridData(){
			Object.keys(this.gridData).forEach(data => {
				this.cards.forEach(card => {
					if(data === card.id)
						card.content = this.gridData[data]
				})
			})
		}
	},
	methods: {
		getToday(){
			this.load = true;
			this.$http.get('/api/reagent/dashboard/main').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		//convert(item, param){
		//	return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		//}
	},
	created(){
		this.getToday();
	}
}
</script>