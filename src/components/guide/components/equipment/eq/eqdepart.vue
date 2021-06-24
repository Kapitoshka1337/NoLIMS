<template>
    <v-data-table
        calculate-widths
        @item-selected="selectedEquipment"
        dense
        v-model="selected"
        :headers="tableColumn"
        :items="gridData"
        :items-per-page="50"
        :loading="gridData.length <= 0" 
        :show-select="true"
        :search="search"
        item-key="id"
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
        <template v-slot:header.date_current_check="{header}">
            {{header.text}}
            <v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                        <v-icon small :color="DateFilters.current_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
                    </v-btn>
                </template>
                <v-card>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.current_start_date"></v-text-field>
                                <v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.current_end_date" ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                </v-card>
            </v-menu>
        </template>
        <template v-slot:header.date_next_check="{header}">
            {{header.text}}
            <v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                        <v-icon small :color="DateFilters.next_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
                    </v-btn>
                </template>
                <v-card>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.next_start_date"></v-text-field>
                                <v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.next_end_date" ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                </v-card>
            </v-menu>
        </template>
        <template v-slot:header.tag="{header}">
            {{header.text}}
            <v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                        <v-icon small :color="DateFilters.tags.length ? 'red' : 'blue'">mdi-filter-variant</v-icon>
                    </v-btn>
                </template>
                <v-list flat dense>
                    <v-list-item-group multiple v-model="DateFilters.tags">
                        <v-list-item v-for="tag in tags" :key="tag.text" :ripple="false" :value="tag.value">
                            <template v-slot:default="{active}">
                                <v-list-item-action>
                                    <v-checkbox :input-value="active" :ripple="false" dense :color="tag.color" :label="tag.text"></v-checkbox>
                                </v-list-item-action>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
        </template>
        <template v-slot:top>
            <v-toolbar flat dense>
                <v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-menu offset-y :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="blue" icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-group>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>Этикетки</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item @click="printSticker('sticker', 'large')">
                                <v-list-item-content>
                                    <v-list-item-title>Большие</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="printSticker('sticker', 'middle')">
                                <v-list-item-content>
                                    <v-list-item-title>Средние</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="printSticker('sticker', 'tiny')">
                                <v-list-item-content>
                                    <v-list-item-title>Маленькие</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                        <v-list-item @click="printTable()">
                            <v-list-item-title>Таблица проверок</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar>
        </template>
        <template v-slot:item.date_current_check="{ item }">
            {{ today(item.date_current_check) }}
        </template>
        <template v-slot:item.date_next_check="{ item }">
            {{ today(item.date_next_check) }}
        </template>
        <template v-slot:item.date_commissioning="{ item }">
            {{ today(item.date_commissioning) }}
        </template>
        <template v-slot:item.tag="{ item }">
            <v-chip-group>
                <v-chip color="teal" small text-color="white" v-if="item.is_archive">А</v-chip>
                <v-chip color="green" small text-color="white" v-if="item.is_working">И</v-chip>
                <v-chip color="orange" small text-color="white" v-if="item.is_conservation">К</v-chip>
                <v-chip color="red" small text-color="white" v-if="item.is_repair">Р</v-chip>
                <v-chip color="purple" small text-color="white" v-if="item.is_check">Ц</v-chip>
            </v-chip-group>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-btn icon color="blue" @click="editItem(item)"><v-icon>mdi-bug</v-icon></v-btn>
        </template>
        <template v-slot:no-data>
            Пока ничего нет :(
        </template>
        <v-dialog v-model="dialogRepair" max-width="512px">
            <v-card>
                <v-card-title>Заявка на ремонт</v-card-title>
                <v-card-subtitle>{{ editedItem.equipment }}</v-card-subtitle>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-textarea :rows="2" :height="60" dense label="Описание проблемы" v-model="problem" outlined></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-card-title>{{ editedItem.number_card }}</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn color="success">Отправить</v-btn>
                    <v-btn color="error" @click="dialogRepair = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-data-table>
</template>

<script>
export default {
    data () {
return {
			search: '',
			verification: false,
			dialog_verification: false,
			date_before_hand_over: null,
			dialogRepair: false,
			selected: [],
			tableColumn: [
				{ text: 'Номер', align: 'start', sortable: true, value: 'number'},
				{ text: 'Отдел', align: 'start', sortable: true, value: 'department', filter: value => {return this.activeFilters.department ? this.activeFilters.department.includes(value) : true}},
				{ text: 'Вид', align: 'start', sortable: true, value: 'type', filter: value => {return this.activeFilters.type ? this.activeFilters.type.includes(value) : true}},
				{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment' },
				{ text: 'С/Н', align: 'end', sortable: true, value: 'serial_number'},
				{ text: 'Пройденная', align: 'start', sortable: true, value: 'date_current_check',
			filter: value => {return !this.DateFilters.current_start_date && !this.DateFilters.current_end_date ? true :
			value >= this.DateFilters.current_start_date && value <= this.DateFilters.current_end_date}},
				{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check',
			filter: value => {return !this.DateFilters.next_start_date && !this.DateFilters.next_end_date ? true :
			value >= this.DateFilters.next_start_date && value <= this.DateFilters.next_end_date}},
				{ text: 'Тег', align: 'center', sortable: false, value: 'tag', filter: this.filterTags},
				{ text: '', align: 'center', sortable: false, value: 'actions', filterable: false }
			],
			tableColumn1: [
				{ text: 'Номер', align: 'start', sortable: false, value: 'number_card', width: 120},
				{ text: 'Оборудование', align: 'start', sortable: false, value: 'equipment' },
				{ text: 'Модель', align: 'start', sortable: false, value: 'model' },
				{ text: 'С/Н', align: 'end', sortable: false, value: 'serial_number' },
				{ text: 'Пройденная', align: 'start', sortable: false, value: 'date_current_check', filterable: false },
				{ text: 'Предстоящая', align: 'start', sortable: false, value: 'date_next_check', filterable: false}
			],
			tags: [
				{text: 'Архив', value: 'is_archive', color: 'teal'},
				{text: 'Используется', value: 'is_working', color: 'green'},
				{text: 'Консервация', value: 'is_conservation', color: 'orange'},
				{text: 'Ремонт', value: 'is_repair', color: 'red'},
				{text: 'ЦСМ', value: 'is_check', color: 'purple'}
			],
			gridData: [
                {
                    date_current_check: "2021-02-19",
                    date_next_check: "2022-02-18",
                    department: "Микробиологический отдел (бактериологии)",
                    equipment: "Электроплитка",
                    id: 1,
                    id_department: 4,
                    is_archive: 0,
                    is_check: 0,
                    is_conservation: 0,
                    is_repair: 0,
                    is_working: 1,
                    model: "Мечта ЭПТ 2-2,0/220",
                    number: "01",
                    number_card: "01/03",
                    number_department: "03",
                    serial_number: "б/н",
                    type: "ВО"
                },
                {
                    date_current_check: "2021-03-19",
                    date_next_check: "2023-03-18",
                    department: "Вирусологический отдел",
                    equipment: "Термометр складской",
                    id: 328,
                    id_department: 2,
                    is_archive: 0,
                    is_check: 0,
                    is_conservation: 0,
                    is_repair: 0,
                    is_working: 1,
                    model: "ТС-7АМ",
                    number: "97",
                    number_card: "97/05",
                    number_department: "05",
                    serial_number: "33",
                    type: "СИ"
                },
                {
                    date_current_check: "2021-02-09",
                    date_next_check: "2022-02-08",
                    department: "Воткинская лаборатория",
                    equipment: "Термостат электрический суховоздушный",
                    id: 1312,
                    id_department: 10,
                    is_archive: 0,
                    is_check: 0,
                    is_conservation: 0,
                    is_repair: 0,
                    is_working: 1,
                    model: "ТС-1/80 СПУ",
                    number: "17",
                    number_card: "17/В",
                    number_department: "В",
                    serial_number: "25195",
                    type: "ИО"
                }
            ],
			editedItem: {
				equipment: null,
				number_card: null,
				model: null,
				date_current_check: null,
				date_next_check: null,
				number_document: null,
				file: null
			},
			overlay: false,
			printDialog: false,
			loadProtocol: false,
			dateProtocol: null,
			filterDialog: false,
			createDialog: false,
			loadCreate: false,
			newEquipment: {},
			filters: { department: [], type: [] },
			activeFilters: {},
			DateFilters: {
				current_start_date: null,
				current_end_date: null,
				next_start_date: null,
				next_end_date: null,
				tags: []
			},
            problem: '',
            passed_verification: false
		}
	},
	methods: {
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
		filterTags(val, srch, item){
			if(!this.DateFilters.tags.length) return true;
			let itms;
			this.DateFilters.tags.filter(x => (item[x] === 1 ? itms = item: false));
			return itms;
		},
		selectedEquipment(item){
			this.editedIndex = this.gridData.indexOf(item);
			if(item.value) this.$emit('id', item.item.id);
		},
		today(date){
			return date === null ? null : new Date(date).toLocaleString().split(',')[0];
		},
		closeDialog(){
			this.showPassed = false;
		},
		editItem(item) {
			this.editedIndex = this.gridData.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogRepair = true;
		},
		printSticker(type = null, size = null) {
			if(this.selected.length > 0)
			{
				let obj = [];
				for (let item in this.selected)
					obj.push(this.selected[item].id);
				let objs = {size: size, item: obj};
				this.overlay = true;
				this.$http.post(`/api/equipment/printer/${type}`, objs, {responseType: 'blob'})
				.then(response =>{
					const file = new Blob([response.data], {type: 'application/pdf'});
					fs.saveAs(file, 'Этикетки.pdf');
					this.overlay = false;
				}).catch(error => (this.overlay = false, alert('Ошибка формирования')));
			}
			else alert('Не выбрано оборудование');
		},
		confirmPrint(item){
			if(this.selected.length > 0) this.printDialog = true;
			else alert('Не выбрано оборудование');
		},
		printProtocol() {
			let obj = [];
			for (let item in this.selected) obj.push(this.selected[item].id);
			let objs = {item: obj, date: this.dateProtocol};
			this.loadProtocol = true;
			this.$http.post('/api/equipment/printer/protocol', objs, {responseType: 'blob'})
			.then(response =>{
				const file = new Blob([response.data], {type: 'application/pdf'});
				fs.saveAs(file, 'ПТС.pdf');
				this.loadProtocol = false;
			}).catch(error => (this.loadProtocol = false, alert('Ошибка формирования')));
		},
		printTable(){
			if(this.selected.length > 0)
			{
				let obj = [];
				for (let item in this.selected) obj.push(this.selected[item].id);
				this.overlay = true;
				this.$http.post('/api/equipment/printer/table', {item: obj}, {responseType: 'blob'})
				.then(response =>{
					const file = new Blob([response.data], {type: 'application/pdf'});
					fs.saveAs(file, 'Таблица проверок.pdf');
					this.overlay = false;
				}).catch(error => (this.overlay = false, alert('Ошибка формирования')));
			}
			else alert('Не выбрано оборудование');
		},
        dropdownCreate(tp){
            if(this.depLocation)
            {
                let result = [];
				for (let str of this.depLocation[tp])
                    result.push({value: str['id'], text: str['title'] || str['cabinet_number']});
                return result;
            }
		},
		returnUniq(column){
			let result = [];
			let resa = [];
			for (let str of this.gridData)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
				});
			for (let res of result)
			{
				resa.push({value: res, text: res});
			}
			return resa;
		}
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		},
        dropdown(){
            if(this.docType.length > 0)
            {
                let result = [];
                for (let str of this.docType)
                    result.push({value: str['id'], text: str['title']});
                return result;
            }
		},
		filteredLocation(){
			if(this.depLocation)
			{
				let result = [];
				this.depLocation.locations.filter(item => {
					if(item.id_department === this.newEquipment.id_department)
						result.push({value: item.id, text: item.cabinet_number});
				});
				return result;
			}
		},
		isTime(){
			let current = new Date(this.editedItem.date_current_check);
			let next = new Date(this.editedItem.date_next_check);
			return current.getUTCFullYear() >= next.getUTCFullYear();
		},
		prepareVerification(){
			return this.selected.length <= 0;
		},
	},
    created(){
        this.initFilters();
    }
}
</script>