<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/metrolog_repair.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<repair-grid
		:rows="gridData"
		:columns="gridColumns.tableColumn"
		:filters="filters"
		:filter-date="dateFilter"
		:filters-status="status"
		:count-post="countPost"
        @eq="setSelectedEquipment">
		</repair-grid>	
	</div>
    <div id="modalFilter" class="ui tiny card modal">
        <div class="content">
            <div class="content header">Поиск</div>
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
    <div id="modalDecliningRepair" class="ui tiny card modal">
    	<div class="content">
    		<div class="content header">Отказ от ремонта</div>
    	</div>
    	<div class="content">
    		<div class="ui form">
    			<div class="field">
    				<label>Причина отказа</label>
    				<textarea cols="30" rows="2" v-model="selectedEq.request_report"></textarea>
    			</div>
    		</div>
    	</div>
    	<div class="actions">
    		<button class="ui approve green button" v-on:click="decliningRepair()">Отправить</button>
    		<button class="ui deny orange button">Отмена</button>
    	</div>
    </div>
    <div id="modalToCompleteRepair" class="ui tiny card modal">
    	<div class="content">
    		<div class="content header">Завершение ремонта</div>
    	</div>
    	<div class="content">
    		<div class="ui form">
    			<div class="field">
    				<label>Выполненая работа</label>
    				<textarea cols="30" rows="2" v-model="selectedEq.request_report"></textarea>
    			</div>
    		</div>
    	</div>
    	<div class="actions">
    		<button class="ui approve green button" v-on:click="finishRepair()">Отправить</button>
    		<button class="ui deny orange button">Отмена</button>
    	</div>
    </div>
    <div id="modaldetailProblem" class="ui small card modal">
        <div class="content">
            <div class="content header">Заявка на ремонт № {{ selectedEq.id }}</div>
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field">
                    <label>ОБОРУДОВАНИЕ: {{ selectedEq.equipment }}</label>
                    <label>МОДЕЛЬ: {{ selectedEq.model }}</label>
                    <label>КАБИНЕТ: {{ selectedEq.cabinet }}</label>
                    <label>Проблема: {{ selectedEq.problem }}</label>
                </div>
            </div>
        </div>
		<div class="content" v-if="selectedEq.request_report">
			<div class="header">Отчет по заявке</div>
			<div class="content">
				{{ selectedEq.request_report }}
			</div>
		</div>
        <div class="actions" v-if="selectedEq.id_status === 1 || selectedEq.id_status === 2">
            <button class="ui approve green button" v-show="selectedEq.id_status === 1" v-on:click="approveRepair()">Принять</button>
            <button class="ui approve green button" v-on:click="showModal('ToCompleteRepair')" v-show="selectedEq.id_status === 2">Завершить</button>
            <button class="ui deny orange button" v-on:click="showModal('DecliningRepair')" v-show="selectedEq.id_status === 1">Отказать</button>
        </div>
    </div>
</div>
<template id="repair-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
                    Заявки на ремонт
                    <button class="ui teal right floated mini icon button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
                </th>
			</tr>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui form"><div class="field"><input type="text" placeholder="Поиск" v-model="filterKey"></div></div>
				</th>
			</tr>
<!-- 			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersStatus.1">
						<label>Открыта</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersStatus.2">
						<label>Принята</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersStatus.3">
						<label>Выполнена</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersStatus.3">
						<label>Отменена</label>
					</div>
				</th>
			</tr> -->
			<tr>
				<th v-for="key in columns" @click="sortBy(Object.keys(key)[0])">
					{{ Object.values(key)[0] }}
					<i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="equipment in paginateRows">
                <td class="collapsing">{{equipment.id}}</td>
				<td v-bind:class="{ 'collapsing danger': equipment.id_status === 1, 'collapsing caution': equipment.id_status === 2, 'collapsing success': equipment.id_status === 3, 'collapsing working': equipment.id_status === 4}">{{ equipment.status }}</td>
                <td class="collapsing">{{ today(equipment.date_request) }}</td>
                <td class="collapsing">{{ today(equipment.date_start) }}</td>
				<td class="collapsing">{{ today(equipment.date_end) }}</td>
				<td>{{ equipment.equipment }}</td>
				<td class="collapsing">{{ equipment.cabinet_number }}</td>
                <td class="collapsing">{{ equipment.user }}</td>
				<td class="collapsing">{{ equipment.executor }}</td>
                <td class="collapsing">
                    <a class="ui mini icon yellow button" type="button" v-on:click="showModal('detailProblem', equipment)"><i class="icon eye"></i></a>
                </td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui left floated label">
						Страница {{ currentPage }} из {{ listPages.length }}
					</div>
					<!-- <div class="ui left floated label">Cтрок {{lenghtPaginated}} из {{filteredRows.length}}</div> -->
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