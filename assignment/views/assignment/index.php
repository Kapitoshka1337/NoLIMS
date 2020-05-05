<?php
    use yii\helpers\Url;
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/assignment/assignment.js');
?>
<div class="row" id="demo">
    <assignment-grid
        :rows="gridData"
        :columns="gridColumns.tableColumn"
        :filter-list="filters"
        :count-post="count">
    </assignment-grid>
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
    <table class="ui small compact selectable table">
        <thead>
            <tr>
                <th v-bind:colspan="columns.length">
                    <div class="ui icon right floated small buttons">
                        <a href="<?php echo Url::toRoute(['add/']) ?>" class="ui green button">Добавить</a>
                        <button class="ui yellow button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
                        <div class="ui teal button" v-on:click="showModal('Filter')"><i class="icon filter"></i></div>
                    </div>
                </th>
            </tr>
            <tr>
                <th v-for="key in columns" @click="sortBy(Object.keys(key)[0])">
                    {{ Object.values(key)[0] }}
                    <i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="data in paginateRows">
                <td class="collapsing">{{ data.id }}</td>
                <td>{{ data.block }}</td>
                <td>{{ data.vet }}</td>
                <td>{{ data.region }}</td>
                <td>{{ data.farm.slice(0, 36)}}</td>
                <td>{{ data.animal }}</td>
                <td>{{ data.method }}</td>
                <td>{{ data.amount }}</td >
                <td v-bind:class="{success:(data.block_balance) >= Math.round((data.block_plan / 10) * (36 / 10)), caution: (data.block_balance) <= Math.round((data.block_plan / 10) * (36 / 10)), danger: (data.block_balance) <= Math.round((data.block_plan / 10) * (16 / 10))}">{{ data.block_balance }} / <strong>{{ data.block_plan }}</strong></td>
                <td v-bind:class="{success:(data.plan_balance) >= Math.round((data.plan / 10) * (36 / 10)), caution: (data.plan_balance) <= Math.round((data.plan / 10) * (36 / 10)), danger: (data.plan_balance) <= Math.round((data.plan / 10) * (16 / 10))}">{{ data.plan_balance }} / <strong>{{ data.plan }}</strong></td>
                <td>{{ data.total }}</td>
                <td width="100">{{ data.date }}</td>
                <td width="130" >{{ data.empl.slice(0, 15)}}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th v-bind:colspan="columns.length">
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