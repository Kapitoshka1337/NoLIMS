<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense item-key="id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="30"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Животные</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn :ripple="false" small color="orange" @click="dialog = true">Добавить животное</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon color="blue" @click="editedItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
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
							<v-text-field dense outlined clearable label="Животное" v-model="item.title"></v-text-field>
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
				{ text: 'Животное', align: 'start', sortable: true, value: 'title'},
				{ text: '', align: 'start', sortable: false, value: 'actions'}
			],
			gridData: [],
			item: {
                id: null,
				title: null
            },
			defaultItem: {
                id: null,
				title: null
			},
			search: '',
			dialog: false,
			editedIndex: -1,
			loading: false,
			load: false
		}
	},
	computed: {
		formTitle(){
			return this.editedIndex === -1 ? 'Добавление животного' : 'Редактирование'
		}
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
    },
	methods: {
		getAnimals(){
			this.load = true;
			this.$http.get('/api/gz/animals').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
        },
        close () {
            this.dialog = false;
            this.$nextTick(() => {
                this.item = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
		editedItem(item){
			this.editedIndex = this.gridData.indexOf(item);
			this.item = Object.assign({}, item);
			this.dialog = true;
		},
		save(){
			if(this.editedIndex > -1)
			{
				this.loading = true;
				this.$http.put(`/api/gz/animals/${this.item.id}`, this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; Object.assign(this.gridData[this.editedIndex], this.item); this.close();})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
			}
			else
			{
				this.loading = true;
				this.$http.post("/api/gz/animals", this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; this.gridData.push(this.item); this.close();})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
			}
		}
	},
	created(){
		this.getAnimals();
	}
  }
</script>