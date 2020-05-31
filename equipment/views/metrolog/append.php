<?php
    use yii\helpers\Url;
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/equipment/metrolog_append.js');
?>
<div class="row" id="arrival">
    <div class="sixteen wide column">
        <div class="ui fluid card">
            <div class="content">
                <div class="ui form">
                    <div class="three fields">
                        <div class="field">
                            <label>Отдел</label>
                            <select class="ui search dropdown" v-model="eq.id_department" v-on:change="filteredLocation(eq.id_department)">
                                <option v-for="department in listDepartment" v-bind:value="department.id_department">{{ department.department }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Местоположение</label>
                            <select class="ui search dropdown" v-model="eq.id_location">
                                <option v-for="location in listLocations" v-bind:value="location.id">{{ location.cabinet_number }} {{ location.place }} {{ location.notation }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Вид</label>
                            <select class="ui search dropdown" v-model="eq.id_equipment_type">
                                <option v-for="type in listType" v-bind:value="type.id">{{ type.title }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="ui form">
                    <div class="field">
                        <label>Наименование оборудование</label>
                        <textarea cols="30" rows="2" v-model="eq.title"></textarea>
                    </div>
                    <div class="field">
                        <label>Производитель</label>
                        <textarea cols="30" rows="2" v-model="eq.manufacturer"></textarea>
                    </div>
                    <div class="four fields">
                        <div class="field">
                            <label>Модель</label>
                            <input type="text" v-model="eq.model">
                        </div>
                        <div class="field">
                            <label>Серийный номер</label>
                            <input type="text" v-model="eq.serial_number">
                        </div>
                        <div class="field">
                            <label>Дата изготовления</label>
                            <input type="date" v-model="eq.date_create">
                        </div>
                                        <div class="field">
                        <label>Инвентарный номер</label>
                        <input type="text" v-model="eq.inventory_number">
                    </div>
                    </div>
                    <div class="field">
                        <label>Номер</label>
                        <input type="text" v-model="eq.number">
                    </div>
                </div>
            </div>
                <div class="content">
                    <a href="<?php echo Url::toRoute(['equipments/']) ?>" class="ui right floated orange button">Отмена</a>
                    <a class="ui right floated green button" v-on:click="Submit()">Сохранить</a>
                </div>
        </div>
    </div>
</div>