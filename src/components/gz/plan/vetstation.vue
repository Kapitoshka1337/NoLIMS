<template>
	<v-row>
		<v-col cols="12">
			<v-data-table
				@item-selected="selectedEquipment"
				dense
				v-model="selected"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="20"
				:loading="load" 
				:show-select="true"
				item-key="id"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data(){
		return {
			tableColumn: [
				{ text: 'Вет.станция', align: 'start', sortable: false, value: 'title'}
			],
			gridData: [],
			selected: [],
			load: false,
		}
	},
	methods: {
		getVetstation(){
			this.load = true;
			this.$http.get('/api/gz/support/vetstations').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		selectedEquipment(item){
			this.editedIndex = this.gridData.indexOf(item);
			if(item.value) this.$emit('id', item.item.id);
		},
	},
	created(){
		this.getVetstation();
	}
}
</script>