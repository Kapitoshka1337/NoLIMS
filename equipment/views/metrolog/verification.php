<?php 
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/equipment/metrolog_verification.js');
?>
<div class="row" id="checks">
	<div class="three wide column">
        <div class="ui fluid card">
            <div class="content">
                <div class="center aligned header">
                    <h2>Поиск</h2>
                </div>
            </div>
            <div class="content">
                <div class="ui form">
                    <div class="field" v-for="key in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))">
                        <label>{{ Object.values(key)[0] }}</label>
                        <select multiple class="ui fluid search dropdown" v-model="filters[Object.keys(key)]">
                            <option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
	</div>
    <div class="thirteen wide column">
        <checks-grid
            :rows="gridData"
            :columns="gridColumns.tableColumn"
            :filters="filters"
            :count-post="countPost"
            @request="setEq">
        </checks-grid>
    </div>
    <div id="modalCheckReqBefore" class="ui large card modal">
        <div class="content">
            <div class="content header">Отправляемое оборудование</div>
        </div>
        <div class="scrolling content">
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Оборудование</th>
                        <th>Модель</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(eq, k) in equipment.equipment">
                        <td class="collapsing">{{ eq.number }}</td>
                        <td class="collapsing">{{ eq.equipment }}</td>
                        <td class="collapsing">{{ eq.model }}</td>
                        <!-- <td class="collapsing">{{ eq.is_received }}</td> -->
                        <td class="one wide">
                            <div class="ui green label" v-if="eq.is_received_before">Получено</div>
                            <div class="ui mini icon buttons" v-if="!eq.is_received_before">
                                <button v-bind:class="{'ui red button': !eq.is_received_before}" type="button" v-on:click="checkEqBefore(k)"><i class="icon check"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="modalCheckReqAfter" class="ui large card modal">
        <div class="content">
            <div class="content header">Отправленное оборудование</div>
        </div>
        <div class="scrolling content">
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Оборудование</th>
                        <th>Модель</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(eq, k) in equipment.equipment">
                        <td class="collapsing">{{ eq.number }}</td>
                        <td class="collapsing">{{ eq.equipment }}</td>
                        <td class="collapsing">{{ eq.model }}</td>
                        <td class="collapsing">
                            <div class="ui orange label" v-if="!eq.is_received_before">Не принесли</div>
                            <div class="ui green label" v-if="eq.is_received_after">Получено</div>
                            <div class="ui mini icon buttons" v-if="eq.is_received_before && !eq.is_received_after">
                                <button v-bind:class="{'ui red button': !eq.is_received_after}" type="button" v-on:click="checkEqAfter(k)"><i class="icon check"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="modalBeforeRequest" class="ui large card modal">
        <div class="content">
            <div class="content header">Добавляемое оборудование в заявку</div>
        </div>
        <div class="scrolling content">
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Оборудование</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(eq, k) in filteredEqBeforeAfter">
                        <td class="collapsing">{{ eq.number }}</td>
                        <td class="collapsing">{{ eq.equipment }}, {{ eq.model }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="ui two fields">
                    <div class="field">
                        <label>Приложение к договору</label>
                        <input type="text" v-model="forRequest.dogovor">
                    </div>
                    <div class="field">
                        <label>Контактый номер</label>
                        <input type="text" v-model="forRequest.telephone">
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <button class="ui approve green button" v-on:click="getRequest(filteredEqBeforeAfter[0].id_checks)">Печать</button>
        </div>
    </div>
</div>
<template id="checks-grid">
    <table class="ui compact selectable table">
        <thead>
            <tr>
                <th v-for="key in columns" @click="sortBy(Object.keys(key)[0])">
                    {{ Object.values(key)[0] }}
                    <i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="check in paginateRows">
                <td class="collapsing">{{ check.date_create }}</td>
                <td class="collapsing">{{ check.date_submit }}</td>
                <!-- <td class="collapsing">{{ check.status }}</td> -->
                <td class="center aligned collapsing" v-if="!check.date_submit"> {{ check.equipment.filter(r => { return r.is_received_before }).length }} / {{ check.equipment.length }}</td>
                <td class="center aligned collapsing" v-if="check.date_submit"> {{ check.equipment.filter(r => { return r.is_received_after }).length }} / {{ check.equipment.filter(r => { return r.is_received_before }).length }} ({{check.equipment.length}})</td>
                <td class="right aligned collapsing">
                    <div class="container" v-if="!check.date_submit">
                        <a class="ui mini icon yellow button" type="button" v-on:click="showModal('CheckReqBefore', check)"><i class="icon eye"></i></a>
                        <a class="ui blue mini icon button" v-on:click="showModal('BeforeRequest', check)"><i class="icon print"></i></a>
                        <a class="ui mini icon green button" type="button" v-on:click="submitEq(check.equipment[0].id_checks)"><i class="icon play"></i></a>
                    </div>
                    <div class="container" v-if="check.date_submit">
                        <a class="ui mini icon yellow button" type="button" v-on:click="showModal('CheckReqAfter', check)"><i class="icon eye"></i></a>
                        <a class="ui blue mini icon button" v-on:click="showModal('BeforeRequest', check)"><i class="icon print"></i></a>
                    </div>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th v-bind:colspan="columns.length + 1">
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
</template>