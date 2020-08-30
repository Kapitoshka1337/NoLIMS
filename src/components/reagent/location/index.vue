<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="matertia_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="30"
				:loading="gridData.length <= 0"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Места хранения</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn :ripple="false" small color="orange" @click="dialog = true">Добавить местоположение</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon color="blue" @click="editedItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialog" max-width="700">
			<v-card>
				<v-card-title>{{ formTitle }}</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field dense outlined clearable label="Кабинет" v-model="item.cabinet_number"></v-text-field>
							<v-text-field dense outlined clearable label="Место(мебель, техника)" v-model="item.place"></v-text-field>
							<v-text-field dense outlined clearable label="Полка" v-model="item.notation" ></v-text-field>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="save()" :loading="loading">ОК</v-btn>
					<v-btn color="error" @click="dialog = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
export default {
	data () {
		return {
			tableColumn: [
				{ text: 'Кабинет', align: 'start', sortable: true, value: 'cabinet_number'},
				{ text: 'Место (мебель)', align: 'start', sortable: true, value: 'place'},
				{ text: 'Полка', align: 'start', sortable: true, value: 'notation'},
				{ text: '', align: 'start', sortable: false, value: 'actions'}
			],
			gridData: [],
			item: {
				cabinet_number: null,
				place: null,
				notation: null
			},
			dialog: false,
			editedIndex: -1,
			loading: false
		}
	},
	computed: {
		formTitle(){
			return this.editedIndex === -1 ? 'Новое местоположение' : 'Редактирование местоположения'
		}
	},
	methods: {
		getLocation(){
			this.$http.get('/api/reagent/locations').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		editedItem(item){
			this.editedIndex = this.gridData.indexOf(item)
			this.item = Object.assign({}, item);
			this.dialog = true;
		},
		save(){
			if(this.editedIndex > -1)
			{
				this.loading = true;
				this.$http.put(`/api/reagent/locations/${this.item.id}`, this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; Object.assign(this.gridData[this.editedIndex], this.item); this.editedItem = -1;})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
			}
			else
			{
				this.loading = true;
				this.$http.post("/api/reagent/locations", this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; this.gridData.push(this.item); this.editedItem = -1;})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
			}
		}
	},
	created(){
		this.getLocation();
	}
  }
</script>