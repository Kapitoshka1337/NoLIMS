<?php 
    $this->registerJsFile('@web/assets/vendor/vue/vue.min.js'); 
    $this->registerJsFile('@web/assets/vendor/vue/axios.min.js');
    $this->registerJsFile('@web/assets/js/equipment/metrolog_plan.js');
?>
<div class="row" id="verification">
	<div class="column">
		<div id="modalFilter" class="ui tiny card modal">
			<div class="content">
				<div class="content header">{{NameObject}}</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field" v-for="key in $data[NameObject].gridColumns.filterColumn" v-show="$data[NameObject].filters.hasOwnProperty(Object.keys(key))">
						<label>{{ Object.values(key)[0] }}</label>
						<select multiple class="ui search dropdown" v-model="$data[NameObject].filters[Object.keys(key)]">
							<option v-for="col in returnUniq(Object.keys(key), NameObject)" v-bind:value="col">{{ col }}</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		<div id="modalFilterDate" class="ui tiny card modal">
			<div class="content">
				<div class="content header">{{NameObject}}</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field">
						<input type="date" v-model="filterDate.start">
					</div>
					<div class="field">
						<input type="date" v-model="filterDate.end">
					</div>
				</div>
			</div>
			<div class="actions">
				<button class="ui approve green button" v-on:click="getVer()">Сохранить</button>
				<button class="ui deny orange button">Отмена</button>
			</div>
		</div>
		<div id="modalCheckReq" class="ui large card modal">
			<div class="content">
				<div class="content header">Подготавливаемое оборудование на проверку</div>
			</div>
			<div class="scrolling content">
				<table class="ui compact selectable table">
					<thead>
						<tr>
							<th>Номер</th>
							<th>Оборудование</th>
							<th>Следующая</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
							<tr v-for="(equipment, k) in selectedEquipments">
								<td class="collapsing right aligned">{{ equipment.number }} / {{ equipment.id_department }} - {{ equipment.type }}</td>
								<td>{{ equipment.equipment }}</td>
								<td class="collapsing">{{ equipment.date_next_check }}</td>
								<td>
									<div class="ui small icon buttons">
										<button class="ui red button" type="button" v-on:click="deleteMaterial(k, equipment)"><i class="icon trash"></i></button>
									</div>
								</td>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="actions">
				<button class="ui approve green button" v-on:click="sendRequest()">Сформировать</button>
				<button class="ui deny orange button">Отмена</button>
			</div>
		</div>
		<div class="ui top attached tabular menu">
			<a class="item" data-tab="first" v-on:click="getPlanVerification('helpEq')">ВО</a>
			<a class="item" data-tab="second" v-on:click="getPlanVerification('testEq')">ИО</a>
			<a class="item" data-tab="third" v-on:click="getPlanVerification('measuringEq')">СИ</a>
			<a class="item" data-tab="four">ТО</a>
		</div>
		<div class="ui bottom attached tab segment" data-tab="first">
			<help-eq-grid
			:rows="helpEq.gridData"
			:columns="helpEq.gridColumns.tableColumn"
			:filters="helpEq.filters"
			:count-post="countPost"
			:name-object="NameObject"
			:filter-date="filterDate"
			@request="setSelectedEquipments"
			></help-eq-grid>
		</div>
		<div class="ui bottom attached tab segment" data-tab="second">
			<help-eq-grid
			:rows="testEq.gridData"
			:columns="testEq.gridColumns.tableColumn"
			:filters="testEq.filters"
			:count-post="countPost"
			:name-object="NameObject"
			:filter-date="filterDate"
			@request="setSelectedEquipments"
			></help-eq-grid>
		</div>
		<div class="ui bottom attached tab segment" data-tab="third">
			<help-eq-grid
			:rows="measuringEq.gridData"
			:columns="measuringEq.gridColumns.tableColumn"
			:filters="measuringEq.filters"
			:count-post="countPost"
			:filter-date="filterDate"
			:name-object="NameObject"
			@request="setSelectedEquipments"
			></help-eq-grid>
		</div>
		<div class="ui bottom attached tab segment" data-tab="four">
			<div class="ui top attached tabular menu">
				<a class="item" data-tab="five" v-on:click="getPlanVerification('maintenanceEqAppend')">Создание</a>
				<a class="item" data-tab="six" v-on:click="getPlanVerification('maintenanceEq')">План-график</a>
			</div>
			<div class="ui bottom attached tab segment" data-tab="five">
				<tree-item
				:rows="maintenanceEqAppend.gridData"
				:columns="maintenanceEqAppend.gridColumns.tableColumn"
				:filter-columns="maintenanceEqAppend.gridColumns.filterColumn"
				:filters="maintenanceEqAppend.filters"
				:count-post="countPost">
				</tree-item>
			</div>
			<div class="ui bottom attached tab segment" data-tab="six">
				<help-eq-grid
				:rows="maintenanceEq.gridData"
				:columns="maintenanceEq.gridColumns.tableColumn"
				:filters="maintenanceEq.filters"
				:count-post="countPost"
				:filter-date="filterDate"
				:name-object="NameObject"
				@request="setSelectedEquipments"
				></help-eq-grid>
			</div>
		</div>
	</div>
