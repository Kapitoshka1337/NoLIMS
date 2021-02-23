<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Идентификационные данныe</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-text-field dense label="Код оборудования" outlined v-model="indentificationData.equipment.id" :readonly="true"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field clearable dense label="Наименование" outlined v-model="indentificationData.equipment.title"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field clearable dense label="Производитель" outlined v-model="indentificationData.equipment.manufacturer"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field clearable dense label="Инвентарный номер" outlined v-model="indentificationData.equipment.inventory_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field clearable dense label="Серийный номер" outlined v-model="indentificationData.equipment.serial_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field clearable dense label="Модель" outlined v-model="indentificationData.equipment.model"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field clearable type="date" dense label="Дата изготовления" outlined v-model="indentificationData.equipment.date_create"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field clearable dense label="Номер" outlined v-model="indentificationData.equipment.number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field clearable dense label="ФИФ" outlined v-model="indentificationData.equipment.fif_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field clearable type="date" dense label="Введено в эксплуатацию" outlined v-model="indentificationData.equipment.date_commissioning"></v-text-field>
                            </v-col>
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
                                <v-autocomplete clearable :items="dropdown('type')" outlined dense label="Вид" v-model="indentificationData.equipment.id_equipment_type"></v-autocomplete>
                            </v-col>
                            <!-- <v-col cols="12" md="6">
                                <v-autocomplete clearable :items="dropdown('studies')" outlined dense label="Объект исследования" v-model="indentificationData.equipment.id_object_study"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete clearable :items="dropdown('function')" outlined dense label="Функциональное значение" v-model="indentificationData.equipment.id_function_of_use"></v-autocomplete>
                            </v-col> -->
                            <v-col cols="12" md="6">
                                <v-text-field clearable dense label="Диапазон измерений" outlined v-model="indentificationData.equipment.measuring_range"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field clearable dense label="Диапазон работы" outlined v-model="indentificationData.equipment.measuring_work"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field clearable dense label="Точность" outlined v-model="indentificationData.equipment.accuracy"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field clearable dense label="Класс точности" outlined v-model="indentificationData.equipment.class_accuracy"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-text-field clearable dense label="Цель использования" outlined v-model="indentificationData.equipment.purpose_of_use"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea :rows="2" :height="100" dense label="Дополнительные характеристики" outlined v-model="indentificationData.equipment.characteristics"></v-textarea>
                            </v-col>
                            <v-col cols="10">
                                <v-chip small color="green" text-color="white">Инструкция по эксплуатации</v-chip>    
                            </v-col>
                            <v-col cols="2">
                                <v-btn small :ripple="false" color="orange" @click="download(item)" v-bind:disabled="!indentificationData.equipment.file_inst">Открыть</v-btn>
                                <v-dialog v-model="dialogSetIstruction" max-width="512px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn small :ripple="false" v-bind="attrs" v-on="on" color="red">Изменить</v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>Прикрепление инструкции</v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-autocomplete :items="dropdownCreate2()" v-model="id_instruction" clearable outlined dense label="Инструкция"></v-autocomplete>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="success" :loading="loadMoving" @click="updateInst()">Сохранить</v-btn>
                                            <v-btn color="error" @click="dialogSetIstruction = false">Отмена</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                            </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="success" v-on:click="submitUpdate()" :loading="save">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>История проверок</v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn" :items="indentificationData.history_checks" :items-per-page="5" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
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
                        <template v-slot:no-data>
                            Пока ничего нет :(
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
                        <template v-slot:item.date_request="{ item }">
                            {{ today(item.date_request) }}
                        </template>
                        <template v-slot:item.date_start="{ item }">
                            {{ today(item.date_start) }}
                        </template>
                        <template v-slot:item.date_end="{ item }">
                            {{ today(item.date_end) }}
                        </template>
                        <template v-slot:no-data>
                            Пока ничего нет :(
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
                    <v-dialog v-model="dialogMoving" max-width="512px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="orange" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>Перемещение</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12">
                                        <v-autocomplete :items="dropdownCreate()" v-model="moving.id_department" clearable outlined dense label="Отдел"></v-autocomplete>
                                        <v-autocomplete :items="filteredLocation" v-model="moving.id_location" clearable outlined dense label="Кабинет"></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="success" :loading="loadMoving" @click="submitMoving()">Сохранить</v-btn>
                                <v-btn color="error" @click="dialogMoving = false">Отмена</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn1" :items="indentificationData.history_moving" :items-per-page="5" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
                        <template v-slot:item.cabinet_number="{ item }">
                            {{ item.cabinet_number || "Не указан"}}
                        </template>
                        <template v-slot:item.last_cabinet="{ item }">
                            {{ item.last_cabinet || "Не указан"}}
                        </template>
                        <template v-slot:no-data>
                            Пока ничего нет :(
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Условия работы
                    <v-spacer></v-spacer>
                    <v-btn x-small color="success" v-on:click="submitUpdateCondition()" :loading="saveCondition">Сохранить условия работы</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field clearable dense label="Влажность" outlined v-model="indentificationData.condition_working.humidity"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field clearable dense label="Давление" outlined v-model="indentificationData.condition_working.pressure"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field clearable dense label="Температура" outlined v-model="indentificationData.condition_working.temperature"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field clearable dense label="Напряжение" type="number" outlined v-model="indentificationData.condition_working.voltage"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field clearable dense label="Ток" type="number" outlined v-model="indentificationData.condition_working.amperage"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>
                    Требуемое техническое обслуживание
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialogMaintenance" max-width="512px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="orange" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>Техническое обслуживание</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12">
                                        <v-autocomplete :items="dropdownCreate1('type')" v-model="main.id_type_maintenance" clearable outlined dense label="Вид ТО"></v-autocomplete>
                                        <v-autocomplete :items="dropdownCreate1('executor')" v-model="main.id_executor" clearable outlined dense label="Исполнитель"></v-autocomplete>
                                        <v-text-field v-model="main.periodicity" clearable outlined dense label="Периодичность"></v-text-field>
                                        <v-autocomplete :items="dropdownCreate1('maintenances')" v-model="main.id_maintenance" :allowOverflow="false" clearable outlined dense label="Техническое обслуживание"></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="success" :loading="loadMoving" @click="submitMaintenance()">Сохранить</v-btn>
                                <v-btn color="error" @click="dialogMaintenance = false">Отмена</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-card-text>
                    <v-data-table dense :headers="tableColumn2" :items="indentificationData.maintance" :items-per-page="5" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Отобразить на странице'}">
                        <template v-slot:no-data>
                            Пока ничего нет :(
                        </template>
                    </v-data-table>
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
                { text: 'Запрос', align: 'start', sortable: false, value: 'date_request' },
                { text: 'Принято', align: 'start', sortable: false, value: 'date_start' },
                { text: 'Завершено', align: 'start', sortable: false, value: 'date_end' },
                { text: 'Проблема', align: 'start', sortable: false, value: 'problem' },
                { text: 'Решение', align: 'start', sortable: false, value: 'request_report' },
                { text: 'Инициатор', align: 'end', sortable: false, value: 'user' },
                { text: 'Принял', align: 'end', sortable: false, value: 'accepted' },
                { text: 'Выполнил', align: 'end', sortable: false, value: 'executor' }
            ],
            changedItem: {},
            moving: {
                id_department: null,
                id_location: null
            },
            main: {
                id_type_maintenance: null,
                id_executor: null,
                periodicity: null,
                id_maintenance: null,
                id_equipment: null
            },
            dataMoving: null,
            dataMaintenances: null,
            dataInst: null,
            id_instruction: null,
            save: false,
            saveCondition: false,
            overlay: false,
            loadMoving: false,
            dialogMoving: false,
            dialogMaintenance: false,
            dialogSetIstruction: false
        }
    },
    watch: {
        id(newVal, oldVal) {
            if(newVal != oldVal)
                this.getEquipment();
        },
        indentificationData: {
            handler: function(val, old){
                let ob = this.indentificationDataCopy;
                let ch = this.changedItem;
                Object.keys(val.equipment).forEach(function(row){
                    if(ob[row] != val.equipment[row])
                        ch[row] = val.equipment[row];
                });
            },
            deep: true
        },
		dialogMoving(newVal){
			if(newVal === true && !this.dataMoving)
				this.$http.get('/api/equipment/support/locations').then(response => (this.dataMoving = response.data)).catch(error => (alert(error.response.data.message)));
        },
		dialogMaintenance(newVal){
			if(newVal === true && !this.dataMaintenances)
				this.$http.get('/api/equipment/support/maintenances').then(response => (this.dataMaintenances = response.data)).catch(error => (alert(error.response.data.message)));
        },
        dialogSetIstruction(newVal){
            if(newVal === true && !this.dataInst)
				this.$http.get('/api/equipment/instructions').then(response => (this.dataInst = response.data)).catch(error => (alert(error.response.data.message)));            
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
        submitUpdate(){
            if(Object.keys(this.changedItem).length)
            {
                this.save = true;
                this.$http.put(`/api/equipment/equipments/${this.indentificationDataCopy.id}/update`, this.changedItem, {headers: {'Content-Type': 'application/json'}})
                .then(response => (this.save = false, this.changedItem = {})).catch(error => (this.save = false, alert(error.response.data.message)));
                //.then(response => (this.save = false, this.indentificationDataCopy = {}, this.changedItem = {})).catch(error => (this.save = false, alert(error.response.data.message)));
            }
            else alert('Изменения не вносились');
        },
        submitUpdateCondition(){
            this.saveCondition = true;
            this.$http.put(`/api/equipment/equipments/${this.indentificationData.equipment.id}/cupdate`, this.indentificationData.condition_working, {headers: {'Content-Type': 'application/json'}})
            .then(response => (this.saveCondition = false)).catch(error => (this.saveCondition = false, alert(error.response.data.message)));
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
        dropdownCreate(){
            if(this.dataMoving)
            {
                let result = [];
                for (let str of this.dataMoving['department'])
                    result.push({value: str['id'], text: str['title'] || str['cabinet_number']});
                return result;
            }
        },
        dropdownCreate1(tp){
            if(this.dataMaintenances)
            {
                let result = [];
                for (let str of this.dataMaintenances[tp])
                    result.push({value: str['id'], text: str['title']});
                return result;
            }
        },
        dropdownCreate2(){
            if(this.dataInst)
            {
                let result = [];
                for (let str of this.dataInst)
                    result.push({value: str['id'], text: `${str['number']} ${str['title']}`});
                return result;
            }
        },
        submitMoving(){
            this.loadMoving = true;
			this.$http.post(`/api/equipment/equipments/${this.indentificationData.equipment.id}/moving`, this.moving, {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.loadMoving = false, this.dialogMoving = false, this.getEquipment()))
			.catch(error => (this.loadMoving = false, alert(error.response.data.message)));
        },
        submitMaintenance(){
            this.main.id_equipment = this.indentificationData.equipment.id;
            this.loadMoving = true;
			this.$http.post('/api/equipment/equipments/maintenance', this.main, {headers: {'Content-Type': 'application/json'}})
			.then(response => (this.loadMoving = false, this.dialogMaintenance = false, this.getEquipment()))
			.catch(error => (this.loadMoving = false, alert(error.response.data.message)));
        },
        updateInst(){
            this.loadMoving = true;
            this.$http.put(`/api/equipment/equipments/${this.indentificationData.equipment.id}/${this.id_instruction}/iupdate`, {headers: {'Content-Type': 'application/json'}})
            .then(response => (this.loadMoving = false, this.dialogSetIstruction = false, this.indentificationDataCopy = {}, this.getEquipment())).catch(error => (this.loadMoving = false, alert(error.response.data.message)));
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
    computed: {
		filteredLocation(){
			if(this.dataMoving)
			{
				let result = [];
				this.dataMoving.locations.filter(item => {
					if(item.id_department === this.moving.id_department)
						result.push({value: item.id, text: item.cabinet_number});
				});
				return result;
			}
        }
    },
    mounted() {
        this.getEquipment();
    }
}
</script>