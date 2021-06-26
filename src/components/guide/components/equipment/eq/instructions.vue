<template>
	<v-row>
		<v-col cols="12">
			<v-data-table calculate-widths dense
				:headers="tableColumn"
				:items="gridData"
				:items-per-page="30"
				:loading="load"
				:search="search"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat dense>
						<v-toolbar-title>Управление инструкциями</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn :ripple="false" small color="orange" @click="dialog = true">Добавить инструкцию</v-btn>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{item}">
					<v-btn icon color="orange" @click="download(item)"><v-icon>mdi-eye</v-icon></v-btn>
					<v-btn icon color="blue" @click="editedItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
		<v-dialog dense v-model="dialog" max-width="512">
			<v-card>
				<v-card-title>{{ formTitle }}</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-text-field type="number" dense outlined clearable label="Номер" v-model="item.number"></v-text-field>
							<v-text-field dense outlined clearable label="Название (описание)" v-model="item.title"></v-text-field>
							<v-file-input :show-size="true" dense outlined label="Файл" placeholder="Выберите файл" v-model="item.file"></v-file-input>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success">ОК</v-btn>
					<v-btn color="error" @click="dialog = false">Отмена</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
	</v-row>
</template>

<script>
import fs from 'file-saver';

export default {
	data () {
		return {
			tableColumn: [
				{ text: 'Код', align: 'start', sortable: true, value: 'id'},
				{ text: 'Номер', align: 'start', sortable: true, value: 'number'},
				{ text: 'Название (описание)', align: 'start', sortable: true, value: 'title'},
				{ text: '', align: 'start', sortable: false, value: 'actions'}
			],
			gridData: [
                {
                    file: "1.pdf",
                    id: 1,
                    number: 1,
                    title: "Гигрометр психрометрический марки ВИТ"
                },
                {
                    file: "2.pdf",
                    id: 2,
                    number: 2,
                    title: "Холодильник"
                },
                {
                    file: "3.pdf",
                    id: 3,
                    number: 3,
                    title: "Термометры ртутные"
                }
            ],
			search: '',
			item: {
				number: null,
				title: null,
				file: null
			},
			defaultItem: {
				number: null,
				title: null,
				file: null
			},
			dialog: false,
			editedIndex: -1,
			loading: false,
			load: false,
			overlay: false
		}
	},
	computed: {
		formTitle(){
			return this.editedIndex === -1 ? 'Добавление инструкции' : 'Изменение инструкции'
		}
	},
	watch: {
		dialog(newVal){
			if(!newVal) this.item = {};
		}
	},
	methods: {
		editedItem(item){
			this.editedIndex = this.gridData.indexOf(item);
			this.item = Object.assign({}, item);
			this.dialog = true;
		},
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.item = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        download(item){
            this.overlay = true;
            this.$http.get(`/api/equipment/instructions/file/${item.file}`, {responseType: 'blob'})
            .then(response =>{
                const file = new Blob([response.data], {type: 'application/pdf'});
                fs.saveAs(file, item.file);
                this.overlay = false;
            }).catch(error => (alert('Файл не найден'), this.overlay = false));
        },
	}
  }
</script>