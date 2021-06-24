<template>
	<v-card flat>
		<v-card-title>
			Места хранения
		</v-card-title>
		<v-card-text>
			Раздел меню <strong>Места хранения</strong> предназначен для хранения, поиска и добавления мест хранения поступиших материалов.
		</v-card-text>
		<v-card-text>
			Для добавления нового места хранения нажать кнопку "Добавить местоположение".
		</v-card-text>
		<v-card-text>
			Запись места хранения состоит из: кабинет, место (мебель), полка.
			<v-card-text>
				<p>
					<h5>Кабинет</h5>
					Номер кабинета места хранения.
				</p>
				<p>
					<h5>Место (мебель)</h5>
					Мебель или техника в которой хранится поступивший материал.
				</p>
				<p>
					<h5>Полка</h5>
					Номер полки.
				</p>
				<v-alert dense outlined type="warning">При отсутствии какого-либо из выше описанных полей, в значение ввести знак "-"</v-alert>
			</v-card-text>
		</v-card-text>
		<v-card>
			<v-card-title>
				Пример содержимого страницы "Места хранения".
			</v-card-title>
			<v-data-table calculate-widths dense item-key="matertia_id"
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="30"
				:loading="load"
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
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
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
		</v-card>
	</v-card>
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
			gridData: [
				{
					cabinet_number: "406",
					id: 29,
					id_department: 1,
					notation: "1",
					place: "Шкаф для реактивов"
				},
				{
					cabinet_number: "405",
					id: 30,
					id_department: 1,
					notation: "-",
					place: "Вытяжной шкаф № 4"
				},
				{
					cabinet_number: "422",
					id: 31,
					id_department: 1,
					notation: "-",
					place: "Холодильник № 1"
				}
			],
			item: {
				cabinet_number: null,
				place: null,
				notation: null
			},
			dialog: false,
			editedIndex: -1,
			loading: false,
			load: false
		}
	},
	computed: {
		formTitle(){
			return this.editedIndex === -1 ? 'Новое местоположение' : 'Редактирование местоположения'
		}
	},
    watch: {
        dialog (val) {
            val || this.close()
        },
    },
	methods: {
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
				this.$http.put(`/api/reagent/locations/${this.item.id}`, this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; Object.assign(this.gridData[this.editedIndex], this.item); this.close();})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
			}
			else
			{
				this.loading = true;
				this.$http.post("/api/reagent/locations", this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; this.gridData.push(this.item); this.close();})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
			}
		}
	}
  }
</script>