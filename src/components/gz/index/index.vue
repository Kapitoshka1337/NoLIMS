<template>
	<v-row>
		<v-col cols="12">
			<v-data-table :headers="headers" :items="gridData" item-key="id" dense show-expand :single-expand="singleExpand" :expanded.sync="expanded"
					:items-per-page="50"
					:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, 200], itemsPerPageText: 'Отобразить на странице'}"
					:loading="load"
					:search="search">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Госзадание</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn small color="orange" @click="confirmCreate()" :loading="loadSupport">Добавить</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td :colspan="headers.length">
						<v-chip small color="success">Квартальный остаток/план: {{ item.block_balance }} / {{ item.block_plan}}</v-chip>
						<v-chip small color="primary">Годовой остаток/план: {{ item.plan_balance }} / {{ item.plan}}</v-chip>
						<v-chip small color="red" text-color="white">Итого: {{ item.total }}</v-chip>
						<v-chip small color="success">Место отбора: {{ item.place_of_selection }}</v-chip>
					</td>
				</template>
			</v-data-table>
			<v-dialog dense v-model="dialog" max-width="1512px">
				<template v-slot:activator="{ on, attrs }">
				</template>
				<v-card>
					<v-card-title>Добавление поступления</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-col cols="4">
								<v-autocomplete v-model="form.id_vetstation" :items="supportData.vetstation" item-value="id" item-text="title" clearable outlined dense label="Вет.станция"></v-autocomplete>
							</v-col>
							<v-col cols="4">
								<v-autocomplete v-model="form.id_region" :items="filteredRegion" item-value="id" item-text="title" clearable outlined dense label="Район"></v-autocomplete>
							</v-col>
							<v-col cols="4">
								<v-autocomplete v-model="form.id_farm" :items="filteredFarm" item-value="id" item-text="title" clearable outlined dense label="Предприятие"></v-autocomplete>
							</v-col>
							<v-col cols="3">
								<v-autocomplete v-model="form.id_animal" :items="supportData.animal" item-value="id" item-text="title" clearable outlined dense label="Животное"></v-autocomplete>
							</v-col>
							<v-col cols="3">
								<v-autocomplete v-model="form.id_method_plan" :items="filteredMethod" item-value="mp_id" item-text="method" clearable outlined dense label="Исследование"></v-autocomplete>
							</v-col>
							<v-col cols="3">
								<v-text-field type="number" v-model="form.amount" outlined dense label="Количество"></v-text-field>
							</v-col>
							<v-col cols="3">
								<v-text-field v-model="form.date_enter" type="date" outlined dense label="Дата поступления"></v-text-field> 
							</v-col>
							<v-col cols="12">
								<v-text-field v-model="form.place_of_selection" outlined dense label="Место отбора"></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="orange" icon @click="confirmCreateFarm()"><v-icon large>mdi-home-circle-outline</v-icon></v-btn>
						<v-spacer></v-spacer>
						<v-btn color="success" v-on:click="submit()" :loading="loading">Сохранить</v-btn>
						<v-btn color="error" @click="dialog = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense v-model="dialogFarm" max-width="700">
				<v-card>
					<v-card-title>Предприятие</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-text-field dense outlined clearable label="Предприятие" v-model="farm.title"></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="submitFarm()" :loading="loading">ОК</v-btn>
						<v-btn color="error" @click="dialogFarm = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data(){
		return {
			expanded: [],
			singleExpand: false,
			headers: [
				{text: 'Код', align: 'start', sortable: true, value: 'id'},
				{text: 'Вет.станция', align: 'start', sortable: true, value: 'vet'},
				{text: 'Район', align: 'start', sortable: true, value: 'region'},
				{text: 'Предприятие', align: 'start', sortable: true, value: 'farm'},
				{text: 'Животное', align: 'start', sortable: true, value: 'animal'},
				{text: 'Исследование', align: 'start', sortable: true, value: 'method'},
				{text: 'Количество', align: 'start', sortable: true, value: 'amount'},
				{text: 'Поступило', align: 'start', sortable: true, value: 'date'},
				{ text: '', value: 'data-table-expand' },
			],
			search: '',
			load: false,
			loading: false,
			loadSupport: false,
			gridData: [],
			supportData: {},
			dialog: false,
			dialogFarm: false,
			form: {
				id_vetstation: null,
				id_region: null,
				id_farm: null,
				id_animal: null,
				id_method_plan: null,
				amount: null,
				date_enter: null,
				place_of_selection: null,
			},
			farm: {
				title: null,
				id_region: null
			}
		}
	},
	methods: {
		getData(){
			this.load = true;
			this.$http.get('/api/gz/index').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		getSupport(){
			this.loadSupport = true;
			this.$http.get('/api/gz/support/create').then(response => (this.loadSupport = false, this.dialog = true, this.supportData = response.data)).catch(error => (this.loadSupport = false, alert(error.response.data.message)));
		},
		confirmCreate(){
			if(!Object.keys(this.supportData).length)
				this.getSupport();
			else this.dialog = true;
		},
		confirmCreateFarm(){
			this.dialogFarm = true;
		},
		submitFarm(){
			this.loading = true;
			this.farm.id_region = this.form.id_region;
			this.$http.post('/api/gz/index/farm', this.farm, {headers: {'Content-Type': 'application/json'}}).then(response => (this.loading = false, this.dialogFarm = false, this.getSupport())).catch(error => (this.loading = false, alert(error.response.data.message)));
		},
		submit(){
			this.loading = true;
			this.$http.post('/api/gz/index', this.form, {headers: {'Content-Type': 'application/json'}}).then(response => (this.loading = false, this.dialog = false, this.getData())).catch(error => (this.loading = false, alert(error.response.data.message)));
		}
	},
    computed: {
		filteredRegion(){
			return Object.keys(this.supportData).length ? this.supportData.region.filter(r => { return r.id_vetstation === this.form.id_vetstation }) : false;
		},
		filteredFarm(){
			return Object.keys(this.supportData).length ? this.supportData.farm.filter(r => { return r.id_region === this.form.id_region }) : false;
		},
		filteredMethod(){
			return Object.keys(this.supportData).length ? this.supportData.method.filter(r => { return r.vt_id === this.form.id_vetstation && r.animal_id === this.form.id_animal }) : false;
		}
    },
	created(){
		this.getData();
	}
}
</script>