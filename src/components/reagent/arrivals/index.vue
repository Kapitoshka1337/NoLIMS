<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Поступления</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск " clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn small to="/reagent/arrivals/create" :ripple="false" color="orange">Добавить поступление</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.date_order="{item}">
					{{today(item.date_order)}}
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn x-small color="orange" @click="confirmOrder(item)">Просмотр</v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
		<v-dialog dense v-model="dialogOrder" max-width="1512px">
			<v-card>
				<v-card-title>Заказ № {{ item.num_order }} от {{ today(item.date_order) }}</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-data-table calculate-widths dense item-key="id"
						:headers="tableColumn1"
						:items="materials"
						:items-per-page="10"
						:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
					</v-data-table>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="dialogOrder = false">Закрыть</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
export default {
	data () {
		return {
			search: '',
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id'},
				{ text: 'Номер', align: 'start', sortable: true, value: 'num_order'},
				{ text: 'Дата заказа', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Операция', align: 'start', sortable: true, value: 'moving_type'},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			tableColumn1: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id_material'},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location'},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure'},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount'},
				{ text: 'Изготовлен', align: 'start', sortable: true, value: 'shelf_life'},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'date_create'}
			],
			gridData: [],
			overlay: false,
			dialogOrder: false,
			load: false,
			materials: [],
			item: {}
		}
	},
	methods: {
		getArrivals(){
			this.load = true;
			this.$http.get('/api/reagent/arrivals').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		confirmOrder(item){
			this.item = item;
			this.overlay = true;
			this.$http.get(`/api/reagent/arrivals/${item.id}/materials`).then(response => (this.materials = response.data, this.overlay = false, this.dialogOrder = true)).catch(error => (this.overlay = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		}
	},
	created(){
		this.getArrivals();
	}
  }
</script>