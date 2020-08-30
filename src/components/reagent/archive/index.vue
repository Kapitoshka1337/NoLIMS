<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="matertia_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="gridData.length <= 0"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Архивные материалы</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск КОД/ТИП/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-slot:item="props">
					<tr>
						<td>{{ props.item.material_id }}</td>
						<td>{{ today(props.item.date_order) }}</td>
						<td>{{ props.item.location }}</td>
						<td>{{ props.item.type }}</td>
						<td>{{ props.item.material }}</td>
						<td>{{ props.item.measure }}</td>
						<td>{{ props.item.total || props.item.amount}} / {{ props.item.amount }}</td>
						<td>{{ today(props.item.shelf_life) }} <strong>({{ colorShelfLife(props.item.shelf_life) }})</strong></td>
					</tr>
				</template>
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
import fs from 'file-saver';
import unit from '../unit.js';

export default {
	data () {
		return {
			search: '',
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'material_id'},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location', filterable: false},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Осталось | Поступило', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life', filterable: false}
			],
			gridData: [],
		}
	},
	methods: {
		getStorage(){
			this.$http.get('/api/reagent/storage/archives').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
	},
	computed: {
		todays(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
		idDep(){
			return this.$store.getters.idDepartment;
		},
		//		if(this.idDep != 5)
		//		{
		//			r.amount = this.$convert(r.amount).param(r.density).measure(unit[r.id_order_measure]).to(unit[r.id_measure]);
		//			r.order_measure = r.measure;
		//			if(r.total === null) r.total = r.amount
		//			else r.total = this.$convert(r.total).param(r.density).measure(unit[r.id_order_measure]).to(unit[r.id_measure]);
		//		}

	},
	created(){
		this.getStorage();
	}
  }
</script>