<template>
	<v-row>
		<v-col cols="12">
			<v-data-table :headers="tableColumn" :items="gridData" :items-per-page="100" multi-sort item-key="id_mp" :sort-by="['method', 'block']" group-by="animal" show-group-by dense :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, 200], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>{{tableTitle}}</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn x-small color="success" @click="confirmCreate()" :loading="loadSupport">Добавить годовой план</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon color="orange" @click="editItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
				</template>
				<template v-slot:group.header="{ headers, items, toggle }">
					<td>
						<v-btn x-small @click="toggle" icon color="red">
							<v-icon>mdi-swap-vertical</v-icon>
						</v-btn>
						животное: {{items[0].animal}}
					</td>
					<td></td>
					<td></td>
					<td></td>
					<td><v-btn color="success" icon @click="confirmBlock(items)"><v-icon>mdi-plus</v-icon></v-btn></td>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialogCreateBlock" max-width="512">
			<v-card>
				<v-card-title>Добавление квартального плана</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-autocomplete v-model="form.id_method" :items="mth" item-value="id_mp" item-text="method" clearable outlined dense label="Исследование"></v-autocomplete>
							<v-autocomplete multiple v-model="form.quarter" :items="quarterData" clearable outlined dense label="Квартал"></v-autocomplete>
							<v-text-field type="number" dense outlined label="Квартальный план" v-model="form.block_plan"></v-text-field>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="createQuarter()" :loading="loading">Сохранить</v-btn>
					<v-btn color="error" @click="dialogCreateBlock = false" >Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog dense v-model="dialogEdit" max-width="512">
			<v-card>
				<v-card-title>{{ editedItem.animal }} ({{ editedItem.method }})</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field type="number" dense outlined label="Квартал" v-model="editedItem.block"></v-text-field>
							<v-text-field type="number" dense outlined label="Квартальный план" v-model="editedItem.block_plan"></v-text-field>
							<v-text-field type="number" dense outlined label="Годовой план" v-model="editedItem.plan"></v-text-field>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="updateQuarter()" :loading="loading">Сохранить</v-btn>
					<v-btn color="error" @click="dialogEdit = false" >Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog dense v-model="dialogCreate" max-width="512">
			<v-card>
				<v-card-title>Добавление годового плана</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-autocomplete v-model="form.id_vetstation" :items="supportData.vetstation" item-value="id" item-text="title" clearable outlined dense label="Вет.станция"></v-autocomplete>
							<v-autocomplete v-model="form.id_animal" :items="supportData.animal" item-value="id" item-text="title" clearable outlined dense label="Животное"></v-autocomplete>
							<v-autocomplete v-model="form.id_method" :items="supportData.method" item-value="id" item-text="title" clearable outlined dense label="Исследование"></v-autocomplete>
							<v-text-field v-model="form.plan" type="number" dense outlined label="Годовой план"></v-text-field>
							<v-autocomplete multiple v-model="form.quarter" :items="quarterData" clearable outlined dense label="Квартал"></v-autocomplete>
							<v-text-field v-model="form.block_plan" dense outlined label="Квартальный план"></v-text-field>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="create()" :loading="loading">Сохранить</v-btn>
					<v-btn color="error" @click="dialogCreate = false" >Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
	</v-row>
</template>

<script>
export default {
	props:{
        id: {
            type: Number
        }
    },
	data(){
		return {
			overlay: false,
			tableColumn: [
				{ text: 'Животное', align: 'start', sortable: true, value: 'animal'},
				{ text: 'Исследование', align: 'start', sortable: true, value: 'method', groupable: false},
				{ text: 'Квартал', align: 'start', sortable: true, value: 'block', groupable: false},
				{ text: 'Квартальный план', align: 'start', sortable: true, value: 'block_plan', groupable: false},
				{ text: 'Годовой план', align: 'start', sortable: true, value: 'plan', groupable: false},
				{ text: '', align: 'start', sortable: false, value: 'actions', groupable: false}
			],
			gridData: [],
			supportData: [],
			editedIndex: -1,
			editedItem: {},
			dialogEdit: false,
			dialogCreate: false,
			dialogCreateBlock: false,
			loading: false,
			loadSupport: false,
			form: {
				id_vetstation: null,
				id_animal: null,
				id_method: null,
				quarter: [],
				block_plan: null,
				plan: null
			},
			quarterData: [
				{value: '1', text: '1'},
				{value: '2', text: '2'},
				{value: '3', text: '3'},
				{value: '4', text: '4'},
			]
		}
	},
    watch: {
        id(newVal, oldVal) {
            if(newVal != oldVal)
                this.getData();
		},
        dialogEdit (val) {
            val || this.close()
        },
	},
	computed: {
		tableTitle(){
			return this.gridData.length ? this.gridData[0]['vet'] : ''
		},
		mth(){
			return Object.keys(this.editedItem).map((key) => this.editedItem[key]);
		}
	},
	methods: {
		getData(){
			this.overlay = true;
			this.$http.get(`/api/gz/plan/${this.id}`).then(response => (this.overlay = false, this.gridData = response.data)).catch(error => (this.overlay = false, alert(error.response.data.message)));
		},
		editItem(item){
			this.editedIndex = this.gridData.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogEdit = true;
		},
        close () {
            this.dialogEdit= false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, {});
                this.editedIndex = -1;
            })
		},
		updateQuarter(){
			this.loading = true;
			this.$http.post(`/api/gz/plan/update`, {id_mp: this.editedItem.id_mp, id_mpy: this.editedItem.id_mpy, block: this.editedItem.block_plan, plan: this.editedItem.plan}, {headers: {'Content-Type': 'application/json'}})
			.then(response => {
				this.loading = false;
				Object.assign(this.gridData[this.editedIndex], this.editedItem);
				this.close();
			}).catch(error => (this.loading = false, alert(error.response.data.message)));
		},
		getSupport(){
			this.loadSupport = true;
			this.$http.get('/api/gz/support/ycreate').then(response => (this.loadSupport = false, this.dialogCreate = true, this.supportData = response.data)).catch(error => (this.loadSupport = false, alert(error.response.data.message)));
		},
		confirmBlock(item){
			this.editedItem = Object.assign({}, item);
			this.dialogCreateBlock = true;
		},
		confirmCreate(){
			if(!Object.keys(this.supportData).length)
				this.getSupport();
			else this.dialogCreate = true;
		},
		create(){
			this.loading = true;
			this.$http.post(`/api/gz/plan`, this.form, {headers: {'Content-Type': 'application/json'}})
			.then(response => {this.loading = false; this.dialogCreate = false; this.getData()}).catch(error => (this.loading = false, alert(error.response.data.message)));

		},
		createQuarter(){
			this.loading = true;
			this.$http.post(`/api/gz/plan/quarter`, this.form, {headers: {'Content-Type': 'application/json'}})
			.then(response => {this.loading = false; this.dialogCreateBlock = false; this.getData()}).catch(error => (this.loading = false, alert(error.response.data.message)));
	
		}
	}
}
</script>