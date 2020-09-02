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
				<template v-slot:item.created_at="{item}">
					{{today(item.created_at)}}
				</template>
				<template v-slot:item.date_moving="{item}">
					{{today(item.date_moving)}}
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
						{{ idDep === 5 && item.total === null ? item.amount : item.total === null ? convert(item, 'amount') : item.total}}
						<!-- {{ idDep === 5 ? convert(item, 'total') || convert(item, 'arrival_amount') : item.total || item.arrival_amount }} -->
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
				{ text: 'Запрос', align: 'start', sortable: true, value: 'created_at'},
				{ text: 'Получатель', align: 'start', sortable: true, value: 'dep_from',
				filter: value => {return this.activeFilters.dep_from ? this.activeFilters.dep_from.includes(value) : true}},
				{ text: 'Запросил', align: 'start', sortable: true, value: 'user',
				filter: value => {return this.activeFilters.user ? this.activeFilters.user.includes(value) : true}},
				{ text: 'Отправитель', align: 'start', sortable: true, value: 'dep_to',
				filter: value => {return this.activeFilters.dep_to ? this.activeFilters.dep_to.includes(value) : true}},
				{ text: 'Передано', align: 'start', sortable: true, value: 'date_moving'},
				{ text: 'Статус', align: 'start', sortable: true, value: 'status',
				filter: value => {return this.activeFilters.status ? this.activeFilters.status.includes(value) : true}},
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
			filters: { dep_from: [], user: [], dep_to: [], status: []},
			activeFilters: {},
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
		}
	},
	watch: {
		gridData(){
			this.initFilters();
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