</div>
<template id="item-template">
	<div class="ui fluid card">
		<div class="content">
			<div class="ui form">
				<div class="two fields">
					<div class="field" v-for="key in filterColumns" v-show="filters.hasOwnProperty(Object.keys(key))">
						<label>{{ Object.values(key)[0] }}</label>
						<select multiple class="ui fluid search dropdown" v-model="filters[Object.keys(key)]">
							<option v-for="col in returnUniq(Object.keys(key))" v-bind:value="col">{{ col }}</option>
						</select>
					</div>
					
				</div>
			</div>
		</div>
		<div class="content">
			<table class="ui compact selectable table">
				<thead>
					<tr>
						<th v-bind:colspan="columns.length + 1">
							<button class="ui green right floated mini icon button" v-on:click="saveMaintenance()"><i class="icon check"></i></button>
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
								v-bind:value="{id_equipment: equipment.id_equipment, id_work: equipment.id_work, date_maintenance: equipment.date_maintenance}" v-model="selectedEquipments">
								<label></label>
							</div>
						</td>
						<td>{{equipment.executor}}</td>
						<td>{{equipment.maintenance}}</td>
						<td>{{equipment.equipment}}</td>
						<td>{{today(equipment.date_next_check)}}</td>
						<td>
							<!-- {{equipment[Object.keys(key)[0]]}} -->
							<div class="ui form">
								<div class="field">
									<input type="date" v-model="equipment.date_maintenance">
								</div>
							</div>
						</td>
<!-- 						<td>
							<button class="ui green right floated mini icon button"><i class="icon check"></i></button>
						</td> -->
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
		</div>
	</div>
</template>
<template id="help-eq-grid">
	<table class="ui compact selectable table">
		<thead>
			<tr>
				<th v-bind:colspan="columns.length + 1">
					<button v-show="NameObject === 'measuringEq'" class="ui violet right floated mini icon button" v-on:click="showModal('CheckReq')"><i class="icon calendar check outline"></i></button>
                    <button class="ui blue right floated mini icon button" v-on:click="printTable()"><i class="icon print"></i></button>
					<button class="ui orange right floated mini icon button" v-on:click="showModal('FilterDate')"><i class="icon calendar check outline"></i></button>
					<button class="ui green right floated mini icon button" v-on:click="clearFilter()"><i class="icon undo"></i></button>
					<button class="ui teal right floated mini icon button" v-on:click="showModal('Filter')"><i class="icon filter"></i></button>
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
						v-bind:value="{id_equipment: equipment.id, number: equipment.number, id_department: equipment.id_department, type: equipment.type, date_next_check: equipment.date_next_check, equipment: equipment.equipment}" v-model="selectedEquipments">
						<label></label>
					</div>
				</td>
				<td v-for="key in columns">
					{{equipment[Object.keys(key)[0]]}}
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