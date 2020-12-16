<template><v-row>
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
						<v-toolbar-title>Исправления расхода</v-toolbar-title>
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
				<template v-slot:header.created_at="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.create_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.create_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.create_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.created_at="{item}">
					{{today(item.created_at)}}
				</template>
				<template v-slot:item.date_response="{item}">
					{{today(item.date_response)}}
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn x-small color="orange" @click="dialogDetail(item)">Просмотр</v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialog" max-width="574">
			<v-card>
				<v-card-title>Запрос № {{ item.id }}</v-card-title>
				<v-card-text>
					{{item.reason_correct}}
				</v-card-text>
				<v-divider></v-divider>
				<v-card-text>
					<v-list dense>
						<v-list-item two-line>
							<v-list-item-title>Код материала - {{ item.id_material }}</v-list-item-title>
						</v-list-item>
						<v-list-item two-line>
							<v-list-item-title>Расход ({{item.measure}}) - {{ today(item.date_usage) }}</v-list-item-title>
						</v-list-item>
						<v-list-item two-line>
							<v-list-item-title>Потраченное количество - {{ item.spent_amount }}</v-list-item-title>
						</v-list-item>
						<v-list-item two-line>
							<v-list-item-title>Исправляемое количество - {{ item.corrected_amount }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions  v-if="item.id_status === 1">
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
				{ text: 'Сотрудник', align: 'start', sortable: true, value: 'user',
				filter: value => {return this.activeFilters.user ? this.activeFilters.user.includes(value) : true}},
				{ text: 'Создано', align: 'start', sortable: true, value: 'created_at',
				filter: value => {return !this.DateFilters.create_start_date && !this.DateFilters.create_end_date ? true :
				value >= this.DateFilters.create_start_date && value <= this.DateFilters.create_end_date}},
				{ text: 'Отвечено', align: 'start', sortable: true, value: 'date_response'},
				{ text: 'Статус', align: 'start', sortable: true, value: 'status',
				filter: value => {return this.activeFilters.status ? this.activeFilters.status.includes(value) : true}},
				{ text: '', align: 'start', sortable: false, value: 'actions', filterable: false}
			],
			search: '',
			gridData: [],
			filters: { user: [], status: []},
			activeFilters: {},
			DateFilters: {
				create_start_date: null,
				create_end_date: null
			},
			dialog: false,
			item: {},
			isDenyLoading: false,
			isAllowLoading: false,
			load: false
		}
	},
	watch: {
		gridData(){
			this.initFilters();
		}
	},
	methods: {
		getCorrections(){
			this.load = true;
			this.$http.get('/api/reagent/corrections').then(response => (this.gridData = response.data, this.load = false)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		dialogDetail(item){
			this.item = item;
			this.dialog = true;
		},
		allow(){
			this.isAllowLoading = !this.isAllowLoading;
			this.$http.put(`/api/reagent/corrections/allow/${this.item.id}`, { id_outgo: this.item.id_outgo, amount: this.item.corrected_amount},{headers: {'Content-Type': 'application/json'}})
				.then(response => (this.dialog = false, this.item.id_status = 2,this.item.status = 'Подтверждена', this.item.date_response = new Date(),
				this.isAllowLoading = !this.isAllowLoading)).catch(error => (alert(error.response.data.message), this.isAllowLoading = !this.isAllowLoading));
		},
		deny(){
			this.isDenyLoading = !this.isDenyLoading;
			this.$http.put(`/api/reagent/corrections/deny/${this.item.id}`, {headers: {'Content-Type': 'application/json'}})
				.then(response => (this.dialog = false, this.item.id_status = 3, this.item.status = 'Отклонена', this.item.date_response = new Date(),
				this.isDenyLoading = false)).catch(error => (this.isDenyLoading = false, alert(error.response.data.message)));
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
	created(){
		this.getCorrections();
	}
  }
</script>