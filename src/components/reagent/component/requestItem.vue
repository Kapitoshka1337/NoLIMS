<template>
	<v-data-table dense :items="Items" :headers="tableColumn" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
		<template v-slot:item.total="{item}">
			{{ idDep === 5 ? parseFloat(item.total.toFixed(2)) : convert(item, 'total') }}
		</template>
		<template v-slot:item.mamount="{item}">
			<v-text-field type="number" min="0" outlined dense v-model="item.mamount"></v-text-field>
			<!--<v-text-field type="number" min="0" outlined dense v-model="item.mamount" @input="compare(item)"></v-text-field>-->
		</template>
		<template v-slot:item.mlocation="{item}">
			<v-autocomplete :items="Locations" clearable v-model="item.mlocation" outlined dense></v-autocomplete>
		</template>
	</v-data-table>
</template>

<script>
import unit from '../unit.js';

export default {
	props: {
		items: Array,
		locations: Array
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
				{ text: 'Место хранения', align: 'start', sortable: false, value: 'mlocation', filterable: false}
			],
			badItems: []
		}
	},
	methods: {
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		},
		//compare(item){
		//	if(item.mamount && item.mamount != '' && item.mamount != null)
		//	{
		//		let amount_m = this.$convert(item.mamount).param(item.density).measure(unit[item.id_measure]).to(unit[item.id_order_measure]);	
		//		if(amount_m < item.total && amount_m > 0 && amount_m != '' && amount_m)
		//		{
		//			let idx = this.badItems.indexOf(item);
		//			if (idx > -1) this.badItems.splice(idx, 1);
		//		}
		//		else
		//		{
		//			if(this.badItems.indexOf(item) < 0)
		//				this.badItems.push(item);
		//		}
		//	}
		//}
	},
	watch: {
		//items(newVal){
		//	if(!newVal.length)
		//	{
		//		this.badItems = [];
		//		this.$emit('isMore', true);
		//	}
		//	else
		//	{
		//		this.badItems = Array.from(this.items);
		//		this.$emit('isMore', false);
		//	}
		//},
		//badItems(newVal, oldVal){
		//	console.log(`new: ${newVal.length} old:${oldVal.length}`);
		//	if(!newVal.length && !oldVal.length)
		//		this.$emit('isMore', false);
		//	else
		//		this.$emit('isMore', true);
		//}
	},
	computed: {
		Items(){
			if(this.items)
				return this.items
		},
		Locations(){
			if(this.locations)
				return this.locations
		},
		idDep(){
			return this.$store.getters.idDepartment;
		},
		//isBad(){
		//	if(!this.badItems.length)
		//		this.$emit('isMore', false);
		//	else
		//		this.$emit('isMore', true);
		//}
	}
}
</script>