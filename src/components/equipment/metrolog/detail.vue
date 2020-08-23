<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Идентификационные данныe</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Наименование" outlined v-model="indentificationData.equipment.title"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Производитель" outlined v-model="indentificationData.equipment.manufacturer"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-text-field dense label="Инвентарный номер" outlined v-model="indentificationData.equipment.inventory_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field dense label="Серийный номер" outlined v-model="indentificationData.equipment.serial_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field dense label="Модель" outlined v-model="indentificationData.equipment.model"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <input type="date" is="v-text-field" dense label="Дата изготовления" outlined v-model="indentificationData.equipment.date_create">
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field dense label="Номер" outlined v-model="indentificationData.equipment.number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field dense label="ФИФ" outlined v-model="indentificationData.equipment.fif_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <input type="date" is="v-text-field" dense label="Введено в эксплуатацию" outlined v-model="indentificationData.equipment.date_commissioning">
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-textarea :rows="2" :height="100" dense label="Примечание" outlined v-model="indentificationData.equipment.description"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Состояние</v-card-title>
                <v-card-text>
                        <v-checkbox label="Архив" color="teal" hide-details v-model="indentificationData.equipment.is_archive"></v-checkbox>
                        <v-checkbox label="Используется" color="green" hide-details v-model="indentificationData.equipment.is_working"></v-checkbox>
                        <v-checkbox label="Консервация" color="orange" hide-details v-model="indentificationData.equipment.is_conservation"></v-checkbox>
                        <v-checkbox label="Ремонт" color="red" hide-details v-model="indentificationData.equipment.is_repair"></v-checkbox>
                        <v-checkbox label="ЦСМ" color="purple" hide-details v-model="indentificationData.equipment.is_check"></v-checkbox>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Характеристики</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete :items="dropdown('type')" outlined dense label="Вид" v-model="indentificationData.equipment.id_equipment_type"></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-autocomplete :items="dropdown('studies')" outlined dense label="Объект исследования" v-model="indentificationData.equipment.id_object_study"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete :items="dropdown('function')" outlined dense label="Функциональное значение" v-model="indentificationData.equipment.id_function_of_use"></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Диапазон измерений" outlined v-model="indentificationData.equipment.measuring_range"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Диапазон работы" outlined v-model="indentificationData.equipment.measuring_work"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Точность" outlined v-model="indentificationData.equipment.accuracy"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Класс точности" outlined v-model="indentificationData.equipment.class_accuracy"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-text-field dense label="Цель использования" outlined v-model="indentificationData.equipment.purpose_of_use"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-textarea :rows="2" :height="100" dense label="Дополнительные характеристики" outlined v-model="indentificationData.equipment.characteristics"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    История проверок
                    <v-spacer></v-spacer>
					<v-btn icon color="orange">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn" :items="indentificationData.history_checks" :items-per-page="5">
                        <template v-slot:item.date_current_check="{ item }">
                            {{ today(item.date_current_check) }}
                        </template>
                        <template v-slot:item.date_next_check="{ item }">
                            {{ today(item.date_next_check) }}
                        </template>
                        <template v-slot:item.type_document="{ item }">
                            {{ item.type_document || "Не указан"}}
                        </template>
                        <template v-slot:item.number_document="{ item }">
                            {{ item.number_document || "Не указан"}}
                        </template>
                        <template v-slot:item.upload_file_name="{ item }">
                            {{ item.upload_file_name || "Не загружен"}}
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Перемещения
                    <v-spacer></v-spacer>
					<v-btn icon color="orange">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn1" :items="indentificationData.history_moving" :items-per-page="5">
                        <template v-slot:item.cabinet="{ item }">
                            {{ item.cabinet || "Не указан"}}
                        </template>
                        <template v-slot:item.last_cabinet="{ item }">
                            {{ item.last_cabinet || "Не указан"}}
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Требуемое техническое обслуживание
                    <v-spacer></v-spacer>
					<v-btn icon color="orange">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
                </v-card-title>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card color="red" outlined>
                <v-card-title>Условия работы (УБРАТЬ)</v-card-title>
            </v-card>
        </v-col>
    </v-row>
                
            <!--<sui-form-fields fields="two">
                <sui-form-field>
                    <sui-form-field class="ui green label">Инструкция по эксплуатации</sui-form-field>
                </sui-form-field>
                <sui-form-field>
                    <sui-button size="mini" floated="right" color="red" content="Изменить" v-on:click="showModal('EditInstruction')"></sui-button>
                    <sui-button v-if="indentificationData.equipment.id_instruction" size="mini" floated="right" color="yellow" content="Открыть"></sui-button>                                    
                    <a v-if="listDetails.instruction" v-bind:href="'/assets/uploads/' + listDetails.instruction.upload_file" class="ui right floated yellow mini button" target="_blank">Открыть</a>
                </sui-form-field>
                <sui-table-header>
                    <sui-table-row>
                        <sui-table-header-cell>Вид ТО</sui-table-header-cell>
                        <sui-table-header-cell>Исполнитель</sui-table-header-cell>
                        <sui-table-header-cell>Периодичность</sui-table-header-cell>
                        <sui-table-header-cell>ТО</sui-table-header-cell>
                        <sui-table-header-cell></sui-table-header-cell>
                    </sui-table-row>
                </sui-table-header>
                <sui-table-body>
                    <sui-table-row v-for="check in indentificationData.maintance" :key="check">
                        <sui-table-cell>{{ check.type_maintenance }}</sui-table-cell>
                        <sui-table-cell>{{ check.executor }}</sui-table-cell>
                        <sui-table-cell>{{ check.periodicity }}</sui-table-cell>
                        <sui-table-cell>{{ check.description }}</sui-table-cell>
                    </sui-table-row>
                </sui-table-body>-->
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
            indentificationData: null,
            tableColumn: [
                { text: 'Пройденная', align: 'start', sortable: false, value: 'date_current_check' },
                { text: 'Предстоящая', align: 'start', sortable: false, value: 'date_next_check' },
                { text: 'Вид документа', align: 'start', sortable: false, value: 'type_document' },
                { text: '№ документа', align: 'start', sortable: false, value: 'number_document' },
                { text: 'Документ', align: 'start', sortable: false, value: 'upload_file_name'}
            ],
            tableColumn1: [
                { text: 'Отдел (ушел)', align: 'start', sortable: false, value: 'last_department' },
                { text: 'Отдел (пришел)', align: 'start', sortable: false, value: 'department' },
                { text: 'Кабинет (ушел)', align: 'end', sortable: false, value: 'cabinet' },
                { text: 'Кабинет (пришел)', align: 'end', sortable: false, value: 'last_cabinet' }
            ]
        }
    },
    watch: {
        id(newVal, oldVal) {
            if(newVal != oldVal)
                this.getEquipment();
        }
    },
    methods: {
        getEquipment(){
			this.$http.get('/api/equipment/equipments/' + this.id).then(response => (this.indentificationData = response.data)).catch(error => (alert(error.response.data.message)));
        },
		today(date){
			if(date === null) return;
			return new Date(date).toLocaleString().split(',')[0];
        },
        dropdown(tp){
            if(this.indentificationData)
            {
                let result = [];
                for (let str of this.indentificationData[tp])
                    result.push({value: str['id'], text: str['title']});
                return result;
            }
        }
    },
    created() {
        this.getEquipment();
    }
}
</script>