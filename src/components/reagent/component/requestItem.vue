<template>
	<v-data-table dense :items="Items" :headers="tableColumn" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
		<template v-slot:item.total="{item}">
			{{ idDep === 5 ? parseFloat(item.total.toFixed(2)) : convert(item, 'total') }}
		</template>
		<template v-slot:item.mamount="{item}">
			<v-text-field type="number" outlined dense v-model="item.mamount"></v-text-field>
		</template>
		<template v-slot:item.mlocation="{item}">
			<!--<v-autocomplete :items="dropdownLocation" clearable v-model="item.mlocation" outlined dense></v-autocomplete>-->
		</template>
	</v-data-table>
</template>

<script>
import unit from '../unit.js';

export default {
	props: {
		items: Array
	},
	data(){
		return {
			tableColumn: [
				{ text: 'Место хранения', align: 'start', sortable: false, value: 'location', filterable: false},
				{ text: 'Тип', align: 'start', sortable: false, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: false, value: 'material', width: 200},
				{ text: 'Ед.изм', align: 'start', sortable: false, value: 'measure', filterable: false},
				{ text: 'Остаток', align: 'start', sortable: false, value: 'total', filterable: false},
				{ text: 'Требуется', align: 'start', sortable: false, value: 'mamount', filterable: false},
				{ text: 'Место хранения', align: 'start', sortable: false, value: 'mlocation', filterable: false},
			]
		}
	},
	methods: {
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		},
	},
	computed: {
		Items(){
			if(this.items)
				return this.items
		},
		totalMore(){
			this.Items.forEach(element => {
				if(element.mamount)
				{
					let amount_m = this.$convert(element.mamount).param(element.density).measure(unit[element.id_measure]).to(unit[element.id_order_measure]);
					
					if(amount_m > element.total)
						this.$emit('isMore', true);
				}
			});
		}
	}
}
</script>