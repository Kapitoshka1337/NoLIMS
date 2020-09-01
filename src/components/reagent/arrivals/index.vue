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
				<template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }">
					<div style="display: inline-block; padding: 16px 0;">{{ header.text }}</div>
					<div style="float: right; margin-top: 8px">
						<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed style="position: absolute; right: 0">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="indigo" icon v-bind="attrs" v-on="on">
									<v-icon small 
										:color="activeFilters[header.value] && activeFilters[header.value].length < filters[header.value].length ? 'red' : 'default'">mdi-filter-variant
									</v-icon>
								</v-btn>
							</template>
							<v-list dense>
								<v-list-item-content>
									<v-select :items="filters[header.value]" v-model="activeFilters[header.value]" :clearable="true" multiple outlined dense>
										<template v-slot:selection="{ item, index }">
											<v-chip small v-if="index === 0"><span>{{ item }}</span></v-chip>
											<span v-if="index === 1" class="grey--text caption">(+{{ activeFilters[header.value].length - 1 }})</span>
										</template>
									</v-select>
								</v-list-item-content>
								<v-divider></v-divider>
								<v-row no-gutters>
									<v-col cols="6">
										<v-btn text block @click="toggleAll(header.value)" color="success">Выделить всё</v-btn>
									</v-col>
									<v-col cols="6">
										<v-btn text block @click="clearAll(header.value)" color="warning">Снять всё</v-btn>
									</v-col>
								</v-row>
							</v-list>
						</v-menu>
					</div>
				</template>
				<template v-slot:header.date_order="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.order_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.order_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.order_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
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
				{ text: 'Дата заказа', align: 'start', sortable: true, value: 'date_order',
				filter: value => {return !this.DateFilters.order_start_date && !this.DateFilters.order_end_date ? true :
				value >= this.DateFilters.order_start_date && value <= this.DateFilters.order_end_date}},
				{ text: 'Операция', align: 'start', sortable: true, value: 'moving_type', filter: value => {return this.activeFilters.moving_type ? this.activeFilters.moving_type.includes(value) : true}},
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
			filters: { moving_type: []},
			activeFilters: {},
			DateFilters: {
				order_start_date: null,
				order_end_date: null
			},
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
		},
		initFilters() {
			for (let col in this.filters) {
				this.filters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })}
			this.activeFilters = Object.assign({}, this.filters)
		},
		toggleAll (col) {
			this.activeFilters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })
		},
		clearAll (col) {
			this.activeFilters[col] = []
		},
	},
	watch: {
		gridData(){
			this.initFilters();
		}
	},
	created(){
		this.getArrivals();
	}
  }
</script>