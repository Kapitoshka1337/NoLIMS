<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Идентификационные данныe</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-text-field readonly dense label="Код оборудования" outlined v-model="indentificationData.equipment.id"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field readonly dense label="Наименование" outlined v-model="indentificationData.equipment.title"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field readonly dense label="Производитель" outlined v-model="indentificationData.equipment.manufacturer"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field readonly dense label="Инвентарный номер" outlined v-model="indentificationData.equipment.inventory_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field readonly dense label="Серийный номер" outlined v-model="indentificationData.equipment.serial_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field readonly dense label="Модель" outlined v-model="indentificationData.equipment.model"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field type="date" readonly dense label="Дата изготовления" outlined v-model="indentificationData.equipment.date_create"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field readonly dense label="Номер" outlined v-model="indentificationData.equipment.number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field readonly dense label="ФИФ" outlined v-model="indentificationData.equipment.fif_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field type="date" readonly dense label="Введено в эксплуатацию" outlined v-model="indentificationData.equipment.date_commissioning"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea :rows="2" :height="100" readonly dense label="Примечание" outlined v-model="indentificationData.equipment.description"></v-textarea>
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
                        <v-checkbox readonly label="Архив" color="teal" hide-details v-model="indentificationData.equipment.is_archive"></v-checkbox>
                        <v-checkbox readonly label="Используется" color="green" hide-details v-model="indentificationData.equipment.is_working"></v-checkbox>
                        <v-checkbox readonly label="Консервация" color="orange" hide-details v-model="indentificationData.equipment.is_conservation"></v-checkbox>
                        <v-checkbox readonly label="Ремонт" color="red" hide-details v-model="indentificationData.equipment.is_repair"></v-checkbox>
                        <v-checkbox readonly label="ЦСМ" color="purple" hide-details v-model="indentificationData.equipment.is_check"></v-checkbox>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Характеристики
                    <v-spacer></v-spacer>
                    <v-chip color="success">±</v-chip>
                    <v-chip color="success">°</v-chip>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete :items="dropdown('type')" outlined readonly dense label="Вид" v-model="indentificationData.equipment.id_equipment_type"></v-autocomplete>
                            </v-col>
                            <!-- <v-col cols="12" md="6">
                                <v-autocomplete :items="dropdown('studies')" outlined readonly dense label="Объект исследования" v-model="indentificationData.equipment.id_object_study"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete :items="dropdown('function')" outlined readonly dense label="Функциональное значение" v-model="indentificationData.equipment.id_function_of_use"></v-autocomplete>
                            </v-col> -->
                            <v-col cols="12" md="6">
                                <v-text-field readonly dense label="Диапазон измерений" outlined v-model="indentificationData.equipment.measuring_range"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field readonly dense label="Диапазон работы" outlined v-model="indentificationData.equipment.measuring_work"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field readonly dense label="Точность" outlined v-model="indentificationData.equipment.accuracy"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field readonly dense label="Класс точности" outlined v-model="indentificationData.equipment.class_accuracy"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-text-field readonly dense label="Цель использования" outlined v-model="indentificationData.equipment.purpose_of_use"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea :rows="2" :height="100" readonly dense label="Дополнительные характеристики" outlined v-model="indentificationData.equipment.characteristics"></v-textarea>
                            </v-col>
                            <v-col cols="10">
                                <v-chip small color="green" text-color="white">Инструкция по эксплуатации</v-chip>    
                            </v-col>
                            <v-col cols="2">
                                <v-btn small :ripple="false" color="orange" @click="download(item)" v-bind:disabled="!indentificationData.equipment.file_inst">Открыть</v-btn>
                            </v-col>
                            </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>История проверок</v-card-title>
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
                            <v-btn color="success" x-small :disabled="!item.upload_file_name" v-on:click="download(item)">Скачать</v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Перемещения
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn1" :items="indentificationData.history_moving" :items-per-page="5">
                        <template v-slot:item.cabinet_number="{ item }">
                            {{ item.cabinet_number || "Не указан"}}
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
                    История ремонта
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn3" :items="indentificationData.history_repair" :items-per-page="5" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
                        <template v-slot:no-data>
                            Пока ничего нет :(
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Условия работы</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field readonly dense label="Влажность" outlined v-model="indentificationData.condition_working.humidity"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field readonly dense label="Давление" outlined v-model="indentificationData.condition_working.pressure"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field readonly dense label="Температура" outlined v-model="indentificationData.condition_working.temperature"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field readonly dense label="Напряжение" outlined v-model="indentificationData.condition_working.voltage"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field readonly dense label="Ток" outlined v-model="indentificationData.condition_working.amperage"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Требуемое техническое обслуживание
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn2" :items="indentificationData.maintance" :items-per-page="5"></v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
		<v-overlay :value="overlay">
			<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
		</v-overlay>
    </v-row>
</template>

<script>
import fs from 'file-saver';

export default {
	props:{
        id: {
            type: Number
        }
    },
    data(){
        return {
            indentificationData: null,
            indentificationDataCopy: null,
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
                { text: 'Кабинет (ушел)', align: 'end', sortable: false, value: 'last_cabinet' },
                { text: 'Кабинет (пришел)', align: 'end', sortable: false, value: 'cabinet_number' }
            ],
            tableColumn2: [
                { text: 'Вид ТО', align: 'start', sortable: false, value: 'type_maintenance' },
                { text: 'Исполнитель', align: 'start', sortable: false, value: 'executor' },
                { text: 'Периодичность', align: 'end', sortable: false, value: 'periodicity' },
                { text: 'ТО', align: 'end', sortable: false, value: 'title' }
            ],
            tableColumn3: [
                { text: 'Статус', align: 'start', sortable: false, value: 'status' },
                { text: 'Проблема', align: 'start', sortable: false, value: 'problem' },
                { text: 'Решение', align: 'start', sortable: false, value: 'request_report' },
                { text: 'Инициатор', align: 'end', sortable: false, value: 'user' },
                { text: 'Принял', align: 'end', sortable: false, value: 'accepted' },
                { text: 'Выполнил', align: 'end', sortable: false, value: 'executor' }
            ],
            dataMoving: null,
            dataMaintenances: null,
            dataInst: null,
            overlay: false,
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
            this.overlay = true;
			this.$http.get('/api/equipment/equipments/' + this.id).then(response => (this.overlay = false,this.indentificationData = response.data, this.indentificationDataCopy = JSON.parse(JSON.stringify(response.data.equipment)))).catch(error => (this.overlay = false, alert(error.response.data.message)));
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
        },
        download(item = null){
            this.overlay = true;
            let file =  item === null ? this.indentificationData.equipment.file_inst : item.upload_file_name;
            this.$http.get(`/api/equipment/equipments/file/${file}`, {responseType: 'blob'})
            .then(response =>{
                const fl = new Blob([response.data], {type: 'application/pdf'});
                fs.saveAs(fl, file);
                this.overlay = false;
            }).catch(error => (alert('Файл не найден'), this.overlay = false));
        },
		addPlus(){
			if(!this.indentificationData.equipment.accuracy)
				this.indentificationData.equipment.accuracy = '' + String.fromCharCode(177);
			else
				this.indentificationData.equipment.accuracy += String.fromCharCode(177);
		},
		addTemp(){
			if(!this.indentificationData.equipment.accuracy)
				this.indentificationData.equipment.accuracy = '' + String.fromCharCode(176);
			else
				this.indentificationData.equipment.accuracy += String.fromCharCode(176);
		},
    },
    mounted() {
        this.getEquipment();
    }
}
</script>