<template>
    <sui-grid-row>
        <sui-grid-column>
            <sui-loader centered v-bind:active="!indentificationData" inline/>
            <sui-card-group v-if="indentificationData">
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Идентификационные данныe</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Наименование</label>
                                    <textarea cols="30" rows="2" v-model="indentificationData.equipment.title"></textarea>
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Производитель</label>
                                    <textarea cols="30" rows="2" v-model="indentificationData.equipment.manufacturer"></textarea>
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="four">
                                <sui-form-field>
                                    <label>Инвентарный номер</label>
                                    <input type="text" v-model="indentificationData.equipment.inventory_number">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Серийный номер</label>
                                    <input type="text" v-model="indentificationData.equipment.serial_number">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Модель</label>
                                    <input type="text" v-model="indentificationData.equipment.model">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Дата изготовления</label>
                                    <input type="date" v-model="indentificationData.equipment.date_create">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="three">
                                <sui-form-field>
                                    <label>Номер</label>
                                    <input type="text" v-model="indentificationData.equipment.number">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>ФИФ</label>
                                    <input type="text" v-model="indentificationData.equipment.fif_number">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Введено в эксплуатацию</label>
                                    <input type="date" v-model="indentificationData.equipment.date_commissioning">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-field>
                                <label>Примечание</label>
                                <textarea cols="30" rows="2" v-model="indentificationData.equipment.description"></textarea>
                            </sui-form-field>
                        </sui-form>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Состояние</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields inline>
                                <sui-form-field>
                                    <sui-checkbox label="Архив" v-model="indentificationData.equipment.is_archive"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="Используется" v-model="indentificationData.equipment.is_working"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="Консервация" v-model="indentificationData.equipment.is_conservation"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="Ремонт" v-model="indentificationData.equipment.is_repair"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="ЦСМ" v-model="indentificationData.equipment.is_check"/>
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Характеристики</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-form>
                            <sui-form-field>
                                <label>Вид</label>
                                <sui-dropdown search selection :options="dropdown('type')" v-model="indentificationData.equipment.id_equipment_type"></sui-dropdown>
                            </sui-form-field>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Диапазон измерений</label>
                                    <input type="text" v-model="indentificationData.equipment.measuring_range">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Диапазон работы</label>
                                    <input type="text" v-model="indentificationData.equipment.measuring_work">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Точность</label>
                                    <input type="text" v-model="indentificationData.equipment.accuracy">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Класс точности</label>
                                    <input type="text" v-model="indentificationData.equipment.class_accuracy">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Объект исследования</label>
                                    <sui-dropdown search selection :options="dropdown('studies')" v-model="indentificationData.equipment.id_object_study"></sui-dropdown>
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Функциональное значение</label>
                                    <sui-dropdown search selection :options="dropdown('function')" v-model="indentificationData.equipment.id_function_of_use"></sui-dropdown>
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-field>
                                <label>Цель использования</label>
                                <input type="text" v-model="indentificationData.equipment.purpose_of_use">
                            </sui-form-field>
                            <sui-form-field>
                                <label>Дополнительные характеристики</label>
                                <textarea cols="30" rows="2" v-model="indentificationData.equipment.characteristics"></textarea>
                            </sui-form-field>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <sui-form-field class="ui green label">Инструкция по эксплуатации</sui-form-field>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-button size="mini" floated="right" color="red" content="Изменить" v-on:click="showModal('EditInstruction')"></sui-button>
                                    <sui-button v-if="indentificationData.equipment.id_instruction" size="mini" floated="right" color="yellow" content="Открыть"></sui-button>                                    
                                    <!--<a v-if="listDetails.instruction" v-bind:href="'/assets/uploads/' + listDetails.instruction.upload_file" class="ui right floated yellow mini button" target="_blank">Открыть</a>-->
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>
                            История проверок
                            <sui-button color="yellow" size="mini" floated="right" icon="plus"></sui-button>
                        </sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-table compact>
                            <sui-table-header>
                                <sui-table-row>
                                    <sui-table-header-cell>Текущая</sui-table-header-cell>
                                    <sui-table-header-cell>Следующая</sui-table-header-cell>
                                    <sui-table-header-cell>Вид документа</sui-table-header-cell>
                                    <sui-table-header-cell>№ документа</sui-table-header-cell>
                                    <sui-table-header-cell>Документ</sui-table-header-cell>
                                    <sui-table-header-cell></sui-table-header-cell>
                                </sui-table-row>
                            </sui-table-header>
                            <sui-table-body>
                                <sui-table-row v-for="check in indentificationData.history_checks" :key="check">
                                    <sui-table-cell>{{ today(check.date_current_check) }}</sui-table-cell>
                                    <sui-table-cell>{{ today(check.date_next_check) }}</sui-table-cell>
                                    <sui-table-cell>{{ check.type_document || 'Не указан' }}</sui-table-cell>
                                    <sui-table-cell>{{ check.number_document || 'Не указан'}}</sui-table-cell>
                                    <sui-table-cell>{{ check.upload_file_name || 'Не загружен'}}</sui-table-cell>
                                </sui-table-row>
                            </sui-table-body>
                        </sui-table>
                    </sui-card-content>
                </sui-card>
                <!-- <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Местоположение</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Отдел</label>
                                    <sui-dropdown search selection multiple ></sui-dropdown>
                                    <select class="ui search dropdown disabled" v-model="listDetails.equipment.id_department">
                                        <option v-for="department in listDepartment" v-bind:value="department.id_department">{{ department.department }}</option>
                                    </select>
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Кабинет</label>
                                    <sui-dropdown search selection multiple ></sui-dropdown>
                                    <select class="ui search dropdown" v-model="listDetails.equipment.id_location">
                                        <option v-for="location in filteredLocation" v-bind:value="location.id">{{ location.cabinet_number }}</option>
                                    </select>
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                </sui-card> -->
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>
                            Перемещения
                            <sui-button color="yellow" size="mini" floated="right" icon="plus"></sui-button>
                        </sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-table compact>
                            <sui-table-header>
                                <sui-table-row>
                                    <sui-table-header-cell>Прошлый отдел</sui-table-header-cell>
                                    <sui-table-header-cell>Текущий отдел</sui-table-header-cell>
                                    <sui-table-header-cell>Прошлый кабинет</sui-table-header-cell>
                                    <sui-table-header-cell>Текущий кабинет</sui-table-header-cell>
                                </sui-table-row>
                            </sui-table-header>
                            <sui-table-body>
                                <sui-table-row v-for="check in indentificationData.history_moving" :key="check">
                                    <sui-table-cell>{{ check.last_department }}</sui-table-cell>
                                    <sui-table-cell>{{ check.department }}</sui-table-cell>
                                    <sui-table-cell>{{ check.cabinet_number }}</sui-table-cell>
                                    <sui-table-cell>{{ check.last_cabinet }}</sui-table-cell>
                                </sui-table-row>
                            </sui-table-body>
                        </sui-table>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Условия работы (ОТКАЗ)</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields fields="three">
                                <sui-form-field>
                                    <label>Влажность</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Давление</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Температура</label>
                                    <input type="text">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Напряжение</label>
                                    <input type="number">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Ток</label>
                                    <input type="number">
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>
                            Требуемое техническое обслуживание
                            <sui-button color="yellow" size="mini" floated="right" icon="plus"></sui-button>
                        </sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-table compact>
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
                            </sui-table-body>
                        </sui-table>
                    </sui-card-content>
                </sui-card>
            </sui-card-group>
        </sui-grid-column>
    </sui-grid-row>
</template>

<script>
export default {
	props:['id'],
    data(){
        return {
            indentificationData: null
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
                    result.push({key: str['id'], value: str['id'], text: str['title']});
                return result;
            }            
        }
    },
    created() {
        this.getEquipment();
    }
}
</script>