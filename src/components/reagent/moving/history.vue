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
						<v-toolbar-title>История заявок</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск " clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn x-small color="orange" @click="confirmMoving(item)">Просмотр</v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
		<v-dialog dense v-model="dialogMoving" max-width="1512px">
			<v-card>
				<v-card-title>Запрашиваемые материалы</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-data-table calculate-widths dense item-key="id"
						:headers="tableColumn1"
						:items="materials"
						:items-per-page="10"
						:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
					<template v-slot:item.id_material="{item}">
						{{item.id_material}} / {{today(item.date_order)}}
					</template>
					<template v-slot:item.measure="{item}">
						{{ idDep === 5 ? item.measure : item.order_measure }}
					</template>
					<template v-slot:item.total="{item}">
						{{ idDep === 5 ? convert(item, 'total') || convert(item, 'arrival_amount') : item.total || item.arrival_amount }}
					</template>
					<template v-slot:item.amount="{item}">
						{{ idDep === 5 ? convert(item, 'amount') :item.amount }}
					</template>
					<template v-slot:item.date_create="{item}">
						{{today(item.date_create)}}
					</template>
					<template v-slot:item.shelf_life="{item}">
						{{today(item.shelf_life)}}
					</template>
					</v-data-table>
				</v-card-text>
				<v-card-actions v-if="item.id_department_from != idDep && item.id_status === 1">
					<v-spacer></v-spacer>
					<v-btn color="success" @click="allow()" :loading="isAllowLoading">Принять</v-btn>
					<v-btn color="error" @click="deny()" :loading="isDenyLoading">Отказать</v-btn>
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
				{ text: 'Получатель', align: 'start', sortable: true, value: 'dep_from'},
				{ text: 'Запросил', align: 'start', sortable: true, value: 'user'},
				{ text: 'Отправитель', align: 'start', sortable: true, value: 'dep_to', filterable: false},
				{ text: 'Статус', align: 'start', sortable: true, value: 'status'},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			tableColumn1: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id_material'},
				{ text: 'Место хранения', align: 'start', sortable: true, value: 'location'},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material'},
				{ text: 'Ед. изм.', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Требуют', align: 'start', sortable: true, value: 'amount'},
				{ text: 'Остаток', align: 'start', sortable: true, value: 'total'},
				{ text: 'Изготовлен', align: 'start', sortable: true, value: 'date_create'},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life'},
			],
			gridData: [],
			materials: [],
			item: {},
			search: '',
			dialogMoving: false,
			overlay: false,
			isDenyLoading: false,
			isAllowLoading: false,
			load: false
		}
	},
	methods: {
		getMovings(){
			this.load = true;
			this.$http.get('/api/reagent/moving').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		confirmMoving(item){
			this.item = item;
			this.overlay = true;
			this.$http.get(`/api/reagent/moving/${item.id}/materials`)
			.then(response => (this.overlay = false, this.dialogMoving = true, this.materials = response.data))
			.catch(error => (this.overlay = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
		allow(){
			this.isAllowLoading = true;
			this.$http.put(`/api/reagent/moving/allow/${this.item.id}/${this.item.id_department_from}`)
				.then((response) => ( this.item.status = 'Подтвержден',
				this.item.id_status = 2, 
				this.item.date_moving = this.dateToday(), 
				this.isAllowLoading = false,
				this.dialogMoving = false)).catch(error => (this.isAllowLoading = false, alert(error.response.data.message)));
		},
		deny(){
			this.isDenyLoading = !this.isDenyLoading;
			this.$http.put(`/api/reagent/moving/deny/${this.item.id}`).then(response => (
				this.item.status = 'Отклонен',
				this.item.id_status = 3,
				this.item.date_moving = this.dateToday(),
				this.isDenyLoading = false,
				this.dialogMoving = false)).catch(error => (this.isDenyLoading = false, alert(error.response.data.message)));
		},
		dateToday(){
			return new Date();
		},
		convert(item, param){
			return this.$convert(item[param]).param(item.density).measure(unit[item.id_order_measure]).to(unit[item.id_measure]);
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		}
	},
	created(){
		this.getMovings();
	}
  }
</script>