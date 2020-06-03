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
    <div id="modalCheckReq" class="ui large card modal">
        <div class="content">
            <div class="content header">Выбор оборудования</div>
        </div>
        <div class="scrolling content">
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th>Оборудование</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                        <tr v-for="(eq, k) in equipment">
                            <td class="collapsing">{{ eq.equipment }}</td>
                            <!-- <td class="collapsing">{{ eq.is_received }}</td> -->
                            <td class="one wide">
                                <div class="ui mini icon buttons">
                                    <button v-bind:class="{'ui green button': eq.is_received, 'ui red button': !eq.is_received}" type="button" v-on:click="checkEq(k, eq)"><i class="icon check circle outline"></i></button>
                                </div>
                            </td>
                        </td>
                    </tr>
                </tbody>
            </table>
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
                <td class="collapsiung">{{ check.date_create }}</td>
                <td class="collapsiung">{{ check.date_submit }}</td>
                <td class="collapsiung">{{ check.date_received }}</td>
                <td class="collapsiung">{{ check.status }}</td>
                <td class="one wide">
                    <div class="ui mini icon buttons">
                        <button class="ui yellow button" type="button" v-on:click="showModal('CheckReq', check.equipment)"><i class="icon eye"></i></button>
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