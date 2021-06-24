<template>
	<v-card-text>
		Данная страница предназначена для добавления нового поступления материалов. 
		<v-card-text>
			Для добавления поступления существует два поля: Заказ №, Дата заказа, также доступна кнопка <v-btn color="orange" :ripple="false" ><v-icon color="white">mdi-magnify</v-icon></v-btn>.
			При её нажатии открывается таблица с выбором поступившего материала.
		</v-card-text>
		Для выбора поступившего материала необходимо:
		<ol>
			<li>Нажать <v-btn color="orange" :ripple="false" ><v-icon color="white">mdi-magnify</v-icon></v-btn></li>
			<li>В открывшемся окне с помощью поиска найти необходимый поступивший материал в соответствии с типом и единицей измерения.</li>
			<li>С помощью <v-checkbox></v-checkbox> выбрать необходимый поступивший материал</li>
		</ol>
		<br>
		После выбора поступившего материала необходимо заполнить карточку поступившего материала. 
		<v-card-text>
			Карточка поступившего материала содержит следующие поля для заполнения:
			<p>
				<h5>Количество</h5>
				Определяет поступившее количество материала.
			</p>
			<p>
				<h5>Плотность</h5>
				Необходимо для перевода единиц измерения материала: пересчет объема в единицы массы по бухучету через плотность; из количества упаковок в счетные единицы – штуки, ампулы и т.д.
			</p>
			<p>
				<h5>Местоположение</h5>
				Определяет место хранения поступившего материала.
			</p>
			<p>
				<h5>Наименование в накладной</h5>
				Необходимо для формирования отчета "Списание", чтобы быстрее найти соответствие с бухгалтерией.
			</p>
			<p>
				<h5>Дата изготовления</h5>
				Дата изготовления поступаемого материала.
				<v-alert dense outlined type="warning">
					Если в паспорте дата изготовления указана в виде "05.2020", то дата изготовления равносильна следующему варианту - "01.05.2020".
				</v-alert>
			</p>
			<p>
				<h5>Срок хранения</h5>
				Срок хранения поступаемого материала.
			</p>
			<p>
				<h5>Дополнительная информация</h5>
				Определяет дополнительную информацию о поступившем материале. Данаая информация создается для сотрудника, как дополнение к основной.
				Пример дополнительной информации: номер партии.
			</p>
		</v-card-text>
		В случае если выбран не тот материал можно воспользоваться кнопкой "Удалить" на карточке поступаемого материала. Также в шапке карточки содержится: Наименование выбранного материала, код материала, тип материала и единица измерения.
		<v-card>
			<v-card-title>Добавление поступления</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col cols="6">
						<v-text-field outlined dense label="Заказ №" clearable v-model="order.num_order"></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field type="date" outlined dense label="Дата заказа" clearable v-model="order.date_order"></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<v-row dense justify="start">
					<v-col cols="3" v-for="card in selected" :key="card.id">
						<arrival-item :item="card" :locations="dropdownLocation" @delete="deleteMaterial"></arrival-item>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn color="orange" :ripple="false" @click=loadMaterials() :loading="loading"><v-icon color="white">mdi-magnify</v-icon></v-btn>
				<v-spacer></v-spacer>
				<v-btn color="success" :ripple="false" v-bind:disabled="!selected.length || !order.num_order || !order.date_order" :loading="submit">Добавить</v-btn>
				<v-btn color="error" :ripple="false" to="/reagent/arrivals">Отмена</v-btn>
			</v-card-actions>
			<v-dialog v-model="dialogMaterial" max-width="1256px">
				<v-card>
					<v-card-text>
						<v-data-table calculate-widths dense item-key="id" v-model="selected"
							:headers="tableColumn"
							:items="materials"
							:items-per-page="50"
							:search="search"
							:show-select="true"
							:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [10, 30, 50, 100], itemsPerPageText: 'Отобразить на странице'}">
							<template v-slot:top>
								<v-toolbar flat dense>
									<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
								</v-toolbar>
							</template>
						</v-data-table>
					</v-card-text>
					<v-divider></v-divider>
				</v-card>
			</v-dialog>
		</v-card>
	</v-card-text>
</template>

<script>
import arrivalItem from "../../../../reagent/component/arrivalItem.vue";

export default {
	components:{
		arrivalItem
	},
    data(){
        return {
            tableColumn: [
                { text: 'Код', align: 'start', sortable: true, value: 'id'},
                { text: 'Материал', align: 'start', sortable: true, value: 'material'},
                { text: 'Тип', align: 'start', sortable: true, value: 'type'},
                { text: 'Ед.изм.', align: 'start', sortable: true, value: 'measure'}
            ],
            search: '',
            materials: [],
            selected: [],
            listLocations: [],
            order: {
                num_order: '',
                date_order: '',
                materials: null
            },
            dialogMaterial: false,
            loading: false,
            submit: false
        }
    },
    computed: {
        dropdownLocation(){
            if(this.listLocations.length)
            {
                let result = [];
				for (let str of this.listLocations)
                    result.push({value: str['id'], text: `${str['cabinet_number']} ${str['place']} ${str['notation']}`});
                return result;
            }
        }
    },
    methods: {
        loadLocations(){
            this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error.response.data.message)));
        },
        loadMaterials(){
            if(!this.materials.length)
            {
                this.loading = true;
                this.$http.get('/api/reagent/material').then(response => (this.materials = response.data, this.loading = false, this.dialogMaterial = true)).catch(error => (this.loading = false, alert(error.response.data.message)));
                this.loadLocations();
            }
            else this.dialogMaterial = true;
        },
        deleteMaterial(material) {
            var idx = this.selected.indexOf(material);
            if (idx > -1) this.selected.splice(idx, 1);
        }
    }
}
</script>