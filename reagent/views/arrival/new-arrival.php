<?php 
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/reagent/arrival.js');
?>
<div class="row" id="arrival">
    <div class="sixteen wide column">
        <div class="ui segment">
            <div class="ui form">
                <div class="ui inline fields">
                    <div v-bind:class="{'error field': order.num_order === '', 'happy field': order.num_order != ''}">
                        <label>Заказ № </label>
                        <input type="text" v-model="order.num_order">
                    </div>
                    <div v-bind:class="{'error field': order.date_order === '', 'happy field': order.date_order != ''}">
                        <label>от </label>
                        <input type="date" v-model="order.date_order">
                    </div>
                    <div class="seven wide field">
                        <label>Отдел</label>
                        <input type="text" readonly="" value="<?php echo $department->title ?>">
                    </div>
                </div>
                <div class="ui four cards">
                    <div class="card" v-for="(material, k) in listMaterialForTable">
                        <div class="content">
                            <div class="header">{{ material.material }}</div>
                            <div class="meta">
                                {{ material.type }} ({{ material.measure }})
                            </div>
                        </div>
                        <div class="content">
                            <div v-bind:class="{'error field': material.amount <= 0, 'happy field': material.amount > 0}">
                                <label>Количество</label>
                                <input type="number" min="0" v-model="material.amount">
                            </div>
                            <div v-bind:class="{'error field': material.id_location === null, 'happy field': material.id_location != null}">
                                <label>Местоположение</label>
                                <select v-model="material.id_location" class="ui search dropdown">
                                    <option v-for="location in listLocations" v-bind:value="location.id">
                                        {{ location.cabinet_number }} {{ location.place }} {{ location.notation }}
                                    </option>
                                </select>
                            </div>
                            <div v-bind:class="{'error field': material.packing_name === '', 'happy field': material.packing_name != ''}">
                                <label>Наименование в накладной</label>
                                <textarea cols="30" rows="3" v-model="material.packing_name"></textarea>
                            </div>
                            <div v-bind:class="{'error field': material.date_create === '', 'happy field': material.date_create != ''}">
                                <label>Дата изготовления</label>
                                <input type="date" v-model="material.date_create">
                            </div>
                            <div v-bind:class="{'error field': material.shelf_life === '', 'happy field': material.shelf_life != ''}">
                                <label>Годен до</label>
                                <input type="date" v-model="material.shelf_life">
                            </div>
                        </div>
                        <div class="content">
                           <div class="ui small icon buttons">
                                <button class="ui red button" type="button" v-on:click="deleteMaterial(k, material)"><i class="icon trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui small icon buttons">
            <button class="ui teal button" type="button" v-on:click="tableMaterial('AddMaterial')"><i class="icon plus"></i></button>
        </div>
        <button class="ui right floated orange button" type="button" v-on:click="cancel()">Отмена</button>
        <button class="ui right floated green button" type="button" v-on:click="save()" v-bind:disabled="listMaterialForTable <= 0">Добавить</button>
    </div>
    <div id="modalAddMaterial" class="ui large card long coupled modal">
        <div class="content">
            <div class="header">
                Выбор материала
            </div>
        </div>
        <div class="scrolling content">
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th class="collapsing">
<!--                             <div class="ui checkbox">
                                <input type="checkbox" v-model="selectAllMaterials" v-on:click="select()">
                                <label></label>
                            </div> -->
                        </th>
                        <th v-for="key in gridColumns.tableColumn">
                            {{ Object.values(key)[0] }}
                        </th>
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>
                            <div class="ui form">
                                <div class="field">
                                    <input type="text" placeholder="Поиск по материалу" v-model="filters.material">
                                </div>
                            </div>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="material in paginateRows">
                        <td>
                            <div class="ui checkbox">
                                <input type="checkbox" 
                                v-bind:value="{
                                type: material.type, 
                                material_id: material.material_id, 
                                material: material.material.slice(0, 21) + '...',
                                measure: material.measure,
                                amount: 0,
                                date_create: '',
                                shelf_life: '',
                                id_location: null,
                                packing_name: ''
                            }" v-model="listMaterialForTable">
                                <label></label>
                            </div>
                        </td>
                        <td class="collapsing">{{ material.type }}</td>
                        <td >{{ material.material }}</td>
                        <td class="collapsing">{{ material.measure }}</td>
                    </tr>
                </tbody>
            <tfoot>
                <tr>
                    <th v-bind:colspan="gridColumns.tableColumn.length + 1">
                        <div class="ui left floated label">
                            Страница {{ currentPage }} из {{ listPages.length }}
                        </div>
                        <div class="ui icon basic right floated small buttons">
                            <button class="ui button" v-on:click="currentPage = listPages[0]"><i class="icon angle double left"></i></button>
                            <button class="ui button" v-on:click="currentPage--" v-if="currentPage != 1"><i class="icon angle left"></i></button>
                            <div class="ui form">
                                <div class="field">
                                    <input type="text" v-model="currentPage" v-bind:value="currentPage">
                                </div>
                            </div>
                            <button class="ui button" v-on:click="currentPage++" v-if="currentPage < listPages.length"><i class="icon angle right"></i></button>
                            <button class="ui button" v-on:click="currentPage = listPages.length"><i class="icon angle double right"></i></button>
                        </div>
                    </th>
                </tr>
            </tfoot>
            </table>
        </div>
    </div>
</div>