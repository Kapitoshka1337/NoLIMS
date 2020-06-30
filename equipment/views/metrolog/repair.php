<?php
	use yii\helpers\Url;
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/metrolog_repair.js');
?>
<div class="row" id="demo1">
	<div class="sixteen column">
		<repair-grid
		:rows="gridData"
		:columns="gridColumns.tableColumn"
		:filters="filters"
		:filter-date="dateFilter"
		:count-post="countPost">
		</repair-grid>	
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
				<textarea cols="30" rows="2" v-model="repair.description"></textarea>
			</div>
		</div>
	</div>
	<div class="actions">
		<button class="ui approve green button">Отправить</button>
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
				<textarea cols="30" rows="2" v-model="repair.description"></textarea>
			</div>
		</div>
	</div>
	<div class="actions">
		<button class="ui approve green button">Отправить</button>
		<button class="ui deny orange button">Отмена</button>
	</div>
</div>
<template id="repair-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">Заявки на ремонт</th>
			</tr>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui form"><div class="field"><input type="text" placeholder="Поиск" v-model="filterKey"></div></div>
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
			<tr v-for="equipment in paginateRows">
				<td class="collapsing">{{ equipment.status }}</td>
				<td class="collapsing">{{ today(equipment.date_request) }}</td>
				<td>{{ equipment.equipment }}</td>
				<td class="collapsing">{{ equipment.cabinet_number }}</td>
				<td class="collapsing">{{ equipment.user }}</td>
				<td class="collapsing">
					<div class="ui icon left pointing dropdown mini button">
						<i class="settings icon"></i>
						<div class="menu">
							<div class="item" v-on:click="showModal('ToCompleteRepair')">Выполнено</div>
							<div class="item">Принять</div>
							<div class="item" v-on:click="showModal('DecliningRepair')">Отказать</div>
						</div>
					</div>
					<!-- <a class="ui orange mini icon button"><i class="icon print"></i></a> -->
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