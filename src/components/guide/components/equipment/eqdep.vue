<template>
	<v-card flat>
		<v-card-title>
			Подразделения
		</v-card-title>
		<v-card-text>
			<v-card-text>
				Раздел меню <strong>Подразделения</strong> позволяет следить за оборудованием. Раздел состоит из подраздела: Оборудование. 
                <br> Далее будет рассмотрен подраздел "Оборудование".
			</v-card-text>
			<v-card-text>
				Подраздел "Оборудование" полностью аналогично подразделению "Оборудование" в разделе "Метролог", за исключением функционала.
			</v-card-text>
            <v-card-text>
                Для работы с оборудованием доступен следующий функционал:
                <v-card-text>
                    <p>
                        <h5>Печать этикетки</h5>
                        Печать этикетки расположено в шапке таблицы по нажатию кнопки <v-icon color="primary">mdi-print</v-icon>. На выбор предлагается три размера: маленькая, средняя, большая. Перед печатью этикетки необходимо отметить нужное оборудование.
                    </p>
                    <p>
                        <h5>Печать таблицы проверок</h5>
                        Печать таблицы поверок расположено в шапке таблицы по нажатию кнопки <v-icon color="primary">mdi-print</v-icon>. Таблица поверок - это таблица, которая отражает оборудование запрашиваемое из отделов для последующей отпраки на поверку. Таблицу поверок необходимо формировать самостоятельно, отмечая нужное оборудование.
                    </p>
                    <p>
                        <h5>Заявка на ремонт (В разработке)</h5>
                        Отправка заявки на ремонт расположено в шапке таблицы по нажатию кнопки <v-icon color="blue">mdi-bug</v-icon>.
                    </p>
                </v-card-text>
            </v-card-text>
			<v-card-title>
				Пример содержания страницы "Оборудование". 
			</v-card-title>
			<v-card>
				<v-card-text>
					<v-tabs>
						<v-tab>Оборудование</v-tab>
						<v-tab>Подробности</v-tab>
						<v-tab-item>
							<eqdepart @id='inputId'></eqdepart>
						</v-tab-item>
						<v-tab-item>
							<detail :id="idEquipment"></detail>
						</v-tab-item>
					</v-tabs>
				</v-card-text>
			</v-card>
		</v-card-text>
	</v-card>
</template>

<script>
import eqdepart from './eq/eqdepart.vue';
import detail from './eq/detail.vue';

export default {
	components: {
		eqdepart, detail
	},
	data () {
		return {
			idEquipment: 0,
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
		},
		inputId(data){
			this.idEquipment = data;
		},
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