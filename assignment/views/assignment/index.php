<?php
    use yii\helpers\Url;
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/assignment/assignment.js');
?>
<div class="row" id="demo">
    <div class="three wide column">
        <div class="ui fluid card">
            <div class="content">
                <div class="ui bottom attached buttons">
                    <a href="<?php echo Url::toRoute(['add/']) ?>" class="ui yellow button">Добавить</a>
                </div>
            </div>
        </div>
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
        <assignment-grid
            :rows="gridData"
            :columns="gridColumns.tableColumn"
            :filter-list="filters"
            :count-post="count">
        </assignment-grid>
    </div>
    <div id="modalFilter" class="ui tiny card modal">
        <div class="content">
            <div class="content header">
            Поиск
            </div>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field" v-for="key in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))">
                    <label>{{ Object.values(key)[0] }}</label>
                    <select multiple class="ui search dropdown" v-model="filters[Object.keys(key)]">
                        <option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<template id="grid-assignment">
    <div class="ui cards">
        <div class="ui fluid card">
            <div class="content">
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
            </div>
        </div>
        <div class="ui fluid card" v-for="data in paginateRows">
            <div class="content">
                <div class="header">{{data.vet}} ({{data.region}})<span class="right floated header">{{data.date}}</span></div>
                <div class="meta">{{data.farm}}<span class="right floated meta">{{data.animal}} ({{data.method}})</span></div>
            </div>
            <div class="content">
                <div class="ui grid">
                    <div class="row">
                        <div class="sixteen wide column">
                            <div class="description">
                                <div class="ui horizontal list">
                                    <div class="item"><span v-bind:class="{'ui green label':(data.block_balance) >Math.round((data.block_plan / 10) * (36 / 10)), 'ui yellow label': (data.block_balance) <= Math.round((data.block_plan / 10) * (36 / 10)) && (data.block_balance) >= Math.round((data.block_plan / 10) * (16 / 10)), 'ui red label': (data.block_balance) <= Math.round((data.block_plan / 10) * (16 / 10))}">Квартальный остаток/план: {{data.block_balance}}/{{data.block_plan}}</span></div>
                                    <div class="item"><span v-bind:class="{'ui green label':(data.plan_balance) >Math.round((data.plan / 10) * (36 / 10)), 'ui yellow label': (data.plan_balance) <= Math.round((data.plan / 10) * (36 / 10)) && (data.plan_balance) >= Math.round((data.plan / 10) * (16 / 10)), 'ui red label': (data.plan_balance) <= Math.round((data.plan / 10) * (16 / 10))}">Годовой остаток/план: {{data.plan_balance}}/{{data.plan}}</span></div>
                                    <div class="item">Количество: {{data.amount}}</div>
                                    <div class="item">Итого: {{data.total}}</div>
                                </div>
                                <p>Место отбора: {{data.place_of_selection}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="extra content">
                <div class="left floated">{{data.id}}</div>
                <div class="right floated">{{data.empl}}</div>
            </div>
        </div>
    </div>
</template>