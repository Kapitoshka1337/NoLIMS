<template>
    <sui-grid-row>
        <sui-grid-column>
            <sui-card-group>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Идентификационные данныe</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Наименование</label>
                                    <textarea cols="30" rows="2"></textarea>
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Производитель</label>
                                    <textarea cols="30" rows="2"></textarea>
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="four">
                                <sui-form-field>
                                    <label>Инвентарный номер</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Серийный номер</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Модель</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Дата изготовления</label>
                                    <input type="date">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="three">
                                <sui-form-field>
                                    <label>Номер</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>ФИФ</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Введено в эксплуатацию</label>
                                    <input type="date">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-field>
                                <label>Примечание</label>
                                <textarea cols="30" rows="2"></textarea>
                            </sui-form-field>
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
                                <sui-dropdown search selection multiple ></sui-dropdown>
                                <!-- <select class="ui search dropdown" v-model="listDetails.equipment.id_equipment_type">
                                    <option v-for="type in listDetails.types.type" v-bind:value="type.id">{{ type.title }}</option>
                                </select> -->
                            </sui-form-field>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Диапазон измерений</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Диапазон работы</label>
                                    <input type="text">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="two">
                                <sui-form-field>
                                    <label>Точность <span>(<span v-on:click="addPlus()">±</span> / <span v-on:click="addTemp()">°</span>)</span></label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Класс точности</label>
                                    <input type="text">
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-fields fields="three">
                                <sui-form-field>
                                    <label>Цель использования</label>
                                    <input type="text">
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Объект исследования</label>
                                    <sui-dropdown search selection multiple ></sui-dropdown>
                                    <!-- <select class="ui search dropdown" v-model="listDetails.equipment.id_object_study">
                                        <option v-for="object in listObjectStudy" v-bind:value="object.id">{{ object.title }}</option>
                                    </select> -->
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Функциональное значение</label>
                                    <sui-dropdown search selection multiple ></sui-dropdown>
                                    <!-- <select class="ui search dropdown" v-model="listDetails.equipment.id_function_of_use">
                                        <option v-for="location in filteredFunctionOfUse" v-bind:value="location.id">{{ location.title }}</option>
                                    </select> -->
                                </sui-form-field>
                            </sui-form-fields>
                            <sui-form-field>
                                <label>Дополнительные характеристики</label>
                                <textarea cols="30" rows="2"></textarea>
                            </sui-form-field>
                            <sui-form-fields>
                                <sui-form-field>
                                    <sui-form-field class="ui green label">Инструкция по эксплуатации</sui-form-field>
                                </sui-form-field>
                                <sui-form-field>
                                    <!-- <a class="ui right floated red mini button" v-on:click="showModal('EditInstruction')">Изменить</a>
                                    <a v-if="listDetails.instruction" v-bind:href="'/assets/uploads/' + listDetails.instruction.upload_file" class="ui right floated yellow mini button" target="_blank">Открыть</a> -->
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>История проверок</sui-card-header>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-table compact>
                            <sui-table-header>
                                <sui-table-row>
                                    <sui-table-header-cell>Текущая</sui-table-header-cell>
                                    <sui-table-header-cell>Следующая</sui-table-header-cell>
                                    <sui-table-header-cell>Документ</sui-table-header-cell>
                                    <sui-table-header-cell>№ документа</sui-table-header-cell>
                                    <sui-table-header-cell>Загруженный файл</sui-table-header-cell>
                                    <sui-table-header-cell></sui-table-header-cell>
                                </sui-table-row>
                            </sui-table-header>
                            <sui-table-body>
                                <!-- <tr v-for="moving in listDetails.history_moving">
                                    <td>{{ moving.current_department }}</td>
                                    <td>{{ moving.next_department }}</td>
                                    <td>{{ moving.current_location }}</td>
                                    <td>{{ moving.next_location }}</td>
                                </tr> -->
                            </sui-table-body>
                        </sui-table>
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
                                    <sui-checkbox label="Архив"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="Используется"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="Консервация"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="Ремонт"/>
                                </sui-form-field>
                                <sui-form-field>
                                    <sui-checkbox label="ЦСМ"/>
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
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
                        <sui-card-header>Перемещения</sui-card-header>
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
                                <!-- <tr v-for="moving in listDetails.history_moving">
                                    <td>{{ moving.current_department }}</td>
                                    <td>{{ moving.next_department }}</td>
                                    <td>{{ moving.current_location }}</td>
                                    <td>{{ moving.next_location }}</td>
                                </tr> -->
                            </sui-table-body>
                        </sui-table>
                    </sui-card-content>
                </sui-card>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-card-header>Условия работы</sui-card-header>
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
                        <sui-card-header>Требуемое техническое обслуживание</sui-card-header>
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
                                <!-- <tr v-for="moving in listDetails.history_moving">
                                    <td>{{ moving.current_department }}</td>
                                    <td>{{ moving.next_department }}</td>
                                    <td>{{ moving.current_location }}</td>
                                    <td>{{ moving.next_location }}</td>
                                </tr> -->
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

        }
    }
}
</script>