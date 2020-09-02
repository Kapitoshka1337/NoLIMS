<template>
	<v-row>
		<v-col cols="12">
			<v-data-table dense item-key="arrival_material_id" v-model="selected"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="50"
				:loading="load"
				:search="search"
				:show-select="true"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
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
							<v-list flat dense>
								<v-list-item-group v-model="activeFilters[header.value]">
									<template v-for="(item, i) in filters[header.value]">
										<v-list-item :key="`${item}`" :value="item" :ripple="false">
											<template v-slot:default="{ active, toggle }">
												<v-list-item-action>
													<v-checkbox :input-value="active" :true-value="item" @click="toggle" color="primary" :ripple="false" dense></v-checkbox>
												</v-list-item-action>
												<v-list-item-content> 
													<v-list-item-title v-text="item"></v-list-item-title>
												</v-list-item-content>
											</template>
										</v-list-item>
									</template>
								</v-list-item-group>
							</v-list>
						</v-menu>
					</div>
				</template>
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Выбор материала для передачи</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск ТИП/МАТЕРИАЛ" clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn small :ripple="false" color="success" @click="dialog = true" v-bind:disabled="isRole === 1|| isRole === 4">Сформировать</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.date_order="{item}">
					{{ today(item.date_order) }}
				</template>
				<template v-slot:item.measure="{item}">
					{{ idDep === 5 ? item.order_measure : item.measure }}
				</template>
				<template v-slot:item.total="{item}">
					{{ idDep === 5 && item.total === null ? item.amount : item.total === null ? convert(item, 'amount') : item.total}}
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
		<v-dialog dense v-model="dialog" max-width="1512">
			<v-card>
				<v-card-title>Запрашиваемые материалы из {{ activeFilters.department }}</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-data-table dense :items="selectedDialog" :headers="tableColumn1" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
						<template v-slot:item.total="{item}">
							{{ idDep === 5 ? item.total || item.amount : convert(item, 'total') || convert(item, 'amount')}}
						</template>
						<template v-slot:item.mamount="{item}">
							<v-text-field type="number" outlined dense v-model="item.mamount"></v-text-field>
						</template>
						<template v-slot:item.mlocation="{item}">
							<v-autocomplete :items="dropdownLocation" clearable v-model="item.mlocation" outlined dense></v-autocomplete>
						</template>
					</v-data-table>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="submutMoving()" :loading="loading">Отправить</v-btn>
					<v-btn color="error" @click="dialog = false">Отмена</v-btn>
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
				{ text: 'Отдел', align: 'start', sortable: true, value: 'department', width: 120, filter: value => {return this.activeFilters.department ? this.activeFilters.department.includes(value) : true}},
				{ text: 'Дата пост.', align: 'start', sortable: true, value: 'date_order', filterable: false},
				{ text: 'Местоположение', align: 'start', sortable: true, value: 'location', filterable: false},
				{ text: 'Тип', align: 'start', sortable: true, value: 'type', filter: value => {return this.activeFilters.type ? this.activeFilters.type.includes(value) : true}},
				{ text: 'Материал', align: 'start', sortable: true, value: 'material', width: 200},
				{ text: 'Ед.изм', align: 'start', sortable: true, value: 'measure', filterable: false},
				{ text: 'Остаток', align: 'start', sortable: true, value: 'total', filterable: false},
				{ text: 'Поступило', align: 'start', sortable: true, value: 'amount', filterable: false},
				{ text: 'Срок хранения', align: 'start', sortable: true, value: 'shelf_life', filterable: false}
			],
			tableColumn1: [
				{ text: 'Место хранения', align: 'start', sortable: false, value: 'location', filterable: false},
				{ text: 'Тип', align: 'start', sortable: false, value: 'type'},
				{ text: 'Материал', align: 'start', sortable: false, value: 'material', width: 200},
				{ text: 'Ед.изм', align: 'start', sortable: false, value: 'measure', filterable: false},
				{ text: 'Остаток', align: 'start', sortable: false, value: 'total', filterable: false},
				{ text: 'Требуется', align: 'start', sortable: false, value: 'mamount', filterable: false},
				{ text: 'Место хранения', align: 'start', sortable: false, value: 'mlocation', filterable: false},
			],
			search: '',
			selected: [],
			gridData: [],
			filters: { department: [], type: [] },
			activeFilters: {},
			dialog: false,
			loading: false,
			listLocations: [],
			load: false
		}
	},
	methods: {
		submutMoving(){
			let obb = [];
			for(let item of this.selectedDialog)
			{
				obb.push({
					id_arrival_material: item.arrival_material_id,
					id_location: item.mlocation,
					amount: this.$convert(item.mamount).param(item.density).measure(unit[item.id_measure]).to(unit[item.id_order_measure])
				});
			}
			let obj = {
				id_department_to: this.selectedDialog[0].id_department,
				materials: obb
			};
			this.loading = true;
			this.$http.post('/api/reagent/moving', obj).then(response => (this.dialog = false, this.loading = false)).catch(error => (this.loading = false, alert(error.response.data.message)));
		},
		getStorageAll(){
			this.load = true;
			this.$http.get('/api/reagent/storage/all').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
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
		},
		initFilters() {
			for (let col in this.filters) {
				this.filters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })}
			this.activeFilters = Object.assign({}, this.filters)
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
		},
		isRole(){
			return this.$store.getters.isRoles;
		},
        dropdownLocation(){
            if(!this.listLocations.length)
                this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error.response.data.message)));
            else
            {
                let result = [];
				for (let str of this.listLocations)
                    result.push({value: str['id'], text: `${str['cabinet_number']} ${str['place']} ${str['notation']}`});
                return result;
            }
		},
		selectedDialog(){
			return JSON.parse(JSON.stringify(this.selected));
		}
	},
	created(){
		this.getStorageAll();
	}
  }
</script>