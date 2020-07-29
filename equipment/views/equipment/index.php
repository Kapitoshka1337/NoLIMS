<?php
	$this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
	$this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
	$this->registerJsFile('@web/assets/js/equipment/user_equipment.js');
?>
<div class="row" id="demo1">
	<div class="sixteen wide column">
		<equipment-grid
			:rows="gridData"
			:columns="gridColumns.tableColumn"
			:filters="filters"
			:filters-check="checks"
			:filter-date="dateFilter"
			:count-post="countPost"
			@repair="setSelectedEquipments"
			@clear="clearDate"
			@request="setSelectedEquipment">
		</equipment-grid>
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
				<div class="field">
					<label>Дата следующей проверки (от)</label>
					<input type="date" v-model="dateFilter.start">
				</div>
				<div class="field">
					<label>Дата следующей проверки (по)</label>
					<input type="date" v-model="dateFilter.end">
				</div>
			</div>
		</div>
	</div>
	<div id="modalRepair" class="ui tiny card modal">
		<div class="content">
			<div class="content header">Формирование заявки на ремонт</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Описание проблемы</label>
					<textarea cols="30" rows="2" v-model="repair.description"></textarea>
				</div>
				<div class="field">
					<label>Дата заявки</label>
					<input type="date" v-model="repair.date" readonly>
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="appendRepair()">Отправить</button>
			<button class="ui deny orange button">Отмена</button>
		</div>
	</div>
	<div id="modalProtocol" class="ui tiny card modal">
		<div class="content">
			<div class="content header">ПТС</div>
		</div>
		<div class="content">
			<div class="ui form">
				<div class="field">
					<label>Дата проведения</label>
					<input type="date" v-model="dateProtocol">
				</div>
			</div>
		</div>
		<div class="actions">
			<button class="ui approve green button" v-on:click="printProtocol()">Сформировать</button>
		</div>
	</div>
</div>
<template id="equipment-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					Оборудование
					<div class="ui blue right floated icon top left mini pointing dropdown button">
						<i class="icon print"></i>
						<i class="icon dropdown"></i>
						<div class="menu">
							<div class="item">
								Этикетка
								<div class="menu">
									<div class="item" v-on:click="GetSticker('large')">Большая</div>
									<div class="item" v-on:click="GetSticker('middle')">Средняя</div>
									<div class="item" v-on:click="GetSticker('tiny')">Маленькая</div>
								</div>
							</div>
							<div class="item" v-on:click="GetCard()">Регистрационная карта</div>
							<div class="item" v-on:click="printTable()">Таблица проверок</div>
							<div class="item" v-on:click="showModal('Protocol')">ПТС</div>
						</div>
					</div>
					<button class="ui green right floated mini icon button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
					<button class="ui teal right floated mini icon button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
				</th>
			</tr>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui form"><div class="field"><input type="text" placeholder="Поиск" v-model="filterKey"></div></div>
				</th>
			</tr>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_archive">
						<label>Архив</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_working">
						<label>Используется</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_conservation">
						<label>Консервация</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_repair">
						<label>Ремонт</label>
					</div>
					<div class="ui checkbox">
						<input type="checkbox" v-model="filtersCheck.is_check">
						<label>ЦСМ</label>
					</div>
				</th>
			</tr>
			<tr>
				<th class="collapsing">
					<div class="ui checkbox">
						<input type="checkbox" v-model="selectAllMaterials" v-on:click="select()">
						<label></label>
					</div>
				</th>
				<th v-for="key in columns" @click="sortBy(Object.keys(key)[0])">
					{{ Object.values(key)[0] }}
					<i :class="{'icon caret up': (sortColumns[Object.keys(key)[0]] > 0) && Object.keys(key)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(key)[0]] < 0) && Object.keys(key)[0] === sortKey}"></i>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="equipment in paginateRows">
				<td class="collapsing">
					<div class="ui checkbox">
						<input type="checkbox"
						v-bind:value="{id_equipment: equipment.id}" 
						v-model="selectedEquipments">
						<label></label>
					</div>
				</td>
				<td class="collapsing">{{ equipment.number_card }}</td>
				<td>{{ equipment.equipment }}</td>
				<td class="collapsing">{{ equipment.model }}</td>
				<td class="collapsing right aligned">{{ equipment.serial_number }}</td>
				<td class="collapsing">{{ today(equipment.date_current_check) }}</td>
				<td class="collapsing">{{ today(equipment.date_next_check) }}</td>
				<td class="collapsing">
					<a><span class="ui teal small circular label" v-show="equipment.is_archive">А</span></a>
					<a><span class="ui green small circular label" v-show="equipment.is_working">И</span></a>
					<a><span class="ui yellow small circular label" v-show="equipment.is_conservation">К</span></a>
					<a><span class="ui red small circular label" v-show="equipment.is_repair">Р</span></a>
					<a><span class="ui violet small circular label" v-show="equipment.is_check">Ц</span></a>
				</td>
				<td class="collapsing">
					<div class="ui icon left pointing dropdown mini button">
						<i class="settings icon"></i>
						<div class="menu">
							<!-- КОСТЫЛЬ v-bind:href="'details/' + equipment.id" --> 
							<a v-bind:href="'/equipment/details/' + equipment.id" class="item">Подробнее</a>
							<div class="item" v-on:click="showModal('Repair', equipment.id)">Ремонт</div>
						</div>
					</div>
					<!-- <button class="ui orange right floated mini icon button" v-on:click="showModal('Repair')"><i class="icon wrench"></i></button> -->
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