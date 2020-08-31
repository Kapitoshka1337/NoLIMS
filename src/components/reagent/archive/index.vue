<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="matertia_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Архивные материалы</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск КОД/ТИП/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-slot:item.date_order="{item}">
					{{ today(item.date_order) }}
				</template>
				<template v-slot:item.measure="{item}">
					{{ idDep === 5 ? item.order_measure : item.measure }}
				</template>
				<template v-slot:item.total="{item}">
					{{ idDep === 5 ? item.total || item.amount : convert(item, 'total') || convert(item, 'amount')}}
				</template>
				<template v-slot:item.amount="{item}">
					{{ idDep === 5 ? item.amount : convert(item, 'amount') }}
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
				{ text: 'Осталось', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life', filterable: false}
			],
			gridData: [],
			load: false
		}
	},
	methods: {
		getStorage(){
			this.load = true;
			this.$http.get('/api/reagent/storage/archives').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		}
	},
	computed: {
		todays(){
			let today = new Date();
			return today.toLocaleString().split(',')[0];
		},
		idDep(){
			return this.$store.getters.idDepartment;
		}

	},
	created(){
		this.getStorage();
	}
  }
</script>